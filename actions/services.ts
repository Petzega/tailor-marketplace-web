"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { currentUser, auth } from "@clerk/nextjs/server";
import { z } from "zod";

// ============================================================================
// ESQUEMAS (ZOD)
// ============================================================================
const serviceStatusSchema = z.enum(["PENDING", "FITTING", "READY", "DELIVERED"]);

const saveServiceSchema = z.object({
    id: z.string().optional(),
    customerId: z.string().min(1, "El ID del cliente es obligatorio"),
    serviceType: z.string().min(1, "El tipo de servicio es obligatorio"),
    description: z.string().min(1),
    serviceNotes: z.string().optional().nullable(),
    price: z.coerce.number().nonnegative(),
    deposit: z.coerce.number().nonnegative(),
    fittingDate: z.string().optional().nullable(),
    deliveryDate: z.string().optional().nullable(),
    updatedMeasurements: z.string().optional().nullable(),
});

// ============================================================================
// MIDDLEWARE AUTENTICACIÓN Y EXTRACCIÓN DE USUARIO (Para la Auditoría)
// ============================================================================
async function requireAdminAuthWithUser() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Acceso denegado: No autenticado en la capa de red.");
    }

    const user = await currentUser();

    // 1. Verificamos que esté logueado
    if (!user) {
        throw new Error("Acceso denegado: No autenticado.");
    }

    // 2. Verificamos explícitamente que su correo esté en la lista de administradores
    const allowedEmails = process.env.ADMIN_EMAILS?.split(",") || [];
    const isAuthorized = user.emailAddresses.some(
        (email) => allowedEmails.includes(email.emailAddress)
    );

    if (!isAuthorized) {
        throw new Error("Acceso denegado: Operación restringida solo para administradores.");
    }

    return {
        userId: user.id,
        userEmail: user.emailAddresses[0]?.emailAddress || "correo_desconocido"
    };
}

// ============================================================================
// LECTURA
// ============================================================================
export async function getKanbanServices() {
    try {
        await requireAdminAuthWithUser();

        const services = await db.service.findMany({
            include: {
                customer: { select: { name: true, phone: true, measurements: true } }
            },
            orderBy: { deliveryDate: 'asc' }
        });

        return { success: true, services };
    } catch (error) {
        console.error("Error obteniendo servicios de sastrería:", error);
        return { success: false, services: [], error: "No autorizado" };
    }
}

// ============================================================================
// ESCRITURA CON TRANSACCIONES Y LOGS DE AUDITORÍA
// ============================================================================
export async function updateServiceStatus(id: string, rawStatus: unknown) {
    try {
        const adminUser = await requireAdminAuthWithUser();

        const validation = serviceStatusSchema.safeParse(rawStatus);
        if (!validation.success) return { success: false, error: "Estado inválido." };
        const newStatus = validation.data;

        await db.$transaction(async (tx) => {
            const service = await tx.service.findUnique({
                where: { id },
                select: { balance: true, status: true }
            });

            if (!service) throw new Error("El servicio no existe.");

            if (newStatus === "DELIVERED" && service.balance > 0) {
                throw new Error(`Acción bloqueada: El cliente tiene un saldo pendiente de S/ ${service.balance}. Regularice el pago antes de marcar como Entregado.`);
            }

            // Si el estado es el mismo, no hacemos nada para evitar spam en los logs
            if (service.status === newStatus) return;

            // 1. Actualizamos el servicio
            await tx.service.update({
                where: { id },
                data: { status: newStatus }
            });

            // 2. Registramos la auditoría
            await tx.auditLog.create({
                data: {
                    userId: adminUser.userId,
                    userEmail: adminUser.userEmail,
                    action: "UPDATE_STATUS",
                    entityType: "SERVICE",
                    entityId: id,
                    details: `Cambió estado de ${service.status} a ${newStatus}`
                }
            });
        });

        revalidatePath("/ame-studio-ops/services");
        return { success: true };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
    }
}

async function generateTicketId() {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Lima" }));
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const datePrefix = `TK-${year}${month}${day}`;

    const lastService = await db.service.findFirst({
        where: { id: { startsWith: datePrefix } },
        orderBy: { id: 'desc' }
    });

    let nextSequence = 1;
    if (lastService) {
        const lastSequence = parseInt(lastService.id.slice(-3), 10);
        if (!isNaN(lastSequence)) nextSequence = lastSequence + 1;
    }

    return `${datePrefix}${nextSequence.toString().padStart(3, '0')}`;
}

export async function saveService(rawData: unknown) {
    try {
        const adminUser = await requireAdminAuthWithUser();

        const validation = saveServiceSchema.safeParse(rawData);
        if (!validation.success) return { success: false, error: "Datos de servicio inválidos." };
        const data = validation.data;

        const balance = data.price - data.deposit;
        if (balance < 0) return { success: false, error: "El adelanto no puede ser mayor al precio total." };

        await db.$transaction(async (tx) => {
            if (data.updatedMeasurements) {
                await tx.customer.update({
                    where: { id: data.customerId },
                    data: { measurements: data.updatedMeasurements }
                });
            }

            const serviceData = {
                customerId: data.customerId,
                serviceType: data.serviceType,
                description: data.description,
                serviceNotes: data.serviceNotes || null,
                price: data.price,
                deposit: data.deposit,
                balance: balance,
                fittingDate: data.fittingDate ? new Date(`${data.fittingDate}T12:00:00Z`) : null,
                deliveryDate: data.deliveryDate ? new Date(`${data.deliveryDate}T12:00:00Z`) : null,
            };

            let serviceId = data.id;

            if (serviceId) {
                await tx.service.update({ where: { id: serviceId }, data: serviceData });

                // Auditoría de edición
                await tx.auditLog.create({
                    data: {
                        userId: adminUser.userId,
                        userEmail: adminUser.userEmail,
                        action: "UPDATE_SERVICE",
                        entityType: "SERVICE",
                        entityId: serviceId,
                        details: `Actualizó presupuesto y/o fechas del servicio.`
                    }
                });
            } else {
                serviceId = await generateTicketId();
                await tx.service.create({
                    data: {
                        id: serviceId,
                        status: "PENDING",
                        ...serviceData
                    }
                });

                // Auditoría de creación
                await tx.auditLog.create({
                    data: {
                        userId: adminUser.userId,
                        userEmail: adminUser.userEmail,
                        action: "CREATE_SERVICE",
                        entityType: "SERVICE",
                        entityId: serviceId,
                        details: `Creó un nuevo servicio de sastrería (${data.serviceType}).`
                    }
                });
            }
        });

        revalidatePath("/ame-studio-ops/services");
        revalidatePath("/ame-studio-ops/customers");

        return { success: true };
    } catch (error) {
        console.error("Error guardando el servicio:", error);
        return { success: false, error: error instanceof Error ? error.message : "Error interno al guardar el trabajo de sastrería." };
    }
}
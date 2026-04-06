"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
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
    // Manejo de fechas seguro
    fittingDate: z.string().optional().nullable(),
    deliveryDate: z.string().optional().nullable(),

    // Opcional: Si tomamos nuevas medidas al crear el servicio
    updatedMeasurements: z.string().optional().nullable(),
});

async function requireAdminAuth() {
    const { userId } = await auth();
    if (!userId) throw new Error("Acceso denegado: Se requieren permisos de administrador.");
    return userId;
}

// ============================================================================
// LECTURA
// ============================================================================
export async function getKanbanServices() {
    try {
        await requireAdminAuth();

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
// ESCRITURA CON TRANSACCIONES Y VALIDACIÓN DE NEGOCIO
// ============================================================================
export async function updateServiceStatus(id: string, rawStatus: unknown) {
    try {
        await requireAdminAuth();

        const validation = serviceStatusSchema.safeParse(rawStatus);
        if (!validation.success) return { success: false, error: "Estado inválido." };
        const newStatus = validation.data;

        // FASE 2: TRANSACCIÓN Y REGLAS DE NEGOCIO
        // Usamos $transaction para asegurar que leemos el saldo real y actualizamos atómicamente.
        await db.$transaction(async (tx) => {
            const service = await tx.service.findUnique({
                where: { id },
                select: { balance: true }
            });

            if (!service) throw new Error("El servicio no existe.");

            // REGLA CRÍTICA: No se puede entregar la prenda si hay saldo pendiente
            if (newStatus === "DELIVERED" && service.balance > 0) {
                throw new Error(`Acción bloqueada: El cliente tiene un saldo pendiente de S/ ${service.balance}. Regularice el pago antes de marcar como Entregado.`);
            }

            await tx.service.update({
                where: { id },
                data: { status: newStatus }
            });
        });

        revalidatePath("/ame-studio-ops/services");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function saveService(rawData: unknown) {
    try {
        await requireAdminAuth();

        const validation = saveServiceSchema.safeParse(rawData);
        if (!validation.success) return { success: false, error: "Datos de servicio inválidos." };
        const data = validation.data;

        // Regla Financiera: El balance se calcula SIEMPRE en el servidor
        const balance = data.price - data.deposit;
        if (balance < 0) {
            return { success: false, error: "El adelanto (deposit) no puede ser mayor al precio total." };
        }

        // FASE 2: TRANSACCIÓN MÚLTIPLE (Servicio + Cliente)
        await db.$transaction(async (tx) => {
            // 1. Si el sastre anotó nuevas medidas, actualizamos el perfil del cliente primero
            if (data.updatedMeasurements) {
                await tx.customer.update({
                    where: { id: data.customerId },
                    data: { measurements: data.updatedMeasurements }
                });
            }

            // 2. Guardamos o actualizamos el servicio
            const serviceData = {
                customerId: data.customerId,
                serviceType: data.serviceType,
                description: data.description,
                serviceNotes: data.serviceNotes || null,
                price: data.price,
                deposit: data.deposit,
                balance: balance, // Guardamos el valor calculado por el servidor
                fittingDate: data.fittingDate ? new Date(data.fittingDate) : null,
                deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
            };

            if (data.id) {
                await tx.service.update({
                    where: { id: data.id },
                    data: serviceData
                });
            } else {
                // Función hipotética que tenías para generar tu ID personalizado
                const newTicketId = `TK-${Date.now()}`; // Reemplaza con tu lógica real de generateTicketId()

                await tx.service.create({
                    data: {
                        id: newTicketId,
                        status: "PENDING",
                        ...serviceData
                    }
                });
            }
        });

        revalidatePath("/ame-studio-ops/services");
        revalidatePath("/ame-studio-ops/customers");

        return { success: true };
    } catch (error: any) {
        console.error("Error guardando el servicio:", error);
        return { success: false, error: error.message || "Error interno al guardar el trabajo de sastrería." };
    }
}
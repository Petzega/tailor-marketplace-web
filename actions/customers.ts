"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { currentUser, auth } from "@clerk/nextjs/server";
import { z } from "zod";

// ============================================================================
// MIDDLEWARE DE AUTENTICACIÓN ADMIN
// ============================================================================
async function requireAdminAuthWithUser() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Acceso denegado: No autenticado en la capa de red.");
    }

    const user = await currentUser();

    if (!user) {
        throw new Error("Acceso denegado: No autenticado.");
    }

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
// ESQUEMAS DE VALIDACIÓN (ZOD) - NUEVO
// ============================================================================
const customerSchema = z.object({
    id: z.string().optional(),
    docType: z.string().min(1, "El tipo de documento es requerido"),
    documentNumber: z.string().min(1, "El número de documento es requerido"),
    name: z.string().min(1, "El nombre es requerido"),
    phone: z.string().optional(),
    address: z.string().optional(),
    measurements: z.string().optional(),
    notes: z.string().optional(),
});

// ============================================================================
// MÉTODOS PRIVADOS
// ============================================================================
export async function getCustomers(page: number = 1, limit: number = 10, query?: string) {
    await requireAdminAuthWithUser();
    const skip = (page - 1) * limit;

    const whereClause = query ? {
        OR: [
            { documentNumber: { contains: query } },
            { name: { contains: query } },
            { phone: { contains: query } }
        ]
    } : {};

    try {
        const [customers, total] = await Promise.all([
            db.customer.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    _count: {
                        select: { orders: true, services: true }
                    }
                }
            }),
            db.customer.count({ where: whereClause })
        ]);

        return {
            customers,
            total,
            totalPages: Math.ceil(total / limit)
        };
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        return { customers: [], total: 0, totalPages: 0 };
    }
}

export async function getCustomerById(id: string) {
    try {
        await requireAdminAuthWithUser();
        const customer = await db.customer.findUnique({
            where: { id },
            include: {
                orders: {
                    orderBy: { createdAt: 'desc' }
                },
                services: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        return customer;
    } catch (error) {
        console.error("Error al obtener cliente por ID:", error);
        return null;
    }
}

export async function saveCustomer(rawData: unknown) {
    try {
        await requireAdminAuthWithUser();

        // Validación estricta con Zod
        const validation = customerSchema.safeParse(rawData);
        if (!validation.success) {
            return { success: false, error: "Datos de cliente inválidos o corrompidos." };
        }
        const data = validation.data;

        if (data.id) {
            await db.customer.update({
                where: { id: data.id },
                data
            });
        } else {
            await db.customer.create({
                data
            });
        }

        revalidatePath("/ame-studio-ops/customers");
        return { success: true };

    } catch (error: unknown) {
        if (typeof error === 'object' && error !== null && 'code' in error && (error as {code: string}).code === 'P2002') {
            return { success: false, error: "Este número de documento ya está registrado." };
        }
        console.error("Error guardando cliente:", error);
        return { success: false, error: "Error interno al guardar el cliente." };
    }
}
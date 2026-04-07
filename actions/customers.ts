"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import {currentUser} from "@clerk/nextjs/server";

async function requireAdminAuthWithUser() {
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

export async function getCustomers(page: number = 1, limit: number = 10, query?: string) {
    await requireAdminAuthWithUser();
    const skip = (page - 1) * limit;

    // Búsqueda por DNI/RUC, Nombre o Teléfono
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
                    // Traemos el conteo de sus transacciones para mostrarlo en la tabla
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
                // Traemos todas sus órdenes ordenadas por la más reciente
                orders: {
                    orderBy: { createdAt: 'desc' }
                },
                // Traemos todos sus servicios de sastrería
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

export async function saveCustomer(data: {
    id?: string;
    docType: string;
    documentNumber: string;
    name: string;
    phone?: string;
    address?: string;
    measurements?: string;
    notes?: string;
}) {
    try {
        await requireAdminAuthWithUser();
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

        // Refrescamos la página de clientes para que aparezca el cambio
        revalidatePath("/ame-studio-ops/customers");
        return { success: true };

    } catch (error: unknown) {
        // Código de Prisma P2002: Violación de restricción única (Unique constraint)
        if (typeof error === 'object' && error !== null && 'code' in error && (error as {code: string}).code === 'P2002') {
            return { success: false, error: "Este número de documento ya está registrado." };
        }
        console.error("Error guardando cliente:", error);
        return { success: false, error: "Error interno al guardar el cliente." };
    }
}
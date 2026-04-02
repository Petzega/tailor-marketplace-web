"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

// ============================================================================
// 1. ESQUEMAS DE VALIDACIÓN (ZOD)
// ============================================================================

const orderItemSchema = z.object({
    id: z.string().min(1, "El ID del producto es requerido"),
    quantity: z.number().int().positive("La cantidad debe ser mayor a 0"),
    price: z.number().nonnegative("El precio no puede ser negativo"),
    size: z.string().optional(),
});

const createOrderSchema = z.object({
    customerData: z.object({
        name: z.string().min(1, "El nombre es requerido").max(100),
        docType: z.string().min(1, "El tipo de documento es requerido"),
        documentNumber: z.string().min(1, "El número de documento es requerido"),
        phone: z.string().min(1, "El teléfono es requerido"),
        address: z.string().optional(),
        reference: z.string().optional(),
    }),
    items: z.array(orderItemSchema).min(1, "La orden debe contener al menos un producto"),
    deliveryMethod: z.string().min(1),
    paymentMethod: z.string().min(1),
    subtotal: z.number().nonnegative(),
    deliveryCost: z.number().nonnegative(),
    finalTotal: z.number().nonnegative(),
});

const updateStatusSchema = z.object({
    orderId: z.string().min(1),
    newStatus: z.string().min(1), // Opcional: Cambiar a z.enum(['PENDING', 'COMPLETED', ...]) si tienes estados fijos
});

// ============================================================================
// 2. MIDDLEWARE DE AUTENTICACIÓN PARA ADMIN (SERVER SIDE)
// ============================================================================

/**
 * Valida que la acción provenga de un usuario autenticado.
 * NOTA: Debes ajustar esta función si usas Roles (ej. metadata.role === 'admin') en Clerk.
 */
async function requireAdminAuth() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Acceso denegado: Se requieren permisos de administrador.");
    }
    return userId;
}

// ============================================================================
// 3. SERVER ACTIONS - PÚBLICOS (E-COMMERCE)
// ============================================================================

export async function createOrder(rawData: unknown) {
    try {
        // 1. Validación estricta en tiempo de ejecución
        const validation = createOrderSchema.safeParse(rawData);
        if (!validation.success) {
            return { success: false, error: "Datos de orden inválidos o corrompidos.", details: validation.error.flatten() };
        }
        const data = validation.data;

        // 2. Generación de ID y Lógica de negocio
        const now = new Date();
        const peruTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Lima" }));
        const year = peruTime.getFullYear().toString().slice(-2);
        const month = (peruTime.getMonth() + 1).toString().padStart(2, "0");
        const day = peruTime.getDate().toString().padStart(2, "0");
        const datePrefix = `${year}${month}${day}`;

        const lastOrder = await db.order.findFirst({
            where: { id: { startsWith: `ORD-${datePrefix}` } },
            orderBy: { id: 'desc' }
        });

        let sequence = 1;
        if (lastOrder) {
            const lastSequence = parseInt(lastOrder.id.slice(-3));
            if (!isNaN(lastSequence)) sequence = lastSequence + 1;
        }

        const shortId = `ORD-${datePrefix}${sequence.toString().padStart(3, "0")}`;

        const generateValidationCode = () => {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            let result = '';
            for (let i = 0; i < 6; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };

        let token = generateValidationCode();
        let isUnique = false;
        while (!isUnique) {
            const existingOrder = await db.order.findUnique({ where: { validationCode: token } });
            if (existingOrder) {
                token = generateValidationCode();
            } else {
                isUnique = true;
            }
        }

        // 3. Inserción Atómica (Prisma maneja inserts anidados como una transacción automática)
        const order = await db.order.create({
            data: {
                id: shortId,
                validationCode: token,
                customerDocType: data.customerData.docType,
                customerDocument: data.customerData.documentNumber,
                customerName: data.customerData.name,
                customerPhone: data.customerData.phone,
                address: data.customerData.address || null,
                reference: data.customerData.reference || null,
                deliveryMethod: data.deliveryMethod,
                paymentMethod: data.paymentMethod,
                subtotal: data.subtotal,
                deliveryCost: data.deliveryCost,
                total: data.finalTotal,
                items: {
                    create: data.items.map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                        size: item.size || null,
                    }))
                }
            }
        });

        return { success: true, orderId: order.id, token: order.validationCode };
    } catch (error) {
        console.error("Error al crear la orden:", error);
        return { success: false, error: "Fallo de servidor al procesar la orden." };
    }
}

// ============================================================================
// 4. SERVER ACTIONS - PRIVADOS (AME STUDIO OPS)
// ============================================================================

export async function getOrders(
    page: number = 1,
    limit: number = 10,
    query?: string,
    startDate?: string,
    endDate?: string,
    statuses?: string[]
) {
    try {
        await requireAdminAuth(); // 👈 Protección de endpoint

        const skip = (page - 1) * limit;
        type WhereClause = {
            OR?: Array<Record<string, { contains: string }>>;
            status?: { in: string[] };
            createdAt?: { gte?: Date; lte?: Date };
        };
        const whereClause: WhereClause = {};

        if (query) {
            whereClause.OR = [
                { id: { contains: query } },
                { customerDocument: { contains: query } },
                { customerPhone: { contains: query } },
                { customerName: { contains: query } }
            ];
        }

        if (statuses && statuses.length > 0) {
            whereClause.status = { in: statuses };
        }

        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) {
                whereClause.createdAt.gte = new Date(`${startDate}T00:00:00-05:00`);
            }
            if (endDate) {
                whereClause.createdAt.lte = new Date(`${endDate}T23:59:59-05:00`);
            }
        }

        const [orders, total] = await Promise.all([
            db.order.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: { items: { include: { product: true } } }
            }),
            db.order.count({ where: whereClause })
        ]);

        return { orders, total, totalPages: Math.ceil(total / limit) };
    } catch (error) {
        console.error("Error al obtener órdenes:", error);
        return { orders: [], total: 0, totalPages: 0, error: "No autorizado o error interno." };
    }
}

export async function getOrderStats() {
    try {
        await requireAdminAuth(); // 👈 Protección de endpoint

        const [total, pending, completed, revenueData] = await Promise.all([
            db.order.count(),
            db.order.count({ where: { status: 'PENDING' } }),
            db.order.count({ where: { status: 'COMPLETED' } }),
            db.order.aggregate({
                where: { status: { not: 'CANCELLED' } },
                _sum: { total: true }
            })
        ]);

        return {
            total,
            pending,
            completed,
            revenue: revenueData._sum.total || 0,
        };
    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        return { total: 0, pending: 0, completed: 0, revenue: 0, error: "No autorizado" };
    }
}

export async function getOrderById(id: string) {
    try {
        await requireAdminAuth(); // 👈 Protección de endpoint

        const order = await db.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });

        return order;
    } catch (error) {
        console.error("Error al obtener el detalle de la orden:", error);
        return null;
    }
}

export async function updateOrderStatus(rawData: { orderId: string; newStatus: string }) {
    try {
        await requireAdminAuth(); // 👈 Protección de endpoint

        // Validación de Payload
        const validation = updateStatusSchema.safeParse(rawData);
        if (!validation.success) {
            return { success: false, error: "Datos inválidos." };
        }

        const { orderId, newStatus } = validation.data;

        await db.order.update({
            where: { id: orderId },
            data: { status: newStatus }
        });

        revalidatePath('/ame-studio-ops/orders');
        revalidatePath(`/ame-studio-ops/orders/${orderId}`);

        return { success: true };
    } catch (error) {
        console.error("Error al actualizar el estado de la orden:", error);
        return { success: false, error: "No se pudo actualizar el estado o no tienes permisos." };
    }
}
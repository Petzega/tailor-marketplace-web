"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createOrderSchema, updateStatusSchema } from "@/lib/schemas";
import { generateValidationCode } from "@/lib/utils";
import { requireAdminAuth } from "@/lib/auth";

// ============================================================================
// 1. ESQUEMAS DE VALIDACIÓN (ZOD) - Importados de @/lib/schemas
// ============================================================================

// ============================================================================
// 2. SERVER ACTIONS - PÚBLICOS (E-COMMERCE)
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

        // 3. Verificar stock disponible dentro de transacción
        const order = await db.$transaction(async (tx) => {
            // Verificar stock para cada item
            for (const item of data.items) {
                if (item.size) {
                    const productSize = await tx.productSize.findUnique({
                        where: { productId_size: { productId: item.id, size: item.size } }
                    });
                    if (!productSize || productSize.stock < item.quantity) {
                        throw new Error(`Stock insuficiente para producto ${item.id} talla ${item.size}`);
                    }
                } else {
                    const product = await tx.product.findUnique({ where: { id: item.id } });
                    if (!product || product.stock < item.quantity) {
                        throw new Error(`Stock insuficiente para producto ${item.id}`);
                    }
                }
            }

            // Crear la orden
            const createdOrder = await tx.order.create({
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

            // Descontar stock
            for (const item of data.items) {
                if (item.size) {
                    await tx.productSize.update({
                        where: { productId_size: { productId: item.id, size: item.size } },
                        data: { stock: { decrement: item.quantity } }
                    });
                } else {
                    await tx.product.update({
                        where: { id: item.id },
                        data: { stock: { decrement: item.quantity } }
                    });
                }
            }

            return createdOrder;
        });

        // Notificar al vendedor por n8n (fire-and-forget)
        const n8nNewOrderWebhook = process.env.N8N_NEW_ORDER_WEBHOOK_URL;
        if (n8nNewOrderWebhook) {
            fetch(n8nNewOrderWebhook, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId: order.id,
                    customerName: order.customerName,
                    customerPhone: order.customerPhone,
                    total: order.total,
                    items: data.items.map(i => ({ id: i.id, quantity: i.quantity, price: i.price }))
                })
            }).catch(err => console.error("[n8n] Error notificando nueva orden:", err));
        }

        return { success: true, orderId: order.id, token: order.validationCode };
    } catch (error) {
        console.error("Error al crear la orden:", error);
        return { success: false, error: "Fallo de servidor al procesar la orden." };
    }
}

// ============================================================================
// 3. SERVER ACTIONS - PRIVADOS (AME STUDIO OPS)
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

        // 1. Obtener la orden ANTES de actualizar (para capturar previousStatus y datos del cliente)
        const currentOrder = await db.order.findUnique({
            where: { id: orderId },
            select: {
                status: true,
                customerPhone: true,
                customerName: true,
                total: true,
            }
        });

        if (!currentOrder) {
            return { success: false, error: "Orden no encontrada." };
        }

        // 2. Actualizar el estado en la BD
        await db.order.update({
            where: { id: orderId },
            data: { status: newStatus }
        });

        // 3. Notificar a n8n (WF3) para que avise al cliente por WhatsApp
        //    Fire-and-forget: no bloquea la respuesta al admin si falla
        const n8nWebhookUrl = process.env.N8N_ORDER_STATUS_WEBHOOK_URL;
        const webhookSecret = process.env.WEBHOOK_SECRET;

        if (n8nWebhookUrl && webhookSecret) {
            fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${webhookSecret}`,
                },
                body: JSON.stringify({
                    orderId,
                    newStatus,
                    previousStatus: currentOrder.status,
                    customerPhone: currentOrder.customerPhone,
                    customerName: currentOrder.customerName,
                    total: currentOrder.total,
                }),
            }).catch(err =>
                console.error('[WF3] Error al notificar cambio de estado a n8n:', err)
            );
        } else {
            console.warn('[WF3] N8N_ORDER_STATUS_WEBHOOK_URL o WEBHOOK_SECRET no configurados. Notificación WhatsApp omitida.');
        }

        revalidatePath('/ame-studio-ops/orders');
        revalidatePath(`/ame-studio-ops/orders/${orderId}`);

        return { success: true };
    } catch (error) {
        console.error("Error al actualizar el estado de la orden:", error);
        return { success: false, error: "No se pudo actualizar el estado o no tienes permisos." };
    }
}
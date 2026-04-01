"use server";

import { db } from "@/lib/db";
import {revalidatePath} from "next/cache";

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    size?: string;
}

interface CreateOrderData {
    customerData: {
        name: string;
        docType: string;        // 👈 Corregido
        documentNumber: string; // 👈 Corregido
        phone: string;
        address?: string;
        reference?: string;
    };
    items: OrderItem[];
    deliveryMethod: string;
    paymentMethod: string;
    subtotal: number;
    deliveryCost: number;
    finalTotal: number;
}

export async function createOrder(data: CreateOrderData) {
    try {
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

        const sequenceString = sequence.toString().padStart(3, "0");
        const shortId = `ORD-${datePrefix}${sequenceString}`;

        const generateValidationCode = () => {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            let result = '';
            for (let i = 0; i < 6; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };

        let token = generateValidationCode();

        // Verificación de colisión (Asegura que el código sea 100% único en la BD)
        let isUnique = false;
        while (!isUnique) {
            const existingOrder = await db.order.findUnique({ where: { validationCode: token } });
            if (existingOrder) {
                token = generateValidationCode();
            } else {
                isUnique = true;
            }
        }

        const order = await db.order.create({
            data: {
                id: shortId,
                validationCode: token,
                customerDocType: data.customerData.docType,       // 👈 Ahora sí se guarda en BD
                customerDocument: data.customerData.documentNumber, // 👈 Ahora sí se guarda en BD
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
                    create: data.items.map((item: OrderItem) => ({
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
        return { success: false, error: "No se pudo crear la orden en la base de datos." };
    }
}

export async function getOrders(
    page: number = 1,
    limit: number = 10,
    query?: string,
    startDate?: string,
    endDate?: string,
    statuses?: string[]
) {
    const skip = (page - 1) * limit;
    type WhereClause = {
        OR?: Array<Record<string, { contains: string }>>;
        status?: { in: string[] };
        createdAt?: { gte?: Date; lte?: Date };
    };
    const whereClause: WhereClause = {};

    // 1. Filtro de búsqueda por texto
    if (query) {
        whereClause.OR = [
            { id: { contains: query } },
            { customerDocument: { contains: query } },
            { customerPhone: { contains: query } },
            { customerName: { contains: query } }
        ];
    }

    // 2. Filtro de selección múltiple de Estados
    if (statuses && statuses.length > 0) {
        whereClause.status = { in: statuses };
    }

    // 3. Filtro de Rango de Fechas (Ajustado a la zona horaria de Perú -05:00)
    if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) {
            // Desde las 00:00:00 del día inicial
            whereClause.createdAt.gte = new Date(`${startDate}T00:00:00-05:00`);
        }
        if (endDate) {
            // Hasta las 23:59:59 del día final
            whereClause.createdAt.lte = new Date(`${endDate}T23:59:59-05:00`);
        }
    }

    try {
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
        return { orders: [], total: 0, totalPages: 0 };
    }
}

export async function getOrderStats() {
    try {
        const [total, pending, completed, revenueData] = await Promise.all([
            db.order.count(),
            db.order.count({ where: { status: 'PENDING' } }),
            db.order.count({ where: { status: 'COMPLETED' } }),
            db.order.aggregate({
                where: { status: { not: 'CANCELLED' } }, // No sumamos órdenes canceladas
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
        console.error("Error al obtener estadísticas de órdenes:", error);
        return { total: 0, pending: 0, completed: 0, revenue: 0 };
    }
}

export async function getOrderById(id: string) {
    try {
        const order = await db.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true // Traemos el nombre e imagen del producto
                    }
                }
            }
        });

        return order;
    } catch (error) {
        console.error("Error al obtener el detalle de la orden:", error);
        return null;
    }
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
        await db.order.update({
            where: { id: orderId },
            data: { status: newStatus }
        });

        // Forzamos la actualización de la caché en ambas vistas
        revalidatePath('/ame-studio-ops/orders');
        revalidatePath(`/ame-studio-ops/orders/${orderId}`);

        return { success: true };
    } catch (error) {
        console.error("Error al actualizar el estado de la orden:", error);
        return { success: false, error: "No se pudo actualizar el estado." };
    }
}
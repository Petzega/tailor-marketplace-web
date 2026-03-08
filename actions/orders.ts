"use server";

import { db } from "@/lib/db";

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    size?: string;
}

interface CreateOrderData {
    customerData: {
        name: string;
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
        // 1. Obtenemos la fecha actual ajustada a la hora de Perú
        const now = new Date();
        const peruTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Lima" }));

        const year = peruTime.getFullYear().toString().slice(-2); // "26"
        const month = (peruTime.getMonth() + 1).toString().padStart(2, "0"); // "03"
        const day = peruTime.getDate().toString().padStart(2, "0"); // "07"

        const datePrefix = `${year}${month}${day}`; // Resultado: "260307"

        // 2. Buscamos la última orden creada el día de HOY
        const lastOrder = await db.order.findFirst({
            where: {
                shortId: {
                    startsWith: `ORD-${datePrefix}`
                }
            },
            orderBy: {
                shortId: 'desc' // Ordenamos de mayor a menor para obtener el último número
            }
        });

        // 3. Calculamos el siguiente número de la cola
        let sequence = 1;
        if (lastOrder) {
            // Si ya hay ventas hoy, extraemos los últimos 3 dígitos y le sumamos 1
            const lastSequence = parseInt(lastOrder.shortId.slice(-3));
            if (!isNaN(lastSequence)) {
                sequence = lastSequence + 1;
            }
        }

        // 4. Formateamos a 3 dígitos (ej: 1 -> "001", 15 -> "015")
        const sequenceString = sequence.toString().padStart(3, "0");

        // 5. Unimos todo para el ID final
        const shortId = `ORD-${datePrefix}${sequenceString}`; // Resultado: "ORD-260307001"

        // Generamos el token de seguridad para el Enlace Mágico
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // Guardamos todo en la base de datos
        const order = await db.order.create({
            data: {
                shortId,
                token,
                customerName: data.customerData.name,
                customerPhone: data.customerData.phone,
                customerAddress: data.customerData.address || null,
                customerReference: data.customerData.reference || null,
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

        return { success: true, orderId: order.shortId, token: order.token };
    } catch (error) {
        console.error("Error al crear la orden:", error);
        return { success: false, error: "No se pudo crear la orden en la base de datos." };
    }
}
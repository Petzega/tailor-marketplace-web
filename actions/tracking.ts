"use server";

import { db } from "@/lib/db";

export async function getOrderByToken(shortId: string, token: string) {
    try {
        const order = await db.order.findFirst({
            where: {
                id: shortId,
                validationCode: token // Validamos que el token coincida para máxima seguridad
            },
            // Incluimos los items y la info básica del producto para mostrar la foto y el nombre
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                imageUrl: true
                            }
                        }
                    }
                }
            }
        });

        if (!order) {
            return { success: false, error: "Pedido no encontrado o enlace no válido." };
        }

        return { success: true, order };
    } catch (error) {
        console.error("Error al rastrear pedido:", error);
        return { success: false, error: "Error interno del servidor." };
    }
}
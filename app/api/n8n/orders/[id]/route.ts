import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const orderId = resolvedParams.id;

        // Buscamos la orden e incluimos el detalle de los items y el nombre del producto
        const order = await db.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: {
                            select: { name: true, sku: true }
                        }
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
        }

        // Devolvemos la orden con toda su estructura
        return NextResponse.json(order, { status: 200 });

    } catch (error) {
        console.error("Error obteniendo la orden para n8n:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
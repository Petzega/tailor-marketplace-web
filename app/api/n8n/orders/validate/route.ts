import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { documentNumber, validationCode } = body;

        // Validamos que n8n nos envíe ambos datos
        if (!documentNumber || !validationCode) {
            return NextResponse.json({ error: "Faltan parámetros de validación" }, { status: 400 });
        }

        // Buscamos la orden basándonos en el código de validación (que es @unique)
        const order = await db.order.findUnique({
            where: { validationCode },
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

        // Verificamos si la orden existe y si el documento coincide
        if (!order || order.customerDocument !== String(documentNumber).trim()) {
            return NextResponse.json({ error: "Documento o código validador incorrecto" }, { status: 401 });
        }

        // Si todo coincide, devolvemos la orden para que n8n le informe al usuario
        return NextResponse.json(order, { status: 200 });

    } catch (error) {
        console.error("Error validando la orden:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
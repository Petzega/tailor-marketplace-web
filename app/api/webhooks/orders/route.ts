import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

// Candado de seguridad: Solo quien tenga esta contraseña podrá cambiar estados
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "secreto-ame-n8n-2026";

export async function POST(req: Request) {
    try {
        // 1. Verificamos que el visitante tenga la llave correcta
        const authHeader = req.headers.get("authorization");
        if (authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
            return NextResponse.json({ error: "Acceso denegado. Token inválido." }, { status: 401 });
        }

        // 2. Leemos el mensaje que nos envía n8n
        const body = await req.json();
        const { orderId, newStatus } = body;

        // 3. Validamos que n8n nos haya mandado la información completa
        if (!orderId || !newStatus) {
            return NextResponse.json({ error: "Faltan datos obligatorios (orderId o newStatus)." }, { status: 400 });
        }

        // 4. Validamos que el estado exista en nuestro sistema
        const validStatuses = ["PENDING", "IN_PROCESS", "DELIVERED_STORE", "DELIVERED_DELIVERY", "CANCELLED"];
        if (!validStatuses.includes(newStatus)) {
            return NextResponse.json({ error: `El estado '${newStatus}' no es válido.` }, { status: 400 });
        }

        // 5. Actualizamos la orden en la Base de Datos
        const updatedOrder = await db.order.update({
            where: { shortId: orderId },
            data: { status: newStatus as OrderStatus } // Actualizamos el estado
        });

        // 6. Le avisamos a n8n que todo salió perfecto
        return NextResponse.json({
            success: true,
            message: `Orden ${orderId} actualizada correctamente a ${newStatus}`,
            order: updatedOrder
        });

    } catch (error) {
        console.error("Error en el Webhook de órdenes:", error);
        return NextResponse.json({ error: "Error interno en el servidor al actualizar la orden." }, { status: 500 });
    }
}
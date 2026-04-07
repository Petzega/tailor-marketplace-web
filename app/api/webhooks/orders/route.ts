import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    // Si el entorno se levanta sin la variable, el servidor aborta el webhook.
    // Es vital que esto esté DENTRO de la función para no romper el `npm run build` en integración continua (CI/CD) si no tienen el archivo .env cargado durante el build.
    if (!WEBHOOK_SECRET) {
        console.error("ERROR CRÍTICO: WEBHOOK_SECRET no está configurado en producción.");
        return NextResponse.json({ error: "Fallo de configuración interna." }, { status: 500 });
    }

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

        // 4. Mapear estados particulares de n8n a los estados unificados de la base de datos
        let mappedStatus = newStatus;
        if (newStatus === "IN_PROCESS") mappedStatus = "IN_PROGRESS";
        if (newStatus === "DELIVERED_STORE" || newStatus === "DELIVERED_DELIVERY") mappedStatus = "COMPLETED";

        const validNativeStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
        if (!validNativeStatuses.includes(mappedStatus)) {
            return NextResponse.json({ error: `El estado '${newStatus}' no es válido para asimilarse.` }, { status: 400 });
        }

        // 5. Actualizamos la orden en la Base de Datos con el estado mapeado
        const updatedOrder = await db.order.update({
            where: { id: orderId },
            data: { status: mappedStatus } // Actualizamos el estado
        });

        // 6. Le avisamos a n8n que todo salió perfecto
        return NextResponse.json({
            success: true,
            message: `Orden ${orderId} asimilada correctamente a ${mappedStatus} (desde ${newStatus})`,
            order: updatedOrder
        });

    } catch (error) {
        console.error("Error en el Webhook de órdenes:", error);
        return NextResponse.json({ error: "Error interno en el servidor al actualizar la orden." }, { status: 500 });
    }
}
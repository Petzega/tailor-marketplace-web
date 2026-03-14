import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const statusTraduccion: Record<string, string> = {
    PENDING: "Pendiente ⏳",
    IN_PROCESS: "En proceso ⚙️",
    DELIVERED_STORE: "Listo para recoger en tienda 🏬",
    DELIVERED_DELIVERY: "En camino por delivery 🚚",
    CANCELLED: "Cancelado ❌"
};

export async function GET(
    request: Request,
    { params }: { params: { documento: string } }
) {
    try {
        const { documento } = params;

        // Buscamos el último pedido asociado a ese documento
        const order = await db.order.findFirst({
            where: { customerDocument: documento },
            orderBy: { createdAt: 'desc' } // 👈 CRÍTICO: Trae la compra más reciente
        });

        if (!order) {
            return new NextResponse(JSON.stringify({ error: "Pedido no encontrado" }), { status: 404 });
        }

        return NextResponse.json({
            nombre_cliente: order.customerName,
            estado: statusTraduccion[order.status] || order.status
        });

    } catch (error) {
        console.error("[ORDER_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: orderId } = await params;
        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ error: "El campo status es requerido" }, { status: 400 });
        }

        // Validar que el estado sea uno de los permitidos
        const validStatuses = ["PENDING", "IN_PROGRESS", "CANCELLED", "COMPLETED"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: "Estado no válido" }, { status: 400 });
        }

        const updatedOrder = await db.order.update({
            where: { id: orderId },
            data: { status }
        });

        return NextResponse.json({
            success: true,
            id: updatedOrder.id,
            status: updatedOrder.status,
            validationCode: updatedOrder.validationCode
        }, { status: 200 });

    } catch (error: unknown) {
        console.error("Error actualizando estado de la orden:", error);
        // Manejar el caso donde la orden no existe en Prisma
        if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'P2025') {
            return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
        }
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
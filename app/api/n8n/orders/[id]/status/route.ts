// app/api/n8n/orders/[id]/status/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // FASE 1: PROTECCIÓN DEL WEBHOOK
        // Exige que N8N envíe un header: Authorization: Bearer <TU_CLAVE_SECRETA>
        const authHeader = request.headers.get("authorization");
        if (!authHeader || authHeader !== `Bearer ${process.env.N8N_WEBHOOK_SECRET}`) {
            return NextResponse.json({ error: "Acceso denegado. Credenciales inválidas." }, { status: 401 });
        }

        const resolvedParams = await params;
        const orderId = resolvedParams.id;
        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ error: "El campo status es requerido" }, { status: 400 });
        }

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
        if (typeof error === 'object' && error !== null && 'code' in error && (error as Record<string, unknown>).code === 'P2025') {
            return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
        }
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
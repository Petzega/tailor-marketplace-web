import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.N8N_WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 401 });
    }

    const resolvedParams = await params;
    const orderId = resolvedParams.id;
    const body = await request.json();
    const { reason = "Cancelado por cliente" } = body;

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    if (!["PENDING", "IN_PROGRESS"].includes(order.status)) {
      return NextResponse.json({
        error: "Solo se pueden cancelar órdenes en estado PENDING o IN_PROGRESS"
      }, { status: 400 });
    }

    await db.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" }
      });

      for (const item of order.items) {
        if (item.size) {
          await tx.productSize.update({
            where: { productId_size: { productId: item.productId, size: item.size } },
            data: { stock: { increment: item.quantity } }
          });
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } }
          });
        }
      }
    });

    return NextResponse.json({
      success: true,
      orderId,
      status: "CANCELLED",
      reason
    });
  } catch (error) {
    console.error("Error cancelando orden:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

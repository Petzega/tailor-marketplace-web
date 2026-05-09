import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
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
        const { action, sku, size, quantity } = body;

        if (!action || !['ADD', 'REMOVE'].includes(action) || !sku || !quantity) {
            return NextResponse.json({ error: "Parámetros incompletos o inválidos." }, { status: 400 });
        }

        const order = await db.order.findUnique({ where: { id: orderId } });
        if (!order) {
            return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
        }
        if (order.status !== "PENDING") {
            return NextResponse.json({ error: "Solo se pueden modificar órdenes en estado PENDING" }, { status: 400 });
        }

        const product = await db.product.findUnique({ where: { sku } });
        if (!product) {
            return NextResponse.json({ error: `No existe producto con SKU: ${sku}` }, { status: 404 });
        }

        const existingItem = await db.orderItem.findFirst({
            where: { orderId, productId: product.id, size: size || null }
        });

        await db.$transaction(async (tx) => {
            if (action === "ADD") {
                if (size) {
                    const productSize = await tx.productSize.findUnique({
                        where: { productId_size: { productId: product.id, size } }
                    });
                    if (!productSize || productSize.stock < quantity) {
                        throw new Error(`Stock insuficiente para ${product.name} talla ${size}`);
                    }
                    await tx.productSize.update({
                        where: { productId_size: { productId: product.id, size } },
                        data: { stock: { decrement: quantity } }
                    });
                } else {
                    if (product.stock < quantity) {
                        throw new Error(`Stock insuficiente para ${product.name}`);
                    }
                    await tx.product.update({
                        where: { id: product.id },
                        data: { stock: { decrement: quantity } }
                    });
                }

                if (existingItem) {
                    await tx.orderItem.update({
                        where: { id: existingItem.id },
                        data: { quantity: existingItem.quantity + quantity }
                    });
                } else {
                    await tx.orderItem.create({
                        data: {
                            orderId,
                            productId: product.id,
                            size: size || null,
                            quantity,
                            price: product.price
                        }
                    });
                }
            } else if (action === "REMOVE") {
                if (!existingItem) {
                    throw new Error("El producto no está en la orden");
                }

                const newQuantity = existingItem.quantity - quantity;
                if (newQuantity <= 0) {
                    await tx.orderItem.delete({ where: { id: existingItem.id } });
                } else {
                    await tx.orderItem.update({
                        where: { id: existingItem.id },
                        data: { quantity: newQuantity }
                    });
                }

                if (size) {
                    await tx.productSize.update({
                        where: { productId_size: { productId: product.id, size } },
                        data: { stock: { increment: quantity } }
                    });
                } else {
                    await tx.product.update({
                        where: { id: product.id },
                        data: { stock: { increment: quantity } }
                    });
                }
            }

            const updatedItems = await tx.orderItem.findMany({ where: { orderId } });
            const newSubtotal = updatedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            const newTotal = newSubtotal + order.deliveryCost;

            await tx.order.update({
                where: { id: orderId },
                data: { subtotal: newSubtotal, total: newTotal }
            });
        });

        const updatedItems = await db.orderItem.findMany({
            where: { orderId },
            include: { product: { select: { name: true, sku: true } } }
        });
        const newSubtotal = updatedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const newTotal = newSubtotal + order.deliveryCost;

        return NextResponse.json({
            success: true,
            message: "Orden actualizada correctamente",
            newSubtotal,
            newTotal,
            items: updatedItems
        }, { status: 200 });

    } catch (error) {
        console.error("Error modificando items de la orden:", error);
        if (error instanceof Error && error.message.startsWith("Stock insuficiente")) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        if (error instanceof Error && error.message === "El producto no está en la orden") {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}

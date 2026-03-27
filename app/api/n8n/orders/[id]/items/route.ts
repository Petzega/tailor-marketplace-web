import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: orderId } = await params;
        const body = await request.json();
        const { action, productId, size, quantity } = body;

        // 1. Validaciones básicas
        if (!action || !['ADD', 'REMOVE'].includes(action) || !productId || !quantity) {
            return NextResponse.json({ error: "Parámetros incompletos o inválidos" }, { status: 400 });
        }

        // 2. Verificar que la orden exista y esté en PENDING
        const order = await db.order.findUnique({ where: { id: orderId } });
        if (!order) {
            return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
        }
        if (order.status !== "PENDING") {
            return NextResponse.json({ error: "Solo se pueden modificar órdenes en estado PENDING" }, { status: 400 });
        }

        // 3. Buscar si el item ya existe en la orden actual (mismo producto y misma talla)
        const existingItem = await db.orderItem.findFirst({
            where: {
                orderId: orderId,
                productId: productId,
                size: size || null
            }
        });

        if (action === "ADD") {
            // Obtener el precio actual del catálogo para congelarlo
            const product = await db.product.findUnique({ where: { id: productId } });
            if (!product) return NextResponse.json({ error: "Producto no existe en el catálogo" }, { status: 404 });

            if (existingItem) {
                // Si ya existe, sumamos la cantidad
                await db.orderItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: existingItem.quantity + quantity }
                });
            } else {
                // Si no existe, lo creamos
                await db.orderItem.create({
                    data: {
                        orderId,
                        productId,
                        size: size || null,
                        quantity,
                        price: product.price // Congelamos el precio actual
                    }
                });
            }
        } else if (action === "REMOVE") {
            if (!existingItem) {
                return NextResponse.json({ error: "El producto no está en la orden" }, { status: 404 });
            }

            const newQuantity = existingItem.quantity - quantity;
            if (newQuantity <= 0) {
                // Si la cantidad llega a 0 o menos, eliminamos el item de la orden
                await db.orderItem.delete({ where: { id: existingItem.id } });
            } else {
                // Si aún queda, solo restamos
                await db.orderItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: newQuantity }
                });
            }
        }

        // 4. RECALCULAR TOTALES DE LA ORDEN
        // Obtenemos todos los items actualizados de la orden
        const updatedItems = await db.orderItem.findMany({
            where: { orderId },
            include: { product: { select: { name: true, sku: true } } }
        });

        // Sumatoria: (precio * cantidad) de cada item
        const newSubtotal = updatedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const newTotal = newSubtotal + order.deliveryCost;

        // Actualizamos la orden maestra con los nuevos cálculos
        await db.order.update({
            where: { id: orderId },
            data: { subtotal: newSubtotal, total: newTotal }
        });

        // 5. Retornar la respuesta según la especificación
        return NextResponse.json({
            success: true,
            message: "Orden actualizada correctamente",
            newSubtotal,
            newTotal,
            items: updatedItems
        }, { status: 200 });

    } catch (error) {
        console.error("Error modificando items de la orden:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
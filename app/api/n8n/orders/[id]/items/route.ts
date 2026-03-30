import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // 1. Tipamos params como Promise
) {
    try {
        // 2. Esperamos a que la promesa se resuelva antes de extraer el ID
        const resolvedParams = await params;
        const orderId = resolvedParams.id;

        const body = await request.json();

        // Cambiamos productId por sku
        const { action, sku, size, quantity } = body;

        // 1. Validaciones básicas
        if (!action || !['ADD', 'REMOVE'].includes(action) || !sku || !quantity) {
            return NextResponse.json({ error: "Parámetros incompletos o inválidos. Se requiere action, sku y quantity." }, { status: 400 });
        }

        // 2. Verificar que la orden exista y esté en PENDING
        const order = await db.order.findUnique({ where: { id: orderId } });
        if (!order) {
            return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
        }
        if (order.status !== "PENDING") {
            return NextResponse.json({ error: "Solo se pueden modificar órdenes en estado PENDING" }, { status: 400 });
        }

        // 3. Buscar el producto por su SKU (Paso crucial para la nueva lógica)
        const product = await db.product.findUnique({ where: { sku } });
        if (!product) {
            return NextResponse.json({ error: `No existe ningún producto con el SKU: ${sku}` }, { status: 404 });
        }

        // 4. Buscar si el item ya existe en la orden actual usando el ID interno del producto resuelto
        const existingItem = await db.orderItem.findFirst({
            where: {
                orderId: orderId,
                productId: product.id, // Relación interna de BD sigue usando el ID
                size: size || null
            }
        });

        if (action === "ADD") {
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
                        productId: product.id,
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

        // 5. RECALCULAR TOTALES DE LA ORDEN
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
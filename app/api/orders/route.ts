import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";

function generateValidationCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Generador de ID con formato ORD-YYMMDDXXX
async function generateOrderId(): Promise<string> {
    const limaTime = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Lima" }));
    const yy = limaTime.getFullYear().toString().slice(-2);
    const mm = (limaTime.getMonth() + 1).toString().padStart(2, '0');
    const dd = limaTime.getDate().toString().padStart(2, '0');
    const prefix = `ORD-${yy}${mm}${dd}`;

    const lastOrder = await prisma.order.findFirst({
        where: {
            id: { startsWith: prefix }
        },
        orderBy: { id: 'desc' }
    });

    let sequence = 1;
    if (lastOrder) {
        const lastSequence = parseInt(lastOrder.id.slice(-3));
        if (!isNaN(lastSequence)) {
            sequence = lastSequence + 1;
        }
    }

    return `${prefix}${sequence.toString().padStart(3, '0')}`;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customerData, items, deliveryMethod, paymentMethod } = body;

        // Validaciones de entrada
        if (!items || items.length === 0) {
            return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
        }
        if (!customerData || !customerData.documentNumber || !customerData.name) {
            return NextResponse.json({ error: "Faltan datos del cliente" }, { status: 400 });
        }

        // Obtener productos reales de la base de datos
        const productIds = items.map((item: { id: string }) => item.id);
        const dbProducts = await prisma.product.findMany({
            where: { id: { in: productIds } },
        });

        // Recalcular montos
        let calculatedSubtotal = 0;
        const orderItemsData = items.map((cartItem: { id: string; quantity: number; size?: string }) => {
            const product = dbProducts.find((p) => p.id === cartItem.id);
            if (!product) throw new Error(`Producto no encontrado: ${cartItem.id}`);

            const itemTotal = product.price * cartItem.quantity;
            calculatedSubtotal += itemTotal;

            return {
                productId: product.id,
                quantity: cartItem.quantity,
                price: product.price,
                size: cartItem.size || null,
            };
        });

        const deliveryCost = deliveryMethod === "DELIVERY" ? 10.00 : 0;
        const calculatedTotal = calculatedSubtotal + deliveryCost;

        // Generar código validador único
        let validationCode = '';
        let isUnique = false;

        while (!isUnique) {
            validationCode = generateValidationCode();
            const existing = await prisma.order.findUnique({ where: { validationCode } });
            if (!existing) isUnique = true;
        }

        // Generar el ID personalizado
        const newOrderId = await generateOrderId();

        // Insertar orden y detalles
        const newOrder = await prisma.order.create({
            data: {
                id: newOrderId, // Inyección del ID calculado
                status: "PENDING",
                validationCode,
                customerName: customerData.name,
                customerPhone: customerData.phone,
                customerDocType: customerData.docType || "DNI",
                customerDocument: customerData.documentNumber,
                deliveryMethod,
                address: deliveryMethod === "DELIVERY" ? customerData.address : null,
                reference: deliveryMethod === "DELIVERY" ? customerData.reference : null,
                paymentMethod,
                subtotal: calculatedSubtotal,
                deliveryCost,
                total: calculatedTotal,
                items: {
                    create: orderItemsData
                }
            }
        });

        return NextResponse.json({
            success: true,
            orderId: newOrder.id,
            validationCode: newOrder.validationCode
        }, { status: 201 });

    } catch (error) {
        console.error("Error al crear la orden:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
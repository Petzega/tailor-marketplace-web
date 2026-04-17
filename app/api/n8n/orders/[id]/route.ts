import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const orderId = resolvedParams.id;
        
        const url = new URL(request.url);
        const requestPhone = url.searchParams.get("phone");
        const token = url.searchParams.get("token");

        // Buscamos la orden e incluimos el detalle de los items y el nombre del producto
        const order = await db.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: {
                            select: { name: true, sku: true }
                        }
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
        }

        // Verificación de Seguridad: Permitir si el número coincide o si trae el token correcto
        const isAuthorized = (requestPhone && requestPhone.endsWith(order.customerPhone)) || (token && token === order.validationCode);

        if (!isAuthorized) {
            return NextResponse.json({ 
                id: order.id,
                status: order.status,
                restricted: true,
                systemInstruction: "⚠️ ESTADO DE SEGURIDAD: El usuario consulta desde un teléfono no registrado. NO TIENES PERMITIDO DAR DETALLES de esta orden (qué compró, montos, dirección). Debes pedirle al cliente amablemente que te brinde el 'código de validación' o 'token' de la orden. Cuando te lo brinde, usa tu herramienta pasándole el token para desbloquear la info." 
            }, { status: 200 });
        }

        // Devolvemos la orden SIN el código de validación por seguridad (si está autorizado)
        const { validationCode, ...safeOrder } = order;
        
        // Generar tracking link internamente para el n8n AI Agent
        const appDomain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const trackingLink = `${appDomain}/order/${order.id}?token=${order.validationCode}`;

        return NextResponse.json({ ...safeOrder, trackingLink, restricted: false }, { status: 200 });

    } catch (error) {
        console.error("Error obteniendo la orden para n8n:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
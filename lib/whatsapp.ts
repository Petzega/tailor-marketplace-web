// lib/whatsapp.ts

export interface WhatsAppItem {
    size?: string | null;
    quantity: number;
    name: string;
    price: number;
    sku: string;
}

export interface WhatsAppMessageData {
    orderId: string; // 👈 NUEVO: Requerido para conectar con n8n
    customerData: {
        name: string;
        phone: string;
        docType?: string;
        documentNumber?: string;
        address: string;
        reference: string;
    };
    items: WhatsAppItem[];
    deliveryMethod: "STORE" | "DELIVERY";
    paymentMethod: string;
    subtotal: number;
    deliveryCost: number;
    finalTotal: number;
}

// Función pura que genera el mensaje
export function generateWhatsAppTicket(data: WhatsAppMessageData): string {
    const { orderId, customerData, items, deliveryMethod, paymentMethod, subtotal, deliveryCost, finalTotal } = data;

    let message = `*🛒 NUEVO PEDIDO - AME: Araceli Moda y Estilos*\n`;
    message += `*# ORDEN: ${orderId}*\n\n`; // 👈 N8N extraerá este dato

    message += `*👤 Datos del Cliente:*\n`;
    message += `Nombre: ${customerData.name}\n`;
    message += `Celular: ${customerData.phone}\n`;

    if (customerData.docType && customerData.documentNumber) {
        message += `Documento: ${customerData.docType} ${customerData.documentNumber}\n`;
    }

    message += `Entrega: ${deliveryMethod === "DELIVERY" ? "Envío a Domicilio" : "Retiro en Tienda"}\n`;

    if (deliveryMethod === "DELIVERY") {
        message += `Dirección: ${customerData.address}\n`;
        if (customerData.reference) message += `Referencia: ${customerData.reference}\n`;
    }

    message += `\n*🛍️ Detalle del Pedido:*\n`;
    items.forEach(item => {
        const sizeText = item.size ? ` (Talla: ${item.size})` : '';
        message += `▪️ ${item.quantity}x ${item.name}${sizeText} - S/ ${(item.price * item.quantity).toFixed(2)}\n`;
        message += `   SKU: ${item.sku}\n`;
    });

    message += `\n*🧾 RESUMEN DE PAGO:*\n`;
    message += `Subtotal: S/ ${subtotal.toFixed(2)}\n`;
    if (deliveryMethod === "DELIVERY") {
        message += `Costo de envío: S/ ${deliveryCost.toFixed(2)}\n`;
    }
    message += `*💰 TOTAL A PAGAR: S/ ${finalTotal.toFixed(2)}*\n`;
    message += `*💳 Método de pago:* ${paymentMethod}\n\n`;
    message += `_Hola, quiero confirmar este pedido y coordinar el pago._`;

    // Retornamos el mensaje codificado para que funcione en la URL
    return encodeURIComponent(message);
}
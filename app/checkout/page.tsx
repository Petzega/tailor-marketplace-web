"use client";

import { useCart } from "@/store/cart";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle, AlertCircle, Store, Truck } from "lucide-react";
import { Footer } from "@/components/layout/footer";

const WHATSAPP_NUMBER = "51992431513";
const DELIVERY_COST = 10.00;

// 👇 Se añadió la opción de EFECTIVO
const PAYMENT_METHODS = [
    { id: 'YAPE', label: 'Yape', color: 'bg-[#742284]', text: 'text-white' },
    { id: 'PLIN', label: 'Plin', color: 'bg-[#00D8C8]', text: 'text-teal-950' },
    { id: 'BCP', label: 'Transferencia BCP', color: 'bg-[#FF7A00]', text: 'text-white' },
    { id: 'IBK', label: 'Transferencia Interbank', color: 'bg-[#009B3A]', text: 'text-white' },
    { id: 'BBVA', label: 'Transferencia BBVA', color: 'bg-[#072146]', text: 'text-white', border: 'border border-[#072146]' },
    { id: 'EFECTIVO', label: 'Pago en Efectivo', color: 'bg-emerald-600', text: 'text-white' },
];

export default function CheckoutPage() {
    const { items, clearCart } = useCart();

    const [customerData, setCustomerData] = useState({
        name: "",
        phone: "",
        address: "",
        reference: "",
    });

    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].label);
    const [deliveryMethod, setDeliveryMethod] = useState<"STORE" | "DELIVERY">("STORE");

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalTotal = deliveryMethod === "DELIVERY" ? subtotal + DELIVERY_COST : subtotal;

    const handleWhatsAppCheckout = (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) return;

        let message = `*🛒 NUEVO PEDIDO - STITCH & STYLE*\n\n`;

        message += `*👤 Datos del Cliente:*\n`;
        message += `Nombre: ${customerData.name}\n`;
        message += `Celular: ${customerData.phone}\n`;
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
            message += `Costo de envío: S/ ${DELIVERY_COST.toFixed(2)}\n`;
        }
        message += `*💰 TOTAL A PAGAR: S/ ${finalTotal.toFixed(2)}*\n`;
        message += `*💳 Método de pago:* ${paymentMethod}\n\n`;
        message += `_Hola, quiero confirmar este pedido y coordinar el pago._`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
        clearCart();
    };

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-gray-50 flex flex-col">
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
                        <span className="text-6xl mb-6 block">🛒</span>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
                        <p className="text-gray-500 mb-8">Parece que aún no has agregado ningún producto o servicio a tu pedido.</p>
                        <Link href="/search" className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-green-700 w-full">
                            Volver al Catálogo
                        </Link>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">

            <div className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full">
                <Link href="/search" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                    <ArrowLeft size={16} /> Volver a la tienda
                </Link>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Pedido</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* COLUMNA IZQUIERDA */}
                    <div className="lg:col-span-7">
                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">

                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 mb-8">
                                <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                                <p className="text-sm text-amber-800 leading-snug">
                                    <span className="font-bold">Aviso de Seguridad:</span> Por protección de nuestros clientes, <span className="font-bold underline">no solicitamos ni aceptamos pagos con tarjetas de crédito o débito</span> en la web. Todo pago se realiza directamente por transferencia o efectivo.
                                </p>
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 mb-6">Tus Datos para el Envío</h2>

                            <form id="checkout-form" onSubmit={handleWhatsAppCheckout} className="space-y-6">

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            required
                                            className="w-full rounded-lg border-gray-300 border p-3 text-gray-900 shadow-sm focus:border-green-500 focus:ring-green-500 outline-none transition-all"
                                            placeholder="Ej. Juan Pérez"
                                            value={customerData.name}
                                            onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Número de Celular *</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            required
                                            className="w-full rounded-lg border-gray-300 border p-3 text-gray-900 shadow-sm focus:border-green-500 focus:ring-green-500 outline-none transition-all"
                                            placeholder="Ej. 999 888 777"
                                            value={customerData.phone}
                                            onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 pb-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Método de Entrega *</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setDeliveryMethod("STORE")}
                                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                                                deliveryMethod === "STORE"
                                                    ? "border-gray-900 bg-gray-50 text-gray-900"
                                                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                                            }`}
                                        >
                                            <Store size={24} />
                                            <span className="text-sm font-bold">Retiro en Tienda</span>
                                            <span className="text-xs font-medium">Gratis</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeliveryMethod("DELIVERY")}
                                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                                                deliveryMethod === "DELIVERY"
                                                    ? "border-gray-900 bg-gray-50 text-gray-900"
                                                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                                            }`}
                                        >
                                            <Truck size={24} />
                                            <span className="text-sm font-bold">Delivery</span>
                                            <span className="text-xs font-medium">+ S/ {DELIVERY_COST.toFixed(2)}</span>
                                        </button>
                                    </div>
                                </div>

                                {deliveryMethod === "DELIVERY" && (
                                    <div className="space-y-6 animate-in fade-in duration-300">
                                        <div>
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Dirección de Entrega *</label>
                                            <input
                                                type="text"
                                                id="address"
                                                required={deliveryMethod === "DELIVERY"}
                                                className="w-full rounded-lg border-gray-300 border p-3 text-gray-900 shadow-sm focus:border-green-500 focus:ring-green-500 outline-none transition-all"
                                                placeholder="Ej. Av. Larco 123, Miraflores"
                                                value={customerData.address}
                                                onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">Referencia (Opcional)</label>
                                            <input
                                                type="text"
                                                id="reference"
                                                className="w-full rounded-lg border-gray-300 border p-3 text-gray-900 shadow-sm focus:border-green-500 focus:ring-green-500 outline-none transition-all"
                                                placeholder="Frente al parque..."
                                                value={customerData.reference}
                                                onChange={(e) => setCustomerData({ ...customerData, reference: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="pt-6 mt-6 border-t border-gray-100">
                                    <label className="block text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">¿Cómo deseas pagar?</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {PAYMENT_METHODS.map((method) => (
                                            <label
                                                key={method.id}
                                                className={`cursor-pointer flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                                                    paymentMethod === method.label
                                                        ? "border-green-500 bg-green-50"
                                                        : "border-gray-100 bg-white hover:border-green-200"
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={method.label}
                                                    checked={paymentMethod === method.label}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="sr-only"
                                                />
                                                <span className={`text-[10px] font-black px-2.5 py-1 rounded shadow-sm tracking-wide mb-2 ${method.color} ${method.text} ${method.border || ''}`}>
                                                    {method.id}
                                                </span>
                                                <span className="text-xs font-medium text-gray-700 text-center leading-tight">{method.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA */}
                    <div className="lg:col-span-5 relative">

                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 lg:sticky lg:top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen de tu Orden</h2>

                            <ul className="divide-y divide-gray-100 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                                {items.map((item) => (
                                    <li key={`${item.id}-${item.size}`} className="py-4 flex gap-4">
                                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50 relative">
                                            {item.imageUrl ? (
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">Sin foto</div>
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col justify-center">
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Cant: {item.quantity} {item.size ? `| Talla: ${item.size}` : ''}
                                            </p>
                                        </div>
                                        <div className="flex flex-col justify-center items-end">
                                            <p className="text-sm font-bold text-gray-900">S/ {(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="border-t border-gray-100 pt-6 space-y-4">
                                <div className="flex items-center justify-between text-base font-medium text-gray-900">
                                    <p>Subtotal</p>
                                    <p>S/ {subtotal.toFixed(2)}</p>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <p>Envío</p>
                                    <p>{deliveryMethod === "DELIVERY" ? `S/ ${DELIVERY_COST.toFixed(2)}` : 'Gratis (Retiro)'}</p>
                                </div>

                                <div className="flex items-center justify-between text-xl font-bold text-gray-900 border-t border-gray-100 pt-4">
                                    <p>Total</p>
                                    <p>S/ {finalTotal.toFixed(2)}</p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                className="mt-8 w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] px-6 py-4 text-base font-bold text-white shadow-lg shadow-green-200 transition-all active:scale-[0.98]"
                            >
                                <MessageCircle size={20} />
                                Hacer Pedido por WhatsApp
                            </button>

                            <p className="mt-4 text-xs text-center text-gray-500">
                                Al hacer clic, se abrirá WhatsApp con los detalles de tu orden para coordinar el pago y envío.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </main>
    );
}
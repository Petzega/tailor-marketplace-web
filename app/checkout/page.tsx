"use client";

import { useCart } from "@/store/cart";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Footer } from "@/components/layout/footer";

const WHATSAPP_NUMBER = "51992431513";

const PAYMENT_METHODS = [
    { id: 'YAPE', label: 'Yape', color: 'bg-[#742284]', text: 'text-white' },
    { id: 'PLIN', label: 'Plin', color: 'bg-[#00D8C8]', text: 'text-teal-950' },
    { id: 'BCP', label: 'Transferencia BCP', color: 'bg-[#FF7A00]', text: 'text-white' },
    { id: 'IBK', label: 'Transferencia Interbank', color: 'bg-[#009B3A]', text: 'text-white' },
    { id: 'BBVA', label: 'Transferencia BBVA', color: 'bg-[#072146]', text: 'text-white', border: 'border border-[#072146]' },
];

export default function CheckoutPage() {
    const { items, clearCart } = useCart();

    const [customerData, setCustomerData] = useState({
        name: "",
        address: "",
        reference: "",
    });

    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].label);

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleWhatsAppCheckout = (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) return;

        let message = `*🛒 NUEVO PEDIDO - STITCH & STYLE*\n\n`;
        message += `*👤 Datos del Cliente:*\n`;
        message += `Nombre: ${customerData.name}\n`;
        if (customerData.address) message += `Dirección: ${customerData.address}\n`;
        if (customerData.reference) message += `Referencia: ${customerData.reference}\n`;

        message += `\n*🛍️ Detalle del Pedido:*\n`;
        items.forEach(item => {
            const sizeText = item.size ? ` (Talla: ${item.size})` : '';
            message += `▪️ ${item.quantity}x ${item.name}${sizeText} (SKU: ${item.sku}) - S/ ${(item.price * item.quantity).toFixed(2)}\n`;
        });

        message += `\n*💰 TOTAL A PAGAR:* S/ ${totalPrice.toFixed(2)}\n`;
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
                        <p className="text-gray-500 mb-8">Parece que aún no has agregado nada a tu pedido.</p>
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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Tus Datos para el Envío</h2>

                        <form id="checkout-form" onSubmit={handleWhatsAppCheckout} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                                <input type="text" id="name" required className="w-full rounded-lg border-gray-300 border p-3 text-gray-900 shadow-sm focus:border-green-500 focus:ring-green-500 outline-none transition-all" value={customerData.name} onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })} />
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Dirección de Entrega</label>
                                <input type="text" id="address" className="w-full rounded-lg border-gray-300 border p-3 text-gray-900 shadow-sm focus:border-green-500 focus:ring-green-500 outline-none transition-all" value={customerData.address} onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })} />
                            </div>

                            <div>
                                <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">Referencia (Opcional)</label>
                                <input type="text" id="reference" className="w-full rounded-lg border-gray-300 border p-3 text-gray-900 shadow-sm focus:border-green-500 focus:ring-green-500 outline-none transition-all" value={customerData.reference} onChange={(e) => setCustomerData({ ...customerData, reference: e.target.value })} />
                            </div>

                            <div className="pt-6 mt-6 border-t border-gray-100">
                                <label className="block text-sm font-bold text-gray-900 mb-4 tracking-widest uppercase">¿Cómo deseas pagar?</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {PAYMENT_METHODS.map((method) => (
                                        <label key={method.id} className={`cursor-pointer flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentMethod === method.label ? "border-green-500 bg-green-50" : "border-gray-100 bg-white hover:border-green-200"}`}>
                                            <input type="radio" name="paymentMethod" value={method.label} checked={paymentMethod === method.label} onChange={(e) => setPaymentMethod(e.target.value)} className="sr-only" />
                                            <span className={`text-[10px] font-black px-2.5 py-1 rounded shadow-sm tracking-wide mb-2 ${method.color} ${method.text} ${method.border || ''}`}>
                                                {method.id}
                                            </span>
                                            <span className="text-xs font-medium text-gray-700 text-center">{method.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen de tu Orden</h2>
                        <ul className="divide-y divide-gray-100 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                            {items.map((item) => (
                                <li key={`${item.id}-${item.size}`} className="py-4 flex gap-4">
                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50 relative">
                                        {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">Cant: {item.quantity} {item.size ? `| Talla: ${item.size}` : ''}</p>
                                    </div>
                                    <div className="flex flex-col justify-center items-end">
                                        <p className="text-sm font-bold text-gray-900">S/ {(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t border-gray-100 pt-6 space-y-4">
                            <div className="flex items-center justify-between text-base font-medium text-gray-900"><p>Subtotal</p><p>S/ {totalPrice.toFixed(2)}</p></div>
                            <div className="flex items-center justify-between text-xl font-bold text-gray-900 border-t border-gray-100 pt-4"><p>Total</p><p>S/ {totalPrice.toFixed(2)}</p></div>
                        </div>
                        <button type="submit" form="checkout-form" className="mt-8 w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] px-6 py-4 text-base font-bold text-white shadow-lg transition-all active:scale-[0.98]">
                            <MessageCircle size={20} /> Hacer Pedido por WhatsApp
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
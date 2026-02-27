"use client";

import { useCart } from "@/store/cart";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Footer } from "@/components/layout/footer";

const WHATSAPP_NUMBER = "51992431513"; // Tu número de WhatsApp

export default function CheckoutPage() {
    const { items, clearCart } = useCart();

    // Estados para el formulario del cliente
    const [customerData, setCustomerData] = useState({
        name: "",
        address: "",
        reference: "",
    });

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Función que arma el mensaje y envía al cliente a WhatsApp
    const handleWhatsAppCheckout = (e: React.FormEvent) => {
        e.preventDefault(); // Evita que la página se recargue

        if (items.length === 0) return;

        // 1. Armamos el "Ticket" en texto para WhatsApp usando negritas (*)
        let message = `*🛒 NUEVO PEDIDO - STITCH & STYLE*\n\n`;

        message += `*👤 Datos del Cliente:*\n`;
        message += `Nombre: ${customerData.name}\n`;
        if (customerData.address) message += `Dirección: ${customerData.address}\n`;
        if (customerData.reference) message += `Referencia: ${customerData.reference}\n`;

        message += `\n*🛍️ Detalle del Pedido:*\n`;
        items.forEach(item => {
            message += `▪️ ${item.quantity}x ${item.name} - S/ ${(item.price * item.quantity).toFixed(2)}\n`;
        });

        message += `\n*💰 TOTAL A PAGAR:* S/ ${totalPrice.toFixed(2)}\n\n`;
        message += `_Hola, quiero confirmar este pedido y coordinar el pago por transferencia._`;

        // 2. Codificamos el texto para que las URLs lo entiendan (espacios, saltos de línea)
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

        // 3. Abrimos WhatsApp en una nueva pestaña
        window.open(whatsappUrl, '_blank');

        // 4. (Opcional) Limpiamos el carrito porque ya se envió el pedido
        clearCart();
    };

    // Si el carrito está vacío, mostramos un mensaje amigable
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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* COLUMNA IZQUIERDA: Formulario de Datos */}
                    <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Tus Datos para el Envío</h2>

                        <form id="checkout-form" onSubmit={handleWhatsAppCheckout} className="space-y-6">
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
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Dirección de Entrega</label>
                                <input
                                    type="text"
                                    id="address"
                                    className="w-full rounded-lg border-gray-300 border p-3 text-gray-900 shadow-sm focus:border-green-500 focus:ring-green-500 outline-none transition-all"
                                    placeholder="Ej. Av. Larco 123, Miraflores"
                                    value={customerData.address}
                                    onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-1">Déjalo en blanco si recogerás en tienda o es un servicio presencial.</p>
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
                        </form>
                    </div>

                    {/* COLUMNA DERECHA: Resumen de la Orden */}
                    <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen de tu Orden</h2>

                        <ul className="divide-y divide-gray-100 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                            {items.map((item) => (
                                <li key={item.id} className="py-4 flex gap-4">
                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
                                        {item.imageUrl ? (
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.name}
                                                width={64}
                                                height={64}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-[10px] text-gray-400">Sin foto</div>
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col justify-center">
                                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">Cant: {item.quantity}</p>
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
                                <p>S/ {totalPrice.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <p>Envío</p>
                                <p>A coordinar</p>
                            </div>
                            <div className="flex items-center justify-between text-xl font-bold text-gray-900 border-t border-gray-100 pt-4">
                                <p>Total</p>
                                <p>S/ {totalPrice.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Botón Principal (Conectado al formulario de la izquierda) */}
                        <button
                            type="submit"
                            form="checkout-form" // Esto hace que el botón envíe el formulario aunque esté fuera de él
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

            <Footer />
        </main>
    );
}
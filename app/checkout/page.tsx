"use client";

import { useCart } from "@/store/cart";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle, AlertCircle, Store, Truck, Loader2 } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { generateWhatsAppTicket } from "@/lib/whatsapp";
import { TermsModal } from "@/components/checkout/terms-modal";

const WHATSAPP_NUMBER = "51992431513";
const DELIVERY_COST = 10.00;

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
        name: "", phone: "", address: "", reference: "", docType: "DNI", documentNumber: ""
    });

    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].label);
    const [deliveryMethod, setDeliveryMethod] = useState<"STORE" | "DELIVERY">("STORE");

    const [showTermsModal, setShowTermsModal] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalTotal = deliveryMethod === "DELIVERY" ? subtotal + DELIVERY_COST : subtotal;

    const handleAcceptTerms = () => {
        setTermsAccepted(true);
        setShowTermsModal(false);
    };

    const handleWhatsAppCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;

        setIsLoading(true);
        setErrorMsg("");

        try {
            // 1. Enviar datos al backend para crear la orden
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerData,
                    items,
                    deliveryMethod,
                    paymentMethod
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Ocurrió un error al procesar la orden");
            }

            // 2. Generar ticket de WhatsApp usando el ID generado
            const encodedMessage = generateWhatsAppTicket({
                orderId: result.orderId, // <-- Pasamos el ID al ticket
                customerData,
                items,
                deliveryMethod,
                paymentMethod,
                subtotal, deliveryCost: DELIVERY_COST,
                finalTotal
            });

            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
            clearCart();

        } catch (error) {
            console.error("Checkout error:", error);
            if (error instanceof Error) {
                setErrorMsg(error.message);
            } else {
                setErrorMsg("Ocurrió un error inesperado al procesar la orden");
            }
        } finally {
            setIsLoading(false);
        }
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

                                {/* SECCIÓN DE IDENTIDAD */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="sm:col-span-1">
                                        <label htmlFor="docType" className="block text-sm font-medium text-gray-700 mb-1">Documento *</label>
                                        <select
                                            id="docType"
                                            required
                                            className="w-full rounded-lg border-gray-300 border p-3 text-gray-900 shadow-sm focus:border-green-500 focus:ring-green-500 outline-none transition-all bg-white"
                                            value={customerData.docType}
                                            onChange={(e) => setCustomerData({ ...customerData, docType: e.target.value, documentNumber: "" })}
                                        >
                                            <option value="DNI">DNI</option>
                                            <option value="RUC">RUC</option>
                                            <option value="CE">Carné Ext.</option>
                                        </select>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                                        <input
                                            type="text"
                                            id="documentNumber"
                                            required
                                            maxLength={customerData.docType === 'RUC' ? 11 : 15}
                                            className="w-full rounded-lg border-gray-300 border p-3 text-gray-900 shadow-sm focus:border-green-500 focus:ring-green-500 outline-none transition-all"
                                            placeholder={`Ej. ${customerData.docType === 'RUC' ? '1045... o 2056...' : '74125896'}`}
                                            value={customerData.documentNumber}
                                            onChange={(e) => setCustomerData({ ...customerData, documentNumber: e.target.value.replace(/\D/g, '') })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            {customerData.docType === 'RUC' ? 'Razón Social / Nombre *' : 'Nombre Completo *'}
                                        </label>
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
                                            onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value.replace(/\D/g, '') })}
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 pb-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Método de Entrega *</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setDeliveryMethod("STORE")}
                                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${deliveryMethod === "STORE"
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
                                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${deliveryMethod === "DELIVERY"
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
                                                className={`cursor-pointer flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentMethod === method.label
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
                                                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
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

                            <div className="border-t border-gray-100 pt-5 mt-5 mb-4">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="relative flex items-center pt-0.5">
                                        <input
                                            type="checkbox"
                                            required
                                            form="checkout-form"
                                            checked={termsAccepted}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setShowTermsModal(true);
                                                } else {
                                                    setTermsAccepted(false);
                                                }
                                            }}
                                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-gray-300 checked:border-green-600 checked:bg-green-600 transition-all disabled:opacity-50"
                                            disabled={isLoading}
                                        />
                                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-600 leading-tight">
                                        He leído y acepto los <span onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }} className="text-gray-900 font-bold underline underline-offset-2 hover:text-green-600 transition-colors">Términos y Condiciones</span> y la política de devoluciones.
                                    </span>
                                </label>
                            </div>

                            {errorMsg && (
                                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                                    {errorMsg}
                                </div>
                            )}

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={!termsAccepted || isLoading}
                                className={`w-full flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold shadow-lg transition-all active:scale-[0.98] ${termsAccepted && !isLoading
                                        ? "bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-green-200"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Creando orden...
                                    </>
                                ) : (
                                    <>
                                        <MessageCircle size={20} />
                                        {termsAccepted ? "Hacer Pedido por WhatsApp" : "Acepta los términos para continuar"}
                                    </>
                                )}
                            </button>

                            <p className="mt-4 text-xs text-center text-gray-500">
                                Al hacer clic, se abrirá WhatsApp con los detalles de tu orden para coordinar el pago y envío.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <TermsModal
                isOpen={showTermsModal}
                onAccept={handleAcceptTerms}
            />

            <Footer />
        </main>
    );
}
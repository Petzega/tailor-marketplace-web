"use client"

import { useCart } from "@/store/cart";
import Image from "next/image";
import { X, Trash2, Plus, Minus, MessageCircle, ShieldCheck } from "lucide-react";

export function CartSheet() {
    const { items, isOpen, closeCart, removeItem, updateQuantity } = useCart();

    if (!isOpen) return null;

    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleWhatsAppCheckout = () => {
        // 1. Armar el mensaje detallado
        let message = "¡Hola Stitch & Style! 👋\nMe gustaría hacer el siguiente pedido:\n\n";

        items.forEach(item => {
            const subtotal = (item.price * item.quantity).toFixed(2);
            message += `• ${item.quantity}x ${item.name} (SKU: ${item.sku}) - S/ ${subtotal}\n`;
        });

        message += `\n*Total estimado: S/ ${total.toFixed(2)}*\n\n`;

        // 2. Línea de confianza de métodos de pago
        message += "💳 *Métodos de pago:* Yape, Plin, BCP, Interbank o BBVA.\n\n";
        message += "Quedo a la espera de la confirmación para coordinar el pago y la entrega/cita.";

        // 3. Codificar el mensaje
        const encodedMessage = encodeURIComponent(message);

        // 4. Número de WhatsApp
        const phoneNumber = "51992431513";

        // 5. Abrir WhatsApp y cerrar carrito
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
        closeCart();
    };

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Fondo oscuro */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={closeCart}
            />

            {/* Panel del carrito */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        Tu Carrito <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{items.length}</span>
                    </h2>
                    <button onClick={closeCart} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Lista de Productos */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="text-center text-gray-500 py-10 flex flex-col items-center">
                            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <MessageCircle size={24} className="text-gray-300" />
                            </div>
                            <p>Tu carrito está vacío.</p>
                            <button onClick={closeCart} className="mt-4 text-green-600 font-medium text-sm hover:underline">
                                Seguir explorando
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4 border-b border-gray-50 pb-4">
                                <div className="h-20 w-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 relative border border-gray-100">
                                    {item.imageUrl ? (
                                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-400">Sin img</div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">{item.name}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{item.category === 'SERVICE' ? 'Servicio' : 'Producto'}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-sm font-bold text-gray-900">S/ {(item.price * item.quantity).toFixed(2)}</p>

                                        {/* Controles de Cantidad */}
                                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg border border-gray-200/60 px-2 py-1 shadow-sm">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-500 hover:text-gray-900 disabled:opacity-30 transition-colors"><Minus size={14} /></button>
                                            <span className="text-xs font-bold w-4 text-center text-gray-700">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-500 hover:text-gray-900 transition-colors"><Plus size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 self-start p-1 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Checkout */}
                {items.length > 0 && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50/80">
                        <div className="flex justify-between items-center mb-5">
                            <span className="text-gray-600 font-medium">Total Estimado</span>
                            <span className="text-2xl font-black text-gray-900">S/ {total.toFixed(2)}</span>
                        </div>

                        <button
                            onClick={handleWhatsAppCheckout}
                            className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-md shadow-green-200 transition-all active:scale-[0.98]"
                        >
                            <MessageCircle size={20} className="fill-current" />
                            Comprar por WhatsApp
                        </button>

                        {/* SECCIÓN DE BILLETERAS Y BANCOS (Visualmente Atractiva) */}
                        <div className="mt-5 pt-4 border-t border-gray-200/60 flex flex-col items-center gap-3">
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                                <ShieldCheck size={14} className="text-green-500" />
                                Medios de pago aceptados
                            </div>

                            <div className="flex flex-wrap justify-center gap-2 w-full">
                                {/* Yape */}
                                <div className="bg-[#742284] text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm tracking-wide">
                                    YAPE
                                </div>
                                {/* Plin */}
                                <div className="bg-[#00D8C8] text-teal-950 text-[10px] font-bold px-2.5 py-1 rounded shadow-sm tracking-wide">
                                    PLIN
                                </div>
                                {/* BCP */}
                                <div className="bg-[#FF7A00] text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm tracking-wide">
                                    BCP
                                </div>
                                {/* Interbank */}
                                <div className="bg-[#009B3A] text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm tracking-wide">
                                    Interbank
                                </div>
                                {/* BBVA */}
                                <div className="bg-[#072146] text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm tracking-wide border border-[#072146]">
                                    BBVA
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
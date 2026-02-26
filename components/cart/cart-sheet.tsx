"use client"

import { useCart } from "@/store/cart";
import { X, Trash2, Plus, Minus, MessageCircle } from "lucide-react";

export function CartSheet() {
    const { items, isOpen, closeCart, removeItem, updateQuantity } = useCart();

    if (!isOpen) return null;

    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleWhatsAppCheckout = () => {
        // 1. Armar el mensaje
        let message = "¡Hola Stitch & Style! 👋\nMe gustaría hacer el siguiente pedido:\n\n";

        items.forEach(item => {
            message += `• ${item.quantity}x ${item.name} (S/ ${item.price.toFixed(2)})\n`;
        });

        message += `\n*Total estimado: S/ ${total.toFixed(2)}*\n\n`;
        message += "Quedo a la espera de la confirmación.";

        // 2. Codificar el mensaje para la URL
        const encodedMessage = encodeURIComponent(message);

        // 3. Tu número de WhatsApp de Perú (Cambia los ceros por tu número real, conservando el 51)
        const phoneNumber = "51992431513";

        // 4. Abrir WhatsApp
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
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
                        Your Cart <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{items.length}</span>
                    </h2>
                    <button onClick={closeCart} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Lista de Productos */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">
                            <p>Your cart is empty.</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4 border-b border-gray-50 pb-4">
                                <div className="h-20 w-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-400">No img</div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 leading-tight">{item.name}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{item.category === 'SERVICE' ? 'Service' : 'Product'}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-sm font-bold text-gray-900">S/ {(item.price * item.quantity).toFixed(2)}</p>

                                        {/* Controles de Cantidad */}
                                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg border border-gray-100 px-2 py-1">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-400 hover:text-gray-700 disabled:opacity-50"><Minus size={14} /></button>
                                            <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-400 hover:text-gray-700"><Plus size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 self-start p-1 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Checkout */}
                {items.length > 0 && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-600 font-medium">Estimated Total</span>
                            <span className="text-2xl font-bold text-gray-900">S/ {total.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleWhatsAppCheckout}
                            className="w-full bg-[#25D366] hover:bg-[#1EBE5A] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-all active:scale-95"
                        >
                            <MessageCircle size={22} />
                            Checkout via WhatsApp
                        </button>
                        <p className="text-center text-[11px] text-gray-500 mt-3">You will be able to review your order before sending the message.</p>
                    </div>
                )}

            </div>
        </div>
    );
}
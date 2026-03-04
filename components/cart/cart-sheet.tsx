"use client"

import { useCart } from "@/store/cart";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, MessageCircle } from "lucide-react";

export function CartSheet() {
    // 👇 1. Importamos la función clearCart (opcional, pero útil si alguna vez quieres vaciar todo)
    const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart } = useCart();

    if (!isOpen) return null;

    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleWhatsAppCheckout = () => {
        let message = "¡Hola Stitch & Style! 👋\nMe gustaría hacer el siguiente pedido:\n\n";

        items.forEach(item => {
            const subtotal = (item.price * item.quantity).toFixed(2);
            // 👇 2. Añadimos la talla al mensaje de WhatsApp si el producto la tiene
            const sizeText = item.size ? ` (Talla ${item.size})` : '';
            message += `• ${item.quantity}x ${item.name}${sizeText} (SKU: ${item.sku}) - S/ ${subtotal}\n`;
        });

        message += `\n*Total estimado: S/ ${total.toFixed(2)}*\n\n`;
        message += "💳 *Métodos de pago:* Yape, Plin, BCP, Interbank o BBVA.\n\n";
        message += "Quedo a la espera de la confirmación para coordinar el pago y la entrega/cita.";

        const encodedMessage = encodeURIComponent(message);
        const phoneNumber = "51992431513";

        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
        closeCart();
    };

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                onClick={closeCart}
            />

            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                        Tu Carrito
                        <span className="bg-gray-900 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                            {items.length}
                        </span>
                    </h2>
                    <button onClick={closeCart} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-50/50">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                            <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <ShoppingBag size={40} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Tu carrito está vacío</h3>
                            <p className="text-sm text-gray-500 mb-8 max-w-[250px]">
                                ¡Parece que aún no has agregado nada! Descubre nuestros últimos ingresos.
                            </p>
                            <button
                                onClick={closeCart}
                                className="bg-gray-900 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-black transition-all shadow-md active:scale-95"
                            >
                                Empezar a explorar
                            </button>
                        </div>
                    ) : (
                        <div className="p-6 space-y-2">
                            {items.map((item) => (
                                // Usamos el ID + el Size como key por si agregaron 2 tallas del mismo producto
                                <div key={`${item.id}-${item.size || 'default'}`} className="flex gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm relative group">

                                    <div className="h-24 w-24 bg-gray-100 rounded-xl overflow-hidden shrink-0 relative border border-gray-100">
                                        {item.imageUrl ? (
                                            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex flex-col items-center justify-center text-[10px] text-gray-400 gap-1">
                                                <ShoppingBag size={16} />
                                                Sin img
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div className="pr-6">
                                            <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">{item.name}</h3>

                                            {/* 👇 3. Mostramos la Talla en la interfaz gráfica del carrito */}
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {item.category === 'SERVICE' ? 'Servicio' : 'Producto'}
                                                </p>
                                                {item.size && (
                                                    <span className="text-[10px] bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded-sm font-bold text-gray-700">
                                                        Talla: {item.size}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-end justify-between mt-3">
                                            <p className="text-base font-black text-gray-900">
                                                S/ {(item.price * item.quantity).toFixed(2)}
                                            </p>

                                            <div className="flex items-center gap-1 bg-gray-50 rounded-lg border border-gray-200 p-0.5 shadow-sm">
                                                {/* 👇 4. Pasamos el item.size en los botones de cantidad y eliminar */}
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                                                    className="w-7 h-7 flex items-center justify-center bg-white rounded-md text-gray-600 hover:text-gray-900 shadow-sm border border-gray-100 disabled:opacity-50 transition-all active:scale-95"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-xs font-bold w-6 text-center text-gray-900">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                                                    className="w-7 h-7 flex items-center justify-center bg-white rounded-md text-gray-600 hover:text-gray-900 shadow-sm border border-gray-100 transition-all active:scale-95"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pasamos el item.size al botón de borrar */}
                                    <button
                                        onClick={() => removeItem(item.id, item.size)}
                                        className="absolute top-3 right-3 text-gray-300 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Eliminar producto"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
                        <div className="flex justify-between items-end mb-5">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Estimado</span>
                            <span className="text-3xl font-black text-gray-900 tracking-tight">S/ {total.toFixed(2)}</span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleWhatsAppCheckout}
                                className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-all active:scale-[0.98]"
                            >
                                <MessageCircle size={22} className="fill-current" />
                                Comprar por WhatsApp
                            </button>

                            {/* Botón de limpiar por si los productos se te quedan pegados (Solo UI) */}
                            <button
                                onClick={clearCart}
                                className="w-full text-xs font-bold text-gray-400 hover:text-red-500 py-2 transition-colors"
                            >
                                Vaciar carrito completo
                            </button>
                        </div>

                        <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col items-center gap-4">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <ShieldCheck size={16} className="text-green-500" />
                                Pagos seguros con
                            </div>

                            <div className="flex flex-wrap justify-center gap-2 w-full">
                                <div className="w-[60px] h-[28px] flex items-center justify-center bg-[#742284] text-white text-[10px] font-black rounded-[4px] shadow-sm tracking-wider">YAPE</div>
                                <div className="w-[60px] h-[28px] flex items-center justify-center bg-[#00D8C8] text-teal-950 text-[10px] font-black rounded-[4px] shadow-sm tracking-wider">PLIN</div>
                                <div className="w-[60px] h-[28px] flex items-center justify-center bg-[#FF7A00] text-white text-[10px] font-black rounded-[4px] shadow-sm tracking-wider">BCP</div>
                                <div className="w-[60px] h-[28px] flex items-center justify-center bg-[#009B3A] text-white text-[10px] font-black rounded-[4px] shadow-sm tracking-wider">IBK</div>
                                <div className="w-[60px] h-[28px] flex items-center justify-center bg-[#072146] text-white text-[10px] font-black rounded-[4px] shadow-sm tracking-wider">BBVA</div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Check, Plus, Minus, Calendar } from "lucide-react";
import { useCart } from "@/store/cart";
import { SpotlightProduct } from "@/actions/search";

interface ProductOptionsProps {
    product: SpotlightProduct;
    sizes: { size: string; stock: number }[]; // 👈 Recibimos las tallas dinámicas
    description: string | null;
    isOutOfStock: boolean;
    isService: boolean;
    whatsappLink: string;
}

export function ProductOptions({ product, sizes, description, isOutOfStock, isService, whatsappLink }: ProductOptionsProps) {
    const addItem = useCart((state) => state.addItem);
    const [added, setAdded] = useState(false);
    const [quantity, setQuantity] = useState(1);

    // 💡 LÓGICA INTELIGENTE: Busca la primera talla que tenga stock > 0 para seleccionarla por defecto
    const firstAvailableSize = sizes.find(s => s.stock > 0)?.size || (sizes.length > 0 ? sizes[0].size : '');
    const [selectedSize, setSelectedSize] = useState<string>(firstAvailableSize);

    // 💡 Obtenemos el stock real de la talla que el usuario tiene seleccionada ahora mismo
    const currentSizeData = sizes.find(s => s.size === selectedSize);
    const currentStock = currentSizeData ? currentSizeData.stock : 0;
    const isCurrentSizeOutOfStock = currentStock === 0;

    // Si cambian de talla y la cantidad elegida es mayor al stock de la nueva talla, la reseteamos a 1
    useEffect(() => {
        if (quantity > currentStock && currentStock > 0) {
            setQuantity(1);
        }
    }, [selectedSize, currentStock, quantity]);

    const handleAdd = () => {
        if (isCurrentSizeOutOfStock) return;

        addItem(product, quantity, isService ? undefined : selectedSize);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
        setQuantity(1);
    };

    return (
        <div className="flex flex-col gap-5">
            {/* 1. SELECTOR DE TALLAS */}
            {!isService && sizes.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Selecciona tu Talla</h3>
                        <button type="button" className="text-[11px] font-bold text-gray-500 underline underline-offset-2 hover:text-gray-900 transition-colors">Guía de medidas</button>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {sizes.map((sizeObj) => {
                            const isSelected = selectedSize === sizeObj.size;
                            const isSizeAgotada = sizeObj.stock === 0;

                            return (
                                <button
                                    key={sizeObj.size}
                                    type="button"
                                    onClick={() => setSelectedSize(sizeObj.size)}
                                    disabled={isSizeAgotada} // 👈 Se deshabilita si ESTA talla no tiene stock
                                    className={`h-10 px-4 rounded-md border text-xs font-bold transition-all disabled:opacity-40 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                                        isSelected && !isSizeAgotada
                                            ? 'border-gray-900 bg-gray-900 text-white shadow-md ring-2 ring-gray-900 ring-offset-2'
                                            : 'border-gray-200 text-gray-700 bg-white hover:border-gray-400 hover:bg-gray-50'
                                    }`}
                                >
                                    {sizeObj.size}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 2. DESCRIPCIÓN */}
            <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Descripción</h3>
                <p className="text-gray-600 text-[13px] leading-relaxed">
                    {description || 'Detalles premium y acabados de alta calidad diseñados para durar. Esta pieza es un básico esencial para cualquier guardarropa.'}
                </p>
            </div>

            {/* 3. STOCK INDICATOR (Ahora basado en la talla) */}
            {!isService && (
                <div className="flex items-center gap-2 bg-gray-50 py-2.5 px-3 rounded-md border border-gray-100 w-fit">
                    <div className={`h-2 w-2 rounded-full ${isCurrentSizeOutOfStock ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                        {/* 👇 Texto dinámico según el stock de la talla */}
                        {isCurrentSizeOutOfStock
                            ? 'Agotado en esta talla'
                            : currentStock < 5
                                ? `¡Últimas ${currentStock} unidades disponibles!`
                                : `Quedan ${currentStock} unidades disponibles`
                        }
                    </span>
                </div>
            )}

            {/* 4. BOTONES DE ACCIÓN */}
            <div className="pt-2">
                {isOutOfStock || (!isService && isCurrentSizeOutOfStock) ? (
                    <button disabled className="w-full h-12 flex items-center justify-center gap-2 bg-gray-100 text-gray-400 font-bold rounded-lg text-sm cursor-not-allowed border border-gray-200">
                        Agotado
                    </button>
                ) : isService ? (
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-12 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-lg text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                    >
                        <Calendar size={18} />
                        Agendar Cita en WhatsApp
                    </a>
                ) : (
                    <div className="flex gap-2.5 h-12 w-full">
                        <div className="flex-1 flex gap-2.5">
                            {/* Selector de cantidad */}
                            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-2 w-[110px] shrink-0 shadow-sm">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all disabled:opacity-50"
                                    disabled={quantity <= 1}
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="font-bold text-gray-900 text-sm">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                                    disabled={quantity >= currentStock} // 👈 Bloqueamos el "Plus" si llega al límite de la talla
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            {/* Agregar al carrito */}
                            <button
                                onClick={handleAdd}
                                className={`flex-1 flex items-center justify-center gap-2 rounded-xl transition-all duration-300 px-4 text-sm font-bold text-white shadow-md active:scale-[0.98] ${added ? "bg-green-600 hover:bg-green-700" : "bg-gray-900 hover:bg-black"}`}
                            >
                                {added ? <Check size={18} /> : <ShoppingCart size={18} />}
                                {added ? "Agregado" : "Agregar"}
                            </button>
                        </div>

                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#25D366] hover:bg-[#20bd5a] transition-all text-white shadow-md hover:shadow-lg active:scale-[0.98]"
                            title="Consultar por WhatsApp"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
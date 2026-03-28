"use client";

import { ShoppingCart, Check, Plus, Minus } from "lucide-react";
import { useCart } from "@/store/cart";
import { useState } from "react";
import { SpotlightProduct } from "@/actions/search";

export function AddToCartButton({ product, showQuantity = false }: { product: SpotlightProduct; isOutOfStock?: boolean; showQuantity?: boolean }) {
    const addItem = useCart((state) => state.addItem);
    const [added, setAdded] = useState(false);
    const [quantity, setQuantity] = useState(1); // 👈 Estado local para el contador

    const handleAdd = () => {
        addItem(product, quantity); // 👈 Ahora pasamos la cantidad al carrito
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
        setQuantity(1); // Resetea a 1 después de agregar
    };

    // Si le pedimos que muestre el contador (Para la página individual)
    if (showQuantity) {
        return (
            <div className="flex w-full gap-2.5 h-12">
                {/* Contador de cantidad */}
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
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {/* Botón de agregar */}
                <button
                    onClick={handleAdd}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl transition-all duration-300 px-4 text-sm font-bold text-white shadow-md active:scale-[0.98] ${added ? "bg-green-600 hover:bg-green-700" : "bg-gray-900 hover:bg-black"
                        }`}
                >
                    {added ? <Check size={18} /> : <ShoppingCart size={18} />}
                    {added ? "Agregado" : "Agregar"}
                </button>
            </div>
        );
    }

    // Botón normal (Para el catálogo donde solo se agrega 1)
    return (
        <button
            onClick={handleAdd}
            className={`flex h-full w-full items-center justify-center gap-2 rounded-lg transition-all duration-300 px-4 text-[13px] font-medium text-white shadow-sm active:scale-[0.98] ${added ? "bg-green-600 hover:bg-green-700" : "bg-gray-900 hover:bg-black"
                }`}
        >
            {added ? <Check size={16} /> : <ShoppingCart size={16} />}
            {added ? "Agregado" : "Agregar"}
        </button>
    );
}
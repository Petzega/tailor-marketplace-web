"use client";

import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/store/cart";
import { useState } from "react";
import { SpotlightProduct } from "@/actions/search";

export function AddToCartButton({ product, isOutOfStock }: { product: SpotlightProduct; isOutOfStock: boolean }) {
    const addItem = useCart((state) => state.addItem);
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        addItem(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <button
            onClick={handleAdd}
            // 👇 Agregamos h-full y w-full para forzar el tamaño estandarizado
            className={`flex h-full w-full items-center justify-center gap-2 rounded-lg transition-all duration-300 px-4 text-sm font-medium text-white shadow-md active:scale-[0.98] ${added ? "bg-green-600 hover:bg-green-700" : "bg-gray-900 hover:bg-black"
                }`}
        >
            {added ? <Check size={18} /> : <ShoppingCart size={18} />}
            {added ? "Agregado" : "Agregar"}
        </button>
    );
}
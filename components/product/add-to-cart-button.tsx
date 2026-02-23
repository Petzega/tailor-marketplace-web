"use client"

import { useCart } from "@/store/cart";
import { SpotlightProduct } from "@/actions/search";
import { ShoppingBag, Ruler } from "lucide-react";

export function AddToCartButton({ product, isOutOfStock }: { product: SpotlightProduct, isOutOfStock: boolean }) {
    const { addItem } = useCart();
    const isService = product.category === 'SERVICE';

    return (
        <button
            disabled={isOutOfStock}
            onClick={() => addItem(product)} // 👈 ¡Aquí ocurre la magia! Añade al estado global
            className={`w-full py-4 px-8 rounded-xl flex items-center justify-center gap-3 font-bold text-lg transition-all shadow-lg active:scale-[0.98] ${
                isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                    : isService
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200'
                        : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-green-200'
            }`}
        >
            {isService ? (
                <><Ruler size={22} /> Book This Service</>
            ) : (
                <><ShoppingBag size={22} /> {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</>
            )}
        </button>
    );
}
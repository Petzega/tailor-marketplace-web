"use client"

import { deleteProduct } from "@/actions/products";
import { Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import Link from "next/link"; // Usamos Link para navegación rápida

export function ProductActions({ productId }: { productId: string }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        if (confirm("¿Estás seguro de eliminar este producto?")) {
            setIsLoading(true);
            await deleteProduct(productId);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-end gap-2">
            {/* 👇 CAMBIO CLAVE: Usamos query params */}
            <Link
                href={`/admin?edit=${productId}`}
                scroll={false} // Evita que la página salte arriba al hacer clic
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar"
            >
                <Pencil size={18} />
            </Link>

            <button
                onClick={handleDelete}
                disabled={isLoading}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
}
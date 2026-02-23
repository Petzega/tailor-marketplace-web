"use client"

import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";
import { CommandSearch } from "@/components/search/command-search";
import { useCart } from "@/store/cart"; // 👈 Importamos el store del carrito

export function Navbar() {
    const { items, openCart } = useCart(); // 👈 Traemos el estado del carrito

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* 1. Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white font-bold">
                        S
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">
                        Stitch & Style
                    </span>
                </Link>

                {/* 2. Barra de Búsqueda INTELIGENTE */}
                <div className="hidden md:flex flex-1 items-center justify-center px-8">
                    <div className="w-full max-w-md">
                        <CommandSearch />
                    </div>
                </div>

                {/* 3. Iconos */}
                <div className="flex items-center gap-4">

                    {/* 👇 Botón del Carrito */}
                    <button
                        onClick={openCart}
                        className="relative p-2 text-gray-600 hover:text-green-600 transition-colors"
                        title="View Cart"
                    >
                        <ShoppingBag className="h-5 w-5" />

                        {/* Indicador de cantidad (Solo se muestra si hay > 0) */}
                        {items.length > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                                {items.length}
                            </span>
                        )}
                    </button>

                    {/* Botón de Usuario */}
                    <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                        <User className="h-5 w-5" />
                    </button>
                </div>

            </div>
        </nav>
    );
}
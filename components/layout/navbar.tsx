"use client"

import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";
import { CommandSearch } from "@/components/search/command-search";
import { useCart } from "@/store/cart";

export function Navbar() {
    const { items, openCart } = useCart();

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow-sm">
            {/* Fila 1: Logo, Búsqueda (Desktop) e Iconos */}
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* 1. Logo */}
                <Link href="/" className="flex items-center gap-2 shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white font-bold">
                        S
                    </div>
                    {/* Hacemos la fuente un pelín más pequeña en celulares para que quepa todo perfecto */}
                    <span className="text-base sm:text-xl font-bold text-gray-900 tracking-tight">
                        Stitch & Style
                    </span>
                </Link>

                {/* 2. Barra de Búsqueda INTELIGENTE (Visible solo en Desktop/Tablet) */}
                <div className="hidden md:flex flex-1 items-center justify-center px-8">
                    <div className="w-full max-w-md">
                        <CommandSearch />
                    </div>
                </div>

                {/* 3. Iconos y Acciones */}
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">

                    {/* 👇 BOTÓN DEL CARRITO: Texto siempre visible */}
                    <button
                        onClick={openCart}
                        className="group relative flex items-center gap-2 px-3 py-2 sm:px-4 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-200 rounded-full transition-all shadow-sm active:scale-95"
                        title="Ver mi pedido"
                    >
                        <ShoppingBag className="h-[18px] w-[18px] sm:h-5 sm:w-5 text-gray-700 group-hover:text-green-700 transition-colors shrink-0" />

                        {/* Texto explícito sin la clase 'hidden' para que siempre se vea */}
                        <span className="text-sm font-bold text-gray-700 group-hover:text-green-700 transition-colors whitespace-nowrap">
                            Mi Pedido
                        </span>

                        {/* Indicador de cantidad siempre al lado del texto */}
                        {items.length > 0 ? (
                            <span className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-[10px] sm:text-xs font-bold text-white shadow-md animate-in zoom-in duration-300">
                                {items.length}
                            </span>
                        ) : (
                            <span className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-[10px] sm:text-xs font-medium text-gray-500">
                                0
                            </span>
                        )}
                    </button>

                    {/* Botón de Usuario */}
                    <button className="hidden sm:block p-2 text-gray-600 hover:text-green-600 transition-colors">
                        <User className="h-5 w-5" />
                    </button>

                </div>

            </div>

            {/* Fila 2: Barra de Búsqueda (Visible SOLO en Celulares - Estilo App) */}
            <div className="md:hidden px-4 pb-3">
                <CommandSearch />
            </div>
        </nav>
    );
}
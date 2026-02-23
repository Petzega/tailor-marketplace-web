"use client" // 👈 Importante: Esto convierte el componente en Cliente para poder usar hooks

import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";
import { CommandSearch } from "@/components/search/command-search";

export function Navbar() {
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

                {/* 3. Iconos (igual que antes) */}
                <div className="flex items-center gap-4">
                    <button className="relative p-2 text-gray-600 hover:text-green-600 transition-colors">
                        <ShoppingBag className="h-5 w-5" />
                        <span className="absolute right-1 top-1 flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                        </span>
                    </button>

                    <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                        <User className="h-5 w-5" />
                    </button>
                </div>

            </div>
        </nav>
    );
}
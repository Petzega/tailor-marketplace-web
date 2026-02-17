"use client" // 👈 Importante: Esto convierte el componente en Cliente para poder usar hooks

import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function Navbar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    // Esta función espera 300ms después de que dejas de escribir para ejecutar la búsqueda
    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);

        if (term) {
            params.set('q', term); // 'q' será el nombre de nuestro parámetro (?q=algo)
        } else {
            params.delete('q');
        }

        replace(`${pathname}?${params.toString()}`);
    }, 300);

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
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Search for fabrics, alterations, or dresses..."
                            className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-4 pr-10 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                            onChange={(e) => handleSearch(e.target.value)} // 👈 Aquí conectamos la lógica
                            defaultValue={searchParams.get('q')?.toString()} // 👈 Para que no se borre al recargar
                        />
                        <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
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
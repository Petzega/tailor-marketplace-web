"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation";

export function CategoryTabs() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Leemos la categoría actual de la URL (o asumimos 'ALL' si no hay ninguna)
    const currentCategory = searchParams.get('category') || 'ALL';

    // Función que actualiza la URL cuando haces clic
    const handleFilter = (category: string) => {
        const params = new URLSearchParams(searchParams.toString()); // Clonamos los params actuales

        if (category === 'ALL') {
            params.delete('category'); // Si elige "Todos", limpiamos el filtro
        } else {
            params.set('category', category); // Si no, agregamos ?category=X
        }

        // Mantenemos la búsqueda (?q=...) si existe, y solo cambiamos la categoría
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap gap-3">
            {/* Botón 1: Productos (READY_MADE) */}
            <button
                onClick={() => handleFilter('READY_MADE')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${currentCategory === 'READY_MADE'
                    ? 'bg-green-600 text-white border-green-600 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-500 hover:text-green-600'
                    }`}
            >
                Ready-to-wear Products
            </button>

            {/* Botón 2: Servicios (SERVICE) */}
            <button
                onClick={() => handleFilter('SERVICE')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${currentCategory === 'SERVICE'
                    ? 'bg-green-600 text-white border-green-600 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-500 hover:text-green-600'
                    }`}
            >
                Sewing Services
            </button>

            {/* Botón 3: Ver Todo (Para limpiar filtros) */}
            <button
                onClick={() => handleFilter('ALL')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${currentCategory === 'ALL'
                    ? 'text-gray-900 underline decoration-green-500 underline-offset-4'
                    : 'text-gray-400 hover:text-gray-600'
                    }`}
            >
                View All
            </button>
        </div>
    );
}
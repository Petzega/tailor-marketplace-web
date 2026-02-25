'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface SearchFiltersProps {
    currentQuery: string;
    currentCategory: string;
}

const CATEGORIES = [
    { id: '', label: 'Todas las categorías' },
    { id: 'READY_MADE', label: 'Productos (Ready-made)' },
    { id: 'SERVICE', label: 'Servicios de Sastrería' },
];

export function SearchFilters({ currentQuery, currentCategory }: SearchFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();



    // Utilidad para modificar un parámetro manteniendo los demás
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleCategoryChange = (categoryId: string) => {
        router.push(`/search?${createQueryString('category', categoryId)}`);
    };

    const clearFilters = () => {
        router.push('/search');
    };

    return (
        <div className="space-y-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm sticky top-24">


            {/* Filtro de Categoría */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Categoría</h3>
                <div className="space-y-3">
                    {CATEGORIES.map((cat) => (
                        <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="category"
                                checked={currentCategory === cat.id}
                                onChange={() => handleCategoryChange(cat.id)}
                                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer"
                            />
                            <span className={`text-sm transition-colors ${currentCategory === cat.id ? 'text-indigo-600 font-medium' : 'text-gray-600 group-hover:text-gray-900'
                                }`}>
                                {cat.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Botón para limpiar */}
            {(currentQuery || currentCategory) && (
                <>
                    <hr className="border-gray-100" />
                    <button
                        onClick={clearFilters}
                        className="w-full py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors font-medium"
                    >
                        Limpiar filtros
                    </button>
                </>
            )}
        </div>
    );
}
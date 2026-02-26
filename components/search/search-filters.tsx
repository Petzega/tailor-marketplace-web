'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Search } from 'lucide-react';

// Importamos el nuevo Select de Shadcn
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface SearchFiltersProps {
    currentQuery: string;
    currentCategory: string;
    currentSort: string;
    currentMin: string;
    currentMax: string;
}

const CATEGORIES = [
    { id: '', label: 'Todas las categorías' },
    { id: 'READY_MADE', label: 'Productos (Ready-made)' },
    { id: 'SERVICE', label: 'Servicios de Sastrería' },
];

export function SearchFilters({ currentQuery, currentCategory, currentSort, currentMin, currentMax }: SearchFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [localQuery, setLocalQuery] = useState(currentQuery);
    const [localMin, setLocalMin] = useState(currentMin);
    const [localMax, setLocalMax] = useState(currentMax);

    const createQueryString = useCallback(
        (paramsToUpdate: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString());

            Object.entries(paramsToUpdate).forEach(([name, value]) => {
                if (value) {
                    params.set(name, value);
                } else {
                    params.delete(name);
                }
            });

            return params.toString();
        },
        [searchParams]
    );

    const handleCategoryChange = (categoryId: string) => {
        router.push(`/search?${createQueryString({ category: categoryId })}`);
    };

    // 👈 Shadcn pasa directamente el valor (string), no un evento (e)
    const handleSortChange = (value: string) => {
        // Si elige "recent" (la opción por defecto), lo vaciamos en la URL
        const sortValue = value === "recent" ? "" : value;
        router.push(`/search?${createQueryString({ sort: sortValue })}`);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/search?${createQueryString({ q: localQuery })}`);
    };

    const handlePriceSubmit = () => {
        router.push(`/search?${createQueryString({ min: localMin, max: localMax })}`);
    };

    const clearFilters = () => {
        setLocalQuery('');
        setLocalMin('');
        setLocalMax('');
        router.push('/search');
    };

    const hasActiveFilters = currentQuery || currentCategory || currentSort || currentMin || currentMax;

    return (
        <div className="space-y-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm sticky top-24">
            {/* Búsqueda */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Término de búsqueda</h3>
                <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                        type="text"
                        value={localQuery}
                        onChange={(e) => setLocalQuery(e.target.value)}
                        placeholder="Ej. Basta, Entallado..."
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </form>
            </div>

            <hr className="border-gray-100" />

            {/* 👈 Nuestro nuevo Select a prueba de WebViews */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Ordenar por</h3>
                <Select
                    value={currentSort || "recent"}
                    onValueChange={handleSortChange}
                >
                    <SelectTrigger className="w-full bg-white border-gray-300 focus:ring-indigo-500 h-10">
                        <SelectValue placeholder="Más recientes" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="recent">Más recientes</SelectItem>
                        <SelectItem value="price_asc">Precio: Menor a Mayor</SelectItem>
                        <SelectItem value="price_desc">Precio: Mayor a Menor</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <hr className="border-gray-100" />

            {/* Rango de Precio */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Rango de precio (S/)</h3>
                <div className="flex items-center gap-2 mb-3">
                    <input
                        type="number"
                        min="0"
                        placeholder="Min"
                        value={localMin}
                        onChange={(e) => setLocalMin(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="number"
                        min="0"
                        placeholder="Max"
                        value={localMax}
                        onChange={(e) => setLocalMax(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button
                    onClick={handlePriceSubmit}
                    className="w-full py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
                >
                    Aplicar precio
                </button>
            </div>

            <hr className="border-gray-100" />

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
                            <span className={`text-sm transition-colors ${
                                currentCategory === cat.id ? 'text-indigo-600 font-medium' : 'text-gray-600 group-hover:text-gray-900'
                            }`}>
                {cat.label}
              </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Botón para limpiar */}
            {hasActiveFilters && (
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
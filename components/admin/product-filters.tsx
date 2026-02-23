'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useRef } from 'react';
import { Search, X } from 'lucide-react';

const CATEGORIES = [
    { value: 'ALL',        label: 'All' },
    { value: 'READY_MADE', label: 'Ready-to-wear' },
    { value: 'SERVICE',    label: 'Service' },
];

export function ProductFilters() {
    const router       = useRouter();
    const pathname     = usePathname();
    const searchParams = useSearchParams();
    const debounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

    const currentQuery    = searchParams.get('q') ?? '';
    const currentCategory = searchParams.get('category') ?? 'ALL';

    // Función central: actualiza la URL con los nuevos parámetros
    const updateParams = useCallback(
        (updates: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString());

            for (const [key, value] of Object.entries(updates)) {
                // Limpiamos valores vacíos o por defecto para mantener la URL limpia
                if (!value || value === 'ALL') {
                    params.delete(key);
                } else {
                    params.set(key, value);
                }
            }

            // Al cambiar un filtro, siempre volvemos a la página 1
            params.delete('page');

            const queryString = params.toString();
            router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, {
                scroll: false,
            });
        },
        [pathname, router, searchParams]
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        const value = e.target.value;
        // Debounce de 400ms para no disparar una request por cada tecla
        debounceRef.current = setTimeout(() => {
            updateParams({ q: value });
        }, 400);
    };

    return (
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between bg-white">

            {/* Barra de Búsqueda */}
            <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    defaultValue={currentQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by product name, SKU..."
                    className="w-full pl-10 pr-9 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                />
                {currentQuery && (
                    <button
                        onClick={() => updateParams({ q: null })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Clear search"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Botones de Categoría */}
            <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map(({ value, label }) => (
                    <button
                        key={value}
                        onClick={() => updateParams({ category: value })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                            currentCategory === value
                                ? 'bg-green-600 text-white border-green-600 shadow-sm'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}

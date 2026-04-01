'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useRef } from 'react';
import { Search, X } from 'lucide-react';

export function CustomerFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const currentQuery = searchParams.get('q') ?? '';

    // Actualiza la URL silenciosamente
    const updateParams = useCallback((value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());

        if (!value) {
            params.delete('q');
        } else {
            params.set('q', value);
        }

        params.delete('page'); // Siempre volver a la página 1 al buscar

        const queryString = params.toString();
        router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, {
            scroll: false,
        });
    }, [pathname, router, searchParams]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        const value = e.target.value;

        // Espera 400ms después de que el usuario deje de escribir para buscar
        debounceRef.current = setTimeout(() => {
            updateParams(value);
        }, 400);
    };

    return (
        <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center">
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                    type="text"
                    defaultValue={currentQuery}
                    onChange={handleSearchChange}
                    placeholder="Buscar por DNI, RUC, nombre o celular..."
                    className="w-full pl-9 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                />

                {/* Botón de la X para limpiar el input rápidamente */}
                {currentQuery && (
                    <button
                        onClick={() => {
                            const input = document.querySelector('input[placeholder^="Buscar"]') as HTMLInputElement;
                            if (input) input.value = '';
                            updateParams(null);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Limpiar búsqueda"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}
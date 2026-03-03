'use client';

import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { SearchFilters } from './search-filters';

interface MobileFiltersProps {
    currentQuery: string;
    currentCategory: string;
    currentSort: string;
    currentMin: string;
    currentMax: string;
    currentGender?: string;       // 👈 Agregados para typescript
    currentClothingType?: string; // 👈 Agregados para typescript
}

export function MobileFilters(props: MobileFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Prevenir el scroll del fondo cuando el modal está abierto
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 shadow-sm transition-colors"
            >
                <Filter size={18} />
                Filtrar Resultados
            </button>

            {/* Overlay oscuro y Panel lateral */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex bg-gray-900/60 backdrop-blur-sm transition-opacity">
                    {/* 👇 MAGIA AQUÍ: mr-auto (pega a la izquierda) y slide-in-from-left */}
                    <div className="w-full max-w-xs h-full bg-gray-50 overflow-y-auto mr-auto flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">

                        {/* Cabecera del modal */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                            <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Contenido */}
                        <div className="p-2">
                            {/* 👇 FUNDAMENTAL: Pasamos onClose para que "Ver resultados" y "Limpiar filtros" puedan cerrar el modal */}
                            <SearchFilters
                                {...props}
                                onClose={() => setIsOpen(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
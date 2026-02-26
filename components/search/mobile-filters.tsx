'use client';

import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { SearchFilters } from './search-filters';
import { useSearchParams } from 'next/navigation';

interface MobileFiltersProps {
    currentQuery: string;
    currentCategory: string;
    currentSort: string;
    currentMin: string;
    currentMax: string;
}

export function MobileFilters(props: MobileFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const searchParams = useSearchParams();

    // Efecto mágico: Si la URL cambia (ej. el usuario aplicó un filtro), cerramos el panel automáticamente
    useEffect(() => {
        setIsOpen(false);
    }, [searchParams]);

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
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 shadow-sm"
            >
                <Filter size={18} />
                Filtrar Resultados
            </button>

            {/* Overlay oscuro y Panel lateral */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex bg-gray-900/60 backdrop-blur-sm transition-opacity">
                    <div className="w-full max-w-xs h-full bg-gray-50 overflow-y-auto ml-auto flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
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

                        {/* Contenido (Tu componente SearchFilters original) */}
                        <div className="p-4">
                            <SearchFilters {...props} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
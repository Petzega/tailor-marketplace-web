'use client';

import { useState, useEffect, useCallback } from 'react';
import { Filter, X } from 'lucide-react';
import { SearchFilters } from './search-filters';

interface MobileFiltersProps {
    currentQuery: string;
    currentCategory: string;
    currentSort: string;
    currentMin: string;
    currentMax: string;
    currentGender?: string;
    currentClothingType?: string;
}

export function MobileFilters(props: MobileFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    // 👇 Nuevo estado para controlar cuándo renderizar el modal en el DOM
    const [shouldRender, setShouldRender] = useState(false);

    // 👇 Función optimizada para abrir el modal
    const handleOpen = () => {
        setShouldRender(true); // Primero lo ponemos en el DOM
        // Pequeño delay para que Tailwind detecte el cambio de estado y anime
        setTimeout(() => setIsOpen(true), 10);
    };

    // 👇 LA CLAVE DEL SUAVIZADO: Función para cerrar con animación
    const handleClose = useCallback(() => {
        setIsOpen(false); // Iniciamos la animación de salida de Tailwind
        // Esperamos 300ms (la duración de la animación) antes de quitarlo del DOM
        setTimeout(() => setShouldRender(false), 300);
    }, []);

    // Prevenir el scroll del fondo cuando el modal está abierto
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <>
            <button
                onClick={handleOpen} // 👈 Usamos handleOpen
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 shadow-sm transition-colors active:scale-[0.98]"
            >
                <Filter size={18} />
                Filtrar Resultados
            </button>

            {/* Overlay oscuro y Panel lateral con suavizado */}
            {shouldRender && (
                // 👇 Overlay con animación de fade (in/out)
                <div
                    className={`fixed inset-0 z-50 flex transition-all duration-300 ease-in-out ${
                        isOpen ? 'bg-gray-900/60 backdrop-blur-sm opacity-100' : 'bg-gray-900/0 backdrop-blur-0 opacity-0'
                    }`}
                    onClick={handleClose} // 👈 Cerrar al tocar afuera
                >
                    {/* 👇 Panel con animación de slide (in/out) y fade (in/out) */}
                    <div
                        className={`w-full max-w-xs h-full bg-gray-50 overflow-y-auto ml-auto flex flex-col shadow-2xl transition-all duration-300 ease-in-out transform ${
                            isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                        }`}
                        onClick={(e) => e.stopPropagation()} // Evitar que el clic adentro cierre el modal
                    >

                        {/* Cabecera del modal */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                            <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
                            <button
                                onClick={handleClose} // 👈 Usamos handleClose
                                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Contenido: Pasamos la prop onClose apuntando a nuestra nueva handleClose */}
                        <div className="p-4 pb-24">
                            <SearchFilters
                                {...props}
                                onClose={handleClose} // 👈 AQUÍ ESTÁ LA MAGIA para aplicar filtros
                            />
                        </div>

                        {/* Footer fijo con botón para cerrar y ver resultados */}
                        <div className="sticky bottom-0 left-0 w-full p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                            <button
                                onClick={handleClose} // 👈 Usamos handleClose
                                className="w-full py-3 text-sm font-bold text-white bg-gray-900 rounded-xl hover:bg-gray-800 shadow-md active:scale-[0.98] transition-all"
                            >
                                Ver Resultados
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}
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
    const [shouldRender, setShouldRender] = useState(false);

    const handleOpen = () => {
        setShouldRender(true);
        setTimeout(() => setIsOpen(true), 10);
    };

    const handleClose = useCallback(() => {
        setIsOpen(false);
        setTimeout(() => setShouldRender(false), 300);
    }, []);

    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <>
            <button
                onClick={handleOpen}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 shadow-sm transition-colors active:scale-[0.98]"
            >
                <Filter size={18} />
                Filtrar Resultados
            </button>

            {shouldRender && (
                <div
                    className={`fixed inset-0 z-50 flex transition-all duration-300 ease-in-out ${
                        isOpen ? 'bg-gray-900/60 backdrop-blur-sm opacity-100' : 'bg-gray-900/0 backdrop-blur-0 opacity-0'
                    }`}
                    onClick={handleClose}
                >
                    <div
                        className={`w-full max-w-xs h-full bg-gray-50 overflow-y-auto ml-auto flex flex-col shadow-2xl transition-all duration-300 ease-in-out transform ${
                            isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                            <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
                            <button
                                onClick={handleClose}
                                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 pb-10">
                            <SearchFilters
                                {...props}
                                onClose={handleClose}
                            />
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}
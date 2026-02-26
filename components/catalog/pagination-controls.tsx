'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
}

export function PaginationControls({ totalPages, currentPage }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    const navigateToPage = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', pageNumber.toString());
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="flex items-center justify-center gap-3 mt-12 pt-8 border-t border-gray-100">
            {/* Botón Anterior */}
            <button
                onClick={() => navigateToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="group flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
            >
                <ChevronLeft size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                Anterior
            </button>

            {/* Indicador de Página (Estilo "Pill") */}
            <div className="hidden sm:flex items-center px-4 py-2.5 bg-gray-50/80 border border-gray-100 rounded-xl">
                <span className="text-sm text-gray-500">
                    Página <strong className="font-semibold text-gray-900">{currentPage}</strong> de <strong className="font-semibold text-gray-900">{totalPages}</strong>
                </span>
            </div>

            {/* Botón Siguiente */}
            <button
                onClick={() => navigateToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="group flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
            >
                Siguiente
                <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
        </div>
    );
}
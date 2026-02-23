'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductPaginationProps {
    currentPage:  number;
    totalPages:   number;
    totalItems:   number;
    itemsPerPage: number;
}

export function ProductPagination({
                                      currentPage,
                                      totalPages,
                                      totalItems,
                                      itemsPerPage,
                                  }: ProductPaginationProps) {
    const router       = useRouter();
    const pathname     = usePathname();
    const searchParams = useSearchParams();

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        // Página 1 no necesita el param en la URL (URL más limpia)
        if (page <= 1) {
            params.delete('page');
        } else {
            params.set('page', page.toString());
        }
        const queryString = params.toString();
        router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, {
            scroll: false,
        });
    };

    const from = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const to   = Math.min(currentPage * itemsPerPage, totalItems);

    // Genera los números de página con "..." para listas largas
    // Ej: [1, '...', 4, 5, 6, '...', 20]
    const getPageNumbers = (): (number | '...')[] => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        const pages: (number | '...')[] = [1];
        if (currentPage > 3)           pages.push('...');
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }
        if (currentPage < totalPages - 2) pages.push('...');
        pages.push(totalPages);
        return pages;
    };

    return (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <span className="text-xs text-gray-500">
                {totalItems === 0
                    ? 'No products found'
                    : `Showing ${from}–${to} of ${totalItems} products`}
            </span>

            {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                    {/* Botón Previous */}
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                        <ChevronLeft size={12} /> Prev
                    </button>

                    {/* Números de Página */}
                    {getPageNumbers().map((p, i) =>
                        p === '...' ? (
                            <span key={`dots-${i}`} className="px-1.5 text-xs text-gray-400 select-none">
                                …
                            </span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => goToPage(p)}
                                className={`w-8 h-8 text-xs rounded-lg border font-medium transition-all ${
                                    p === currentPage
                                        ? 'bg-green-600 text-white border-green-600 shadow-sm'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {p}
                            </button>
                        )
                    )}

                    {/* Botón Next */}
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                        Next <ChevronRight size={12} />
                    </button>
                </div>
            )}
        </div>
    );
}

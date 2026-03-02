'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect, useId } from 'react';
import { Search } from 'lucide-react';
import { GENDERS, CLOTHING_TYPES } from '@/lib/constants';

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
    currentGender?: string;
    currentClothingType?: string;
    onClose?: () => void;
}

const CATEGORIES = [
    { id: '', label: 'Todas las categorías' },
    { id: 'READY_MADE', label: 'Productos (Ready-made)' },
    { id: 'SERVICE', label: 'Servicios de Sastrería' },
];

export function SearchFilters({
                                  currentQuery, currentCategory, currentSort, currentMin, currentMax,
                                  currentGender = "", currentClothingType = "",
                                  onClose
                              }: SearchFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const uniqueId = useId();

    const [localQuery, setLocalQuery] = useState(currentQuery);
    const [localMin, setLocalMin] = useState(currentMin);
    const [localMax, setLocalMax] = useState(currentMax);

    const [localCategory, setLocalCategory] = useState(currentCategory);

    useEffect(() => {
        setLocalCategory(currentCategory);
    }, [currentCategory]);

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

            params.delete('page');
            return params.toString();
        },
        [searchParams]
    );

    const handleCategoryChange = (categoryId: string) => {
        setLocalCategory(categoryId);
        router.push(`/search?${createQueryString({ category: categoryId })}`, { scroll: false });
    };

    const handleSortChange = (value: string) => {
        const sortValue = value === "recent" ? "" : value;
        router.push(`/search?${createQueryString({ sort: sortValue })}`, { scroll: false });
    };

    const handleGenderChange = (value: string) => {
        const genderValue = value === "all" ? "" : value;
        router.push(`/search?${createQueryString({ gender: genderValue })}`, { scroll: false });
    };

    const handleClothingTypeChange = (value: string) => {
        const typeValue = value === "all" ? "" : value;
        router.push(`/search?${createQueryString({ type: typeValue })}`, { scroll: false });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/search?${createQueryString({ q: localQuery })}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onClose?.();
    };

    const handlePriceSubmit = () => {
        router.push(`/search?${createQueryString({ min: localMin, max: localMax })}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onClose?.();
    };

    const clearFilters = () => {
        setLocalQuery('');
        setLocalMin('');
        setLocalMax('');
        setLocalCategory('');
        router.push('/search');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onClose?.();
    };

    const hasActiveFilters = currentQuery || currentCategory || currentSort || currentMin || currentMax || currentGender || currentClothingType;

    const formatLabel = (text: string) => {
        return text.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="space-y-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm sticky top-24">
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Buscar</h3>
                <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                        type="text"
                        value={localQuery}
                        onChange={(e) => setLocalQuery(e.target.value)}
                        placeholder="Ej. Basta, Entallado..."
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </form>
            </div>

            <hr className="border-gray-100" />

            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Categoría General</h3>
                <div className="space-y-3">
                    {CATEGORIES.map((cat) => (
                        <div key={cat.id} className="flex items-center gap-3 group">
                            <input
                                type="radio"
                                id={`${uniqueId}-category-${cat.id}`}
                                name={`${uniqueId}-category`}
                                value={cat.id}
                                checked={localCategory === cat.id}
                                onChange={() => handleCategoryChange(cat.id)}
                                className="h-4 w-4 text-gray-900 border-gray-300 focus:ring-gray-900 cursor-pointer"
                            />
                            <label
                                htmlFor={`${uniqueId}-category-${cat.id}`}
                                className={`text-sm cursor-pointer transition-colors ${
                                    localCategory === cat.id ? 'text-gray-900 font-bold' : 'text-gray-600 group-hover:text-gray-900'
                                }`}
                            >
                                {cat.label}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {localCategory !== 'SERVICE' && (
                <>
                    <hr className="border-gray-100" />

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Género</h3>
                        <Select value={currentGender || "all"} onValueChange={handleGenderChange}>
                            <SelectTrigger className="w-full bg-white border-gray-300 h-10 focus:ring-gray-900">
                                <SelectValue placeholder="Todos los géneros" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los géneros</SelectItem>
                                {GENDERS.map((g) => (
                                    <SelectItem key={g} value={g}>{formatLabel(g)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Tipo de Prenda</h3>
                        <Select value={currentClothingType || "all"} onValueChange={handleClothingTypeChange}>
                            <SelectTrigger className="w-full bg-white border-gray-300 h-10 focus:ring-gray-900">
                                <SelectValue placeholder="Todas las prendas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las prendas</SelectItem>
                                {CLOTHING_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>{formatLabel(type)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </>
            )}

            <hr className="border-gray-100" />

            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Ordenar por</h3>
                <Select value={currentSort || "recent"} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full bg-white border-gray-300 focus:ring-gray-900 h-10">
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

            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Rango de precio (S/)</h3>
                <div className="flex items-center gap-2 mb-3">
                    <input
                        type="number"
                        min="0"
                        placeholder="Min"
                        value={localMin}
                        onChange={(e) => setLocalMin(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="number"
                        min="0"
                        placeholder="Max"
                        value={localMax}
                        onChange={(e) => setLocalMax(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>

                <button
                    onClick={handlePriceSubmit}
                    className="w-full py-2.5 text-sm text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm active:scale-[0.98]"
                >
                    Aplicar precio
                </button>
            </div>

            {hasActiveFilters && (
                <>
                    <hr className="border-gray-100" />
                    <button
                        onClick={clearFilters}
                        className="w-full py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-900 transition-colors font-medium"
                    >
                        Limpiar filtros
                    </button>
                </>
            )}
        </div>
    );
}
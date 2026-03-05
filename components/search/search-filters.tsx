'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { Search, Filter, X, Trash2 } from 'lucide-react';
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

// Mapeo de IDs a etiquetas legibles
const GENDER_LABELS: Record<string, string> = {
    HOMBRE: 'Hombre',
    MUJER: 'Mujer',
    NINO: 'Niño',
    NINA: 'Niña',
    UNISEX: 'Unisex',
};

const CLOTHING_TYPE_LABELS: Record<string, string> = {
    CAMISA: 'Camisa',
    PANTALON: 'Pantalón',
    SHORT: 'Short',
    LENCERIA: 'Lencería',
    ROPA_INTERIOR: 'Ropa Interior',
    POLO: 'Polo',
    ACCESORIOS: 'Accesorios',
    VESTIDO: 'Vestido',
};

// Ordenamiento alfabético usando las etiquetas mapeadas
const SORTED_GENDERS = [...GENDERS].sort((a, b) => {
    const labelA = GENDER_LABELS[a] || a;
    const labelB = GENDER_LABELS[b] || b;
    return labelA.localeCompare(labelB);
});

const SORTED_CLOTHING_TYPES = [...CLOTHING_TYPES].sort((a, b) => {
    const labelA = CLOTHING_TYPE_LABELS[a] || a;
    const labelB = CLOTHING_TYPE_LABELS[b] || b;
    return labelA.localeCompare(labelB);
});

export function SearchFilters({
                                  currentQuery,
                                  currentCategory,
                                  currentSort,
                                  currentMin,
                                  currentMax,
                                  currentGender = "",
                                  currentClothingType = "",
                                  onClose
                              }: SearchFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [localQuery, setLocalQuery] = useState(currentQuery);
    const [localMin, setLocalMin] = useState(currentMin);
    const [localMax, setLocalMax] = useState(currentMax);
    const [priceError, setPriceError] = useState("");

    useEffect(() => {
        setLocalQuery(currentQuery);
    }, [currentQuery]);

    const createQueryString = useCallback(
        (params: Record<string, string | null>) => {
            const newSearchParams = new URLSearchParams(searchParams.toString());

            Object.entries(params).forEach(([key, value]) => {
                if (value === null || value === '' || value === 'ALL') {
                    newSearchParams.delete(key);
                } else {
                    newSearchParams.set(key, value);
                }
            });

            newSearchParams.set('page', '1');
            return newSearchParams.toString();
        },
        [searchParams]
    );

    // Aplica los selectores instantáneamente de fondo sin cerrar el modal
    const handleFilterChange = (key: string, value: string) => {
        router.push(`/search?${createQueryString({ [key]: value })}`, { scroll: false });
    };

    // Función unificada: Aplica los precios y cierra el modal (si estamos en móvil)
    const handleApplyAndClose = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const min = parseFloat(localMin);
        const max = parseFloat(localMax);

        if (localMin && localMax && min > max) {
            setPriceError("El mínimo no puede ser mayor al máximo");
            return;
        }

        setPriceError("");
        router.push(`/search?${createQueryString({ min: localMin, max: localMax })}`, { scroll: false });

        if (onClose) onClose();
    };

    const clearFilters = () => {
        setLocalQuery("");
        setLocalMin("");
        setLocalMax("");
        setPriceError("");
        router.push('/search');
        if (onClose) onClose();
    };

    // --- LÓGICA DE VALIDACIÓN AÑADIDA AQUÍ ---

    // 1. Validar si el rango de precios tiene un error lógico
    const minVal = parseFloat(localMin);
    const maxVal = parseFloat(localMax);
    const isPriceInvalid = localMin !== "" && localMax !== "" && minVal > maxVal;

    // 2. Validar si el usuario ha ingresado o seleccionado al menos un filtro
    const hasAnyInput =
        localQuery.trim() !== "" ||
        localMin !== "" ||
        localMax !== "" ||
        currentCategory !== "" ||
        (currentGender && currentGender !== "ALL") ||
        (currentClothingType && currentClothingType !== "ALL");

    // 3. El botón se bloquea si no hay inputs o si el precio es inválido
    const isButtonDisabled = !hasAnyInput || isPriceInvalid;

    // Mantenemos la variable original para el botón de limpiar
    const hasActiveFilters = currentQuery || currentCategory || currentMin || currentMax || currentGender || currentClothingType;

    return (
        <div className="flex flex-col gap-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between lg:hidden">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <Filter size={18} /> Filtros
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                    <X size={20} />
                </button>
            </div>

            <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Búsqueda rápida</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleFilterChange('q', localQuery); }} className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Nombre, SKU..."
                        value={localQuery}
                        onChange={(e) => setLocalQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                    />
                </form>
            </div>

            <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Género</h3>
                <Select value={currentGender || "ALL"} onValueChange={(val) => handleFilterChange('gender', val)}>
                    <SelectTrigger className="w-full rounded-xl border-gray-200 bg-gray-50">
                        <SelectValue placeholder="Cualquier género" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Todos</SelectItem>
                        {SORTED_GENDERS.map((g) => (
                            <SelectItem key={g} value={g}>
                                {GENDER_LABELS[g] ?? g}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Prenda</h3>
                <Select value={currentClothingType || "ALL"} onValueChange={(val) => handleFilterChange('clothingType', val)}>
                    <SelectTrigger className="w-full rounded-xl border-gray-200 bg-gray-50">
                        <SelectValue placeholder="Tipo de prenda" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Todas</SelectItem>
                        {SORTED_CLOTHING_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                                {CLOTHING_TYPE_LABELS[t] ?? t}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Categoría</h3>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleFilterChange('category', cat.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${(currentCategory === cat.id || (!currentCategory && cat.id === ''))
                                ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Rango de precio</h3>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={localMin}
                        onChange={(e) => setLocalMin(e.target.value)}
                        className={`w-full px-3 py-2.5 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${priceError ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 focus:ring-gray-900'
                        }`}
                    />
                    <span className="text-gray-400">—</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={localMax}
                        onChange={(e) => setLocalMax(e.target.value)}
                        className={`w-full px-3 py-2.5 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${priceError ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 focus:ring-gray-900'
                        }`}
                    />
                </div>
                {priceError && <p className="text-[10px] text-red-500 font-medium px-1">{priceError}</p>}
            </div>

            {/* 👇 ZONA INFERIOR UNIFICADA (Para Escritorio y Móvil) */}
            <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col gap-3">

                {/* Botón principal unificado con validación */}
                <button
                    onClick={() => handleApplyAndClose()}
                    disabled={isButtonDisabled}
                    className="w-full py-3.5 text-sm rounded-xl font-bold transition-all shadow-md
                               enabled:bg-gray-900 enabled:text-white enabled:hover:bg-black enabled:active:scale-95
                               disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none border disabled:border-gray-200"
                >
                    {isPriceInvalid
                        ? "Precio mínimo mayor al máximo"
                        : !hasAnyInput
                            ? "Ingresa un filtro"
                            : "Ver resultados"}
                </button>

                {/* Botón de limpiar destacado */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-100 shadow-sm active:scale-95"
                    >
                        <Trash2 size={16} />
                        Limpiar todos los filtros
                    </button>
                )}
            </div>
        </div>
    );
}
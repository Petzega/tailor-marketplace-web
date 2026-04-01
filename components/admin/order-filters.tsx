"use client"

import { Search, X, Calendar } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";

const STATUS_OPTIONS = [
    { value: 'PENDING', label: 'Pendientes' },
    { value: 'IN_PROGRESS', label: 'En Proceso' },
    { value: 'COMPLETED', label: 'Completadas' },
    { value: 'CANCELLED', label: 'Canceladas' }
];

export function OrderFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [term, setTerm] = useState(searchParams.get('q') || '');
    const [start, setStart] = useState(searchParams.get('start') || '');
    const [end, setEnd] = useState(searchParams.get('end') || '');
    // Extraemos los estados de la URL (ej: status=PENDING,COMPLETED)
    const [statuses, setStatuses] = useState<string[]>(searchParams.get('status')?.split(',').filter(Boolean) || []);

    const applyFilters = (newTerm: string, newStart: string, newEnd: string, newStatuses: string[]) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', '1');

        if (newTerm) params.set('q', newTerm); else params.delete('q');
        if (newStart) params.set('start', newStart); else params.delete('start');
        if (newEnd) params.set('end', newEnd); else params.delete('end');
        if (newStatuses.length > 0) params.set('status', newStatuses.join(',')); else params.delete('status');

        startTransition(() => {
            router.replace(`/ame-studio-ops/orders?${params.toString()}`);
        });
    };

    const handleSearch = (value: string) => {
        setTerm(value);
        applyFilters(value, start, end, statuses);
    };

    const toggleStatus = (value: string) => {
        const newStatuses = statuses.includes(value)
            ? statuses.filter(s => s !== value)
            : [...statuses, value];
        setStatuses(newStatuses);
        applyFilters(term, start, end, newStatuses);
    };

    const clearFilters = () => {
        setStart('');
        setEnd('');
        setStatuses([]);
        applyFilters(term, '', '', []);
    };

    return (
        <div className="p-4 border-b border-gray-100 bg-white space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">

                {/* 1. Buscador */}
                <div className="relative w-full max-w-md">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isPending ? 'text-green-500 animate-pulse' : 'text-gray-400'}`} size={16} />
                    <input
                        type="text"
                        value={term}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Buscar por ID, DNI/RUC, Celular o Nombre..."
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                    />
                </div>

                {/* 2. Rango de Fechas (DatePickers Nativos) */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Calendar size={16} className="text-gray-400 hidden md:block mr-1" />
                    <input
                        type="date"
                        value={start}
                        onChange={(e) => {
                            setStart(e.target.value);
                            applyFilters(term, e.target.value, end, statuses);
                        }}
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 transition-all text-gray-700 w-full md:w-auto cursor-pointer"
                    />
                    <span className="text-gray-400 text-sm">a</span>
                    <input
                        type="date"
                        value={end}
                        onChange={(e) => {
                            setEnd(e.target.value);
                            applyFilters(term, start, e.target.value, statuses);
                        }}
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 transition-all text-gray-700 w-full md:w-auto cursor-pointer"
                    />
                </div>
            </div>

            {/* 3. Selección Múltiple de Estados */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-50">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2">Filtrar Estados:</span>
                {STATUS_OPTIONS.map((opt) => {
                    const isSelected = statuses.includes(opt.value);
                    return (
                        <button
                            key={opt.value}
                            onClick={() => toggleStatus(opt.value)}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                                isSelected
                                    ? 'bg-green-50 border-green-300 text-green-700 shadow-sm ring-1 ring-green-500/20'
                                    : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            {opt.label}
                        </button>
                    );
                })}

                {/* Botón para limpiar filtros (Solo aparece si hay filtros activos) */}
                {(start || end || statuses.length > 0) && (
                    <button
                        onClick={clearFilters}
                        className="ml-auto flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-700 transition-colors px-2 py-1 bg-red-50 rounded-md"
                    >
                        <X size={14} /> Limpiar Filtros
                    </button>
                )}
            </div>
        </div>
    );
}
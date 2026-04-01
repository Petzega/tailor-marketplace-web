"use client"

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";

export function OrderSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [term, setTerm] = useState(searchParams.get('q') || '');

    const handleSearch = (value: string) => {
        setTerm(value);

        const params = new URLSearchParams(searchParams.toString());
        params.set('page', '1');

        if (value) {
            params.set('q', value);
        } else {
            params.delete('q');
        }

        startTransition(() => {
            router.replace(`/ame-studio-ops/orders?${params.toString()}`);
        });
    };

    return (
        <div className="relative max-w-md w-full">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isPending ? 'text-green-500 animate-pulse' : 'text-gray-400'}`} size={16} />
            <input
                type="text"
                value={term}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar por ID, DNI / RUC / CE, Celular o Nombre..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
            />
        </div>
    );
}
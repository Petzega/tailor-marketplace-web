"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 text-sm font-medium cursor-pointer bg-transparent border-none p-0"
        >
            <ArrowLeft size={16} /> Regresar
        </button>
    );
}
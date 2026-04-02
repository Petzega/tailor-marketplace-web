"use client";

import { AlertTriangle } from "lucide-react";

interface UnsavedChangesModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function UnsavedChangesModal({ isOpen, onConfirm, onCancel }: UnsavedChangesModalProps) {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 flex items-center justify-center p-4" style={{ zIndex: 999 }}>
            {/* Fondo que desenfoca solo el contenido del sheet */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" onClick={onCancel}></div>

            {/* Caja del Modal en el centro */}
            <div className="relative w-[90%] max-w-sm bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Cambios sin guardar</h3>
                    <p className="text-sm text-gray-500 leading-snug">
                        Tienes cambios pendientes. ¿Estás seguro de que deseas salir y perderlos?
                    </p>
                </div>

                <div className="p-4 bg-gray-50 flex gap-3 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Seguir editando
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors shadow-sm"
                    >
                        Salir sin guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
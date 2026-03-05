"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Check, AlertCircle } from "lucide-react";
// 👇 Importamos nuestro texto centralizado
import { TermsContent } from "@/components/shared/terms-content";

interface TermsModalProps {
    isOpen: boolean;
    onAccept: () => void;
}

export function TermsModal({ isOpen, onAccept }: TermsModalProps) {
    const [canAccept, setCanAccept] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setCanAccept(false);

            setTimeout(() => {
                if (scrollContainerRef.current) {
                    const { scrollHeight, clientHeight } = scrollContainerRef.current;
                    if (scrollHeight <= clientHeight + 20) {
                        setCanAccept(true);
                    }
                }
            }, 100);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 30) {
            setCanAccept(true);
        }
    };

    if (!isOpen || typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center sm:p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white w-full h-full sm:h-auto sm:rounded-2xl sm:max-w-3xl sm:shadow-2xl flex flex-col sm:max-h-[90vh] animate-in sm:zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50 sm:rounded-t-2xl">
                    <div>
                        <h2 className="text-lg font-black text-gray-900 tracking-tight">Términos y Condiciones</h2>
                        <p className="text-xs text-gray-500 mt-1">
                            {!canAccept ? "Debes leer hasta el final para poder aceptar." : "¡Gracias por leer!"}
                        </p>
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="p-6 sm:p-8 overflow-y-auto flex-1 relative"
                >
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 mb-8">
                        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                        <p className="text-sm text-amber-800 leading-snug">
                            Desliza hasta el final del documento para habilitar el botón de aceptación y continuar con tu compra.
                        </p>
                    </div>

                    {/* 👇 AQUÍ RENDERIZAMOS EL TEXTO CENTRALIZADO */}
                    <TermsContent />

                    <div className="h-8"></div>
                </div>

                <div className="p-5 border-t border-gray-100 bg-white sm:rounded-b-2xl">
                    <button
                        onClick={onAccept}
                        disabled={!canAccept}
                        className={`w-full flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-bold shadow-sm transition-all ${
                            canAccept
                                ? "bg-green-600 hover:bg-green-700 text-white shadow-green-200 active:scale-[0.98]"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        {canAccept ? <Check size={18} /> : null}
                        {canAccept ? "Aceptar y Cerrar" : "Sigue bajando para aceptar..."}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
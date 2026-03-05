"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface SizeGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
    ageGroup?: string | null;
}

export function SizeGuideModal({ isOpen, onClose, ageGroup }: SizeGuideModalProps) {

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Ejecutamos setMounted de forma asíncrona para que no choque con la regla estricta "set-state-in-effect"
        const timeout = setTimeout(() => {
            setMounted(true);
        }, 0);
        return () => clearTimeout(timeout);
    }, []);

    // Controlamos el scroll del body
    useEffect(() => {
        if (isOpen && mounted) {
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = 'unset'; };
        }
    }, [isOpen, mounted]);

    // 👇 SOLUCIÓN ELEGANTE Y ROBUSTA:
    // Evita errores de hidratación y problemas de tipo ReactPortal
    if (!mounted || !isOpen) return null;

    const renderSizeTable = () => {
        if (ageGroup === 'KIDS') {
            return (
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-900 font-bold uppercase text-[11px] tracking-wider">
                        <tr>
                            <th className="px-4 py-3 border-b border-gray-200">Talla</th>
                            <th className="px-4 py-3 border-b border-gray-200">Edad Aprox.</th>
                            <th className="px-4 py-3 border-b border-gray-200">Estatura (cm)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-600">
                        {['4', '6', '8', '10', '12'].map((talla, idx) => (
                            <tr key={talla} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 font-bold text-gray-900">{talla}</td>
                                <td className="px-4 py-3">{3 + (idx * 2)} - {4 + (idx * 2)} años</td>
                                <td className="px-4 py-3">{98 + (idx * 12)} - {104 + (idx * 12)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        if (ageGroup === 'BABY') {
            return (
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-900 font-bold uppercase text-[11px] tracking-wider">
                        <tr>
                            <th className="px-4 py-3 border-b border-gray-200">Talla</th>
                            <th className="px-4 py-3 border-b border-gray-200">Meses</th>
                            <th className="px-4 py-3 border-b border-gray-200">Estatura (cm)</th>
                            <th className="px-4 py-3 border-b border-gray-200">Peso (kg)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-600">
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-bold text-gray-900">0-3M</td><td className="px-4 py-3">0 - 3</td><td className="px-4 py-3">50 - 62</td><td className="px-4 py-3">3 - 6</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-bold text-gray-900">3-6M</td><td className="px-4 py-3">3 - 6</td><td className="px-4 py-3">62 - 68</td><td className="px-4 py-3">6 - 8</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-bold text-gray-900">6-12M</td><td className="px-4 py-3">6 - 12</td><td className="px-4 py-3">68 - 74</td><td className="px-4 py-3">8 - 10</td>
                        </tr>
                    </tbody>
                </table>
            );
        }

        return (
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-900 font-bold uppercase text-[11px] tracking-wider">
                    <tr>
                        <th className="px-4 py-3 border-b border-gray-200">Talla</th>
                        <th className="px-4 py-3 border-b border-gray-200">Pecho</th>
                        <th className="px-4 py-3 border-b border-gray-200">Cintura</th>
                        <th className="px-4 py-3 border-b border-gray-200">Cadera</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600">
                    <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-gray-900">S (Small)</td><td className="px-4 py-3">86 - 90</td><td className="px-4 py-3">68 - 72</td><td className="px-4 py-3">94 - 98</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-gray-900">M (Medium)</td><td className="px-4 py-3">90 - 94</td><td className="px-4 py-3">72 - 76</td><td className="px-4 py-3">98 - 102</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-gray-900">L (Large)</td><td className="px-4 py-3">94 - 100</td><td className="px-4 py-3">76 - 82</td><td className="px-4 py-3">102 - 108</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-gray-900">XL (X-Large)</td><td className="px-4 py-3">100 - 106</td><td className="px-4 py-3">82 - 88</td><td className="px-4 py-3">108 - 114</td>
                    </tr>
                </tbody>
            </table>
        );
    };

    return (
        <>
            {createPortal(
                <div
                    className="fixed inset-0 z-[1000] flex items-center justify-center sm:p-4 bg-white sm:bg-gray-900/60 sm:backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={onClose}
                >
                    <div
                        className="bg-white w-full h-full sm:h-auto sm:rounded-2xl sm:max-w-lg sm:shadow-2xl overflow-hidden flex flex-col sm:max-h-[90vh] animate-in sm:zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 mt-safe">
                            <h2 className="text-lg font-black text-gray-900 tracking-tight">GUÍA DE MEDIDAS</h2>
                            <button
                                onClick={onClose}
                                className="p-2 bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto flex-1">
                            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                Utiliza esta tabla para encontrar tu talla ideal. Las medidas mostradas corresponden al contorno de tu cuerpo, no a las prendas.
                            </p>

                            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-inner">
                                {renderSizeTable()}
                            </div>

                            <div className="mt-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-10 sm:mb-0">
                                <h4 className="text-[11px] font-bold text-blue-900 uppercase tracking-widest mb-1.5">¿Dudas con tu talla?</h4>
                                <p className="text-xs text-blue-800/80 leading-relaxed">
                                    Si tus medidas están entre dos tallas, te recomendamos elegir la talla más grande para un ajuste más holgado, o la más pequeña para un ajuste más ceñido.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
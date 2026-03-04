"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ShoppingCart, Check, Plus, Minus, Calendar, X } from "lucide-react";
import { useCart } from "@/store/cart";
import { SpotlightProduct } from "@/actions/search";

interface ProductOptionsProps {
    product: SpotlightProduct;
    sizes: { size: string; stock: number }[];
    description: string | null;
    isOutOfStock: boolean;
    isService: boolean;
    whatsappLink: string;
    ageGroup?: string | null;
}

// 1. FUNCIÓN INTELIGENTE PARA ORDENAR TALLAS
const sortSizes = (sizesArray: { size: string; stock: number }[]) => {
    // Mapa de prioridad para letras de adulto
    const orderMap: Record<string, number> = { 'UNICA': 0, 'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6 };

    return [...sizesArray].sort((a, b) => {
        // A. Si ambas son letras conocidas (S, M, L), usa el mapa
        if (a.size in orderMap && b.size in orderMap) {
            return orderMap[a.size] - orderMap[b.size];
        }

        // B. Extraemos los números para compararlos matemáticamente (Ej: '10' vs '4' o '0-3M' vs '3-6M')
        const numA = parseInt(a.size.replace(/\D/g, ''));
        const numB = parseInt(b.size.replace(/\D/g, ''));

        if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB; // Ahora 4 irá antes que 10
        }

        // C. Por defecto ordenamiento alfabético
        return a.size.localeCompare(b.size);
    });
};

export function ProductOptions({ product, sizes, description, isOutOfStock, isService, whatsappLink, ageGroup }: ProductOptionsProps) {
    const addItem = useCart((state) => state.addItem);
    const [added, setAdded] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Aplicamos el ordenamiento a las tallas recibidas de la base de datos
    const sortedSizes = sortSizes(sizes);

    useEffect(() => {
        setMounted(true);
        if (showSizeGuide) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [showSizeGuide]);

    // Usamos sortedSizes en lugar de sizes para la lógica
    const firstAvailableSize = sortedSizes.find(s => s.stock > 0)?.size || (sortedSizes.length > 0 ? sortedSizes[0].size : '');
    const [selectedSize, setSelectedSize] = useState<string>(firstAvailableSize);

    const currentSizeData = sortedSizes.find(s => s.size === selectedSize);
    const currentStock = currentSizeData ? currentSizeData.stock : 0;
    const isCurrentSizeOutOfStock = currentStock === 0;

    useEffect(() => {
        if (quantity > currentStock && currentStock > 0) {
            setQuantity(1);
        }
    }, [selectedSize, currentStock, quantity]);

    const handleAdd = () => {
        if (isCurrentSizeOutOfStock) return;

        addItem(product, quantity, isService ? undefined : selectedSize);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
        setQuantity(1);
    };

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
                        <td className="px-4 py-3 font-bold text-gray-900">0-3M</td>
                        <td className="px-4 py-3">0 - 3</td><td className="px-4 py-3">50 - 62</td><td className="px-4 py-3">3 - 6</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-gray-900">3-6M</td>
                        <td className="px-4 py-3">3 - 6</td><td className="px-4 py-3">62 - 68</td><td className="px-4 py-3">6 - 8</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-gray-900">6-12M</td>
                        <td className="px-4 py-3">6 - 12</td><td className="px-4 py-3">68 - 74</td><td className="px-4 py-3">8 - 10</td>
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
                    <td className="px-4 py-3 font-bold text-gray-900">S (Small)</td>
                    <td className="px-4 py-3">86 - 90</td><td className="px-4 py-3">68 - 72</td><td className="px-4 py-3">94 - 98</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-900">M (Medium)</td>
                    <td className="px-4 py-3">90 - 94</td><td className="px-4 py-3">72 - 76</td><td className="px-4 py-3">98 - 102</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-900">L (Large)</td>
                    <td className="px-4 py-3">94 - 100</td><td className="px-4 py-3">76 - 82</td><td className="px-4 py-3">102 - 108</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-900">XL (X-Large)</td>
                    <td className="px-4 py-3">100 - 106</td><td className="px-4 py-3">82 - 88</td><td className="px-4 py-3">108 - 114</td>
                </tr>
                </tbody>
            </table>
        );
    };

    return (
        <div className="flex flex-col gap-5">
            {/* 1. SELECTOR DE TALLAS */}
            {!isService && sortedSizes.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Selecciona tu Talla</h3>
                        <button
                            type="button"
                            onClick={() => setShowSizeGuide(true)}
                            className="text-[11px] font-bold text-gray-500 underline underline-offset-2 hover:text-gray-900 transition-colors"
                        >
                            Guía de medidas
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {sortedSizes.map((sizeObj) => {
                            const isSelected = selectedSize === sizeObj.size;
                            const isSizeAgotada = sizeObj.stock === 0;

                            return (
                                <button
                                    key={sizeObj.size}
                                    type="button"
                                    onClick={() => setSelectedSize(sizeObj.size)}
                                    disabled={isSizeAgotada}
                                    className={`h-10 px-4 rounded-md border text-xs font-bold transition-all disabled:opacity-40 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                                        isSelected && !isSizeAgotada
                                            ? 'border-gray-900 bg-gray-900 text-white shadow-md ring-2 ring-gray-900 ring-offset-2'
                                            : 'border-gray-200 text-gray-700 bg-white hover:border-gray-400 hover:bg-gray-50'
                                    }`}
                                >
                                    {sizeObj.size}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 2. DESCRIPCIÓN */}
            <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Descripción</h3>
                <p className="text-gray-600 text-[13px] leading-relaxed">
                    {description || 'Detalles premium y acabados de alta calidad diseñados para durar.'}
                </p>
            </div>

            {/* 3. STOCK INDICATOR */}
            {!isService && (
                <div className="flex items-center gap-2 bg-gray-50 py-2.5 px-3 rounded-md border border-gray-100 w-fit">
                    <div className={`h-2 w-2 rounded-full ${isCurrentSizeOutOfStock ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                        {isCurrentSizeOutOfStock
                            ? 'Agotado en esta talla'
                            : currentStock < 5
                                ? `¡Últimas ${currentStock} unidades disponibles!`
                                : `Quedan ${currentStock} unidades disponibles`
                        }
                    </span>
                </div>
            )}

            {/* 4. BOTONES DE ACCIÓN */}
            <div className="pt-2">
                {isOutOfStock || (!isService && isCurrentSizeOutOfStock) ? (
                    <button disabled className="w-full h-12 flex items-center justify-center gap-2 bg-gray-100 text-gray-400 font-bold rounded-lg text-sm cursor-not-allowed border border-gray-200">
                        Agotado
                    </button>
                ) : isService ? (
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-12 flex items-center justify-center gap-2 border-2 border-green-500 bg-white hover:bg-green-50 text-green-600 font-bold rounded-xl text-sm transition-all shadow-sm active:scale-[0.98]"
                    >
                        <Calendar size={18} />
                        Agendar Cita en WhatsApp
                    </a>
                ) : (
                    <div className="flex gap-2.5 h-12 w-full">
                        <div className="flex-1 flex gap-2.5">
                            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-2 w-[100px] sm:w-[110px] shrink-0 shadow-sm">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all disabled:opacity-50"
                                    disabled={quantity <= 1}
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="font-bold text-gray-900 text-sm">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                                    disabled={quantity >= currentStock}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <button
                                onClick={handleAdd}
                                className={`flex-1 flex items-center justify-center gap-2 rounded-xl transition-all duration-300 px-2 sm:px-4 text-sm font-bold text-white shadow-md active:scale-[0.98] ${added ? "bg-green-600 hover:bg-green-700" : "bg-gray-900 hover:bg-black"}`}
                            >
                                {added ? <Check size={18} /> : <ShoppingCart size={18} />}
                                <span className="hidden sm:inline">{added ? "Agregado" : "Agregar"}</span>
                            </button>
                        </div>

                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-12 px-4 shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-green-500 bg-white hover:bg-green-50 transition-all text-green-600 shadow-sm active:scale-[0.98]"
                            title="Consultar por WhatsApp"
                        >
                            <svg className="w-4 h-4 fill-current sm:w-5 sm:h-5" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                            </svg>
                            <span className="text-sm font-bold">Consultar</span>
                        </a>
                    </div>
                )}
            </div>

            {/* 5. PORTAL DEL MODAL */}
            {mounted && showSizeGuide && createPortal(
                <div
                    className="fixed inset-0 z-[1000] flex items-center justify-center sm:p-4 bg-white sm:bg-gray-900/60 sm:backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setShowSizeGuide(false)}
                >
                    <div
                        className="bg-white w-full h-full sm:h-auto sm:rounded-2xl sm:max-w-lg sm:shadow-2xl overflow-hidden flex flex-col sm:max-h-[90vh] animate-in sm:zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 mt-safe">
                            <h2 className="text-lg font-black text-gray-900 tracking-tight">GUÍA DE MEDIDAS</h2>
                            <button
                                onClick={() => setShowSizeGuide(false)}
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
        </div>
    );
}
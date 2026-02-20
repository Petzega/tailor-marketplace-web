"use client"

import { deleteProduct } from "@/actions/products";
import { Trash2, Pencil, AlertTriangle, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 👈 Importamos el Router
import { Product } from "@/types";

export function ProductActions({ product }: { product: Product }) {
    const router = useRouter(); // 👈 Inicializamos el Router
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleConfirmDelete = async () => {
        setIsLoading(true);

        // 1. Intentamos borrar en la Base de Datos
        const result = await deleteProduct(product.id);

        // 2. SI Y SOLO SI fue exitoso, cerramos y mandamos el aviso
        if (result?.success) {
            setShowModal(false);
            router.push("/admin?action=deleted", { scroll: false });
        } else {
            setIsLoading(false);
            alert("Hubo un error al eliminar el producto");
        }
    };

    return (
        <>
            <div className="flex items-center justify-end gap-2">
                <Link
                    href={`/admin?edit=${product.id}`}
                    scroll={false}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                >
                    <Pencil size={18} />
                </Link>

                <button
                    onClick={() => setShowModal(true)}
                    disabled={isLoading}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            {/* --- MODAL DE ELIMINAR CON PREVIEW --- */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-200">
                    <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100 w-[90%] max-w-sm animate-in zoom-in-95 text-left">

                        <div className="flex items-start gap-3 text-red-600 mb-4">
                            <div className="p-2 bg-red-50 rounded-full shrink-0"><AlertTriangle size={24} /></div>
                            <div>
                                <h3 className="font-bold text-gray-900 mt-1">¿Eliminar Producto?</h3>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">Esta acción es irreversible. Confirmas eliminar:</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 mb-5">
                            <div className="h-12 w-12 rounded-md bg-white border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                                {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" /> : <ImageIcon size={20} className="text-gray-300" />}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                <p className="text-xs text-gray-500 truncate"><span className="font-mono">{product.sku}</span> • {product.category === 'SERVICE' ? 'Servicio' : 'Producto'}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-2 text-xs font-medium border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
                            <button onClick={handleConfirmDelete} disabled={isLoading} className="flex-1 py-2 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm transition-colors">
                                {isLoading ? 'Eliminando...' : 'Sí, Eliminar'}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}
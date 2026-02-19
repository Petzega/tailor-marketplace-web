"use client";

import { updateProduct } from "@/actions/products";
import { Product } from "@/types";
import { Save, X, AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface EditFormProps {
    product: Product;
}

export function EditProductForm({ product }: EditFormProps) {
    const router = useRouter();

    // Estados para controlar la interfaz
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // 1. Interceptamos el envío para mostrar el Modal primero
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Detenemos el envío real
        setShowModal(true); // Mostramos confirmación
    };

    // 2. Ejecutamos la actualización real
    const handleConfirmUpdate = async () => {
        setIsLoading(true);

        // Recogemos los datos del formulario manualmente
        const form = document.getElementById("edit-form") as HTMLFormElement;
        const formData = new FormData(form);

        const result = await updateProduct(product.id, formData);

        if (result.success) {
            setShowModal(false);
            setShowToast(true); // ¡Éxito!

            // Redirigimos después de 2 segundos para que vean el toast
            setTimeout(() => {
                router.push("/admin");
                router.refresh();
            }, 2000);
        } else {
            setIsLoading(false);
            alert("Hubo un error al actualizar.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

            {/* Header del Formulario */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Editar Producto</h1>
                    <p className="text-sm text-gray-500">Modifica los detalles del producto: <span className="font-mono text-gray-700">{product.sku}</span></p>
                </div>
                <Link href="/admin" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-all shadow-sm border border-transparent hover:border-gray-200">
                    <X size={20} />
                </Link>
            </div>

            {/* Formulario */}
            <form id="edit-form" onSubmit={handleSubmit} className="p-8 space-y-6">

                {/* Imagen y Nombre */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700 uppercase">URL Imagen</label>
                        <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-center">
                            <input
                                name="imageUrl"
                                defaultValue={product.imageUrl || ""}
                                className="w-full text-xs bg-transparent text-center outline-none text-gray-600"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-semibold text-gray-700 uppercase">Nombre del Producto</label>
                        <input
                            name="name"
                            defaultValue={product.name}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>

                {/* Precios y Stock */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700 uppercase">Precio (S/)</label>
                        <input
                            name="price"
                            type="number"
                            step="0.01"
                            defaultValue={product.price}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm font-medium outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700 uppercase">Stock Actual</label>
                        <input
                            name="stock"
                            type="number"
                            defaultValue={product.stock}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm font-medium outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Categoría y Descripción */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-700 uppercase">Categoría</label>
                    <select
                        name="category"
                        defaultValue={product.category}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
                    >
                        <option value="READY_MADE">Ready-to-wear (Producto Físico)</option>
                        <option value="SERVICE">Servicio de Costura</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-700 uppercase">Descripción</label>
                    <textarea
                        name="description"
                        rows={4}
                        defaultValue={product.description || ""}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 resize-none"
                    />
                </div>

                {/* Footer de Botones */}
                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                    <Link href="/admin" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={16} /> Cancelar
                    </Link>
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg shadow-blue-200 transition-all active:scale-95"
                    >
                        <Save size={18} />
                        Guardar Cambios
                    </button>
                </div>
            </form>

            {/* --- MODAL DE CONFIRMACIÓN --- */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 space-y-4 scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 text-amber-600">
                            <div className="p-2 bg-amber-50 rounded-full">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">¿Confirmar cambios?</h3>
                        </div>

                        <p className="text-sm text-gray-500">
                            Estás a punto de actualizar la información de <strong>{product.name}</strong>. Esta acción se reflejará inmediatamente en la tienda.
                        </p>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmUpdate}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-md"
                            >
                                {isLoading ? "Guardando..." : "Sí, Actualizar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TOAST DE ÉXITO --- */}
            {showToast && (
                <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-gray-900 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-4">
                        <div className="p-1 bg-green-500 rounded-full text-white">
                            <CheckCircle size={16} strokeWidth={3} />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">¡Actualización Exitosa!</h4>
                            <p className="text-xs text-gray-300">Redirigiendo al panel...</p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
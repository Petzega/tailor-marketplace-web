"use client";

import { updateProduct } from "@/actions/products";
import { Product } from "@/types";
import { Save, X, AlertTriangle, Link as LinkIcon, Upload, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

interface EditSheetProps {
    product: Product;
}

export function EditProductSheet({ product }: EditSheetProps) {
    const router = useRouter();

    // Estados de UI
    const [inputType, setInputType] = useState<'url' | 'file'>('url');
    const [preview, setPreview] = useState<string | null>(product.imageUrl);

    const urlInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Manejar cambio de archivo local para previsualizarlo
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowModal(true);
    };

    const handleConfirmUpdate = async () => {
        setIsLoading(true);
        const form = document.getElementById("edit-form") as HTMLFormElement;
        const formData = new FormData(form);

        const result = await updateProduct(product.id, formData);

        if (result.success) {
            setShowModal(false);
            // 👇 Redirigimos al instante con el aviso en la URL para el Notificador Global
            router.push("/admin?action=updated", { scroll: false });
            router.refresh();
        } else {
            setIsLoading(false);
            alert("Error al actualizar el producto");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop oscuro */}
            <Link href="/admin" className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" />

            {/* SIDEBAR */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto border-l border-gray-100 flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Editar Producto</h2>
                        <p className="text-xs text-gray-500">SKU: <span className="font-mono">{product.sku}</span></p>
                    </div>
                    <Link href="/admin" className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} />
                    </Link>
                </div>

                {/* Formulario */}
                <form id="edit-form" onSubmit={handleSubmit} className="flex-1 p-6 space-y-6">

                    {/* SECCIÓN IMAGEN CON PESTAÑAS */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Product Image</label>
                            {/* Botones Toggle */}
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button type="button" onClick={() => setInputType('url')} className={`p-1.5 rounded-md transition-all ${inputType === 'url' ? 'bg-white shadow-sm text-green-600' : 'text-gray-400'}`} title="URL"><LinkIcon size={14} /></button>
                                <button type="button" onClick={() => setInputType('file')} className={`p-1.5 rounded-md transition-all ${inputType === 'file' ? 'bg-white shadow-sm text-green-600' : 'text-gray-400'}`} title="Subir"><Upload size={14} /></button>
                            </div>
                        </div>

                        {/* OPCIÓN A: URL */}
                        {inputType === 'url' && (
                            <div onClick={() => urlInputRef.current?.focus()} className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors group cursor-pointer relative">
                                <div className="bg-green-50 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                    <LinkIcon className="text-green-600" size={20} />
                                </div>
                                <input ref={urlInputRef} name="imageUrl" type="url" defaultValue={product.imageUrl || ""} placeholder="Paste image URL (https://...)" className="w-full text-center text-xs bg-transparent outline-none placeholder:text-gray-400 text-gray-700" />
                            </div>
                        )}

                        {/* OPCIÓN B: ARCHIVO */}
                        {inputType === 'file' && (
                            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors group cursor-pointer relative overflow-hidden h-32">
                                {preview && <img src={preview} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-20 transition-opacity" alt="Preview" />}

                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="bg-blue-50 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                        <ImageIcon className="text-blue-600" size={20} />
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium">{preview ? "Click to change image" : "Upload new image"}</p>
                                </div>
                                <input ref={fileInputRef} name="imageFile" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Name</label>
                        <input name="name" type="text" defaultValue={product.name} required className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500" />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Category</label>
                        <select name="category" defaultValue={product.category} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none bg-white focus:border-green-500">
                            <option value="READY_MADE">Ready-to-wear</option>
                            <option value="SERVICE">Service</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Price</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-400 text-sm">S/</span>
                                <input name="price" type="number" step="0.01" defaultValue={product.price} required className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Stock</label>
                            <input name="stock" type="number" defaultValue={product.stock} required className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Description</label>
                        <textarea name="description" rows={4} defaultValue={product.description || ""} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 resize-none" />
                    </div>

                    <div className="pt-4 mt-auto">
                        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-all active:scale-95 shadow-md shadow-green-200">
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>

                </form>

                {/* --- MODAL DE CONFIRMACIÓN --- */}
                {showModal && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-200">
                        <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100 w-[90%] max-w-sm animate-in zoom-in-95 leading-tight">
                            <div className="flex items-start gap-3 text-amber-600 mb-3">
                                <AlertTriangle size={24} className="shrink-0" />
                                <div>
                                    <h3 className="font-bold text-gray-900">¿Confirmar cambios?</h3>
                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                        Estás a punto de actualizar los datos de <strong>{product.name}</strong>. Esta acción es inmediata.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button onClick={() => setShowModal(false)} className="flex-1 py-2 text-xs font-medium border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                                <button onClick={handleConfirmUpdate} disabled={isLoading} className="flex-1 py-2 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm transition-colors">
                                    {isLoading ? 'Saving...' : 'Yes, Update'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
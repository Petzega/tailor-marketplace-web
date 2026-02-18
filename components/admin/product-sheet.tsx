"use client"

import { createProduct } from "@/actions/products";
import Link from "next/link";
import { X, Upload, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export function ProductSheet() {
    const router = useRouter();

    return (
        // 1. EL CONTENEDOR PRINCIPAL (Overlay)
        // z-50 asegura que esté encima de todo. backdrop-blur hace el efecto borroso.
        <div className="fixed inset-0 z-50 flex justify-end">

            {/* 2. El Fondo Oscuro/Blur (Al hacer clic, cierra el panel) */}
            <Link
                href="/admin"
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
            />

            {/* 3. El Panel Lateral (Sidebar) */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto border-l border-gray-100 flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header del Sidebar */}
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">New Product</h2>
                        <p className="text-xs text-gray-500">Create a new item inventory.</p>
                    </div>
                    <Link
                        href="/admin"
                        className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X size={20} />
                    </Link>
                </div>

                {/* Formulario (Con padding para scroll) */}
                <form action={async (formData) => {
                    await createProduct(formData);
                    // Opcional: Cerrar manualmente si la server action no redirige
                    router.replace("/admin");
                }} className="flex-1 p-6 space-y-6">

                    {/* Imagen */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Image</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors group cursor-pointer">
                            <div className="bg-green-50 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                <Upload className="text-green-600" size={20} />
                            </div>
                            <input
                                name="imageUrl"
                                type="url"
                                placeholder="Paste Image URL"
                                className="w-full text-center text-xs bg-transparent outline-none placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Nombre */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Name</label>
                        <input name="name" type="text" required placeholder="Product Name" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                    </div>

                    {/* Categoría */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Category</label>
                        <select name="category" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none bg-white">
                            <option value="READY_MADE">Ready-to-wear</option>
                            <option value="SERVICE">Service</option>
                        </select>
                    </div>

                    {/* Precio y Stock */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Price</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-400 text-sm">S/</span>
                                <input name="price" type="number" step="0.01" required className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Stock</label>
                            <input name="stock" type="number" required placeholder="0" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500" />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Description</label>
                        <textarea name="description" rows={4} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 resize-none" placeholder="Product details..." />
                    </div>

                    {/* Footer del Formulario (Sticky Bottom) */}
                    <div className="pt-4 mt-auto">
                        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-all active:scale-95 shadow-md shadow-green-200">
                            <Save size={18} />
                            Save Product
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
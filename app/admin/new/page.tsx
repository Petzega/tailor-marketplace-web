import { createProduct } from "@/actions/products";
import Link from "next/link";
import { X, Upload, Info } from "lucide-react";

export default function NewProductPage() {
    return (
        <div className="min-h-screen bg-gray-100/50 flex justify-center items-start pt-10 pb-10">

            {/* Contenedor Principal (Simula el panel blanco) */}
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg border border-gray-100 overflow-hidden">

                {/* 1. Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">New Product</h1>
                        <p className="text-sm text-gray-500 mt-1">Add an item to your sewing inventory.</p>
                    </div>
                    <Link href="/admin" className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </Link>
                </div>

                {/* 2. Formulario */}
                <form action={createProduct} className="px-8 py-8 space-y-8">

                    {/* Sección Imagen (Simulación visual de Upload) */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-900">Product Image</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors group">
                            <div className="bg-gray-50 p-3 rounded-full mb-3 group-hover:bg-white transition-colors">
                                <Upload className="text-gray-400 group-hover:text-green-600" size={24} />
                            </div>
                            {/* Truco: Input de URL disfrazado */}
                            <input
                                name="imageUrl"
                                type="url"
                                placeholder="Paste image URL here (https://...)"
                                className="w-full text-center text-sm text-gray-600 bg-transparent outline-none placeholder:text-gray-400"
                            />
                            <p className="text-xs text-gray-400 mt-2">
                                For now, paste a URL directly. (Upload coming soon)
                            </p>
                        </div>
                    </div>

                    {/* Sección Detalles */}
                    <div className="space-y-5">
                        <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2">Product Details</h3>

                        {/* Nombre */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Product Name</label>
                            <input
                                name="name"
                                type="text"
                                required
                                placeholder="e.g. Silk Thread Spool"
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all"
                            />
                        </div>

                        {/* Categoría */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Category</label>
                            <div className="relative">
                                <select
                                    name="category"
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 appearance-none text-gray-600"
                                >
                                    <option value="READY_MADE">Ready-to-wear Product</option>
                                    <option value="SERVICE">Sewing Service</option>
                                </select>
                                {/* Flechita custom para que se vea pro */}
                                <div className="absolute right-4 top-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
                            <textarea
                                name="description"
                                rows={4}
                                placeholder="Describe material quality, dimensions, or service details..."
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 resize-none"
                            />
                        </div>
                    </div>

                    {/* Sección Precios e Inventario */}
                    <div className="space-y-5">
                        <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2">Pricing & Inventory</h3>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Precio */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">Price</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-2.5 text-gray-400 text-sm">$</span>
                                    <input
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="0.00"
                                        className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                                    />
                                </div>
                            </div>

                            {/* Stock */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">Stock Qty</label>
                                <div className="relative">
                                    <input
                                        name="stock"
                                        type="number"
                                        required
                                        placeholder="0"
                                        className="w-full pl-4 pr-12 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                                    />
                                    <span className="absolute right-4 top-2.5 text-gray-400 text-xs font-medium">units</span>
                                </div>
                            </div>
                        </div>

                        {/* Checkbox "Taxable" (Visual por ahora) */}
                        <div className="flex items-start gap-3 pt-2">
                            <input
                                type="checkbox"
                                id="taxable"
                                className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <div>
                                <label htmlFor="taxable" className="text-sm font-medium text-gray-900 block">Taxable Item</label>
                                <p className="text-xs text-gray-500">Apply standard sales tax to this product.</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer de Botones */}
                    <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                        <Link
                            href="/admin"
                            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 shadow-sm shadow-green-200 transition-all active:scale-95"
                        >
                            Save Product
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
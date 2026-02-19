import Link from "next/link";
import { getProducts, getProductById } from "@/actions/products";
import { Plus, Search, Filter, Download, ArrowUpDown } from "lucide-react";
import { ProductSheet } from "@/components/admin/product-sheet";
import { EditProductSheet } from "@/components/admin/edit-product-sheet"; // 👈 Importamos el nuevo Sidebar de Edición
import { ProductActions } from "@/components/admin/product-actions";

interface AdminPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
    // 1. Obtener datos generales
    const products = await getProducts();

    // 2. Leer parámetros de URL
    const params = await searchParams;
    const showNewProductForm = params?.new === 'true';
    const editId = params?.edit;

    // 3. Si hay ID de edición en la URL, buscamos ese producto específico
    let productToEdit = null;
    if (typeof editId === 'string') {
        productToEdit = await getProductById(editId);
    }

    // Cálculos de métricas para las tarjetas
    const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
    const lowStockCount = products.filter(p => p.stock < 5 && p.stock > 0 && p.category !== 'SERVICE').length;

    return (
        <div className="p-8 relative min-h-screen bg-gray-50">

            {/* --- SIDEBARS (Se muestran encima de todo) --- */}

            {/* A. Sidebar de CREAR (Si ?new=true) */}
            {showNewProductForm && <ProductSheet />}

            {/* B. Sidebar de EDITAR (Si ?edit=ID y el producto existe) */}
            {productToEdit && <EditProductSheet product={productToEdit} />}


            {/* --- CONTENIDO PRINCIPAL --- */}
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Encabezado */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                        <p className="text-gray-500 text-sm mt-1">Track stock levels, manage products, and update pricing.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors shadow-sm">
                            <Download size={16} />
                            Export
                        </button>
                        <Link
                            href="/admin?new=true"
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium shadow-sm transition-all active:scale-95"
                        >
                            <Plus size={16} />
                            Add Product
                        </Link>
                    </div>
                </div>

                {/* Tarjetas de Métricas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard label="Total Products" value={products.length.toString()} trend="+12%" />
                    <StatCard label="Low Stock Alerts" value={lowStockCount.toString()} trend="Action required" isAlert />
                    <StatCard label="Total Value" value={`S/ ${totalValue.toLocaleString()}`} trend="Updated just now" />
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                    <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between bg-white">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input type="text" placeholder="Search by product name, SKU..." className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
                        </div>
                        <div className="flex gap-2">
                            <FilterButton label="All Categories" />
                            <FilterButton label="Stock Status" />
                            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                    <th className="px-6 py-4 w-[40px]"><input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" /></th>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">SKU</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Stock Level</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {products.map((product) => {
                                    const isLow = product.stock > 0 && product.stock < 5;
                                    const isOut = product.stock === 0;
                                    const isService = product.category === 'SERVICE';
                                    const percent = Math.min((product.stock / 50) * 100, 100);

                                    return (
                                        <tr key={product.id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-6 py-4"><input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" /></td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                                                        {product.imageUrl && <img src={product.imageUrl} className="h-full w-full object-cover" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                                        <p className="text-xs text-gray-500 truncate max-w-[140px]">{product.description}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">{product.sku || '---'}</span>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">{isService ? 'Sewing Service' : 'Ready-to-wear'}</td>

                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">S/ {product.price.toFixed(2)}</td>

                                            <td className="px-6 py-4 w-48">
                                                {isService ? (
                                                    <span className="text-xs text-gray-400 italic">Unlimited</span>
                                                ) : (
                                                    <div className="space-y-1.5">
                                                        <div className="flex justify-between text-xs">
                                                            <span className={`font-medium ${isLow ? 'text-amber-600' : 'text-green-600'}`}>{product.stock} units</span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                            <div className={`h-full rounded-full transition-all duration-500 ${isOut ? 'bg-gray-300' : isLow ? 'bg-amber-400' : 'bg-green-500'}`} style={{ width: `${isOut ? 0 : Math.max(percent, 5)}%` }} />
                                                        </div>
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                <StatusBadge isOut={isOut} isLow={isLow} isService={isService} />
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                {/* El componente de acciones (Lápiz y Basura) */}
                                                <ProductActions productId={product.id} />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                        <span className="text-xs text-gray-500">Showing 1 to {products.length} of {products.length} entries</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-xs border border-gray-200 rounded bg-white text-gray-500 disabled:opacity-50" disabled>Previous</button>
                            <button className="px-3 py-1 text-xs border border-gray-200 rounded bg-white text-gray-500 disabled:opacity-50" disabled>Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helpers
function StatCard({ label, value, trend, isAlert }: { label: string, value: string, trend: string, isAlert?: boolean }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <div className="mt-2 flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
            <p className={`text-xs mt-1 font-medium ${isAlert ? 'text-red-600' : 'text-green-600'}`}>{trend}</p>
        </div>
    )
}

function FilterButton({ label }: { label: string }) {
    return (
        <button className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 flex items-center gap-2 hover:bg-gray-50">
            {label}<ArrowUpDown size={12} className="text-gray-400" />
        </button>
    )
}

function StatusBadge({ isOut, isLow, isService }: { isOut: boolean, isLow: boolean, isService: boolean }) {
    if (isOut) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">Out of Stock</span>;
    if (isLow) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">Low Stock</span>;
    if (isService) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">Active</span>;
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">In Stock</span>;
}
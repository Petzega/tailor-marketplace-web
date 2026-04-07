import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { getProducts, getProductStats, getProductById } from "@/actions/products";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { Plus, Download } from "lucide-react";
import { ProductSheet } from "@/components/admin/product-sheet";
import { EditProductSheet } from "@/components/admin/edit-product-sheet";
import { ProductActions } from "@/components/admin/product-actions";
import { ActionToast } from "@/components/admin/action-toast";
import { ProductFilters } from "@/components/admin/product-filters";
import { ProductPagination } from "@/components/admin/product-pagination";

interface InventoryPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
    const params = await searchParams;

    const query = typeof params?.q === 'string' ? params.q : undefined;
    const category = typeof params?.category === 'string' ? params.category : undefined;
    const page = typeof params?.page === 'string' ? Math.max(1, parseInt(params.page)) : 1;

    const showNewProductForm = params?.new === 'true';
    const editId = params?.edit;

    const [{ products, total, totalPages }, stats] = await Promise.all([
        getProducts(query, category, page),
        getProductStats(),
    ]);

    let productToEdit = null;
    if (typeof editId === 'string') {
        productToEdit = await getProductById(editId);
    }

    return (
        <div className="p-8 relative min-h-screen bg-gray-50">
            <ActionToast />
            {showNewProductForm && <ProductSheet />}
            {productToEdit && <EditProductSheet product={productToEdit} />}

            <div className="max-w-7xl mx-auto space-y-8">

                {/* Encabezado */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gestión de Inventario</h1>
                        <p className="text-gray-500 text-sm mt-1">Controla el stock, administra productos y actualiza precios.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors shadow-sm">
                            <Download size={16} />
                            Exportar
                        </button>
                        {/* 👇 RUTA CORREGIDA: Ahora apunta a ame-studio-ops/inventory */}
                        <Link
                            href="/ame-studio-ops/inventory?new=true"
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium shadow-sm transition-all active:scale-95"
                        >
                            <Plus size={16} />
                            Agregar Producto
                        </Link>
                    </div>
                </div>

                {/* Stats del Inventario */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard label="Total de Productos" value={stats.total.toString()} trend="En Catálogo" />
                    <StatCard label="Alertas de Stock Bajo" value={stats.lowStockCount.toString()} trend="Requiere acción" isAlert={stats.lowStockCount > 0} />
                    <StatCard label="Valor del Inventario" value={`S/ ${stats.totalValue.toLocaleString()}`} trend="Actualizado" />
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <Suspense fallback={<div className="h-[73px] animate-pulse bg-gray-50 border-b border-gray-100" />}>
                        <ProductFilters />
                    </Suspense>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                <th className="px-6 py-4 w-[40px]"><input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" /></th>
                                <th className="px-6 py-4">Producto</th>
                                <th className="px-6 py-4">SKU</th>
                                <th className="px-6 py-4">Categoría</th>
                                <th className="px-6 py-4">Precio</th>
                                <th className="px-6 py-4">Nivel de Stock</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-16 text-center">
                                        <p className="text-gray-400 text-sm">No se encontraron productos.</p>
                                        {query && (
                                            <p className="text-gray-400 text-xs mt-1">
                                                Sin resultados para <span className="font-medium text-gray-600">&quot;{query}&quot;</span>.
                                            </p>
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => {
                                    const isLow = product.stock > 0 && product.stock < 5;
                                    const isOut = product.stock === 0;
                                    const isService = product.category === 'SERVICE';
                                    const percent = Math.min((product.stock / 50) * 100, 100);

                                    return (
                                        <tr key={product.id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-6 py-4"><input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" /></td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shrink-0 flex items-center justify-center relative">
                                                        {product.imageUrl ? (
                                                            <Image src={product.imageUrl} fill className="object-cover" alt={product.name} />
                                                        ) : (
                                                            <div className="text-gray-300 text-xs">Sin img</div>
                                                        )}
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

                                            <td className="px-6 py-4 text-sm text-gray-600">{isService ? 'Servicio' : 'Prenda'}</td>

                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">S/ {product.price.toFixed(2)}</td>

                                            <td className="px-6 py-4 w-48">
                                                {isService ? (
                                                    <span className="text-xs text-gray-400 italic">Ilimitado</span>
                                                ) : (
                                                    <div className="space-y-1.5">
                                                        <div className="flex justify-between text-xs">
                                                            <span className={`font-medium ${isLow ? 'text-amber-600' : 'text-green-600'}`}>{product.stock} unidades</span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all duration-500 ${isOut ? 'bg-gray-300' : isLow ? 'bg-amber-400' : 'bg-green-500'}`}
                                                                style={{ width: `${isOut ? 0 : Math.max(percent, 5)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                <StatusBadge isOut={isOut} isLow={isLow} isService={isService} />
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <ProductActions product={product} />
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                            </tbody>
                        </table>
                    </div>

                    <Suspense fallback={<div className="h-[57px] animate-pulse bg-gray-50 border-t border-gray-100" />}>
                        <ProductPagination
                            currentPage={page}
                            totalPages={totalPages}
                            totalItems={total}
                            itemsPerPage={ITEMS_PER_PAGE}
                        />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, trend, isAlert }: { label: string; value: string; trend: string; isAlert?: boolean }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <div className="mt-2 flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
            <p className={`text-xs mt-1 font-medium ${isAlert ? 'text-red-600' : 'text-green-600'}`}>{trend}</p>
        </div>
    );
}

function StatusBadge({ isOut, isLow, isService }: { isOut: boolean; isLow: boolean; isService: boolean }) {
    if (isOut) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50   text-red-700   border border-red-100">Agotado</span>;
    if (isLow) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">Stock Bajo</span>;
    if (isService) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50  text-blue-700  border border-blue-100">Activo</span>;
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">En Stock</span>;
}
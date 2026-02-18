import Link from "next/link";
import { getProducts } from "@/actions/products";
import { Plus, Search, Filter, Download, AlertCircle, Package as PackageIcon, DollarSign, MoreVertical } from "lucide-react";
import { ProductSheet } from "@/components/admin/product-sheet"; // 👈 IMPORTANTE

// Definimos los tipos para los searchParams
interface AdminPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
    const products = await getProducts();

    // 1. Resolvemos la promesa de searchParams (Next.js 15+)
    const params = await searchParams;
    // 2. Verificamos si debemos mostrar el slide-over
    const showNewProductForm = params?.new === 'true';

    // Cálculos rápidos
    const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
    const lowStockCount = products.filter(p => p.stock < 5 && p.category !== 'SERVICE').length;

    return (
        <div className="p-8 relative"> {/* relative para contexto */}

            {/* 👇 AQUÍ ESTÁ LA MAGIA: Si el estado es true, mostramos el SlideOver */}
            {showNewProductForm && <ProductSheet />}

            {/* --- EL RESTO DE TU PÁGINA SIGUE IGUAL --- */}

            {/* 1. Encabezado Superior */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Track stock levels, manage products, and update pricing.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
                        <Download size={18} />
                        Export
                    </button>

                    {/* 👇 CAMBIO IMPORTANTE: El botón ahora solo agrega ?new=true a la URL */}
                    <Link
                        href="/admin?new=true"
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium shadow-sm transition-colors"
                    >
                        <Plus size={18} />
                        Add New Product
                    </Link>
                </div>
            </div>

            {/* ... [MANTÉN AQUÍ TODO EL CÓDIGO DE TUS CARDS DE ESTADÍSTICAS Y LA TABLA QUE YA TIENES] ... */}
            {/* ... Solo copia y pega lo que tenías antes debajo del botón "Add New Product" ... */}

            {/* Para ahorrar espacio en este mensaje, asumo que mantienes el código de Cards y Tabla aquí */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* ... Tus Cards ... */}
                {/* (Si necesitas que repita todo el código de la tabla dímelo, pero es el mismo de antes) */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Products</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">{products.length}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><PackageIcon size={24} /></div>
                </div>
                {/* ... etc ... */}
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* ... Tu código de tabla ... */}
                <table className="w-full text-left border-collapse">
                    {/* ... headers ... */}
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <tr>
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Stock</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td className="px-6 py-4">{product.name}</td>
                            <td className="px-6 py-4">S/ {product.price}</td>
                            <td className="px-6 py-4">{product.stock}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
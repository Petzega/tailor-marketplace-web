import Link from "next/link";
import { getProducts } from "@/actions/products";
import { Plus, Search, Filter, Download, AlertCircle, Package as PackageIcon, DollarSign, MoreVertical } from "lucide-react";

export default async function AdminPage() {
    const products = await getProducts();

    // Cálculos rápidos para las tarjetas (simulados)
    const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
    const lowStockCount = products.filter(p => p.stock < 5 && p.category !== 'SERVICE').length;

    return (
        <div className="p-8">
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
                    <Link
                        href="/admin/new"
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium shadow-sm transition-colors"
                    >
                        <Plus size={18} />
                        Add New Product
                    </Link>
                </div>
            </div>

            {/* 2. Tarjetas de Estadísticas (Stats Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card 1: Total Products */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Products</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">{products.length}</h3>
                        <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                            +12% from last month
                        </p>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <PackageIcon size={24} />
                    </div>
                </div>

                {/* Card 2: Low Stock Alerts */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Low Stock Alerts</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">{lowStockCount}</h3>
                        <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> Action required
                        </p>
                    </div>
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                        <AlertCircle size={24} />
                    </div>
                </div>

                {/* Card 3: Total Value */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Value</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">S/ {totalValue.toLocaleString()}</h3>
                        <p className="text-xs text-gray-400 mt-1">Updated just now</p>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                        <DollarSign size={24} />
                    </div>
                </div>
            </div>

            {/* 3. Filtros y Búsqueda */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">

                    {/* Barra de Búsqueda */}
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by product name, SKU..."
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        />
                    </div>

                    {/* Filtros Dropdown (Visuales) */}
                    <div className="flex gap-2 w-full sm:w-auto">
                        <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 outline-none">
                            <option>All Categories</option>
                            <option>Ready-made</option>
                            <option>Services</option>
                        </select>
                        <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 outline-none">
                            <option>Stock Status</option>
                            <option>In Stock</option>
                            <option>Low Stock</option>
                        </select>
                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                {/* 4. Tabla Avanzada */}
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                            <th className="px-6 py-4 w-10"><input type="checkbox" className="rounded border-gray-300" /></th>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">SKU</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Stock Level</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {products.map((product) => {
                            // Lógica visual para la tabla
                            const isLowStock = product.stock > 0 && product.stock < 5;
                            const isOutOfStock = product.stock === 0;
                            const isService = product.category === 'SERVICE';

                            // Calculamos % para la barrita de progreso (máximo arbitrario de 50 para visualización)
                            const stockPercent = Math.min((product.stock / 50) * 100, 100);

                            return (
                                <tr key={product.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-6 py-4"><input type="checkbox" className="rounded border-gray-300" /></td>

                                    {/* Columna Producto (Foto + Nombre + "Subtítulo") */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                                                {product.imageUrl && <img src={product.imageUrl} className="h-full w-full object-cover" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                                <p className="text-xs text-gray-500 truncate max-w-[150px]">{product.description}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                                        SKU-{product.id.substring(0, 4).toUpperCase()}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {isService ? 'Services' : 'Ready-made'}
                                    </td>

                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        S/ {product.price.toFixed(2)}
                                    </td>

                                    {/* Columna Stock (Barra de Progreso) */}
                                    <td className="px-6 py-4">
                                        {isService ? (
                                            <span className="text-xs text-gray-400">Unlimited</span>
                                        ) : (
                                            <div className="w-32">
                                                <div className="flex justify-between mb-1">
                                                    <span className={`text-xs font-medium ${isLowStock ? 'text-amber-600' : 'text-green-600'}`}>
                                                        {product.stock} units
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                    <div
                                                        className={`h-1.5 rounded-full ${isLowStock ? 'bg-amber-400' : isOutOfStock ? 'bg-gray-300' : 'bg-green-500'}`}
                                                        style={{ width: `${isOutOfStock ? 0 : Math.max(stockPercent, 5)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                    </td>

                                    {/* Columna Status (Badge) */}
                                    <td className="px-6 py-4">
                                        {isOutOfStock ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Out of Stock
                                            </span>
                                        ) : isLowStock ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                Low Stock
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                In Stock
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                {/* 5. Paginación (Visual) */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Showing 1 to {products.length} of {products.length} results</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 text-sm text-gray-600 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 bg-green-50 border border-green-500 text-green-700 rounded text-sm font-medium">1</button>
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 text-sm text-gray-600 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
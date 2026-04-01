import { getCustomers, getCustomerById } from "@/actions/customers";
import { CustomerDetailsSheet } from "@/components/admin/customer-details-sheet";
import { Users, Search, Eye, Scissors, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { CustomerFormSheet } from "@/components/admin/customer-form-sheet";

interface CustomersPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
    const params = await searchParams;
    const page = typeof params?.page === 'string' ? Math.max(1, parseInt(params.page)) : 1;
    const query = typeof params?.q === 'string' ? params.q : undefined;

    const { customers, total } = await getCustomers(page, 15, query);

    // Lógica para interceptar la URL de visualización
    const viewId = typeof params?.view === 'string' ? params.view : undefined;
    let customerToView = null;
    if (viewId) {
        customerToView = await getCustomerById(viewId);
    }

    // Lógica exclusiva para NUEVOS clientes
    const isNew = params?.new === 'true';

    return (
        <div className="p-8 relative min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Encabezado */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Users className="text-gray-400" />
                            Directorio de Clientes
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Gestiona el perfil, medidas e historial de compras de tus clientes.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/ame-studio-ops/customers?new=true" className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-bold transition-colors shadow-sm">
                            + Nuevo Cliente
                        </Link>
                    </div>
                </div>

                {/* Tabla y Búsqueda */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                    <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center">
                        <form method="GET" action="/ame-studio-ops/customers" className="relative w-full max-w-lg flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    name="q"
                                    defaultValue={query}
                                    placeholder="Buscar por DNI, RUC, nombre..."
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                                />
                            </div>
                            <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-bold hover:bg-gray-900 transition-colors shadow-sm">
                                Buscar
                            </button>
                            {/* Botón para limpiar la búsqueda y ver a todos de nuevo */}
                            {query && (
                                <Link href="/ame-studio-ops/customers" className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors">
                                    X
                                </Link>
                            )}
                        </form>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                                <th className="px-6 py-4">Documento</th>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Contacto</th>
                                <th className="px-6 py-4 text-center">Historial</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <p className="text-gray-400 text-sm">No se encontraron clientes.</p>
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50/80 transition-colors group">

                                        <td className="px-6 py-4">
                                            <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">{customer.docType}</span>
                                            <span className="text-sm font-bold text-gray-900">{customer.documentNumber}</span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-gray-900">{customer.name}</p>
                                            {customer.measurements ? (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-1">
                                                    Medidas registradas
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded mt-1">
                                                    Sin medidas
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 font-medium">{customer.phone || '—'}</p>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="flex flex-col items-center" title="Órdenes de Tienda">
                                                    <ShoppingBag size={14} className="text-gray-400 mb-0.5" />
                                                    <span className="text-xs font-bold text-gray-700">{customer._count.orders}</span>
                                                </div>
                                                <div className="w-px h-6 bg-gray-200"></div>
                                                <div className="flex flex-col items-center" title="Servicios de Sastrería">
                                                    <Scissors size={14} className="text-gray-400 mb-0.5" />
                                                    <span className="text-xs font-bold text-gray-700">{customer._count.services}</span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/ame-studio-ops/customers?view=${customer.id}`}
                                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors inline-flex items-center justify-center"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Paneles laterales */}
            {customerToView && <CustomerDetailsSheet customer={customerToView} />}
            {isNew && <CustomerFormSheet />}
        </div>
    );
}
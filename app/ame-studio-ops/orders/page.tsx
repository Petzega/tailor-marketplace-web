import { getOrders, getOrderStats, getOrderById } from "@/actions/orders";
import { Download, Search, Eye } from "lucide-react";
import Link from "next/link";
import { OrderDetailsSheet } from "@/components/admin/order-details-sheet";
import { OrderSearch } from "@/components/admin/order-search";
import { Suspense } from "react"; // Requerido por useSearchParams

interface OrdersPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
    const params = await searchParams;
    const page = typeof params?.page === 'string' ? Math.max(1, parseInt(params.page)) : 1;
    const viewId = typeof params?.view === 'string' ? params.view : undefined;
    const query = typeof params?.q === 'string' ? params.q : undefined; // 👈 NUEVO

    // Ejecutamos ambas consultas en paralelo, pasando el query
    const [{ orders }, stats] = await Promise.all([
        getOrders(page, 20, query), // 👈 SE AÑADE EL QUERY AQUÍ
        getOrderStats(),
    ]);

    // Verificamos si hay una orden específica que mostrar en el panel lateral
    let orderToView = null;
    if (viewId) {
        orderToView = await getOrderById(viewId);
    }

    return (
        <div className="p-8 relative min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Encabezado */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gestión de Órdenes</h1>
                        <p className="text-gray-500 text-sm mt-1">Revisa las ventas entrantes de WhatsApp y gestiona los envíos.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors shadow-sm">
                            <Download size={16} />
                            Exportar CSV
                        </button>
                    </div>
                </div>

                {/* Tarjetas de Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard label="Órdenes Totales" value={stats.total.toString()} />
                    <StatCard label="Pendientes" value={stats.pending.toString()} isAlert={stats.pending > 0} />
                    <StatCard label="Completadas" value={stats.completed.toString()} isSuccess />
                    <StatCard label="Ingresos Totales" value={`S/ ${stats.revenue.toLocaleString()}`} />
                </div>

                {/* Tabla de Órdenes */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                    {/* Barra de herramientas / Búsqueda */}
                    <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center">
                        <Suspense fallback={<div className="h-9 w-full max-w-sm bg-gray-100 animate-pulse rounded-lg" />}>
                            <OrderSearch />
                        </Suspense>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                                <th className="px-6 py-4">ID de Orden</th>
                                <th className="px-6 py-4">Fecha y Hora</th>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Entrega</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center">
                                        <p className="text-gray-400 text-sm">Aún no se han recibido órdenes.</p>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => {
                                    // 👇 Formato de fecha y hora local (Perú)
                                    const date = new Date(order.createdAt);
                                    const formattedDate = date.toLocaleDateString("es-PE", { day: '2-digit', month: 'short', year: 'numeric' });
                                    const formattedTime = date.toLocaleTimeString("es-PE", { hour: '2-digit', minute: '2-digit', hour12: true });

                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-gray-900">{order.id}</span>
                                            </td>

                                            <td className="px-6 py-4">
                                                {/* Mostramos la fecha y la hora apiladas para mejor lectura */}
                                                <span className="block text-xs font-medium text-gray-900">{formattedDate}</span>
                                                <span className="block text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{formattedTime}</span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                                                <p className="text-xs text-gray-500">{order.customerPhone}</p>
                                            </td>

                                            <td className="px-6 py-4">
                                                <p className="text-xs text-gray-600 font-medium">{order.deliveryMethod === 'DELIVERY' ? 'Envío a Domicilio' : 'Retiro en Tienda'}</p>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wide">{order.paymentMethod}</p>
                                            </td>

                                            <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                                S/ {order.total.toFixed(2)}
                                            </td>

                                            <td className="px-6 py-4">
                                                <OrderStatusBadge status={order.status} />
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/ame-studio-ops/orders?view=${order.id}`}
                                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors inline-flex items-center justify-center"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Renderizado condicional del panel lateral */}
            {orderToView && <OrderDetailsSheet order={orderToView} />}
        </div>
    );
}

// ─── Componentes Auxiliares ───────────────────────────────────────────────────

function StatCard({ label, value, isAlert, isSuccess }: { label: string; value: string; isAlert?: boolean; isSuccess?: boolean }) {
    let colorClass = "text-gray-900";
    if (isAlert) colorClass = "text-amber-600";
    if (isSuccess) colorClass = "text-green-600";

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-2">{label}</p>
            <h3 className={`text-3xl font-black tracking-tight ${colorClass}`}>{value}</h3>
        </div>
    );
}

function OrderStatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'PENDING':
            return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">Pendiente</span>;
        case 'IN_PROGRESS':
            return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">En Proceso</span>;
        case 'COMPLETED':
            return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 uppercase tracking-wider">Completado</span>;
        case 'CANCELLED':
            return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 uppercase tracking-wider">Cancelado</span>;
        default:
            return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-50 text-gray-700 border border-gray-200 uppercase tracking-wider">{status}</span>;
    }
}
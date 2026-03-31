import { getOrders, getOrderStats } from "@/actions/orders";
import { Download, Search, Eye } from "lucide-react";

interface OrdersPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
    const params = await searchParams;
    const page = typeof params?.page === 'string' ? Math.max(1, parseInt(params.page)) : 1;

    // Ejecutamos ambas consultas en paralelo
    const [{ orders }, stats] = await Promise.all([
        getOrders(page, 20),
        getOrderStats(),
    ]);

    return (
        <div className="p-8 relative min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Encabezado */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                        <p className="text-gray-500 text-sm mt-1">Review incoming WhatsApp orders and track fulfillment.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors shadow-sm">
                            <Download size={16} />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Tarjetas de Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard label="Total Orders" value={stats.total.toString()} />
                    <StatCard label="Pending Validation" value={stats.pending.toString()} isAlert={stats.pending > 0} />
                    <StatCard label="Completed" value={stats.completed.toString()} isSuccess />
                    <StatCard label="Total Revenue" value={`S/ ${stats.revenue.toLocaleString()}`} />
                </div>

                {/* Tabla de Órdenes */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                    {/* Barra de herramientas / Búsqueda */}
                    <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center">
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by Order ID or Code..."
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Validation Code</th>
                                <th className="px-6 py-4">Delivery</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-16 text-center">
                                        <p className="text-gray-400 text-sm">No orders received yet.</p>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => {
                                    // Formato de fecha seguro para el servidor (evita errores de hidratación)
                                    const date = new Date(order.createdAt);
                                    const formattedDate = date.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });

                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-gray-900">{order.id}</span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="text-xs text-gray-500">{formattedDate}</span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                                                <p className="text-xs text-gray-500">{order.customerPhone}</p>
                                            </td>

                                            <td className="px-6 py-4">
                                                    <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 font-mono text-xs font-bold rounded tracking-widest border border-gray-200">
                                                        {order.validationCode}
                                                    </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <p className="text-xs text-gray-600 font-medium">{order.deliveryMethod === 'DELIVERY' ? 'Delivery' : 'Store Pickup'}</p>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wide">{order.paymentMethod}</p>
                                            </td>

                                            <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                                S/ {order.total.toFixed(2)}
                                            </td>

                                            <td className="px-6 py-4">
                                                <OrderStatusBadge status={order.status} />
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors inline-flex items-center justify-center">
                                                    <Eye size={18} />
                                                </button>
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
            return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">Pending</span>;
        case 'IN_PROGRESS':
            return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">In Progress</span>;
        case 'COMPLETED':
            return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 uppercase tracking-wider">Completed</span>;
        case 'CANCELLED':
            return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 uppercase tracking-wider">Cancelled</span>;
        default:
            return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-50 text-gray-700 border border-gray-200 uppercase tracking-wider">{status}</span>;
    }
}
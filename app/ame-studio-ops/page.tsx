"use client";

import { getDashboardAnalytics } from "@/actions/analytics";
import { Package, TrendingUp, TrendingDown, AlertCircle, ShoppingBag, ArrowRight, Calendar, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useRouter, useSearchParams } from "next/navigation";

interface DashboardStats {
    revenue: number;
    completed: number;
    pending: number;
}

interface ProductDetail {
    id: string;
    name: string;
    imageUrl?: string | null;
    soldCount?: number;
    stock?: number;
}

interface DashboardData {
    stats: DashboardStats;
    criticalProducts: ProductDetail[];
    topProducts: ProductDetail[];
    bottomProducts: ProductDetail[];
    chartData: Record<string, unknown>[];
    isDaily: boolean;
}

// Sub-componente para envolver el uso de hooks de URL en Suspense
function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DashboardData | null>(null);

    const startDate = searchParams.get('start') || '';
    const endDate = searchParams.get('end') || '';

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const analyticsData = await getDashboardAnalytics(startDate, endDate);
            setData(analyticsData);
            setLoading(false);
        }
        loadData();
    }, [startDate, endDate]); // Se recarga si la URL cambia

    const handleDateChange = (type: 'start' | 'end', value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(type, value);
        else params.delete(type);
        router.push(`/ame-studio-ops?${params.toString()}`);
    };

    const clearFilters = () => {
        router.push(`/ame-studio-ops`);
    };

    if (loading) {
        return <div className="p-8 min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-8 w-8 bg-green-200 rounded-full animate-bounce" />
                <p className="text-gray-400 font-medium">Calculando métricas...</p>
            </div>
        </div>;
    }

    if (!data) return <div className="p-8">Error cargando datos.</div>;

    const { stats, criticalProducts, topProducts, bottomProducts, chartData, isDaily } = data;

    return (
        <div className="p-8 relative min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Encabezado y Filtro Maestro */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Panel de Control & Analíticas</h1>
                        <p className="text-gray-500 text-sm mt-1">Análisis de rendimiento, ventas y estado del catálogo.</p>
                    </div>

                    {/* Filtro de Fechas */}
                    <div className="bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-1">

                        {/* Contenedor Fecha Inicio - Clickable en toda el área */}
                        <div
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 rounded-lg transition-all cursor-pointer group"
                            onClick={() => (document.getElementById('start-date') as HTMLInputElement)?.showPicker()}
                        >
                            <Calendar size={16} className="text-gray-400 group-hover:text-green-600 transition-colors" />
                            <input
                                id="start-date"
                                type="date"
                                value={startDate}
                                onChange={(e) => handleDateChange('start', e.target.value)}
                                className="pointer-events-none bg-transparent text-sm outline-none text-gray-700 font-medium [&::-webkit-calendar-picker-indicator]:hidden w-[110px]"
                            />
                        </div>

                        <span className="text-gray-300 font-medium px-1">a</span>

                        {/* Contenedor Fecha Fin - Clickable en toda el área */}
                        <div
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 rounded-lg transition-all cursor-pointer group"
                            onClick={() => (document.getElementById('end-date') as HTMLInputElement)?.showPicker()}
                        >
                            <Calendar size={16} className="text-gray-400 group-hover:text-green-600 transition-colors" />
                            <input
                                id="end-date"
                                type="date"
                                value={endDate}
                                onChange={(e) => handleDateChange('end', e.target.value)}
                                className="pointer-events-none bg-transparent text-sm outline-none text-gray-700 font-medium [&::-webkit-calendar-picker-indicator]:hidden w-[110px]"
                            />
                        </div>

                        {/* Botón limpiar */}
                        {(startDate || endDate) && (
                            <button onClick={clearFilters} className="p-1.5 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-colors ml-1" title="Limpiar fechas">
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Resumen Superior Financiero */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0"><TrendingUp size={24} /></div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ingresos del Periodo</p>
                            <h3 className="text-2xl font-black text-gray-900 mt-1">S/ {stats.revenue.toLocaleString()}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0"><ShoppingBag size={24} /></div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Órdenes Pagadas</p>
                            <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.completed}</h3>
                        </div>
                    </div>
                    <Link href="/ame-studio-ops/orders?status=PENDING" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:border-amber-300 transition-colors group cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                        <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0"><AlertCircle size={24} /></div>
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Atención Pendiente</p>
                            <div className="flex justify-between items-center mt-1">
                                <h3 className="text-2xl font-black text-amber-600">{stats.pending}</h3>
                                <ArrowRight size={18} className="text-amber-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Gráfico Dinámico */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <TrendingUp size={16} className="text-green-600" />
                            Evolución de Ingresos
                        </h3>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">
                            Vista {isDaily ? 'Diaria' : 'Mensual'}
                        </span>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(value) => `S/${value}`} />
                                <Tooltip
                                    cursor={{ fill: '#f3f4f6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`S/ ${Number(value).toFixed(2)}`, 'Ingresos']}
                                />
                                <Bar dataKey="Total" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3 Columnas Inferiores */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Top 5 Más Vendidos */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <TrendingUp size={16} className="text-green-600" />
                            Top Ventas del Periodo
                        </h3>
                        <div className="space-y-4 flex-1">
                            {topProducts.length === 0 ? (
                                <p className="text-xs text-gray-500 text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">No hay ventas en estas fechas.</p>
                            ) : (
                                topProducts.map((p: ProductDetail, i: number) => (
                                    <div key={p.id} className="flex items-center gap-3">
                                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-xs font-bold text-green-700 shrink-0">
                                            {i + 1}
                                        </div>
                                        <div className="h-10 w-10 bg-gray-50 rounded flex shrink-0 border border-gray-100 overflow-hidden items-center justify-center">
                                            {p.imageUrl ? <Image src={p.imageUrl} alt={p.name || "Producto"} width={40} height={40} className="object-cover h-full w-full" /> : <Package size={14} className="text-gray-400" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                                            <p className="text-xs text-green-700 font-medium">{p.soldCount} unidades</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Peores 5 */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <TrendingDown size={16} className="text-amber-600" />
                            Menor Movimiento
                        </h3>
                        <div className="space-y-4 flex-1">
                            {bottomProducts.map((p: ProductDetail, i: number) => (
                                <div key={p.id} className="flex items-center gap-3">
                                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-amber-100 text-xs font-bold text-amber-700 shrink-0">
                                        {i + 1}
                                    </div>
                                    <div className="h-10 w-10 bg-gray-50 rounded flex shrink-0 border border-gray-100 overflow-hidden items-center justify-center">
                                        {p.imageUrl ? <Image src={p.imageUrl} alt={p.name || "Producto"} width={40} height={40} className="object-cover h-full w-full" /> : <Package size={14} className="text-gray-400" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                                        <p className="text-xs text-gray-600 font-medium">
                                            {p.soldCount === 0 ? <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">Sin ventas</span> : `${p.soldCount} unidades`}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stock Crítico (INDEPENDIENTE DEL FILTRO) */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-red-700 flex items-center gap-2">
                                <AlertCircle size={16} className="text-red-600" />
                                Stock Crítico Hoy
                            </h3>
                            <span className="text-[9px] font-bold text-gray-400 uppercase">Tiempo Real</span>
                        </div>
                        <div className="space-y-4 flex-1">
                            {criticalProducts.length === 0 ? (
                                <p className="text-xs text-gray-500 font-medium text-center py-4 flex items-center justify-center gap-2 border border-dashed border-gray-200 rounded-lg bg-gray-50">
                                    <Package size={14} /> Inventario saludable.
                                </p>
                            ) : (
                                criticalProducts.map((p: ProductDetail) => (
                                    <div key={p.id} className="flex items-center justify-between bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-white rounded border border-gray-200 flex shrink-0 overflow-hidden">
                                                {p.imageUrl && <Image src={p.imageUrl} alt={p.name || "Producto"} width={32} height={32} className="object-cover h-full w-full" />}
                                            </div>
                                            <div className="min-w-0 max-w-[120px]">
                                                <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-widest ${p.stock === 0 ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-orange-100 text-orange-800 border border-orange-200'}`}>
                                            {p.stock === 0 ? 'AGOTADO' : `${p.stock} RESTANTES`}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                        {criticalProducts.length > 0 && (
                            <Link href="/ame-studio-ops/inventory" className="block text-center mt-6 text-xs font-bold text-red-700 border border-red-200 bg-red-50 py-2 rounded-lg hover:bg-red-100 hover:text-red-900 transition-colors">
                                Reabastecer inventario
                            </Link>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
}

export default function AdminDashboardPage() {
    return (
        <Suspense fallback={<div className="p-8 min-h-screen bg-gray-50">Cargando...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
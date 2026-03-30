import { getOrderById } from "@/actions/orders";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, User, MapPin, CreditCard, Key, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";

// Reutilizamos el helper de estados visuales
function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'COMPLETED':
            return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"><CheckCircle2 size={12}/> Completada</span>;
        case 'IN_PROGRESS':
            return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"><Clock size={12}/> En Preparación</span>;
        case 'CANCELLED':
            return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200"><XCircle size={12}/> Cancelada</span>;
        default:
            return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"><AlertCircle size={12}/> Pendiente</span>;
    }
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Next.js 15 requiere resolver params como una promesa
    const { id } = await params;
    const order = await getOrderById(id);

    // Si alguien ingresa un ID falso en la URL, mostramos error 404
    if (!order) {
        notFound();
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Header de navegación */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/ame-studio-ops/orders" className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">Orden {order.id}</h1>
                        <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Registrada el {order.createdAt.toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Columna Izquierda: Detalles del Cliente y Logística */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tarjeta de Cliente */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                            <User size={20} className="text-gray-400" /> Información del Cliente
                        </h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 mb-1">Nombre Completo</p>
                                <p className="font-medium text-gray-900">{order.customerName}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Teléfono</p>
                                <p className="font-medium text-gray-900">{order.customerPhone}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Documento ({order.customerDocType})</p>
                                <p className="font-medium text-gray-900">{order.customerDocument}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta de Envío */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                            <MapPin size={20} className="text-gray-400" /> Detalles de Entrega
                        </h2>
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-gray-500 mb-1">Método de Entrega</p>
                                <p className="font-medium text-gray-900">
                                    {order.deliveryMethod === 'STORE' ? 'Recojo en Tienda' : 'Delivery'}
                                </p>
                            </div>
                            {order.deliveryMethod === 'DELIVERY' && (
                                <>
                                    <div>
                                        <p className="text-gray-500 mb-1">Dirección</p>
                                        <p className="font-medium text-gray-900">{order.address}</p>
                                    </div>
                                    {order.reference && (
                                        <div>
                                            <p className="text-gray-500 mb-1">Referencia</p>
                                            <p className="font-medium text-gray-900">{order.reference}</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Productos Comprados */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">Artículos ({order.items.length})</h2>
                        </div>
                        <ul className="divide-y divide-gray-100">
                            {order.items.map((item) => (
                                <li key={item.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden relative shrink-0">
                                            {item.product.imageUrl ? (
                                                <Image src={item.product.imageUrl} fill className="object-cover" alt={item.product.name} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Sin img</div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{item.product.name}</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Talla: <span className="font-medium text-gray-700">{item.size || 'N/A'}</span> • Cantidad: {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">S/ {(item.price * item.quantity).toFixed(2)}</p>
                                        <p className="text-xs text-gray-500 mt-1">S/ {item.price.toFixed(2)} c/u</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Columna Derecha: Finanzas y Código Bot */}
                <div className="space-y-6">
                    {/* Código de Validación Bot */}
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-sm text-white relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-10">
                            <Key size={100} />
                        </div>
                        <h2 className="text-sm font-semibold text-gray-400 flex items-center gap-2 mb-2 uppercase tracking-wider">
                            Código N8N
                        </h2>
                        <p className="text-3xl font-mono font-bold tracking-widest">{order.validationCode}</p>
                        <p className="text-xs text-gray-400 mt-2">Código usado por el bot de WhatsApp para validar la orden con el cliente.</p>
                    </div>

                    {/* Resumen Financiero */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                            <CreditCard size={20} className="text-gray-400" /> Resumen de Pago
                        </h2>

                        <div className="space-y-4 text-sm mb-6 border-b border-gray-100 pb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>S/ {order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Costo de Envío</span>
                                <span>S/ {order.deliveryCost.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-6">
                            <span className="font-semibold text-gray-900">Total Pagado</span>
                            <span className="text-xl font-bold text-green-600">S/ {order.total.toFixed(2)}</span>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <p className="text-xs text-gray-500 mb-1 uppercase font-semibold tracking-wider">Método Seleccionado</p>
                            <p className="font-medium text-gray-900">{order.paymentMethod}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
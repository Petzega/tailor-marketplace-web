import { getOrderByToken } from "@/actions/tracking";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LucideIcon, ArrowLeft, Clock, Package, Store, Truck, XCircle } from "lucide-react";
import { Footer } from "@/components/layout/footer";

// Diccionario visual para los estados
const STATUS_UI: Record<string, { label: string; color: string; icon: LucideIcon; description: string }> = {
    PENDING: {
        label: "Pendiente", color: "text-amber-600 bg-amber-50 border-amber-200", icon: Clock,
        description: "Tu pedido ha sido registrado y está a la espera de confirmación."
    },
    IN_PROCESS: {
        label: "En Proceso", color: "text-blue-600 bg-blue-50 border-blue-200", icon: Package,
        description: "El pago fue validado y estamos preparando tu pedido."
    },
    DELIVERED_STORE: {
        label: "Entregado en Tienda", color: "text-green-600 bg-green-50 border-green-200", icon: Store,
        description: "El pedido fue recogido con éxito en nuestro local."
    },
    DELIVERED_DELIVERY: {
        label: "Entregado por Delivery", color: "text-green-600 bg-green-50 border-green-200", icon: Truck,
        description: "El paquete fue entregado en la dirección indicada."
    },
    CANCELLED: {
        label: "Cancelado", color: "text-red-600 bg-red-50 border-red-200", icon: XCircle,
        description: "Este pedido ha sido cancelado."
    }
};

// 👇 Ajuste para Next.js 15: params y searchParams ahora son promesas
export default async function OrderTrackingPage(props: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ token?: string }>;
}) {
    // Resolvemos las promesas de la URL
    const params = await props.params;
    const searchParams = await props.searchParams;

    // Si no hay token en la URL, bloqueamos el acceso
    if (!searchParams.token) {
        return notFound();
    }

    // Buscamos la orden en la BD
    const response = await getOrderByToken(params.id, searchParams.token);

    if (!response.success || !response.order) {
        return (
            <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
                    <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                    <h1 className="text-xl font-bold text-gray-900 mb-2">Pedido no encontrado</h1>
                    <p className="text-gray-500 mb-6">El enlace parece ser inválido o ha expirado.</p>
                    <Link href="/" className="inline-block bg-gray-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-black transition-colors">
                        Volver a la tienda
                    </Link>
                </div>
            </main>
        );
    }

    const { order } = response;
    const currentStatus = STATUS_UI[order.status] || STATUS_UI.PENDING;
    const StatusIcon = currentStatus.icon;

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex-1 mx-auto max-w-3xl px-4 sm:px-6 py-10 w-full">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                    <ArrowLeft size={16} /> Volver a la tienda
                </Link>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* ENCABEZADO DE LA ORDEN */}
                    <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-900 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3" />
                        <h1 className="text-sm font-medium text-gray-400 mb-1">Detalle de tu Pedido</h1>
                        <p className="text-3xl font-black tracking-tight">{order.id}</p>
                        <p className="text-sm text-gray-400 mt-2">
                            Fecha: {new Date(order.createdAt).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="p-6 sm:p-8 space-y-8">
                        {/* ESTADO ACTUAL */}
                        <div className={`p-5 rounded-2xl border flex items-start gap-4 ${currentStatus.color}`}>
                            <StatusIcon className="shrink-0 mt-0.5" size={24} />
                            <div>
                                <h2 className="font-bold text-lg mb-1">{currentStatus.label}</h2>
                                <p className="text-sm opacity-90 leading-relaxed">{currentStatus.description}</p>
                            </div>
                        </div>

                        {/* DATOS DEL CLIENTE Y ENVÍO */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Datos del Cliente</p>
                                <p className="font-medium text-gray-900">{order.customerName}</p>
                                <p className="text-sm text-gray-600">{order.customerPhone}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Método de Envío</p>
                                <div className="flex items-center gap-2 font-medium text-gray-900 mb-1">
                                    {order.deliveryMethod === "STORE" ? <Store size={16} className="text-gray-500" /> : <Truck size={16} className="text-gray-500" />}
                                    <span>{order.deliveryMethod === "STORE" ? "Retiro en Tienda" : "Delivery"}</span>
                                </div>
                                {order.deliveryMethod === "DELIVERY" && order.address && (
                                    <p className="text-sm text-gray-600">{order.address}</p>
                                )}
                            </div>
                        </div>

                        {/* LISTA DE PRODUCTOS */}
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Productos</p>
                            <ul className="divide-y divide-gray-100 border-t border-gray-100">
                                {order.items.map((item: { id: string; quantity: number; price: number; size?: string | null; product: { name: string; imageUrl?: string | null; } | null }) => (
                                    <li key={item.id} className="py-4 flex gap-4">
                                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-white relative">
                                            {item.product?.imageUrl ? (
                                                <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400 text-center p-1">Sin foto</div>
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col justify-center">
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.product?.name || "Producto Removido"}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Cant: {item.quantity} {item.size ? `| Talla: ${item.size}` : ''}
                                            </p>
                                        </div>
                                        <div className="flex flex-col justify-center items-end">
                                            <p className="text-sm font-bold text-gray-900">S/ {(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* TOTALES */}
                        <div className="border-t border-gray-100 pt-6 space-y-3">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>S/ {order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Envío</span>
                                <span>{order.deliveryCost > 0 ? `S/ ${order.deliveryCost.toFixed(2)}` : 'Gratis'}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-black text-gray-900 pt-3 border-t border-gray-100">
                                <span>Total</span>
                                <span>S/ {order.total.toFixed(2)}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
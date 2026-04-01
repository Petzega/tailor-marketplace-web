"use client"

import { updateOrderStatus } from "@/actions/orders";
import { X, User, Phone, MapPin, CreditCard, Package, Truck, Store, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type OrderItemProps = {
    id: string;
    quantity: number;
    price: number;
    size?: string;
    product: { name: string; imageUrl?: string };
};
type OrderProps = {
    id: string;
    validationCode: string;
    status: string;
    customerName: string;
    customerPhone?: string;
    customerDocType: string;
    customerDocument: string;
    deliveryMethod: string;
    address?: string;
    reference?: string;
    paymentMethod: string;
    subtotal: number;
    deliveryCost: number;
    total: number;
    items: OrderItemProps[];
};

export function OrderDetailsSheet({ order }: { order: OrderProps }) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        setIsUpdating(true);
        const res = await updateOrderStatus(order.id, newStatus);
        if (res.success) {
            router.refresh();
        }
        setIsUpdating(false);
    };

    const isDelivery = order.deliveryMethod === 'DELIVERY';

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <Link href="/ame-studio-ops/orders" className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" />
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto border-l border-gray-100 flex flex-col animate-in slide-in-from-right duration-300">

                {/* HEADER */}
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Detalle de Orden</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded-md">{order.id}</span>
                            <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-200 tracking-widest" title="Código de Validación del Cliente">
                                {order.validationCode}
                            </span>
                        </div>
                    </div>
                    <Link href="/ame-studio-ops/orders" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </Link>
                </div>

                <div className="p-6 space-y-6 flex-1">

                    {/* ESTADO DE LA ORDEN */}
                    <div className="space-y-2.5">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Estado de la Orden</label>
                        <select
                            value={order.status}
                            disabled={isUpdating}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                        >
                            <option value="PENDING">⏳ Pendiente de Pago</option>
                            <option value="IN_PROGRESS">🧵 En Producción / Preparación</option>
                            <option value="COMPLETED">✅ Completado / Entregado</option>
                            <option value="CANCELLED">❌ Cancelada</option>
                        </select>
                    </div>

                    <hr className="border-gray-100" />

                    {/* TARJETA DE CLIENTE */}
                    <div className="space-y-3">
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                            <User size={14} /> Cliente
                        </h3>
                        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-bold shrink-0 text-lg">
                                    {order.customerName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{order.customerName}</p>
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <p className="text-xs text-gray-500 flex items-center gap-1"><Phone size={12}/> {order.customerPhone}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                                <span className="text-xs text-gray-500 flex items-center gap-1"><FileText size={12}/> {order.customerDocType}</span>
                                <span className="text-xs font-mono font-medium text-gray-900">{order.customerDocument}</span>
                            </div>
                        </div>
                    </div>

                    {/* TARJETA DE LOGÍSTICA Y PAGO */}
                    <div className="space-y-3">
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                            <MapPin size={14} /> Logística & Pago
                        </h3>
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-4">

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600 shrink-0">
                                    {isDelivery ? <Truck size={16} /> : <Store size={16} />}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{isDelivery ? 'Envío a Domicilio' : 'Retiro en Tienda'}</p>

                                    {/* Validamos con .trim() para evitar renderizar espacios en blanco */}
                                    {isDelivery && order.address?.trim() && (
                                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{order.address}</p>
                                    )}
                                    {isDelivery && order.reference?.trim() && (
                                        <p className="text-[11px] text-gray-400 mt-0.5 italic">Ref: {order.reference}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-3 pt-3 border-t border-gray-200">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-green-600 shrink-0">
                                    <CreditCard size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Método de Pago</p>
                                    <p className="text-xs text-gray-600 mt-0.5 capitalize">{order.paymentMethod.replace('_', ' ').toLowerCase()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TARJETA DE PRODUCTOS Y TOTALES */}
                    <div className="space-y-3">
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Package size={14} /> Resumen de Compra
                        </h3>

                        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                            <div className="divide-y divide-gray-50">
                                {order.items.map((item: OrderItemProps) => (
                                    <div key={item.id} className="p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                                        <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0 relative border border-gray-200">
                                            {item.product.imageUrl ? (
                                                /* eslint-disable-next-line @next/next/no-img-element */
                                                <img src={item.product.imageUrl} className="object-cover h-full w-full" alt={item.product.name} />
                                            ) : (
                                                <Package size={16} className="text-gray-300" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 truncate">{item.product.name}</p>
                                            <p className="text-[11px] text-gray-500 mt-0.5">Talla: {item.size || 'N/A'} • Cant: {item.quantity}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-bold text-gray-900">S/ {(item.price * item.quantity).toFixed(2)}</p>
                                            {item.quantity > 1 && <p className="text-[10px] text-gray-400">S/ {item.price.toFixed(2)} c/u</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* FACTURA TOTALES */}
                            <div className="bg-gray-50 p-4 space-y-2 border-t border-gray-100">
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-700">S/ {order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Costo de Envío</span>
                                    <span className="font-medium text-gray-700">S/ {order.deliveryCost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-200">
                                    <span className="text-sm font-bold text-gray-900">Total Final</span>
                                    <span className="text-lg font-black text-green-600">S/ {order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
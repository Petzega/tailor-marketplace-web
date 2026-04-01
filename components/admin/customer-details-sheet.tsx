"use client"; // 👈 Obligatorio para usar hooks del lado del cliente

import { useEffect } from "react";
import { X, User, Ruler, MapPin, Phone, FileText, ShoppingBag, Scissors, Calendar } from "lucide-react";
import Link from "next/link";

export function CustomerDetailsSheet({ customer }: { customer: any }) {
    // 👇 Efecto para bloquear y desbloquear el scroll de la página principal
    useEffect(() => {
        // Bloquea el scroll al montar el componente
        document.body.style.overflow = "hidden";

        // Limpieza: restaura el scroll al desmontar (cerrar) el componente
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    if (!customer) return null;

    const memberSince = new Date(customer.createdAt).toLocaleDateString("es-PE", { month: 'long', year: 'numeric' });

    return (
        <>
            {/* Fondo oscuro translúcido */}
            <Link href="/ame-studio-ops/customers" className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 transition-opacity" />

            {/* Panel Lateral */}
            <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300 border-l border-gray-200">

                {/* Cabecera del Panel */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-black text-lg">
                            {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 leading-tight">{customer.name}</h2>
                            <p className="text-xs text-gray-500 font-medium">{customer.docType}: {customer.documentNumber}</p>
                        </div>
                    </div>
                    <Link href="/ame-studio-ops/customers" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </Link>
                </div>

                {/* Contenido scrolleable del propio Sheet */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* 1. Datos de Contacto */}
                    <section className="space-y-3">
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <User size={14} /> Información de Contacto
                        </h3>
                        <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3 shadow-sm">
                            <div className="flex items-center gap-3 text-sm">
                                <Phone size={16} className="text-gray-400" />
                                <span className="text-gray-900 font-medium">{customer.phone || <span className="text-gray-400 italic">No registrado</span>}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin size={16} className="text-gray-400" />
                                <span className="text-gray-900 font-medium">{customer.address || <span className="text-gray-400 italic">No registrado</span>}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar size={16} className="text-gray-400" />
                                <span className="text-gray-500">Cliente desde {memberSince}</span>
                            </div>
                        </div>
                    </section>

                    {/* 2. Medidas y Perfil de Sastrería */}
                    <section className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Ruler size={14} /> Perfil de Sastrería
                            </h3>
                            <button className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">Editar</button>
                        </div>

                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-4">
                            <div>
                                <h4 className="text-xs font-bold text-blue-900 mb-1">Medidas Corporales:</h4>
                                {customer.measurements ? (
                                    <p className="text-sm text-blue-800 leading-relaxed">{customer.measurements}</p>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No hay medidas registradas para este cliente.</p>
                                )}
                            </div>
                            {customer.notes && (
                                <div className="pt-3 border-t border-blue-100/50">
                                    <h4 className="text-xs font-bold text-blue-900 mb-1 flex items-center gap-1">
                                        <FileText size={12} /> Notas y Preferencias:
                                    </h4>
                                    <p className="text-sm text-blue-800 leading-relaxed">{customer.notes}</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* 3. Historial de Servicios de Sastrería */}
                    <section className="space-y-3">
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Scissors size={14} /> Historial de Servicios
                        </h3>
                        <div className="space-y-2">
                            {customer.services.length === 0 ? (
                                <p className="text-sm text-gray-400 italic text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">Sin historial de sastrería.</p>
                            ) : (
                                customer.services.map((service: any) => (
                                    <div key={service.id} className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm flex justify-between items-start">
                                        <div>
                                            <p className="text-xs font-bold text-gray-900">{service.serviceType}</p>
                                            <p className="text-[10px] text-gray-500 mt-0.5">{new Date(service.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase mb-1 ${
                                                service.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                    service.status === 'FITTING' ? 'bg-purple-100 text-purple-700' :
                                                        service.status === 'READY' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-green-100 text-green-700'
                                            }`}>
                                                {service.status === 'FITTING' ? 'EN PRUEBA' : service.status}
                                            </span>
                                            <p className="text-xs font-bold text-gray-900">S/ {service.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* 4. Historial de Compras en Tienda */}
                    <section className="space-y-3">
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <ShoppingBag size={14} /> Compras en Catálogo
                        </h3>
                        <div className="space-y-2">
                            {customer.orders.length === 0 ? (
                                <p className="text-sm text-gray-400 italic text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">Sin historial de compras.</p>
                            ) : (
                                customer.orders.map((order: any) => (
                                    <Link key={order.id} href={`/ame-studio-ops/orders?view=${order.id}`} className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm flex justify-between items-center hover:border-green-300 transition-colors group">
                                        <div>
                                            <p className="text-xs font-bold text-gray-900 group-hover:text-green-700 transition-colors">{order.id}</p>
                                            <p className="text-[10px] text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-gray-900 mb-0.5">S/ {order.total.toFixed(2)}</p>
                                            <p className="text-[10px] text-gray-400">{order.status}</p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </section>

                </div>
            </div>
        </>
    );
}
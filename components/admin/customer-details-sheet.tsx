"use client";

import { useEffect, useState, useTransition } from "react";
import { X, User, Ruler, MapPin, Phone, FileText, ShoppingBag, Scissors, Calendar, Save } from "lucide-react";
import Link from "next/link";
import { saveCustomer } from "@/actions/customers";

export function CustomerDetailsSheet({ customer }: { customer: any }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");

    // Bloquea el scroll al montar
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = "unset"; };
    }, []);

    if (!customer) return null;

    const memberSince = new Date(customer.createdAt).toLocaleDateString("es-PE", { month: 'long', year: 'numeric' });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = {
            id: customer.id,
            docType: formData.get("docType") as string,
            documentNumber: formData.get("documentNumber") as string,
            name: formData.get("name") as string,
            phone: formData.get("phone") as string,
            address: formData.get("address") as string,
            measurements: formData.get("measurements") as string,
            notes: formData.get("notes") as string,
        };

        startTransition(async () => {
            const result = await saveCustomer(data);
            if (result?.success) {
                setIsEditing(false);
            } else {
                setError(result?.error || "Error al guardar");
            }
        });
    };

    return (
        <>
            <Link href="/ame-studio-ops/customers" className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 transition-opacity" />

            {/* Todo el panel ahora es un <form> para manejar ambos estados sin saltos de diseño */}
            <form onSubmit={handleSubmit} className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300 border-l border-gray-200">

                {/* 1. CABECERA (Ahora editable en la misma posición) */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
                    <div className="flex items-center gap-3 w-full pr-4">
                        <div className="h-10 w-10 shrink-0 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-black text-lg">
                            {customer.name.charAt(0).toUpperCase()}
                        </div>
                        {isEditing ? (
                            <div className="flex-1 flex flex-col gap-1.5 w-full">
                                <input required name="name" defaultValue={customer.name} placeholder="Nombre del cliente" className="text-lg font-bold text-gray-900 border-b border-gray-300 bg-transparent outline-none focus:border-green-500 px-1" />
                                <div className="flex gap-2 items-center">
                                    <select name="docType" defaultValue={customer.docType} className="text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded outline-none p-1 shrink-0 shadow-sm">
                                        <option value="DNI">DNI</option>
                                        <option value="RUC">RUC</option>
                                        <option value="CE">CE</option>
                                        <option value="PASAPORTE">PASAPORTE</option>
                                    </select>
                                    <input required name="documentNumber" defaultValue={customer.documentNumber} placeholder="N° Documento" className="text-xs font-bold text-gray-600 border-b border-gray-300 bg-transparent outline-none focus:border-green-500 px-1 w-full" />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 leading-tight">{customer.name}</h2>
                                <p className="text-xs text-gray-500 font-medium">{customer.docType}: {customer.documentNumber}</p>
                            </div>
                        )}
                    </div>
                    <Link href="/ame-studio-ops/customers" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors shrink-0">
                        <X size={20} />
                    </Link>
                </div>

                {/* 2. CONTENIDO SCROLLEABLE */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Información de Contacto (Los campos cambian en línea) */}
                    <section className="space-y-3">
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <User size={14} /> Información de Contacto
                        </h3>
                        <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3 shadow-sm transition-all">
                            <div className="flex items-center gap-3 text-sm">
                                <Phone size={16} className="text-gray-400 shrink-0" />
                                {isEditing ? (
                                    <input name="phone" defaultValue={customer.phone} className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-green-500 focus:bg-white transition-colors" placeholder="Teléfono" />
                                ) : (
                                    <span className="text-gray-900 font-medium">{customer.phone || <span className="text-gray-400 italic">No registrado</span>}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin size={16} className="text-gray-400 shrink-0" />
                                {isEditing ? (
                                    <input name="address" defaultValue={customer.address} className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-green-500 focus:bg-white transition-colors" placeholder="Dirección completa" />
                                ) : (
                                    <span className="text-gray-900 font-medium">{customer.address || <span className="text-gray-400 italic">No registrado</span>}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 text-sm opacity-70">
                                <Calendar size={16} className="text-gray-400 shrink-0" />
                                <span className="text-gray-500">Cliente desde {memberSince}</span>
                            </div>
                        </div>
                    </section>

                    {/* Perfil de Sastrería (Textareas integrados en el fondo azul) */}
                    <section className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Ruler size={14} /> Perfil de Sastrería
                            </h3>
                            {!isEditing && (
                                <button type="button" onClick={() => setIsEditing(true)} className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-xs font-bold transition-colors">
                                    Editar Perfil
                                </button>
                            )}
                        </div>

                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-4 transition-all">
                            <div>
                                <h4 className="text-xs font-bold text-blue-900 mb-2">Medidas Corporales:</h4>
                                {isEditing ? (
                                    <textarea name="measurements" defaultValue={customer.measurements} rows={3} className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none shadow-sm placeholder:text-blue-300 text-blue-900 font-medium" placeholder="Ej: Busto 90cm, Cintura 70cm, Cadera 95cm..."></textarea>
                                ) : (
                                    customer.measurements ? <p className="text-sm text-blue-800 leading-relaxed whitespace-pre-line">{customer.measurements}</p> : <p className="text-sm text-gray-500 italic">No hay medidas registradas.</p>
                                )}
                            </div>
                            {(isEditing || customer.notes) && (
                                <div className="pt-3 border-t border-blue-100/50">
                                    <h4 className="text-xs font-bold text-blue-900 mb-2 flex items-center gap-1">
                                        <FileText size={12} /> Notas y Preferencias:
                                    </h4>
                                    {isEditing ? (
                                        <textarea name="notes" defaultValue={customer.notes} rows={2} className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none shadow-sm placeholder:text-blue-300 text-blue-900 font-medium" placeholder="Preferencias adicionales..."></textarea>
                                    ) : (
                                        <p className="text-sm text-blue-800 leading-relaxed whitespace-pre-line">{customer.notes}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Las listas de historial se opacan sutilmente durante la edición para enfocar la atención en el formulario */}
                    <div className={`space-y-8 transition-opacity duration-300 ${isEditing ? 'opacity-40 pointer-events-none grayscale' : 'opacity-100'}`}>
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

                {/* 3. FOOTER FIJO (Aparece solo en modo edición) */}
                {isEditing && (
                    <div className="p-4 border-t border-gray-100 bg-white shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] flex justify-end gap-3 shrink-0 animate-in slide-in-from-bottom-4 duration-300">
                        <button type="button" onClick={() => { setIsEditing(false); setError(""); }} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 bg-gray-100 rounded-lg transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isPending} className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:animate-pulse rounded-lg transition-colors shadow-sm">
                            <Save size={16} />
                            {isPending ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                )}
            </form>
        </>
    );
}
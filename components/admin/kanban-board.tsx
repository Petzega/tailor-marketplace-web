"use client";

import { useState, useTransition } from "react";
import { Clock, Ruler, CheckCircle, Package, Edit2, Search, AlertCircle } from "lucide-react";
import Link from "next/link";
import { updateServiceStatus } from "@/actions/services";

const COLUMNS = [
    { id: "PENDING", title: "Pendientes", icon: Clock, color: "bg-amber-100 text-amber-700", border: "border-amber-200" },
    { id: "FITTING", title: "En Prueba", icon: Ruler, color: "bg-purple-100 text-purple-700", border: "border-purple-200" },
    { id: "READY", title: "Listos", icon: CheckCircle, color: "bg-blue-100 text-blue-700", border: "border-blue-200" },
    { id: "DELIVERED", title: "Entregados", icon: Package, color: "bg-green-100 text-green-700", border: "border-green-200" }
];

type KanbanService = {
    id: string;
    serviceType: string;
    status: string;
    balance: number;
    deliveryDate?: string | Date | null;
    customer: { name: string };
};

export function KanbanBoard({ initialServices }: { initialServices: KanbanService[] }) {
    const [services, setServices] = useState<KanbanService[]>(initialServices);
    const [, startTransition] = useTransition();
    const [searchQuery, setSearchQuery] = useState("");

    // Filtrado en tiempo real en memoria
    const filteredServices = services.filter(s => {
        const query = searchQuery.toLowerCase();
        return s.customer.name.toLowerCase().includes(query) ||
            s.serviceType.toLowerCase().includes(query) ||
            s.id.toLowerCase().includes(query);
    });

    // Evaluación de urgencia (Vencido o se entrega hoy)
    const checkIsUrgent = (dateString?: string | Date | null, status?: string) => {
        if (!dateString || status === 'DELIVERED') return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const delivery = new Date(dateString);
        delivery.setHours(0, 0, 0, 0);

        return delivery <= today;
    };

    const handleDragStart = (e: React.DragEvent, serviceId: string) => {
        e.dataTransfer.setData("serviceId", serviceId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, newStatus: string) => {
        e.preventDefault();
        const serviceId = e.dataTransfer.getData("serviceId");

        const serviceToMove = services.find(s => s.id === serviceId);
        if (!serviceToMove || serviceToMove.status === newStatus) return;

        setServices(prev => prev.map(s => s.id === serviceId ? { ...s, status: newStatus } : s));

        startTransition(async () => {
            const result = await updateServiceStatus(serviceId, newStatus);
            if (!result.success) {
                setServices(initialServices);
                alert("Error al mover la tarjeta en la base de datos.");
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Buscador Rápido del Tablero */}
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                    type="text"
                    placeholder="Filtrar por cliente, prenda o código..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 shadow-sm transition-colors"
                />
            </div>

            {/* Tablero de Columnas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                {COLUMNS.map(column => (
                    <div
                        key={column.id}
                        className="flex flex-col bg-gray-50/50 rounded-2xl border border-gray-200 min-h-[600px] overflow-hidden"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, column.id)}
                    >
                        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-2">
                                <column.icon size={16} className={column.color.split(' ')[1]} />
                                <h3 className="font-bold text-sm text-gray-900">{column.title}</h3>
                            </div>
                            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                {filteredServices.filter(s => s.status === column.id).length}
                            </span>
                        </div>

                        <div className="p-3 flex-1 flex flex-col gap-3 overflow-y-auto">
                            {filteredServices.filter(s => s.status === column.id).map(service => {
                                // Determinar si la tarjeta necesita estado de urgencia
                                const isUrgent = checkIsUrgent(service.deliveryDate, service.status);

                                return (
                                    <div
                                        key={service.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, service.id)}
                                        className={`bg-white border ${isUrgent ? 'border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.15)]' : column.border} p-4 rounded-xl shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all group relative`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${isUrgent ? 'bg-red-100 text-red-700' : column.color}`}>
                                                {service.id.includes('TK-') ? service.id : `TK-ANTIGUO`}
                                            </span>
                                            <Link
                                                href={`/ame-studio-ops/services?edit=${service.id}`}
                                                className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Editar Servicio"
                                            >
                                                <Edit2 size={14} />
                                            </Link>
                                        </div>

                                        <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1 pr-4">{service.serviceType}</h4>
                                        <p className="text-xs text-gray-500 mb-3 truncate">{service.customer.name}</p>

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">Saldo</span>
                                                <span className={`text-xs font-bold ${service.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                    S/ {service.balance.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex flex-col text-right">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">Entrega</span>
                                                <div className="flex items-center justify-end gap-1">
                                                    {isUrgent && <AlertCircle size={12} className="text-red-500" />}
                                                    <span className={`text-xs font-bold ${isUrgent ? 'text-red-600' : 'text-gray-700'}`}>
                                                        {service.deliveryDate ? new Date(service.deliveryDate).toLocaleDateString() : 'Por definir'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {filteredServices.filter(s => s.status === column.id).length === 0 && (
                                <div className="h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center">
                                    <span className="text-xs font-medium text-gray-400">Sin trabajos</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
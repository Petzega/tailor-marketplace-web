"use client";

import { useState, useTransition } from "react";
import { Clock, Ruler, CheckCircle, Package, Edit2 } from "lucide-react";
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
    const [services, setServices] = useState(initialServices);
    const [, startTransition] = useTransition();

    // Inicia el arrastre
    const handleDragStart = (e: React.DragEvent, serviceId: string) => {
        e.dataTransfer.setData("serviceId", serviceId);
    };

    // Permite soltar
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    // Maneja cuando se suelta la tarjeta en una nueva columna
    const handleDrop = (e: React.DragEvent, newStatus: string) => {
        e.preventDefault();
        const serviceId = e.dataTransfer.getData("serviceId");

        const serviceToMove = services.find(s => s.id === serviceId);
        if (!serviceToMove || serviceToMove.status === newStatus) return;

        // Actualización optimista (cambia visualmente al instante)
        setServices(prev => prev.map(s => s.id === serviceId ? { ...s, status: newStatus } : s));

        // Actualización real en la base de datos
        startTransition(async () => {
            const result = await updateServiceStatus(serviceId, newStatus);
            if (!result.success) {
                // Si falla, revertimos el cambio visual (opcional, pero buena práctica)
                setServices(initialServices);
                alert("Error al mover la tarjeta");
            }
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            {COLUMNS.map(column => (
                <div
                    key={column.id}
                    className="flex flex-col bg-gray-50/50 rounded-2xl border border-gray-200 min-h-[600px] overflow-hidden"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, column.id)}
                >
                    {/* Cabecera de la columna */}
                    <div className={`px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white`}>
                        <div className="flex items-center gap-2">
                            <column.icon size={16} className={column.color.split(' ')[1]} />
                            <h3 className="font-bold text-sm text-gray-900">{column.title}</h3>
                        </div>
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {services.filter(s => s.status === column.id).length}
                        </span>
                    </div>

                    {/* Lista de Tarjetas */}
                    <div className="p-3 flex-1 flex flex-col gap-3 overflow-y-auto">
                        {services.filter(s => s.status === column.id).map(service => (
                            <div
                                key={service.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, service.id)}
                                className={`bg-white border ${column.border} p-4 rounded-xl shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all group`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${column.color}`}>
                                        {service.id.split('-')[1]}
                                    </span>
                                    <Link
                                        href={`/ame-studio-ops/services?edit=${service.id}`}
                                        className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Editar Servicio"
                                    >
                                        <Edit2 size={14} />
                                    </Link>
                                </div>

                                <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1">{service.serviceType}</h4>
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
                                        <span className="text-xs font-bold text-gray-700">
                                            {service.deliveryDate ? new Date(service.deliveryDate).toLocaleDateString() : 'Por definir'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {services.filter(s => s.status === column.id).length === 0 && (
                            <div className="h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-400">Soltar aquí</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/actions/orders";
import { CheckCircle2, Clock, XCircle, Loader2, Settings2 } from "lucide-react";

export function OrderStatusActions({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const [isPending, startTransition] = useTransition();

    const handleUpdate = (newStatus: string) => {
        if (newStatus === currentStatus) return;

        startTransition(async () => {
            await updateOrderStatus(orderId, newStatus);
        });
    };

    return (
        // 👇 Eliminado el "mt-6" para que no rompa el grid
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                <Settings2 size={18} className="text-gray-400" /> Acciones de Orden
            </h2>
            <div className="flex flex-col gap-3">
                <button
                    onClick={() => handleUpdate('IN_PROGRESS')}
                    disabled={isPending || currentStatus === 'IN_PROGRESS'}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentStatus === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border border-blue-200 opacity-60 cursor-not-allowed' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                >
                    {isPending ? <Loader2 size={16} className="animate-spin" /> : <Clock size={16} />}
                    Marcar en Preparación
                </button>

                <button
                    onClick={() => handleUpdate('COMPLETED')}
                    disabled={isPending || currentStatus === 'COMPLETED'}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentStatus === 'COMPLETED' ? 'bg-green-50 text-green-700 border border-green-200 opacity-60 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                >
                    {isPending ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                    Completar Orden
                </button>

                <button
                    onClick={() => handleUpdate('CANCELLED')}
                    disabled={isPending || currentStatus === 'CANCELLED'}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentStatus === 'CANCELLED' ? 'bg-red-50 text-red-700 border border-red-200 opacity-60 cursor-not-allowed' : 'bg-white border border-red-200 text-red-600 hover:bg-red-50'}`}
                >
                    {isPending ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                    Cancelar Orden
                </button>
            </div>
        </div>
    );
}
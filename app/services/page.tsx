import { getKanbanServices } from "@/actions/services";
import { KanbanBoard } from "@/components/admin/kanban-board";
import { Scissors } from "lucide-react";
import Link from "next/link";

export default async function ServicesPage() {
    const { services } = await getKanbanServices();

    return (
        <div className="p-8 relative min-h-screen bg-white">
            <div className="max-w-[1600px] mx-auto space-y-8">

                {/* Encabezado */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Scissors className="text-gray-400" />
                            Taller de Sastrería
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Arrastra las tarjetas para cambiar su estado. Gestiona los trabajos de los clientes.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/ame-studio-ops/services?new=true" className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-bold transition-colors shadow-sm">
                            + Nuevo Trabajo
                        </Link>
                    </div>
                </div>

                {/* Tablero Kanban */}
                <KanbanBoard initialServices={services || []} />

            </div>

            {/* Aquí inyectaremos el formulario de crear/editar servicio en el siguiente paso */}
        </div>
    );
}
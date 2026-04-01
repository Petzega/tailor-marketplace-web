import { getKanbanServices } from "@/actions/services";
import { db } from "@/lib/db";
import { KanbanBoard } from "@/components/admin/kanban-board";
import { ServiceFormSheet } from "@/components/admin/service-form-sheet";
import { Scissors } from "lucide-react";
import Link from "next/link";

interface ServicesPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
    const params = await searchParams;
    const { services } = await getKanbanServices();

    // 1. Detectar si queremos crear o editar
    const isNew = params?.new === 'true';
    const editId = typeof params?.edit === 'string' ? params.edit : undefined;

    // 2. Traer los datos si estamos editando
    let serviceToEdit = null;
    if (editId) {
        serviceToEdit = await db.service.findUnique({
            where: { id: editId }
        });
    }

    // 3. Traer la lista de clientes para el desplegable del formulario
    const customers = await db.customer.findMany({
        select: { id: true, name: true, documentNumber: true },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="p-8 relative min-h-screen bg-white">
            <div className="max-w-[1600px] mx-auto space-y-8">

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

            {/* Renderizado Condicional del Formulario */}
            {(isNew || serviceToEdit) && (
                <ServiceFormSheet
                    customers={customers}
                    serviceToEdit={serviceToEdit}
                />
            )}
        </div>
    );
}
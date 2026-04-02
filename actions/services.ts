"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 1. OBTENER SERVICIOS PARA EL KANBAN
export async function getKanbanServices() {
    try {
        const services = await db.service.findMany({
            // Traemos los datos del cliente vinculados a este servicio
            include: {
                customer: {
                    select: {
                        name: true,
                        phone: true,
                        measurements: true
                    }
                }
            },
            // Ordenamos por fecha de entrega: lo más urgente primero
            orderBy: {
                deliveryDate: 'asc'
            }
        });

        return { success: true, services };
    } catch (error) {
        console.error("Error obteniendo servicios de sastrería:", error);
        return { success: false, services: [] };
    }
}

// 2. ACTUALIZAR ESTADO (Para botones o Drag & Drop en el Kanban)
export async function updateServiceStatus(id: string, newStatus: string) {
    try {
        await db.service.update({
            where: { id },
            data: { status: newStatus }
        });

        revalidatePath("/ame-studio-ops/services");
        return { success: true };
    } catch (error) {
        console.error("Error al mover la tarjeta de estado:", error);
        return { success: false, error: "Error al actualizar el estado." };
    }
}

// 3. CREAR O EDITAR UN SERVICIO DE SASTRERÍA
// FUNCIÓN AUXILIAR: Generador de Tickets (TK-YYMMDDXXX)
async function generateTicketId() {
    // 1. Obtener fecha actual en la zona horaria de Perú
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Lima" }));
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    // 👇 Sin el guion al final
    const datePrefix = `TK-${year}${month}${day}`;

    // 2. Buscar el último servicio creado hoy
    const lastService = await db.service.findFirst({
        where: {
            id: { startsWith: datePrefix }
        },
        orderBy: { id: 'desc' }
    });

    // 3. Calcular el correlativo (XXX)
    let nextSequence = 1;
    if (lastService) {
        // 👇 Extraemos los últimos 3 caracteres (Ej: de "TK-260401005" extrae "005")
        const lastSequence = parseInt(lastService.id.slice(-3), 10);
        if (!isNaN(lastSequence)) {
            nextSequence = lastSequence + 1;
        }
    }

    // 4. Formatear con ceros a la izquierda
    return `${datePrefix}${nextSequence.toString().padStart(3, '0')}`;
}

// 3. CREAR O EDITAR UN SERVICIO DE SASTRERÍA
export async function saveService(data: {
    id?: string;
    customerId: string;
    serviceType: string;
    description: string;
    serviceNotes?: string;
    price: number;
    deposit: number;
    fittingDate?: string | null;
    deliveryDate?: string | null;
}) {
    try {
        const balance = data.price - data.deposit;
        const fittingDate = data.fittingDate ? new Date(`${data.fittingDate}T12:00:00Z`) : null;
        const deliveryDate = data.deliveryDate ? new Date(`${data.deliveryDate}T12:00:00Z`) : null;

        if (data.id) {
            // ACTUALIZAR (El ID no se toca)
            await db.service.update({
                where: { id: data.id },
                data: {
                    customerId: data.customerId,
                    serviceType: data.serviceType,
                    description: data.description,
                    serviceNotes: data.serviceNotes,
                    price: data.price,
                    deposit: data.deposit,
                    balance,
                    fittingDate,
                    deliveryDate
                }
            });
        } else {
            // CREAR NUEVO: Inyectamos nuestro ID personalizado
            const newTicketId = await generateTicketId();

            await db.service.create({
                data: {
                    id: newTicketId, // 👈 Aquí forzamos nuestro ID: TK-260401-001
                    customerId: data.customerId,
                    status: "PENDING",
                    serviceType: data.serviceType,
                    description: data.description,
                    serviceNotes: data.serviceNotes,
                    price: data.price,
                    deposit: data.deposit,
                    balance,
                    fittingDate,
                    deliveryDate
                }
            });
        }

        revalidatePath("/ame-studio-ops/services");
        revalidatePath("/ame-studio-ops/customers");

        return { success: true };
    } catch (error) {
        console.error("Error guardando el servicio:", error);
        return { success: false, error: "Error interno al guardar el trabajo de sastrería." };
    }
}
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
        // Regla de negocio: El backend SIEMPRE calcula el saldo pendiente
        const balance = data.price - data.deposit;

        // Convertir strings de fecha del formulario a objetos Date de Prisma
        const fittingDate = data.fittingDate ? new Date(`${data.fittingDate}T12:00:00Z`) : null;
        const deliveryDate = data.deliveryDate ? new Date(`${data.deliveryDate}T12:00:00Z`) : null;

        if (data.id) {
            // Actualizar existente
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
            // Crear uno nuevo (siempre nace en PENDING)
            await db.service.create({
                data: {
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
        revalidatePath("/ame-studio-ops/customers"); // Por si el cliente actualiza su historial

        return { success: true };
    } catch (error) {
        console.error("Error guardando el servicio:", error);
        return { success: false, error: "Error interno al guardar el trabajo de sastrería." };
    }
}
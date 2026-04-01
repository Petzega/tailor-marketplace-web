"use server";

import { db } from "@/lib/db";

export async function getDashboardAnalytics(startDate?: string, endDate?: string) {
    try {
        // 1. CONFIGURACIÓN DEL FILTRO DE FECHAS (Hora de Perú)
        const dateFilter: { gte?: Date; lte?: Date } = {};
        const now = new Date();

        let start = new Date(now.getFullYear(), now.getMonth() - 5, 1); // Por defecto: últimos 6 meses
        let end = new Date();

        if (startDate || endDate) {
            if (startDate) {
                start = new Date(`${startDate}T00:00:00-05:00`);
                dateFilter.gte = start;
            }
            if (endDate) {
                end = new Date(`${endDate}T23:59:59-05:00`);
                dateFilter.lte = end;
            }
        } else {
            dateFilter.gte = start;
        }

        // 2. STOCK CRÍTICO (No se filtra por fecha, el stock es el presente)
        const criticalProducts = await db.product.findMany({
            where: { stock: { lte: 5 }, category: { not: 'SERVICE' } },
            orderBy: { stock: 'asc' },
            take: 5,
        });

        // 3. ÓRDENES DENTRO DEL RANGO DE FECHAS
        const orders = await db.order.findMany({
            where: { createdAt: Object.keys(dateFilter).length > 0 ? dateFilter : undefined },
            include: { items: true }
        });

        // Calculamos las métricas globales para las tarjetas superiores
        let totalRevenue = 0;
        let completedCount = 0;
        let pendingCount = 0;
        const salesByProduct: Record<string, number> = {};

        orders.forEach(order => {
            if (order.status === 'COMPLETED') completedCount++;
            if (order.status === 'PENDING') pendingCount++;

            if (order.status !== 'CANCELLED') {
                totalRevenue += order.total;
                // Contamos cuántas unidades se vendieron de cada producto
                order.items.forEach(item => {
                    salesByProduct[item.productId] = (salesByProduct[item.productId] || 0) + item.quantity;
                });
            }
        });

        // 4. RANKING DE PRODUCTOS (Top 5 y Peores 5)
        const allProducts = await db.product.findMany({ where: { category: { not: 'SERVICE' } } });

        const productsWithSales = allProducts.map(product => ({
            id: product.id,
            name: product.name,
            imageUrl: product.imageUrl,
            stock: product.stock,
            soldCount: salesByProduct[product.id] || 0,
        }));

        const topProducts = [...productsWithSales].sort((a, b) => b.soldCount - a.soldCount).slice(0, 5).filter(p => p.soldCount > 0);
        const bottomProducts = [...productsWithSales].sort((a, b) => a.soldCount - b.soldCount).slice(0, 5);

        // 5. LÓGICA DEL GRÁFICO DINÁMICO (Diario vs Mensual)
        const chartData = [];
        const diffInDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const isDaily = diffInDays <= 31; // Si el filtro es de un mes o menos, mostramos por días

        if (isDaily) {
            // Generar array de días
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const dayString = `${d.getDate()} ${d.toLocaleString('es-ES', { month: 'short' })}`;
                const dayTotal = orders
                    .filter(o => o.status !== 'CANCELLED' && new Date(o.createdAt).getDate() === d.getDate() && new Date(o.createdAt).getMonth() === d.getMonth())
                    .reduce((sum, o) => sum + o.total, 0);

                chartData.push({ name: dayString, Total: dayTotal });
            }
        } else {
            // Generar array de meses
            const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const currentMonth = new Date(start);
            currentMonth.setDate(1); // Evitar bug de fin de mes

            while (currentMonth <= end || (currentMonth.getMonth() === end.getMonth() && currentMonth.getFullYear() === end.getFullYear())) {
                const mIndex = currentMonth.getMonth();
                const mYear = currentMonth.getFullYear();

                const monthTotal = orders
                    .filter(o => o.status !== 'CANCELLED' && new Date(o.createdAt).getMonth() === mIndex && new Date(o.createdAt).getFullYear() === mYear)
                    .reduce((sum, o) => sum + o.total, 0);

                chartData.push({ name: `${monthNames[mIndex]} ${mYear.toString().slice(2)}`, Total: monthTotal });
                currentMonth.setMonth(currentMonth.getMonth() + 1);
            }
        }

        return {
            stats: { revenue: totalRevenue, completed: completedCount, pending: pendingCount },
            criticalProducts,
            topProducts,
            bottomProducts,
            chartData,
            isDaily // Mandamos al frontend qué tipo de gráfico es
        };

    } catch (error) {
        console.error("Error obteniendo analíticas:", error);
        return null;
    }
}
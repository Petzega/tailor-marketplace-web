import { AdminSidebar } from "@/components/admin/sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrderStats } from "@/actions/orders";

export default async function AdminLayout({
                                              children,
                                          }: {
    children: React.ReactNode;
}) {
    const user = await currentUser();

    const allowedEmails = process.env.ADMIN_EMAILS?.split(",") || [];

    const isAuthorized = user?.emailAddresses.some(
        (email) => allowedEmails.includes(email.emailAddress)
    );

    if (!isAuthorized) {
        redirect("/");
    }

    // 👈 2. Consultar las estadísticas en el servidor
    const stats = await getOrderStats();

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* 👈 3. Pasar el número de pendientes como propiedad (prop) */}
            <AdminSidebar pendingOrders={stats.pending} />
            <main className="pl-64 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
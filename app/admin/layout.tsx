import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Barra Lateral Fija */}
            <AdminSidebar />

            {/* Contenido Principal (con margen a la izquierda para no tapar el sidebar) */}
            <main className="pl-64 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
import { AdminSidebar } from "@/components/admin/sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
                                              children,
                                          }: {
    children: React.ReactNode;
}) {
    const user = await currentUser();

    // 1. Extraemos los correos permitidos del entorno
    // Si la variable no existe, el array queda vacío por seguridad
    const allowedEmails = process.env.ADMIN_EMAILS?.split(",") || [];

    // 2. Evaluamos si el usuario tiene un correo que coincida con la lista
    const isAuthorized = user?.emailAddresses.some(
        (email) => allowedEmails.includes(email.emailAddress)
    );

    if (!isAuthorized) {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <AdminSidebar />
            <main className="pl-64 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
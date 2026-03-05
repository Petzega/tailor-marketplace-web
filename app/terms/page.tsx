import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/footer";
// 👇 Importamos nuestro texto centralizado
import { TermsContent } from "@/components/shared/terms-content";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex-1 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 w-full">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                    <ArrowLeft size={16} /> Volver al inicio
                </Link>

                <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100">
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Términos y Condiciones</h1>
                    <p className="text-sm text-gray-500 mb-10">Última actualización: Marzo 2026</p>

                    {/* 👇 AQUÍ RENDERIZAMOS EL TEXTO CENTRALIZADO */}
                    <TermsContent />

                </div>
            </div>
            <Footer />
        </main>
    );
}
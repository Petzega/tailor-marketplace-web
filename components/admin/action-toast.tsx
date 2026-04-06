"use client"

import { CheckCircle, AlertCircle } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export type ToastInfo = { title: string; desc: string; type: 'success' | 'danger' | 'error' };

export function ActionToast() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname() // 👈 Ahora es dinámico, no hardcodeado a /inventory

    const [toastInfo, setToastInfo] = useState<ToastInfo | null>(null)

    // 1. ESCUCHADOR DE URL (Tu lógica original intacta)
    useEffect(() => {
        const action = searchParams.get('action')
        if (!action) return;

        const info: ToastInfo | null =
            action === 'created' ? { title: '¡Producto Creado!', desc: 'Se ha añadido correctamente al sistema.', type: 'success' } :
                action === 'updated' ? { title: '¡Producto Actualizado!', desc: 'Los cambios se han guardado correctamente.', type: 'success' } :
                    action === 'deleted' ? { title: '¡Producto Eliminado!', desc: 'El registro se ha borrado correctamente.', type: 'danger' } :
                        null;

        if (!info) return;

        // setTimeout evita actualizaciones de estado síncronas que puedan desencadenar cascadas de re-renders
        const showTimer = setTimeout(() => setToastInfo(info), 0);
        const hideTimer = setTimeout(() => {
            setToastInfo(null)
            router.replace(pathname, { scroll: false }); // 👈 Vuelve a la ruta actual limpia
        }, 3000)

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        }
    }, [searchParams, router, pathname])

    // 2. ESCUCHADOR DE EVENTOS PERSONALIZADOS (Para llamar desde el Kanban)
    useEffect(() => {
        let timer: NodeJS.Timeout;
        const handleCustomToast = (e: Event) => {
            const customEvent = e as CustomEvent<ToastInfo>;
            setToastInfo(customEvent.detail);
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => setToastInfo(null), 5000); // 5 seg para leer errores largos
        };

        window.addEventListener('show-toast', handleCustomToast);
        return () => {
            window.removeEventListener('show-toast', handleCustomToast);
            if (timer) clearTimeout(timer);
        };
    }, []);

    if (!toastInfo) return null

    const isError = toastInfo.type === 'danger' || toastInfo.type === 'error';

    return (
        <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-none">
            <div className="bg-gray-900/95 backdrop-blur text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-800 max-w-sm">

                <div className={`p-2 rounded-full shrink-0 ${isError ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {isError ? <AlertCircle size={20} strokeWidth={2.5} /> : <CheckCircle size={20} strokeWidth={2.5} />}
                </div>

                <div>
                    <h4 className="font-bold text-sm">{toastInfo.title}</h4>
                    <p className="text-[11px] text-gray-300 mt-0.5 leading-tight">{toastInfo.desc}</p>
                </div>

            </div>
        </div>
    )
}

// 3. FUNCIÓN AUXILIAR (Para importarla y disparar el Toast desde cualquier archivo)
export const showToast = (title: string, desc: string, type: 'success' | 'danger' | 'error' = 'success') => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('show-toast', { detail: { title, desc, type } }));
    }
};
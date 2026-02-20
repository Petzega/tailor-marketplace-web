"use client"

import { CheckCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export function ActionToast() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const [toastInfo, setToastInfo] = useState<{ title: string, desc: string, type: 'success' | 'danger' } | null>(null)

    useEffect(() => {
        const action = searchParams.get('action')

        if (action) {
            // 1. Elegimos el mensaje según la acción
            if (action === 'created') {
                setToastInfo({ title: '¡Producto Creado!', desc: 'Se ha añadido correctamente al sistema.', type: 'success' })
            } else if (action === 'updated') {
                setToastInfo({ title: '¡Producto Actualizado!', desc: 'Los cambios se han guardado correctamente.', type: 'success' })
            } else if (action === 'deleted') {
                setToastInfo({ title: '¡Producto Eliminado!', desc: 'El registro se ha borrado correctamente.', type: 'danger' })
            }

            // 2. Lo ocultamos a los 3 segundos
            const timer = setTimeout(() => {
                setToastInfo(null)
                router.replace('/admin', { scroll: false })
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [searchParams, router])

    if (!toastInfo) return null

    return (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-none">
            <div className="bg-gray-900/95 backdrop-blur text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-800 max-w-sm">

                {/* Color dinámico: Verde para crear/editar, Rojo para eliminar */}
                <div className={`p-2 rounded-full ${toastInfo.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    <CheckCircle size={20} strokeWidth={2.5} />
                </div>

                <div>
                    <h4 className="font-bold text-sm">{toastInfo.title}</h4>
                    <p className="text-[11px] text-gray-300 mt-0.5 leading-tight">{toastInfo.desc}</p>
                </div>

            </div>
        </div>
    )
}
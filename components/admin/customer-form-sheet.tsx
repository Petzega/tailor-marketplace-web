"use client";

import { useState, useTransition, useEffect } from "react";
import { X, Save, User, Ruler } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveCustomer } from "@/actions/customers";

type CustomerEditProps = {
    id?: string;
    docType?: string;
    documentNumber?: string;
    name?: string;
    phone?: string;
    address?: string;
    measurements?: string;
    notes?: string;
};

export function CustomerFormSheet({ customerToEdit }: { customerToEdit?: CustomerEditProps }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");

    // Bloquear scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = "unset"; };
    }, []);

    const close = () => {
        // Al cerrar, limpiamos la URL para volver a la tabla
        router.push("/ame-studio-ops/customers");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = {
            id: customerToEdit?.id,
            docType: formData.get("docType") as string,
            documentNumber: formData.get("documentNumber") as string,
            name: formData.get("name") as string,
            phone: formData.get("phone") as string,
            address: formData.get("address") as string,
            measurements: formData.get("measurements") as string,
            notes: formData.get("notes") as string,
        };

        startTransition(async () => {
            const result = await saveCustomer(data);
            if (result?.success) {
                // Si guardó bien, volvemos a la vista del cliente (si era edición) o a la tabla (si era nuevo)
                if (customerToEdit) {
                    router.push(`/ame-studio-ops/customers?view=${customerToEdit.id}`);
                } else {
                    close();
                }
            } else {
                setError(result?.error || "Error al guardar");
            }
        });
    };

    return (
        <>
            <div onClick={close} className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50 transition-opacity cursor-pointer" />

            <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[60] flex flex-col animate-in slide-in-from-right duration-300">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        {customerToEdit ? <><User size={18} className="text-blue-600"/> Editar Cliente</> : <><User size={18} className="text-green-600"/> Nuevo Cliente</>}
                    </h2>
                    <button onClick={close} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
                    <div className="p-6 space-y-6 flex-1">

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Datos Básicos */}
                        <div className="space-y-4">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b pb-2">Datos Principales</h3>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Tipo Doc.</label>
                                    <select
                                        name="docType"
                                        defaultValue={customerToEdit?.docType || "DNI"}
                                        className="w-full pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 appearance-none bg-no-repeat cursor-pointer"
                                        style={{
                                            backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="%239CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"></polyline></svg>')`,
                                            backgroundPosition: 'right 0.75rem center',
                                            backgroundSize: '1em'
                                        }}
                                    >
                                        <option value="DNI">DNI</option>
                                        <option value="RUC">RUC</option>
                                        <option value="CE">CE</option>
                                        <option value="PASAPORTE">PASAPORTE</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-700 mb-1">N° Documento *</label>
                                    <input required name="documentNumber" type="text" defaultValue={customerToEdit?.documentNumber} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Nombre Completo / Razón Social *</label>
                                <input required name="name" type="text" defaultValue={customerToEdit?.name} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Teléfono</label>
                                    <input name="phone" type="text" defaultValue={customerToEdit?.phone} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Dirección</label>
                                    <input name="address" type="text" defaultValue={customerToEdit?.address} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500" />
                                </div>
                            </div>
                        </div>

                        {/* Sastrería */}
                        <div className="space-y-4 pt-2">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b pb-2 flex items-center gap-1">
                                <Ruler size={14} /> Perfil de Sastrería
                            </h3>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Medidas Corporales</label>
                                <textarea name="measurements" defaultValue={customerToEdit?.measurements} rows={3} placeholder="Ej: Busto 90cm, Cintura 70cm, Cadera 95cm..." className="w-full px-3 py-2 bg-blue-50/30 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 resize-none"></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Notas y Preferencias</label>
                                <textarea name="notes" defaultValue={customerToEdit?.notes} rows={2} placeholder="Ej: Prefiere entalles holgados..." className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-500 resize-none"></textarea>
                            </div>
                        </div>

                    </div>

                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                        <button type="button" onClick={close} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 bg-gray-100 rounded-lg transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isPending} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:animate-pulse rounded-lg transition-colors shadow-sm">
                            <Save size={16} />
                            {isPending ? 'Guardando...' : 'Guardar Cliente'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
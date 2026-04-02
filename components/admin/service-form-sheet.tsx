"use client";

import { useState, useTransition, useEffect } from "react";
import { X, Save, Scissors, User, DollarSign, Calendar, Search, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveService } from "@/actions/services";

type ServiceCustomer = { id: string; name: string; documentNumber: string; docType?: string };
type ServiceEditProps = {
    id?: string;
    customerId?: string;
    serviceType?: string;
    description?: string;
    serviceNotes?: string;
    price?: number;
    deposit?: number;
    fittingDate?: string | Date | null;
    deliveryDate?: string | Date | null;
};

export function ServiceFormSheet({ serviceToEdit, customers }: { serviceToEdit?: ServiceEditProps, customers: ServiceCustomer[] }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");

    // Estados para el cálculo financiero
    const [price, setPrice] = useState(serviceToEdit?.price || 0);
    const [deposit, setDeposit] = useState(serviceToEdit?.deposit || 0);

    // 👇 NUEVOS ESTADOS: Para el Buscador de Clientes
    const [searchCustomer, setSearchCustomer] = useState("");
    const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState(serviceToEdit?.customerId || "");

    // Filtro reactivo de clientes
    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
        (c.documentNumber && c.documentNumber.includes(searchCustomer))
    );

    // Encontrar el cliente seleccionado para mostrar su nombre
    const selectedCustomerObj = customers.find(c => c.id === selectedCustomerId);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = "unset"; };
    }, []);

    const close = () => router.push("/ame-studio-ops/services");

    const formatDate = (date?: string | Date | null) => {
        if (!date) return "";
        return new Date(date).toISOString().split('T')[0];
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!selectedCustomerId) {
            setError("Por favor, selecciona un cliente para este trabajo.");
            return;
        }

        const formData = new FormData(e.currentTarget);
        const data = {
            id: serviceToEdit?.id,
            customerId: selectedCustomerId, // Usamos el ID del estado
            serviceType: formData.get("serviceType") as string,
            description: formData.get("description") as string,
            serviceNotes: formData.get("serviceNotes") as string,
            price: Number(formData.get("price")),
            deposit: Number(formData.get("deposit")),
            fittingDate: formData.get("fittingDate") as string,
            deliveryDate: formData.get("deliveryDate") as string,
        };

        if (data.price < data.deposit) {
            setError("El adelanto no puede ser mayor al precio total.");
            return;
        }

        startTransition(async () => {
            const result = await saveService(data);
            if (result.success) {
                close();
            } else {
                setError(result.error || "Error al guardar el servicio");
            }
        });
    };

    return (
        <>
            <div onClick={close} className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50 transition-opacity cursor-pointer" />

            <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[60] flex flex-col animate-in slide-in-from-right duration-300">

                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        {serviceToEdit ? <><Scissors size={18} className="text-blue-600"/> Editar Trabajo</> : <><Scissors size={18} className="text-green-600"/> Nuevo Trabajo</>}
                    </h2>
                    <button type="button" onClick={close} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
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

                        {/* 👇 NUEVO SELECTOR DE CLIENTE CON BUSCADOR */}
                        <div className="space-y-4">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b pb-2 flex items-center gap-1">
                                <User size={14} /> Cliente *
                            </h3>

                            <div className="relative z-50">
                                {/* Botón visible que simula el select */}
                                <div
                                    onClick={() => setIsCustomerDropdownOpen(true)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none hover:border-green-500 cursor-pointer flex justify-between items-center transition-colors"
                                >
                                    <span className={selectedCustomerObj ? "text-gray-900 font-bold truncate pr-2" : "text-gray-400"}>
                                        {selectedCustomerObj ? `${selectedCustomerObj.name} (${selectedCustomerObj.documentNumber})` : "Buscar y seleccionar cliente..."}
                                    </span>
                                    <ChevronDown size={16} className="text-gray-400 shrink-0" />
                                </div>

                                {/* Menú Flotante */}
                                {isCustomerDropdownOpen && (
                                    <>
                                        {/* Overlay para cerrar al dar clic afuera */}
                                        <div className="fixed inset-0 z-40" onClick={() => setIsCustomerDropdownOpen(false)}></div>

                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                                            {/* Barra de Búsqueda interna */}
                                            <div className="p-2 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                                                <Search size={14} className="text-gray-400 shrink-0" />
                                                <input
                                                    type="text"
                                                    autoFocus
                                                    placeholder="Buscar por DNI o nombre..."
                                                    value={searchCustomer}
                                                    onChange={(e) => setSearchCustomer(e.target.value)}
                                                    className="w-full bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
                                                />
                                            </div>

                                            {/* Lista de Resultados */}
                                            <div className="max-h-48 overflow-y-auto py-1">
                                                {filteredCustomers.length === 0 ? (
                                                    <div className="p-3 text-sm text-gray-500 text-center italic">No se encontraron clientes.</div>
                                                ) : (
                                                    filteredCustomers.map(c => (
                                                        <div
                                                            key={c.id}
                                                            onClick={() => {
                                                                setSelectedCustomerId(c.id);
                                                                setIsCustomerDropdownOpen(false);
                                                                setSearchCustomer(""); // Limpia la búsqueda
                                                            }}
                                                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-green-50 transition-colors flex flex-col ${selectedCustomerId === c.id ? 'bg-green-50 border-l-2 border-green-500' : 'border-l-2 border-transparent'}`}
                                                        >
                                                            <span className={`font-medium ${selectedCustomerId === c.id ? 'text-green-800 font-bold' : 'text-gray-900'}`}>{c.name}</span>
                                                            <span className="text-[10px] text-gray-500 font-medium">{c.docType}: {c.documentNumber}</span>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Detalles del Trabajo */}
                        <div className="space-y-4 pt-2">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b pb-2 flex items-center gap-1">
                                <Scissors size={14} /> Detalle del Servicio
                            </h3>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Tipo de Trabajo *</label>
                                <input required name="serviceType" defaultValue={serviceToEdit?.serviceType} placeholder="Ej: Entalle de Vestido de Novia" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Descripción de la prenda *</label>
                                <textarea required name="description" defaultValue={serviceToEdit?.description} rows={2} placeholder="Ej: Vestido blanco talla M con encaje..." className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 resize-none"></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Instrucciones / Notas para el Taller</label>
                                <textarea name="serviceNotes" defaultValue={serviceToEdit?.serviceNotes} rows={2} placeholder="Ej: Reducir 2cm de cintura y subir basta..." className="w-full px-3 py-2 bg-blue-50/50 border border-blue-100 rounded-lg text-sm outline-none focus:border-blue-500 resize-none"></textarea>
                            </div>
                        </div>

                        {/* Fechas */}
                        <div className="space-y-4 pt-2">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b pb-2 flex items-center gap-1">
                                <Calendar size={14} /> Cronograma
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Día de Prueba (Fitting)</label>
                                    <input type="date" name="fittingDate" defaultValue={formatDate(serviceToEdit?.fittingDate)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Fecha de Entrega</label>
                                    <input type="date" name="deliveryDate" defaultValue={formatDate(serviceToEdit?.deliveryDate)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500" />
                                </div>
                            </div>
                        </div>

                        {/* Pagos */}
                        <div className="space-y-4 pt-2">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b pb-2 flex items-center gap-1">
                                <DollarSign size={14} /> Presupuesto
                            </h3>
                            <div className="grid grid-cols-3 gap-3 items-end">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Precio Total (S/)</label>
                                    <input required type="number" step="0.10" min="0" name="price" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Adelanto (S/)</label>
                                    <input required type="number" step="0.10" min="0" name="deposit" value={deposit} onChange={(e) => setDeposit(Number(e.target.value))} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500" />
                                </div>
                                <div className="p-2 bg-gray-100 rounded-lg text-center border border-gray-200">
                                    <span className="block text-[10px] font-bold text-gray-500 uppercase">Saldo Pendiente</span>
                                    <span className={`text-sm font-black ${price - deposit > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        S/ {(price - deposit).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                        <button type="button" onClick={close} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 bg-gray-100 rounded-lg transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isPending} className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:animate-pulse rounded-lg transition-colors shadow-sm">
                            <Save size={16} />
                            {isPending ? 'Guardando...' : 'Guardar Trabajo'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
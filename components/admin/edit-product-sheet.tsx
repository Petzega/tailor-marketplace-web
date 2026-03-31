"use client";

import { updateProduct } from "@/actions/products";
import { Product } from "@/types";
import { Save, X, AlertTriangle, Link as LinkIcon, Upload, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { GENDERS, CLOTHING_TYPES } from "@/lib/constants";

interface EditSheetProps {
    product: Product & { sizes?: { id: string, size: string, stock: number }[] };
}

export function EditProductSheet({ product }: EditSheetProps) {
    const router = useRouter();

    const [inputType, setInputType] = useState<'url' | 'file'>('url');
    const [preview, setPreview] = useState<string | null>(product.imageUrl);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [category, setCategory] = useState(product.category || "READY_MADE");

    const initialSizes = product.sizes ? product.sizes.map(s => ({ size: s.size, stock: s.stock })) : [];
    const [sizes, setSizes] = useState<{ size: string, stock: number | string }[]>(initialSizes);
    const [manualStock, setManualStock] = useState<string>(initialSizes.length > 0 ? "" : String(product.stock));

    // 👇 NUEVO: Estado para controlar el error de la imagen
    const [imageError, setImageError] = useState<string | null>(null);

    const urlInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const addSize = () => setSizes([...sizes, { size: '', stock: '' }]);
    const updateSize = (index: number, field: 'size' | 'stock', value: string | number) => {
        const newSizes = [...sizes];
        newSizes[index] = { ...newSizes[index], [field]: value as never };
        setSizes(newSizes);
    };
    const removeSize = (index: number) => setSizes(sizes.filter((_, i) => i !== index));

    const totalSizesStock = sizes.reduce((sum, s) => sum + (Number(s.stock) || 0), 0);
    const hasSizes = sizes.length > 0;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setImageError(null);

        if (file) {
            const MAX_SIZE_MB = 5;
            const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

            if (file.size > MAX_SIZE_BYTES) {
                // 👇 Modificamos para usar el estado en lugar de alert()
                setImageError(`La imagen es muy pesada. El tamaño máximo permitido es de ${MAX_SIZE_MB}MB.`);
                if (fileInputRef.current) fileInputRef.current.value = '';
                setPreview(product.imageUrl); // Restauramos la preview original en caso de error
                return;
            }

            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowModal(true);
    };

    const handleConfirmUpdate = async () => {
        setIsLoading(true);
        const form = document.getElementById("edit-form") as HTMLFormElement;
        const formData = new FormData(form);

        const result = await updateProduct(product.id, formData);

        if (result.success) {
            setShowModal(false);
            router.push("/ame-studio-ops/inventory?action=updated", { scroll: false });
            router.refresh();
        } else {
            setIsLoading(false);
            alert("Error al actualizar el producto");
        }
    };

    const formatLabel = (text: string) => {
        if (text === 'NINO') return 'Niño';
        if (text === 'NINA') return 'Niña';
        return text.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    const sortedGenders = [...GENDERS].sort((a, b) => formatLabel(a).localeCompare(formatLabel(b), 'es'));
    const sortedClothingTypes = [...CLOTHING_TYPES].sort((a, b) => formatLabel(a).localeCompare(formatLabel(b), 'es'));

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <Link href="/ame-studio-ops/inventory" className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" />

            <div className="relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto border-l border-gray-100 flex flex-col animate-in slide-in-from-right duration-300">

                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Editar Producto</h2>
                        <p className="text-xs text-gray-500">SKU: <span className="font-mono">{product.sku}</span></p>
                    </div>
                    <Link href="/ame-studio-ops/inventory" className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} />
                    </Link>
                </div>

                <form id="edit-form" onSubmit={handleSubmit} className="flex-1 p-6 space-y-6">
                    <input type="hidden" name="sizesData" value={JSON.stringify(sizes)} />

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Imagen del Producto</label>
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button type="button" onClick={() => setInputType('url')} className={`p-1.5 rounded-md transition-all ${inputType === 'url' ? 'bg-white shadow-sm text-green-600' : 'text-gray-400'}`} title="URL"><LinkIcon size={14} /></button>
                                <button type="button" onClick={() => setInputType('file')} className={`p-1.5 rounded-md transition-all ${inputType === 'file' ? 'bg-white shadow-sm text-green-600' : 'text-gray-400'}`} title="Subir"><Upload size={14} /></button>
                            </div>
                        </div>

                        {inputType === 'url' && (
                            <div onClick={() => urlInputRef.current?.focus()} className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors group cursor-pointer relative">
                                <div className="bg-green-50 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                    <LinkIcon className="text-green-600" size={20} />
                                </div>
                                <input ref={urlInputRef} name="imageUrl" type="url" defaultValue={product.imageUrl || ""} placeholder="Pegar URL (https://...)" className="w-full text-center text-xs bg-transparent outline-none placeholder:text-gray-400 text-gray-700" />
                            </div>
                        )}

                        {inputType === 'file' && (
                            <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors group cursor-pointer relative overflow-hidden h-32 ${imageError ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                                {preview && <NextImage src={preview} fill className="object-cover opacity-30 group-hover:opacity-20 transition-opacity" alt="Preview" />}
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="bg-blue-50 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                        <ImageIcon className="text-blue-600" size={20} />
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium">{preview ? "Clic para cambiar" : "Subir nueva imagen"}</p>
                                </div>
                                <input ref={fileInputRef} name="imageFile" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </div>
                        )}

                        {/* 👇 Renderizado condicional del error */}
                        {imageError && (
                            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2.5 rounded-lg border border-red-100 text-xs font-medium animate-in fade-in slide-in-from-top-1">
                                <AlertTriangle size={14} className="shrink-0" />
                                <p>{imageError}</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Nombre</label>
                        <input name="name" type="text" defaultValue={product.name} required className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500" />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Categoría</label>
                        <select
                            name="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none bg-white focus:border-green-500"
                        >
                            <option value="READY_MADE">Prenda de Vestir</option>
                            <option value="SERVICE">Servicio</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Género</label>
                            <select
                                name="gender"
                                defaultValue={product.gender || ""}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-green-500"
                            >
                                <option value="">Sin especificar</option>
                                {sortedGenders.map(g => (
                                    <option key={g} value={g}>{formatLabel(g)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Tipo Prenda</label>
                            <select
                                name="clothingType"
                                defaultValue={product.clothingType || ""}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-green-500"
                            >
                                <option value="">Sin especificar</option>
                                {sortedClothingTypes.map(c => (
                                    <option key={c} value={c}>{formatLabel(c)}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {category !== 'SERVICE' && (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Tallas (Opcional)</label>
                                <button type="button" onClick={addSize} className="text-xs font-medium text-green-600 hover:text-green-700 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md">
                                    <Plus size={14} /> Agregar Talla
                                </button>
                            </div>

                            {sizes.length > 0 ? (
                                <div className="space-y-2 mb-3">
                                    {sizes.map((s, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                placeholder="Ej: S, 32, XL"
                                                value={s.size}
                                                onChange={(e) => updateSize(index, 'size', e.target.value)}
                                                className="w-1/2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500" required
                                            />
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                placeholder="0"
                                                value={s.stock}
                                                onChange={(e) => {
                                                    let val = e.target.value.replace(/\D/g, '');
                                                    val = val.replace(/^0+(?=\d)/, '');
                                                    updateSize(index, 'stock', val);
                                                }}
                                                className="w-1/3 px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500" required
                                            />
                                            <button type="button" onClick={() => removeSize(index)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 italic mb-3">No hay tallas configuradas. Usa el stock general.</p>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Precio</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-400 text-sm">S/</span>
                                <input name="price" type="number" step="0.01" defaultValue={product.price} required className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide flex justify-between">
                                Stock Total {hasSizes && <span className="text-green-600 normal-case">(Auto)</span>}
                            </label>
                            <input
                                name="stock"
                                type="number"
                                required
                                value={hasSizes ? totalSizesStock : manualStock}
                                onChange={(e) => !hasSizes && setManualStock(e.target.value)}
                                readOnly={hasSizes}
                                placeholder="0"
                                className={`w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 ${hasSizes ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Descripción</label>
                        <textarea name="description" rows={4} defaultValue={product.description || ""} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 resize-none" />
                    </div>

                    <div className="pt-4 mt-auto">
                        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-all active:scale-95 shadow-md shadow-green-200">
                            <Save size={18} />
                            Guardar Cambios
                        </button>
                    </div>

                </form>

                {showModal && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-200">
                        <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100 w-[90%] max-w-sm animate-in zoom-in-95 leading-tight">
                            <div className="flex items-start gap-3 text-amber-600 mb-3">
                                <AlertTriangle size={24} className="shrink-0" />
                                <div>
                                    <h3 className="font-bold text-gray-900">¿Confirmar cambios?</h3>
                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                        Estás a punto de actualizar los datos de <strong>{product.name}</strong>. Esta acción es inmediata.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button onClick={() => setShowModal(false)} className="flex-1 py-2 text-xs font-medium border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
                                <button onClick={handleConfirmUpdate} disabled={isLoading} className="flex-1 py-2 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm transition-colors">
                                    {isLoading ? 'Guardando...' : 'Sí, Actualizar'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
export function ProductGridSkeleton() {
    // Generamos 8 elementos para la cuadrícula
    const skeletons = Array.from({ length: 8 });

    return (
        <div className="flex flex-col w-full h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-stretch">
                {skeletons.map((_, i) => (
                    <div key={i} className="group relative flex flex-col h-full animate-pulse">

                        {/* Caja de la Imagen (aspect-square) */}
                        <div className="relative aspect-square w-full rounded-xl bg-gray-200 mb-3" />

                        {/* Textos Simulados */}
                        <div className="flex flex-col flex-1">
                            <div className="flex flex-col mb-3 gap-2">
                                {/* Simula un título de 2 líneas */}
                                <div className="h-5 w-3/4 bg-gray-200 rounded" />
                                <div className="h-5 w-1/2 bg-gray-200 rounded" />
                                {/* Simula la descripción */}
                                <div className="h-4 w-full bg-gray-100 rounded mt-2" />
                            </div>

                            {/* Precio y Botones anclados al fondo exacto */}
                            <div className="mt-auto flex flex-col gap-4">
                                <div className="h-6 w-1/3 bg-gray-200 rounded" />
                                <div className="h-12 w-full bg-gray-200 rounded-lg" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export function ProductGridSkeleton() {
    // Generamos un array de 8 elementos vacíos para dibujar 8 tarjetas fantasma
    const skeletons = Array.from({ length: 8 });

    return (
        <div className="flex flex-col w-full h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {skeletons.map((_, i) => (
                    <div key={i} className="flex flex-col gap-3 animate-pulse">
                        {/* Caja de la imagen */}
                        <div className="aspect-square w-full rounded-xl bg-gray-200" />

                        {/* Textos simulados */}
                        <div className="flex flex-col flex-1 mt-2 gap-2">
                            <div className="h-5 w-3/4 bg-gray-200 rounded" />
                            <div className="h-4 w-full bg-gray-100 rounded" />
                            <div className="h-6 w-1/3 bg-gray-200 rounded mt-2" />

                            {/* Botón simulado */}
                            <div className="h-10 w-full bg-gray-200 rounded-lg mt-auto" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
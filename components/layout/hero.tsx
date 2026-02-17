export function Hero() {
    return (
        <div className="relative h-[400px] w-full overflow-hidden bg-gray-900">

            {/* 1. Imagen de Fondo con Overlay */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=2000"
                    alt="Sewing Background"
                    className="h-full w-full object-cover opacity-40"
                />
                {/* Gradiente para que el texto se lea mejor */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent" />
            </div>

            {/* 2. Contenido de Texto */}
            <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                    Premium Sewing & Alterations
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-gray-200">
                    Shop our curated collection of handmade garments or book our expert alteration services directly.
                </p>

                {/* 3. Botones (Opcional, el diseño tiene unos tabs abajo, pero esto viste mucho) */}
                <div className="mt-8 flex gap-4">
                    {/* Aquí irían los botones si quisiéramos ponerlos en el banner */}
                </div>
            </div>
        </div>
    );
}
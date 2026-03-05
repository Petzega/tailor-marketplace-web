import Link from "next/link";
import { Facebook, Instagram, Laptop, ArrowRight, Store } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-10 lg:pt-16 pb-8 relative overflow-hidden">
            {/* Decoración sutil superior para enmarcar el footer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Reducimos el gap y el margen inferior en móvil (gap-10 mb-10), pero lo mantenemos grande en escritorio (lg:gap-8 lg:mb-16) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-10 lg:mb-16">

                    {/* Columna 1: Marca y Quiénes Somos */}
                    <div className="lg:col-span-4 lg:pr-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white font-bold shadow-sm">
                                S
                            </div>
                            <span className="text-2xl font-black text-gray-900 tracking-tight">Stitch & Style</span>
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Quiénes Somos</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            Nacimos en Iquitos con la visión de redefinir la moda local. Más que ropa, creamos confianza a través de prendas listas para usar y un servicio de sastrería a medida con la más alta calidad y atención al detalle.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="p-2.5 bg-gray-50 border border-gray-200 rounded-full text-gray-500 hover:text-green-600 hover:border-green-200 hover:bg-green-50 transition-all shadow-sm">
                                <span className="sr-only">Instagram</span>
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="p-2.5 bg-gray-50 border border-gray-200 rounded-full text-gray-500 hover:text-green-600 hover:border-green-200 hover:bg-green-50 transition-all shadow-sm">
                                <span className="sr-only">Facebook</span>
                                <Facebook size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Columna 2: Explorar y Legal */}
                    {/* 👇 AQUÍ ESTÁ EL FIX: Usamos "grid grid-cols-2" en móvil para que estén lado a lado, y "lg:flex lg:flex-col" en escritorio */}
                    <div className="lg:col-span-2 grid grid-cols-2 lg:flex lg:flex-col gap-6 lg:gap-8">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4">Explorar</h3>
                            <ul className="space-y-3.5">
                                <li>
                                    <Link href="/search" className="text-sm text-gray-500 hover:text-green-600 font-medium transition-colors">
                                        Catálogo
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/search?category=SERVICE" className="text-sm text-gray-500 hover:text-green-600 font-medium transition-colors">
                                        Sastrería
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4">Legal</h3>
                            <ul className="space-y-3.5">
                                <li>
                                    <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
                                        Términos
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
                                        Privacidad
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Columna 3: Promoción - Vende con nosotros */}
                    <div className="lg:col-span-3">
                        <div className="bg-green-100 rounded-2xl p-6 border border-green-200 h-full flex flex-col justify-between relative overflow-hidden group transition-all hover:border-green-300">
                            <div className="absolute -right-6 -top-6 bg-green-200 w-24 h-24 rounded-full group-hover:scale-110 transition-transform duration-500" />

                            <div className="relative z-10 mb-6">
                                <div className="flex items-center gap-2 text-green-800 mb-3">
                                    <Store size={20} />
                                    <h3 className="font-black text-xs uppercase tracking-wider">Únete al Catálogo</h3>
                                </div>
                                <h4 className="text-green-950 font-bold text-lg mb-2">¿Quieres vender con nosotros?</h4>
                                <p className="text-green-800 text-sm leading-relaxed">
                                    Si tienes una marca o confeccionas prendas, exhibe tus productos aquí y llega a más clientes.
                                </p>
                            </div>
                            <a
                                href="https://wa.me/51992431513?text=Hola,%20me%20gustaría%20recibir%20información%20para%20vender%20mis%20productos%20en%20Stitch%20&%20Style"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex relative z-10 w-full items-center justify-center gap-2 bg-green-700 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-green-800 transition-colors active:scale-95 mt-auto"
                            >
                                Más información <ArrowRight size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Columna 4: Promoción - Desarrollo Web */}
                    <div className="lg:col-span-3">
                        <div className="bg-gray-100 rounded-2xl p-6 border border-gray-200 relative overflow-hidden group h-full flex flex-col justify-between transition-all hover:border-gray-300">
                            <div className="absolute -right-6 -top-6 bg-gray-200 w-24 h-24 rounded-full group-hover:scale-110 transition-transform duration-500" />

                            <div className="relative z-10 mb-6">
                                <div className="flex items-center gap-2 text-green-700 mb-3">
                                    <Laptop size={20} />
                                    <h3 className="font-black text-xs uppercase tracking-wider">Desarrollo Web</h3>
                                </div>
                                <h4 className="text-gray-900 font-bold text-lg mb-2">¿Te gusta esta tienda?</h4>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    Diseñamos y desarrollamos tiendas online modernas y rápidas para hacer crecer tus ventas.
                                </p>
                            </div>
                            <a
                                href="https://wa.me/51992431513?text=Hola,%20me%20gustó%20la%20página%20de%20Stitch%20&%20Style%20y%20quisiera%20cotizar%20una%20web%20para%20mi%20negocio"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex relative z-10 w-full items-center justify-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-black transition-colors active:scale-95 mt-auto"
                            >
                                Cotizar mi web <ArrowRight size={16} />
                            </a>
                        </div>
                    </div>

                </div>

                {/* Zona inferior de créditos */}
                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <p className="text-sm text-gray-500 font-medium">
                        &copy; {new Date().getFullYear()} Stitch & Style. Todos los derechos reservados.
                    </p>
                    <p className="text-sm text-gray-400 flex items-center justify-center md:justify-end gap-1.5">
                        Diseñado con <span className="text-red-500 text-lg animate-pulse">♥</span> en Iquitos - Perú
                    </p>
                </div>
            </div>
        </footer>
    );
}
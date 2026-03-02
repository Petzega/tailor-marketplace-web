import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Columna 1: Marca */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white font-bold">
                                S
                            </div>
                            <span className="text-xl font-bold text-gray-900 tracking-tight">Stitch & Style</span>
                        </div>
                        <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                            Más que ropa, creamos confianza. Prendas listas para usar y servicios de sastrería a medida con la más alta calidad y atención al detalle.
                        </p>
                        <div className="flex gap-4 mt-6">
                            <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">
                                <span className="sr-only">Instagram</span>
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">
                                <span className="sr-only">Facebook</span>
                                <Facebook size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Columna 2: Tienda (Reducida a lo esencial) */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Explorar</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/search" className="text-sm text-gray-500 hover:text-green-600 transition-colors">
                                    Catálogo Completo
                                </Link>
                            </li>
                            <li>
                                <Link href="/search?category=SERVICE" className="text-sm text-gray-500 hover:text-green-600 transition-colors">
                                    Servicios de Sastrería
                                </Link>
                            </li>
                            <li>
                                {/* Reemplaza los ceros con tu número */}
                                <a href="https://wa.me/51992431513" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-green-600 transition-colors">
                                    Contacto Directo
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 3: Legal (Genera confianza) */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                                    Términos de Servicio
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                                    Política de Privacidad
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Stitch & Style. Todos los derechos reservados.
                    </p>
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                        Hecho con <span className="text-red-500 text-lg">♥</span> en Iquitos - Perú
                    </p>
                </div>
            </div>
        </footer>
    );
}
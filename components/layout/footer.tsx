import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* 1. Grid de 4 Columnas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Columna 1: Marca */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white font-bold">
                                S
                            </div>
                            <span className="text-xl font-bold text-gray-900">Stitch & Style</span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                            Expert alterations and curated ready-to-wear fashion. Bringing quality craftsmanship back to your wardrobe.
                        </p>
                    </div>

                    {/* Columna 2: Shop */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">SHOP</h3>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link href="#" className="hover:text-green-600">New Arrivals</Link></li>
                            <li><Link href="#" className="hover:text-green-600">Dresses</Link></li>
                            <li><Link href="#" className="hover:text-green-600">Accessories</Link></li>
                            <li><Link href="#" className="hover:text-green-600">Sale</Link></li>
                        </ul>
                    </div>

                    {/* Columna 3: Services */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">SERVICES</h3>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link href="#" className="hover:text-green-600">Hemming & Resizing</Link></li>
                            <li><Link href="#" className="hover:text-green-600">Zipper Repair</Link></li>
                            <li><Link href="#" className="hover:text-green-600">Custom Tailoring</Link></li>
                            <li><Link href="#" className="hover:text-green-600">Consultation</Link></li>
                        </ul>
                    </div>

                    {/* Columna 4: Contact */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">CONTACT</h3>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-green-600 shrink-0" />
                                <span>123 Fashion Ave, Design District</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-green-600 shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-green-600 shrink-0" />
                                <span>hello@stitchstyle.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 2. Barra Inferior (Copyright) */}
                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">
                        © 2024 Stitch & Style. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="text-gray-400 hover:text-green-600 transition-colors">
                            <Instagram className="h-5 w-5" />
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-green-600 transition-colors">
                            <Facebook className="h-5 w-5" />
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-green-600 transition-colors">
                            <Twitter className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
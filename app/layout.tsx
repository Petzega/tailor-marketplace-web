import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { CartSheet } from "@/components/cart/cart-sheet"; // 👈 Importamos el carrito

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AME | Araceli Moda y Estilos",
    description: "Marketplace de moda y servicios de sastrería",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className={inter.className}>
                {/* Navegación superior global */}
                <Navbar />

                {/* Contenido principal de cada página */}
                <main>
                    {children}
                </main>

                {/* 👇 El panel lateral del carrito, disponible globalmente */}
                <CartSheet />
            </body>
        </html>
    );
}
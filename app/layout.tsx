import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { CartSheet } from "@/components/cart/cart-sheet"; // 👈 Importamos el carrito

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Stitch & Style",
    description: "Tailor Marketplace - Custom clothing and tailoring services",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
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
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { CartSheet } from "@/components/cart/cart-sheet";
import { ClerkProvider } from "@clerk/nextjs";

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
        <ClerkProvider>
            <html lang="es">
            <body className={inter.className}>
            <Navbar />
            <main>{children}</main>
            <CartSheet />
            </body>
            </html>
        </ClerkProvider>
    );
}
"use client";

import { useEffect } from "react";

export function ScrollToTop() {
    useEffect(() => {
        // Al cargar el componente, forzamos el scroll hacia arriba de forma instantánea
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, []);

    return null; // No dibuja nada en pantalla, solo hace la magia
}
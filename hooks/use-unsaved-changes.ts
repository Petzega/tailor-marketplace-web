import { useEffect, useState, useCallback } from "react";

export function useUnsavedChanges(closeAction: () => void) {
    const [isDirty, setIsDirty] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Intenta cerrar. Si hay cambios, abre el modal. Si no, cierra directo.
    const attemptClose = useCallback(() => {
        if (isDirty) {
            setShowConfirmModal(true);
        } else {
            closeAction();
        }
    }, [isDirty, closeAction]);

    // El usuario confirmó salir sin guardar
    const confirmClose = useCallback(() => {
        setShowConfirmModal(false);
        closeAction();
    }, [closeAction]);

    // El usuario canceló la salida (quiere seguir editando)
    const cancelClose = useCallback(() => {
        setShowConfirmModal(false);
    }, []);

    // Escucha global de la tecla ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                if (showConfirmModal) {
                    cancelClose(); // Si el modal de alerta está abierto, ESC lo cierra
                } else {
                    attemptClose(); // Si no, intenta cerrar el formulario
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [attemptClose, showConfirmModal, cancelClose]);

    return {
        setIsDirty,
        attemptClose,
        showConfirmModal,
        confirmClose,
        cancelClose
    };
}
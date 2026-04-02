import { useEffect, useState, useCallback } from "react";

export function useUnsavedChanges(closeAction: () => void) {
    const [isDirty, setIsDirty] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const attemptClose = useCallback(() => {
        if (isDirty) {
            setShowModal(true);
        } else {
            closeAction();
        }
    }, [isDirty, closeAction]);

    const confirmClose = useCallback(() => {
        setShowModal(false);
        closeAction();
    }, [closeAction]);

    const cancelClose = useCallback(() => {
        setShowModal(false);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                if (showModal) {
                    cancelClose();
                } else {
                    attemptClose();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [attemptClose, showModal, cancelClose]);

    return { setIsDirty, attemptClose, showModal, confirmClose, cancelClose };
}
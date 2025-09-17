import { useCallback, useState } from "react";
import { UseToggle } from "../../domains/hooks/useToggle";

export const useToggle = (initialValue: boolean = false): UseToggle => {
    const [isOpen, setIsOpen] = useState<boolean>(initialValue);

    const toggle = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const open = useCallback(() => {
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    return {
        isOpen,
        toggle,
        open,
        close,
        setIsOpen,
    };
};
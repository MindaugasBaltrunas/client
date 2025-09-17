export interface UseToggle {
    isOpen: boolean;
    toggle: () => void;
    open: () => void;
    close: () => void;
    setIsOpen: (value: boolean) => void;
}
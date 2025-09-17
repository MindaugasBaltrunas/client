export type ToastHandler = {
    success?: (msg: string) => void;
    error?: (msg: string) => void;
};

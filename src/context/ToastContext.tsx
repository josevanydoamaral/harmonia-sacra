import { createContext, useState, type ReactNode } from "react";

export type ToastType = 'error' | 'success' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

export interface ToastContextType {
    showError(message: string): void;

    showSuccess(message: string): void;

    showInfo(message: string): void;

    removeToast(id: string): void;

    toasts: Toast[];
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([])
    
    function removeToast(id: string) {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }

    function addToast(message: string, type: ToastType) {
        const id = crypto.randomUUID();

        const newToast: Toast = { id, message, type };

        setToasts((prev) => [...prev, newToast]);

        setTimeout(() => {
            removeToast(id);
        }, 4000)
    }

    function showError(message: string) {
        addToast(message, 'error');
    }

    function showSuccess(message: string) {
        addToast(message, 'success');
    }

    function showInfo(message:string) {
        addToast(message, 'info')
    }

    return (
        <ToastContext.Provider value={{ toasts, showError, showSuccess, showInfo, removeToast }}>
            {children}
        </ToastContext.Provider>

    )

}
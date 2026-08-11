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
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([])
    
    function removeToast(id: string) {
        
    }
}
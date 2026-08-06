import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

export const GuestRoute = ({ children }: { children: ReactNode}) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-text-main">A carregar...</div>
    }

    if (user) {
        return <Navigate to="/" replace />
    }

    return children;
}
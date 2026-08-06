import type React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";


export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();


    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-text-main">A carregar...</div>
    }

    if (!user) {
        return <Navigate replace to="/login" />
    }

    return children;

}
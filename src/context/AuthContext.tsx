import type { User } from "firebase/auth";
import type { UserProfile } from "../types/auth";
import React, { createContext, useState } from "react";

export interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    return (
        <AuthContext.Provider value={{ user, profile, loading, logout: async () => {}}}>
            {children}
        </AuthContext.Provider>
    )
}
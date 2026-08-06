import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import type { UserProfile } from "../types/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

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

    const logout = async () => {
        await signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async(firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);

                const docRef = doc(db, 'users', firebaseUser.uid);

                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    setProfile(docSnap.data() as UserProfile)
                } else {
                    setUser(null)
                    setProfile(null)
                }
            } else  {
                setUser(null)
                setProfile(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()

    }, []);

    return (
        <AuthContext.Provider value={{ user, profile, loading, logout: logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider.")
    }
    return context;
}
import { useEffect, useState } from "react"
import type { UserProfile } from "../types/auth"
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export const useAccounts = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        const docRef = collection(db, 'users');

        const unsubscribe = onSnapshot(docRef, (snapshot) => {
            const userData = snapshot.docs.map((doc) => 
                ({ uuid: doc.id, ...doc.data() }) as UserProfile
            )

            setUsers(userData)
            setLoading(false)
        }, (error) => {
            setError(error.message);
        });

        return () => unsubscribe();

    }, [])

    return { users, loading, error }
}
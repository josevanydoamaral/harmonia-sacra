import type { Timestamp } from "firebase/firestore";

export type UserRole = 'admin' | 'editor';

export interface UserProfile {
    uuid: string,
    email: string,
    role: UserRole,
    createdAt: Timestamp
}


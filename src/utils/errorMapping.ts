import type { FirebaseError } from "firebase/app"


const errorMapping: Record<string, string> = {
    'auth/invalid-credential': "E-mail ou palavra-passe incorretos.",
    'auth/email-already-in-use': "Este e-mail já está a ser utilizado.",
    'storage/unauthorized': "Não tens permissão para efetuar este carregamento.",
    'firestore/permission-denied': "Sem permissões para realizar esta ação."
}

export const getFriendlyErrorMessage = (error: FirebaseError | unknown): string => {
    if (typeof(error) === 'object' && error !== null && 'code' in error) {
        const firebaseError = (error as { code: string }).code
        return errorMapping[firebaseError] ?? "Ocorreu um erro inesperado. Tente novamente."
        
    } else {
        return "Ocorreu um erro inesperado. Tente novamente."
    }
}
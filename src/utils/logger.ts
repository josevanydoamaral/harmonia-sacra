function prefix(context: string) {
    return `[${context}]`;
}

export const logger = {
    info(context: string, message: string) {
        if (!import.meta.env.DEV) return;
        
        console.log(`${prefix(context)} - ${message}`);
    },

    warn(context: string, message: string, data?: unknown) {
        if (!import.meta.env.DEV) return;

        if (data) {
            console.warn(`${prefix(context)} - ${message}: `, data);
        } else {
            console.warn(`${prefix(context)} - ${message}`);
        }
    },

    error(context: string, message: string, error?: unknown) {
        if (!import.meta.env.DEV) return;

        if (error) {
            console.error(`${prefix(context)} - ${message}: `, error);
        } else {
            console.error(`${prefix(context)} - ${message}`);
        }
    }
};

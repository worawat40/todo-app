import { create } from 'zustand';

interface ErrorStore {
    errors: Record<string, string>;
    message: string;
    status: 'error' | 'success' | null;
    show: boolean;

    setErrors: (errors: Record<string, string>) => void;
    setAlert: (status: 'error' | 'success', message: string, countdown?: number) => void;
    errorHandler: (error: any) => void;
}

export const useErrorStore = create<ErrorStore>((set) => ({
    errors: {},
    message: '',
    status: null,
    show: false,

    setErrors: (errors) => set({ errors }),

    setAlert: (status, message, countdown = 7000) => {
        set({ status, message, show: true });
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
            set({ show: false });
        }, countdown);
    },

    errorHandler: (error) => {
        const { status, data, statusText } = error.response || {};

        if (status === 422 && data?.errors) {
            const fieldErrors: Record<string, string> = {};

            for (const [field, messages] of Object.entries(data.errors)) {
                fieldErrors[field] = (messages as string[]).join(' ');
            }

            set({ errors: fieldErrors });
        } else {
            set({
                status: 'error',
                message: data?.message || statusText,
                show: true,
            });

            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
                set({ show: false });
            }, 7000);
        }
    },
}));

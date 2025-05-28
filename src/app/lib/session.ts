import { SessionOptions } from 'iron-session';

export const sessionOptions: SessionOptions = {
    password: process.env.NEXT_PUBLIC_APP_SECRET as string,
    cookieName: 'auth_session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
};

export type UserSession = {
    id: string;
    email: string;
    isLoggedIn: boolean;
};

import { getIronSession } from 'iron-session';
import { sessionOptions, UserSession } from '@/app/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const session = await getIronSession<UserSession>(req, res, sessionOptions);

    if (!session?.isLoggedIn) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return res;
}

export const config = {
    matcher: ['/todos/:path*'],
};

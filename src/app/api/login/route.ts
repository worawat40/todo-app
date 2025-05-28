import { NextRequest, NextResponse } from 'next/server';
import { LOGIN_USER } from '@/app/lib/graphql/user.query';
import { loginSchema } from '@/app/lib/validation/request';
import { formatZodErrors } from '@/app/lib/validation/helper';
import { sessionOptions, UserSession } from '@/app/lib/session';
import { getIronSession } from 'iron-session';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    const body = await req.json();

    const result = loginSchema.safeParse(body);
    if (!result.success) {
        return NextResponse.json(
            {
                status: 'error',
                message: 'Validation failed',
                errors: formatZodErrors(result.error),
            },
            { status: 422 },
        );
    }

    const { email, password } = result.data;

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT!, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET!,
            },
            body: JSON.stringify({
                query: LOGIN_USER,
                variables: { email },
            }),
        });

        const { data, errors } = await response.json();

        if (errors) {
            return NextResponse.json({ status: 'error', error: errors[0].message }, { status: 500 });
        }

        const user = data?.users?.[0];

        if (!user) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'User not found',
                },
                { status: 401 },
            );
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'Invalid credentials',
                },
                { status: 401 },
            );
        }

        const { password_hash, ...safeUser } = user;

        const res = NextResponse.json({
            status: 'success',
            data: { user: safeUser },
        });

        const session = await getIronSession<UserSession>(req, res, sessionOptions);
        session.id = user.id;
        session.email = user.email;
        session.isLoggedIn = true;
        await session.save();

        return res;
    } catch (err) {
        console.error('Login error:', err);
        return NextResponse.json(
            {
                status: 'error',
                message: 'Server error',
            },
            { status: 500 },
        );
    }
}

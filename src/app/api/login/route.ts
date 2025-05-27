import { NextResponse } from 'next/server';
import { LOGIN_USER } from '@/app/lib/graphql/user.query';
import { loginSchema } from '@/app/lib/validation/request';
import { formatZodErrors } from '@/app/lib/validation/helper';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
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
                'x-hasura-admin-secret': process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET!,
            },
            body: JSON.stringify({
                query: LOGIN_USER,
                variables: { email },
            }),
        });

        const { data, errors } = await response.json();

        if (errors) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: errors[0].message,
                },
                { status: 500 },
            );
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

        return NextResponse.json({
            status: 'success',
            data: { user: safeUser },
        });
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

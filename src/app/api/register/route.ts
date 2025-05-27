import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { REGISTER_USER } from '@/app/lib/graphql/user.mutation';

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const response = await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT!, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET!,
            },
            body: JSON.stringify({
                query: REGISTER_USER,
                variables: {
                    email,
                    password_hash: passwordHash,
                    name,
                },
            }),
        });

        const result = await response.json();

        if (result.errors) {
            return NextResponse.json({ error: result.errors[0].message }, { status: 500 });
        }

        return NextResponse.json({ user: result.data.insert_users_one }, { status: 201 });
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

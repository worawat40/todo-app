import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { REGISTER_USER } from '@/app/lib/graphql/user.mutation';
import { registerSchema } from '@/app/lib/validation/request';
import { formatZodErrors } from '@/app/lib/validation/helper';

export async function POST(req: Request) {
    const body = await req.json();

    const result = registerSchema.safeParse(body);
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

    try {
        const { email, password, name } = body;

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const response = await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT!, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET!,
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

        const { data, errors } = await response.json();
        
        if (errors) {
            return NextResponse.json({ status: 'error', error: errors[0].message }, { status: 500 });
        }

        return NextResponse.json({ status: 'success', data: data.insert_users_one }, { status: 201 });
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ status: 'error', error: 'Internal Server Error' }, { status: 500 });
    }
}

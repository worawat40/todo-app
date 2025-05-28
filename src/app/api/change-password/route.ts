import { NextResponse } from 'next/server';
import { GET_LIST } from '@/app/lib/graphql/user.query';
import { UPDATE_USER } from '@/app/lib/graphql/user.mutation';
import bcrypt from 'bcryptjs';
import { changePasswordSchema } from '@/app/lib/validation/request';
import { formatZodErrors } from '@/app/lib/validation/helper';

export async function POST(req: Request) {
    const body = await req.json();

    const result = changePasswordSchema.safeParse(body);

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

    const { email, oldPassword, newPassword } = body;

    const response = await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT!, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET!,
        },
        body: JSON.stringify({
            query: GET_LIST,
            variables: { email },
        }),
    });

    const data = await response.json();
    const user = data?.data?.users?.[0];

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
        return NextResponse.json(
            {
                status: 'error',
                message: 'Validation failed',
                errors: {
                    oldPassword: ['Old password is incorrect'],
                },
            },
            { status: 422 },
        );
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    const updateRes = await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT!, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET!,
        },
        body: JSON.stringify({
            query: UPDATE_USER,
            variables: { id: user.id, password_hash: newHash },
        }),
    });

    const updateData = await updateRes.json();

    if (updateData.errors) {
        return NextResponse.json({ error: updateData.errors[0].message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Password updated successfully' });
}

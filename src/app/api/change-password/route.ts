import { NextResponse } from 'next/server';
import { GET_LIST } from '@/app/lib/graphql/user.query';
import { UPDATE_USER } from '@/app/lib/graphql/user.mutation';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    const { email, oldPassword, newPassword } = await req.json();

    if (!email || !oldPassword || !newPassword) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // get user by email
    const response = await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT!, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET!,
        },
        body: JSON.stringify({
            query: GET_LIST,
            variables: { email },
        }),
    });

    const result = await response.json();
    const user = result.data?.users?.[0];

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
        return NextResponse.json({ error: 'Old password is incorrect' }, { status: 401 });
    }

    // Hash new password
    const newHash = await bcrypt.hash(newPassword, 10);

    // Update password
    const updateRes = await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT!, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET!,
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

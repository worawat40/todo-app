import { NextRequest, NextResponse } from 'next/server';
import { GET_LIST } from '@/app/lib/graphql/todos.query';
import { ADD_TODO, UPDATE_TODO, DELETE_TODO } from '@/app/lib/graphql/todos.mutation';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
        return NextResponse.json({ status: 'error', message: 'Missing user_id' }, { status: 400 });
    }

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT!, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET!,
            },
            body: JSON.stringify({
                query: GET_LIST,
                variables: { user_id },
            }),
        });

        const { data, errors } = await response.json();

        if (errors) {
            return NextResponse.json({ status: 'error', error: errors[0].message }, { status: 500 });
        }

        return NextResponse.json({ status: 'success', data: data.todos });
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ status: 'error', error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { title, description, priority, user_id } = body;

    if (!title || !user_id) {
        return NextResponse.json({ status: 'error', message: 'Missing required fields' }, { status: 400 });
    }

    try {
        const res = await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT!, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET!,
            },
            body: JSON.stringify({
                query: ADD_TODO,
                variables: { title, description, priority, user_id },
            }),
        });

        const { data, errors } = await res.json();
        if (errors) return NextResponse.json({ status: 'error', message: errors[0].message }, { status: 500 });

        return NextResponse.json({ status: 'success', data: data.insert_todos_one });
    } catch (err) {
        return NextResponse.json({ status: 'error', message: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const body = await req.json();
    const { id, title, description, priority, completed } = body;

    if (!id) {
        return NextResponse.json({ status: 'error', message: 'Missing todo id' }, { status: 400 });
    }

    try {
        const res = await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT!, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET!,
            },
            body: JSON.stringify({
                query: UPDATE_TODO,
                variables: { id, title, description, priority, completed },
            }),
        });

        const { data, errors } = await res.json();
        if (errors) return NextResponse.json({ status: 'error', message: errors[0].message }, { status: 500 });

        return NextResponse.json({ status: 'success', data: data.update_todos_by_pk });
    } catch (err) {
        return NextResponse.json({ status: 'error', message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id');

    if (!id) {
        return NextResponse.json({ status: 'error', message: 'Missing todo id' }, { status: 400 });
    }

    try {
        const res = await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT!, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET!,
            },
            body: JSON.stringify({
                query: DELETE_TODO,
                variables: { id },
            }),
        });

        const { data, errors } = await res.json();
        if (errors) return NextResponse.json({ status: 'error', message: errors[0].message }, { status: 500 });

        return NextResponse.json({ status: 'success', data: data.delete_todos_by_pk });
    } catch (err) {
        return NextResponse.json({ status: 'error', message: 'Internal server error' }, { status: 500 });
    }
}

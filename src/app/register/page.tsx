'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const onSubmitHandle = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password || !name) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name }),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.error || 'Register failed');
                return;
            }

            router.push('/login');
        } catch (err) {
            console.error('Register error:', err);
            setError('Something went wrong');
        }
    };

    return (
        <div className="flex mt-10 justify-center px-4">
            <div className="w-full max-w-md bg-white shadow-xl/20 rounded-xl p-8 space-y-6">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Create your account</h2>

                {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                <form className="space-y-4" onSubmit={onSubmitHandle}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-[#495057] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-[#495057] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full text-[#495057] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition">
                        Register
                    </button>
                </form>

                <div className="text-center">
                    <Link href="/login" className="text-sm text-blue-600 hover:underline">
                        Already have an account? Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

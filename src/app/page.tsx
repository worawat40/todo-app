'use client';

import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios';
import { useErrorStore } from '@/stores/error';
import InputText from '@/components/InputText';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { errors, setErrors, errorHandler } = useErrorStore();

    const onSubmitHandler = async (e: React.FormEvent) => {
        setErrors({});
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', { email, password });

            if (response.data?.data?.user?.id) {
                localStorage.setItem('user_id', response.data.data.user.id);
            }

            window.location.href = '/todos';
        } catch (err: any) {
            errorHandler(err);
        }
    };

    return (
        <div className="flex mt-10 justify-center px-4">
            <div className="w-full max-w-md bg-white shadow-xl/20 rounded-xl p-8 space-y-6">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Welcome Back!</h2>

                <form className="space-y-4" onSubmit={onSubmitHandler}>
                    <InputText
                        id="email"
                        type="email"
                        placeholder="Enter Email Address..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                    />

                    <InputText
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                    />
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition">
                        Login
                    </button>
                </form>

                <div className="text-center space-y-2">
                    <Link href="/register" className="inline-block text-sm text-gray-700 hover:text-blue-600 underline">
                        Don't have an account? Register
                    </Link>

                    <div>
                        <Link href="/change-password" className="text-sm text-blue-600 hover:underline">
                            Forgot Your Password?
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

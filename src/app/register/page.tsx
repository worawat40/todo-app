'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useErrorStore } from '@/stores/error';
import axios from 'axios';
import InputText from '@/components/InputText';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { errors, setErrors, errorHandler } = useErrorStore();

    const onSubmitHandle = async (e: React.FormEvent) => {
        setErrors({});
        e.preventDefault();
        try {
            await axios.post('/api/register', {
                email,
                password,
                name,
            });

            window.location.href = '/';
        } catch (err: any) {
            errorHandler(err);
        }
    };

    return (
        <div className="flex mt-10 justify-center px-4">
            <div className="w-full max-w-md bg-white shadow-xl/20 rounded-xl p-8 space-y-6">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Create your account</h2>

                <form className="space-y-4" onSubmit={onSubmitHandle}>
                    <InputText
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-[#495057] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        error={errors.name}
                    />

                    <InputText
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-[#495057] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        error={errors.email}
                    />

                    <InputText
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full text-[#495057] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        error={errors.password}
                    />

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition">
                        Register
                    </button>
                </form>

                <div className="text-center">
                    <Link href="/" className="text-sm text-blue-600 hover:underline">
                        Already have an account? Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

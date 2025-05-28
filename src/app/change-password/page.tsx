'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useErrorStore } from '@/stores/error';
import axios from 'axios';
import InputText from '@/components/InputText';

export default function ChangePasswordPage() {
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const { errors, setErrors, errorHandler } = useErrorStore();

    const onSubmitHandle = async (e: React.FormEvent) => {
        setErrors({});
        e.preventDefault();
        try {
            await axios.post('/api/change-password', {
                email,
                oldPassword,
                newPassword,
            });
            window.location.href = '/';
        } catch (err: any) {
            errorHandler(err);
        }
    };

    return (
        <div className="flex mt-10 justify-center px-4">
            <div className="w-full max-w-md bg-white shadow-xl/20 rounded-xl p-8 space-y-6">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Change Password</h2>

                <form className="space-y-4" onSubmit={onSubmitHandle}>
                    <InputText
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        error={errors.email}
                    />
                    <InputText
                        type="password"
                        placeholder="Old password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        error={errors.oldPassword}
                    />
                    <InputText
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        error={errors.newPassword}
                    />

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition">
                        Change Password
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

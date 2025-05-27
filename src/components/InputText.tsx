import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    error?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function InputText({ error, maxLength, value, onChange, ...rest }: InputProps) {
    return (
        <div>
            <input
                type="text"
                value={value}
                onChange={onChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#495057] ${
                    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                {...rest}
            />
            {error && (
                <div className="text-xs text-red-600 mt-1" role="alert">
                    <strong>{error}</strong>
                </div>
            )}
        </div>
    );
}

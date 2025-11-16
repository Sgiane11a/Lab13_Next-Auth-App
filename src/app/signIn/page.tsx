'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaGoogle, FaGithub } from "react-icons/fa";
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const searchParams = useSearchParams();

    useEffect(() => {
        const callbackError = searchParams.get('error');
        if (callbackError === 'CredentialsSignin') {
            setError('Credenciales inválidas. Por favor, inténtelo de nuevo.');
        }
    }, [searchParams]);

    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/dashboard' });
    };

    const handleGithubSignIn = () => {
        signIn('github', { callbackUrl: '/dashboard' });
    };

    const handleCredentialsSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        signIn('credentials', {
            email,
            password,
            callbackUrl: '/dashboard',
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl text-gray-800 font-bold mb-6 text-center">
                    Sign In
                </h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={handleCredentialsSignIn} className="space-y-4 mb-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            autoComplete="email"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Sign In with Email
                    </button>
                </form>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <button onClick={handleGoogleSignIn} className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-black transition flex items-center justify-center gap-2">
                        <FaGoogle />
                        Continue with Google
                    </button>
                    <button onClick={handleGithubSignIn} className="w-full bg-[#333] text-white py-2 px-4 rounded hover:bg-[#444] transition flex items-center justify-center gap-2">
                        <FaGithub />
                        Continue with GitHub
                    </button>
                </div>

                <p className="text-center text-gray-500 text-xs mt-6">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-blue-500 hover:text-blue-800">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}
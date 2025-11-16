'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function LoginPage() {
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        const result = await signIn('google', {
            callbackUrl: '/dashboard',
            redirect: false
        });

        if (result?.ok) {
            router.push('/dashboard');
        }

        if (result?.error) {
            console.error("Authentication Error: ", result.error);
        }
    };

    const handleGithubSignIn = async () => {
        const result = await signIn('github', {
            callbackUrl: '/dashboard',
            redirect: false
        });

        if (result?.ok) {
            router.push('/dashboard');
        }

        if (result?.error) {
            console.error("Authentication Error: ", result.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl text-gray-800 font-bold mb-6 text-center">
                    Sign In
                </h1>
                <div className="space-y-4">
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-black transition flex items-center justify-center gap-2"
                    >
                        <FaGoogle />
                        Continue with Google
                    </button>

                    <button
                        onClick={handleGithubSignIn}
                        className="w-full bg-[#333] text-white py-2 px-4 rounded hover:bg-[#444] transition flex items-center justify-center gap-2"
                    >
                        <FaGithub />
                        Continue with GitHub
                    </button>
                </div>
            </div>
        </div>
    );
}
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Image from 'next/image';

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl text-gray-900 font-bold mb-4">
                        Profile
                    </h1>
                    <div className="mb-6">
                        <p className="text-gray-700 mb-2">
                            Name: <span className="font-semibold">{session?.user?.name}</span>
                        </p>
                        <p className="text-gray-700 mb-2">
                            Email: <span className="font-semibold">{session?.user?.email}</span>
                        </p>
                        {session?.user?.image && (
                            <div className="mt-4">
                                <p className="text-gray-700 mb-2">Profile Image:</p>
                                <Image
                                    height={100}
                                    width={100}
                                    src={session.user.image}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full mt-2"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";
import Provider from "@/components/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next Auth App",
  description: "My Next Auth App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="w-full bg-white shadow-sm border-b">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between text-black">
            <Link href="/" className="text-xl font-semibold">
              MyAuthApp
            </Link>
            <ul className="flex items-center justify-center gap-6 text-sm">
              <li>
                <Link href="/dashboard" className="hover:text-gray-600">
                  Dashboard
                </Link>
              </li>

              {session?.user && (
                <>
                  <li>
                    <Link href="/profile" className="hover:text-gray-600">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <LogoutButton />
                  </li>
                  {session.user.image && (
                    <li>
                      <Image
                        height={100}
                        width={100}
                        src={session.user.image}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                    </li>
                  )}
                </>
              )}

              {!session && (
                <>
                  <li>
                    <Link href="/signIn" className="hover:text-gray-600">
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="hover:text-gray-600">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
        <Provider>
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}
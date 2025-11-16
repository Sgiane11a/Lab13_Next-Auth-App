import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { JWT } from 'next-auth/jwt';
import type { Session, User as NextAuthUser, Account } from 'next-auth';
import bcrypt from 'bcryptjs';
import { users, User } from '@/lib/users';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials as { email: string; password: string };
        const user = users.find((u) => u.email === email);
        if (!user || !user.hashedPassword) return null;

        const match = await bcrypt.compare(password, user.hashedPassword);
        if (!match) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }: { user: NextAuthUser; account: Account | null }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        const existingUser = users.find((u) => u.email === user.email);
        if (!existingUser) {
          const newUser: User = {
            id: (users.length + 1).toString(),
            name: user.name || user.email?.split('@')[0] || 'User',
            email: user.email!,
            hashedPassword: '', 
          };
          users.push(newUser);
          user.id = newUser.id;
        } else {
          user.id = existingUser.id;
        }
      }
      return true; 
    },

    async jwt({ token, user }: { token: JWT; user?: NextAuthUser }) {
      if (user?.id) token.sub = user.id;
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (token?.sub) {
        session.user = session.user || {};
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

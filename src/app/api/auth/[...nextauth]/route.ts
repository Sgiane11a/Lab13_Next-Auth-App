import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { JWT } from 'next-auth/jwt';
import type { Session, User as NextAuthUser, Account } from 'next-auth';
import { verifyUser, createOrLinkOAuth } from '@/lib/users';

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
        const res = await verifyUser(email, password);
        if (res.ok && res.user) return res.user;
        return null;
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, email }: any) {
      if (account && (account.provider === 'google' || account.provider === 'github')) {
        const provider = account.provider;
        const providerAccountId = account.providerAccountId || account.id || profile?.id;
        const userEmail = (email && (email as any).value) || user?.email || profile?.email;
        if (!userEmail) return false;
        const res = await createOrLinkOAuth({ email: String(userEmail), name: user?.name || profile?.name, provider, providerAccountId: String(providerAccountId) });
        if (res.ok && res.user) {
          (user as any).id = res.user.id;
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

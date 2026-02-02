export const runtime = 'nodejs';

import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Twitter from 'next-auth/providers/twitter';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@lib/prisma';
import { credentialHandler } from './credentialHandler';
import { handleSendEmailVerification } from '@server/handleSendEmailVerification';
import { ThrowCredentialsError } from './authErros';

export const { auth, handlers, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    GitHub({ allowDangerousEmailAccountLinking: true }),
    Google({ allowDangerousEmailAccountLinking: true }),
    Twitter({ allowDangerousEmailAccountLinking: true }),
    Credentials({
      async authorize(credentials, req) {
        let message = '';
        try {
          const result = await credentialHandler(credentials);
          if (!result.ok) {
            throw new ThrowCredentialsError(message);
          } else {
            const ua = req.headers.get('user-agent')?.slice(0, 255) || null;
            return {
              id: result.userId,
              email: result.email,
              accessibility: result?.accessibility || 'user',
              ua,
            };
          }
        } catch (e) {
          throw new ThrowCredentialsError(message);
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 86400 * 3,
    updateAge: 86400,
  },
  pages: {
    signIn: '/signin',
    error: '/signin',
    signOut: '/signout',
  },
  callbacks: {
    async jwt({ user, token, account, trigger }) {
      if (trigger === 'signUp' && user?.email && account?.provider) {
        if (account.provider === 'credentials') {
          handleSendEmailVerification(user.email);
        } else {
          await prisma.user.update({
            where: { email: user.email },
            data: { emailVerified: true },
          });
        }
      }

      if (user && !token.id) {
        token.id = user.id;
        token.accessibility = user?.accessibility || 'user';
        token.ua = user?.ua || null;
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id;
      session.user.accessibility = token?.accessibility || 'user';
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
});

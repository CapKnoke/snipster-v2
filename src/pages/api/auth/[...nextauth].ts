import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@server/prisma';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
      // @ts-ignore
      scope: 'read:user',
    }),
  ],
  callbacks: {
    async session({ session, user: { id, name, image, role, theme } }) {
      session.user = { id, name, image, role, theme };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || ''
});

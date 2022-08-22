import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { publicRuntimeConfig } from '@utils/publicRuntimeConfig';
import { prisma } from './prisma';

export async function createContext(opts?: trpcNext.CreateNextContextOptions) {
  async function getUserFromCookies() {
    const enviroment = publicRuntimeConfig.NODE_ENV;
    const tokenKey =
      enviroment === 'production'
        ? '____Secure-next-auth.session-token'
        : 'next-auth.session-token';
    if (opts?.req.cookies[tokenKey]) {
      const token = opts.req.cookies[tokenKey];
      const session = await prisma.session.findUnique({
        where: { sessionToken: token },
        select: {
          userId: true,
        },
      });
      if (session) return session.userId;
    }
  }
  const userId = await getUserFromCookies();
  return {
    userId,
  };
}
export type Context = trpc.inferAsyncReturnType<typeof createContext>;

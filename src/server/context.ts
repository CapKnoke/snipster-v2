import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';

export async function createContext(opts?: trpcNext.CreateNextContextOptions) {
  // Will be available as `ctx` in all resolvers
  async function getUserFromCookies() {
    if (opts?.req.cookies) {
      return opts?.req.cookies;
    }
    return null;
  }
  const user = await getUserFromCookies();

  return {
    user,
  };
}
export type Context = trpc.inferAsyncReturnType<typeof createContext>;

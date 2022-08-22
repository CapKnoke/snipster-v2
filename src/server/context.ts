import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";

// The app's context - is generated for each incoming request
export async function createContext(opts?: trpcNext.CreateNextContextOptions) {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers

  // This is just an example of something you'd might want to do in your ctx fn
  async function getUserFromCookies() {
    if (opts?.req.cookies) {
      console.dir(opts?.req.cookies)
    }
    return null;
  }
  const user = await getUserFromCookies();

  return {
    user,
  };
}
export type Context = trpc.inferAsyncReturnType<typeof createContext>;
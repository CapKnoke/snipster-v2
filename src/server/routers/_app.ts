import { createRouter } from '../createRouter';
import { snippetRouter } from './snippet';
import { userRouter } from './user';
import { z } from 'zod';
import superjson from 'superjson';

/**
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = createRouter()
  /**
   * @link https://trpc.io/docs/data-transformers
   */
  .transformer(superjson)
  /**
   * @link https://trpc.io/docs/error-formatting
   */
  // .formatError(({ shape, error }) => { })
  .query('hello', {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input, ctx }) {
      return {
        greeting: `hello ${input?.text ?? 'world'}`,
        user: ctx.user,
      };
    },
  })
  .merge('snippet.', snippetRouter)
  .merge('user.', userRouter);

export type AppRouter = typeof appRouter;

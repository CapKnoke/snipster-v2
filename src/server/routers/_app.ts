import { createRouter } from '@server/createRouter';
import { snippetRouter } from './snippet';
import { userRouter } from './user';
import { commentRouter } from './comment';
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
    resolve({ input }) {
      return {
        greeting: `hello ${input?.text ?? 'world'}`,
      };
    },
  })
  .merge('snippet.', snippetRouter)
  .merge('user.', userRouter)
  .merge('comment.', commentRouter);

export type AppRouter = typeof appRouter;

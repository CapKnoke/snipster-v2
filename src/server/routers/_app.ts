/**
 * This file contains the root router of your tRPC-backend
 */
import { createRouter } from '../createRouter';
import { snippetRouter } from './snippet';
import { z } from 'zod';
import superjson from 'superjson';

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = createRouter()
  /**
   * Add data transformers
   * @link https://trpc.io/docs/data-transformers
   */
  .transformer(superjson)
  /**
   * Optionally do custom error (type safe!) formatting
   * @link https://trpc.io/docs/error-formatting
   */
  // .formatError(({ shape, error }) => { })
  .query('hello', {
    // using zod schema to validate and infer input values
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
  /**
   * Merge `snippetRouter` under `snippet.`
   */
  .merge('snippet.', snippetRouter);

export type AppRouter = typeof appRouter;

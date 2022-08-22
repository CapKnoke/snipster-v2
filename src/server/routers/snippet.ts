import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '../createRouter';
import { prisma } from '../prisma';
import { defaultSnippetSelect, previewSnippetSelect } from '@server/utils/selectors';

export const snippetRouter = createRouter()
  .mutation('add', {
    input: z.object({
      title: z.string().min(1).max(32),
      description: z.string().max(140),
      code: z.string().min(1),
      language: z.string(),
      public: z.boolean(),
    }),
    async resolve({ input, ctx }) {
      const snippet = await prisma.snippet.create({
        data: { ...input, author: { connect: { id: ctx.userId } } },
        select: defaultSnippetSelect,
      });
      if (!snippet || snippet.isDeleted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: !ctx.userId ? `Invalid user ID` : 'Bad request',
        });
      }
      return snippet.id;
    },
  })
  .query('all', {
    async resolve() {
      /**
       * pagination:
       * @link https://trpc.io/docs/useInfiniteQuery
       */
      return prisma.snippet.findMany({
        where: {
          AND: [{ isDeleted: false }, { public: true }],
        },
        select: previewSnippetSelect,
      });
    },
  })
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const snippet = await prisma.snippet.findUnique({
        where: { id },
        select: defaultSnippetSelect,
      });
      if (!snippet || snippet.isDeleted) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No snippet with id '${id}'`,
        });
      }
      return snippet;
    },
  })
  .mutation('delete', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      await prisma.snippet.update({
        where: { id },
        data: { isDeleted: true },
      });
      return {
        id,
      };
    },
  });

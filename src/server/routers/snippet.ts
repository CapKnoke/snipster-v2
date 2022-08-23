import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '../createRouter';
import { prisma } from '../prisma';
import { defaultSnippetSelect, favoriteSnippetSelect, previewSnippetSelect, voteSnippetSelect } from '@server/utils/prismaSelectors';

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
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to create a snippet',
        });
      }
      const snippet = await prisma.snippet.create({
        data: {
          ...input,
          author: { connect: { id: ctx.userId } },
          events: {
            create: {
              user: { connect: { id: ctx.userId } },
              actionType: 'CREATE_SNIPPET',
            },
          },
        },
        select: { id: true },
      });
      if (!snippet) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create snippet',
        });
      }
      return snippet.id;
    },
  })
  .mutation('vote', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to upvote a snippet',
        });
      }
      const snippet = await prisma.snippet.update({
        where: { ...input },
        data: {
          votes: {
            create: {
              user: { connect: { id: ctx.userId } },
            },
          },
          events: {
            create: {
              user: { connect: { id: ctx.userId } },
              actionType: 'VOTE_SNIPPET',
            },
          },
        },
        select: voteSnippetSelect,
      });
      if (snippet.votes.some(({userId}) => userId === ctx.userId)) {
        await prisma.snippet.update({
          where: { ...input },
          data: {
            votes: {
              deleteMany: [{ userId: ctx.userId }],
            },
            events: {
              deleteMany: [{
                AND: [{ userId: ctx.userId }, { actionType: 'VOTE_SNIPPET' }]
              }],
            },
          },
          select: voteSnippetSelect,
        });
      }
      return snippet;
    },
  })
  .mutation('favorite', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to favorite a snippet',
        });
      }
      const snippet = await prisma.snippet.update({
        where: { ...input },
        data: {
          favorites: {
            create: {
              user: { connect: { id: ctx.userId } },
            },
          },
          events: {
            create: {
              user: { connect: { id: ctx.userId } },
              actionType: 'FAVORITE_SNIPPET',
            },
          },
        },
        select: favoriteSnippetSelect,
      });
      if (snippet.favorites.some(({userId}) => userId === ctx.userId)) {
        await prisma.snippet.update({
          where: { ...input },
          data: {
            favorites: {
              deleteMany: [{ userId: ctx.userId }],
            },
            events: {
              deleteMany: [{
                AND: [{ userId: ctx.userId }, { actionType: 'FAVORITE_SNIPPET' }]
              }],
            },
          },
          select: favoriteSnippetSelect,
        });
      }
      return snippet;
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
    async resolve({ input, ctx }) {
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
    async resolve({ input, ctx }) {
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

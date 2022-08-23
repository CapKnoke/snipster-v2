import { TRPCError } from '@trpc/server';
import { createRouter } from '../createRouter';
import { prisma } from '../prisma';
import {
  defaultSnippetSelect,
  favoriteSnippetSelect,
  idSnippetSelect,
  previewSnippetSelect,
  voteSnippetSelect,
} from '@server/utils/prismaSelectors';
import {
  getCreateSnippetData,
  getFavoriteSnippetData,
  getUnfavoriteSnippetData,
  getUnvoteSnippetData,
  getVoteSnippetData,
} from '@server/utils/snippetHelpers';
import { createSnippetInput, idInput } from '@server/utils/inputSchemas';

export const snippetRouter = createRouter()
  .mutation('add', {
    input: createSnippetInput,
    async resolve({ input, ctx }) {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to create a snippet',
        });
      }
      const snippet = await prisma.snippet.create({
        data: getCreateSnippetData(input, ctx),
        select: idSnippetSelect,
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
    input: idInput,
    async resolve({ input, ctx }) {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to upvote a snippet',
        });
      }
      const snippet = await prisma.snippet.update({
        where: { ...input },
        data: getVoteSnippetData(ctx),
        select: voteSnippetSelect,
      });
      if (snippet.votes.some(({ userId }) => userId === ctx.userId)) {
        await prisma.snippet.update({
          where: { ...input },
          data: getUnvoteSnippetData(ctx),
          select: voteSnippetSelect,
        });
      }
      return snippet;
    },
  })
  .mutation('favorite', {
    input: idInput,
    async resolve({ input, ctx }) {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to favorite a snippet',
        });
      }
      const snippet = await prisma.snippet.update({
        where: { ...input },
        data: getFavoriteSnippetData(ctx),
        select: favoriteSnippetSelect,
      });
      if (snippet.favorites.some(({ userId }) => userId === ctx.userId)) {
        const unfavoritedSnippet = await prisma.snippet.update({
          where: { ...input },
          data: getUnfavoriteSnippetData(ctx),
          select: favoriteSnippetSelect,
        });
        return unfavoritedSnippet;
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
    input: idInput,
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
    input: idInput,
    async resolve({ input, ctx }) {
      const { id } = input;
      const deleted = await prisma.snippet.updateMany({
        where: { AND: [{ id }, { authorId: ctx.userId }] },
        data: { isDeleted: true },
      });
      if (deleted.count === 0) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `You don't have permission to delete snippet with id '${id}'`,
        });
      }
      return { id };
    },
  });

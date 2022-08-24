import { TRPCError } from '@trpc/server';
import { createRouter } from '@server/createRouter';
import { prisma } from '@server/prisma';
import {
  commentSnippetSelect,
  defaultSnippetSelect,
  eventSnippetSelect,
  favoriteSnippetSelect,
  idSnippetSelect,
  previewSnippetSelect,
  voteSnippetSelect,
} from '@server/utils/selectors';
import {
  getCreateSnippetData,
  getFavoriteSnippetData,
  getUnfavoriteSnippetData,
  getUnvoteSnippetData,
  getVoteSnippetData,
} from '@server/utils/helpers';
import { createSnippetInput, idInput } from '@server/utils/schemas';

export const snippetRouter = createRouter()
  // QUERIES
  .query('all', {
    async resolve() {
      /**
       * pagination:
       * @link https://trpc.io/docs/useInfiniteQuery
       */
      return prisma.snippet.findMany({
        where: { AND: [{ deleted: false }, { public: true }] },
        select: previewSnippetSelect,
      });
    },
  })
  .query('byId', {
    input: idInput,
    async resolve({ input, ctx }) {
      const snippetById = await prisma.snippet.findUnique({
        where: { ...input },
        select: defaultSnippetSelect,
      });
      if (
        !snippetById ||
        snippetById.deleted ||
        (snippetById.author.id !== ctx.userId && snippetById.public === false)
      ) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No snippet with id '${input.id}'`,
        });
      }
      return { snippet: snippetById };
    },
  })
  .query('eventsById', {
    input: idInput,
    async resolve({ input, ctx }) {
      const snippetWithEvents = await prisma.snippet.findUnique({
        where: { ...input },
        select: eventSnippetSelect,
      });
      if (
        !snippetWithEvents ||
        snippetWithEvents.deleted ||
        (snippetWithEvents.authorId !== ctx.userId && snippetWithEvents.public === false)
      ) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No snippet with id '${input.id}'`,
        });
      }
      return { events: snippetWithEvents.events };
    },
  })
  .query('commentsById', {
    input: idInput,
    async resolve({ input, ctx }) {
      const snippetWithComments = await prisma.snippet.findUnique({
        where: { ...input },
        select: commentSnippetSelect,
      });
      if (
        !snippetWithComments ||
        snippetWithComments.deleted ||
        (snippetWithComments.authorId !== ctx.userId && snippetWithComments.public === false)
      ) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No snippet with id '${input.id}'`,
        });
      }
      return { comments: snippetWithComments.comments };
    },
  })
  // MUTATIONS
  .mutation('add', {
    input: createSnippetInput,
    async resolve({ input, ctx }) {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to create a snippet',
        });
      }
      const createdSnippet = await prisma.snippet.create({
        data: getCreateSnippetData(input, ctx),
        select: idSnippetSelect,
      });
      if (!createdSnippet) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create snippet',
        });
      }
      return { id: createdSnippet.id };
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
      const votedSnippet = await prisma.snippet.update({
        where: { ...input },
        data: getVoteSnippetData(ctx),
        select: voteSnippetSelect,
      });
      if (votedSnippet.votes.some(({ userId }) => userId === ctx.userId)) {
        const unvotedSnippet = await prisma.snippet.update({
          where: { ...input },
          data: getUnvoteSnippetData(ctx),
          select: voteSnippetSelect,
        });
        return { snippet: unvotedSnippet };
      }
      return { snippet: votedSnippet };
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
      const favoritedSnippet = await prisma.snippet.update({
        where: { ...input },
        data: getFavoriteSnippetData(ctx),
        select: favoriteSnippetSelect,
      });
      if (favoritedSnippet.favorites.some(({ userId }) => userId === ctx.userId)) {
        const unfavoritedSnippet = await prisma.snippet.update({
          where: { ...input },
          data: getUnfavoriteSnippetData(ctx),
          select: favoriteSnippetSelect,
        });
        return { snippet: unfavoritedSnippet };
      }
      return { snippet: favoritedSnippet };
    },
  })
  .mutation('delete', {
    input: idInput,
    async resolve({ input, ctx }) {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to delete a snippet',
        });
      }
      const deleted = await prisma.snippet.deleteMany({
        where: { AND: [{ id: input.id }, { authorId: ctx.userId }] },
      });
      if (deleted.count === 0) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `You don't have permission to delete snippet with id '${input.id}'`,
        });
      }
      return { id: input.id };
    },
  });

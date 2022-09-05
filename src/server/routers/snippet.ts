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
  getCreatePrivateSnippetData,
  getFavoriteSnippetData,
  getUnfavoriteSnippetData,
  getUnvoteSnippetData,
  getVoteSnippetData,
  getSnippetById,
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
        where: { deleted: false, public: true },
        select: previewSnippetSelect,
      });
    },
  })
  .query('byId', {
    input: idInput,
    async resolve({ input, ctx }) {
      const snippetById = await prisma.snippet
        .findFirstOrThrow({
          where: getSnippetById(input, ctx),
          select: defaultSnippetSelect,
        })
        .catch(() => {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Snippet with id '${input.id}' is private, not generating static page`,
            cause: 'Snippet is private',
          });
        });

      return snippetById;
    },
  })




  .query('eventsById', {
    input: idInput,
    async resolve({ input }) {
      const snippetWithEvents = await prisma.snippet
        .findFirstOrThrow({
          where: { ...input, deleted: false, public: true },
          select: eventSnippetSelect,
        })
        .catch(() => {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `No snippet with id '${input.id}'`,
          });
        });

      return snippetWithEvents.events;
    },
  })
  .query('commentsById', {
    input: idInput,
    async resolve({ input }) {
      const snippetWithComments = await prisma.snippet
        .findFirstOrThrow({
          where: { ...input, deleted: false, public: true },
          select: commentSnippetSelect,
        })
        .catch(() => {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `No snippet with id '${input.id}'`,
          });
        });

      return snippetWithComments.comments;
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
        data: input.data.public
          ? getCreateSnippetData(input, ctx)
          : getCreatePrivateSnippetData(input, ctx),
        select: idSnippetSelect,
      });
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
      const targetSnippet = await prisma.snippet
        .findFirstOrThrow({
          where: { ...input, NOT: { authorId: ctx.userId } },
          select: voteSnippetSelect,
        })
        .catch(() => {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "You can't vote on your own snippet",
          });
        });
      const hasVoted = targetSnippet.votes.some(({ userId }) => userId === ctx.userId);
      const votedSnippet = await prisma.snippet.update({
        where: { ...input },
        data: hasVoted ? getUnvoteSnippetData(ctx) : getVoteSnippetData(ctx),
        select: voteSnippetSelect,
      });
      ctx.res?.revalidate(`/snippets/${input.id}`);
      return votedSnippet;
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
      const targetSnippet = await prisma.snippet
        .findFirstOrThrow({
          where: { ...input, NOT: { authorId: ctx.userId } },
          select: favoriteSnippetSelect,
        })
        .catch(() => {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "You can't favorite your own snippet",
          });
        });
      const hasFavorited = targetSnippet.favorites.some(({ userId }) => userId === ctx.userId);
      const favoritedSnippet = await prisma.snippet.update({
        where: { ...input },
        data: hasFavorited ? getUnfavoriteSnippetData(ctx) : getFavoriteSnippetData(ctx),
        select: favoriteSnippetSelect,
      });
      ctx.res?.revalidate(`/snippets/${input.id}`);
      return favoritedSnippet;
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
      const deletedSnippet = await prisma.snippet.deleteMany({
        where: { id: input.id, authorId: ctx.userId },
      });
      if (deletedSnippet.count === 0) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `You don't have permission to delete snippet with id '${input.id}'`,
        });
      }
      const deleteActions = prisma.action.deleteMany({
        where: { targetSnippetId: input.id },
      });
      const deleteComments = prisma.comment.deleteMany({
        where: { snippetId: input.id },
      });
      await Promise.all([deleteActions, deleteComments]).catch(({ reason }) => {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: reason,
        });
      });
      ctx.res?.revalidate(`/snippets/${input.id}`);
      return { id: input.id };
    },
  });

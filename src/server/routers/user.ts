import { TRPCError } from '@trpc/server';
import { createRouter } from '@server/createRouter';
import { prisma } from '@server/prisma';
import {
  previewUserSelect,
  defaultUserSelect,
  followUserSelect,
  snippetsUserSelect,
  snippetsOwnUserSelect,
  activityUserSelect,
  eventsUserSelect,
  feedUserSelect,
} from '@server/utils/selectors';
import { editUserInput, idInput } from '@server/utils/schemas';
import { getFollowUserData, getUnfollowUserData } from '@server/utils/helpers';

export const userRouter = createRouter()
  // QUERIES
  .query('all', {
    async resolve() {
      const users = prisma.user.findMany({
        select: previewUserSelect,
      });
      return { users }
    },
  })
  .query('byId', {
    input: idInput,
    async resolve({ input }) {
      const userById = await prisma.user.findUnique({
        where: { ...input },
        select: defaultUserSelect,
      });
      if (!userById) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No user with id '${input.id}'`,
        });
      }
      return { user: userById };
    },
  })
  .query('snippetsById', {
    input: idInput,
    async resolve({ input, ctx }) {
      const isOwnUser = ctx.userId === input.id;
      const userWithSnippets = await prisma.user.findUnique({
        where: { ...input },
        select: isOwnUser ? snippetsOwnUserSelect : snippetsUserSelect,
      });
      if (!userWithSnippets) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No user with id '${input.id}'`,
        });
      }
      return { snippets: userWithSnippets.snippets };
    },
  })
  .query('eventsById', {
    input: idInput,
    async resolve({ input }) {
      const userWithEvents = await prisma.user.findUnique({
        where: { ...input },
        select: eventsUserSelect,
      });
      if (!userWithEvents) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No user with id '${input.id}'`,
        });
      }
      return { events: userWithEvents.events };
    },
  })
  .query('activityById', {
    input: idInput,
    async resolve({ input }) {
      const userWithActivity = await prisma.user.findUnique({
        where: { ...input },
        select: activityUserSelect,
      });
      if (!userWithActivity) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No user with id '${input.id}'`,
        });
      }
      return { actions: userWithActivity.actions };
    },
  })
  .query('feedById', {
    input: idInput,
    async resolve({ input }) {
      const userWithFeed = await prisma.user.findUnique({
        where: { ...input },
        select: feedUserSelect,
      });
      if (!userWithFeed) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No user with id '${input.id}'`,
        });
      }
      return {
        feed: userWithFeed.following
          .flatMap(({ actions }) => actions)
          .sort((a, b) => a.createdAt.getDate() - b.createdAt.getDate())
      };
    },
  })
  // MUTATIONS
  .mutation('edit', {
    input: editUserInput,
    async resolve({ input }) {
      const updatedUser = await prisma.user.update({
        where: { id: input.id },
        data: { ...input.data },
        select: defaultUserSelect,
      });
      return { user: updatedUser };
    },
  })
  .mutation('follow', {
    input: idInput,
    async resolve({ input, ctx }) {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to follow a user',
        });
      }
      const followedUser = await prisma.user.update({
        where: { ...input },
        data: getFollowUserData(ctx),
        select: followUserSelect,
      });
      if (followedUser.followers.some(({ id }) => id === ctx.userId)) {
        const unfollowedUser = await prisma.user.update({
          where: { ...input },
          data: getUnfollowUserData(ctx),
          select: followUserSelect,
        });
        return { user: unfollowedUser };
      }
      return { user: followedUser };
    },
  });

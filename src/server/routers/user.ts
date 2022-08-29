import { TRPCError } from '@trpc/server';
import { createRouter } from '@server/createRouter';
import { prisma } from '@server/prisma';
import {
  previewUserSelect,
  defaultUserSelect,
  followUserSelect,
  snippetsUserSelect,
  snippetsOwnUserSelect,
  defaultActionSelect,
  followingIdsUserSelect,
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
      return users;
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
      return userById;
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
      return userWithSnippets.snippets;
    },
  })
  .query('eventsById', {
    input: idInput,
    async resolve({ input }) {
      const userEvents = await prisma.action.findMany({
        where: { targetUserId: input.id },
        select: defaultActionSelect,
        orderBy: { createdAt: 'desc' },
      });
      return userEvents;
    },
  })
  .query('activityById', {
    input: idInput,
    async resolve({ input }) {
      const userActions = await prisma.action.findMany({
        where: { userId: input.id },
        select: defaultActionSelect,
        orderBy: { createdAt: 'desc' },
      });
      return userActions;
    },
  })
  .query('feedById', {
    input: idInput,
    async resolve({ input }) {
      const userWithFollowingIds = await prisma.user.findUnique({
        where: { ...input },
        select: followingIdsUserSelect,
      });
      if (!userWithFollowingIds) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No user with id '${input.id}'`,
        });
      }
      const followingIds = userWithFollowingIds.followers.map(({ id }) => id);
      const userFeed = await prisma.action.findMany({
        where: { userId: { in: followingIds } },
        select: defaultActionSelect,
        orderBy: { createdAt: 'desc' },
      });
      return userFeed;
    },
  })
  // MUTATIONS
  .mutation('edit', {
    input: editUserInput,
    async resolve({ input, ctx }) {
      if (!ctx.userId || ctx.userId !== input.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You do not have permissions to update this user',
        });
      }
      const updatedUser = await prisma.user.update({
        where: { id: input.id },
        data: { ...input.data },
        select: defaultUserSelect,
      });
      return updatedUser;
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
      const targetUser = await prisma.user
        .findFirstOrThrow({
          where: { ...input, NOT: { id: ctx.userId } },
          select: followUserSelect,
        })
        .catch(() => {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "You can't follow yourself",
          });
        });
      const isFollowing = targetUser.followers
        .some(({ id }) => id === ctx.userId);
      const updatedUser = await prisma.user.update({
        where: { ...input },
        data: isFollowing
          ? getUnfollowUserData(ctx)
          : getFollowUserData(ctx),
        select: followUserSelect,
      });
      return updatedUser;
    },
  });

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
} from '@server/utils/userSelectors';
import { editUserInput, idInput } from '@server/utils/schemas';
import { getFollowUserData, getUnfollowUserData } from '@server/utils/userHelpers';

export const userRouter = createRouter()
  // QUERIES
  .query('all', {
    async resolve() {
      return prisma.user.findMany({
        select: previewUserSelect,
      });
    },
  })
  .query('byId', {
    input: idInput,
    async resolve({ input }) {
      const { id } = input;
      const user = await prisma.user.findUnique({
        where: { id },
        select: defaultUserSelect,
      });
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No user with id '${id}'`,
        });
      }
      return user;
    },
  })
  .query('snippetsById', {
    input: idInput,
    async resolve({ input, ctx }) {
      const { id } = input;
      const isOwnUser = ctx.userId === id;
      const user = await prisma.user.findUnique({
        where: { id },
        select: isOwnUser ? snippetsOwnUserSelect : snippetsUserSelect,
      });
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No user with id '${id}'`,
        });
      }
      return user.snippets;
    },
  })
  .query('eventsById', {
    input: idInput,
    async resolve({ input }) {
      const { id } = input;
      const user = await prisma.user.findUnique({
        where: { id },
        select: eventsUserSelect,
      });
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No user with id '${id}'`,
        });
      }
      return user.events;
    },
  })
  .query('activityById', {
    input: idInput,
    async resolve({ input }) {
      const { id } = input;
      const user = await prisma.user.findUnique({
        where: { id },
        select: activityUserSelect,
      });
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No user with id '${id}'`,
        });
      }
      return user.actions;
    },
  })
  .query('feedById', {
    input: idInput,
    async resolve({ input }) {
      const { id } = input;
      const user = await prisma.user.findUnique({
        where: { id },
        select: feedUserSelect,
      });
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No user with id '${id}'`,
        });
      }
      return user.following
        .flatMap(({actions}) => actions)
        .sort((a, b) => a.createdAt.getDate() - b.createdAt.getDate())
    },
  })
  // MUTATIONS
  .mutation('edit', {
    input: editUserInput,
    async resolve({ input }) {
      const { id, data } = input;
      const user = await prisma.user.update({
        where: { id },
        data,
        select: defaultUserSelect,
      });
      return user;
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
      const user = await prisma.user.update({
        where: { ...input },
        data: getFollowUserData(ctx),
        select: followUserSelect,
      });
      if (user.followers.some(({ id }) => id === ctx.userId)) {
        const unfollowedUser = await prisma.user.update({
          where: { ...input },
          data: getUnfollowUserData(ctx),
          select: followUserSelect,
        });
        return unfollowedUser;
      }
      return user;
    },
  });

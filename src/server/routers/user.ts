import { TRPCError } from '@trpc/server';
import { createRouter } from '../createRouter';
import { prisma } from '../prisma';
import {
  previewUserSelect,
  defaultUserSelect,
  followUserSelect,
} from '@server/utils/selectors';
import { editUserInput, idInput } from '@server/utils/schemas';
import { getFollowUserData, getUnfollowUserData } from '@server/utils/userHelpers';

export const userRouter = createRouter()
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

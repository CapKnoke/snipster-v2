import { Prisma } from '@prisma/client';
import { Context } from '@server/context';

export const getFollowUserData = (ctx: Context) => (
  Prisma.validator<Prisma.UserUpdateInput>()({
    followers: {
      connect: { id: ctx.userId },
    },
    events: {
      create: {
        user: { connect: { id: ctx.userId } },
        actionType: 'FOLLOW_USER',
      },
    },
  })
);

export const getUnfollowUserData = (ctx: Context) => (
  Prisma.validator<Prisma.UserUpdateInput>()({
    followers: {
      deleteMany: [{ id: ctx.userId }],
    },
    events: {
      deleteMany: [
        {
          AND: [{ userId: ctx.userId }, { actionType: 'FOLLOW_USER' }],
        },
      ],
    },
  })
);

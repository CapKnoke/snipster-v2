import { Prisma } from '@prisma/client';
import { Context } from '@server/context';
import { CreateSnippetInput } from './schemas';

export const getCreateSnippetData = (input: CreateSnippetInput, ctx: Context) => (
  Prisma.validator<Prisma.SnippetCreateInput>()({
    ...input,
    author: { connect: { id: ctx.userId } },
    events: {
      create: {
        user: { connect: { id: ctx.userId } },
        actionType: 'CREATE_SNIPPET',
      },
    },
  })
);

export const getFavoriteSnippetData = (ctx: Context) => (
  Prisma.validator<Prisma.SnippetUpdateInput>()({
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
  })
);

export const getUnfavoriteSnippetData = (ctx: Context) => (
  Prisma.validator<Prisma.SnippetUpdateInput>()({
    favorites: {
      deleteMany: [{ userId: ctx.userId }],
    },
    events: {
      deleteMany: [
        {
          AND: [{ userId: ctx.userId }, { actionType: 'FAVORITE_SNIPPET' }],
        },
      ],
    },
  })
);

export const getVoteSnippetData = (ctx: Context) => (
  Prisma.validator<Prisma.SnippetUpdateInput>()({
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
  })
);

export const getUnvoteSnippetData = (ctx: Context) => (
  Prisma.validator<Prisma.SnippetUpdateInput>()({
    votes: {
      deleteMany: [{ userId: ctx.userId }],
    },
    events: {
      deleteMany: [
        {
          AND: [{ userId: ctx.userId }, { actionType: 'VOTE_SNIPPET' }],
        },
      ],
    },
  })
);

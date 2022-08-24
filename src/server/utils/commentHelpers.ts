import { Prisma } from '@prisma/client';
import { Context } from '@server/context';
import { CreateCommentInput, ReplyCommentInput } from './schemas';

export const getCreateCommentData = (input: CreateCommentInput, ctx: Context) => (
  Prisma.validator<Prisma.CommentCreateInput>()({
    text: input.text,
    author: { connect: { id: ctx.userId } },
    snippet: { connect: { id: input.snippetId } },
    events: {
      create: {
        user: { connect: { id: ctx.userId } },
        targetSnippet: { connect: { id: input.snippetId } },
        actionType: 'COMMENT_SNIPPET',
      },
    },
  })
);

export const getReplyCommentData = (input: ReplyCommentInput, ctx: Context) => (
  Prisma.validator<Prisma.CommentUpdateInput>()({
    replies: {
      create: {
        author: { connect: { id: ctx.userId } },
        text: input.text,
      },
    },
    events: {
      create: {
        user: { connect: { id: ctx.userId } },
        actionType: 'REPLY_COMMENT',
      },
    },
  })
);

export const getLikeCommentData = (ctx: Context) => (
  Prisma.validator<Prisma.CommentUpdateInput>()({
    likes: {
      create: {
        user: { connect: { id: ctx.userId } },
      },
    },
    events: {
      create: {
        user: { connect: { id: ctx.userId } },
        actionType: 'LIKE_COMMENT',
      },
    },
  })
);

export const getUnlikeCommentData = (ctx: Context) => (
  Prisma.validator<Prisma.CommentUpdateInput>()({
    likes: {
      deleteMany: [{ userId: ctx.userId }],
    },
    events: {
      deleteMany: [
        {
          AND: [{ userId: ctx.userId }, { actionType: 'LIKE_COMMENT' }],
        },
      ],
    },
  })
);

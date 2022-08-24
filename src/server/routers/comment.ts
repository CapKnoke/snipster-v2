import { TRPCError } from '@trpc/server';
import { createRouter } from '../createRouter';
import { prisma } from '../prisma';
import { voteSnippetSelect } from '@server/utils/snippetSelectors';
import { createCommentInput, idInput, replyCommentInput } from '@server/utils/schemas';
import {
  getCreateCommentData,
  getLikeCommentData,
  getReplyCommentData,
  getUnlikeCommentData,
} from '@server/utils/commentHelpers';
import { likeCommentSelect, replyCommentSelect } from '@server/utils/commentSelectors';

export const snippetRouter = createRouter()
  .mutation('add', {
    input: createCommentInput,
    async resolve({ input, ctx }) {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to comment on a snippet',
        });
      }
      const comment = await prisma.comment.create({
        data: getCreateCommentData(input, ctx),
        select: { id: true },
      });
      if (!comment) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create comment',
        });
      }
      return comment.id;
    },
  })
  .mutation('reply', {
    input: replyCommentInput,
    async resolve({ input, ctx }) {
      const { id } = input;
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to reply to comment',
        });
      }
      const reply = await prisma.comment.update({
        where: { id },
        data: getReplyCommentData(input, ctx),
        select: replyCommentSelect,
      });
      if (!reply) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create reply',
        });
      }
      return reply;
    },
  })
  .mutation('like', {
    input: idInput,
    async resolve({ input, ctx }) {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to upvote a snippet',
        });
      }
      const comment = await prisma.comment.update({
        where: { ...input },
        data: getLikeCommentData(ctx),
        select: likeCommentSelect,
      });
      if (comment.likes.some(({ userId }) => userId === ctx.userId)) {
        await prisma.snippet.update({
          where: { ...input },
          data: getUnlikeCommentData(ctx),
          select: voteSnippetSelect,
        });
      }
      return comment;
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
      const { id } = input;
    },
  });

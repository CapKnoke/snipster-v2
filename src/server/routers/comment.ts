import { TRPCError } from '@trpc/server';
import { createRouter } from '@server/createRouter';
import { prisma } from '@server/prisma';
import { createCommentInput, idInput, replyCommentInput } from '@server/utils/schemas';
import {
  getCreateCommentData,
  getLikeCommentData,
  getReplyCommentData,
  getUnlikeCommentData,
} from '@server/utils/helpers';
import { likeCommentSelect, replyCommentSelect } from '@server/utils/selectors';

export const commentRouter = createRouter()
  .mutation('add', {
    input: createCommentInput,
    async resolve({ input, ctx }) {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to comment on a snippet',
        });
      }
      const createdComment = await prisma.comment.create({
        data: getCreateCommentData(input, ctx),
        select: { id: true },
      });
      if (!createdComment) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create comment',
        });
      }
      return { id: createdComment.id };
    },
  })
  .mutation('reply', {
    input: replyCommentInput,
    async resolve({ input, ctx }) {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to reply to comment',
        });
      }
      const reply = await prisma.comment.update({
        where: { id: input.id },
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
          message: 'You must be logged in to like a comment',
        });
      }
      const likedComment = await prisma.comment.update({
        where: { ...input },
        data: getLikeCommentData(ctx),
        select: likeCommentSelect,
      });
      if (likedComment.likes.some(({ userId }) => userId === ctx.userId)) {
        const unlikedComment = await prisma.comment.update({
          where: { ...input },
          data: getUnlikeCommentData(ctx),
          select: likeCommentSelect,
        });
        return unlikedComment;
      }
      return likedComment;
    },
  })
  .mutation('delete', {
    input: idInput,
    async resolve({ input, ctx }) {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to delete a comment',
        });
      }
      const deleted = await prisma.comment.deleteMany({
        where: { AND: [{ ...input }, { authorId: ctx.userId }] },
      });
      if (deleted.count === 0) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `You don't have permission to delete comment with id '${input.id}'`,
        });
      }
      await prisma.action.deleteMany({
        where: { targetCommentId: input.id }
      })
      return { id: input.id };
    },
  });

import { TRPCError } from '@trpc/server';
import { createRouter } from '@server/createRouter';
import { prisma } from '@server/prisma';
import { createCommentInput, replyCommentInput, snippetIdInput } from '@server/utils/schemas';
import {
  getCreateCommentData,
  getLikeCommentData,
  getReplyCommentData,
  getUnlikeCommentData,
  revalidatePage,
} from '@server/utils/helpers';
import { likeCommentSelect } from '@server/utils/selectors';

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
      revalidatePage(`snippets/${input.snippetId}`);
      return createdComment;
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
      const reply = await prisma.comment.create({
        data: getReplyCommentData(input, ctx),
        select: { id: true },
      });
      revalidatePage(`snippets/${input.snippetId}`);
      return reply;
    },
  })
  .mutation('like', {
    input: snippetIdInput,
    async resolve({ input, ctx }) {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to like a comment',
        });
      }
      const targetComment = await prisma.comment
        .findFirstOrThrow({
          where: { ...input, NOT: { authorId: ctx.userId } },
          select: likeCommentSelect,
        })
        .catch(() => {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "You can't vote on your own snippet",
          });
        });
      const hasLiked = targetComment.likes.some(({ userId }) => userId === ctx.userId);
      const likedComment = await prisma.comment.update({
        where: { ...input },
        data: hasLiked ? getUnlikeCommentData(ctx) : getLikeCommentData(ctx),
        select: likeCommentSelect,
      });
      revalidatePage(`snippets/${input.snippetId}`);
      return likedComment;
    },
  })
  .mutation('delete', {
    input: snippetIdInput,
    async resolve({ input, ctx }) {
      if (!ctx.userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to delete a comment',
        });
      }
      const deletedComment = await prisma.comment.deleteMany({
        where: {
          OR: [
            { ...input, authorId: ctx.userId },
            { replyToId: input.id, authorId: ctx.userId },
          ],
        },
      });
      if (deletedComment.count === 0) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `You don't have permission to delete comment with id '${input.id}'`,
        });
      }
      const deleteLikes = prisma.like.deleteMany({
        where: { commentId: input.id },
      });
      const deleteActions = prisma.action.deleteMany({
        where: { targetCommentId: input.id },
      });
      await Promise.all([deleteLikes, deleteActions]).catch(({ reason }) => {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: reason,
        });
      });
      revalidatePage(`snippets/${input.snippetId}`);
      return { id: input.id };
    },
  });

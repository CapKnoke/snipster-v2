import { Prisma } from '@prisma/client';
import { previewUserSelect } from './userSelectors';

export const previewCommentSelect = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  text: true,
  author: { select: previewUserSelect },
  _count: {
    select: {
      likes: true,
      replies: true,
    },
  },
  createdAt: true,
});

export const defaultCommentSelect = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  text: true,
  author: { select: previewUserSelect },
  replies: { select: previewCommentSelect },
  _count: {
    select: {
      likes: true,
      replies: true,
    },
  },
  createdAt: true,
});

export const likeCommentSelect = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  likes: {
    select: {
      userId: true,
    },
  },
  _count: {
    select: {
      likes: true,
    },
  },
});

export const replyCommentSelect = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  _count: {
    select: {
      replies: true,
    },
  },
});

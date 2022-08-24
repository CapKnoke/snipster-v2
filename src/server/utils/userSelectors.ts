import { Prisma } from '@prisma/client';
import { previewCommentSelect } from './commentSelectors';
import { previewSnippetSelect } from './snippetSelectors';

export const previewUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  image: true,
  role: true,
  _count: {
    select: {
      followers: true,
    },
  },
});

export const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  image: true,
  bio: true,
  role: true,
  snippets: {
    select: previewSnippetSelect,
  },
  followers: {
    select: previewUserSelect,
  },
  following: {
    select: previewUserSelect,
  },
  _count: {
    select: {
      followers: true,
    },
  },
  createdAt: true,
});

export const followUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  followers: {
    select: {
      id: true,
    },
  },
  _count: {
    select: {
      followers: true,
    },
  },
});

export const snippetsUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  snippets: {
    where: { deleted: false, public: true },
    select: previewSnippetSelect,
  },
});

export const snippetsOwnUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  snippets: {
    where: { deleted: false },
    select: previewSnippetSelect,
  },
});

export const eventsUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  events: {
    select: {
      user: { select: previewUserSelect },
      targetComment: { select: previewCommentSelect },
      targetSnippet: { select: previewSnippetSelect },
      createdAt: true,
    },
  },
});

export const activityUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  actions: {
    select: {
      targetUser: { select: previewUserSelect },
      targetComment: { select: previewCommentSelect },
      targetSnippet: { select: previewSnippetSelect },
      createdAt: true,
    },
  },
});

export const feedUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  following: {
    select: {
      actions: {
        select: {
          user: { select: previewUserSelect },
          targetUser: { select: previewUserSelect },
          targetComment: { select: previewCommentSelect },
          targetSnippet: { select: previewSnippetSelect },
          createdAt: true,
        },
      },
    },
  },
});

import { Prisma } from '@prisma/client';
import { previewUserSelect } from './userSelectors';

export const previewSnippetSelect = Prisma.validator<Prisma.SnippetSelect>()({
  id: true,
  title: true,
  code: true,
  language: true,
  _count: {
    select: {
      votes: true,
      favorites: true,
      refactors: true,
      comments: true,
    },
  },
  createdAt: true,
});

export const defaultSnippetSelect = Prisma.validator<Prisma.SnippetSelect>()({
  id: true,
  title: true,
  code: true,
  language: true,
  description: true,
  author: {
    select: {
      id: true,
      name: true,
      image: true,
      _count: {
        select: {
          followers: true,
        },
      },
    },
  },
  _count: {
    select: {
      votes: true,
      favorites: true,
      refactors: true,
      comments: true,
    },
  },
  createdAt: true,
  deleted: true,
  public: true,
});

export const idSnippetSelect = Prisma.validator<Prisma.SnippetSelect>()({
  id: true,
});

export const voteSnippetSelect = Prisma.validator<Prisma.SnippetSelect>()({
  id: true,
  votes: {
    select: {
      userId: true,
    },
  },
  _count: {
    select: {
      votes: true,
    },
  },
});

export const favoriteSnippetSelect = Prisma.validator<Prisma.SnippetSelect>()({
  id: true,
  favorites: {
    select: {
      userId: true,
    },
  },
  _count: {
    select: {
      favorites: true,
    },
  },
});

export const eventSnippetSelect = Prisma.validator<Prisma.SnippetSelect>()({
  id: true,
  authorId: true,
  events: {
    select: {
      user: { select: previewUserSelect },
      createdAt: true,
    },
  },
  public: true,
  deleted: true,
});

export const commentSnippetSelect = Prisma.validator<Prisma.SnippetSelect>()({
  id: true,
  authorId: true,
  comments: {
    where: { deleted: false },
    select: {
      author: { select: previewUserSelect },
      createdAt: true,
    },
  },
  public: true,
  deleted: true,
});

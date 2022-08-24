import { Prisma } from '@prisma/client';

// PREVIEW SELECTORS
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

export const previewCommentSelect = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  text: true,
  author: { select: previewUserSelect },
  _count: {
    select: {
      likes: true,
      replies: true
    },
  },
  createdAt: true,
});

// DEFAULT SELECTORS
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

export const defaultSnippetSelect = Prisma.validator<Prisma.SnippetSelect>()({
  id: true,
  title: true,
  code: true,
  language: true,
  description: true,
  author: {
    select: defaultUserSelect
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

// USER SELECTORS
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

// SNIPPET SELECTORS
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

// COMMENT SELECTORS
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


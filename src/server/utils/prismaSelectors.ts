import { Prisma } from '@prisma/client';

export const idSnippetSelect = Prisma.validator<Prisma.SnippetSelect>()({
  id: true,
})

export const voteSnippetSelect = Prisma.validator<Prisma.SnippetSelect>()({
  id: true,
  votes: {
    select: {
      userId: true
    }
  },
  _count: {
    select: {
      votes: true,
    }
  }
});

export const favoriteSnippetSelect = Prisma.validator<Prisma.SnippetSelect>()({
  id: true,
  favorites: {
    select: {
      userId: true
    }
  },
  _count: {
    select: {
      favorites: true,
    }
  }
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
    },
  },
  createdAt: true,
  isDeleted: true,
  public: true,
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
    },
  },
  createdAt: true,
  isDeleted: true,
  public: true,
});

export const followUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  followers: {
    select: {
      id: true
    }
  },
  _count: {
    select: {
      followers: true,
    }
  }
});

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
});

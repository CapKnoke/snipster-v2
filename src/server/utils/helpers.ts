import { Prisma } from '@prisma/client';
import { Context } from '@server/context';
import { CreateSnippetInput, CreateCommentInput, ReplyCommentInput, IdInput } from './schemas';
// USER HELPERS
export const getFollowUserData = (ctx: Context) =>
  Prisma.validator<Prisma.UserUpdateInput>()({
    followers: {
      connect: { id: ctx.userId },
    },
    events: {
      create: {
        user: { connect: { id: ctx.userId } },
        actionType: 'FOLLOW_USER',
      },
    },
  });

export const getUnfollowUserData = (ctx: Context) =>
  Prisma.validator<Prisma.UserUpdateInput>()({
    followers: {
      deleteMany: [{ id: ctx.userId }],
    },
    events: {
      deleteMany: [
        {
          AND: [{ userId: ctx.userId }, { actionType: 'FOLLOW_USER' }],
        },
      ],
    },
  });

// SNIPPET HELPERS
export const getSnippetById = ({ id }: IdInput, ctx: Context) => {
  switch (ctx.role) {
    case 'ADMIN':
      return Prisma.validator<Prisma.SnippetWhereInput>()({
        id,
        deleted: false,
      });
    case 'USER':
      return Prisma.validator<Prisma.SnippetWhereInput>()({
        id,
        deleted: false,
        public: true,
        AND: [{ authorId: ctx.userId }, { public: false }],
      });
    default:
      return Prisma.validator<Prisma.SnippetWhereInput>()({
        id,
        deleted: false,
        public: true,
      });
  }
};

export const getCreateSnippetData = ({ data }: CreateSnippetInput, ctx: Context) =>
  Prisma.validator<Prisma.SnippetCreateInput>()({
    ...data,
    author: { connect: { id: ctx.userId } },
    events: {
      create: {
        user: { connect: { id: ctx.userId } },
        actionType: 'CREATE_SNIPPET',
      },
    },
  });

export const getCreatePrivateSnippetData = ({ data }: CreateSnippetInput, ctx: Context) =>
  Prisma.validator<Prisma.SnippetCreateInput>()({
    ...data,
    author: { connect: { id: ctx.userId } },
  });

export const getFavoriteSnippetData = (ctx: Context) =>
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
  });

export const getUnfavoriteSnippetData = (ctx: Context) =>
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
  });

export const getVoteSnippetData = (ctx: Context) =>
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
  });

export const getUnvoteSnippetData = (ctx: Context) =>
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
  });

// COMMENT HELPERS
export const getCreateCommentData = ({ data, snippetId }: CreateCommentInput, ctx: Context) =>
  Prisma.validator<Prisma.CommentCreateInput>()({
    text: data.text,
    author: { connect: { id: ctx.userId } },
    snippet: { connect: { id: snippetId } },
    events: {
      create: {
        user: { connect: { id: ctx.userId } },
        targetSnippet: { connect: { id: snippetId } },
        actionType: 'COMMENT_SNIPPET',
      },
    },
  });

export const getReplyCommentData = ({ data, snippetId, id }: ReplyCommentInput, ctx: Context) =>
  Prisma.validator<Prisma.CommentCreateInput>()({
    text: data.text,
    author: { connect: { id: ctx.userId } },
    snippet: { connect: { id: snippetId } },
    replyTo: { connect: { id } },
    events: {
      create: {
        user: { connect: { id: ctx.userId } },
        actionType: 'REPLY_COMMENT',
      },
    },
  });

export const getLikeCommentData = (ctx: Context) =>
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
  });

export const getUnlikeCommentData = (ctx: Context) =>
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
  });

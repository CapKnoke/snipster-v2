import { z } from 'zod';

export const createSnippetInput = z.object({
  title: z.string().min(1).max(32),
  description: z.string().max(140),
  code: z.string().min(1),
  language: z.string(),
  public: z.boolean(),
});

export const createCommentInput = z.object({
  snippetId: z.string().cuid(),
  text: z.string().min(1),
});

export const replyCommentInput = z.object({
  id: z.string().cuid(),
  text: z.string().min(1),
});

export const editUserInput = z.object({
  id: z.string().cuid(),
  data: z.object({
    bio: z.string().min(1).max(140).optional(),
  }),
});

export const idInput = z.object({
  id: z.string().cuid(),
});

export type CreateSnippetInput = typeof createSnippetInput._type;
export type CreateCommentInput = typeof createCommentInput._type;
export type ReplyCommentInput = typeof replyCommentInput._type;
export type EditUserInput = typeof editUserInput._type;
export type IdInput = typeof idInput._type;

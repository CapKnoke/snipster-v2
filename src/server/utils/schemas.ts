import { z } from 'zod';

export const createSnippetInput = z.object({
  data: z.object({
    title: z.string().min(1).max(191),
    description: z.string().max(255).optional(),
    code: z.string().min(1),
    language: z.string(),
    public: z.boolean(),
  })
});

export const createCommentInput = z.object({
  data: z.object({
    snippetId: z.string().cuid(),
    text: z.string().min(1).max(1024),
  })
});

export const replyCommentInput = z.object({
  id: z.string().cuid(),
  data: z.object({
    text: z.string().min(1),
  })
});

export const editUserInput = z.object({
  id: z.string().cuid(),
  data: z.object({
    bio: z.string().min(1).max(255).optional(),
  }),
});

export const idInput = z.object({
  id: z.string().cuid(),
});

export type CreateSnippetInput = z.infer<typeof createCommentInput>;
export type CreateCommentInput = z.infer<typeof createCommentInput>;
export type ReplyCommentInput = z.infer<typeof replyCommentInput>;
export type EditUserInput = z.infer<typeof editUserInput>;
export type IdInput = z.infer<typeof idInput>;

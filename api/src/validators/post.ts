import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(500, 'Excerpt too long'),
  coverImage: z.string().url('Invalid URL').optional().or(z.literal('')),
  category: z.enum(['Judgment', 'Commentary']),
  tags: z.array(z.string()),
  status: z.enum(['draft', 'published']),
});

export const updatePostSchema = createPostSchema.partial();

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;

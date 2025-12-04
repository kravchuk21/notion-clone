import { z } from 'zod';

export const createBoardSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  icon: z.string().max(8).optional(),
});

export const updateBoardSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long').optional(),
  icon: z.string().max(8).nullable().optional(),
});

export const boardIdSchema = z.object({
  id: z.string().min(1),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;


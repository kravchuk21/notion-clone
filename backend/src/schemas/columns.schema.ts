import { z } from 'zod';

export const createColumnSchema = z.object({
  title: z.string().min(1, 'Title is required').max(50, 'Title too long'),
});

export const updateColumnSchema = z.object({
  title: z.string().min(1, 'Title is required').max(50, 'Title too long').optional(),
  position: z.number().int().min(0).optional(),
});

export const reorderColumnsSchema = z.object({
  boardId: z.string().min(1),
  columnIds: z.array(z.string().min(1)),
});

export const columnIdSchema = z.object({
  id: z.string().min(1),
});

export const boardIdParamSchema = z.object({
  boardId: z.string().min(1),
});

export type CreateColumnInput = z.infer<typeof createColumnSchema>;
export type UpdateColumnInput = z.infer<typeof updateColumnSchema>;
export type ReorderColumnsInput = z.infer<typeof reorderColumnsSchema>;


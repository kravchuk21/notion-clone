import { z } from 'zod';

const priorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const createCardSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(2000, 'Description too long').optional(),
  priority: priorityEnum.optional().default('MEDIUM'),
  tags: z.array(z.string().max(30)).max(10).optional().default([]),
  deadline: z.string().datetime().optional().nullable(),
});

export const updateCardSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  description: z.string().max(2000, 'Description too long').optional().nullable(),
  priority: priorityEnum.optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
  deadline: z.string().datetime().optional().nullable(),
});

export const moveCardSchema = z.object({
  columnId: z.string().min(1),
  position: z.number().int().min(0),
});

export const reorderCardsSchema = z.object({
  columnId: z.string().min(1),
  cardIds: z.array(z.string().min(1)),
});

export const cardIdSchema = z.object({
  id: z.string().min(1),
});

export const columnIdParamSchema = z.object({
  columnId: z.string().min(1),
});

export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type MoveCardInput = z.infer<typeof moveCardSchema>;
export type ReorderCardsInput = z.infer<typeof reorderCardsSchema>;


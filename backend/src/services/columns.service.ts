import { prisma } from '../lib/prisma.js';
import { createError } from '../middleware/errorHandler.js';
import { verifyBoardOwnership } from './boards.service.js';
import { CreateColumnInput, UpdateColumnInput } from '../schemas/columns.schema.js';

export async function createColumn(boardId: string, userId: string, input: CreateColumnInput) {
  const hasAccess = await verifyBoardOwnership(boardId, userId);
  if (!hasAccess) {
    throw createError('Board not found', 404);
  }

  // Get max position
  const lastColumn = await prisma.column.findFirst({
    where: { boardId },
    orderBy: { position: 'desc' },
  });

  const position = lastColumn ? lastColumn.position + 1 : 0;

  return prisma.column.create({
    data: {
      title: input.title,
      position,
      boardId,
    },
    include: {
      cards: true,
    },
  });
}

export async function updateColumn(columnId: string, userId: string, input: UpdateColumnInput) {
  const column = await prisma.column.findUnique({
    where: { id: columnId },
    include: { board: true },
  });

  if (!column || column.board.userId !== userId) {
    throw createError('Column not found', 404);
  }

  return prisma.column.update({
    where: { id: columnId },
    data: {
      ...(input.title && { title: input.title }),
      ...(input.position !== undefined && { position: input.position }),
    },
  });
}

export async function deleteColumn(columnId: string, userId: string) {
  const column = await prisma.column.findUnique({
    where: { id: columnId },
    include: { board: true },
  });

  if (!column || column.board.userId !== userId) {
    throw createError('Column not found', 404);
  }

  await prisma.column.delete({
    where: { id: columnId },
  });

  // Reorder remaining columns
  await prisma.column.updateMany({
    where: {
      boardId: column.boardId,
      position: { gt: column.position },
    },
    data: {
      position: { decrement: 1 },
    },
  });

  return { success: true, boardId: column.boardId };
}

export async function reorderColumns(boardId: string, userId: string, columnIds: string[]) {
  const hasAccess = await verifyBoardOwnership(boardId, userId);
  if (!hasAccess) {
    throw createError('Board not found', 404);
  }

  // Update positions in transaction
  await prisma.$transaction(
    columnIds.map((id, index) =>
      prisma.column.update({
        where: { id },
        data: { position: index },
      })
    )
  );

  return prisma.column.findMany({
    where: { boardId },
    orderBy: { position: 'asc' },
    include: {
      cards: {
        orderBy: { position: 'asc' },
      },
    },
  });
}

export async function getColumnBoardId(columnId: string): Promise<string | null> {
  const column = await prisma.column.findUnique({
    where: { id: columnId },
    select: { boardId: true },
  });
  return column?.boardId ?? null;
}


import { prisma } from '../lib/prisma.js';
import { createError } from '../middleware/errorHandler.js';
import { verifyBoardOwnership } from './boards.service.js';
import { CreateColumnInput, UpdateColumnInput } from '../schemas/columns.schema.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';

/**
 * Verifies user has access to a column and returns the column with board
 * @throws AppError if column not found or user doesn't have access
 */
async function verifyColumnAccess(columnId: string, userId: string) {
  const column = await prisma.column.findUnique({
    where: { id: columnId },
    include: { board: true },
  });

  if (!column || column.board.userId !== userId) {
    throw createError(ERROR_MESSAGES.COLUMN.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return column;
}

/**
 * Creates a new column in a board
 * @throws AppError if board not found
 */
export async function createColumn(boardId: string, userId: string, input: CreateColumnInput) {
  const hasAccess = await verifyBoardOwnership(boardId, userId);
  if (!hasAccess) {
    throw createError(ERROR_MESSAGES.BOARD.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

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

/**
 * Updates a column
 * @throws AppError if column not found
 */
export async function updateColumn(columnId: string, userId: string, input: UpdateColumnInput) {
  await verifyColumnAccess(columnId, userId);

  return prisma.column.update({
    where: { id: columnId },
    data: {
      ...(input.title && { title: input.title }),
      ...(input.position !== undefined && { position: input.position }),
    },
  });
}

/**
 * Deletes a column and reorders remaining columns
 * @throws AppError if column not found
 */
export async function deleteColumn(columnId: string, userId: string) {
  const column = await verifyColumnAccess(columnId, userId);

  await prisma.column.delete({
    where: { id: columnId },
  });

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

/**
 * Reorders columns within a board
 * @throws AppError if board not found
 */
export async function reorderColumns(boardId: string, userId: string, columnIds: string[]) {
  const hasAccess = await verifyBoardOwnership(boardId, userId);
  if (!hasAccess) {
    throw createError(ERROR_MESSAGES.BOARD.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

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

/**
 * Gets the board ID for a column
 */
export async function getColumnBoardId(columnId: string): Promise<string | null> {
  const column = await prisma.column.findUnique({
    where: { id: columnId },
    select: { boardId: true },
  });
  return column?.boardId ?? null;
}


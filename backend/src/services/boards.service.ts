import { prisma } from '../lib/prisma.js';
import { createError } from '../middleware/errorHandler.js';
import { CreateBoardInput, UpdateBoardInput } from '../schemas/boards.schema.js';
import { DEFAULT_BOARD_COLUMNS, HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';

/**
 * Verifies board ownership and returns board if found
 * @throws AppError if board not found or user doesn't own it
 */
async function verifyBoardAccess(boardId: string, userId: string) {
  const board = await prisma.board.findFirst({
    where: { id: boardId, userId },
  });

  if (!board) {
    throw createError(ERROR_MESSAGES.BOARD.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return board;
}

/**
 * Gets all boards for a user
 */
export async function getUserBoards(userId: string) {
  return prisma.board.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { columns: true },
      },
    },
  });
}

/**
 * Gets a board by ID with columns and cards
 * @throws AppError if board not found
 */
export async function getBoardById(boardId: string, userId: string) {
  const board = await prisma.board.findFirst({
    where: { id: boardId, userId },
    include: {
      columns: {
        orderBy: { position: 'asc' },
        include: {
          cards: {
            where: { archived: false },
            orderBy: { position: 'asc' },
            include: {
              attachments: {
                orderBy: { createdAt: 'desc' },
              },
            },
          },
        },
      },
    },
  });

  if (!board) {
    throw createError(ERROR_MESSAGES.BOARD.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return board;
}

/**
 * Creates a new board with default columns
 */
export async function createBoard(userId: string, input: CreateBoardInput) {
  return prisma.$transaction(async (tx: typeof prisma) => {
    const board = await tx.board.create({
      data: {
        title: input.title,
        userId,
      },
    });

    await tx.column.createMany({
      data: DEFAULT_BOARD_COLUMNS.map((title, index) => ({
        title,
        position: index,
        boardId: board.id,
      })),
    });

    return tx.board.findUnique({
      where: { id: board.id },
      include: {
        columns: {
          orderBy: { position: 'asc' },
          include: { cards: true },
        },
      },
    });
  });
}

/**
 * Updates a board
 * @throws AppError if board not found
 */
export async function updateBoard(boardId: string, userId: string, input: UpdateBoardInput) {
  await verifyBoardAccess(boardId, userId);

  return prisma.board.update({
    where: { id: boardId },
    data: input,
  });
}

/**
 * Deletes a board
 * @throws AppError if board not found
 */
export async function deleteBoard(boardId: string, userId: string) {
  await verifyBoardAccess(boardId, userId);

  await prisma.board.delete({
    where: { id: boardId },
  });

  return { success: true };
}

/**
 * Checks if user owns a board (without throwing)
 */
export async function verifyBoardOwnership(boardId: string, userId: string): Promise<boolean> {
  const board = await prisma.board.findFirst({
    where: { id: boardId, userId },
  });
  return !!board;
}

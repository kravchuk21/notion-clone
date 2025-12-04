import { prisma } from '../lib/prisma.js';
import { createError } from '../middleware/errorHandler.js';
import { CreateBoardInput, UpdateBoardInput } from '../schemas/boards.schema.js';

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

export async function getBoardById(boardId: string, userId: string) {
  const board = await prisma.board.findFirst({
    where: { id: boardId, userId },
    include: {
      columns: {
        orderBy: { position: 'asc' },
        include: {
          cards: {
            orderBy: { position: 'asc' },
          },
        },
      },
    },
  });

  if (!board) {
    throw createError('Board not found', 404);
  }

  return board;
}

export async function createBoard(userId: string, input: CreateBoardInput) {
  return prisma.board.create({
    data: {
      title: input.title,
      userId,
    },
  });
}

export async function updateBoard(boardId: string, userId: string, input: UpdateBoardInput) {
  const board = await prisma.board.findFirst({
    where: { id: boardId, userId },
  });

  if (!board) {
    throw createError('Board not found', 404);
  }

  return prisma.board.update({
    where: { id: boardId },
    data: input,
  });
}

export async function deleteBoard(boardId: string, userId: string) {
  const board = await prisma.board.findFirst({
    where: { id: boardId, userId },
  });

  if (!board) {
    throw createError('Board not found', 404);
  }

  await prisma.board.delete({
    where: { id: boardId },
  });

  return { success: true };
}

export async function verifyBoardOwnership(boardId: string, userId: string): Promise<boolean> {
  const board = await prisma.board.findFirst({
    where: { id: boardId, userId },
  });
  return !!board;
}


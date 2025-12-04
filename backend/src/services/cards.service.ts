import { prisma } from '../lib/prisma.js';
import { createError } from '../middleware/errorHandler.js';
import { CreateCardInput, UpdateCardInput, MoveCardInput } from '../schemas/cards.schema.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';

/**
 * Verifies user has access to a column and returns boardId
 * @throws AppError if column not found or user doesn't have access
 */
async function verifyColumnAccess(columnId: string, userId: string): Promise<string> {
  const column = await prisma.column.findUnique({
    where: { id: columnId },
    include: { board: true },
  });

  if (!column || column.board.userId !== userId) {
    throw createError(ERROR_MESSAGES.COLUMN.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return column.boardId;
}

/** Default priority for new cards */
const DEFAULT_PRIORITY = 'MEDIUM';

/**
 * Creates a new card in a column
 * @throws AppError if column not found
 */
export async function createCard(columnId: string, userId: string, input: CreateCardInput) {
  const boardId = await verifyColumnAccess(columnId, userId);

  const lastCard = await prisma.card.findFirst({
    where: { columnId, archived: false },
    orderBy: { position: 'desc' },
  });

  const position = lastCard ? lastCard.position + 1 : 0;

  const card = await prisma.card.create({
    data: {
      title: input.title,
      description: input.description,
      priority: input.priority ?? DEFAULT_PRIORITY,
      tags: input.tags ?? [],
      deadline: input.deadline ? new Date(input.deadline) : null,
      position,
      columnId,
    },
  });

  return { card, boardId };
}

/**
 * Updates a card
 * @throws AppError if card not found
 */
export async function updateCard(cardId: string, userId: string, input: UpdateCardInput) {
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: { column: { include: { board: true } } },
  });

  if (!card || card.column.board.userId !== userId) {
    throw createError(ERROR_MESSAGES.CARD.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const updatedCard = await prisma.card.update({
    where: { id: cardId },
    data: {
      ...(input.title && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.priority && { priority: input.priority }),
      ...(input.tags && { tags: input.tags }),
      ...(input.deadline !== undefined && {
        deadline: input.deadline ? new Date(input.deadline) : null,
      }),
    },
  });

  return { card: updatedCard, boardId: card.column.boardId };
}

/**
 * Deletes a card and reorders remaining cards
 * @throws AppError if card not found
 */
export async function deleteCard(cardId: string, userId: string) {
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: { column: { include: { board: true } } },
  });

  if (!card || card.column.board.userId !== userId) {
    throw createError(ERROR_MESSAGES.CARD.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  await prisma.card.delete({
    where: { id: cardId },
  });

  // Reorder remaining cards (only non-archived)
  await prisma.card.updateMany({
    where: {
      columnId: card.columnId,
      position: { gt: card.position },
      archived: false,
    },
    data: {
      position: { decrement: 1 },
    },
  });

  return { success: true, boardId: card.column.boardId, columnId: card.columnId };
}

/**
 * Moves a card to a new column and/or position
 * @throws AppError if card or target column not found
 */
export async function moveCard(cardId: string, userId: string, input: MoveCardInput) {
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: { column: { include: { board: true } } },
  });

  if (!card || card.column.board.userId !== userId) {
    throw createError(ERROR_MESSAGES.CARD.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  // Verify target column access
  await verifyColumnAccess(input.columnId, userId);

  const oldColumnId = card.columnId;
  const oldPosition = card.position;
  const newColumnId = input.columnId;
  const newPosition = input.position;

  await prisma.$transaction(async (tx: typeof prisma) => {
    // If moving within the same column
    if (oldColumnId === newColumnId) {
      if (oldPosition < newPosition) {
        // Moving down
        await tx.card.updateMany({
          where: {
            columnId: oldColumnId,
            position: { gt: oldPosition, lte: newPosition },
            archived: false,
          },
          data: { position: { decrement: 1 } },
        });
      } else if (oldPosition > newPosition) {
        // Moving up
        await tx.card.updateMany({
          where: {
            columnId: oldColumnId,
            position: { gte: newPosition, lt: oldPosition },
            archived: false,
          },
          data: { position: { increment: 1 } },
        });
      }
    } else {
      // Moving to different column
      // Decrement positions in old column
      await tx.card.updateMany({
        where: {
          columnId: oldColumnId,
          position: { gt: oldPosition },
          archived: false,
        },
        data: { position: { decrement: 1 } },
      });

      // Increment positions in new column
      await tx.card.updateMany({
        where: {
          columnId: newColumnId,
          position: { gte: newPosition },
          archived: false,
        },
        data: { position: { increment: 1 } },
      });
    }

    // Update the card
    await tx.card.update({
      where: { id: cardId },
      data: {
        columnId: newColumnId,
        position: newPosition,
      },
    });
  });

  const updatedCard = await prisma.card.findUnique({
    where: { id: cardId },
  });

  return {
    card: updatedCard,
    boardId: card.column.boardId,
    fromColumnId: oldColumnId,
    toColumnId: newColumnId,
  };
}

/**
 * Reorders cards within a column
 * @throws AppError if column not found
 */
export async function reorderCards(columnId: string, userId: string, cardIds: string[]) {
  const boardId = await verifyColumnAccess(columnId, userId);

  await prisma.$transaction(
    cardIds.map((id, index) =>
      prisma.card.update({
        where: { id },
        data: { position: index },
      })
    )
  );

  const cards = await prisma.card.findMany({
    where: { columnId, archived: false },
    orderBy: { position: 'asc' },
  });

  return { cards, boardId };
}

/**
 * Archives a card (soft delete)
 * @throws AppError if card not found
 */
export async function archiveCard(cardId: string, userId: string) {
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: { column: { include: { board: true } } },
  });

  if (!card || card.column.board.userId !== userId) {
    throw createError(ERROR_MESSAGES.CARD.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  if (card.archived) {
    throw createError(ERROR_MESSAGES.CARD.ALREADY_ARCHIVED, HTTP_STATUS.BAD_REQUEST);
  }

  const archivedCard = await prisma.card.update({
    where: { id: cardId },
    data: {
      archived: true,
      archivedAt: new Date(),
    },
  });

  // Reorder remaining cards in the column
  await prisma.card.updateMany({
    where: {
      columnId: card.columnId,
      position: { gt: card.position },
      archived: false,
    },
    data: {
      position: { decrement: 1 },
    },
  });

  return { card: archivedCard, boardId: card.column.boardId, columnId: card.columnId };
}

/**
 * Restores an archived card
 * @throws AppError if card not found or not archived
 */
export async function restoreCard(cardId: string, userId: string) {
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: { column: { include: { board: true } } },
  });

  if (!card || card.column.board.userId !== userId) {
    throw createError(ERROR_MESSAGES.CARD.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  if (!card.archived) {
    throw createError(ERROR_MESSAGES.CARD.NOT_ARCHIVED, HTTP_STATUS.BAD_REQUEST);
  }

  // Get the last position in the column
  const lastCard = await prisma.card.findFirst({
    where: { columnId: card.columnId, archived: false },
    orderBy: { position: 'desc' },
  });

  const newPosition = lastCard ? lastCard.position + 1 : 0;

  const restoredCard = await prisma.card.update({
    where: { id: cardId },
    data: {
      archived: false,
      archivedAt: null,
      position: newPosition,
    },
  });

  return { card: restoredCard, boardId: card.column.boardId, columnId: card.columnId };
}

/**
 * Gets all archived cards for a board
 */
export async function getArchivedCards(boardId: string, userId: string) {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
  });

  if (!board || board.userId !== userId) {
    throw createError(ERROR_MESSAGES.BOARD.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const archivedCards = await prisma.card.findMany({
    where: {
      column: { boardId },
      archived: true,
    },
    include: {
      column: {
        select: { title: true },
      },
    },
    orderBy: { archivedAt: 'desc' },
  });

  return archivedCards;
}

/**
 * Permanently deletes an archived card
 * @throws AppError if card not found or not archived
 */
export async function permanentDeleteCard(cardId: string, userId: string) {
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: { column: { include: { board: true } } },
  });

  if (!card || card.column.board.userId !== userId) {
    throw createError(ERROR_MESSAGES.CARD.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  if (!card.archived) {
    throw createError(ERROR_MESSAGES.CARD.NOT_ARCHIVED, HTTP_STATUS.BAD_REQUEST);
  }

  await prisma.card.delete({
    where: { id: cardId },
  });

  return { success: true, boardId: card.column.boardId };
}


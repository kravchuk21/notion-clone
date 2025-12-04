import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as cardsService from '../services/cards.service.js';
import {
  CreateCardInput,
  UpdateCardInput,
  MoveCardInput,
  ReorderCardsInput,
} from '../schemas/cards.schema.js';
import { getIO, getBoardRoom } from '../socket.js';
import { HTTP_STATUS, SOCKET_EVENTS } from '../constants/index.js';

/**
 * Creates a new card in a column
 */
export async function createCard(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false });
      return;
    }

    const columnId = req.params.columnId;
    const input: CreateCardInput = req.body;
    const { card, boardId } = await cardsService.createCard(columnId, userId, input);

    const io = getIO();
    io.to(getBoardRoom(boardId)).emit(SOCKET_EVENTS.CARD.CREATED, card);

    res.status(HTTP_STATUS.CREATED).json({ success: true, data: card });
  } catch (error) {
    next(error);
  }
}

/**
 * Updates a card
 */
export async function updateCard(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false });
      return;
    }

    const input: UpdateCardInput = req.body;
    const { card, boardId } = await cardsService.updateCard(req.params.id, userId, input);

    const io = getIO();
    io.to(getBoardRoom(boardId)).emit(SOCKET_EVENTS.CARD.UPDATED, card);

    res.json({ success: true, data: card });
  } catch (error) {
    next(error);
  }
}

/**
 * Deletes a card
 */
export async function deleteCard(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false });
      return;
    }

    const { boardId } = await cardsService.deleteCard(req.params.id, userId);

    const io = getIO();
    io.to(getBoardRoom(boardId)).emit(SOCKET_EVENTS.CARD.DELETED, req.params.id);

    res.json({ success: true, message: 'Card deleted' });
  } catch (error) {
    next(error);
  }
}

/**
 * Moves a card to a new column/position
 */
export async function moveCard(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false });
      return;
    }

    const input: MoveCardInput = req.body;
    const result = await cardsService.moveCard(req.params.id, userId, input);

    const io = getIO();
    io.to(getBoardRoom(result.boardId)).emit(SOCKET_EVENTS.CARD.MOVED, {
      cardId: req.params.id,
      fromColumnId: result.fromColumnId,
      toColumnId: result.toColumnId,
      position: input.position,
    });

    res.json({ success: true, data: result.card });
  } catch (error) {
    next(error);
  }
}

/**
 * Reorders cards within a column
 */
export async function reorderCards(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false });
      return;
    }

    const input: ReorderCardsInput = req.body;
    const { cards, boardId } = await cardsService.reorderCards(
      input.columnId,
      userId,
      input.cardIds
    );

    const io = getIO();
    io.to(getBoardRoom(boardId)).emit(SOCKET_EVENTS.CARD.REORDERED, {
      columnId: input.columnId,
      cardIds: input.cardIds,
    });

    res.json({ success: true, data: cards });
  } catch (error) {
    next(error);
  }
}


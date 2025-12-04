import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as cardsService from '../services/cards.service.js';
import {
  CreateCardInput,
  UpdateCardInput,
  MoveCardInput,
  ReorderCardsInput,
} from '../schemas/cards.schema.js';
import { getIO } from '../socket.js';

export async function createCard(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const columnId = req.params.columnId;
    const input: CreateCardInput = req.body;
    const { card, boardId } = await cardsService.createCard(columnId, req.user!.userId, input);

    // Emit to socket
    const io = getIO();
    io.to(`board:${boardId}`).emit('card:created', card);

    res.status(201).json({ success: true, data: card });
  } catch (error) {
    next(error);
  }
}

export async function updateCard(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input: UpdateCardInput = req.body;
    const { card, boardId } = await cardsService.updateCard(req.params.id, req.user!.userId, input);

    // Emit to socket
    const io = getIO();
    io.to(`board:${boardId}`).emit('card:updated', card);

    res.json({ success: true, data: card });
  } catch (error) {
    next(error);
  }
}

export async function deleteCard(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { boardId } = await cardsService.deleteCard(req.params.id, req.user!.userId);

    // Emit to socket
    const io = getIO();
    io.to(`board:${boardId}`).emit('card:deleted', req.params.id);

    res.json({ success: true, message: 'Card deleted' });
  } catch (error) {
    next(error);
  }
}

export async function moveCard(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input: MoveCardInput = req.body;
    const result = await cardsService.moveCard(req.params.id, req.user!.userId, input);

    // Emit to socket
    const io = getIO();
    io.to(`board:${result.boardId}`).emit('card:moved', {
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

export async function reorderCards(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input: ReorderCardsInput = req.body;
    const { cards, boardId } = await cardsService.reorderCards(
      input.columnId,
      req.user!.userId,
      input.cardIds
    );

    // Emit to socket
    const io = getIO();
    io.to(`board:${boardId}`).emit('cards:reordered', {
      columnId: input.columnId,
      cardIds: input.cardIds,
    });

    res.json({ success: true, data: cards });
  } catch (error) {
    next(error);
  }
}


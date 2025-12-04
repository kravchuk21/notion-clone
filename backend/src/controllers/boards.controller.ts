import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as boardsService from '../services/boards.service.js';
import { CreateBoardInput, UpdateBoardInput } from '../schemas/boards.schema.js';
import { getIO } from '../socket.js';

export async function getBoards(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const boards = await boardsService.getUserBoards(req.user!.userId);
    res.json({ success: true, data: boards });
  } catch (error) {
    next(error);
  }
}

export async function getBoard(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const board = await boardsService.getBoardById(req.params.id, req.user!.userId);
    res.json({ success: true, data: board });
  } catch (error) {
    next(error);
  }
}

export async function createBoard(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input: CreateBoardInput = req.body;
    const board = await boardsService.createBoard(req.user!.userId, input);
    res.status(201).json({ success: true, data: board });
  } catch (error) {
    next(error);
  }
}

export async function updateBoard(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input: UpdateBoardInput = req.body;
    const board = await boardsService.updateBoard(req.params.id, req.user!.userId, input);

    // Emit to socket
    const io = getIO();
    io.to(`board:${board.id}`).emit('board:updated', board);

    res.json({ success: true, data: board });
  } catch (error) {
    next(error);
  }
}

export async function deleteBoard(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await boardsService.deleteBoard(req.params.id, req.user!.userId);
    res.json({ success: true, message: 'Board deleted' });
  } catch (error) {
    next(error);
  }
}


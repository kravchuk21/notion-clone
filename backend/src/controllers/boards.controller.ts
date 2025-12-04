import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as boardsService from '../services/boards.service.js';
import { CreateBoardInput, UpdateBoardInput } from '../schemas/boards.schema.js';
import { getIO, getBoardRoom } from '../socket.js';
import { HTTP_STATUS, SOCKET_EVENTS } from '../constants/index.js';

/**
 * Gets all boards for the authenticated user
 */
export async function getBoards(
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

    const boards = await boardsService.getUserBoards(userId);
    res.json({ success: true, data: boards });
  } catch (error) {
    next(error);
  }
}

/**
 * Gets a single board by ID
 */
export async function getBoard(
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

    const board = await boardsService.getBoardById(req.params.id, userId);
    res.json({ success: true, data: board });
  } catch (error) {
    next(error);
  }
}

/**
 * Creates a new board
 */
export async function createBoard(
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

    const input: CreateBoardInput = req.body;
    const board = await boardsService.createBoard(userId, input);
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: board });
  } catch (error) {
    next(error);
  }
}

/**
 * Updates a board
 */
export async function updateBoard(
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

    const input: UpdateBoardInput = req.body;
    const board = await boardsService.updateBoard(req.params.id, userId, input);

    const io = getIO();
    io.to(getBoardRoom(board.id)).emit(SOCKET_EVENTS.BOARD.UPDATED, board);

    res.json({ success: true, data: board });
  } catch (error) {
    next(error);
  }
}

/**
 * Deletes a board
 */
export async function deleteBoard(
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

    await boardsService.deleteBoard(req.params.id, userId);
    res.json({ success: true, message: 'Board deleted' });
  } catch (error) {
    next(error);
  }
}


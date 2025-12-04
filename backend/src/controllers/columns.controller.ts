import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as columnsService from '../services/columns.service.js';
import { CreateColumnInput, UpdateColumnInput, ReorderColumnsInput } from '../schemas/columns.schema.js';
import { getIO, getBoardRoom } from '../socket.js';
import { HTTP_STATUS, SOCKET_EVENTS } from '../constants/index.js';

/**
 * Creates a new column in a board
 */
export async function createColumn(
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

    const boardId = req.params.boardId;
    const input: CreateColumnInput = req.body;
    const column = await columnsService.createColumn(boardId, userId, input);

    const io = getIO();
    io.to(getBoardRoom(boardId)).emit(SOCKET_EVENTS.COLUMN.CREATED, column);

    res.status(HTTP_STATUS.CREATED).json({ success: true, data: column });
  } catch (error) {
    next(error);
  }
}

/**
 * Updates a column
 */
export async function updateColumn(
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

    const input: UpdateColumnInput = req.body;
    const column = await columnsService.updateColumn(req.params.id, userId, input);

    const boardId = await columnsService.getColumnBoardId(req.params.id);
    if (boardId) {
      const io = getIO();
      io.to(getBoardRoom(boardId)).emit(SOCKET_EVENTS.COLUMN.UPDATED, column);
    }

    res.json({ success: true, data: column });
  } catch (error) {
    next(error);
  }
}

/**
 * Deletes a column
 */
export async function deleteColumn(
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

    const result = await columnsService.deleteColumn(req.params.id, userId);

    const io = getIO();
    io.to(getBoardRoom(result.boardId)).emit(SOCKET_EVENTS.COLUMN.DELETED, req.params.id);

    res.json({ success: true, message: 'Column deleted' });
  } catch (error) {
    next(error);
  }
}

/**
 * Reorders columns within a board
 */
export async function reorderColumns(
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

    const input: ReorderColumnsInput = req.body;
    const columns = await columnsService.reorderColumns(
      input.boardId,
      userId,
      input.columnIds
    );

    const io = getIO();
    io.to(getBoardRoom(input.boardId)).emit(SOCKET_EVENTS.COLUMN.REORDERED, input.columnIds);

    res.json({ success: true, data: columns });
  } catch (error) {
    next(error);
  }
}


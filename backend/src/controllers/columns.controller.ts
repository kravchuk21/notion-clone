import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as columnsService from '../services/columns.service.js';
import { CreateColumnInput, UpdateColumnInput, ReorderColumnsInput } from '../schemas/columns.schema.js';
import { getIO } from '../socket.js';

export async function createColumn(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const boardId = req.params.boardId;
    const input: CreateColumnInput = req.body;
    const column = await columnsService.createColumn(boardId, req.user!.userId, input);

    // Emit to socket
    const io = getIO();
    io.to(`board:${boardId}`).emit('column:created', column);

    res.status(201).json({ success: true, data: column });
  } catch (error) {
    next(error);
  }
}

export async function updateColumn(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input: UpdateColumnInput = req.body;
    const column = await columnsService.updateColumn(req.params.id, req.user!.userId, input);

    // Get boardId for socket emission
    const boardId = await columnsService.getColumnBoardId(req.params.id);
    if (boardId) {
      const io = getIO();
      io.to(`board:${boardId}`).emit('column:updated', column);
    }

    res.json({ success: true, data: column });
  } catch (error) {
    next(error);
  }
}

export async function deleteColumn(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await columnsService.deleteColumn(req.params.id, req.user!.userId);

    // Emit to socket
    const io = getIO();
    io.to(`board:${result.boardId}`).emit('column:deleted', req.params.id);

    res.json({ success: true, message: 'Column deleted' });
  } catch (error) {
    next(error);
  }
}

export async function reorderColumns(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input: ReorderColumnsInput = req.body;
    const columns = await columnsService.reorderColumns(
      input.boardId,
      req.user!.userId,
      input.columnIds
    );

    // Emit to socket
    const io = getIO();
    io.to(`board:${input.boardId}`).emit('column:reordered', input.columnIds);

    res.json({ success: true, data: columns });
  } catch (error) {
    next(error);
  }
}


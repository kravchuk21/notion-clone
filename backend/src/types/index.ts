import { Request } from 'express';

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface CreateBoardInput {
  title: string;
}

export interface UpdateBoardInput {
  title?: string;
}

export interface CreateColumnInput {
  title: string;
}

export interface UpdateColumnInput {
  title?: string;
  position?: number;
}

export interface ReorderColumnsInput {
  boardId: string;
  columnIds: string[];
}

export interface CreateCardInput {
  title: string;
  description?: string;
  priority?: Priority;
  tags?: string[];
  deadline?: Date;
}

export interface UpdateCardInput {
  title?: string;
  description?: string;
  priority?: Priority;
  tags?: string[];
  deadline?: Date | null;
}

export interface MoveCardInput {
  columnId: string;
  position: number;
}

export interface ReorderCardsInput {
  columnId: string;
  cardIds: string[];
}


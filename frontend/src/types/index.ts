export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Board {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    columns: number;
  };
}

export interface BoardWithDetails extends Board {
  columns: ColumnWithCards[];
}

export interface Column {
  id: string;
  title: string;
  position: number;
  boardId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ColumnWithCards extends Column {
  cards: Card[];
}

export interface Card {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  tags: string[];
  deadline: string | null;
  position: number;
  columnId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

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

export interface CreateCardInput {
  title: string;
  description?: string;
  priority?: Priority;
  tags?: string[];
  deadline?: string | null;
}

export interface UpdateCardInput {
  title?: string;
  description?: string | null;
  priority?: Priority;
  tags?: string[];
  deadline?: string | null;
}

export interface MoveCardInput {
  columnId: string;
  position: number;
}

export interface ReorderColumnsInput {
  boardId: string;
  columnIds: string[];
}

export interface ReorderCardsInput {
  columnId: string;
  cardIds: string[];
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
}


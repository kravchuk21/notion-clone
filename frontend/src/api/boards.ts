import api from './client';
import { extractData } from './utils';
import type { Board, BoardWithDetails, ApiResponse, CreateBoardInput, UpdateBoardInput } from '@/types';

export const boardsApi = {
  async getAll(): Promise<Board[]> {
    const response = await api.get<ApiResponse<Board[]>>('/boards');
    return extractData(response);
  },

  async getById(id: string): Promise<BoardWithDetails> {
    const response = await api.get<ApiResponse<BoardWithDetails>>(`/boards/${id}`);
    return extractData(response);
  },

  async create(data: CreateBoardInput): Promise<Board> {
    const response = await api.post<ApiResponse<Board>>('/boards', data);
    return extractData(response);
  },

  async update(id: string, data: UpdateBoardInput): Promise<Board> {
    const response = await api.put<ApiResponse<Board>>(`/boards/${id}`, data);
    return extractData(response);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/boards/${id}`);
  },

  async toggleFavorite(id: string): Promise<Board> {
    const response = await api.patch<ApiResponse<Board>>(`/boards/${id}/favorite`);
    return extractData(response);
  },
};


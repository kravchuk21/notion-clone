import api from './client';
import type { Board, BoardWithDetails, ApiResponse, CreateBoardInput, UpdateBoardInput } from '@/types';

export const boardsApi = {
  async getAll(): Promise<Board[]> {
    const response = await api.get<ApiResponse<Board[]>>('/boards');
    return response.data.data!;
  },

  async getById(id: string): Promise<BoardWithDetails> {
    const response = await api.get<ApiResponse<BoardWithDetails>>(`/boards/${id}`);
    return response.data.data!;
  },

  async create(data: CreateBoardInput): Promise<Board> {
    const response = await api.post<ApiResponse<Board>>('/boards', data);
    return response.data.data!;
  },

  async update(id: string, data: UpdateBoardInput): Promise<Board> {
    const response = await api.put<ApiResponse<Board>>(`/boards/${id}`, data);
    return response.data.data!;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/boards/${id}`);
  },
};


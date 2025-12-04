import api from './client';
import { extractData } from './utils';
import type { Column, ColumnWithCards, ApiResponse, CreateColumnInput, UpdateColumnInput, ReorderColumnsInput } from '@/types';

export const columnsApi = {
  async create(boardId: string, data: CreateColumnInput): Promise<ColumnWithCards> {
    const response = await api.post<ApiResponse<ColumnWithCards>>(`/boards/${boardId}/columns`, data);
    return extractData(response);
  },

  async update(id: string, data: UpdateColumnInput): Promise<Column> {
    const response = await api.put<ApiResponse<Column>>(`/columns/${id}`, data);
    return extractData(response);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/columns/${id}`);
  },

  async reorder(data: ReorderColumnsInput): Promise<ColumnWithCards[]> {
    const response = await api.patch<ApiResponse<ColumnWithCards[]>>('/columns/reorder', data);
    return extractData(response);
  },
};


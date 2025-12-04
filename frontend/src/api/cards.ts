import api from './client';
import type { Card, ApiResponse, CreateCardInput, UpdateCardInput, MoveCardInput, ReorderCardsInput } from '@/types';

export const cardsApi = {
  async create(columnId: string, data: CreateCardInput): Promise<Card> {
    const response = await api.post<ApiResponse<Card>>(`/columns/${columnId}/cards`, data);
    return response.data.data!;
  },

  async update(id: string, data: UpdateCardInput): Promise<Card> {
    const response = await api.put<ApiResponse<Card>>(`/cards/${id}`, data);
    return response.data.data!;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/cards/${id}`);
  },

  async move(id: string, data: MoveCardInput): Promise<Card> {
    const response = await api.patch<ApiResponse<Card>>(`/cards/${id}/move`, data);
    return response.data.data!;
  },

  async reorder(data: ReorderCardsInput): Promise<Card[]> {
    const response = await api.patch<ApiResponse<Card[]>>('/cards/reorder', data);
    return response.data.data!;
  },
};


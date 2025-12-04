import api from './client';
import { extractData } from './utils';
import type { Card, ArchivedCard, ApiResponse, CreateCardInput, UpdateCardInput, MoveCardInput, ReorderCardsInput } from '@/types';

export const cardsApi = {
  async create(columnId: string, data: CreateCardInput): Promise<Card> {
    const response = await api.post<ApiResponse<Card>>(`/columns/${columnId}/cards`, data);
    return extractData(response);
  },

  async update(id: string, data: UpdateCardInput): Promise<Card> {
    const response = await api.put<ApiResponse<Card>>(`/cards/${id}`, data);
    return extractData(response);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/cards/${id}`);
  },

  async move(id: string, data: MoveCardInput): Promise<Card> {
    const response = await api.patch<ApiResponse<Card>>(`/cards/${id}/move`, data);
    return extractData(response);
  },

  async reorder(data: ReorderCardsInput): Promise<Card[]> {
    const response = await api.patch<ApiResponse<Card[]>>('/cards/reorder', data);
    return extractData(response);
  },

  async archive(id: string): Promise<Card> {
    const response = await api.patch<ApiResponse<Card>>(`/cards/${id}/archive`);
    return extractData(response);
  },

  async restore(id: string): Promise<Card> {
    const response = await api.patch<ApiResponse<Card>>(`/cards/${id}/restore`);
    return extractData(response);
  },

  async getArchived(boardId: string): Promise<ArchivedCard[]> {
    const response = await api.get<ApiResponse<ArchivedCard[]>>(`/boards/${boardId}/archived-cards`);
    return extractData(response);
  },

  async permanentDelete(id: string): Promise<void> {
    await api.delete(`/cards/${id}/permanent`);
  },
};


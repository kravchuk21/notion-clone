import api from './client';
import { extractData } from './utils';
import type { Attachment, ApiResponse } from '@/types';

export const attachmentsApi = {
  async upload(cardId: string, file: File): Promise<Attachment> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<ApiResponse<Attachment>>(
      `/cards/${cardId}/attachments`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return extractData(response);
  },

  async getAll(cardId: string): Promise<Attachment[]> {
    const response = await api.get<ApiResponse<Attachment[]>>(`/cards/${cardId}/attachments`);
    return extractData(response);
  },

  async download(attachmentId: string): Promise<Blob> {
    const response = await api.get(`/attachments/${attachmentId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  async delete(attachmentId: string): Promise<void> {
    await api.delete(`/attachments/${attachmentId}`);
  },
};

import api from './client';
import { extractData } from './utils';
import type { User, ApiResponse, LoginInput, RegisterInput, UpdateProfileInput } from '@/types';

export const authApi = {
  async login(data: LoginInput): Promise<User> {
    const response = await api.post<ApiResponse<{ user: User }>>('/auth/login', data);
    return extractData(response).user;
  },

  async register(data: RegisterInput): Promise<User> {
    const response = await api.post<ApiResponse<{ user: User }>>('/auth/register', data);
    return extractData(response).user;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async me(): Promise<User> {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return extractData(response).user;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/profile');
    return extractData(response).user;
  },

  async updateProfile(data: UpdateProfileInput): Promise<User> {
    const response = await api.put<ApiResponse<{ user: User }>>('/auth/profile', data);
    return extractData(response).user;
  },
};


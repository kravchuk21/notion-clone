import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string; message?: string }>) => {
    const message = error.response?.data?.error || error.response?.data?.message || 'Произошла ошибка';

    // Don't show toast for auth check failures
    if (error.config?.url !== '/auth/me') {
      toast.error(message);
    }

    // Redirect to login on 401 (except for auth endpoints)
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/')) {
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { boardsApi } from '@/api/boards';
import type { CreateBoardInput, UpdateBoardInput } from '@/types';
import toast from 'react-hot-toast';

export function useBoards() {
  return useQuery({
    queryKey: ['boards'],
    queryFn: boardsApi.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBoard(id: string) {
  return useQuery({
    queryKey: ['boards', id],
    queryFn: () => boardsApi.getById(id),
    staleTime: 1 * 60 * 1000,
    enabled: !!id,
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBoardInput) => boardsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast.success('Доска создана');
    },
  });
}

export function useUpdateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBoardInput }) =>
      boardsApi.update(id, data),
    onSuccess: (board) => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      queryClient.invalidateQueries({ queryKey: ['boards', board.id] });
      toast.success('Доска обновлена');
    },
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => boardsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast.success('Доска удалена');
    },
  });
}


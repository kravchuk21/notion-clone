import { useMutation, useQueryClient } from '@tanstack/react-query';
import { columnsApi } from '@/api/columns';
import type { CreateColumnInput, UpdateColumnInput, ReorderColumnsInput } from '@/types';
import toast from 'react-hot-toast';

export function useCreateColumn(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateColumnInput) => columnsApi.create(boardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
      toast.success('Колонка создана');
    },
  });
}

export function useUpdateColumn(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateColumnInput }) =>
      columnsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
    },
  });
}

export function useDeleteColumn(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => columnsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
      toast.success('Колонка удалена');
    },
  });
}

export function useReorderColumns(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReorderColumnsInput) => columnsApi.reorder(data),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['boards', boardId] });
      const previous = queryClient.getQueryData(['boards', boardId]);
      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['boards', boardId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
    },
  });
}


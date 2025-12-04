import { useMutation, useQueryClient } from '@tanstack/react-query';
import { columnsApi } from '@/api/columns';
import type { CreateColumnInput, UpdateColumnInput, ReorderColumnsInput, BoardWithDetails } from '@/types';
import toast from 'react-hot-toast';
import { QUERY_KEYS, SUCCESS_MESSAGES } from '@/constants';

/**
 * Hook to create a new column in a board
 */
export function useCreateColumn(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateColumnInput) => columnsApi.create(boardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOARDS, boardId] });
      toast.success(SUCCESS_MESSAGES.COLUMN.CREATED);
    },
  });
}

/**
 * Hook to update a column
 */
export function useUpdateColumn(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateColumnInput }) =>
      columnsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOARDS, boardId] });
    },
  });
}

/**
 * Hook to delete a column
 */
export function useDeleteColumn(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => columnsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOARDS, boardId] });
      toast.success(SUCCESS_MESSAGES.COLUMN.DELETED);
    },
  });
}

/**
 * Hook to reorder columns with optimistic updates
 */
export function useReorderColumns(boardId: string) {
  const queryClient = useQueryClient();
  const queryKey = [QUERY_KEYS.BOARDS, boardId];

  return useMutation({
    mutationFn: (data: ReorderColumnsInput) => columnsApi.reorder(data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<BoardWithDetails>(queryKey);
      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}


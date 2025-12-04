import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cardsApi } from '@/api/cards';
import type { CreateCardInput, UpdateCardInput, MoveCardInput, ReorderCardsInput } from '@/types';
import toast from 'react-hot-toast';

export function useCreateCard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ columnId, data }: { columnId: string; data: CreateCardInput }) =>
      cardsApi.create(columnId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
      toast.success('Карточка создана');
    },
  });
}

export function useUpdateCard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCardInput }) =>
      cardsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
    },
  });
}

export function useDeleteCard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cardsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
      toast.success('Карточка удалена');
    },
  });
}

export function useMoveCard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MoveCardInput }) =>
      cardsApi.move(id, data),
    onMutate: async () => {
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

export function useReorderCards(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReorderCardsInput) => cardsApi.reorder(data),
    onMutate: async () => {
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


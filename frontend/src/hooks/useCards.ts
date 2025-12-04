import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cardsApi } from '@/api/cards';
import type { CreateCardInput, UpdateCardInput, MoveCardInput, ReorderCardsInput, BoardWithDetails } from '@/types';
import toast from 'react-hot-toast';
import { QUERY_KEYS, SUCCESS_MESSAGES } from '@/constants';

/**
 * Creates optimistic update handlers for board mutations
 */
function useOptimisticBoardUpdate(boardId: string) {
  const queryClient = useQueryClient();
  const queryKey = [QUERY_KEYS.BOARDS, boardId];

  return {
    queryKey,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<BoardWithDetails>(queryKey);
      return { previous };
    },
    onError: (_err: unknown, _variables: unknown, context: { previous?: BoardWithDetails } | undefined) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  };
}

/**
 * Hook to create a new card
 */
export function useCreateCard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ columnId, data }: { columnId: string; data: CreateCardInput }) =>
      cardsApi.create(columnId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOARDS, boardId] });
      toast.success(SUCCESS_MESSAGES.CARD.CREATED);
    },
  });
}

/**
 * Hook to update a card
 */
export function useUpdateCard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCardInput }) =>
      cardsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOARDS, boardId] });
    },
  });
}

/**
 * Hook to delete a card
 */
export function useDeleteCard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cardsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOARDS, boardId] });
      toast.success(SUCCESS_MESSAGES.CARD.DELETED);
    },
  });
}

/**
 * Hook to move a card with optimistic updates
 */
export function useMoveCard(boardId: string) {
  const optimistic = useOptimisticBoardUpdate(boardId);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MoveCardInput }) =>
      cardsApi.move(id, data),
    ...optimistic,
  });
}

/**
 * Hook to reorder cards with optimistic updates
 */
export function useReorderCards(boardId: string) {
  const optimistic = useOptimisticBoardUpdate(boardId);

  return useMutation({
    mutationFn: (data: ReorderCardsInput) => cardsApi.reorder(data),
    ...optimistic,
  });
}


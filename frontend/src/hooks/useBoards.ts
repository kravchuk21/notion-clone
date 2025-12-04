import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { boardsApi } from '@/api/boards';
import type { CreateBoardInput, UpdateBoardInput, Board, BoardWithDetails } from '@/types';
import toast from 'react-hot-toast';
import { QUERY_KEYS, STALE_TIMES, SUCCESS_MESSAGES } from '@/constants';

/**
 * Hook to fetch all boards for the current user
 */
export function useBoards() {
  return useQuery<Board[]>({
    queryKey: [QUERY_KEYS.BOARDS],
    queryFn: boardsApi.getAll,
    staleTime: STALE_TIMES.BOARDS_LIST,
  });
}

/**
 * Hook to fetch a single board with columns and cards
 */
export function useBoard(id: string) {
  return useQuery<BoardWithDetails>({
    queryKey: [QUERY_KEYS.BOARDS, id],
    queryFn: () => boardsApi.getById(id),
    staleTime: STALE_TIMES.BOARD_DETAIL,
    enabled: !!id,
  });
}

/**
 * Hook to create a new board
 */
export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBoardInput) => boardsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOARDS] });
      toast.success(SUCCESS_MESSAGES.BOARD.CREATED);
    },
  });
}

/**
 * Hook to update a board
 */
export function useUpdateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBoardInput }) =>
      boardsApi.update(id, data),
    onSuccess: (board) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOARDS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOARDS, board.id] });
      toast.success(SUCCESS_MESSAGES.BOARD.UPDATED);
    },
  });
}

/**
 * Hook to delete a board
 */
export function useDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => boardsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOARDS] });
      toast.success(SUCCESS_MESSAGES.BOARD.DELETED);
    },
  });
}


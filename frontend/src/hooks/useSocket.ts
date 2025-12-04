import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket, connectSocket, joinBoard, leaveBoard } from '@/lib/socket';

export function useSocket(boardId: string | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!boardId) return;

    connectSocket();
    const socket = getSocket();

    socket.on('connect', () => {
      joinBoard(boardId);
    });

    // If already connected, join immediately
    if (socket.connected) {
      joinBoard(boardId);
    }

    // Card events
    socket.on('card:created', () => {
      queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
    });

    socket.on('card:updated', () => {
      queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
    });

    socket.on('card:moved', () => {
      queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
    });

    socket.on('card:deleted', () => {
      queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
    });

    socket.on('cards:reordered', () => {
      queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
    });

    // Column events
    socket.on('column:created', () => {
      queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
    });

    socket.on('column:updated', () => {
      queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
    });

    socket.on('column:reordered', () => {
      queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
    });

    socket.on('column:deleted', () => {
      queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
    });

    // Board events
    socket.on('board:updated', () => {
      queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    });

    return () => {
      leaveBoard(boardId);
      socket.off('card:created');
      socket.off('card:updated');
      socket.off('card:moved');
      socket.off('card:deleted');
      socket.off('cards:reordered');
      socket.off('column:created');
      socket.off('column:updated');
      socket.off('column:reordered');
      socket.off('column:deleted');
      socket.off('board:updated');
    };
  }, [boardId, queryClient]);
}


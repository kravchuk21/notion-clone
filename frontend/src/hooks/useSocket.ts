import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket, connectSocket, joinBoard, leaveBoard } from '@/lib/socket';
import { QUERY_KEYS, SOCKET_EVENTS } from '@/constants';

/** All socket events that trigger board data refresh */
const BOARD_REFRESH_EVENTS = [
  SOCKET_EVENTS.CARD.CREATED,
  SOCKET_EVENTS.CARD.UPDATED,
  SOCKET_EVENTS.CARD.MOVED,
  SOCKET_EVENTS.CARD.DELETED,
  SOCKET_EVENTS.CARD.REORDERED,
  SOCKET_EVENTS.COLUMN.CREATED,
  SOCKET_EVENTS.COLUMN.UPDATED,
  SOCKET_EVENTS.COLUMN.REORDERED,
  SOCKET_EVENTS.COLUMN.DELETED,
] as const;

/**
 * Hook to subscribe to real-time board updates via Socket.io
 */
export function useSocket(boardId: string | null): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!boardId) return;

    connectSocket();
    const socket = getSocket();
    const boardQueryKey = [QUERY_KEYS.BOARDS, boardId];

    const invalidateBoard = () => {
      queryClient.invalidateQueries({ queryKey: boardQueryKey });
    };

    const handleConnect = () => {
      joinBoard(boardId);
    };

    const handleBoardUpdated = () => {
      invalidateBoard();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOARDS] });
    };

    socket.on('connect', handleConnect);

    // If already connected, join immediately
    if (socket.connected) {
      joinBoard(boardId);
    }

    // Subscribe to all board refresh events
    BOARD_REFRESH_EVENTS.forEach((event) => {
      socket.on(event, invalidateBoard);
    });

    // Board update also refreshes the boards list
    socket.on(SOCKET_EVENTS.BOARD.UPDATED, handleBoardUpdated);

    return () => {
      leaveBoard(boardId);
      socket.off('connect', handleConnect);
      BOARD_REFRESH_EVENTS.forEach((event) => {
        socket.off(event, invalidateBoard);
      });
      socket.off(SOCKET_EVENTS.BOARD.UPDATED, handleBoardUpdated);
    };
  }, [boardId, queryClient]);
}


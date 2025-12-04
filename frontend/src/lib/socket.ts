import { io, Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from '@/constants';

const DEFAULT_API_URL = 'http://localhost:5000/api';
const SOCKET_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace('/api', '');

let socket: Socket | null = null;

/**
 * Gets or creates the Socket.io client instance
 */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: false,
    });
  }
  return socket;
}

/**
 * Connects the socket if not already connected
 */
export function connectSocket(): void {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
}

/**
 * Disconnects the socket
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
  }
}

/**
 * Joins a board room for real-time updates
 */
export function joinBoard(boardId: string): void {
  const s = getSocket();
  s.emit(SOCKET_EVENTS.BOARD.JOIN, boardId);
}

/**
 * Leaves a board room
 */
export function leaveBoard(boardId: string): void {
  const s = getSocket();
  s.emit(SOCKET_EVENTS.BOARD.LEAVE, boardId);
}


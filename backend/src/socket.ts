import { Server as HTTPServer } from 'http';
import { Server } from 'socket.io';
import cookie from 'cookie';
import { verifyToken } from './utils/jwt.js';
import { env } from './config/env.js';
import { COOKIE, SOCKET_EVENTS, ERROR_MESSAGES } from './constants/index.js';

let io: Server | null = null;

/**
 * Creates board room name from board ID
 */
export function getBoardRoom(boardId: string): string {
  return `board:${boardId}`;
}

/**
 * Sets up Socket.io server with authentication
 * @param httpServer - HTTP server instance
 */
export function setupSocket(httpServer: HTTPServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: env.FRONTEND_URL,
      credentials: true,
    },
  });

  // Authentication middleware
  io.use((socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie ?? '');
      const token = cookies[COOKIE.NAME];

      if (!token) {
        return next(new Error(ERROR_MESSAGES.AUTH.AUTHENTICATION_REQUIRED));
      }

      const payload = verifyToken(token);
      socket.data.userId = payload.userId;
      socket.data.email = payload.email;
      next();
    } catch {
      next(new Error(ERROR_MESSAGES.AUTH.INVALID_TOKEN));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ Socket connected: ${socket.data.userId}`);

    socket.on(SOCKET_EVENTS.BOARD.JOIN, (boardId: string) => {
      socket.join(getBoardRoom(boardId));
      console.log(`User ${socket.data.userId} joined board:${boardId}`);
    });

    socket.on(SOCKET_EVENTS.BOARD.LEAVE, (boardId: string) => {
      socket.leave(getBoardRoom(boardId));
      console.log(`User ${socket.data.userId} left board:${boardId}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.data.userId}`);
    });
  });

  console.log('✅ Socket.io initialized');
  return io;
}

/**
 * Gets the Socket.io server instance
 * @throws Error if socket not initialized
 */
export function getIO(): Server {
  if (!io) {
    throw new Error(ERROR_MESSAGES.SOCKET.NOT_INITIALIZED);
  }
  return io;
}


import { Server as HTTPServer } from 'http';
import { Server } from 'socket.io';
import cookie from 'cookie';
import { verifyToken } from './utils/jwt.js';
import { env } from './config/env.js';

let io: Server | null = null;

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
      const cookies = cookie.parse(socket.handshake.headers.cookie || '');
      const token = cookies.token;

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const payload = verifyToken(token);
      socket.data.userId = payload.userId;
      socket.data.email = payload.email;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ Socket connected: ${socket.data.userId}`);

    // Join board room
    socket.on('board:join', (boardId: string) => {
      socket.join(`board:${boardId}`);
      console.log(`User ${socket.data.userId} joined board:${boardId}`);
    });

    // Leave board room
    socket.on('board:leave', (boardId: string) => {
      socket.leave(`board:${boardId}`);
      console.log(`User ${socket.data.userId} left board:${boardId}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.data.userId}`);
    });
  });

  console.log('✅ Socket.io initialized');
  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}


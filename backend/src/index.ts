import { createServer } from 'http';
import app from './app.js';
import { setupSocket } from './socket.js';
import { connectDatabase, disconnectDatabase } from './lib/prisma.js';
import { env } from './config/env.js';

const httpServer = createServer(app);
setupSocket(httpServer);

async function main() {
  await connectDatabase();

  httpServer.listen(env.PORT, () => {
    console.log(`
🚀 Server running on port ${env.PORT}
📊 Environment: ${env.NODE_ENV}
🔗 API: http://localhost:${env.PORT}/api
❤️  Health: http://localhost:${env.PORT}/api/health
    `);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down...');
  await disconnectDatabase();
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down...');
  await disconnectDatabase();
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});


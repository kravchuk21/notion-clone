import { Router } from 'express';
import authRoutes from './auth.routes.js';
import boardsRoutes from './boards.routes.js';
import columnsRoutes from './columns.routes.js';
import cardsRoutes from './cards.routes.js';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is healthy', timestamp: new Date().toISOString() });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/boards', boardsRoutes);
router.use('/', columnsRoutes); // /boards/:boardId/columns, /columns/:id
router.use('/', cardsRoutes);   // /columns/:columnId/cards, /cards/:id

export default router;


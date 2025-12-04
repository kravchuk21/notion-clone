import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authMiddleware } from '../middleware/auth.js';
import {
  createColumnSchema,
  updateColumnSchema,
  reorderColumnsSchema,
} from '../schemas/columns.schema.js';
import * as columnsController from '../controllers/columns.controller.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Create column in board
router.post('/boards/:boardId/columns', validate(createColumnSchema), columnsController.createColumn);

// Update column
router.put('/columns/:id', validate(updateColumnSchema), columnsController.updateColumn);

// Delete column
router.delete('/columns/:id', columnsController.deleteColumn);

// Reorder columns
router.patch('/columns/reorder', validate(reorderColumnsSchema), columnsController.reorderColumns);

export default router;


import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authMiddleware } from '../middleware/auth.js';
import {
  createCardSchema,
  updateCardSchema,
  moveCardSchema,
  reorderCardsSchema,
} from '../schemas/cards.schema.js';
import * as cardsController from '../controllers/cards.controller.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Create card in column
router.post('/columns/:columnId/cards', validate(createCardSchema), cardsController.createCard);

// Update card
router.put('/cards/:id', validate(updateCardSchema), cardsController.updateCard);

// Delete card
router.delete('/cards/:id', cardsController.deleteCard);

// Move card
router.patch('/cards/:id/move', validate(moveCardSchema), cardsController.moveCard);

// Reorder cards
router.patch('/cards/reorder', validate(reorderCardsSchema), cardsController.reorderCards);

export default router;


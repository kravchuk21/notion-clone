import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authMiddleware } from '../middleware/auth.js';
import { createBoardSchema, updateBoardSchema } from '../schemas/boards.schema.js';
import * as boardsController from '../controllers/boards.controller.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', boardsController.getBoards);
router.get('/:id', boardsController.getBoard);
router.post('/', validate(createBoardSchema), boardsController.createBoard);
router.put('/:id', validate(updateBoardSchema), boardsController.updateBoard);
router.patch('/:id/favorite', boardsController.toggleFavorite);
router.delete('/:id', boardsController.deleteBoard);

export default router;


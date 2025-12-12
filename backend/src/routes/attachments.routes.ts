import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { uploadSingle } from '../config/multer.js';
import * as attachmentsController from '../controllers/attachments.controller.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Upload attachment to card
router.post('/cards/:cardId/attachments', uploadSingle, attachmentsController.uploadAttachment);

// Get all attachments for a card
router.get('/cards/:cardId/attachments', attachmentsController.getAttachments);

// Download attachment
router.get('/attachments/:attachmentId/download', attachmentsController.downloadAttachment);

// Delete attachment
router.delete('/attachments/:attachmentId', attachmentsController.deleteAttachment);

export default router;

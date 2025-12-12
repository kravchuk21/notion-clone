import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import * as attachmentsService from '../services/attachments.service.js';
import { attachmentIdSchema, cardIdParamSchema } from '../schemas/attachments.schema.js';
import { getIO, getBoardRoom } from '../socket.js';
import { HTTP_STATUS, SOCKET_EVENTS } from '../constants/index.js';
import fs from 'fs';

/**
 * Uploads a file attachment to a card
 */
export async function uploadAttachment(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false });
      return;
    }

    const cardId = req.params.cardId;

    // Validate cardId parameter
    const cardIdValidation = cardIdParamSchema.safeParse({ cardId });
    if (!cardIdValidation.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Invalid card ID'
      });
      return;
    }

    // Check if file was uploaded
    if (!req.file) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'No file uploaded'
      });
      return;
    }

    const file = req.file;

    // Fix encoding issue - convert from latin1 to utf8 if needed
    let originalName = file.originalname;
    try {
      // Try to decode from latin1 to utf8
      const decodedName = Buffer.from(file.originalname, 'latin1').toString('utf8');
      // Check if the decoded name looks like valid UTF-8 (contains Cyrillic characters)
      if (decodedName.match(/[а-яё]/i)) {
        originalName = decodedName;
      }
    } catch (error) {
      // If decoding fails, use original name
      console.log('Encoding conversion failed, using original name');
    }

    const metadata = {
      originalName: originalName,
      mimeType: file.mimetype,
      size: file.size,
    };

    const { attachment, boardId } = await attachmentsService.createAttachment(
      cardId,
      userId,
      file,
      metadata
    );

    // Emit socket event for real-time updates
    const io = getIO();
    io.to(getBoardRoom(boardId)).emit(SOCKET_EVENTS.CARD.UPDATED, {
      id: cardId,
      attachments: await attachmentsService.getAttachments(cardId, userId),
    });

    res.status(HTTP_STATUS.CREATED).json({ success: true, data: attachment });
  } catch (error) {
    next(error);
  }
}

/**
 * Gets all attachments for a card
 */
export async function getAttachments(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false });
      return;
    }

    const cardId = req.params.cardId;

    // Validate cardId parameter
    const cardIdValidation = cardIdParamSchema.safeParse({ cardId });
    if (!cardIdValidation.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Invalid card ID'
      });
      return;
    }

    const attachments = await attachmentsService.getAttachments(cardId, userId);

    res.json({ success: true, data: attachments });
  } catch (error) {
    next(error);
  }
}

/**
 * Downloads an attachment file
 */
export async function downloadAttachment(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false });
      return;
    }

    const attachmentId = req.params.attachmentId;

    // Validate attachmentId parameter
    const attachmentIdValidation = attachmentIdSchema.safeParse({ attachmentId });
    if (!attachmentIdValidation.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Invalid attachment ID'
      });
      return;
    }

    const { attachment, filePath } = await attachmentsService.downloadAttachment(
      attachmentId,
      userId
    );

    // Set appropriate headers for file download
    res.setHeader('Content-Type', attachment.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${attachment.originalName}"`);
    res.setHeader('Content-Length', attachment.size);

    // Stream file to response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Handle stream errors
    fileStream.on('error', (error) => {
      console.error('File stream error:', error);
      if (!res.headersSent) {
        res.status(HTTP_STATUS.INTERNAL_ERROR).json({
          success: false,
          error: 'Error streaming file'
        });
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Deletes an attachment
 */
export async function deleteAttachment(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false });
      return;
    }

    const attachmentId = req.params.attachmentId;

    // Validate attachmentId parameter
    const attachmentIdValidation = attachmentIdSchema.safeParse({ attachmentId });
    if (!attachmentIdValidation.success) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Invalid attachment ID'
      });
      return;
    }

    const { boardId, cardId } = await attachmentsService.deleteAttachment(attachmentId, userId);

    // Emit socket event for real-time updates
    const io = getIO();
    io.to(getBoardRoom(boardId)).emit(SOCKET_EVENTS.CARD.UPDATED, {
      id: cardId,
      attachments: [], // Client should refetch attachments
    });

    res.json({ success: true, message: 'Attachment deleted' });
  } catch (error) {
    next(error);
  }
}

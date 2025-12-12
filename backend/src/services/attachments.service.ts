import { prisma } from '../lib/prisma.js';
import { createError } from '../middleware/errorHandler.js';
import { AttachmentMetadata } from '../schemas/attachments.schema.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';
import {
  generateUniqueFilename,
  createUploadDirectory,
  saveFile,
  deleteFile,
  fileExists,
  cleanupEmptyDirectories,
  getRelativePath,
  getAbsolutePath,
} from '../utils/fileStorage.js';

/**
 * Verifies user has access to a card and returns card and board info
 * @throws AppError if card not found or user doesn't have access
 */
async function verifyCardAccess(cardId: string, userId: string) {
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: {
      column: {
        include: { board: true },
      },
    },
  });

  if (!card || card.column.board.userId !== userId) {
    throw createError(ERROR_MESSAGES.CARD.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return {
    card,
    boardId: card.column.boardId,
  };
}

/**
 * Creates a new attachment for a card
 * @throws AppError if card not found or file operation fails
 */
export async function createAttachment(
  cardId: string,
  userId: string,
  file: Express.Multer.File,
  metadata: AttachmentMetadata
) {
  const { card, boardId } = await verifyCardAccess(cardId, userId);

  // Generate unique filename and create directory
  const filename = generateUniqueFilename(metadata.originalName, metadata.mimeType);
  const uploadDir = await createUploadDirectory(userId, cardId);

  // Save file to disk
  const filePath = await saveFile(file.buffer, uploadDir, filename);
  const relativePath = getRelativePath(filePath);

  // Create attachment record in database
  const attachment = await prisma.attachment.create({
    data: {
      filename,
      originalName: metadata.originalName,
      mimeType: metadata.mimeType,
      size: metadata.size,
      path: relativePath,
      cardId,
      userId,
    },
  });

  return {
    attachment,
    boardId,
  };
}

/**
 * Gets all attachments for a card
 * @throws AppError if card not found or user doesn't have access
 */
export async function getAttachments(cardId: string, userId: string) {
  await verifyCardAccess(cardId, userId);

  const attachments = await prisma.attachment.findMany({
    where: { cardId },
    orderBy: { createdAt: 'desc' },
  });

  return attachments;
}

/**
 * Gets a single attachment by ID
 * @throws AppError if attachment not found or user doesn't have access
 */
export async function getAttachment(attachmentId: string, userId: string) {
  const attachment = await prisma.attachment.findUnique({
    where: { id: attachmentId },
    include: {
      card: {
        include: {
          column: {
            include: { board: true },
          },
        },
      },
    },
  });

  if (!attachment || attachment.card.column.board.userId !== userId) {
    throw createError(ERROR_MESSAGES.ATTACHMENT.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return attachment;
}

/**
 * Deletes an attachment
 * @throws AppError if attachment not found or user doesn't have access
 */
export async function deleteAttachment(attachmentId: string, userId: string) {
  const attachment = await getAttachment(attachmentId, userId);

  // Delete file from disk
  const absolutePath = getAbsolutePath(attachment.path);
  await deleteFile(absolutePath);

  // Delete attachment record from database
  await prisma.attachment.delete({
    where: { id: attachmentId },
  });

  // Clean up empty directories
  const uploadDir = absolutePath.split('/').slice(0, -1).join('/');
  await cleanupEmptyDirectories(uploadDir);

  return {
    boardId: attachment.card.column.boardId,
    cardId: attachment.cardId,
  };
}

/**
 * Downloads an attachment file
 * @throws AppError if attachment not found or user doesn't have access
 */
export async function downloadAttachment(attachmentId: string, userId: string) {
  const attachment = await getAttachment(attachmentId, userId);

  const absolutePath = getAbsolutePath(attachment.path);
  const exists = await fileExists(absolutePath);

  if (!exists) {
    throw createError('File not found on disk', HTTP_STATUS.NOT_FOUND);
  }

  return {
    attachment,
    filePath: absolutePath,
  };
}

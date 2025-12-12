import { z } from 'zod';

export const attachmentIdSchema = z.object({
  attachmentId: z.string().min(1),
});

export const cardIdParamSchema = z.object({
  cardId: z.string().min(1),
});

// For file upload validation (handled by multer, but we can validate metadata)
export const attachmentMetadataSchema = z.object({
  originalName: z.string().min(1, 'Original filename is required'),
  mimeType: z.string().min(1, 'MIME type is required'),
  size: z.number().int().positive('File size must be positive'),
});

export type AttachmentMetadata = z.infer<typeof attachmentMetadataSchema>;

import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES_COUNT: 5, // Maximum 5 files per upload
} as const;

// Allowed file types
export const ALLOWED_MIME_TYPES = [
  // Images
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/csv',
  'application/rtf',
  // Spreadsheets
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // Presentations
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  // Archives
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
] as const;

// File extension mapping for validation
export const MIME_TYPE_EXTENSIONS: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'image/svg+xml': ['.svg'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
  'text/csv': ['.csv'],
  'application/rtf': ['.rtf'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'application/zip': ['.zip'],
  'application/x-rar-compressed': ['.rar'],
  'application/x-7z-compressed': ['.7z'],
};

// Custom file filter
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype as any)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`));
  }
};

// Storage configuration - files are temporarily stored, then moved by our service
const storage = multer.memoryStorage();

// Create multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: FILE_SIZE_LIMITS.MAX_FILE_SIZE,
    files: FILE_SIZE_LIMITS.MAX_FILES_COUNT,
  },
});

// Single file upload middleware
export const uploadSingle = upload.single('file');

// Multiple files upload middleware
export const uploadMultiple = upload.array('files', FILE_SIZE_LIMITS.MAX_FILES_COUNT);

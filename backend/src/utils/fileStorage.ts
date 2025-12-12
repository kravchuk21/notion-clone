import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { MIME_TYPE_EXTENSIONS } from '../config/multer.js';

// Base directory for file uploads
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Generate unique filename to prevent conflicts
export function generateUniqueFilename(originalName: string, mimeType: string): string {
  const extension = getFileExtension(originalName, mimeType);
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  return `${timestamp}-${random}${extension}`;
}

// Get file extension from original name or mime type
export function getFileExtension(originalName: string, mimeType: string): string {
  // Try to get extension from original filename first
  const originalExt = path.extname(originalName).toLowerCase();
  if (originalExt) {
    return originalExt;
  }

  // Fallback to mime type mapping
  const extensions = MIME_TYPE_EXTENSIONS[mimeType];
  return extensions ? extensions[0] : '';
}

// Create directory structure for user/card
export async function createUploadDirectory(userId: string, cardId: string): Promise<string> {
  const userDir = path.join(UPLOADS_DIR, userId);
  const cardDir = path.join(userDir, cardId);

  try {
    await fs.mkdir(cardDir, { recursive: true });
    return cardDir;
  } catch (error) {
    throw new Error(`Failed to create upload directory: ${error}`);
  }
}

// Save file buffer to disk
export async function saveFile(
  buffer: Buffer,
  directory: string,
  filename: string
): Promise<string> {
  const filePath = path.join(directory, filename);

  try {
    await fs.writeFile(filePath, buffer);
    return filePath;
  } catch (error) {
    throw new Error(`Failed to save file: ${error}`);
  }
}

// Delete file from disk
export async function deleteFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    // Don't throw if file doesn't exist
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw new Error(`Failed to delete file: ${error}`);
    }
  }
}

// Check if file exists
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Get file stats
export async function getFileStats(filePath: string): Promise<fs.Stats> {
  try {
    return await fs.stat(filePath);
  } catch (error) {
    throw new Error(`Failed to get file stats: ${error}`);
  }
}

// Clean up empty directories (recursive)
export async function cleanupEmptyDirectories(dirPath: string): Promise<void> {
  try {
    const items = await fs.readdir(dirPath);

    if (items.length === 0) {
      await fs.rmdir(dirPath);

      // Try to clean up parent directories
      const parentDir = path.dirname(dirPath);
      if (parentDir !== UPLOADS_DIR) {
        await cleanupEmptyDirectories(parentDir);
      }
    }
  } catch (error) {
    // Ignore errors during cleanup
    console.warn(`Failed to cleanup directory ${dirPath}:`, error);
  }
}

// Get relative path from uploads directory
export function getRelativePath(absolutePath: string): string {
  return path.relative(UPLOADS_DIR, absolutePath);
}

// Get absolute path from relative path
export function getAbsolutePath(relativePath: string): string {
  return path.join(UPLOADS_DIR, relativePath);
}

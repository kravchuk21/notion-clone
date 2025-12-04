import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * Custom application error with HTTP status code
 */
export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

/**
 * Global error handler middleware
 * Formats errors and sends appropriate response
 */
export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode ?? HTTP_STATUS.INTERNAL_ERROR;
  const message = err.isOperational ? err.message : 'Internal server error';

  if (env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

/**
 * Handler for 404 Not Found routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
  });
}

/**
 * Factory function to create operational errors
 * @param message - Error message
 * @param statusCode - HTTP status code
 */
export function createError(message: string, statusCode: number): AppError {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}


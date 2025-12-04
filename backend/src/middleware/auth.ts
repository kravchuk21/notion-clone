import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { COOKIE_NAME } from '../config/cookie.js';
import { AuthenticatedRequest } from '../types/index.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';

/**
 * Authentication middleware
 * Verifies JWT token from cookies and attaches user to request
 */
export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const token = req.cookies[COOKIE_NAME];

    if (!token) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: ERROR_MESSAGES.AUTH.AUTHENTICATION_REQUIRED,
      });
      return;
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: ERROR_MESSAGES.AUTH.INVALID_TOKEN,
    });
  }
}


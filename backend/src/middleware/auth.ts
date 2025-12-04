import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { COOKIE_NAME } from '../config/cookie.js';
import { AuthenticatedRequest } from '../types/index.js';

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const token = req.cookies[COOKIE_NAME];

    if (!token) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}


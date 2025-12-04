import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { cookieConfig, COOKIE_NAME } from '../config/cookie.js';
import * as authService from '../services/auth.service.js';
import { RegisterInput, LoginInput } from '../schemas/auth.schema.js';

export async function register(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input: RegisterInput = req.body;
    const { user, token } = await authService.registerUser(input);

    res.cookie(COOKIE_NAME, token, cookieConfig);
    res.status(201).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input: LoginInput = req.body;
    const { user, token } = await authService.loginUser(input);

    res.cookie(COOKIE_NAME, token, cookieConfig);
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
}

export async function logout(
  _req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ success: true, message: 'Logged out successfully' });
}

export async function me(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const user = await authService.getCurrentUser(req.user.userId);
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
}


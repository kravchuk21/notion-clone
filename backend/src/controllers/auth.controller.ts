import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { cookieConfig, COOKIE_NAME } from '../config/cookie.js';
import * as authService from '../services/auth.service.js';
import { RegisterInput, LoginInput, UpdateProfileInput } from '../schemas/auth.schema.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';

/**
 * Handles user registration
 */
export async function register(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input: RegisterInput = req.body;
    const { user, token } = await authService.registerUser(input);

    res.cookie(COOKIE_NAME, token, cookieConfig);
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
}

/**
 * Handles user login
 */
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

/**
 * Handles user logout
 */
export async function logout(
  _req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ success: true, message: 'Logged out successfully' });
}

/**
 * Gets current authenticated user
 */
export async function me(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED,
      });
      return;
    }

    const user = await authService.getCurrentUser(req.user.userId);
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
}

/**
 * Gets user profile
 */
export async function getProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED,
      });
      return;
    }

    const user = await authService.getUserProfile(req.user.userId);
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
}

/**
 * Updates user profile
 */
export async function updateProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED,
      });
      return;
    }

    const input: UpdateProfileInput = req.body;
    const user = await authService.updateUserProfile(req.user.userId, input);
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
}


import { CookieOptions } from 'express';
import { env } from './env.js';

export const cookieConfig: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  path: '/',
};

export const COOKIE_NAME = 'token';


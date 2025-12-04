import { CookieOptions } from 'express';
import { env } from './env.js';
import { COOKIE } from '../constants/index.js';

export const cookieConfig: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: COOKIE.MAX_AGE_MS,
  path: '/',
};

export const COOKIE_NAME = COOKIE.NAME;


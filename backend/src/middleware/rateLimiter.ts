import rateLimit from 'express-rate-limit';
import { RATE_LIMIT, ERROR_MESSAGES } from '../constants/index.js';

export const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT.API.WINDOW_MS,
  max: RATE_LIMIT.API.MAX_REQUESTS,
  message: {
    success: false,
    error: ERROR_MESSAGES.RATE_LIMIT.TOO_MANY_REQUESTS,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: RATE_LIMIT.AUTH.WINDOW_MS,
  max: RATE_LIMIT.AUTH.MAX_ATTEMPTS,
  message: {
    success: false,
    error: ERROR_MESSAGES.RATE_LIMIT.TOO_MANY_LOGIN_ATTEMPTS,
  },
  standardHeaders: true,
  legacyHeaders: false,
});


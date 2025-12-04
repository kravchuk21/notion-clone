/**
 * Application-wide constants
 */

/** Default columns created with new boards */
export const DEFAULT_BOARD_COLUMNS = ['To Do', 'In Progress', 'Done'] as const;

/** Rate limiting configuration */
export const RATE_LIMIT = {
  API: {
    WINDOW_MS: 60 * 1000, // 1 minute
    MAX_REQUESTS: 100,
  },
  AUTH: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_ATTEMPTS: 10,
  },
} as const;

/** Cookie configuration */
export const COOKIE = {
  NAME: 'token',
  MAX_AGE_MS: 24 * 60 * 60 * 1000, // 24 hours
} as const;

/** HTTP status codes used in the application */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const;

/** Error messages */
export const ERROR_MESSAGES = {
  AUTH: {
    EMAIL_EXISTS: 'Email already registered',
    INVALID_CREDENTIALS: 'Invalid credentials',
    NOT_AUTHENTICATED: 'Not authenticated',
    AUTHENTICATION_REQUIRED: 'Authentication required',
    INVALID_TOKEN: 'Invalid or expired token',
  },
  BOARD: {
    NOT_FOUND: 'Board not found',
  },
  COLUMN: {
    NOT_FOUND: 'Column not found',
  },
  CARD: {
    NOT_FOUND: 'Card not found',
  },
  USER: {
    NOT_FOUND: 'User not found',
  },
  VALIDATION: {
    FAILED: 'Validation failed',
    INVALID_PARAMS: 'Invalid parameters',
  },
  RATE_LIMIT: {
    TOO_MANY_REQUESTS: 'Too many requests, please try again later',
    TOO_MANY_LOGIN_ATTEMPTS: 'Too many login attempts, please try again later',
  },
  SOCKET: {
    NOT_INITIALIZED: 'Socket.io not initialized',
  },
} as const;

/** Socket event names */
export const SOCKET_EVENTS = {
  BOARD: {
    JOIN: 'board:join',
    LEAVE: 'board:leave',
    UPDATED: 'board:updated',
  },
  COLUMN: {
    CREATED: 'column:created',
    UPDATED: 'column:updated',
    REORDERED: 'column:reordered',
    DELETED: 'column:deleted',
  },
  CARD: {
    CREATED: 'card:created',
    UPDATED: 'card:updated',
    MOVED: 'card:moved',
    DELETED: 'card:deleted',
    REORDERED: 'cards:reordered',
  },
} as const;


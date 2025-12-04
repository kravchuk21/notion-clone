/**
 * Application-wide constants
 */

/** React Query cache keys */
export const QUERY_KEYS = {
  BOARDS: 'boards',
} as const;

/** Query stale times in milliseconds */
export const STALE_TIMES = {
  BOARDS_LIST: 5 * 60 * 1000, // 5 minutes
  BOARD_DETAIL: 1 * 60 * 1000, // 1 minute
} as const;

/** Socket event names - must match backend */
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
    ARCHIVED: 'card:archived',
    RESTORED: 'card:restored',
  },
} as const;

/** Toast notification settings */
export const TOAST = {
  DURATION_MS: 3000,
} as const;

/** Drag and drop settings */
export const DND = {
  ACTIVATION_DISTANCE: 8,
} as const;

/** Success messages */
export const SUCCESS_MESSAGES = {
  BOARD: {
    CREATED: 'Доска создана',
    UPDATED: 'Доска обновлена',
    DELETED: 'Доска удалена',
  },
  COLUMN: {
    CREATED: 'Колонка создана',
    DELETED: 'Колонка удалена',
  },
  CARD: {
    CREATED: 'Карточка создана',
    DELETED: 'Карточка удалена',
    ARCHIVED: 'Карточка перемещена в архив',
    RESTORED: 'Карточка восстановлена',
  },
  AUTH: {
    WELCOME: 'Добро пожаловать!',
    ACCOUNT_CREATED: 'Аккаунт создан!',
  },
} as const;


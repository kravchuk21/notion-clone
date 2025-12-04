export const CARD_VIEW = {
  PANEL: {
    MIN_WIDTH: 320,
    MAX_WIDTH: 800,
    DEFAULT_WIDTH: 420,
  },
  HISTORY: {
    MAX_ENTRIES: 50,
  },
  HOTKEYS: {
    CLOSE: 'Escape',
    EDIT: 'e',
    SAVE: 'mod+Enter',
    BACK: 'mod+[',
    FORWARD: 'mod+]',
    TOGGLE_MODE: 'm',
    PREV_CARD: 'ArrowUp',
    NEXT_CARD: 'ArrowDown',
  },
  LOCAL_STORAGE_KEY: 'card-view-preferences',
} as const;

export type ViewMode = 'peek' | 'modal';


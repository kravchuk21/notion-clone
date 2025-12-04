import { create } from 'zustand';
import type { Priority } from '@/types';

interface FilterState {
  searchQuery: string;
  priorities: Priority[];
  tags: string[];
  showOverdue: boolean;
  hasDeadline: boolean | null;

  setSearchQuery: (query: string) => void;
  togglePriority: (priority: Priority) => void;
  toggleTag: (tag: string) => void;
  setShowOverdue: (show: boolean) => void;
  setHasDeadline: (has: boolean | null) => void;
  resetFilters: () => void;
  hasActiveFilters: () => boolean;
}

const initialState = {
  searchQuery: '',
  priorities: [] as Priority[],
  tags: [] as string[],
  showOverdue: false,
  hasDeadline: null as boolean | null,
};

export const useFilterStore = create<FilterState>((set, get) => ({
  ...initialState,

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  togglePriority: (priority) => {
    const priorities = get().priorities;
    if (priorities.includes(priority)) {
      set({ priorities: priorities.filter((p) => p !== priority) });
    } else {
      set({ priorities: [...priorities, priority] });
    }
  },

  toggleTag: (tag) => {
    const tags = get().tags;
    if (tags.includes(tag)) {
      set({ tags: tags.filter((t) => t !== tag) });
    } else {
      set({ tags: [...tags, tag] });
    }
  },

  setShowOverdue: (showOverdue) => set({ showOverdue }),

  setHasDeadline: (hasDeadline) => set({ hasDeadline }),

  resetFilters: () => set(initialState),

  hasActiveFilters: () => {
    const state = get();
    return (
      state.searchQuery !== '' ||
      state.priorities.length > 0 ||
      state.tags.length > 0 ||
      state.showOverdue ||
      state.hasDeadline !== null
    );
  },
}));


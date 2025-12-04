import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CARD_VIEW, type ViewMode } from '@/constants/cardView';

interface CardViewState {
  // Current card
  selectedCardId: string | null;
  
  // View preferences (persisted)
  viewMode: ViewMode;
  isEditing: boolean;
  
  // Panel state (persisted)
  panelWidth: number;
  
  // Actions
  openCard: (cardId: string) => void;
  closeCard: () => void;
  toggleEditMode: () => void;
  setEditMode: (editing: boolean) => void;
  setViewMode: (mode: ViewMode) => void;
  setPanelWidth: (width: number) => void;
}

export const useCardViewStore = create<CardViewState>()(
  persist(
    (set) => ({
      // Initial state
      selectedCardId: null,
      viewMode: 'peek',
      isEditing: false,
      panelWidth: CARD_VIEW.PANEL.DEFAULT_WIDTH,

      openCard: (cardId: string) => {
        set({
          selectedCardId: cardId,
          isEditing: false,
        });
      },

      closeCard: () => {
        set({
          selectedCardId: null,
          isEditing: false,
        });
      },

      toggleEditMode: () => {
        set((state) => ({ isEditing: !state.isEditing }));
      },

      setEditMode: (editing: boolean) => {
        set({ isEditing: editing });
      },

      setViewMode: (mode: ViewMode) => {
        set({ viewMode: mode });
      },

      setPanelWidth: (width: number) => {
        const clampedWidth = Math.min(
          Math.max(width, CARD_VIEW.PANEL.MIN_WIDTH),
          CARD_VIEW.PANEL.MAX_WIDTH
        );
        set({ panelWidth: clampedWidth });
      },
    }),
    {
      name: CARD_VIEW.LOCAL_STORAGE_KEY,
      partialize: (state) => ({
        viewMode: state.viewMode,
        panelWidth: state.panelWidth,
      }),
    }
  )
);

import { useEffect, useCallback } from 'react';
import { useCardViewStore } from '@/store/cardViewStore';

function isInputFocused(): boolean {
  const activeElement = document.activeElement;
  if (!activeElement) return false;
  
  const tagName = activeElement.tagName.toLowerCase();
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    (activeElement as HTMLElement).isContentEditable
  );
}

interface UseCardHotkeysOptions {
  onSave?: () => void;
  onNavigateCard?: (direction: 'up' | 'down') => void;
  enabled?: boolean;
}

export function useCardHotkeys(options: UseCardHotkeysOptions = {}) {
  const { onSave, onNavigateCard, enabled = true } = options;
  
  const {
    selectedCardId,
    isEditing,
    toggleEditMode,
    setEditMode,
    closeCard,
    setViewMode,
    viewMode,
  } = useCardViewStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled || !selectedCardId) return;

      const isMod = e.metaKey || e.ctrlKey;

      // Esc - close card or exit edit mode
      if (e.key === 'Escape') {
        e.preventDefault();
        if (isEditing) {
          setEditMode(false);
        } else {
          closeCard();
        }
        return;
      }

      // E - toggle edit (only when not in input)
      if (e.key === 'e' && !isEditing && !isInputFocused() && !isMod) {
        e.preventDefault();
        toggleEditMode();
        return;
      }

      // Cmd/Ctrl + Enter - save
      if (e.key === 'Enter' && isMod && isEditing) {
        e.preventDefault();
        onSave?.();
        return;
      }

      // M - toggle modal/panel (when not in input)
      if (e.key === 'm' && !isInputFocused() && !isMod) {
        e.preventDefault();
        setViewMode(viewMode === 'peek' ? 'modal' : 'peek');
        return;
      }

      // Arrow navigation (when not in input)
      if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !isInputFocused() && !isMod) {
        e.preventDefault();
        onNavigateCard?.(e.key === 'ArrowUp' ? 'up' : 'down');
        return;
      }
    },
    [
      enabled,
      selectedCardId,
      isEditing,
      toggleEditMode,
      setEditMode,
      closeCard,
      setViewMode,
      viewMode,
      onSave,
      onNavigateCard,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

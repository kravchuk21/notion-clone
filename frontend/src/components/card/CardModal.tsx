import { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PanelRight, Archive, Trash2 } from 'lucide-react';
import type { UpdateCardInput, BoardWithDetails } from '@/types';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { CardViewMode } from './CardViewMode';
import { CardEditMode } from './CardEditMode';
import { CardViewToggle } from './CardViewToggle';
import { useCardViewStore } from '@/store/cardViewStore';
import { useCardHotkeys } from '@/hooks/useCardHotkeys';
import { modalBackdropVariants, modalContentVariants } from '@/lib/motion';
import { cn } from '@/utils/cn';

interface CardModalProps {
  board: BoardWithDetails;
  onUpdate: (id: string, data: UpdateCardInput) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
  isArchiving?: boolean;
}

export function CardModal({
  board,
  onUpdate,
  onDelete,
  onArchive,
  isUpdating,
  isDeleting,
  isArchiving,
}: CardModalProps) {
  const {
    selectedCardId,
    isEditing,
    setEditMode,
    closeCard,
    setViewMode,
  } = useCardViewStore();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Find selected card and its column
  const { card, columnTitle } = useMemo(() => {
    if (!selectedCardId) return { card: null, columnTitle: undefined };
    
    for (const column of board.columns) {
      const foundCard = column.cards.find((c) => c.id === selectedCardId);
      if (foundCard) {
        return { card: foundCard, columnTitle: column.title };
      }
    }
    return { card: null, columnTitle: undefined };
  }, [board.columns, selectedCardId]);

  // Get all card IDs for navigation
  const allCardIds = useMemo(() => {
    return board.columns.flatMap((col) => col.cards.map((c) => c.id));
  }, [board.columns]);

  // Navigate to adjacent card
  const navigateCard = useCallback(
    (direction: 'up' | 'down') => {
      if (!selectedCardId) return;
      const currentIndex = allCardIds.indexOf(selectedCardId);
      if (currentIndex === -1) return;

      const newIndex =
        direction === 'up'
          ? Math.max(0, currentIndex - 1)
          : Math.min(allCardIds.length - 1, currentIndex + 1);

      if (newIndex !== currentIndex) {
        useCardViewStore.getState().openCard(allCardIds[newIndex]);
      }
    },
    [selectedCardId, allCardIds]
  );

  // Handle save
  const handleSave = useCallback(() => {
    setEditMode(false);
  }, [setEditMode]);

  // Hotkeys
  useCardHotkeys({
    onSave: handleSave,
    onNavigateCard: navigateCard,
    enabled: !!selectedCardId,
  });

  // Handle update from edit mode
  const handleUpdate = useCallback(
    (data: UpdateCardInput) => {
      if (card) {
        onUpdate(card.id, data);
        setEditMode(false);
      }
    },
    [card, onUpdate, setEditMode]
  );

  // Handle delete
  const handleDelete = useCallback(() => {
    if (card) {
      onDelete(card.id);
      setShowDeleteConfirm(false);
      closeCard();
    }
  }, [card, onDelete, closeCard]);

  // Handle archive
  const handleArchive = useCallback(() => {
    if (card) {
      onArchive(card.id);
      closeCard();
    }
  }, [card, onArchive, closeCard]);

  const isOpen = !!selectedCardId && !!card;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={modalBackdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-0 z-50 bg-black/50"
              onClick={closeCard}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                variants={modalContentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={cn(
                  'w-full max-w-2xl bg-bg-primary rounded-lg shadow-notion-xl pointer-events-auto',
                  'max-h-[90vh] overflow-hidden flex flex-col'
                )}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header with View/Edit Toggle */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-border shrink-0">
                  <CardViewToggle
                    isEditing={isEditing}
                    onToggle={() => setEditMode(!isEditing)}
                  />
                  
                  <div className="flex items-center gap-1">
                    {/* Switch to panel */}
                    <button
                      type="button"
                      onClick={() => setViewMode('peek')}
                      className="hidden md:flex p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
                      title="Открыть как панель (M)"
                    >
                      <PanelRight size={16} />
                    </button>

                    {/* Close */}
                    <button
                      type="button"
                      onClick={closeCard}
                      className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
                      title="Закрыть (Esc)"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {isEditing ? (
                    <CardEditMode
                      card={card}
                      onSave={handleUpdate}
                      onCancel={() => setEditMode(false)}
                      isLoading={isUpdating}
                    />
                  ) : (
                    <CardViewMode card={card} columnTitle={columnTitle} />
                  )}
                </div>

                {/* Footer actions (only in view mode) */}
                {!isEditing && (
                  <div className="px-6 py-4 border-t border-border flex items-center gap-2 shrink-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleArchive}
                      isLoading={isArchiving}
                    >
                      <Archive size={14} />
                      В архив
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-priority-high hover:bg-priority-high/10"
                    >
                      <Trash2 size={14} />
                      Удалить
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Удалить карточку?"
        message="Это действие нельзя отменить. Карточка будет удалена навсегда."
        confirmText="Удалить"
        isLoading={isDeleting}
      />
    </>
  );
}

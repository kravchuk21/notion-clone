import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Archive, Trash2 } from 'lucide-react';
import type { UpdateCardInput, BoardWithDetails } from '@/types';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { CardViewMode } from './CardViewMode';
import { CardEditMode } from './CardEditMode';
import { CardViewToggle } from './CardViewToggle';
import { useCardViewStore } from '@/store/cardViewStore';
import { useResizable } from '@/hooks/useResizable';
import { useCardHotkeys } from '@/hooks/useCardHotkeys';
import { sidePanelVariants, sidePanelBackdropVariants } from '@/lib/motion';
import { cn } from '@/utils/cn';
import { CARD_VIEW } from '@/constants/cardView';
import { useState, useCallback } from 'react';

interface CardPeekPanelProps {
  board: BoardWithDetails;
  onUpdate: (id: string, data: UpdateCardInput) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
  isArchiving?: boolean;
}

export function CardPeekPanel({
  board,
  onUpdate,
  onDelete,
  onArchive,
  isUpdating,
  isDeleting,
  isArchiving,
}: CardPeekPanelProps) {
  const {
    selectedCardId,
    isEditing,
    setEditMode,
    closeCard,
    panelWidth,
    setPanelWidth,
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

  // Resizable panel (only on desktop)
  const { width, isResizing, startResize } = useResizable({
    minWidth: CARD_VIEW.PANEL.MIN_WIDTH,
    maxWidth: CARD_VIEW.PANEL.MAX_WIDTH,
    defaultWidth: panelWidth,
    onWidthChange: setPanelWidth,
    direction: 'left',
  });

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
              variants={sidePanelBackdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-0 z-40 bg-black/30 md:bg-black/20 lg:bg-transparent"
              onClick={closeCard}
            />

            {/* Panel - fullscreen on mobile, side panel on desktop */}
            <motion.div
              variants={sidePanelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? width : undefined }}
              className={cn(
                'fixed z-50 bg-bg-primary shadow-notion-xl border-l border-border flex flex-col',
                // Mobile: fullscreen
                'inset-0 top-0',
                // Tablet: right side, wider
                'md:left-auto md:right-0 md:top-14 md:w-[420px]',
                // Desktop: resizable side panel
                'lg:top-14',
                isResizing && 'select-none'
              )}
            >
              {/* Resize handle - only on desktop */}
              <div
                onMouseDown={startResize}
                className={cn(
                  'absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hidden lg:block',
                  'hover:bg-accent/50 transition-colors',
                  isResizing && 'bg-accent'
                )}
              />

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                {/* Title on mobile */}
                <h2 className="text-base font-semibold text-text-primary truncate md:hidden">
                  {card.title}
                </h2>
                
                <div className="flex items-center gap-1 ml-auto">
                  {/* Expand to modal - hide on mobile */}
                  <button
                    type="button"
                    onClick={() => setViewMode('modal')}
                    className="hidden md:flex p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
                    title="Открыть как модал (M)"
                  >
                    <Maximize2 size={16} />
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

              {/* View/Edit Toggle */}
              <div className="px-4 py-3 border-b border-border">
                <CardViewToggle
                  isEditing={isEditing}
                  onToggle={() => setEditMode(!isEditing)}
                />
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
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
                <div className="px-4 py-3 border-t border-border flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleArchive}
                    isLoading={isArchiving}
                    className="flex-1 md:flex-none"
                  >
                    <Archive size={14} />
                    <span className="hidden xs:inline">В архив</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-priority-high hover:bg-priority-high/10 flex-1 md:flex-none"
                  >
                    <Trash2 size={14} />
                    <span className="hidden xs:inline">Удалить</span>
                  </Button>
                </div>
              )}
            </motion.div>
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

import { motion, AnimatePresence } from 'framer-motion';
import { X, Archive, RotateCcw, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Skeleton } from '@/components/ui/Skeleton';
import { useArchivedCards, useRestoreCard, usePermanentDeleteCard } from '@/hooks/useCards';
import { formatDeadline, isOverdue } from '@/utils/date';
import { PRIORITY_LABELS } from '@/utils/constants';
import { useState } from 'react';
import type { ArchivedCard } from '@/types';

export interface ArchivedCardsDrawerProps {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ArchivedCardsDrawer({ boardId, isOpen, onClose }: ArchivedCardsDrawerProps) {
  const { data: archivedCards, isLoading } = useArchivedCards(boardId);
  const restoreCard = useRestoreCard(boardId);
  const permanentDeleteCard = usePermanentDeleteCard(boardId);
  const [cardToDelete, setCardToDelete] = useState<ArchivedCard | null>(null);

  const handleRestore = async (cardId: string) => {
    await restoreCard.mutateAsync(cardId);
  };

  const handlePermanentDelete = async () => {
    if (cardToDelete) {
      await permanentDeleteCard.mutateAsync(cardToDelete.id);
      setCardToDelete(null);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/30"
              onClick={onClose}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-bg-primary shadow-notion-xl border-l border-border flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Archive size={20} className="text-text-secondary" />
                  <h2 className="text-lg font-semibold text-text-primary">Архив</h2>
                  {archivedCards && archivedCards.length > 0 && (
                    <span className="text-sm text-text-tertiary">
                      ({archivedCards.length})
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-md hover:bg-bg-hover transition-colors text-text-secondary hover:text-text-primary"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-24 rounded-lg" />
                    ))}
                  </div>
                ) : archivedCards && archivedCards.length > 0 ? (
                  <div className="space-y-3">
                    {archivedCards.map((card) => (
                      <ArchivedCardItem
                        key={card.id}
                        card={card}
                        onRestore={handleRestore}
                        onDelete={() => setCardToDelete(card)}
                        isRestoring={restoreCard.isPending}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <Archive size={48} className="text-text-tertiary mb-4" />
                    <p className="text-text-secondary">Архив пуст</p>
                    <p className="text-sm text-text-tertiary mt-1">
                      Архивированные карточки появятся здесь
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={!!cardToDelete}
        onClose={() => setCardToDelete(null)}
        onConfirm={handlePermanentDelete}
        title="Удалить навсегда?"
        message={`Карточка "${cardToDelete?.title}" будет удалена безвозвратно.`}
        confirmText="Удалить навсегда"
        isLoading={permanentDeleteCard.isPending}
      />
    </>
  );
}

interface ArchivedCardItemProps {
  card: ArchivedCard;
  onRestore: (id: string) => void;
  onDelete: () => void;
  isRestoring: boolean;
}

function ArchivedCardItem({ card, onRestore, onDelete, isRestoring }: ArchivedCardItemProps) {
  const priorityVariant = `priority-${card.priority.toLowerCase()}` as 'priority-high' | 'priority-medium' | 'priority-low';
  const hasDeadline = !!card.deadline;
  const deadlineOverdue = hasDeadline && isOverdue(card.deadline!);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-3 rounded-lg border border-border bg-bg-secondary"
    >
      {/* Column badge */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-text-tertiary px-2 py-0.5 bg-bg-hover rounded">
          {card.column.title}
        </span>
        <Badge variant={priorityVariant} className="text-xs">
          {PRIORITY_LABELS[card.priority]}
        </Badge>
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium text-text-primary mb-1 line-clamp-2">
        {card.title}
      </h4>

      {/* Description */}
      {card.description && (
        <p className="text-xs text-text-secondary mb-2 line-clamp-2">
          {card.description}
        </p>
      )}

      {/* Deadline */}
      {hasDeadline && (
        <p className={cn(
          'text-xs mb-2',
          deadlineOverdue ? 'text-priority-high' : 'text-text-tertiary'
        )}>
          Дедлайн: {formatDeadline(card.deadline!)}
        </p>
      )}

      {/* Archived date */}
      {card.archivedAt && (
        <p className="text-xs text-text-tertiary mb-3">
          Архивирована: {new Date(card.archivedAt).toLocaleDateString('ru-RU')}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onRestore(card.id)}
          disabled={isRestoring}
          className="flex-1"
        >
          <RotateCcw size={14} />
          Восстановить
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          className="text-priority-high hover:bg-priority-high/10"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </motion.div>
  );
}


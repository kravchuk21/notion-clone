import { useState, useMemo } from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ColumnWithCards, Card as CardType, UpdateCardInput } from '@/types';
import { ColumnHeader } from './ColumnHeader';
import { Card } from '@/components/card/Card';
import { CardModal } from '@/components/card/CardModal';
import { AddCard } from '@/components/card/AddCard';
import { useFilterStore } from '@/store/filterStore';
import { isOverdue } from '@/utils/date';
import { cn } from '@/utils/cn';

interface ColumnProps {
  column: ColumnWithCards;
  onUpdateColumn: (id: string, title: string) => void;
  onDeleteColumn: (id: string) => void;
  onCreateCard: (columnId: string, title: string) => void;
  onUpdateCard: (id: string, data: UpdateCardInput) => void;
  onDeleteCard: (id: string) => void;
  isCreatingCard?: boolean;
  isUpdatingCard?: boolean;
  isDeletingCard?: boolean;
}

export function Column({
  column,
  onUpdateColumn,
  onDeleteColumn,
  onCreateCard,
  onUpdateCard,
  onDeleteCard,
  isCreatingCard,
  isUpdatingCard,
  isDeletingCard,
}: ColumnProps) {
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  const { searchQuery, priorities, tags, showOverdue, hasDeadline } = useFilterStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Filter cards
  const filteredCards = useMemo(() => {
    return column.cards.filter((card) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = card.title.toLowerCase().includes(query);
        const matchesDesc = card.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Priority filter
      if (priorities.length > 0 && !priorities.includes(card.priority)) {
        return false;
      }

      // Tags filter
      if (tags.length > 0 && !tags.some((t) => card.tags.includes(t))) {
        return false;
      }

      // Overdue filter
      if (showOverdue && (!card.deadline || !isOverdue(card.deadline))) {
        return false;
      }

      // Has deadline filter
      if (hasDeadline === true && !card.deadline) return false;
      if (hasDeadline === false && card.deadline) return false;

      return true;
    });
  }, [column.cards, searchQuery, priorities, tags, showOverdue, hasDeadline]);

  const cardIds = useMemo(() => filteredCards.map((c) => c.id), [filteredCards]);

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'flex-shrink-0 w-72 bg-bg-secondary rounded-lg flex flex-col max-h-[calc(100vh-10rem)]',
          isDragging && 'opacity-50'
        )}
      >
        {/* Header - draggable */}
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <ColumnHeader
            title={column.title}
            cardCount={filteredCards.length}
            totalCount={column.cards.length}
            onUpdate={(title) => onUpdateColumn(column.id, title)}
            onDelete={() => onDeleteColumn(column.id)}
          />
        </div>

        {/* Cards */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
            {filteredCards.map((card) => (
              <Card
                key={card.id}
                card={card}
                onClick={() => setSelectedCard(card)}
              />
            ))}
          </SortableContext>
        </div>

        {/* Add card */}
        <div className="p-2 border-t border-border/50">
          <AddCard
            onAdd={(title) => onCreateCard(column.id, title)}
            isLoading={isCreatingCard}
          />
        </div>
      </div>

      {/* Card modal */}
      <CardModal
        card={selectedCard}
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        onUpdate={onUpdateCard}
        onDelete={onDeleteCard}
        isUpdating={isUpdatingCard}
        isDeleting={isDeletingCard}
      />
    </>
  );
}


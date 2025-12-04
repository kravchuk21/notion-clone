import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Tag } from 'lucide-react';
import type { Card as CardType } from '@/types';
import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/Badge';
import { formatDeadline, isOverdue } from '@/utils/date';
import { PRIORITY_LABELS } from '@/utils/constants';
import { getTagColor } from '@/utils/constants';

interface CardProps {
  card: CardType;
  onClick: () => void;
}

export const Card = memo(function Card({ card, onClick }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      card,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityVariant = `priority-${card.priority.toLowerCase()}` as const;
  const hasDeadline = !!card.deadline;
  const deadlineOverdue = hasDeadline && isOverdue(card.deadline!);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        'p-3 rounded-lg border border-border bg-bg-primary cursor-pointer',
        'hover:border-border-hover hover:shadow-notion-md hover:-translate-y-0.5',
        'active:scale-[0.98] active:cursor-grabbing',
        'transition-all duration-150 ease-out',
        isDragging && 'opacity-50 shadow-notion-lg scale-[1.02] z-50'
      )}
    >
      {/* Priority indicator */}
      <div className="flex items-center gap-2 mb-2">
        <Badge variant={priorityVariant}>{PRIORITY_LABELS[card.priority]}</Badge>
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium text-text-primary mb-2 line-clamp-2">
        {card.title}
      </h4>

      {/* Description preview */}
      {card.description && (
        <p className="text-xs text-text-secondary mb-2 line-clamp-2">
          {card.description}
        </p>
      )}

      {/* Tags */}
      {card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.tags.slice(0, 3).map((tag, index) => (
            <span
              key={tag}
              className={cn(
                'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs text-white',
                getTagColor(index)
              )}
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
          {card.tags.length > 3 && (
            <span className="text-xs text-text-tertiary">
              +{card.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Deadline */}
      {hasDeadline && (
        <div
          className={cn(
            'flex items-center gap-1 text-xs',
            deadlineOverdue ? 'text-priority-high' : 'text-text-secondary'
          )}
        >
          <Calendar size={12} />
          <span>{formatDeadline(card.deadline!)}</span>
        </div>
      )}
    </div>
  );
});

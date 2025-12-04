import { Layers } from 'lucide-react';
import type { ColumnWithCards } from '@/types';
import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/Badge';
import { PRIORITY_LABELS } from '@/utils/constants';

interface DragOverlayColumnProps {
  column: ColumnWithCards;
}

/**
 * Column component for DragOverlay - shows column being dragged with visual effects
 */
export function DragOverlayColumn({ column }: DragOverlayColumnProps) {
  const visibleCards = column.cards.slice(0, 3);
  const remainingCount = column.cards.length - visibleCards.length;

  return (
    <div
      className={cn(
        'w-72 bg-bg-secondary rounded-lg flex flex-col',
        'shadow-notion-xl rotate-2 scale-[1.02]',
        'cursor-grabbing border border-accent/30',
        'max-h-80 overflow-hidden'
      )}
    >
      {/* Header */}
      <div className="p-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary truncate">
            {column.title}
          </h3>
          <span className="flex items-center gap-1 text-xs text-text-tertiary bg-bg-tertiary px-2 py-0.5 rounded-full">
            <Layers size={12} />
            {column.cards.length}
          </span>
        </div>
      </div>

      {/* Card previews */}
      <div className="flex-1 p-2 space-y-2 overflow-hidden">
        {visibleCards.map((card) => {
          const priorityVariant = `priority-${card.priority.toLowerCase()}` as const;
          return (
            <div
              key={card.id}
              className="p-2 rounded-md border border-border/50 bg-bg-primary"
            >
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={priorityVariant} className="text-[10px] px-1.5 py-0">
                  {PRIORITY_LABELS[card.priority]}
                </Badge>
              </div>
              <p className="text-xs text-text-primary line-clamp-1">
                {card.title}
              </p>
            </div>
          );
        })}

        {remainingCount > 0 && (
          <div className="text-xs text-text-tertiary text-center py-1">
            +{remainingCount} ещё
          </div>
        )}

        {column.cards.length === 0 && (
          <div className="text-xs text-text-tertiary text-center py-2">
            Пустая колонка
          </div>
        )}
      </div>
    </div>
  );
}


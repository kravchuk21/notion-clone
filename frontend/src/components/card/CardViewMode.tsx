import { Calendar, Tag, Clock, Layers } from 'lucide-react';
import type { Card } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import { formatDeadline, isOverdue } from '@/utils/date';
import { PRIORITY_LABELS, getTagColor } from '@/utils/constants';

interface CardViewModeProps {
  card: Card;
  columnTitle?: string;
}

export function CardViewMode({ card, columnTitle }: CardViewModeProps) {
  const priorityVariant = `priority-${card.priority.toLowerCase()}` as 
    | 'priority-high' 
    | 'priority-medium' 
    | 'priority-low';
  const hasDeadline = !!card.deadline;
  const deadlineOverdue = hasDeadline && isOverdue(card.deadline!);

  return (
    <div className="space-y-6">
      {/* Column & Priority */}
      <div className="flex items-center gap-3 flex-wrap">
        {columnTitle && (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-bg-hover rounded text-xs text-text-secondary">
            <Layers size={12} />
            {columnTitle}
          </span>
        )}
        <Badge variant={priorityVariant}>{PRIORITY_LABELS[card.priority]}</Badge>
      </div>

      {/* Title */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary leading-tight break-words">
          {card.title}
        </h2>
      </div>

      {/* Description */}
      {card.description ? (
        <div className="prose prose-sm max-w-none">
          <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">
            {card.description}
          </p>
        </div>
      ) : (
        <p className="text-text-tertiary text-sm italic">Нет описания</p>
      )}

      {/* Tags */}
      {card.tags.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Tag size={12} />
            Метки
          </h4>
          <div className="flex flex-wrap gap-2">
            {card.tags.map((tag, index) => (
              <span
                key={tag}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-sm text-white',
                  getTagColor(index)
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Deadline */}
      {hasDeadline && (
        <div>
          <h4 className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Calendar size={12} />
            Дедлайн
          </h4>
          <p
            className={cn(
              'text-sm font-medium',
              deadlineOverdue ? 'text-priority-high' : 'text-text-primary'
            )}
          >
            {formatDeadline(card.deadline!)}
            {deadlineOverdue && (
              <span className="ml-2 text-xs text-priority-high">(просрочено)</span>
            )}
          </p>
        </div>
      )}

      {/* Timestamps */}
      <div className="pt-4 border-t border-border space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
          <Clock size={12} />
          <span>
            Создано: {new Date(card.createdAt).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        {card.updatedAt !== card.createdAt && (
          <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
            <Clock size={12} />
            <span>
              Обновлено: {new Date(card.updatedAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

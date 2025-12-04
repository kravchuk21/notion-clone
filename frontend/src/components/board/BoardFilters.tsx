import { Search, X, Filter } from 'lucide-react';
import { useFilterStore } from '@/store/filterStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { PRIORITY_OPTIONS } from '@/utils/constants';
import type { Priority } from '@/types';

interface BoardFiltersProps {
  allTags: string[];
}

export function BoardFilters({ allTags }: BoardFiltersProps) {
  const {
    searchQuery,
    setSearchQuery,
    priorities,
    togglePriority,
    tags,
    toggleTag,
    showOverdue,
    setShowOverdue,
    resetFilters,
    hasActiveFilters,
  } = useFilterStore();

  const hasFilters = hasActiveFilters();

  return (
    <div className="px-6 py-3 border-b border-border bg-bg-secondary/50">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
          />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по карточкам..."
            className="pl-9 pr-8"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Priority filters */}
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-text-secondary" />
          {PRIORITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => togglePriority(option.value as Priority)}
              className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors border',
                priorities.includes(option.value as Priority)
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border hover:border-border-hover text-text-secondary'
              )}
            >
              <span className={cn('w-2 h-2 rounded-full', option.color)} />
              {option.label}
            </button>
          ))}
        </div>

        {/* Tags filter */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {allTags.slice(0, 5).map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={cn(
                  'px-2 py-1 rounded-md text-xs font-medium transition-colors border',
                  tags.includes(tag)
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border hover:border-border-hover text-text-secondary'
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Overdue filter */}
        <button
          onClick={() => setShowOverdue(!showOverdue)}
          className={cn(
            'px-2 py-1 rounded-md text-xs font-medium transition-colors border',
            showOverdue
              ? 'border-priority-high bg-priority-high/10 text-priority-high'
              : 'border-border hover:border-border-hover text-text-secondary'
          )}
        >
          Просроченные
        </button>

        {/* Reset filters */}
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X size={14} />
            Сбросить
          </Button>
        )}
      </div>
    </div>
  );
}


import { Eye, Pencil } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CardViewToggleProps {
  isEditing: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function CardViewToggle({ isEditing, onToggle, disabled }: CardViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-bg-secondary p-0.5 w-full xs:w-auto">
      {/* View mode button */}
      <button
        type="button"
        onClick={() => {
          if (isEditing) onToggle();
        }}
        disabled={disabled}
        className={cn(
          'flex items-center justify-center gap-1.5 px-3 py-2 xs:py-1.5 rounded-md text-sm font-medium transition-all flex-1 xs:flex-none',
          !isEditing
            ? 'bg-bg-primary text-text-primary shadow-sm'
            : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover cursor-pointer'
        )}
      >
        <Eye size={16} className="xs:w-3.5 xs:h-3.5" />
        <span>Просмотр</span>
      </button>
      
      {/* Edit mode button */}
      <button
        type="button"
        onClick={() => {
          if (!isEditing) onToggle();
        }}
        disabled={disabled}
        className={cn(
          'flex items-center justify-center gap-1.5 px-3 py-2 xs:py-1.5 rounded-md text-sm font-medium transition-all flex-1 xs:flex-none',
          isEditing
            ? 'bg-bg-primary text-text-primary shadow-sm'
            : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover cursor-pointer'
        )}
      >
        <Pencil size={16} className="xs:w-3.5 xs:h-3.5" />
        <span>Редактировать</span>
      </button>
    </div>
  );
}

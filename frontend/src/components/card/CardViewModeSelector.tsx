import { PanelRight, Maximize2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useCardViewStore } from '@/store/cardViewStore';
import type { ViewMode } from '@/constants/cardView';

interface CardViewModeSelectorProps {
  className?: string;
}

export function CardViewModeSelector({ className }: CardViewModeSelectorProps) {
  const { viewMode, setViewMode } = useCardViewStore();

  const options: { value: ViewMode; icon: typeof PanelRight; label: string }[] = [
    { value: 'peek', icon: PanelRight, label: 'Панель' },
    { value: 'modal', icon: Maximize2, label: 'Модал' },
  ];

  return (
    // Hide on mobile - panel acts as fullscreen modal on small screens
    <div className={cn('hidden md:inline-flex rounded-lg border border-border bg-bg-secondary p-0.5', className)}>
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = viewMode === option.value;
        
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setViewMode(option.value)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all',
              isActive
                ? 'bg-bg-primary text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            )}
            title={`Открывать как ${option.label.toLowerCase()}`}
          >
            <Icon size={14} />
            <span className="hidden lg:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

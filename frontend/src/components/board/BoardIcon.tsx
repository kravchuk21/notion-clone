import { useRef, useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import { Popover } from '@/components/ui/Popover';
import { EmojiPicker } from '@/components/ui/EmojiPicker';
import { cn } from '@/utils/cn';

interface BoardIconProps {
  icon: string | null;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
  onChange?: (icon: string | null) => void;
}

const sizeConfig = {
  sm: { emoji: 'text-base', icon: 18, padding: 'p-0.5' },
  md: { emoji: 'text-xl', icon: 22, padding: 'p-1' },
  lg: { emoji: 'text-2xl', icon: 28, padding: 'p-1.5' },
};

export function BoardIcon({
  icon,
  size = 'md',
  editable = false,
  onChange,
}: BoardIconProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const config = sizeConfig[size];

  const handleSelect = (newIcon: string | null) => {
    onChange?.(newIcon);
    setIsPickerOpen(false);
  };

  const content = icon ? (
    <span className={cn('leading-none', config.emoji)}>{icon}</span>
  ) : (
    <LayoutGrid size={config.icon} className="text-text-secondary" />
  );

  if (!editable) {
    return (
      <span className={cn('flex items-center justify-center flex-shrink-0', config.padding)}>
        {content}
      </span>
    );
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsPickerOpen(true)}
        className={cn(
          'flex items-center justify-center flex-shrink-0 rounded-md transition-colors',
          'hover:bg-bg-hover',
          config.padding
        )}
        title="Изменить иконку"
      >
        {content}
      </button>

      <Popover
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        triggerRef={triggerRef}
        align="start"
      >
        <EmojiPicker onSelect={handleSelect} currentEmoji={icon} />
      </Popover>
    </>
  );
}


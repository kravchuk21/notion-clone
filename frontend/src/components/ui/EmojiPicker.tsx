import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

/** Common emoji options for board icons */
const EMOJI_LIST = [
  // Objects & Documents
  '📋', '📝', '📌', '📎', '🗂️', '📁', '📂', '🗃️',
  // Stars & Symbols
  '⭐', '💡', '🎯', '🚀', '💎', '🔥', '⚡', '✨',
  // Activities & Fun
  '🎨', '🎮', '🎬', '🎵', '📸', '🏆', '🎁', '🎉',
  // Tech & Tools
  '💻', '🖥️', '📱', '⚙️', '🔧', '🛠️', '🔒', '🔑',
  // Nature & Colors
  '🌟', '🌈', '🌸', '🍀', '🌊', '🔮', '💜', '💙',
  // Business & Misc
  '📊', '📈', '💰', '🏠', '🚗', '✈️', '🎓', '💪',
  // More useful icons
  '📅', '⏰', '🔔', '💬', '✅', '❌', '⚠️', '💼',
];

export interface EmojiPickerProps {
  onSelect: (emoji: string | null) => void;
  currentEmoji?: string | null;
}

export function EmojiPicker({ onSelect, currentEmoji }: EmojiPickerProps) {
  return (
    <div className="p-3 w-72">
      <div className="grid grid-cols-8 gap-1">
        {EMOJI_LIST.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onSelect(emoji)}
            className={cn(
              'w-8 h-8 flex items-center justify-center text-lg rounded-md transition-colors',
              'hover:bg-bg-hover',
              currentEmoji === emoji && 'bg-bg-hover ring-2 ring-accent ring-offset-1 ring-offset-bg-secondary'
            )}
          >
            {emoji}
          </button>
        ))}
      </div>
      
      {currentEmoji && (
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-md transition-colors"
        >
          <X size={14} />
          <span>Удалить иконку</span>
        </button>
      )}
    </div>
  );
}

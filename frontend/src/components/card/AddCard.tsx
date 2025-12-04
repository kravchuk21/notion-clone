import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/utils/cn';

interface AddCardProps {
  onAdd: (title: string) => void;
  isLoading?: boolean;
}

export function AddCard({ onAdd, isLoading }: AddCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd(title.trim());
    setTitle('');
    setIsAdding(false);
  };

  const handleCancel = () => {
    setTitle('');
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className={cn(
          'w-full flex items-center gap-2 px-3 py-2 text-sm',
          'text-text-secondary hover:text-text-primary hover:bg-bg-hover',
          'rounded-md transition-colors duration-150'
        )}
      >
        <Plus size={16} />
        Добавить карточку
      </button>
    );
  }

  return (
    <div className="p-2 bg-bg-primary rounded-lg border border-border animate-fade-in">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Введите название..."
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
          if (e.key === 'Escape') handleCancel();
        }}
      />
      <div className="flex items-center gap-2 mt-2">
        <Button size="sm" onClick={handleSubmit} isLoading={isLoading}>
          Добавить
        </Button>
        <button
          onClick={handleCancel}
          className="p-1.5 rounded hover:bg-bg-hover transition-colors text-text-secondary"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

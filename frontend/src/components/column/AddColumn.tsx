import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/utils/cn';

export interface AddColumnProps {
  onAdd: (title: string) => void;
  isLoading?: boolean;
}

export function AddColumn({ onAdd, isLoading }: AddColumnProps) {
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
          'flex-shrink-0 w-72 h-12 flex items-center justify-center gap-2',
          'rounded-lg border-2 border-dashed border-border',
          'text-text-secondary hover:border-border-hover hover:text-text-primary',
          'transition-colors duration-150'
        )}
      >
        <Plus size={18} />
        Добавить колонку
      </button>
    );
  }

  return (
    <div className="flex-shrink-0 w-72 p-3 bg-bg-secondary rounded-lg animate-fade-in">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Название колонки"
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

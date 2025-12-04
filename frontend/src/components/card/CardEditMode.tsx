import { useState, useEffect } from 'react';
import { X, Calendar, Tag } from 'lucide-react';
import type { Card, Priority, UpdateCardInput } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/utils/cn';
import { PRIORITY_OPTIONS, getTagColor } from '@/utils/constants';
import { formatDateForInput } from '@/utils/date';

interface CardEditModeProps {
  card: Card;
  onSave: (data: UpdateCardInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CardEditMode({ card, onSave, onCancel, isLoading }: CardEditModeProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [deadline, setDeadline] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description || '');
    setPriority(card.priority);
    setDeadline(formatDateForInput(card.deadline));
    setTags(card.tags);
  }, [card]);

  const handleSave = () => {
    onSave({
      title,
      description: description || null,
      priority,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      tags,
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="space-y-4" onKeyDown={handleKeyDown}>
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          Название
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Название задачи"
          autoFocus
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          Описание
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Добавьте описание..."
          rows={3}
          className="w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors resize-none"
        />
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          Приоритет
        </label>
        <div className="flex flex-wrap gap-2">
          {PRIORITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPriority(option.value as Priority)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition-colors flex-1 xs:flex-none justify-center xs:justify-start',
                priority === option.value
                  ? 'border-accent bg-accent/10'
                  : 'border-border hover:border-border-hover'
              )}
            >
              <span className={cn('w-2 h-2 rounded-full', option.color)} />
              <span className="hidden xs:inline">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Deadline */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            Дедлайн
          </span>
        </label>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="flex-1 xs:flex-none xs:w-auto"
          />
          {deadline && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeadline('')}
              type="button"
            >
              <X size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          <span className="flex items-center gap-1.5">
            <Tag size={14} />
            Метки
          </span>
        </label>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <span
                key={tag}
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-1 rounded text-sm text-white',
                  getTagColor(index)
                )}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:opacity-75"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Новая метка"
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          <Button variant="secondary" onClick={handleAddTag} type="button" className="shrink-0">
            <span className="hidden xs:inline">Добавить</span>
            <span className="xs:hidden">+</span>
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse xs:flex-row justify-end gap-2 xs:gap-3 pt-4 border-t border-border">
        <Button variant="secondary" onClick={onCancel} type="button" className="w-full xs:w-auto">
          Отмена
        </Button>
        <Button onClick={handleSave} isLoading={isLoading} type="button" className="w-full xs:w-auto">
          Сохранить
        </Button>
      </div>
    </div>
  );
}

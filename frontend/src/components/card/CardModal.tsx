import { useState, useEffect } from 'react';
import { X, Trash2, Calendar, Tag, Archive } from 'lucide-react';
import type { Card, Priority, UpdateCardInput } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { cn } from '@/utils/cn';
import { PRIORITY_OPTIONS, getTagColor } from '@/utils/constants';
import { formatDateForInput } from '@/utils/date';

export interface CardModalProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: UpdateCardInput) => void;
  onDelete: (id: string) => void;
  onArchive?: (id: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
  isArchiving?: boolean;
}

export function CardModal({
  card,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onArchive,
  isUpdating,
  isDeleting,
  isArchiving,
}: CardModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [deadline, setDeadline] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || '');
      setPriority(card.priority);
      setDeadline(formatDateForInput(card.deadline));
      setTags(card.tags);
    }
  }, [card]);

  if (!card) return null;

  const handleSave = () => {
    onUpdate(card.id, {
      title,
      description: description || null,
      priority,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      tags,
    });
    onClose();
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

  const handleDelete = () => {
    onDelete(card.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Редактировать карточку" size="lg">
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Название
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название задачи"
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
              rows={4}
              className="w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors resize-none"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Приоритет
            </label>
            <div className="flex gap-2">
              {PRIORITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPriority(option.value as Priority)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition-colors',
                    priority === option.value
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-border-hover'
                  )}
                >
                  <span className={cn('w-2 h-2 rounded-full', option.color)} />
                  {option.label}
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
                className="w-auto"
              />
              {deadline && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeadline('')}
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
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:opacity-75"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Новая метка"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button variant="secondary" onClick={handleAddTag}>
                Добавить
              </Button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-6 pt-4 border-t border-border">
          <div className="flex gap-2">
            {onArchive && (
              <Button
                variant="secondary"
                onClick={() => {
                  onArchive(card.id);
                  onClose();
                }}
                isLoading={isArchiving}
              >
                <Archive size={16} />
                В архив
              </Button>
            )}
            <Button
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 size={16} />
              Удалить
            </Button>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Отмена
            </Button>
            <Button onClick={handleSave} isLoading={isUpdating}>
              Сохранить
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Удалить карточку?"
        message="Это действие нельзя отменить. Карточка будет удалена навсегда."
        confirmText="Удалить"
        isLoading={isDeleting}
      />
    </>
  );
}


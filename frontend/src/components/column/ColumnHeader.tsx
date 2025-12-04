import { useState } from 'react';
import { MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export interface ColumnHeaderProps {
  title: string;
  cardCount: number;
  totalCount: number;
  onUpdate: (title: string) => void;
  onDelete: () => void;
}

export function ColumnHeader({
  title,
  cardCount,
  totalCount,
  onUpdate,
  onDelete,
}: ColumnHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    if (editTitle.trim() && editTitle !== title) {
      onUpdate(editTitle.trim());
    } else {
      setEditTitle(title);
    }
    setIsEditing(false);
  };

  const showFiltered = cardCount !== totalCount;

  return (
    <>
      <div className="px-3 py-2 flex items-center justify-between">
        {isEditing ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') {
                setEditTitle(title);
                setIsEditing(false);
              }
            }}
            autoFocus
            className="text-sm font-medium"
          />
        ) : (
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-text-primary truncate max-w-[180px]">
              {title}
            </h3>
            <span className="text-xs text-text-tertiary">
              {showFiltered ? `${cardCount}/${totalCount}` : cardCount}
            </span>
          </div>
        )}

        <Dropdown
          trigger={
            <button className="p-1 rounded hover:bg-bg-hover transition-colors text-text-secondary">
              <MoreHorizontal size={16} />
            </button>
          }
          align="right"
        >
          <DropdownItem onClick={() => setIsEditing(true)}>
            <Edit2 size={14} />
            Переименовать
          </DropdownItem>
          <DropdownItem variant="danger" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 size={14} />
            Удалить
          </DropdownItem>
        </Dropdown>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={onDelete}
        title="Удалить колонку?"
        message={`Колонка "${title}" и все карточки в ней будут удалены. Это действие нельзя отменить.`}
        confirmText="Удалить"
      />
    </>
  );
}


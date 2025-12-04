import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { BoardIcon } from '@/components/board/BoardIcon';

interface BoardHeaderProps {
  title: string;
  icon: string | null;
  onUpdate: (data: { title?: string; icon?: string | null }) => void;
  onDelete: () => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function BoardHeader({
  title,
  icon,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: BoardHeaderProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    if (editTitle.trim() && editTitle !== title) {
      onUpdate({ title: editTitle.trim() });
    } else {
      setEditTitle(title);
    }
    setIsEditing(false);
  };

  const handleIconChange = (newIcon: string | null) => {
    onUpdate({ icon: newIcon });
  };

  const handleDelete = () => {
    onDelete();
    navigate('/');
  };

  return (
    <>
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-xl font-semibold w-64"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') {
                    setEditTitle(title);
                    setIsEditing(false);
                  }
                }}
              />
              <Button size="sm" variant="ghost" onClick={handleSave} isLoading={isUpdating}>
                <Check size={18} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditTitle(title);
                  setIsEditing(false);
                }}
              >
                <X size={18} />
              </Button>
            </div>
          ) : (
            <>
              <BoardIcon
                icon={icon}
                size="lg"
                editable
                onChange={handleIconChange}
              />
              <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 size={16} />
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDeleteConfirm(true)}
          className="text-text-secondary hover:text-priority-high"
        >
          <Trash2 size={18} />
        </Button>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Удалить доску?"
        message={`Доска "${title}" и все её содержимое будут удалены навсегда.`}
        confirmText="Удалить"
        isLoading={isDeleting}
      />
    </>
  );
}


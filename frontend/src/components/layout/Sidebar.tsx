import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBoards, useCreateBoard } from '@/hooks/useBoards';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { BoardIcon } from '@/components/board/BoardIcon';
import { cn } from '@/utils/cn';

export function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  const { data: boards, isLoading } = useBoards();
  const createBoard = useCreateBoard();

  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) return;

    await createBoard.mutateAsync({ title: newBoardTitle.trim() });
    setNewBoardTitle('');
    setIsCreateModalOpen(false);
  };

  return (
    <>
      <aside
        className={cn(
          'h-[calc(100vh-3.5rem)] border-r border-border bg-bg-secondary transition-all duration-300',
          isCollapsed ? 'w-14' : 'w-64'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-3 flex items-center justify-between">
            {!isCollapsed && (
              <span className="text-sm font-medium text-text-secondary">Доски</span>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-md hover:bg-bg-hover transition-colors text-text-secondary"
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          {/* Create button */}
          <div className="px-3 mb-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className={cn('w-full', isCollapsed && 'px-2')}
            >
              <Plus size={18} />
              {!isCollapsed && <span>Создать доску</span>}
            </Button>
          </div>

          {/* Boards list */}
          <nav className="flex-1 overflow-y-auto px-2 py-1">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            ) : boards?.length === 0 ? (
              !isCollapsed && (
                <p className="text-sm text-text-tertiary px-2 py-4">
                  Нет досок. Создайте первую!
                </p>
              )
            ) : (
              boards?.map((board) => (
                <Link
                  key={board.id}
                  to={`/board/${board.id}`}
                  className={cn(
                    'flex items-center gap-2 px-2 py-2 rounded-md transition-colors text-sm',
                    location.pathname === `/board/${board.id}`
                      ? 'bg-bg-hover text-text-primary'
                      : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                  )}
                  title={board.title}
                >
                  <BoardIcon icon={board.icon} size="sm" />
                  {!isCollapsed && (
                    <span className="truncate">{board.title}</span>
                  )}
                </Link>
              ))
            )}
          </nav>
        </div>
      </aside>

      {/* Create Board Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setNewBoardTitle('');
        }}
        title="Создать доску"
        size="sm"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateBoard();
          }}
        >
          <Input
            placeholder="Название доски"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                setNewBoardTitle('');
              }}
            >
              Отмена
            </Button>
            <Button type="submit" isLoading={createBoard.isPending}>
              Создать
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}


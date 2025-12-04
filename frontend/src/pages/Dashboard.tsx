import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, LayoutGrid, Calendar } from 'lucide-react';
import { useBoards, useCreateBoard } from '@/hooks/useBoards';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatRelative } from '@/utils/date';

export function Dashboard() {
  const { data: boards, isLoading } = useBoards();
  const createBoard = useCreateBoard();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) return;

    await createBoard.mutateAsync({ title: newBoardTitle.trim() });
    setNewBoardTitle('');
    setIsCreateModalOpen(false);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Мои доски</h1>
            <p className="text-text-secondary mt-1">
              Управляйте задачами и проектами
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={18} />
            Создать доску
          </Button>
        </div>

        {/* Boards grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : boards?.length === 0 ? (
          <div className="text-center py-12">
            <LayoutGrid size={48} className="mx-auto text-text-tertiary mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Нет досок
            </h3>
            <p className="text-text-secondary mb-4">
              Создайте свою первую доску для управления задачами
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus size={18} />
              Создать доску
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {boards?.map((board) => (
              <Link
                key={board.id}
                to={`/board/${board.id}`}
                className="group p-4 rounded-lg border border-border bg-bg-primary hover:border-border-hover hover:shadow-notion-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-text-primary group-hover:text-accent transition-colors truncate">
                      {board.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <LayoutGrid size={12} />
                        {board._count?.columns || 0} колонок
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatRelative(board.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

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
    </Layout>
  );
}


import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, LayoutGrid, Calendar } from 'lucide-react';
import { useBoards, useCreateBoard } from '@/hooks/useBoards';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageTransition } from '@/components/ui/PageTransition';
import { formatRelative } from '@/utils/date';
import { staggerContainer, staggerItem } from '@/lib/motion';

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
      <PageTransition>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Мои доски</h1>
              <p className="text-sm sm:text-base text-text-secondary mt-1">
                Управляйте задачами и проектами
              </p>
            </div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Создать доску</span>
              <span className="sm:hidden">Создать</span>
            </Button>
          </div>

          {/* Boards grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-28 sm:h-32" />
              ))}
            </div>
          ) : boards?.length === 0 ? (
            <div className="text-center py-8 sm:py-12 animate-fade-in px-4">
              <LayoutGrid size={40} className="sm:w-12 sm:h-12 mx-auto text-text-tertiary mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-text-primary mb-2">
                Нет досок
              </h3>
              <p className="text-sm sm:text-base text-text-secondary mb-4">
                Создайте свою первую доску для управления задачами
              </p>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full sm:w-auto"
              >
                <Plus size={18} />
                Создать доску
              </Button>
            </div>
          ) : (
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
            >
              {boards?.map((board) => (
                <motion.div key={board.id} variants={staggerItem}>
                  <Link
                    to={`/board/${board.id}`}
                    className="block p-3 sm:p-4 rounded-lg border border-border bg-bg-primary hover:border-border-hover hover:shadow-notion-md hover:-translate-y-0.5 transition-all duration-150"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-medium text-text-primary truncate">
                          {board.title}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-xs text-text-secondary">
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
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </PageTransition>

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

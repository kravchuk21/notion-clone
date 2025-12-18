import { useMemo, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useBoard, useUpdateBoard, useDeleteBoard } from '@/hooks/useBoards';
import { useCreateColumn, useUpdateColumn, useDeleteColumn, useReorderColumns } from '@/hooks/useColumns';
import { useCreateCard, useUpdateCard, useDeleteCard, useMoveCard, useArchiveCard } from '@/hooks/useCards';
import { useSocket } from '@/hooks/useSocket';
import { useCardViewStore } from '@/store/cardViewStore';
import { Layout } from '@/components/layout/Layout';
import { BoardHeader } from '@/components/board/BoardHeader';
import { BoardFilters } from '@/components/board/BoardFilters';
import { BoardCanvas } from '@/components/board/BoardCanvas';
import { ArchivedCardsDrawer } from '@/components/board/ArchivedCardsDrawer';
import { CardPeekPanel } from '@/components/card/CardPeekPanel';
import { CardModal } from '@/components/card/CardModal';
import { CardViewModeSelector } from '@/components/card/CardViewModeSelector';
import { BoardSkeleton } from '@/components/ui/Skeleton';
import { PageTransition } from '@/components/ui/PageTransition';

export function Board() {
  const { id } = useParams<{ id: string }>();
  
  // Early return if no id - this shouldn't happen with proper routing
  if (!id) {
    return <Navigate to="/" replace />;
  }

  return <BoardContent boardId={id} />;
}

/**
 * Internal component that handles board logic with guaranteed boardId
 */
function BoardContent({ boardId }: { boardId: string }) {
  const { data: board, isLoading, error } = useBoard(boardId);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  
  // Card view state
  const { viewMode, selectedCardId } = useCardViewStore();

  // Real-time updates
  useSocket(boardId);

  // Mutations
  const updateBoard = useUpdateBoard();
  const deleteBoard = useDeleteBoard();
  const createColumn = useCreateColumn(boardId);
  const updateColumn = useUpdateColumn(boardId);
  const deleteColumn = useDeleteColumn(boardId);
  const reorderColumns = useReorderColumns(boardId);
  const createCard = useCreateCard(boardId);
  const updateCard = useUpdateCard(boardId);
  const deleteCard = useDeleteCard(boardId);
  const moveCard = useMoveCard(boardId);
  const archiveCard = useArchiveCard(boardId);

  // Collect all unique tags from cards
  const allTags = useMemo(() => {
    if (!board) return [];
    const tags = new Set<string>();
    board.columns.forEach((col) => {
      col.cards.forEach((card) => {
        card.tags.forEach((tag) => tags.add(tag));
      });
    });
    return Array.from(tags);
  }, [board]);

  if (error) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <PageTransition>
        {isLoading || !board ? (
          <BoardSkeleton />
        ) : (
          <div className="flex flex-col h-[calc(100vh-3.5rem)]">
            <BoardHeader
              title={board.title}
              icon={board.icon}
              isFavorite={board.isFavorite}
              onUpdate={(data) => updateBoard.mutate({ id: board.id, data })}
              onDelete={() => deleteBoard.mutate(board.id)}
              onOpenArchive={() => setIsArchiveOpen(true)}
              isUpdating={updateBoard.isPending}
              isDeleting={deleteBoard.isPending}
            >
              {/* View mode selector in header */}
              <CardViewModeSelector className="ml-auto" />
            </BoardHeader>

            <BoardFilters allTags={allTags} />

            {/* Main content area */}
            <div className="flex-1 min-h-0">
              <BoardCanvas
                board={board}
                onCreateColumn={(title) => createColumn.mutate({ title })}
                onUpdateColumn={(columnId, title) =>
                  updateColumn.mutate({ id: columnId, data: { title } })
                }
                onDeleteColumn={(columnId) => deleteColumn.mutate(columnId)}
                onReorderColumns={(columnIds) =>
                  reorderColumns.mutate({ boardId: board.id, columnIds })
                }
                onCreateCard={(columnId, title) =>
                  createCard.mutate({ columnId, data: { title } })
                }
                onUpdateCard={(cardId, data) => updateCard.mutate({ id: cardId, data })}
                onDeleteCard={(cardId) => deleteCard.mutate(cardId)}
                onArchiveCard={(cardId) => archiveCard.mutate(cardId)}
                onMoveCard={(cardId, columnId, position) =>
                  moveCard.mutate({ id: cardId, data: { columnId, position } })
                }
                isCreatingColumn={createColumn.isPending}
                isCreatingCard={createCard.isPending}
                isUpdatingCard={updateCard.isPending}
                isDeletingCard={deleteCard.isPending}
                isArchivingCard={archiveCard.isPending}
              />
            </div>

            {/* Side Panel (Peek Mode) */}
            {viewMode === 'peek' && (
              <CardPeekPanel
                board={board}
                onUpdate={(cardId, data) => updateCard.mutate({ id: cardId, data })}
                onDelete={(cardId) => deleteCard.mutate(cardId)}
                onArchive={(cardId) => archiveCard.mutate(cardId)}
                isUpdating={updateCard.isPending}
                isDeleting={deleteCard.isPending}
                isArchiving={archiveCard.isPending}
              />
            )}

            {/* Modal Mode */}
            {viewMode === 'modal' && (
              <CardModal
                board={board}
                onUpdate={(cardId, data) => updateCard.mutate({ id: cardId, data })}
                onDelete={(cardId) => deleteCard.mutate(cardId)}
                onArchive={(cardId) => archiveCard.mutate(cardId)}
                isUpdating={updateCard.isPending}
                isDeleting={deleteCard.isPending}
                isArchiving={archiveCard.isPending}
              />
            )}

            <ArchivedCardsDrawer
              boardId={board.id}
              isOpen={isArchiveOpen}
              onClose={() => setIsArchiveOpen(false)}
            />
          </div>
        )}
      </PageTransition>
    </Layout>
  );
}

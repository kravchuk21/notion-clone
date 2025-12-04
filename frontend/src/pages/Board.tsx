import { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useBoard, useUpdateBoard, useDeleteBoard } from '@/hooks/useBoards';
import { useCreateColumn, useUpdateColumn, useDeleteColumn, useReorderColumns } from '@/hooks/useColumns';
import { useCreateCard, useUpdateCard, useDeleteCard, useMoveCard } from '@/hooks/useCards';
import { useSocket } from '@/hooks/useSocket';
import { Layout } from '@/components/layout/Layout';
import { BoardHeader } from '@/components/board/BoardHeader';
import { BoardFilters } from '@/components/board/BoardFilters';
import { BoardCanvas } from '@/components/board/BoardCanvas';
import { BoardSkeleton } from '@/components/ui/Skeleton';

export function Board() {
  const { id } = useParams<{ id: string }>();
  const { data: board, isLoading, error } = useBoard(id!);

  // Real-time updates
  useSocket(id || null);

  // Mutations
  const updateBoard = useUpdateBoard();
  const deleteBoard = useDeleteBoard();
  const createColumn = useCreateColumn(id!);
  const updateColumn = useUpdateColumn(id!);
  const deleteColumn = useDeleteColumn(id!);
  const reorderColumns = useReorderColumns(id!);
  const createCard = useCreateCard(id!);
  const updateCard = useUpdateCard(id!);
  const deleteCard = useDeleteCard(id!);
  const moveCard = useMoveCard(id!);

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

  if (!id) {
    return <Navigate to="/" replace />;
  }

  if (error) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      {isLoading || !board ? (
        <BoardSkeleton />
      ) : (
        <div className="flex flex-col h-[calc(100vh-3.5rem)]">
          <BoardHeader
            title={board.title}
            icon={board.icon}
            onUpdate={(data) => updateBoard.mutate({ id: board.id, data })}
            onDelete={() => deleteBoard.mutate(board.id)}
            isUpdating={updateBoard.isPending}
            isDeleting={deleteBoard.isPending}
          />

          <BoardFilters allTags={allTags} />

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
            onMoveCard={(cardId, columnId, position) =>
              moveCard.mutate({ id: cardId, data: { columnId, position } })
            }
            isCreatingColumn={createColumn.isPending}
            isCreatingCard={createCard.isPending}
            isUpdatingCard={updateCard.isPending}
            isDeletingCard={deleteCard.isPending}
          />
        </div>
      )}
    </Layout>
  );
}


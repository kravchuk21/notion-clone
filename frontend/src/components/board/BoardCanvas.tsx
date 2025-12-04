import { useMemo, useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import type { BoardWithDetails, ColumnWithCards, Card as CardType, UpdateCardInput } from '@/types';
import { Column } from '@/components/column/Column';
import { AddColumn } from '@/components/column/AddColumn';
import { Card } from '@/components/card/Card';

interface BoardCanvasProps {
  board: BoardWithDetails;
  onCreateColumn: (title: string) => void;
  onUpdateColumn: (id: string, title: string) => void;
  onDeleteColumn: (id: string) => void;
  onReorderColumns: (columnIds: string[]) => void;
  onCreateCard: (columnId: string, title: string) => void;
  onUpdateCard: (id: string, data: UpdateCardInput) => void;
  onDeleteCard: (id: string) => void;
  onMoveCard: (cardId: string, columnId: string, position: number) => void;
  isCreatingColumn?: boolean;
  isCreatingCard?: boolean;
  isUpdatingCard?: boolean;
  isDeletingCard?: boolean;
}

export function BoardCanvas({
  board,
  onCreateColumn,
  onUpdateColumn,
  onDeleteColumn,
  onReorderColumns,
  onCreateCard,
  onUpdateCard,
  onDeleteCard,
  onMoveCard,
  isCreatingColumn,
  isCreatingCard,
  isUpdatingCard,
  isDeletingCard,
}: BoardCanvasProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'column' | 'card' | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columnIds = useMemo(() => board.columns.map((c) => c.id), [board.columns]);

  const activeColumn = useMemo(() => {
    if (activeType !== 'column' || !activeId) return null;
    return board.columns.find((c) => c.id === activeId);
  }, [activeId, activeType, board.columns]);

  const activeCard = useMemo(() => {
    if (activeType !== 'card' || !activeId) return null;
    for (const column of board.columns) {
      const card = column.cards.find((c) => c.id === activeId);
      if (card) return card;
    }
    return null;
  }, [activeId, activeType, board.columns]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const type = active.data.current?.type;
    setActiveId(active.id as string);
    setActiveType(type);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!activeData || activeData.type !== 'card') return;

    const activeCard = activeData.card as CardType;
    const overType = overData?.type;

    // Get target column
    let targetColumnId: string | null = null;

    if (overType === 'column') {
      targetColumnId = over.id as string;
    } else if (overType === 'card') {
      const overCard = overData?.card as CardType;
      targetColumnId = overCard.columnId;
    }

    if (!targetColumnId || targetColumnId === activeCard.columnId) return;

    // Find target column
    const targetColumn = board.columns.find((c) => c.id === targetColumnId);
    if (!targetColumn) return;

    // Calculate new position
    let newPosition = targetColumn.cards.length;

    if (overType === 'card') {
      const overCard = overData?.card as CardType;
      const overIndex = targetColumn.cards.findIndex((c) => c.id === overCard.id);
      newPosition = overIndex >= 0 ? overIndex : targetColumn.cards.length;
    }

    // Move card optimistically
    onMoveCard(activeCard.id, targetColumnId, newPosition);
  }, [board.columns, onMoveCard]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveType(null);

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!activeData) return;

    // Handle column reordering
    if (activeData.type === 'column' && overData?.type === 'column') {
      if (active.id !== over.id) {
        const oldIndex = board.columns.findIndex((c) => c.id === active.id);
        const newIndex = board.columns.findIndex((c) => c.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrder = [...columnIds];
          newOrder.splice(oldIndex, 1);
          newOrder.splice(newIndex, 0, active.id as string);
          onReorderColumns(newOrder);
        }
      }
    }

    // Handle card reordering within same column
    if (activeData.type === 'card') {
      const activeCard = activeData.card as CardType;

      if (overData?.type === 'card') {
        const overCard = overData.card as CardType;

        if (activeCard.columnId === overCard.columnId && active.id !== over.id) {
          const column = board.columns.find((c) => c.id === activeCard.columnId);
          if (column) {
            const oldIndex = column.cards.findIndex((c) => c.id === active.id);
            const newIndex = column.cards.findIndex((c) => c.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
              onMoveCard(activeCard.id, activeCard.columnId, newIndex);
            }
          }
        }
      }
    }
  }, [board.columns, columnIds, onReorderColumns, onMoveCard]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 items-start">
          <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
            {board.columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                onUpdateColumn={onUpdateColumn}
                onDeleteColumn={onDeleteColumn}
                onCreateCard={onCreateCard}
                onUpdateCard={onUpdateCard}
                onDeleteCard={onDeleteCard}
                isCreatingCard={isCreatingCard}
                isUpdatingCard={isUpdatingCard}
                isDeletingCard={isDeletingCard}
              />
            ))}
          </SortableContext>

          <AddColumn onAdd={onCreateColumn} isLoading={isCreatingColumn} />
        </div>
      </div>

      <DragOverlay>
        {activeColumn && (
          <div className="w-72 bg-bg-secondary rounded-lg p-3 opacity-90 shadow-notion-xl">
            <h3 className="text-sm font-medium text-text-primary">{activeColumn.title}</h3>
          </div>
        )}
        {activeCard && (
          <div className="opacity-90 shadow-notion-xl">
            <Card card={activeCard} onClick={() => {}} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}


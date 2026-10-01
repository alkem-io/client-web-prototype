/**
 * KanbanBoardPost — Two components for the "kanban" post type:
 *
 * 1. `KanbanPostPreview` — compact feed preview showing mini columns
 * 2. `KanbanPostDialog`  — full interactive DnD board in a dialog
 *
 * Follows the same pattern as whiteboard (preview image → "Open Whiteboard")
 * and Collabora (type icon → "Open Document").
 */
import { useState, useCallback, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  useDroppable,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import {
  boardCollisionDetection,
  fromColumnDroppableId,
  toColumnDroppableId,
  useBoardSensors
} from "@/app/components/shared/boardDnd";
import {
  GripVertical,
  Kanban,
  Plus,
  X
} from "lucide-react";
import { cn } from "@/crd/lib/utils";
import { Button } from "@/crd/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/crd/primitives/dialog";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface KanbanCard {
  id: string;
  title: string;
  assignee?: string;
}

export interface KanbanColumn {
  id: string;
  label: string;
  cards: KanbanCard[];
}

export interface KanbanBoardData {
  columns: KanbanColumn[];
}

// ─── DnD ──────────────────────────────────────────────────────────────────────

const KANBAN_CARD = "KANBAN_CARD_ITEM";

interface CardDragItem {
  id: string;
  index: number;
  sourceColumnId: string;
}

// ─── Draggable Card ───────────────────────────────────────────────────────────

function DraggableCard({
  card,
  columnId,
  overlay = false
}: {
  card: KanbanCard;
  columnId: string;
  /** Rendered inside the DragOverlay — no sortable wiring, no fade. */
  overlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: { type: "card", columnId },
    disabled: overlay
  });

  const style = overlay
    ? undefined
    : {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition
      };

  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      style={style}
      className={cn(
        "group/item flex items-start gap-2 bg-background border border-border rounded-lg px-3 py-2.5",
        "cursor-grab active:cursor-grabbing hover:border-primary/30 hover:shadow-sm transition-all touch-none",
        isDragging && "opacity-30 border-dashed",
        overlay && "shadow-lg rotate-2"
      )}
      {...(overlay ? {} : attributes)}
      {...(overlay ? {} : listeners)}
    >
      <GripVertical className="w-3.5 h-3.5 mt-0.5 text-muted-foreground/30 group-hover/item:text-muted-foreground/60 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-body-emphasis leading-snug line-clamp-2 text-foreground">
          {card.title}
        </p>
        {card.assignee && (
          <p className="text-caption text-muted-foreground mt-0.5 truncate">
            {card.assignee}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Dialog Column ────────────────────────────────────────────────────────────

function DialogColumn({ column }: { column: KanbanColumn }) {
  // Droppable in its own right so cards can be dropped into an empty column.
  const { setNodeRef, isOver } = useDroppable({
    id: toColumnDroppableId(column.id),
    data: { type: "column", columnId: column.id }
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col w-[300px] shrink-0 min-h-full rounded-xl border border-border/60 bg-muted/30 transition-colors",
        isOver && "border-primary/40 bg-primary/5"
      )}
    >
      <div className="px-3 pt-3 pb-2 border-b border-border/40">
        <div className="flex items-center justify-between">
          <h4 className="text-card-title text-foreground truncate">
            {column.label}
          </h4>
          <span className="text-caption text-muted-foreground tabular-nums bg-muted rounded-full px-2 py-0.5">
            {column.cards.length}
          </span>
        </div>
      </div>
      <div className="flex-1 p-2 space-y-1.5 overflow-y-auto">
        <SortableContext items={column.cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {column.cards.map(card => (
            <DraggableCard key={card.id} card={card} columnId={column.id} />
          ))}
        </SortableContext>
        {column.cards.length === 0 && (
          <div className="flex items-center justify-center h-16 text-caption text-muted-foreground/50 border border-dashed border-border/40 rounded-lg">
            Drop items here
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Feed Preview — compact mini-board
// ═══════════════════════════════════════════════════════════════════════════════

interface KanbanPostPreviewProps {
  data: KanbanBoardData;
  onClick?: () => void;
}

export function KanbanPostPreview({ data, onClick }: KanbanPostPreviewProps) {
  const totalCards = data.columns.reduce((sum, col) => sum + col.cards.length, 0);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="relative block w-full cursor-pointer overflow-hidden rounded-lg border border-border bg-muted/20 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* Mini column visualization */}
      <div className="px-4 py-5">
        <div className="flex gap-2 justify-center">
          {data.columns.map((col) => (
            <div key={col.id} className="flex-1 max-w-[120px] min-w-[60px]">
              {/* Column header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-badge text-muted-foreground uppercase tracking-wider truncate">
                  {col.label}
                </span>
                <span className="text-[10px] text-muted-foreground/60 tabular-nums ml-1">
                  {col.cards.length}
                </span>
              </div>
              {/* Mini card dots */}
              <div className="space-y-1">
                {col.cards.slice(0, 4).map((card) => (
                  <div
                    key={card.id}
                    className="h-2 rounded-sm bg-foreground/10"
                  />
                ))}
                {col.cards.length > 4 && (
                  <div className="text-[9px] text-muted-foreground/50 text-center">
                    +{col.cards.length - 4}
                  </div>
                )}
                {col.cards.length === 0 && (
                  <div className="h-2 rounded-sm border border-dashed border-border/50" />
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Summary */}
        <div className="mt-3 pt-2 border-t border-border/30 flex items-center justify-between">
          <span className="text-caption text-muted-foreground">
            {data.columns.length} columns · {totalCards} items
          </span>
        </div>
      </div>

      {/* Hover overlay with "Open Board" */}
      <div className="absolute inset-0 flex items-center justify-center bg-primary/5 opacity-0 hover:opacity-100 transition-opacity">
        <span className="inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground shadow-sm h-9 px-4 text-body-emphasis gap-2">
          <Kanban className="w-4 h-4" />
          Open Board
        </span>
      </div>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Full Board Dialog
// ═══════════════════════════════════════════════════════════════════════════════

interface KanbanPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  data: KanbanBoardData;
}

export function KanbanPostDialog({ open, onOpenChange, title, data }: KanbanPostDialogProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>(data.columns);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useBoardSensors();

  const activeCard = activeId
    ? columns.flatMap(c => c.cards).find(c => c.id === activeId)
    : undefined;

  const findColumnIdOfCard = useCallback(
    (cardId: string) => columns.find(c => c.cards.some(card => card.id === cardId))?.id,
    [columns]
  );

  /** Which column is the drop target: a column droppable, or the card hovered. */
  const resolveColumnId = useCallback(
    (overId: string) => fromColumnDroppableId(overId) ?? findColumnIdOfCard(overId),
    [findColumnIdOfCard]
  );

  /**
   * Move a card next to `overId` (or append when dropped on the column itself).
   * One reconciliation covers both reorder and cross-column move.
   */
  const moveCard = useCallback((cardId: string, overId: string, targetColumnId: string) => {
    setColumns(prev => {
      const moving = prev.flatMap(c => c.cards).find(c => c.id === cardId);
      if (!moving) return prev;

      return prev.map(col => {
        const withoutCard = col.cards.filter(c => c.id !== cardId);
        if (col.id !== targetColumnId) return { ...col, cards: withoutCard };

        const overIndex = withoutCard.findIndex(c => c.id === overId);
        const cards = [...withoutCard];
        cards.splice(overIndex === -1 ? cards.length : overIndex, 0, moving);
        return { ...col, cards };
      });
    });
  }, []);

  const handleDragStart = (event: DragStartEvent) => setActiveId(String(event.active.id));

  // Cross-column only — SortableContext handles same-column reordering.
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const cardId = String(active.id);
    const overId = String(over.id);
    if (cardId === overId) return;

    const sourceColumnId = findColumnIdOfCard(cardId);
    const targetColumnId = resolveColumnId(overId);
    if (!sourceColumnId || !targetColumnId || sourceColumnId === targetColumnId) return;

    moveCard(cardId, overId, targetColumnId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const cardId = String(active.id);
    const overId = String(over.id);
    const targetColumnId = resolveColumnId(overId);
    if (!targetColumnId) return;

    moveCard(cardId, overId, targetColumnId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-7xl h-[95vh] p-0 gap-0 overflow-hidden flex flex-col bg-background border-none shadow-2xl rounded-xl z-50">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Kanban className="w-5 h-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-x-auto p-6">
          <DndContext
            sensors={sensors}
            collisionDetection={boardCollisionDetection}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveId(null)}
          >
            <div className="flex items-start gap-3 h-full">
              {columns.map(col => (
                <DialogColumn key={col.id} column={col} />
              ))}
            </div>
            {createPortal(
              <DragOverlay dropAnimation={null}>
                {activeCard ? <DraggableCard card={activeCard} columnId="" overlay /> : null}
              </DragOverlay>,
              document.body
            )}
          </DndContext>
        </div>
      </DialogContent>
    </Dialog>
  );
}

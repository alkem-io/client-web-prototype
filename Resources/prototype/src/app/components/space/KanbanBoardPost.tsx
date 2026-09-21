/**
 * KanbanBoardPost — Two components for the "kanban" post type:
 *
 * 1. `KanbanPostPreview` — compact feed preview showing mini columns
 * 2. `KanbanPostDialog`  — full interactive DnD board in a dialog
 *
 * Follows the same pattern as whiteboard (preview image → "Open Whiteboard")
 * and Collabora (type icon → "Open Document").
 */
import { useState, useRef, useCallback, useMemo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "motion/react";
import {
  GripVertical,
  Kanban,
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

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
  index,
  columnId,
  moveCardInColumn,
  moveCardBetweenColumns,
}: {
  card: KanbanCard;
  index: number;
  columnId: string;
  moveCardInColumn: (colId: string, dragIdx: number, hoverIdx: number) => void;
  moveCardBetweenColumns: (srcCol: string, dragIdx: number, tgtCol: string, tgtIdx: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<CardDragItem, void, { handlerId: string | symbol | null }>({
    accept: KANBAN_CARD,
    collect: (monitor) => ({ handlerId: monitor.getHandlerId() }),
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (item.sourceColumnId === columnId && dragIndex === hoverIndex) return;
      const rect = ref.current.getBoundingClientRect();
      const midY = (rect.bottom - rect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverY = clientOffset.y - rect.top;
      if (item.sourceColumnId === columnId) {
        if (dragIndex < hoverIndex && hoverY < midY) return;
        if (dragIndex > hoverIndex && hoverY > midY) return;
        moveCardInColumn(columnId, dragIndex, hoverIndex);
        item.index = hoverIndex;
        return;
      }
      moveCardBetweenColumns(item.sourceColumnId, dragIndex, columnId, hoverIndex);
      item.sourceColumnId = columnId;
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: KANBAN_CARD,
    item: (): CardDragItem => ({ id: card.id, index, sourceColumnId: columnId }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(drop(ref));

  return (
    <motion.div
      ref={ref}
      data-handler-id={handlerId}
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6, height: 0 }}
      transition={{ duration: 0.12 }}
      className={cn(
        "group/item flex items-start gap-2 bg-background border border-border rounded-lg px-3 py-2.5",
        "cursor-grab active:cursor-grabbing hover:border-primary/30 hover:shadow-sm transition-all",
        isDragging && "opacity-30 border-dashed"
      )}
    >
      <GripVertical className="w-3.5 h-3.5 mt-0.5 text-muted-foreground/30 group-hover/item:text-muted-foreground/60 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug line-clamp-2 text-foreground">
          {card.title}
        </p>
        {card.assignee && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {card.assignee}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Dialog Column ────────────────────────────────────────────────────────────

function DialogColumn({
  column,
  moveCardInColumn,
  moveCardBetweenColumns,
}: {
  column: KanbanColumn;
  moveCardInColumn: (colId: string, dragIdx: number, hoverIdx: number) => void;
  moveCardBetweenColumns: (srcCol: string, dragIdx: number, tgtCol: string, tgtIdx: number) => void;
}) {
  const [{ isOver }, dropRef] = useDrop<CardDragItem, void, { isOver: boolean }>({
    accept: KANBAN_CARD,
    collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
    hover(item) {
      if (item.sourceColumnId !== column.id && column.cards.length === 0) {
        moveCardBetweenColumns(item.sourceColumnId, item.index, column.id, 0);
        item.sourceColumnId = column.id;
        item.index = 0;
      }
    },
  });

  return (
    <div
      ref={dropRef as any}
      className={cn(
        "flex flex-col w-[300px] shrink-0 min-h-full rounded-xl border border-border/60 bg-muted/30 transition-colors",
        isOver && "border-primary/40 bg-primary/5"
      )}
    >
      <div className="px-3 pt-3 pb-2 border-b border-border/40">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground truncate">
            {column.label}
          </h4>
          <span className="text-xs text-muted-foreground tabular-nums bg-muted rounded-full px-2 py-0.5">
            {column.cards.length}
          </span>
        </div>
      </div>
      <div className="flex-1 p-2 space-y-1.5 overflow-y-auto">
        <AnimatePresence initial={false}>
          {column.cards.map((card, idx) => (
            <DraggableCard
              key={card.id}
              card={card}
              index={idx}
              columnId={column.id}
              moveCardInColumn={moveCardInColumn}
              moveCardBetweenColumns={moveCardBetweenColumns}
            />
          ))}
        </AnimatePresence>
        {column.cards.length === 0 && (
          <div className="flex items-center justify-center h-16 text-xs text-muted-foreground/50 border border-dashed border-border/40 rounded-lg">
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
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
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
          <span className="text-xs text-muted-foreground">
            {data.columns.length} columns · {totalCards} items
          </span>
        </div>
      </div>

      {/* Hover overlay with "Open Board" */}
      <div className="absolute inset-0 flex items-center justify-center bg-primary/5 opacity-0 hover:opacity-100 transition-opacity">
        <span className="inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground shadow-sm h-9 px-4 text-sm font-medium gap-2">
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

  const moveCardInColumn = useCallback((colId: string, dragIdx: number, hoverIdx: number) => {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id !== colId) return col;
        const cards = [...col.cards];
        const [moved] = cards.splice(dragIdx, 1);
        cards.splice(hoverIdx, 0, moved);
        return { ...col, cards };
      })
    );
  }, []);

  const moveCardBetweenColumns = useCallback(
    (srcCol: string, dragIdx: number, tgtCol: string, tgtIdx: number) => {
      setColumns((prev) => {
        const source = prev.find((c) => c.id === srcCol);
        if (!source) return prev;
        const [moved] = source.cards.splice(dragIdx, 1);
        return prev.map((col) => {
          if (col.id === srcCol) return { ...col, cards: source.cards.filter(() => true) };
          if (col.id === tgtCol) {
            const cards = [...col.cards];
            cards.splice(tgtIdx, 0, moved);
            return { ...col, cards };
          }
          return col;
        });
      });
    },
    []
  );

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
          <DndProvider backend={HTML5Backend}>
            <div className="flex items-start gap-3 h-full">
              {columns.map((col) => (
                <DialogColumn
                  key={col.id}
                  column={col}
                  moveCardInColumn={moveCardInColumn}
                  moveCardBetweenColumns={moveCardBetweenColumns}
                />
              ))}
            </div>
          </DndProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}

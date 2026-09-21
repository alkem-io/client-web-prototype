/**
 * Task response type components:
 * - TaskBoardPreview: inline kanban board shown in feed (no author/date on cards)
 * - TaskDetailDialog: full task view with author, date, description, comments
 * - ConfigureTaskColumnsDialog: admin dialog for defining columns
 */
import { useState, useRef, useCallback, useMemo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  GripVertical,
  Maximize2,
  MessageSquare,
  Plus,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { ReactionBar } from "@/app/components/space/PostReactions";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  author?: string;
  createdDate?: string;
  commentCount?: number;
  tags?: string[];
  status: string;
  comments?: { id: string; author: string; text: string; time: string }[];
}

export interface TaskColumnDef {
  id: string;
  label: string;
  color?: string;
}

// ─── DnD ──────────────────────────────────────────────────────────────────────

const TASK_CARD = "TASK_BOARD_CARD";

interface TaskDragItem {
  id: string;
  index: number;
  sourceColumnId: string;
}

// ─── Task Card (no author/date in feed) ───────────────────────────────────────

function DraggableTaskCard({
  task,
  index,
  columnId,
  moveInColumn,
  moveBetweenColumns,
  onClick,
}: {
  task: TaskItem;
  index: number;
  columnId: string;
  moveInColumn: (colId: string, dragIdx: number, hoverIdx: number) => void;
  moveBetweenColumns: (srcCol: string, dragIdx: number, tgtCol: string, tgtIdx: number) => void;
  onClick?: (task: TaskItem) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<TaskDragItem, void, { handlerId: string | symbol | null }>({
    accept: TASK_CARD,
    collect: (monitor) => ({ handlerId: monitor.getHandlerId() }),
    hover(item, monitor) {
      if (!ref.current) return;
      if (item.sourceColumnId === columnId && item.index === index) return;
      const rect = ref.current.getBoundingClientRect();
      const midY = (rect.bottom - rect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverY = clientOffset.y - rect.top;
      if (item.sourceColumnId === columnId) {
        if (item.index < index && hoverY < midY) return;
        if (item.index > index && hoverY > midY) return;
        moveInColumn(columnId, item.index, index);
        item.index = index;
        return;
      }
      moveBetweenColumns(item.sourceColumnId, item.index, columnId, index);
      item.sourceColumnId = columnId;
      item.index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: TASK_CARD,
    item: (): TaskDragItem => ({ id: task.id, index, sourceColumnId: columnId }),
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
        "group/item bg-background border border-border rounded-lg p-3",
        "cursor-grab active:cursor-grabbing hover:border-primary/30 hover:shadow-sm transition-all",
        isDragging && "opacity-30 border-dashed"
      )}
      onClick={(e) => { e.stopPropagation(); onClick?.(task); }}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="w-3.5 h-3.5 mt-0.5 text-muted-foreground/20 group-hover/item:text-muted-foreground/50 shrink-0" />
        <div className="flex-1 min-w-0 space-y-1.5">
          <p className="text-sm font-medium leading-snug line-clamp-2 text-foreground">{task.title}</p>
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{task.description}</p>
          )}
          {/* Footer: tags + comments only — NO author/date */}
          <div className="flex items-center justify-between gap-2 pt-1">
            {task.tags && task.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1 min-w-0">
                {task.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-[10px] bg-muted text-muted-foreground rounded px-1.5 py-0.5">{tag}</span>
                ))}
                {task.tags.length > 2 && (
                  <span className="text-[10px] text-muted-foreground/60">+{task.tags.length - 2}</span>
                )}
              </div>
            ) : <div />}
            {task.commentCount !== undefined && task.commentCount > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground shrink-0">
                <MessageSquare className="w-3 h-3" />
                {task.commentCount}
              </span>
            )}
          </div>
          <ReactionBar id={`task:${task.id}`} className="pt-0.5" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Column ───────────────────────────────────────────────────────────────────

function TaskColumn({
  column,
  tasks,
  moveInColumn,
  moveBetweenColumns,
  onTaskClick,
  onAddClick,
}: {
  column: TaskColumnDef;
  tasks: TaskItem[];
  moveInColumn: (colId: string, dragIdx: number, hoverIdx: number) => void;
  moveBetweenColumns: (srcCol: string, dragIdx: number, tgtCol: string, tgtIdx: number) => void;
  onTaskClick?: (task: TaskItem) => void;
  onAddClick?: (columnId: string) => void;
}) {
  const [{ isOver }, dropRef] = useDrop<TaskDragItem, void, { isOver: boolean }>({
    accept: TASK_CARD,
    collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
    hover(item) {
      if (item.sourceColumnId !== column.id && tasks.length === 0) {
        moveBetweenColumns(item.sourceColumnId, item.index, column.id, 0);
        item.sourceColumnId = column.id;
        item.index = 0;
      }
    },
  });

  return (
    <div
      ref={dropRef as any}
      className={cn(
        "flex flex-col w-[260px] shrink-0 transition-colors",
        isOver && "bg-primary/5 rounded-xl"
      )}
    >
      <div className="px-3 pt-1 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground truncate">{column.label}</h4>
          </div>
          <span className="text-xs text-muted-foreground tabular-nums bg-muted rounded-full px-2 py-0.5">
            {tasks.length}
          </span>
        </div>
      </div>
      <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[360px]">
        <AnimatePresence initial={false}>
          {tasks.map((task, idx) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              index={idx}
              columnId={column.id}
              moveInColumn={moveInColumn}
              moveBetweenColumns={moveBetweenColumns}
              onClick={onTaskClick}
            />
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-16 text-xs text-muted-foreground/50 border border-dashed border-border/40 rounded-lg">
            Drop tasks here
          </div>
        )}
      </div>
      <div className="p-2 pt-0">
        <button
          type="button"
          onClick={() => onAddClick?.(column.id)}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg border border-dashed border-border/50 hover:border-border transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add task
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TaskBoardPreview — inline board shown in the post feed
// ═══════════════════════════════════════════════════════════════════════════════

export interface TaskBoardPreviewProps {
  columns: TaskColumnDef[];
  tasks: TaskItem[];
}

export function TaskBoardPreview({ columns, tasks: initialTasks }: TaskBoardPreviewProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);

  const tasksByColumn = useMemo(() => {
    const map: Record<string, TaskItem[]> = {};
    for (const col of columns) map[col.id] = [];
    for (const t of tasks) {
      if (map[t.status]) map[t.status].push(t);
    }
    return map;
  }, [tasks, columns]);

  const moveInColumn = useCallback((colId: string, dragIdx: number, hoverIdx: number) => {
    setTasks((prev) => {
      const colTasks = prev.filter((t) => t.status === colId);
      const others = prev.filter((t) => t.status !== colId);
      const [moved] = colTasks.splice(dragIdx, 1);
      colTasks.splice(hoverIdx, 0, moved);
      return [...others, ...colTasks];
    });
  }, []);

  const moveBetweenColumns = useCallback(
    (srcCol: string, dragIdx: number, tgtCol: string, tgtIdx: number) => {
      setTasks((prev) => {
        const srcTasks = prev.filter((t) => t.status === srcCol);
        const [moved] = srcTasks.splice(dragIdx, 1);
        const updated = { ...moved, status: tgtCol };
        const rest = prev.filter((t) => t.id !== moved.id);
        const tgtTasks = rest.filter((t) => t.status === tgtCol);
        const others = rest.filter((t) => t.status !== tgtCol);
        tgtTasks.splice(tgtIdx, 0, updated);
        return [...others, ...tgtTasks];
      });
    },
    []
  );

  const handleAddTask = useCallback((colId: string, title: string, desc: string, tags: string[]) => {
    setTasks((prev) => [...prev, {
      id: `task-${Date.now()}`,
      title, description: desc || undefined,
      tags: tags.length > 0 ? tags : undefined,
      status: colId, author: "You", createdDate: "just now", commentCount: 0, comments: [],
    }]);
  }, []);

  const handleAddComment = useCallback((taskId: string, text: string) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        comments: [...(t.comments || []), { id: `c-${Date.now()}`, author: "You", text, time: "just now" }],
        commentCount: (t.commentCount || 0) + 1,
      };
    }));
    setSelectedTask((prev) => prev && prev.id === taskId ? {
      ...prev,
      comments: [...(prev.comments || []), { id: `c-${Date.now()}`, author: "You", text, time: "just now" }],
      commentCount: (prev.commentCount || 0) + 1,
    } : prev);
  }, []);

  const selectedColumn = selectedTask ? columns.find((c) => c.id === selectedTask.status) : null;
  const addColumnLabel = columns.find((c) => c.id === addingToColumn)?.label || "";
  const [expanded, setExpanded] = useState(false);

  const boardContent = (fullHeight: boolean) => (
    <DndProvider backend={HTML5Backend}>
      <div className={cn("flex items-start gap-3 overflow-x-auto pb-2 -mx-2 px-2", fullHeight && "h-full items-stretch")}>
        {columns.map((col) => (
          <TaskColumn
            key={col.id}
            column={col}
            tasks={tasksByColumn[col.id] || []}
            moveInColumn={moveInColumn}
            moveBetweenColumns={moveBetweenColumns}
            onTaskClick={(task) => setSelectedTask(task)}
            onAddClick={(colId) => setAddingToColumn(colId)}
          />
        ))}
      </div>
    </DndProvider>
  );

  return (
    <div className="mt-6 pt-6 border-t">
      {/* Expand button */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-label font-semibold text-muted-foreground">
          TASKS ({tasks.length})
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setExpanded(true)}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          Expand
        </Button>
      </div>

      {/* Inline board */}
      {boardContent(false)}

      {/* Expanded full-screen dialog */}
      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[95vw] h-[95vh] p-0 gap-0 overflow-hidden flex flex-col bg-background border-none shadow-2xl rounded-xl z-50">
          <DialogHeader className="px-6 py-4 border-b shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base">Task Board</DialogTitle>
              <span className="text-xs text-muted-foreground">{tasks.length} tasks · Drag to change status</span>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-x-auto p-6">
            {boardContent(true)}
          </div>
        </DialogContent>
      </Dialog>

      {/* Task detail dialog */}
      <TaskDetailDialog
        open={selectedTask !== null}
        onOpenChange={(open) => { if (!open) setSelectedTask(null); }}
        task={selectedTask}
        columnLabel={selectedColumn?.label || ""}
        columnColor={selectedColumn?.color}
        onAddComment={handleAddComment}
      />

      {/* Add task dialog */}
      <AddTaskDialog
        open={addingToColumn !== null}
        onOpenChange={(open) => { if (!open) setAddingToColumn(null); }}
        columnLabel={addColumnLabel}
        onSubmit={(title, desc, tags) => {
          if (addingToColumn) handleAddTask(addingToColumn, title, desc, tags);
          setAddingToColumn(null);
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Task Detail Dialog — shows author + created date (labeled)
// ═══════════════════════════════════════════════════════════════════════════════

function TaskDetailDialog({
  open, onOpenChange, task, columnLabel, columnColor, onAddComment,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: TaskItem | null;
  columnLabel: string;
  columnColor?: string;
  onAddComment: (taskId: string, text: string) => void;
}) {
  const [commentText, setCommentText] = useState("");
  if (!task) return null;

  const handleSubmit = () => {
    if (!commentText.trim()) return;
    onAddComment(task.id, commentText.trim());
    setCommentText("");
  };

  const comments = task.comments || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] p-0 gap-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => onOpenChange(false)} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base">{task.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs gap-1.5 font-normal">
                  {columnLabel}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Description + metadata */}
          <div className="px-6 py-5 border-b space-y-4">
            {task.description ? (
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{task.description}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">No description provided.</p>
            )}
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-muted text-muted-foreground rounded-md px-2 py-1">{tag}</span>
                ))}
              </div>
            )}
            {/* Author + date — labeled clearly */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
              {task.author && (
                <span>Created by <span className="font-medium text-foreground">{task.author}</span></span>
              )}
              {task.createdDate && (
                <span>Created <span className="font-medium text-foreground">{task.createdDate}</span></span>
              )}
            </div>
            <ReactionBar id={`task:${task.id}`} />
          </div>

          {/* Comments */}
          <div className="px-6 py-4">
            <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Comments
              {comments.length > 0 && <span className="text-xs text-muted-foreground font-normal">({comments.length})</span>}
            </h4>
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <Avatar className="w-7 h-7 shrink-0 mt-0.5">
                      <AvatarFallback className="text-[10px]">{c.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{c.author}</span>
                        <span className="text-xs text-muted-foreground">{c.time}</span>
                      </div>
                      <p className="text-sm text-foreground/90 mt-0.5 leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground/60 text-center py-6">No comments yet.</p>
            )}
          </div>
        </div>

        {/* Comment input */}
        <div className="px-6 py-3 border-t bg-muted/5 shrink-0">
          <div className="flex gap-2">
            <Textarea
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
              rows={1}
              className="min-h-[38px] resize-none"
            />
            <Button size="icon" onClick={handleSubmit} disabled={!commentText.trim()} className="shrink-0 h-[38px] w-[38px]">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Add Task Dialog
// ═══════════════════════════════════════════════════════════════════════════════

function AddTaskDialog({
  open, onOpenChange, columnLabel, onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columnLabel: string;
  onSubmit: (title: string, description: string, tags: string[]) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit(title.trim(), description.trim(), tagsInput.split(",").map(t => t.trim()).filter(Boolean));
    setTitle(""); setDescription(""); setTagsInput("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Plus className="w-4 h-4 text-primary" />
            Add task to "{columnLabel}"
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="task-title">Title</Label>
            <Input id="task-title" placeholder="What needs to be done?" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) handleSubmit(); }} autoFocus />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-desc">Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Textarea id="task-desc" placeholder="Add more context..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-tags">Tags <span className="text-muted-foreground font-normal">(optional, comma-separated)</span></Label>
            <Input id="task-tags" placeholder="e.g. urgent, backend" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>Add task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Configure Task Columns Dialog (used from AddPostModal)
// ═══════════════════════════════════════════════════════════════════════════════

export interface ConfigureTaskColumnsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: TaskColumnDef[];
  onSave: (columns: TaskColumnDef[]) => void;
}

const DEFAULT_COLORS = ["#6b7280", "#2563eb", "#d97706", "#16a34a", "#dc2626", "#7c3aed", "#0891b2"];

export function ConfigureTaskColumnsDialog({ open, onOpenChange, columns: initial, onSave }: ConfigureTaskColumnsDialogProps) {
  const [cols, setCols] = useState<TaskColumnDef[]>(initial);

  const addColumn = () => {
    const id = `col-${Date.now()}`;
    setCols((prev) => [...prev, { id, label: "", color: DEFAULT_COLORS[prev.length % DEFAULT_COLORS.length] }]);
  };

  const removeColumn = (id: string) => setCols((prev) => prev.filter((c) => c.id !== id));

  const updateLabel = (id: string, label: string) => setCols((prev) => prev.map((c) => c.id === id ? { ...c, label } : c));

  const updateColor = (id: string, color: string) => setCols((prev) => prev.map((c) => c.id === id ? { ...c, color } : c));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configure task columns</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2 max-h-[50vh] overflow-y-auto">
          {cols.map((col, idx) => (
            <div key={col.id} className="flex items-center gap-2">
              <Input
                value={col.label}
                onChange={(e) => updateLabel(col.id, e.target.value)}
                placeholder={`Column ${idx + 1}`}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => removeColumn(col.id)}
                disabled={cols.length <= 1}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="w-full gap-2" onClick={addColumn}>
          <Plus className="w-3.5 h-3.5" />
          Add column
        </Button>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => { onSave(cols.filter((c) => c.label.trim())); onOpenChange(false); }}
            disabled={cols.every((c) => !c.label.trim())}
          >
            Save columns
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Task response type components:
 * - TaskBoardPreview: inline kanban board shown in feed (no author/date on cards)
 * - TaskDetailDialog: full task view with author, date, description, comments
 * - ConfigureTaskColumnsDialog: admin dialog for defining columns
 */
import { useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Maximize2,
  MessageSquare,
  Plus,
  Send,
  Trash2,
  X
} from "lucide-react";
import { cn } from "@/crd/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/crd/primitives/avatar";
import { Badge } from "@/crd/primitives/badge";
import { Button } from "@/crd/primitives/button";
import { Input } from "@/crd/primitives/input";
import { Label } from "@/crd/primitives/label";
import { Textarea } from "@/crd/primitives/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/crd/primitives/dialog";
import { ReactionBar } from "@/app/components/space/PostReactions";
import {
  TaskBoardView,
  type TaskBoardColumnModel
} from "@/crd/components/callout/task-board/TaskBoardView";

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

  /**
   * TaskBoardView reports the board's full new card order rather than drag/hover
   * indices, so reordering is a single reconciliation: re-tag the moved card's
   * column, then sort every task by its position in the reported order.
   */
  const applyOrder = useCallback((orderedCardIds: string[], movedId?: string, toColumnId?: string) => {
    setTasks(prev => {
      const rank = new Map(orderedCardIds.map((id, i) => [id, i]));
      return prev
        .map(t => (movedId && toColumnId && t.id === movedId ? { ...t, status: toColumnId } : t))
        .sort((a, b) => (rank.get(a.id) ?? 0) - (rank.get(b.id) ?? 0));
    });
  }, []);

  const handleAddTask = useCallback((colId: string, title: string, desc: string, tags: string[]) => {
    setTasks((prev) => [...prev, {
      id: `task-${Date.now()}`,
      title, description: desc || undefined,
      tags: tags.length > 0 ? tags : undefined,
      status: colId, author: "You", createdDate: "just now", commentCount: 0, comments: []
    }]);
  }, []);

  const handleAddComment = useCallback((taskId: string, text: string) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        comments: [...(t.comments || []), { id: `c-${Date.now()}`, author: "You", text, time: "just now" }],
        commentCount: (t.commentCount || 0) + 1
      };
    }));
    setSelectedTask((prev) => prev && prev.id === taskId ? {
      ...prev,
      comments: [...(prev.comments || []), { id: `c-${Date.now()}`, author: "You", text, time: "just now" }],
      commentCount: (prev.commentCount || 0) + 1
    } : prev);
  }, []);

  const selectedColumn = selectedTask ? columns.find((c) => c.id === selectedTask.status) : null;
  const addColumnLabel = columns.find((c) => c.id === addingToColumn)?.label || "";
  const [expanded, setExpanded] = useState(false);

  // TaskBoardView addresses columns by name; the prototype's fixtures key them
  // by id, so translate on the way in and back on the way out.
  const columnIdByName = useMemo(
    () => new Map(columns.map(c => [c.label, c.id])),
    [columns]
  );

  const boardColumns = useMemo<TaskBoardColumnModel[]>(
    () =>
      columns.map(col => {
        const colTasks = tasksByColumn[col.id] || [];
        return {
          name: col.label,
          count: colTasks.length,
          cards: colTasks.map(t => ({
            id: t.id,
            title: t.title,
            description: t.description,
            tags: t.tags,
            commentCount: t.commentCount
          }))
        };
      }),
    [columns, tasksByColumn]
  );

  const boardContent = (fullHeight: boolean) => (
    <TaskBoardView
      columns={boardColumns}
      fill={fullHeight}
      canAdd
      canMove
      onAddTask={name => setAddingToColumn(columnIdByName.get(name) ?? null)}
      onOpenTask={cardId => setSelectedTask(tasks.find(t => t.id === cardId) ?? null)}
      onMoveTask={(cardId, toColumn, orderedCardIds) =>
        applyOrder(orderedCardIds, cardId, columnIdByName.get(toColumn))
      }
      onReorder={orderedCardIds => applyOrder(orderedCardIds)}
    />
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
 className="h-7 gap-1.5 text-muted-foreground hover:text-foreground"
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
              <DialogTitle className="text-subheader font-normal">Task Board</DialogTitle>
              <span className="text-caption text-muted-foreground">{tasks.length} tasks · Drag to change status</span>
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
  open, onOpenChange, task, columnLabel, columnColor, onAddComment
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
              <DialogTitle className="text-subheader font-normal">{task.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-caption gap-1.5 font-normal">
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
              <p className="text-body text-foreground leading-relaxed whitespace-pre-wrap">{task.description}</p>
            ) : (
              <p className="text-body text-muted-foreground italic">No description provided.</p>
            )}
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <span key={tag} className="text-caption bg-muted text-muted-foreground rounded-md px-2 py-1">{tag}</span>
                ))}
              </div>
            )}
            {/* Author + date — labeled clearly */}
            <div className="flex items-center gap-4 text-caption text-muted-foreground pt-2">
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
            <h4 className="text-card-title text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Comments
              {comments.length > 0 && <span className="text-caption text-muted-foreground font-normal">({comments.length})</span>}
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
                        <span className="text-body-emphasis text-foreground">{c.author}</span>
                        <span className="text-caption text-muted-foreground">{c.time}</span>
                      </div>
                      <p className="text-body text-foreground/90 mt-0.5 leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body text-muted-foreground/60 text-center py-6">No comments yet.</p>
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
  open, onOpenChange, columnLabel, onSubmit
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
          <DialogTitle className="flex items-center gap-2 text-subheader font-normal">
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

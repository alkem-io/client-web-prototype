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
  MessageSquare,
  ChevronsRight,
  FileText,
  Presentation,
  StickyNote,
  Images,
  Megaphone,
  BarChart3
} from "lucide-react";
import { cn } from "@/crd/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/crd/primitives/avatar";
import type { CalloutTab } from "@/app/components/space/ChannelTabs";
import type { PostCardData } from "@/app/components/space/PostCard";

// ─── Compact Board Card ───────────────────────────────────────────────────────

const TYPE_ICONS: Record<string, React.ElementType> = {
  text: FileText,
  whiteboard: Presentation,
  memo: StickyNote,
  mediaGallery: Images,
  callToAction: Megaphone,
  poll: BarChart3,
  document: FileText,
  "call-for-whiteboards": Presentation,
  collection: FileText
};

interface BoardPostCardProps {
  post: PostCardData & { callout: string };
  onClick?: (post: PostCardData) => void;
  /** Rendered inside the DragOverlay — no sortable wiring, no fade. */
  overlay?: boolean;
}

function BoardPostCard({ post, onClick, overlay = false }: BoardPostCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: post.id,
    data: { type: "card", phaseId: post.callout },
    disabled: overlay
  });

  // The overlay carries the floating visual, so the in-list node only slides to
  // its slot and fades to read as the drop placeholder.
  const style = overlay
    ? undefined
    : {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition
      };

  const TypeIcon = TYPE_ICONS[post.type] || FileText;
  const comments = (post as any).stats?.comments ?? post.commentCount ?? 0;

  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      style={style}
      className={cn(
        "group/card bg-background border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing touch-none",
        "hover:border-primary/30 hover:shadow-sm transition-all",
        isDragging && "opacity-30 border-dashed",
        overlay && "shadow-lg rotate-2"
      )}
      onClick={() => onClick?.(post)}
      {...(overlay ? {} : attributes)}
      {...(overlay ? {} : listeners)}
    >
      {/* Type badge + grip */}
      <div className="flex items-start gap-2">
        <GripVertical className="w-3.5 h-3.5 mt-0.5 text-muted-foreground/30 group-hover/card:text-muted-foreground/60 shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          {/* Title */}
          <p className="text-body-emphasis leading-snug line-clamp-2 text-foreground">
            {post.title}
          </p>
          {/* Snippet */}
          {post.snippet && (
            <p className="text-caption text-muted-foreground line-clamp-2 leading-relaxed">
              {post.snippet}
            </p>
          )}
          {/* Footer: author + comments */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 min-w-0">
              {post.author && (
                <>
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={post.author.avatarUrl} />
                    <AvatarFallback className="text-[9px]">
                      {post.author.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-caption text-muted-foreground truncate">
                    {post.author.name.split(" ")[0]}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <TypeIcon className="w-3 h-3 text-muted-foreground/60" />
              {comments > 0 && (
                <span className="flex items-center gap-0.5 text-caption text-muted-foreground">
                  <MessageSquare className="w-3 h-3" />
                  {comments}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Phase Column ─────────────────────────────────────────────────────────────

interface PhaseColumnProps {
  phase: CalloutTab;
  posts: (PostCardData & { callout: string })[];
  onPostClick?: (post: PostCardData) => void;
  isLast: boolean;
}

function PhaseColumn({ phase, posts, onPostClick, isLast }: PhaseColumnProps) {
  // The column is a droppable in its own right so a card can be dropped into an
  // empty column, where there is no sibling card to collide with.
  const { setNodeRef, isOver } = useDroppable({
    id: toColumnDroppableId(phase.id),
    data: { type: "column", phaseId: phase.id }
  });

  return (
    <div className="flex items-stretch shrink-0">
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-col w-[280px] min-h-[400px] rounded-xl border border-border/60 bg-muted/30 transition-colors",
          isOver && "border-primary/40 bg-primary/5"
        )}
      >
        {/* Column Header */}
        <div className="px-3 pt-3 pb-2 border-b border-border/40">
          <div className="flex items-center justify-between">
            <h3 className="text-card-title text-foreground truncate">
              {phase.label}
            </h3>
            <span className="text-caption text-muted-foreground tabular-nums bg-muted rounded-full px-2 py-0.5">
              {posts.length}
            </span>
          </div>
          {phase.description && (
            <p className="text-caption text-muted-foreground mt-1 line-clamp-1">
              {phase.description}
            </p>
          )}
        </div>

        {/* Cards */}
        <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-300px)]">
          <SortableContext items={posts.map(p => p.id)} strategy={verticalListSortingStrategy}>
            {posts.map(post => (
              <BoardPostCard key={post.id} post={post} onClick={onPostClick} />
            ))}
          </SortableContext>
          {posts.length === 0 && (
            <div className="flex items-center justify-center h-24 text-caption text-muted-foreground/60 border border-dashed border-border/50 rounded-lg">
              Drop posts here
            </div>
          )}
        </div>
      </div>

      {/* Flow arrow between columns */}
      {!isLast && phase.linkedToNext && (
        <div className="flex items-center px-1.5 text-muted-foreground/40">
          <ChevronsRight className="w-4 h-4" />
        </div>
      )}
      {!isLast && !phase.linkedToNext && (
        <div className="w-3 shrink-0" />
      )}
    </div>
  );
}

// ─── Board View (exported) ────────────────────────────────────────────────────

interface SubspaceBoardViewProps {
  phases: CalloutTab[];
  posts: (PostCardData & { callout: string })[];
  onPostClick?: (post: PostCardData) => void;
}

export function SubspaceBoardView({ phases, posts: initialPosts, onPostClick }: SubspaceBoardViewProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useBoardSensors();

  // Group posts by phase
  const postsByPhase = useMemo(() => {
    const map: Record<string, (PostCardData & { callout: string })[]> = {};
    for (const phase of phases) {
      map[phase.id] = [];
    }
    for (const post of posts) {
      if (map[post.callout]) {
        map[post.callout].push(post);
      }
    }
    return map;
  }, [posts, phases]);

  const activePost = activeId ? posts.find(p => p.id === activeId) : undefined;

  /** Which phase is the drop target: a column droppable, or the card being hovered. */
  const resolvePhaseId = useCallback(
    (overId: string): string | undefined =>
      fromColumnDroppableId(overId) ?? posts.find(p => p.id === overId)?.callout,
    [posts]
  );

  /**
   * Move a post next to `overId` (or to the end of `phaseId` when dropped on the
   * column itself). One reconciliation covers both reorder and cross-phase move,
   * which is why there are no separate in/between handlers any more.
   */
  const movePost = useCallback((activePostId: string, overId: string, phaseId: string) => {
    setPosts(prev => {
      const moving = prev.find(p => p.id === activePostId);
      if (!moving) return prev;

      const without = prev.filter(p => p.id !== activePostId);
      const updated = { ...moving, callout: phaseId };

      // Dropped on a card → insert at that card's position; dropped on the
      // column → append.
      const overIndex = without.findIndex(p => p.id === overId);
      if (overIndex === -1) {
        const lastOfPhase = without.map(p => p.callout).lastIndexOf(phaseId);
        without.splice(lastOfPhase + 1, 0, updated);
      } else {
        without.splice(overIndex, 0, updated);
      }
      return without;
    });
  }, []);

  const handleDragStart = (event: DragStartEvent) => setActiveId(String(event.active.id));

  // Cross-phase only: pull the card into the hovered column mid-drag so its new
  // siblings shift aside and the gap appears under the cursor. Same-phase
  // reordering is handled natively by SortableContext.
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activePostId = String(active.id);
    const overId = String(over.id);
    if (activePostId === overId) return;

    const sourcePhaseId = posts.find(p => p.id === activePostId)?.callout;
    const targetPhaseId = resolvePhaseId(overId);
    if (!sourcePhaseId || !targetPhaseId || sourcePhaseId === targetPhaseId) return;

    movePost(activePostId, overId, targetPhaseId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activePostId = String(active.id);
    const overId = String(over.id);
    const targetPhaseId = resolvePhaseId(overId);
    if (!targetPhaseId) return;

    movePost(activePostId, overId, targetPhaseId);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={boardCollisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex items-start gap-0 overflow-x-auto pb-4 -mx-2 px-2">
        {phases.map((phase, idx) => (
          <PhaseColumn
            key={phase.id}
            phase={phase}
            posts={postsByPhase[phase.id] || []}
            onPostClick={onPostClick}
            isLast={idx === phases.length - 1}
          />
        ))}
      </div>
      {createPortal(
        <DragOverlay dropAnimation={null}>
          {activePost ? <BoardPostCard post={activePost} overlay /> : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}

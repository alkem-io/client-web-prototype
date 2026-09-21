import { useState, useRef, useCallback, useMemo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "motion/react";
import {
  GripVertical,
  MessageSquare,
  ChevronsRight,
  FileText,
  Presentation,
  StickyNote,
  Images,
  Megaphone,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import type { CalloutTab } from "@/app/components/space/ChannelTabs";
import type { PostCardData } from "@/app/components/space/PostCard";

// ─── DnD Types ────────────────────────────────────────────────────────────────
const BOARD_POST_CARD = "BOARD_POST_CARD";

interface PostDragItem {
  id: string;
  index: number;
  sourcePhaseId: string;
}

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
  collection: FileText,
};

interface BoardPostCardProps {
  post: PostCardData & { callout: string };
  index: number;
  phaseId: string;
  movePostInPhase: (phaseId: string, dragIdx: number, hoverIdx: number) => void;
  movePostBetweenPhases: (
    sourcePhaseId: string,
    dragIdx: number,
    targetPhaseId: string,
    targetIdx: number
  ) => void;
  onClick?: (post: PostCardData) => void;
}

function BoardPostCard({
  post,
  index,
  phaseId,
  movePostInPhase,
  movePostBetweenPhases,
  onClick,
}: BoardPostCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<PostDragItem, void, { handlerId: string | symbol | null }>({
    accept: BOARD_POST_CARD,
    collect: (monitor) => ({ handlerId: monitor.getHandlerId() }),
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (item.sourcePhaseId === phaseId && dragIndex === hoverIndex) return;
      const rect = ref.current.getBoundingClientRect();
      const midY = (rect.bottom - rect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverY = clientOffset.y - rect.top;
      if (item.sourcePhaseId === phaseId) {
        if (dragIndex < hoverIndex && hoverY < midY) return;
        if (dragIndex > hoverIndex && hoverY > midY) return;
        movePostInPhase(phaseId, dragIndex, hoverIndex);
        item.index = hoverIndex;
        return;
      }
      movePostBetweenPhases(item.sourcePhaseId, dragIndex, phaseId, hoverIndex);
      item.sourcePhaseId = phaseId;
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: BOARD_POST_CARD,
    item: (): PostDragItem => ({ id: post.id, index, sourcePhaseId: phaseId }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(drop(ref));

  const TypeIcon = TYPE_ICONS[post.type] || FileText;
  const comments = (post as any).stats?.comments ?? post.commentCount ?? 0;

  return (
    <motion.div
      ref={ref}
      data-handler-id={handlerId}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "group/card bg-background border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing",
        "hover:border-primary/30 hover:shadow-sm transition-all",
        isDragging && "opacity-30 border-dashed"
      )}
      onClick={() => onClick?.(post)}
    >
      {/* Type badge + grip */}
      <div className="flex items-start gap-2">
        <GripVertical className="w-3.5 h-3.5 mt-0.5 text-muted-foreground/30 group-hover/card:text-muted-foreground/60 shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          {/* Title */}
          <p className="text-sm font-medium leading-snug line-clamp-2 text-foreground">
            {post.title}
          </p>
          {/* Snippet */}
          {post.snippet && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
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
                  <span className="text-xs text-muted-foreground truncate">
                    {post.author.name.split(" ")[0]}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <TypeIcon className="w-3 h-3 text-muted-foreground/60" />
              {comments > 0 && (
                <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                  <MessageSquare className="w-3 h-3" />
                  {comments}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Phase Column ─────────────────────────────────────────────────────────────

interface PhaseColumnProps {
  phase: CalloutTab;
  posts: (PostCardData & { callout: string })[];
  allPhases: CalloutTab[];
  movePostInPhase: (phaseId: string, dragIdx: number, hoverIdx: number) => void;
  movePostBetweenPhases: (
    sourcePhaseId: string,
    dragIdx: number,
    targetPhaseId: string,
    targetIdx: number
  ) => void;
  onPostClick?: (post: PostCardData) => void;
  isLast: boolean;
}

function PhaseColumn({
  phase,
  posts,
  allPhases,
  movePostInPhase,
  movePostBetweenPhases,
  onPostClick,
  isLast,
}: PhaseColumnProps) {
  const [{ isOver }, dropRef] = useDrop<PostDragItem, void, { isOver: boolean }>({
    accept: BOARD_POST_CARD,
    collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
    hover(item) {
      // Allow dropping into empty columns
      if (item.sourcePhaseId !== phase.id && posts.length === 0) {
        movePostBetweenPhases(item.sourcePhaseId, item.index, phase.id, 0);
        item.sourcePhaseId = phase.id;
        item.index = 0;
      }
    },
  });

  return (
    <div className="flex items-stretch shrink-0">
      <div
        ref={dropRef as any}
        className={cn(
          "flex flex-col w-[280px] min-h-[400px] rounded-xl border border-border/60 bg-muted/30 transition-colors",
          isOver && "border-primary/40 bg-primary/5"
        )}
      >
        {/* Column Header */}
        <div className="px-3 pt-3 pb-2 border-b border-border/40">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground truncate">
              {phase.label}
            </h3>
            <span className="text-xs text-muted-foreground tabular-nums bg-muted rounded-full px-2 py-0.5">
              {posts.length}
            </span>
          </div>
          {phase.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {phase.description}
            </p>
          )}
        </div>

        {/* Cards */}
        <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-300px)]">
          <AnimatePresence initial={false}>
            {posts.map((post, idx) => (
              <BoardPostCard
                key={post.id}
                post={post}
                index={idx}
                phaseId={phase.id}
                movePostInPhase={movePostInPhase}
                movePostBetweenPhases={movePostBetweenPhases}
                onClick={onPostClick}
              />
            ))}
          </AnimatePresence>
          {posts.length === 0 && (
            <div className="flex items-center justify-center h-24 text-xs text-muted-foreground/60 border border-dashed border-border/50 rounded-lg">
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

  const movePostInPhase = useCallback((phaseId: string, dragIdx: number, hoverIdx: number) => {
    setPosts((prev) => {
      const phasePosts = prev.filter((p) => p.callout === phaseId);
      const otherPosts = prev.filter((p) => p.callout !== phaseId);
      const [moved] = phasePosts.splice(dragIdx, 1);
      phasePosts.splice(hoverIdx, 0, moved);
      return [...otherPosts, ...phasePosts];
    });
  }, []);

  const movePostBetweenPhases = useCallback(
    (sourcePhaseId: string, dragIdx: number, targetPhaseId: string, targetIdx: number) => {
      setPosts((prev) => {
        const sourcePosts = prev.filter((p) => p.callout === sourcePhaseId);
        const [moved] = sourcePosts.splice(dragIdx, 1);
        const updated = { ...moved, callout: targetPhaseId };
        const next = prev.filter((p) => p.id !== moved.id);
        // Insert at target index
        const targetPosts = next.filter((p) => p.callout === targetPhaseId);
        const otherPosts = next.filter((p) => p.callout !== targetPhaseId);
        targetPosts.splice(targetIdx, 0, updated);
        return [...otherPosts, ...targetPosts];
      });
    },
    []
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex items-start gap-0 overflow-x-auto pb-4 -mx-2 px-2">
        {phases.map((phase, idx) => (
          <PhaseColumn
            key={phase.id}
            phase={phase}
            posts={postsByPhase[phase.id] || []}
            allPhases={phases}
            movePostInPhase={movePostInPhase}
            movePostBetweenPhases={movePostBetweenPhases}
            onPostClick={onPostClick}
            isLast={idx === phases.length - 1}
          />
        ))}
      </div>
    </DndProvider>
  );
}

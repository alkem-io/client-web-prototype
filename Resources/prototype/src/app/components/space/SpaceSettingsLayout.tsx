import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Users,
  Layers,
  BookOpen,
  GripVertical,
  Pencil,
  RotateCcw,
  Save,
  Check,
  Loader2,
  Undo2,
  MessageSquare,
  Calendar,
  FileText,
  Image as ImageIcon,
  Video,
  Map,
  Globe,
  Smile,
  Star,
  Heart,
  Zap,
  Activity,
  Grid,
  List,
  Layout as LayoutIcon,
  Search,
  Settings,
  Bell,
  Mail,
  Briefcase,
  ChevronDown,
  MoreVertical,
  ArrowRight,
  Eye,
  EyeOff,
  XCircle,
  Plus,
  Trash2,
  PanelLeft,
  PanelLeftClose,
  EyeOff as PanelLeftOff,
  AlignLeft,
  Tag,
  Layers as LayersIcon,
  ListOrdered,
  FileEdit,
  UserPlus,
  MessageSquarePlus,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { IconButton } from "@/app/components/ui/icon-button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Switch } from "@/app/components/ui/switch";
import { Label } from "@/app/components/ui/label";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/app/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/app/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { SaveBar } from "@/app/components/shared/SaveBar";
import { UnsavedChangesGuard } from "@/app/components/shared/UnsavedChangesGuard";
import { SettingsSection } from "@/app/components/shared/SettingsSection";

// ─── Types ────────────────────────────────────────────────────────────────────
type TabId = "home" | "community" | "subspaces" | "knowledge";

interface TabItem {
  id: TabId;
  label: string;
  defaultLabel: string;
  icon: React.ElementType;
  description: string;
  defaultIndex: number;
}

interface PostEntry {
  id: string;
  title: string;
  responses?: number;
}

type TabPosts = Record<TabId, PostEntry[]>;

// ─── Constants ────────────────────────────────────────────────────────────────
const AVAILABLE_ICONS = [
  { icon: Home, label: "Home" },
  { icon: Users, label: "Users" },
  { icon: Layers, label: "Layers" },
  { icon: BookOpen, label: "Book" },
  { icon: MessageSquare, label: "Chat" },
  { icon: Calendar, label: "Calendar" },
  { icon: FileText, label: "Document" },
  { icon: ImageIcon, label: "Image" },
  { icon: Video, label: "Video" },
  { icon: Map, label: "Map" },
  { icon: Globe, label: "Globe" },
  { icon: Smile, label: "Smile" },
  { icon: Star, label: "Star" },
  { icon: Heart, label: "Heart" },
  { icon: Zap, label: "Zap" },
  { icon: Activity, label: "Activity" },
  { icon: Grid, label: "Grid" },
  { icon: List, label: "List" },
  { icon: LayoutIcon, label: "Layout" },
  { icon: Search, label: "Search" },
  { icon: Settings, label: "Settings" },
  { icon: Bell, label: "Bell" },
  { icon: Mail, label: "Mail" },
  { icon: Briefcase, label: "Briefcase" },
];

const DEFAULT_TABS: TabItem[] = [
  {
    id: "home",
    label: "Home",
    defaultLabel: "Home",
    icon: Home,
    description:
      "The main landing page for your space, showcasing highlights and pinned content.",
    defaultIndex: 0,
  },
  {
    id: "community",
    label: "Community",
    defaultLabel: "Community",
    icon: Users,
    description: "Member directory and profiles associated with this space.",
    defaultIndex: 1,
  },
  {
    id: "subspaces",
    label: "Subspaces",
    defaultLabel: "Subspaces",
    icon: Layers,
    description:
      "Child spaces and projects organized under this parent space.",
    defaultIndex: 2,
  },
  {
    id: "knowledge",
    label: "Knowledge",
    defaultLabel: "Knowledge",
    icon: BookOpen,
    description: "Wiki, documentation, and shared resources for members.",
    defaultIndex: 3,
  },
];

const DEFAULT_POSTS: TabPosts = {
  home: [
    { id: "p-h1", title: "Welcome to the Sandbox", responses: 1 },
    { id: "p-h2", title: "Backlog of Insanity", responses: 4 },
    { id: "p-h3", title: "Project Kickoff Notes" },
  ],
  community: [
    { id: "p-c1", title: "Softmann Radio #1" },
    { id: "p-c2", title: "Supreme Funk Playlist" },
    { id: "p-c3", title: "Cosmic Bangherz" },
  ],
  subspaces: [],
  knowledge: [
    { id: "p-k1", title: "Design Research Knowledge", responses: 3 },
  ],
};

// ─── DnD Item Types ───────────────────────────────────────────────────────────
const POST_CARD = "POST_CARD";
const TAB_COLUMN = "TAB_COLUMN";

interface PostDragItem {
  id: string;
  index: number;
  sourceTabId: TabId;
}

interface ColumnDragItem {
  id: string;
  index: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — Post Card (draggable within & between columns)
// ═══════════════════════════════════════════════════════════════════════════════

interface PostCardProps {
  post: PostEntry;
  index: number;
  tabId: TabId;
  allTabs: TabItem[];
  movePostInColumn: (tabId: TabId, dragIdx: number, hoverIdx: number) => void;
  movePostBetweenColumns: (
    sourceTabId: TabId,
    dragIdx: number,
    targetTabId: TabId,
    targetIdx: number
  ) => void;
  onRemove: (postId: string, tabId: TabId) => void;
  onMoveToTab: (postId: string, fromTab: TabId, toTab: TabId) => void;
}

const PostCard = ({
  post,
  index,
  tabId,
  allTabs,
  movePostInColumn,
  movePostBetweenColumns,
  onRemove,
  onMoveToTab,
}: PostCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    PostDragItem,
    void,
    { handlerId: string | symbol | null }
  >({
    accept: POST_CARD,
    collect: (monitor) => ({ handlerId: monitor.getHandlerId() }),
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (item.sourceTabId === tabId && dragIndex === hoverIndex) return;

      const rect = ref.current.getBoundingClientRect();
      const midY = (rect.bottom - rect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverY = clientOffset.y - rect.top;

      // Same column — simple reorder
      if (item.sourceTabId === tabId) {
        if (dragIndex < hoverIndex && hoverY < midY) return;
        if (dragIndex > hoverIndex && hoverY > midY) return;
        movePostInColumn(tabId, dragIndex, hoverIndex);
        item.index = hoverIndex;
        return;
      }

      // Cross-column — insert at hoverIndex position
      movePostBetweenColumns(item.sourceTabId, dragIndex, tabId, hoverIndex);
      item.sourceTabId = tabId;
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: POST_CARD,
    item: (): PostDragItem => ({ id: post.id, index, sourceTabId: tabId }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(drop(ref));

  const otherTabs = allTabs.filter((t) => t.id !== tabId);

  return (
    <motion.div
      ref={ref}
      data-handler-id={handlerId}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, height: 0 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "flex items-center gap-2 px-2.5 py-2 bg-background border border-border rounded-lg",
        "cursor-grab active:cursor-grabbing group/post",
        "hover:border-primary/30 transition-all",
        isDragging && "opacity-30 border-dashed"
      )}
    >
      <GripVertical className="w-3.5 h-3.5 text-muted-foreground/30 group-hover/post:text-muted-foreground/60 shrink-0" />

      <span className="flex-1 min-w-0 text-caption font-medium line-clamp-2 text-foreground">
        {post.title}
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            variant="ghost"
            tooltipLabel="More options"
            className="w-6 h-6 shrink-0 opacity-0 group-hover/post:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              Move to
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {otherTabs.map((t) => {
                const TIcon = t.icon;
                return (
                  <DropdownMenuItem
                    key={t.id}
                    onClick={() => onMoveToTab(post.id, tabId, t.id)}
                  >
                    <TIcon className="w-3.5 h-3.5 mr-2" />
                    {t.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem>
            <Eye className="w-4 h-4 mr-2" />
            View Post
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — Kanban Column (collapsible, drop target)
// ═══════════════════════════════════════════════════════════════════════════════

interface KanbanColumnProps {
  tab: TabItem;
  posts: PostEntry[];
  allTabs: TabItem[];
  isOpen: boolean;
  onToggle: () => void;
  onAutoExpand: () => void;
  movePostInColumn: (tabId: TabId, dragIdx: number, hoverIdx: number) => void;
  movePostBetweenColumns: (
    sourceTabId: TabId,
    dragIdx: number,
    targetTabId: TabId,
    targetIdx: number
  ) => void;
  onRemove: (postId: string, tabId: TabId) => void;
  onMoveToTab: (postId: string, fromTab: TabId, toTab: TabId) => void;
  onRename: (id: TabId, newName: string) => void;
  onDescriptionChange: (id: TabId, newDescription: string) => void;
  onIconChange: (id: TabId, newIcon: React.ElementType) => void;
  isEditing: boolean;
  setEditingId: (id: TabId | null) => void;
}

const KanbanColumn = ({
  tab,
  posts,
  allTabs,
  isOpen,
  onToggle,
  onAutoExpand,
  movePostInColumn,
  movePostBetweenColumns,
  onRemove,
  onMoveToTab,
  onRename,
  onDescriptionChange,
  onIconChange,
  isEditing,
  setEditingId,
}: KanbanColumnProps) => {
  const autoExpandTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const descInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") setEditingId(null);
  };

  const [{ isOverColumn, canDropHere }, dropRef] = useDrop<
    PostDragItem,
    void,
    { isOverColumn: boolean; canDropHere: boolean }
  >({
    accept: POST_CARD,
    collect: (monitor) => ({
      isOverColumn: monitor.isOver({ shallow: true }),
      canDropHere: monitor.canDrop(),
    }),
    hover(item) {
      if (!isOpen && autoExpandTimer.current === null) {
        autoExpandTimer.current = setTimeout(() => {
          onAutoExpand();
          autoExpandTimer.current = null;
        }, 500);
      }
      if (item.sourceTabId !== tab.id && posts.length === 0) {
        movePostBetweenColumns(item.sourceTabId, item.index, tab.id, 0);
        item.sourceTabId = tab.id;
        item.index = 0;
      }
    },
    drop(item) {
      if (item.sourceTabId !== tab.id) {
        movePostBetweenColumns(
          item.sourceTabId,
          item.index,
          tab.id,
          posts.length
        );
        item.sourceTabId = tab.id;
        item.index = posts.length;
      }
    },
  });

  useEffect(() => {
    if (!isOverColumn && autoExpandTimer.current) {
      clearTimeout(autoExpandTimer.current);
      autoExpandTimer.current = null;
    }
  }, [isOverColumn]);

  useEffect(() => {
    return () => {
      if (autoExpandTimer.current) clearTimeout(autoExpandTimer.current);
    };
  }, []);

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <div
        className={cn(
          "border border-border rounded-xl bg-card overflow-hidden transition-all",
          isOverColumn &&
            canDropHere &&
            "ring-2 ring-primary/30 ring-inset"
        )}
      >
        <div className="px-3 py-3 bg-muted/30 space-y-2">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-muted-foreground/40 shrink-0 cursor-grab active:cursor-grabbing" />

            <div className="flex-1 min-w-0 flex items-center gap-1.5 group/header">
              {isEditing ? (
                <Input
                  ref={inputRef}
                  value={tab.label}
                  onChange={(e) => onRename(tab.id, e.target.value)}
                  onBlur={() => setEditingId(null)}
                  onKeyDown={handleKeyDown}
                  className="h-6 py-0 px-1.5 text-card-title w-full max-w-[140px]"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span
                  className="text-card-title text-foreground truncate cursor-pointer hover:underline decoration-dashed underline-offset-4"
                  onClick={() => setEditingId(tab.id)}
                >
                  {tab.label}
                </span>
              )}
              {!isEditing && (
                <button
                  onClick={() => setEditingId(tab.id)}
                  className="text-muted-foreground/50 hover:text-primary transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              )}
            </div>

            <Badge variant="secondary" className="text-caption tabular-nums shrink-0">
              {posts.length}
            </Badge>

            {/* Column overflow menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-1 rounded hover:bg-muted/50 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem disabled>
                  <Check className="w-3.5 h-3.5 mr-2" />
                  Set as Active Phase
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setEditingId(tab.id)}>
                  <Pencil className="w-3.5 h-3.5 mr-2" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Set Default Post Template
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Clear Default Template
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <EyeOff className="w-3.5 h-3.5 mr-2" />
                  Hide Tab
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Delete Tab
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <CollapsibleTrigger asChild>
              <button className="p-0.5 rounded hover:bg-muted/50 transition-colors">
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200",
                    !isOpen && "-rotate-90"
                  )}
                />
              </button>
            </CollapsibleTrigger>
          </div>

          {isEditingDescription ? (
            <Input
              ref={descInputRef}
              value={tab.description}
              onChange={(e) => onDescriptionChange(tab.id, e.target.value)}
              onBlur={() => setIsEditingDescription(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") setIsEditingDescription(false);
              }}
              className="h-6 py-0 px-1.5 text-caption w-full"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="group/desc flex items-start gap-1">
              <p
                className="text-caption text-muted-foreground line-clamp-2 cursor-pointer hover:underline decoration-dashed underline-offset-4"
                onClick={() => {
                  setIsEditingDescription(true);
                  setTimeout(() => descInputRef.current?.focus(), 0);
                }}
              >
                {tab.description}
              </p>
              <button
                onClick={() => {
                  setIsEditingDescription(true);
                  setTimeout(() => descInputRef.current?.focus(), 0);
                }}
                className="text-muted-foreground/50 hover:text-primary transition-colors mt-0.5 shrink-0"
              >
                <Pencil className="w-2.5 h-2.5" />
              </button>
            </div>
          )}
        </div>

        <CollapsibleContent>
          <div
            ref={(node) => {
              dropRef(node);
            }}
            className={cn(
              "p-1.5 space-y-1.5 min-h-[60px] transition-colors",
              isOverColumn && canDropHere && "bg-primary/5"
            )}
          >
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-4">
                <span className="text-caption text-muted-foreground/50">
                  No posts assigned
                </span>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {posts.map((post, idx) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    index={idx}
                    tabId={tab.id}
                    allTabs={allTabs}
                    movePostInColumn={movePostInColumn}
                    movePostBetweenColumns={movePostBetweenColumns}
                    onRemove={onRemove}
                    onMoveToTab={onMoveToTab}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2b — Draggable Column Wrapper (for reordering kanban columns / tabs)
// ═══════════════════════════════════════════════════════════════════════════════

interface DraggableColumnWrapperProps {
  tabId: TabId;
  index: number;
  moveTab: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
}

const DraggableColumnWrapper = ({
  tabId,
  index,
  moveTab,
  children,
}: DraggableColumnWrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    ColumnDragItem,
    void,
    { handlerId: string | symbol | null }
  >({
    accept: TAB_COLUMN,
    collect: (monitor) => ({ handlerId: monitor.getHandlerId() }),
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const rect = ref.current.getBoundingClientRect();
      // Use horizontal midpoint for grid layout
      const midX = (rect.right - rect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverX = clientOffset.x - rect.left;

      if (dragIndex < hoverIndex && hoverX < midX) return;
      if (dragIndex > hoverIndex && hoverX > midX) return;

      moveTab(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: TAB_COLUMN,
    item: (): ColumnDragItem => ({ id: tabId, index }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  // Entire wrapper is drop target + preview; drag initiated from the whole column
  drop(ref);
  preview(ref);
  drag(ref);

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={cn(
        "transition-opacity",
        isDragging && "opacity-40"
      )}
    >
      {children}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3 — Main Layout Component
// ═══════════════════════════════════════════════════════════════════════════════

export function SpaceSettingsLayout() {
  const [tabs, setTabs] = useState<TabItem[]>(DEFAULT_TABS);
  const [editingId, setEditingId] = useState<TabId | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [tabPosts, setTabPosts] = useState<TabPosts>(DEFAULT_POSTS);
  const [savedTabs, setSavedTabs] = useState<TabItem[]>(DEFAULT_TABS);
  const [savedTabPosts, setSavedTabPosts] = useState<TabPosts>(DEFAULT_POSTS);
  const [expandedCols, setExpandedCols] = useState<Record<TabId, boolean>>({
    home: true,
    community: true,
    subspaces: false, // empty → collapsed by default
    knowledge: true,
  });

  const [postDescCollapsed, setPostDescCollapsed] = useState(() => {
    const stored = localStorage.getItem('alkemio-collapse-posts');
    return stored !== null ? stored === 'true' : true;
  });
  const [savedPostDescCollapsed, setSavedPostDescCollapsed] = useState(() => {
    const stored = localStorage.getItem('alkemio-collapse-posts');
    return stored !== null ? stored === 'true' : true;
  });
  const [sidebarMode, setSidebarMode] = useState<'expanded' | 'railed' | 'hidden'>('expanded');
  const [savedSidebarMode, setSavedSidebarMode] = useState<'expanded' | 'railed' | 'hidden'>('expanded');

  // Sidebar default collapsed state (expanded or railed)
  const [sidebarDefaultCollapsed, setSidebarDefaultCollapsed] = useState(() => {
    return localStorage.getItem('alkemio-sidebar-default') === 'railed';
  });
  const [savedSidebarDefaultCollapsed, setSavedSidebarDefaultCollapsed] = useState(() => {
    return localStorage.getItem('alkemio-sidebar-default') === 'railed';
  });

  // Sidebar feature toggles — per tab
  type SidebarFeatureSet = { search: boolean; tags: boolean; post: boolean; addUser: boolean; createSubspace: boolean; subspaceLinks: boolean; index: boolean };
  const defaultFeatureSet: SidebarFeatureSet = { search: true, tags: true, post: true, addUser: true, createSubspace: true, subspaceLinks: true, index: true };
  type PerTabFeatures = Record<TabId, SidebarFeatureSet>;
  const defaultPerTabFeatures: PerTabFeatures = {
    home: { ...defaultFeatureSet },
    community: { ...defaultFeatureSet, createSubspace: false, subspaceLinks: false },
    subspaces: { ...defaultFeatureSet, addUser: false },
    knowledge: { ...defaultFeatureSet, addUser: false, createSubspace: false, subspaceLinks: false },
  };
  const [sidebarFeatures, setSidebarFeatures] = useState<PerTabFeatures>(() => {
    try {
      const stored = localStorage.getItem('alkemio-sidebar-features');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults for each tab
        const merged: PerTabFeatures = { ...defaultPerTabFeatures };
        for (const tabId of Object.keys(defaultPerTabFeatures) as TabId[]) {
          if (parsed[tabId]) merged[tabId] = { ...defaultPerTabFeatures[tabId], ...parsed[tabId] };
        }
        return merged;
      }
      return defaultPerTabFeatures;
    } catch { return defaultPerTabFeatures; }
  });
  const [savedSidebarFeatures, setSavedSidebarFeatures] = useState<PerTabFeatures>(() => {
    try {
      const stored = localStorage.getItem('alkemio-sidebar-features');
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged: PerTabFeatures = { ...defaultPerTabFeatures };
        for (const tabId of Object.keys(defaultPerTabFeatures) as TabId[]) {
          if (parsed[tabId]) merged[tabId] = { ...defaultPerTabFeatures[tabId], ...parsed[tabId] };
        }
        return merged;
      }
      return defaultPerTabFeatures;
    } catch { return defaultPerTabFeatures; }
  });

  // ─── Change detection (tabs + posts) ───────────────────────────────────────
  const hasChanges = useMemo(() => {
    const tabsChanged = tabs.some((tab, i) => {
      const d = savedTabs[i];
      if (!d) return true;
      return tab.id !== d.id || tab.label !== d.label || tab.icon !== d.icon || tab.description !== d.description;
    });
    if (tabsChanged) return true;
    if (tabs.length !== savedTabs.length) return true;

    for (const tabId of Object.keys(savedTabPosts) as TabId[]) {
      const cur = tabPosts[tabId];
      const orig = savedTabPosts[tabId];
      if (!cur || !orig) return true;
      if (cur.length !== orig.length) return true;
      if (cur.some((p, i) => p.id !== orig[i]?.id)) return true;
    }

    if (postDescCollapsed !== savedPostDescCollapsed) return true;
    if (sidebarMode !== savedSidebarMode) return true;
    if (sidebarDefaultCollapsed !== savedSidebarDefaultCollapsed) return true;
    if (JSON.stringify(sidebarFeatures) !== JSON.stringify(savedSidebarFeatures)) return true;

    return false;
  }, [tabs, tabPosts, savedTabs, savedTabPosts, postDescCollapsed, savedPostDescCollapsed, sidebarMode, savedSidebarMode, sidebarDefaultCollapsed, savedSidebarDefaultCollapsed, sidebarFeatures, savedSidebarFeatures]);

  // ─── Tab reorder ───────────────────────────────────────────────────────────
  const moveTab = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setTabs((prev) => {
        const next = [...prev];
        const [moved] = next.splice(dragIndex, 1);
        next.splice(hoverIndex, 0, moved);
        return next;
      });
    },
    []
  );

  // ─── Post reorder within a column ──────────────────────────────────────────
  const movePostInColumn = useCallback(
    (tabId: TabId, dragIdx: number, hoverIdx: number) => {
      setTabPosts((prev) => {
        const list = [...prev[tabId]];
        const [moved] = list.splice(dragIdx, 1);
        list.splice(hoverIdx, 0, moved);
        return { ...prev, [tabId]: list };
      });
    },
    []
  );

  // ─── Cross-column move ─────────────────────────────────────────────────────
  const movePostBetweenColumns = useCallback(
    (
      sourceTabId: TabId,
      dragIdx: number,
      targetTabId: TabId,
      targetIdx: number
    ) => {
      setTabPosts((prev) => {
        const source = [...prev[sourceTabId]];
        const target = sourceTabId === targetTabId ? source : [...prev[targetTabId]];
        const [moved] = source.splice(dragIdx, 1);
        if (sourceTabId === targetTabId) {
          source.splice(targetIdx, 0, moved);
          return { ...prev, [sourceTabId]: source };
        }
        target.splice(targetIdx, 0, moved);
        return { ...prev, [sourceTabId]: source, [targetTabId]: target };
      });
    },
    []
  );

  // ─── Menu-based move to tab ────────────────────────────────────────────────
  const handleMoveToTab = useCallback(
    (postId: string, fromTab: TabId, toTab: TabId) => {
      setTabPosts((prev) => {
        const source = [...prev[fromTab]];
        const idx = source.findIndex((p) => p.id === postId);
        if (idx === -1) return prev;
        const [moved] = source.splice(idx, 1);
        return {
          ...prev,
          [fromTab]: source,
          [toTab]: [...prev[toTab], moved],
        };
      });
      // Auto-expand target column
      setExpandedCols((prev) => ({ ...prev, [toTab]: true }));
    },
    []
  );

  // ─── Remove from tab ──────────────────────────────────────────────────────
  const handleRemovePost = useCallback(
    (postId: string, tabId: TabId) => {
      setTabPosts((prev) => ({
        ...prev,
        [tabId]: prev[tabId].filter((p) => p.id !== postId),
      }));
    },
    []
  );

  // ─── Tab rename / icon ────────────────────────────────────────────────────
  const handleRename = (id: TabId, newName: string) => {
    if (newName.length > 20) return;
    setTabs((prev) =>
      prev.map((tab) => (tab.id === id ? { ...tab, label: newName } : tab))
    );
  };

  const handleDescriptionChange = (id: TabId, newDescription: string) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === id ? { ...tab, description: newDescription } : tab))
    );
  };

  const handleIconChange = (id: TabId, newIcon: React.ElementType) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === id ? { ...tab, icon: newIcon } : tab))
    );
  };

  // ─── Save / Discard ─────────────────────────────────────────────────────────
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSavedTabs([...tabs]);
      setSavedTabPosts({ ...tabPosts });
      setSavedPostDescCollapsed(postDescCollapsed);
      localStorage.setItem('alkemio-collapse-posts', String(postDescCollapsed));
      setSavedSidebarMode(sidebarMode);
      setSavedSidebarDefaultCollapsed(sidebarDefaultCollapsed);
      localStorage.setItem('alkemio-sidebar-default', sidebarDefaultCollapsed ? 'railed' : 'expanded');
      setSavedSidebarFeatures({ ...sidebarFeatures });
      localStorage.setItem('alkemio-sidebar-features', JSON.stringify(sidebarFeatures));
      setLastSaved(new Date());
    }, 1000);
  };

  const handleDiscard = () => {
    setTabs([...savedTabs]);
    setTabPosts({ ...savedTabPosts });
    setPostDescCollapsed(savedPostDescCollapsed);
    setSidebarMode(savedSidebarMode);
    setSidebarDefaultCollapsed(savedSidebarDefaultCollapsed);
    setSidebarFeatures({ ...savedSidebarFeatures });
    setExpandedCols({
      home: true,
      community: true,
      subspaces: false,
      knowledge: true,
    });
  };

  // ─── Column toggle helpers ────────────────────────────────────────────────
  const toggleColumn = useCallback((tabId: TabId) => {
    setExpandedCols((prev) => ({ ...prev, [tabId]: !prev[tabId] }));
  }, []);

  const autoExpandColumn = useCallback((tabId: TabId) => {
    setExpandedCols((prev) => ({ ...prev, [tabId]: true }));
  }, []);

  return (
    <>
    <UnsavedChangesGuard isDirty={hasChanges} onSave={handleSave} />
    <DndProvider backend={HTML5Backend}>
      <div className="w-full h-full pb-20">
        <div className="flex flex-col h-full">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-page-title text-foreground">Layout</h2>
              <p className="text-muted-foreground mt-2">
                Customize your Space's navigation tabs. Rename, reorder, and manage post assignments.
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-2 shrink-0">
              <Plus className="w-4 h-4" />
              Add Tab
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-start">
            {tabs.map((tab) => (
              <DraggableColumnWrapper
                key={tab.id}
                tabId={tab.id}
                index={tabs.findIndex((t) => t.id === tab.id)}
                moveTab={moveTab}
              >
                <KanbanColumn
                  tab={tab}
                  posts={tabPosts[tab.id] || []}
                  allTabs={tabs}
                  isOpen={!!expandedCols[tab.id]}
                  onToggle={() => toggleColumn(tab.id)}
                  onAutoExpand={() => autoExpandColumn(tab.id)}
                  movePostInColumn={movePostInColumn}
                  movePostBetweenColumns={movePostBetweenColumns}
                  onRemove={handleRemovePost}
                  onMoveToTab={handleMoveToTab}
                  onRename={handleRename}
                  onDescriptionChange={handleDescriptionChange}
                  onIconChange={handleIconChange}
                  isEditing={editingId === tab.id}
                  setEditingId={setEditingId}
                />
              </DraggableColumnWrapper>
            ))}
          </div>

          {/* Post Description Display toggle */}
          <SettingsSection
            title="Post Description Display"
            icon={<AlignLeft className="w-4 h-4" />}
            iconColor="amber"
            collapsible={false}
            className="mt-8"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-body text-muted-foreground">
                Collapse post descriptions by default. When enabled, descriptions show a "Read more" link instead of the full text.
              </p>
              <Switch
                checked={postDescCollapsed}
                onCheckedChange={setPostDescCollapsed}
                aria-label="Collapse post descriptions"
              />
            </div>
          </SettingsSection>

          {/* Sidebar Panel Mode */}
          <SettingsSection
            title="Sidebar Panel"
            icon={<PanelLeft className="w-4 h-4" />}
            iconColor="purple"
            collapsible={false}
            className="mt-4"
          >
            <p className="text-body text-muted-foreground mb-4">
              Choose how the left navigation sidebar appears for members visiting this space.
            </p>
            <RadioGroup
              value={sidebarMode}
              onValueChange={(v) => setSidebarMode(v as 'expanded' | 'railed' | 'hidden')}
              className="space-y-3"
            >
              <label
                htmlFor="panel-expanded"
                className={cn(
                  "flex items-start space-x-3 p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors",
                  sidebarMode === 'expanded' && "border-primary/40 bg-primary/5"
                )}
              >
                <RadioGroupItem value="expanded" id="panel-expanded" className="mt-0.5" />
                <div className="flex-1 space-y-1">
                  <span className="text-body-emphasis flex items-center gap-2">
                    <PanelLeft className="size-4 text-primary" />
                    Expanded
                  </span>
                  <p className="text-body text-muted-foreground">
                    Full sidebar with labels, descriptions, and quick actions always visible.
                  </p>
                </div>
              </label>
              <label
                htmlFor="panel-railed"
                className={cn(
                  "flex items-start space-x-3 p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors",
                  sidebarMode === 'railed' && "border-primary/40 bg-primary/5"
                )}
              >
                <RadioGroupItem value="railed" id="panel-railed" className="mt-0.5" />
                <div className="flex-1 space-y-1">
                  <span className="text-body-emphasis flex items-center gap-2">
                    <PanelLeftClose className="size-4 text-primary" />
                    Railed
                  </span>
                  <p className="text-body text-muted-foreground">
                    Compact icon-only rail. Expands on hover to show labels.
                  </p>
                </div>
              </label>
              <label
                htmlFor="panel-hidden"
                className={cn(
                  "flex items-start space-x-3 p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors",
                  sidebarMode === 'hidden' && "border-primary/40 bg-primary/5"
                )}
              >
                <RadioGroupItem value="hidden" id="panel-hidden" className="mt-0.5" />
                <div className="flex-1 space-y-1">
                  <span className="text-body-emphasis flex items-center gap-2">
                    <PanelLeftOff className="size-4 text-muted-foreground" />
                    Hidden
                  </span>
                  <p className="text-body text-muted-foreground">
                    No sidebar. Content takes the full width of the page.
                  </p>
                </div>
              </label>
            </RadioGroup>

            {/* Default state for users (only when sidebar is visible) */}
            {sidebarMode !== 'hidden' && (
              <div className="mt-6 pt-5 border-t">
                <h4 className="text-body-emphasis mb-1">Default State for Members</h4>
                <p className="text-body text-muted-foreground mb-3">
                  Members can always toggle between expanded and collapsed. This sets the default they see on first visit.
                </p>
                <div className="flex items-center justify-between gap-4 p-3 rounded-lg border bg-muted/20">
                  <div className="flex items-center gap-2">
                    <PanelLeftClose className="size-4 text-muted-foreground" />
                    <span className="text-body">Start collapsed (railed)</span>
                  </div>
                  <Switch
                    checked={sidebarDefaultCollapsed}
                    onCheckedChange={setSidebarDefaultCollapsed}
                    aria-label="Default sidebar collapsed"
                  />
                </div>
              </div>
            )}

            {/* Sidebar feature toggles — per tab (only when sidebar is visible) */}
            {sidebarMode !== 'hidden' && (
              <div className="mt-6 pt-5 border-t">
                <h4 className="text-body-emphasis mb-1">Sidebar Features</h4>
                <p className="text-body text-muted-foreground mb-4">
                  Configure which sidebar features are available per tab. Disabled features won't appear for members.
                </p>
                <div className="space-y-3">
                  {tabs.map((tab) => {
                    const TabIcon = tab.icon;
                    const tabFeatures = sidebarFeatures[tab.id];
                    const enabledCount = Object.values(tabFeatures).filter(Boolean).length;
                    const totalCount = Object.keys(tabFeatures).length;

                    const FEATURE_DEFS: Array<{ key: keyof SidebarFeatureSet; icon: React.ElementType; label: string; description: string }> = [
                      { key: 'search', icon: Search, label: 'Search', description: 'Search bar to filter content' },
                      { key: 'tags', icon: Tag, label: 'Tags & Filters', description: 'Tag cloud for filtering by category' },
                      { key: 'post', icon: MessageSquarePlus, label: 'Post', description: 'Create a new post in this tab' },
                      { key: 'addUser', icon: UserPlus, label: 'Add User', description: 'Invite or add members' },
                      { key: 'createSubspace', icon: Layers, label: 'Create Subspace', description: 'Create a new child subspace' },
                      { key: 'subspaceLinks', icon: Layers, label: 'Subspace Links', description: 'Quick links to child subspaces' },
                      { key: 'index', icon: ListOrdered, label: 'Index', description: 'Full content index with type and author' },
                    ];

                    return (
                      <Collapsible key={tab.id} defaultOpen={tab.id === 'home'}>
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg border bg-muted/20 hover:bg-muted/30 transition-colors group">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                              style={{ background: "color-mix(in srgb, var(--primary) 10%, transparent)" }}
                            >
                              <TabIcon className="w-3.5 h-3.5" style={{ color: "var(--primary)" }} />
                            </div>
                            <span className="text-body-emphasis">{tab.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-caption text-muted-foreground">
                              {enabledCount}/{totalCount}
                            </span>
                            <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="space-y-1 pt-2 pl-2">
                            {FEATURE_DEFS.map(({ key, icon: FeatureIcon, label, description }) => (
                              <div
                                key={key}
                                className={cn(
                                  "flex items-center justify-between gap-3 px-3 py-2 rounded-md transition-colors",
                                  tabFeatures[key]
                                    ? "hover:bg-muted/30"
                                    : "opacity-50"
                                )}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <FeatureIcon className="w-4 h-4 shrink-0 text-muted-foreground" />
                                  <div className="min-w-0">
                                    <span className="text-body block">{label}</span>
                                    <span className="text-caption text-muted-foreground block">{description}</span>
                                  </div>
                                </div>
                                <Switch
                                  checked={tabFeatures[key]}
                                  onCheckedChange={(checked) =>
                                    setSidebarFeatures((prev) => ({
                                      ...prev,
                                      [tab.id]: { ...prev[tab.id], [key]: checked },
                                    }))
                                  }
                                  aria-label={`Enable ${label} for ${tab.label}`}
                                />
                              </div>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
              </div>
            )}
          </SettingsSection>
        </div>
      </div>
    </DndProvider>
    <SaveBar
      isDirty={hasChanges}
      isSaving={isSaving}
      onSave={handleSave}
      onDiscard={handleDiscard}
    />
    </>
  );
}
import { useState, useEffect } from "react";
import {
  Search,
  Tag,
  Plus,
  UserPlus,
  Layers,
  Users,
  CalendarDays,
  List,
  Target,
  Info,
  GripVertical,
  LayoutGrid,
  MousePointer2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/crd/primitives/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/crd/primitives/tooltip";
import { Button } from "@/crd/primitives/button";
import { Checkbox } from "@/crd/primitives/checkbox";
import { cn } from "@/crd/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════════
// Types — shared by Space (per tab) and Subspace (one set for the whole subspace)
// ═══════════════════════════════════════════════════════════════════════════════
export interface SidebarWidgetDef {
  key: string;
  icon: React.ElementType;
  label: string;
  /** One-line explanation shown in the Layout dialog tooltip. */
  hint: string;
}

export interface SidebarWidgetConfig {
  /** Render order in the sidebar — drag-reordered in the Layout dialog. */
  order: string[];
  enabled: Record<string, boolean>;
}

/**
 * Tolerates the pre-order shape ({ search: true, … }) still sitting in
 * localStorage, and backfills keys added since the config was saved.
 */
export function normalizeConfig(
  stored: unknown,
  defs: SidebarWidgetDef[]
): SidebarWidgetConfig {
  const allKeys = defs.map((d) => d.key);
  const enabled: Record<string, boolean> = {};
  allKeys.forEach((k) => (enabled[k] = true));

  if (!stored || typeof stored !== "object") {
    return { order: [...allKeys], enabled };
  }

  const raw = stored as Record<string, unknown>;
  const source =
    raw.enabled && typeof raw.enabled === "object"
      ? (raw.enabled as Record<string, unknown>)
      : raw;

  allKeys.forEach((k) => {
    if (typeof source[k] === "boolean") enabled[k] = source[k] as boolean;
  });

  const storedOrder = Array.isArray(raw.order) ? (raw.order as string[]) : [];
  const order = [
    ...storedOrder.filter((k) => allKeys.includes(k)),
    ...allKeys.filter((k) => !storedOrder.includes(k)),
  ];

  return { order, enabled };
}

/** The keys to render, in order, with the disabled ones dropped. */
export function visibleWidgets(config: SidebarWidgetConfig): string[] {
  return config.order.filter((k) => config.enabled[k]);
}

// ═══════════════════════════════════════════════════════════════════════════════
// Space — one config per navigation tab
// ═══════════════════════════════════════════════════════════════════════════════
export const SPACE_WIDGET_DEFS: SidebarWidgetDef[] = [
  {
    key: "about",
    icon: Info,
    label: "About this Space",
    hint: "Summary card with the space description and a link to the full About page.",
  },
  {
    key: "intent",
    icon: Target,
    label: "Intention & Leads",
    hint: "States why the space exists and who is leading it. Useful on tabs where newcomers land.",
  },
  {
    key: "post",
    icon: Plus,
    label: "Add Post",
    hint: "Shortcut to create a post. Only members with contribute rights see it.",
  },
  {
    key: "addUser",
    icon: UserPlus,
    label: "Add User",
    hint: "Invite people straight from the sidebar. Only admins see it.",
  },
  {
    key: "createSubspace",
    icon: Layers,
    label: "Apply / Join",
    hint: "Opens the subspace application form so members can request their own subspace.",
  },
  {
    key: "search",
    icon: Search,
    label: "Search",
    hint: "Filters the content in the main column as you type. Pair it with Tags & Filters.",
  },
  {
    key: "tags",
    icon: Tag,
    label: "Tags & Filters",
    hint: "Tag chips that narrow down the main column. Works alongside Search.",
  },
  {
    key: "subspaceLinks",
    icon: Layers,
    label: "Subspaces",
    hint: "Quick links to the subspaces of this space, for jumping between them.",
  },
  {
    key: "events",
    icon: CalendarDays,
    label: "Upcoming Events",
    hint: "The next few calendar entries. Hidden automatically when there is nothing scheduled.",
  },
  {
    key: "index",
    icon: List,
    label: "Index",
    hint: "Opens a dialog listing every post, whiteboard and document in this space.",
  },
];

export const SPACE_WIDGETS_STORAGE_KEY = "alkemio-sidebar-features";

export type SpaceTabKey = "home" | "community" | "subspaces" | "knowledge";

/** Tabs where a widget makes no sense start with it switched off. */
const SPACE_TAB_OVERRIDES: Record<string, Partial<Record<string, boolean>>> = {
  community: { createSubspace: false, subspaceLinks: false },
  subspaces: { addUser: false },
  knowledge: { addUser: false, createSubspace: false, subspaceLinks: false }
};

export function spaceTabDefaults(tabId: string): SidebarWidgetConfig {
  const config = normalizeConfig(null, SPACE_WIDGET_DEFS);
  const overrides = SPACE_TAB_OVERRIDES[tabId];
  if (overrides) {
    Object.entries(overrides).forEach(([k, v]) => {
      if (typeof v === "boolean") config.enabled[k] = v;
    });
  }
  return config;
}

export function loadSpaceSidebarWidgets(): Record<string, SidebarWidgetConfig> {
  const tabs: string[] = ["home", "community", "subspaces", "knowledge"];
  const result: Record<string, SidebarWidgetConfig> = {};
  let stored: Record<string, unknown> = {};
  try {
    stored = JSON.parse(localStorage.getItem(SPACE_WIDGETS_STORAGE_KEY) || "{}");
  } catch {
    stored = {};
  }
  tabs.forEach((tabId) => {
    result[tabId] = stored[tabId]
      ? normalizeConfig(stored[tabId], SPACE_WIDGET_DEFS)
      : spaceTabDefaults(tabId);
  });
  return result;
}

export function saveSpaceSidebarWidgets(
  configs: Record<string, SidebarWidgetConfig>
) {
  try {
    localStorage.setItem(SPACE_WIDGETS_STORAGE_KEY, JSON.stringify(configs));
  } catch {
    /* storage unavailable — prototype keeps the in-memory state */
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Subspace — one config for the whole subspace, shared by every phase
// ═══════════════════════════════════════════════════════════════════════════════
export const SUBSPACE_WIDGET_DEFS: SidebarWidgetDef[] = [
  {
    key: "intent",
    icon: Target,
    label: "Challenge & Lead",
    hint: "The challenge this subspace is working on and who is leading it.",
  },
  {
    key: "post",
    icon: Plus,
    label: "Add Post",
    hint: "Shortcut to create a post in the phase that is currently open.",
  },
  {
    key: "inviteUser",
    icon: UserPlus,
    label: "Invite User",
    hint: "Invite people to this subspace. Only admins see it.",
  },
  {
    key: "createSubspace",
    icon: Layers,
    label: "Create Subspace",
    hint: "Start a nested subspace. Hidden when sub-subspaces are switched off in Settings.",
  },
  {
    key: "search",
    icon: Search,
    label: "Search",
    hint: "Filters the posts in the main column as you type. Pair it with Tags & Filters.",
  },
  {
    key: "tags",
    icon: Tag,
    label: "Tags & Filters",
    hint: "Tag chips that narrow down the posts shown. Works alongside Search.",
  },
  {
    key: "subspaceLinks",
    icon: Layers,
    label: "Subspaces",
    hint: "Quick links to nested subspaces, for jumping between them.",
  },
  {
    key: "community",
    icon: Users,
    label: "Community",
    hint: "Member avatars and the total count, linking through to the full member list.",
  },
  {
    key: "events",
    icon: CalendarDays,
    label: "Events",
    hint: "The next few calendar entries. Hidden automatically when there is nothing scheduled.",
  },
  {
    key: "index",
    icon: List,
    label: "Index",
    hint: "Opens a dialog listing every post, whiteboard and document across all phases.",
  },
];

export const SUBSPACE_WIDGETS_STORAGE_KEY = "alkemio-subspace-sidebar-widgets";

export function loadSubspaceSidebarWidgets(): SidebarWidgetConfig {
  try {
    const stored = localStorage.getItem(SUBSPACE_WIDGETS_STORAGE_KEY);
    return normalizeConfig(stored ? JSON.parse(stored) : null, SUBSPACE_WIDGET_DEFS);
  } catch {
    return normalizeConfig(null, SUBSPACE_WIDGET_DEFS);
  }
}

export function saveSubspaceSidebarWidgets(config: SidebarWidgetConfig) {
  try {
    localStorage.setItem(SUBSPACE_WIDGETS_STORAGE_KEY, JSON.stringify(config));
  } catch {
    /* storage unavailable — prototype keeps the in-memory state */
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Dialog — mirrors the production "Layout: <name>" dialog
// ═══════════════════════════════════════════════════════════════════════════════
interface SidebarWidgetsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Shown after "Layout: " in the title — a tab name, or "Sidebar". */
  title: string;
  description: string;
  /** Spells out how far these settings reach — one tab, or the whole subspace. */
  scopeNote?: string;
  defs: SidebarWidgetDef[];
  config: SidebarWidgetConfig;
  /** Applied to the page's working state; the page's Save bar persists it. */
  onSave: (config: SidebarWidgetConfig) => void;
}

export function SidebarWidgetsDialog({
  open,
  onOpenChange,
  title,
  description,
  scopeNote,
  defs,
  config,
  onSave
}: SidebarWidgetsDialogProps) {
  // Buffer the edits so Cancel can walk away from them.
  const [draft, setDraft] = useState<SidebarWidgetConfig>(config);
  const [dragKey, setDragKey] = useState<string | null>(null);

  useEffect(() => {
    if (open) setDraft({ order: [...config.order], enabled: { ...config.enabled } });
  }, [open, config]);

  const defByKey = new Map(defs.map((d) => [d.key, d]));
  const rows = draft.order.map((key) => defByKey.get(key)).filter(Boolean) as SidebarWidgetDef[];

  const toggle = (key: string, checked: boolean) =>
    setDraft((prev) => ({ ...prev, enabled: { ...prev.enabled, [key]: checked } }));

  const moveTo = (key: string, targetIndex: number) =>
    setDraft((prev) => {
      const next = [...prev.order];
      const from = next.indexOf(key);
      if (from === -1 || from === targetIndex) return prev;
      next.splice(from, 1);
      next.splice(targetIndex, 0, key);
      return { ...prev, order: next };
    });

  const shownCount = rows.filter((d) => draft.enabled[d.key]).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-primary" />
            Layout: {title}
          </DialogTitle>
          <DialogDescription className="sr-only">{description}</DialogDescription>
        </DialogHeader>

        <TooltipProvider delayDuration={200}>
          <div className="mt-2">
            <div className="flex items-baseline justify-between gap-2">
              <h4 className="text-body-emphasis text-foreground">Sidebar widgets</h4>
              <span className="text-caption text-muted-foreground tabular-nums shrink-0">
                {shownCount} of {rows.length} shown
              </span>
            </div>
            <p className="text-caption text-muted-foreground mt-0.5">{description}</p>

            {scopeNote && (
              <div className="mt-3 flex items-start gap-2 rounded-md border border-border bg-muted/40 px-3 py-2">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-muted-foreground" />
                <p className="text-caption text-muted-foreground">{scopeNote}</p>
              </div>
            )}

            <div className="mt-3 flex items-center gap-1.5 text-caption text-muted-foreground">
              <MousePointer2 className="w-3.5 h-3.5 shrink-0" />
              <span>Drag a row to reorder. Unchecked widgets stay hidden for members.</span>
            </div>

            <div className="mt-2 space-y-0.5">
              {rows.map((def, index) => {
                const { key, icon: Icon, label, hint } = def;
                return (
                  <div
                    key={key}
                    draggable
                    onDragStart={(e) => {
                      setDragKey(key);
                      e.dataTransfer.effectAllowed = "move";
                      // Firefox refuses to start a drag without payload.
                      e.dataTransfer.setData("text/plain", key);
                    }}
                    onDragEnter={() => {
                      if (dragKey && dragKey !== key) moveTo(dragKey, index);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnd={() => setDragKey(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragKey(null);
                    }}
                    className={cn(
                      "flex items-center gap-3 px-2 py-2 rounded-md transition-colors",
                      "hover:bg-muted/50 cursor-grab active:cursor-grabbing",
                      dragKey === key && "opacity-40 bg-muted"
                    )}
                  >
                    <GripVertical className="w-4 h-4 shrink-0 text-muted-foreground/40" />
                    <Checkbox
                      id={`widget-${title}-${key}`}
                      checked={draft.enabled[key]}
                      onCheckedChange={(checked) => toggle(key, !!checked)}
                      aria-label={label}
                      aria-describedby={`widget-${title}-${key}-hint`}
                      className="shrink-0"
                    />
                    <label
                      htmlFor={`widget-${title}-${key}`}
                      className={cn(
                        "flex items-center gap-2 min-w-0 flex-1 cursor-pointer select-none",
                        !draft.enabled[key] && "text-muted-foreground"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                      <span className="text-body truncate">{label}</span>
                    </label>
                    <span id={`widget-${title}-${key}-hint`} className="sr-only">
                      {hint}
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          tabIndex={-1}
                          aria-hidden="true"
                          className="shrink-0 rounded-sm p-0.5 text-muted-foreground/50 hover:text-foreground transition-colors"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-56">
                        {hint}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                );
              })}
            </div>
          </div>
        </TooltipProvider>

        <div className="mt-4 flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="uppercase tracking-wide"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="uppercase tracking-wide"
            onClick={() => {
              onSave(draft);
              onOpenChange(false);
            }}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Shared copy ──────────────────────────────────────────────────────────────
export const SUBSPACE_WIDGETS_DESCRIPTION =
  "Choose which widgets appear in this subspace's sidebar, and in what order. This applies to the whole subspace — every phase shows the same set.";

export const SUBSPACE_WIDGETS_SCOPE_NOTE =
  "Applies to this subspace only — every phase shows the same widgets. Nested subspaces keep their own layout, and members can still collapse the sidebar to a rail.";

export const spaceWidgetsDescription = (tabLabel: string) =>
  `Choose which widgets appear in the ${tabLabel} tab's sidebar, and in what order.`;

export const spaceWidgetsScopeNote = (tabLabel: string) =>
  `Applies to the ${tabLabel} tab only — each tab keeps its own sidebar layout. Subspaces are configured separately, in their own Layout settings.`;

/** Kept so callers can show "N hidden" without re-deriving it. */
export function hiddenCount(config: SidebarWidgetConfig, defs: SidebarWidgetDef[]) {
  return defs.filter((d) => !config.enabled[d.key]).length;
}

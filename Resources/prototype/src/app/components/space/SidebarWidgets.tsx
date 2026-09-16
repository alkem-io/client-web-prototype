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
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════════
// Types — shared by Space (per tab) and Subspace (one set for the whole subspace)
// ═══════════════════════════════════════════════════════════════════════════════
export interface SidebarWidgetDef {
  key: string;
  icon: React.ElementType;
  label: string;
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
  { key: "about", icon: Info, label: "About this Space" },
  { key: "intent", icon: Target, label: "Intention & Leads" },
  { key: "post", icon: Plus, label: "Add Post" },
  { key: "addUser", icon: UserPlus, label: "Add User" },
  { key: "createSubspace", icon: Layers, label: "Apply / Join" },
  { key: "search", icon: Search, label: "Search" },
  { key: "tags", icon: Tag, label: "Tags & Filters" },
  { key: "subspaceLinks", icon: Layers, label: "Subspaces" },
  { key: "events", icon: CalendarDays, label: "Upcoming Events" },
  { key: "index", icon: List, label: "Index" },
];

export const SPACE_WIDGETS_STORAGE_KEY = "alkemio-sidebar-features";

export type SpaceTabKey = "home" | "community" | "subspaces" | "knowledge";

/** Tabs where a widget makes no sense start with it switched off. */
const SPACE_TAB_OVERRIDES: Record<string, Partial<Record<string, boolean>>> = {
  community: { createSubspace: false, subspaceLinks: false },
  subspaces: { addUser: false },
  knowledge: { addUser: false, createSubspace: false, subspaceLinks: false },
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
  { key: "intent", icon: Target, label: "Challenge & Lead" },
  { key: "post", icon: Plus, label: "Add Post" },
  { key: "inviteUser", icon: UserPlus, label: "Invite User" },
  { key: "createSubspace", icon: Layers, label: "Create Subspace" },
  { key: "search", icon: Search, label: "Search" },
  { key: "tags", icon: Tag, label: "Tags & Filters" },
  { key: "subspaceLinks", icon: Layers, label: "Subspaces" },
  { key: "community", icon: Users, label: "Community" },
  { key: "events", icon: CalendarDays, label: "Events" },
  { key: "index", icon: List, label: "Index" },
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
  defs,
  config,
  onSave,
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

        <div className="mt-2">
          <h4 className="text-body-emphasis text-foreground">Sidebar widgets</h4>
          <p className="text-caption text-muted-foreground mt-0.5">{description}</p>

          <div className="mt-3 space-y-0.5">
            {rows.map((def, index) => {
              const { key, icon: Icon, label } = def;
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
                </div>
              );
            })}
          </div>
        </div>

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

export const spaceWidgetsDescription = (tabLabel: string) =>
  `Choose which widgets appear in the ${tabLabel} tab's sidebar, and in what order.`;

/** Kept so callers can show "N hidden" without re-deriving it. */
export function hiddenCount(config: SidebarWidgetConfig, defs: SidebarWidgetDef[]) {
  return defs.filter((d) => !config.enabled[d.key]).length;
}

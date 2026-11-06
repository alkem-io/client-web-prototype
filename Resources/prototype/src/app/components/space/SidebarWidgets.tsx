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
  Info
} from "lucide-react";

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

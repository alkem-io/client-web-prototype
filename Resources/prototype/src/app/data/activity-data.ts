/**
 * Mock activity registry for the new-activity indicators (spec 014).
 *
 * Containers (spaces, subspaces, tabs) carry a "last activity" timestamp and a
 * child list; items (posts and contributions) carry a creation timestamp.
 * Anything absent from these maps simply never produces a dot, so unregistered
 * surfaces degrade to silence rather than to noise.
 */

const DAY_MS = 24 * 60 * 60 * 1000;
const daysAgo = (n: number) => new Date(Date.now() - n * DAY_MS).toISOString();

/** Activity older than this is treated as already read for a first-time user. */
export const BASELINE_DAYS = 30;
export const defaultBaseline = () => daysAgo(BASELINE_DAYS);

export type ContainerId = string;
export type ItemId = string;

export const spaceContainer = (slug: string): ContainerId => `space:${slug}`;
export const subspaceContainer = (slug: string): ContainerId => `subspace:${slug}`;
export const tabContainer = (spaceSlug: string, tab: string): ContainerId =>
  `tab:${spaceSlug}:${tab}`;
export const postItem = (id: string): ItemId => `post:${id}`;
/** An innovation-flow phase. Owner is the space or subspace slug it belongs to. */
export const calloutContainer = (ownerSlug: string, calloutId: string): ContainerId =>
  `callout:${ownerSlug}:${calloutId}`;

/**
 * A card may represent a top-level space or a subspace and does not always know
 * which; only one of the two ids is ever registered, so testing both is safe.
 */
export const spaceOrSubspaceIds = (slug: string): ContainerId[] => [
  spaceContainer(slug),
  subspaceContainer(slug),
];

export const SPACE_TAB_KEYS = ["home", "community", "subspaces", "knowledge-base"] as const;

/** Subspace slugs shown in the in-space sidebar and subspace lists. */
const DEMO_SUBSPACES = [
  "renewable-energy-transition",
  "urban-mobility-lab",
  "green-infrastructure",
  "policy-frameworks",
];

/** Sub-subspaces, one level deeper, listed inside a subspace. */
const DEMO_SUB_SUBSPACES: Record<string, string[]> = {
  "renewable-energy-transition": [
    "solar-panel-deployment",
    "wind-farm-feasibility",
    "battery-storage-research",
  ],
};

/** Innovation-flow phases per subspace, mirroring SUBSPACE_MAP in SubspacePage. */
const DEMO_CALLOUTS: Record<string, string[]> = {
  "renewable-energy-transition": ["strategy", "municipal", "policy", "stakeholders"],
  "urban-mobility-lab": ["research", "prototypes", "field-tests"],
  "green-infrastructure": ["planning", "implementation"],
};

/** Spaces wired up for the demo. Their tabs and subspaces hang beneath them. */
const DEMO_SPACES = ["green-energy", "innovation-lab", "community-garden", "digital-trans"];

/**
 * Only these spaces own the shared subspace list. Attaching it to every space
 * would light every space in the sidebar via rollup, leaving no quiet space to
 * contrast against — and a dot everywhere says nothing.
 */
const SPACES_WITH_SUBSPACES = ["green-energy", "innovation-lab"];

/**
 * Subspaces hang off the space, not off the Subspaces tab. If they hung off the
 * tab, the tab could never clear on visit — it would keep relighting from its
 * children, which is the sticky-parent failure the spec rules out.
 */
export const CONTAINER_CHILDREN: Record<ContainerId, ContainerId[]> = {
  ...Object.fromEntries(
    DEMO_SPACES.map((slug) => [
      spaceContainer(slug),
      [
        ...SPACE_TAB_KEYS.map((tab) => tabContainer(slug, tab)),
        ...(SPACES_WITH_SUBSPACES.includes(slug) ? DEMO_SUBSPACES.map(subspaceContainer) : []),
      ],
    ])
  ),
  // A subspace rolls up its own phases and its sub-subspaces.
  ...Object.fromEntries(
    DEMO_SUBSPACES.map((slug) => [
      subspaceContainer(slug),
      [
        ...(DEMO_CALLOUTS[slug] ?? []).map((id) => calloutContainer(slug, id)),
        ...(DEMO_SUB_SUBSPACES[slug] ?? []).map(subspaceContainer),
      ],
    ])
  ),
};

/** Most recent activity belonging directly to a container. */
export const CONTAINER_ACTIVITY: Record<ContainerId, string> = {
  // Green Energy — Community and Subspaces changed; Home has new posts.
  [tabContainer("green-energy", "home")]: daysAgo(0.3),
  [tabContainer("green-energy", "community")]: daysAgo(1),
  [tabContainer("green-energy", "subspaces")]: daysAgo(2),

  // Innovation Lab — the space reached from the dashboard.
  [tabContainer("innovation-lab", "home")]: daysAgo(0.3),
  [tabContainer("innovation-lab", "community")]: daysAgo(1),
  [tabContainer("innovation-lab", "knowledge-base")]: daysAgo(3),

  [subspaceContainer("renewable-energy-transition")]: daysAgo(1),
  [subspaceContainer("green-infrastructure")]: daysAgo(4),

  // Sub-subspaces, one level deeper.
  [subspaceContainer("solar-panel-deployment")]: daysAgo(0.5),
  [subspaceContainer("battery-storage-research")]: daysAgo(5),

  // Innovation-flow phases. Only some phases move, which is the point of the dot.
  [calloutContainer("renewable-energy-transition", "strategy")]: daysAgo(0.4),
  [calloutContainer("renewable-energy-transition", "municipal")]: daysAgo(1),
  [calloutContainer("renewable-energy-transition", "stakeholders")]: daysAgo(3),
  [calloutContainer("urban-mobility-lab", "field-tests")]: daysAgo(2),
  [calloutContainer("green-infrastructure", "implementation")]: daysAgo(4),

  // Community Garden has activity of its own; Digital Transformation is quiet.
  [tabContainer("community-garden", "home")]: daysAgo(3),

  // Dashboard cards for spaces without their own wired-up interior.
  [spaceContainer("future-strategy")]: daysAgo(6),
};

/** Items created after the viewer's baseline show a dot until seen. */
export const ITEM_ACTIVITY: Record<ItemId, string> = {
  // Space home feed.
  [postItem("space-1")]: daysAgo(0.3),
  [postItem("space-2")]: daysAgo(1),
  [postItem("space-5")]: daysAgo(2),
  [postItem("space-7")]: daysAgo(0.5),
  // Subspace feed. Each lit phase contains a new post, so a phase dot leads
  // somewhere rather than just asserting that something happened.
  [postItem("sp-1")]: daysAgo(0.4),
  [postItem("sp-4")]: daysAgo(1),
  [postItem("sp-5")]: daysAgo(3),
};

const SPACE_FEED_ITEMS = ["space-1", "space-2", "space-5", "space-7"].map(postItem);

/**
 * Items belonging to a container, used to resolve "mark all as read" scopes.
 * The same feed renders on every space home in the prototype.
 */
export const CONTAINER_ITEMS: Record<ContainerId, ItemId[]> = {
  ...Object.fromEntries(
    DEMO_SPACES.map((slug) => [tabContainer(slug, "home"), SPACE_FEED_ITEMS])
  ),
  [calloutContainer("renewable-energy-transition", "strategy")]: [postItem("sp-1")],
  [calloutContainer("renewable-energy-transition", "municipal")]: [postItem("sp-4")],
  [calloutContainer("renewable-energy-transition", "stakeholders")]: [postItem("sp-5")],
};

export const ALL_CONTAINER_IDS: ContainerId[] = Array.from(
  new Set([
    ...Object.keys(CONTAINER_ACTIVITY),
    ...Object.keys(CONTAINER_CHILDREN),
    ...Object.values(CONTAINER_CHILDREN).flat(),
  ])
);

export const ALL_ITEM_IDS: ItemId[] = Object.keys(ITEM_ACTIVITY);

/** Every container at or beneath `root`, inclusive. */
export function descendantContainers(root: ContainerId): ContainerId[] {
  const seen = new Set<ContainerId>();
  const walk = (id: ContainerId) => {
    if (seen.has(id)) return;
    seen.add(id);
    (CONTAINER_CHILDREN[id] ?? []).forEach(walk);
  };
  walk(root);
  return Array.from(seen);
}

/* ─── Recent space changes (notifications dialog, Activity tab) ─── */

/**
 * The viewer's relationship to a space. `member` and `lead` together make up
 * "my spaces"; `following` is a space they can see but have not joined.
 */
export type SpaceRelation = "lead" | "member" | "following";

export type ChangeKind = "post" | "contribution" | "callout" | "subspace" | "member";

export interface SpaceChange {
  id: string;
  /** Drives unread state, so the list and the dots can never disagree. */
  containerId: ContainerId;
  href: string;
  spaceName: string;
  /** The space or subspace the change happened in. Falls back to initials. */
  spaceAvatar?: string;
  spaceInitials: string;
  relation: SpaceRelation;
  kind: ChangeKind;
  summary: string;
  detail: string;
}

const img = (n: string) =>
  `https://images.unsplash.com/photo-${n}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200`;

const SPACE_IMAGES = {
  greenEnergy: img("1690191863988-f685cddde463"),
  communityGarden: img("1768659347532-74d3b1efb0ae"),
  innovationLab: img("1623652554515-91c833e3080e"),
  futureStrategy: img("1676276376052-dc9c9c0b6917"),
  renewable: img("1509391366360-2e959784a276"),
  greenInfra: img("1518531933037-91b2f5f229cc"),
  solar: img("1677506048377-1099738d294d"),
};

export const SPACE_CHANGES: SpaceChange[] = [
  {
    id: "c1",
    containerId: tabContainer("green-energy", "home"),
    href: "/space/green-energy",
    spaceName: "Green Energy Space",
    spaceAvatar: SPACE_IMAGES.greenEnergy,
    spaceInitials: "GE",
    relation: "lead",
    kind: "post",
    summary: "3 new posts",
    detail: "Including “Rooftop survey results — Q3” by Maria Jansen",
  },
  {
    id: "c2",
    containerId: tabContainer("green-energy", "community"),
    href: "/space/green-energy/community",
    spaceName: "Green Energy Space",
    spaceAvatar: SPACE_IMAGES.greenEnergy,
    spaceInitials: "GE",
    relation: "lead",
    kind: "member",
    summary: "2 people joined",
    detail: "Pieter de Vries and Anna Martinez are now members",
  },
  {
    id: "c3",
    containerId: tabContainer("green-energy", "subspaces"),
    href: "/space/green-energy/subspaces",
    spaceName: "Green Energy Space",
    spaceAvatar: SPACE_IMAGES.greenEnergy,
    spaceInitials: "GE",
    relation: "lead",
    kind: "subspace",
    summary: "New subspace created",
    detail: "“Grid Storage” was added by Sam Okonkwo",
  },
  {
    id: "c4",
    containerId: subspaceContainer("renewable-energy-transition"),
    href: "/space/innovation-lab/subspaces/renewable-energy-transition",
    spaceName: "Renewable Energy Transition",
    spaceAvatar: SPACE_IMAGES.renewable,
    spaceInitials: "RE",
    relation: "lead",
    kind: "contribution",
    summary: "4 new contributions",
    detail: "Across Strategy Docs, Municipal Data and Stakeholders",
  },
  {
    id: "c5",
    containerId: calloutContainer("renewable-energy-transition", "municipal"),
    href: "/space/innovation-lab/subspaces/renewable-energy-transition",
    spaceName: "Renewable Energy Transition · Municipal Data",
    spaceAvatar: SPACE_IMAGES.renewable,
    spaceInitials: "RE",
    relation: "lead",
    kind: "callout",
    summary: "New response submitted",
    detail: "David Miller answered the Q4 planning form",
  },
  {
    id: "c6",
    containerId: tabContainer("innovation-lab", "home"),
    href: "/space/innovation-lab",
    spaceName: "Innovation Lab",
    spaceAvatar: SPACE_IMAGES.innovationLab,
    spaceInitials: "IL",
    relation: "member",
    kind: "post",
    summary: "2 new posts",
    detail: "“Site visit notes — Almere” and one other",
  },
  {
    id: "c7",
    containerId: tabContainer("innovation-lab", "knowledge-base"),
    href: "/space/innovation-lab/knowledge-base",
    spaceName: "Innovation Lab",
    spaceAvatar: SPACE_IMAGES.innovationLab,
    spaceInitials: "IL",
    relation: "member",
    kind: "callout",
    summary: "Knowledge base updated",
    detail: "Three documents added to “Grid Modernisation”",
  },
  {
    id: "c8",
    containerId: subspaceContainer("green-infrastructure"),
    href: "/space/innovation-lab/subspaces/green-infrastructure",
    spaceName: "Green Infrastructure",
    spaceAvatar: SPACE_IMAGES.greenInfra,
    spaceInitials: "GI",
    relation: "member",
    kind: "contribution",
    summary: "New whiteboard added",
    detail: "“Planting scheme — phase 2” by Emily Davis",
  },
  {
    id: "c9",
    containerId: tabContainer("community-garden", "home"),
    href: "/space/community-garden",
    spaceName: "Community Garden",
    spaceAvatar: SPACE_IMAGES.communityGarden,
    spaceInitials: "CG",
    relation: "member",
    kind: "post",
    summary: "New post",
    detail: "“Spring planting rota” by Nina van Dijk",
  },
  {
    id: "c10",
    containerId: spaceContainer("future-strategy"),
    href: "/space/future-strategy",
    spaceName: "Future Strategy",
    spaceAvatar: SPACE_IMAGES.futureStrategy,
    spaceInitials: "FS",
    relation: "following",
    kind: "post",
    summary: "2 new posts",
    detail: "Scenario planning workshop notes published",
  },
  {
    id: "c11",
    containerId: subspaceContainer("solar-panel-deployment"),
    href: "/space/innovation-lab/subspaces/renewable-energy-transition/subspaces/solar-panel-deployment",
    spaceName: "Solar Panel Deployment",
    spaceAvatar: SPACE_IMAGES.solar,
    spaceInitials: "SP",
    relation: "following",
    kind: "subspace",
    summary: "New subspace activity",
    detail: "First installations scheduled for the pilot district",
  },
];

/** Human-readable age of a container's most recent activity. */
export function activityAge(containerId: ContainerId): string {
  const iso = CONTAINER_ACTIVITY[containerId];
  if (!iso) return "";
  const hours = (Date.now() - new Date(iso).getTime()) / (60 * 60 * 1000);
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))}m ago`;
  if (hours < 24) return `${Math.round(hours)}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

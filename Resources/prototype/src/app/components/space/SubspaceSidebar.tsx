import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  SubspaceSidebar as CrdSubspaceSidebar,
  type SubspaceQuickActionId,
} from "@/crd/components/space/SubspaceSidebar";
import type { ParentSpaceStackItem } from "@/crd/components/space/ParentSpaceStack";
import { CreatePostButton } from "@/crd/components/space/sidebar/CreatePostButton";
import { SubspaceCommunityDialog } from "@/app/components/space/SubspaceCommunityDialog";
import type { MockSpaceCard } from "@/app/mappers/spaceCard";

/** The subspace's framing question, shown in the info block. */
const SUBSPACE_DESCRIPTION =
  "How might we design a collaborative platform that empowers distributed teams to innovate effectively while maintaining social connection?";

interface SubspaceSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
  parentSpaceName?: string;
  parentSpaceInitials?: string;
  parentSpaceBanner?: string;
  parentSpaceDescription?: string;
  parentSpaceHref?: string;
  /** Grandparent info for depth-2 (sub-subspace) stacking */
  grandparentSpaceName?: string;
  grandparentSpaceInitials?: string;
  grandparentSpaceBanner?: string;
  grandparentSpaceHref?: string;
}

const SUBSPACE_LEAD = {
  name: "David Kim",
  location: "Berlin, DE",
  avatar:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  initials: "DK"
};

const VIRTUAL_CONTRIBUTOR = {
  name: "Design Advisor",
  description: "AI assistant trained on design thinking and collaboration frameworks.",
  avatar:
    "https://images.unsplash.com/photo-1641312874336-6279a832a3dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256"
};

const SUB_SUBSPACES: (MockSpaceCard & { status: string })[] = [
  {
    id: "ss-1",
    slug: "solar-panel-deployment",
    name: "Solar Panel Deployment",
    description: "Planning and rollout of residential solar panel installations across participating municipalities.",
    bannerImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    initials: "SP",
    avatarColor: "#f59e0b",
    isPrivate: false,
    tags: ["Solar", "Deployment"],
    memberCount: 8,
    status: "Active",
    leads: [
      { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", type: "person" },
    ],
    parent: { name: "Renewable Energy Transition", slug: "renewable-energy-transition", initials: "RE", avatarColor: "#22c55e" }
  },
  {
    id: "ss-2",
    slug: "wind-farm-feasibility",
    name: "Wind Farm Feasibility",
    description: "Feasibility studies for offshore and onshore wind projects in the northern corridor.",
    bannerImage: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=800&q=80",
    initials: "WF",
    avatarColor: "#0ea5e9",
    isPrivate: false,
    tags: ["Wind", "Feasibility"],
    memberCount: 6,
    status: "Active",
    leads: [
      { name: "David Kim", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", type: "person" },
    ],
    parent: { name: "Renewable Energy Transition", slug: "renewable-energy-transition", initials: "RE", avatarColor: "#22c55e" }
  },
  {
    id: "ss-3",
    slug: "battery-storage-research",
    name: "Battery Storage Research",
    description: "Research on grid-scale battery storage solutions and next-gen energy storage tech.",
    bannerImage: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&w=800&q=80",
    initials: "BS",
    avatarColor: "#8b5cf6",
    isPrivate: false,
    tags: ["Battery", "Research"],
    memberCount: 5,
    status: "Active",
    leads: [
      { name: "Emily Davis", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", type: "person" },
      { name: "Tech Innovations", avatar: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80", type: "org" },
    ],
    parent: { name: "Renewable Energy Transition", slug: "renewable-energy-transition", initials: "RE", avatarColor: "#22c55e" }
  },
];

/**
 * Subspace sidebar — production's `@/crd/components/space/SubspaceSidebar`.
 *
 * CRD's version is the richer one here: it owns the info block, the lead and
 * virtual-contributor rows, the quick-action icons, the collapsed rail, the
 * nested-subspaces widget and the parent-space stack. The prototype's hand-built
 * equivalent is replaced by it wholesale.
 *
 * PHASE-2 §6 RESOLVED — the parent space stack comes back with this. It was
 * dropped when `SubspaceHeader` adopted CRD's, on the note that production shows
 * ancestry in the sidebar instead. This is that sidebar.
 *
 * The rich sub-subspace cards are NOT used by the widget: CRD's nested-subspaces
 * list takes name/initials/href rows. The rich cards remain on the Subspaces tab,
 * which is where they were designed to live — and they are now CRD's own
 * `ExpandedSpaceCard`, which graduated upstream and replaced the prototype's copy.
 */
export function SubspaceSidebar({
  isCollapsed,
  onToggleCollapse,
  className,
  parentSpaceName,
  parentSpaceInitials,
  parentSpaceBanner,
  parentSpaceDescription,
  parentSpaceHref,
  grandparentSpaceName,
  grandparentSpaceInitials,
  grandparentSpaceBanner,
  grandparentSpaceHref,
}: SubspaceSidebarProps) {
  const navigate = useNavigate();
  const { spaceSlug, subspaceSlug } = useParams<{ spaceSlug: string; subspaceSlug: string }>();
  const [communityOpen, setCommunityOpen] = useState(false);

  // Outermost first, so the stack reads grandparent → parent.
  const parentSpaces: ParentSpaceStackItem[] = [
    grandparentSpaceName && {
      name: grandparentSpaceName,
      initials: grandparentSpaceInitials ?? grandparentSpaceName.slice(0, 2).toUpperCase(),
      href: grandparentSpaceHref ?? '#',
      bannerUrl: grandparentSpaceBanner,
    },
    parentSpaceName && {
      name: parentSpaceName,
      initials: parentSpaceInitials ?? parentSpaceName.slice(0, 2).toUpperCase(),
      href: parentSpaceHref ?? '#',
      bannerUrl: parentSpaceBanner,
      tagline: parentSpaceDescription,
    },
  ].filter(Boolean) as ParentSpaceStackItem[];

  const base = `/space/${spaceSlug}/subspaces/${subspaceSlug}`;

  const handleQuickAction = (id: SubspaceQuickActionId) => {
    if (id === 'community') return setCommunityOpen(true);
    if (id === 'subspaces') return navigate(`${base}/subspaces`);
    // events / activity / index have no dedicated route in the prototype yet.
  };

  return (
    <>
      <CrdSubspaceSidebar
        className={className}
        collapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
        description={SUBSPACE_DESCRIPTION}
        leads={[
          {
            id: 'lead-1',
            name: SUBSPACE_LEAD.name,
            avatarUrl: SUBSPACE_LEAD.avatar,
            initials: SUBSPACE_LEAD.initials,
            href: `/user/${SUBSPACE_LEAD.name.toLowerCase().replace(/ /g, '-')}`,
            location: SUBSPACE_LEAD.location,
            type: 'person',
          },
        ]}
        virtualContributor={{
          id: 'vc-1',
          name: VIRTUAL_CONTRIBUTOR.name,
          avatarUrl: VIRTUAL_CONTRIBUTOR.avatar,
          initials: VIRTUAL_CONTRIBUTOR.name.slice(0, 2).toUpperCase(),
          description: VIRTUAL_CONTRIBUTOR.description,
          href: '/vc/design-advisor',
        }}
        parentSpaces={parentSpaces}
        subspaces={SUB_SUBSPACES.map(sub => ({
          name: sub.name,
          initials: sub.initials,
          href: `${base}/subspaces/${sub.slug}`,
          avatarUrl: sub.bannerImage,
          isPrivate: sub.isPrivate,
        }))}
        onSubspaceClick={href => navigate(href)}
        onShowAllSubspaces={() => navigate(`${base}/subspaces`)}
        onAboutClick={() => setCommunityOpen(true)}
        onQuickActionClick={handleQuickAction}
        actionsSlot={
          <CreatePostButton onClick={() => window.dispatchEvent(new Event('open-add-post-modal'))} />
        }
      />

      <SubspaceCommunityDialog open={communityOpen} onOpenChange={setCommunityOpen} />
    </>
  );
}

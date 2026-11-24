/**
 * Subspaces — a **spaces callout**.
 *
 * Production does not render a bespoke subspaces block. Subspaces are one of
 * the framing types a callout can have (CRD's `PostType` has `spaces`, and
 * `CalloutDetailDialog` has a `spacesFramingSlot`), so this is a post whose
 * body is the collection.
 *
 * `PostCard` renders that framing through `children`; `SpaceCollection` is the
 * body — itself a thin wrapper over `SpaceSubspacesList` whose own docs say it
 * "replaces the hard-coded subspaces block".
 *
 * CRD owns the search field, the tag filter popover, the status pills, the
 * active-filter summary, the card grid and show-more. This file is the
 * prototype's fixtures mapped to `SpaceCardData`.
 *
 * The prototype's sidebar search no longer drives this block, which matches
 * production: the sidebar search filters which callouts appear, and each
 * collection filters within itself.
 *
 * Gone with the conversion: the list/grid toggle. It read `viewMode` from a
 * context that never provided the field, so the list branch was unreachable —
 * every render was already a grid.
 */
import { useNavigate, useParams } from 'react-router';
import { SpaceCollection } from '@/crd/components/callout/SpaceCollection/SpaceCollection';
import { PostCard } from '@/app/components/space/PostCard';
import { toSpaceCard, type MockSpaceCard } from '@/app/mappers/spaceCard';

// Subspace avatar colors
const SUBSPACE_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#059669",
  "#d97706",
  "#dc2626",
  "#0891b2",
];

// Parent space banner for avatar derivation
const PARENT_BANNER = "https://images.unsplash.com/photo-1690191863988-f685cddde463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";

// Mock Data — mapped to MockSpaceCard format
const SUBSPACES: (MockSpaceCard & { status: string; filterTags: string[] })[] = [
  {
    id: "sub-1",
    slug: "renewable-energy-transition",
    name: "Renewable Energy Transition",
    description: "Developing strategies for municipal energy transition to 100% renewables by 2030.",
    bannerImage: "https://images.unsplash.com/photo-1677506048377-1099738d294d?auto=format&fit=crop&w=800&q=80",
    avatar: "https://images.unsplash.com/photo-1509391366360-2e959784a276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    initials: "RE",
    avatarColor: SUBSPACE_COLORS[0],
    isPrivate: false,
    tags: ["Energy", "Strategy", "2030"],
    memberCount: 24,
    status: "Active",
    filterTags: ["Active", "Completed"],
    leads: [
      { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", type: "person" },
      { name: "Green Future Org", avatar: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80", type: "org" },
    ]
  },
  {
    id: "sub-2",
    slug: "urban-mobility-lab",
    name: "Urban Mobility Lab",
    description: "Reimagining city transportation networks for better accessibility and reduced carbon footprint.",
    bannerImage: "https://images.unsplash.com/photo-1743385779313-ac03bb0f997b?auto=format&fit=crop&w=800&q=80",
    avatar: "https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    initials: "UM",
    avatarColor: SUBSPACE_COLORS[1],
    isPrivate: false,
    tags: ["Transport", "Accessibility"],
    memberCount: 18,
    status: "Active",
    filterTags: ["Active", "Planning"],
    leads: [
      { name: "David Kim", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", type: "person" },
    ]
  },
  {
    id: "sub-3",
    slug: "green-infrastructure",
    name: "Green Infrastructure",
    description: "Planning and implementation of urban green spaces, vertical gardens, and sustainable drainage.",
    bannerImage: "https://images.unsplash.com/photo-1760611656007-f767a8082758?auto=format&fit=crop&w=800&q=80",
    avatar: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    initials: "GI",
    avatarColor: SUBSPACE_COLORS[2],
    isPrivate: false,
    tags: ["Urban", "Green Spaces", "Drainage"],
    memberCount: 12,
    status: "Active",
    filterTags: ["Active", "Research"],
    leads: [
      { name: "Emily Davis", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", type: "person" },
      { name: "City Planning Dept", avatar: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80", type: "org" },
      { name: "James Wilson", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", type: "person" },
    ]
  },
  {
    id: "sub-4",
    slug: "policy-frameworks",
    name: "Policy Frameworks",
    description: "Drafting policy recommendations and regulatory frameworks to support sustainability initiatives.",
    bannerImage: "https://images.unsplash.com/photo-1769069918751-9cdb7c752fcc?auto=format&fit=crop&w=800&q=80",
    avatar: "https://images.unsplash.com/photo-1554103210-26d928978fb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    initials: "PF",
    avatarColor: SUBSPACE_COLORS[3],
    isPrivate: true,
    tags: ["Policy", "Regulation"],
    memberCount: 8,
    status: "Archived",
    filterTags: ["Archived"],
    leads: [
      { name: "Policy Institute", avatar: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80", type: "org" },
    ]
  },
  {
    id: "sub-5",
    slug: "community-engagement",
    name: "Community Engagement",
    description: "Tools and methodologies for involving local communities in decision-making processes.",
    bannerImage: "https://images.unsplash.com/photo-1554103210-26d928978fb5?auto=format&fit=crop&w=800&q=80",
    avatar: "https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    initials: "CE",
    avatarColor: SUBSPACE_COLORS[4],
    isPrivate: false,
    tags: ["Community", "Participation"],
    memberCount: 32,
    status: "Active",
    filterTags: ["Active", "Completed"],
    leads: [
      { name: "Anna Martinez", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", type: "person" },
      { name: "Local Council", avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80", type: "org" },
    ]
  },
  {
    id: "sub-6",
    slug: "digital-twin-project",
    name: "Digital Twin Project",
    description: "Creating digital replicas of urban systems to simulate and optimize performance.",
    bannerImage: "https://images.unsplash.com/photo-1683818051102-dd1199d163b9?auto=format&fit=crop&w=800&q=80",
    avatar: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    initials: "DT",
    avatarColor: SUBSPACE_COLORS[5],
    isPrivate: false,
    tags: ["Digital", "Simulation"],
    memberCount: 15,
    status: "Active",
    filterTags: ["Active", "Research"],
    leads: [
      { name: "Tech Innovations", avatar: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80", type: "org" },
      { name: "Robert Fox", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", type: "person" },
    ]
  },
];

export function SpaceSubspacesList() {
  const navigate = useNavigate();
  const { spaceSlug } = useParams<{ spaceSlug: string }>();
  const slug = spaceSlug || 'default-space';

  const subspaces = SUBSPACES.map(subspace =>
    toSpaceCard(
      {
        ...subspace,
        parent: {
          name: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          slug,
          bannerImage: PARENT_BANNER,
          initials: slug.substring(0, 2).toUpperCase(),
          avatarColor: '#2563eb',
        },
      },
      slug
    )
  );

  return (
    <PostCard
      post={{
        id: 'callout-subspaces',
        type: 'spaces',
        title: 'Subspaces',
        snippet: 'Focused collaboration areas within this space.',
        author: { name: 'Elena Martinez' },
        timestamp: '3 days ago',
        commentCount: 0,
      }}
      reactionsEnabled={false}
    >
      <SpaceCollection subspaces={subspaces} onSubspaceClick={space => navigate(space.href)} />
    </PostCard>
  );
}

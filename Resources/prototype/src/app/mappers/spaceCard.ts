import type {
  SpaceCardData,
  SpaceCardParent,
  SpaceLead,
} from '@/crd/components/space/SpaceCard';

/**
 * The prototype's mock space shape (fixtures in app/data + page files).
 *
 * Differs from CRD's `SpaceCardData` in three ways, all handled below:
 *  - `slug` instead of a built `href`
 *  - `bannerImage` / `avatar` instead of `bannerImageUrl` / `avatarUrl`
 *  - carries `memberCount` and `classifications`, which production's card does
 *    not render — dropped here rather than smuggled in.
 */
export type MockSpaceCard = {
  id: string;
  slug: string;
  name: string;
  description: string;
  bannerImage?: string;
  avatar?: string;
  initials: string;
  avatarColor: string;
  isPrivate: boolean;
  tags: string[];
  memberCount?: number;
  leads: { name: string; avatar: string; type: 'person' | 'org' }[];
  parent?: {
    name: string;
    slug: string;
    bannerImage?: string;
    avatar?: string;
    initials: string;
    avatarColor: string;
  };
  classifications?: { name: string; values: string[] }[];
  isMember?: boolean;
  isPinned?: boolean;
};

const toLead = (l: MockSpaceCard['leads'][number]): SpaceLead => ({
  name: l.name,
  avatarUrl: l.avatar,
  type: l.type,
});

const toParent = (p: NonNullable<MockSpaceCard['parent']>): SpaceCardParent => ({
  name: p.name,
  href: `/space/${p.slug}`,
  avatarUrl: p.avatar,
  initials: p.initials,
  avatarColor: p.avatarColor,
});

/**
 * Mock space → `SpaceCardData`, the type CRD's SpaceCard exports.
 *
 * `parentSlug` matters: a subspace lives at
 * `/space/:spaceSlug/subspaces/:subspaceSlug`, not at `/space/:slug`. Passing a
 * subspace without it produces a link to a space that does not exist.
 */
export function toSpaceCard(space: MockSpaceCard, parentSlug?: string): SpaceCardData {
  return {
    id: space.id,
    name: space.name,
    description: space.description,
    bannerImageUrl: space.bannerImage,
    avatarUrl: space.avatar,
    initials: space.initials,
    avatarColor: space.avatarColor,
    isPrivate: space.isPrivate,
    isMember: space.isMember,
    isPinned: space.isPinned,
    tags: space.tags,
    leads: space.leads.map(toLead),
    href: parentSlug
      ? `/space/${parentSlug}/subspaces/${space.slug}`
      : `/space/${space.slug}`,
    parent: space.parent ? toParent(space.parent) : undefined,
  };
}

/**
 * Membership fixture → `SpaceCardData`.
 *
 * Replaces three duplicated local `toSpaceCardData` helpers that each built the
 * prototype's old card shape (and seeded a random member count the card never
 * rendered). Demo leads are shared so subspace grids stay visually consistent.
 */
export type MembershipLike = {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  isPrivate: boolean;
  initials: string;
  color: string;
  image?: string;
  parentName?: string;
};

const DEMO_LEADS: SpaceLead[] = [
  {
    name: 'Sarah Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64',
    type: 'person',
  },
  {
    name: 'Mike Ross',
    avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=64&h=64',
    type: 'person',
  },
];

export function membershipToSpaceCard(item: MembershipLike, parentSlug?: string): SpaceCardData {
  return {
    id: item.id,
    name: item.name,
    description: item.tagline ?? '',
    bannerImageUrl: item.image,
    initials: item.initials,
    avatarColor: item.color,
    isPrivate: item.isPrivate,
    tags: [],
    leads: DEMO_LEADS,
    href: parentSlug ? `/space/${parentSlug}/subspaces/${item.slug}` : `/space/${item.slug}`,
  };
}

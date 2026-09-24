import type {
  MembershipItem as CrdMembershipItem,
  MembershipRole as CrdMembershipRole,
} from '@/crd/components/dashboard/MyMemberships/types';
import type { MembershipItem, MembershipRole } from '@/app/components/memberships/membershipData';

/**
 * Mock memberships → the tree `MyMembershipsPanel` expects.
 *
 * Three shape differences, all resolved here:
 *
 * - **Flat vs nested.** The fixtures are a flat list joined by `parentId`; CRD's
 *   panel walks a real tree (`children`) and renders it recursively, so it is not
 *   limited to the two levels the prototype's own panel could show.
 * - **`slug` vs `href`.** A subspace lives at `/space/:parent/subspaces/:slug`,
 *   so the parent has to be resolved before the link can be built — the same rule
 *   as `spaceCard.ts`.
 * - **`role` vs `roles[]`.** CRD models membership as a set, because one person can
 *   be both lead and admin of a Space.
 *
 * The prototype's fourth role, `Host`, has no CRD equivalent: production treats
 * hosting as an *account* relationship rather than a membership, and surfaces it
 * through a separately scoped panel (see `hideRoleFilter` in CRD's types). Mapped
 * to `admin` here, which is what a host is inside their own Space, so those six
 * fixtures stay visible and filterable instead of disappearing from the panel.
 */
const ROLE_MAP: Record<MembershipRole, CrdMembershipRole> = {
  Admin: 'admin',
  Lead: 'lead',
  Member: 'member',
  Host: 'admin',
};

export function toMembershipTree(items: MembershipItem[]): CrdMembershipItem[] {
  const bySlug = new Map(items.map(i => [i.id, i]));

  const toNode = (item: MembershipItem, parentSlug?: string): CrdMembershipItem => ({
    id: item.id,
    name: item.name,
    href: parentSlug ? `/space/${parentSlug}/subspaces/${item.slug}` : `/space/${item.slug}`,
    tagline: item.tagline,
    isPrivate: item.isPrivate,
    roles: [ROLE_MAP[item.role]],
    initials: item.initials,
    color: item.color,
    image: item.image,
    children: items.filter(child => child.parentId === item.id).map(child => toNode(child, item.slug)),
  });

  // Roots are the items with no parent, plus any orphan whose `parentId` points at
  // a fixture that is not in this list — dropping those would silently hide a Space.
  return items.filter(i => !i.parentId || !bySlug.has(i.parentId)).map(i => toNode(i));
}

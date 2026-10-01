import type {
  MemberCardData,
  MemberRoleKey,
  MemberRoleType,
} from '@/crd/components/space/SpaceMembers';

/**
 * Community fixtures → `MemberCardData`, the type CRD's `SpaceMembers` exports.
 *
 * The role translation is the interesting part. The prototype labels people
 * Host / Admin / Lead / Member; production deliberately **never surfaces
 * administrative status** on a member card — its `MemberRoleKey` is only
 * `lead | member | organization`, resolved by precedence Lead > Member. So a
 * Host or an Admin shows as a Lead, which is what production does with the
 * same data.
 *
 * `roleType` drives the badge colour: `moderator` for leads, `member`
 * otherwise. Organizations get neither.
 */

export type MockMember = {
  id: string;
  name: string;
  role: string;
  avatar: string | null;
  bio?: string;
  tags?: string[];
  location?: string;
};

export type MockOrg = {
  id: string;
  name: string;
  type: string;
  description?: string;
  avatar: string;
  tags?: string[];
  location?: string;
};

/** Host and Admin are elevated roles; production shows both as Lead. */
const LEAD_ROLES = new Set(['host', 'admin', 'lead']);

export function toMemberCard(member: MockMember): MemberCardData {
  const isLead = LEAD_ROLES.has(member.role.toLowerCase());
  const role: MemberRoleKey = isLead ? 'lead' : 'member';
  const roleType: MemberRoleType = isLead ? 'moderator' : 'member';

  return {
    id: member.id,
    name: member.name,
    avatarUrl: member.avatar ?? undefined,
    type: 'user',
    role,
    roles: [role],
    roleType,
    location: member.location,
    tagline: member.bio,
    tags: member.tags ?? [],
    href: `/user/${member.name.toLowerCase().replace(/ /g, '-')}`,
  };
}

export function toOrgCard(org: MockOrg): MemberCardData {
  return {
    id: org.id,
    name: org.name,
    avatarUrl: org.avatar || undefined,
    type: 'organization',
    role: 'organization',
    roles: ['organization'],
    location: org.location,
    tagline: org.description,
    tags: org.tags ?? [],
    href: `/org/${org.id}`,
  };
}

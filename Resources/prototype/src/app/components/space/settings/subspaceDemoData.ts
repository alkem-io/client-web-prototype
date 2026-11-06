import type { LayoutPoolColumn } from '@/crd/components/space/settings/SpaceSettingsLayoutView.types';
import type { SubspaceTile } from '@/crd/components/space/settings/SpaceSettingsSubspacesView';
import type { UpdateMessage } from '@/crd/components/space/settings/SpaceSettingsUpdatesView';
import type { TemplateContent } from '@/crd/components/templates/types';
import { getInitials } from '@/crd/lib/getInitials';
import { DEMO_MEMBERS, DEMO_PENDING } from './communityDemoData';
import type { AboutState } from './SpaceAboutTab';
import type { CommunityData } from './SpaceCommunityTab';
import { DEMO_SETTINGS, type SettingsValues } from './SpaceSettingsTab';
import { tile } from './SpaceSubspacesTab';
import { ELENA, SARAH } from './SpaceUpdatesTab';

export type SubspaceProfile = {
  title: string;
  description: string;
  initials: string;
  avatarImage?: string;
};

const avatar = (photo: string) =>
  `https://images.unsplash.com/photo-${photo}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200`;

const SUBSPACES: Record<string, Omit<SubspaceProfile, 'initials'>> = {
  'renewable-energy-transition': {
    title: 'Renewable Energy Transition',
    description: 'Developing strategies for municipal energy transition to 100% renewables by 2030.',
    avatarImage: avatar('1509391366360-2e959784a276'),
  },
  'urban-mobility-lab': {
    title: 'Urban Mobility Lab',
    description: 'Reimagining city transportation networks for better accessibility and reduced carbon footprint.',
    avatarImage: avatar('1556741533-6e6a62bd8b49'),
  },
  'green-infrastructure': {
    title: 'Green Infrastructure',
    description: 'Planning and implementation of urban green spaces, vertical gardens, and sustainable drainage.',
    avatarImage: avatar('1518531933037-91b2f5f229cc'),
  },
};

/** The demo subspace at this address; any other address gets a name from its slug. */
export function getSubspaceProfile(slug: string): SubspaceProfile {
  const known = SUBSPACES[slug];
  const title = known?.title ?? slug.replace(/-/g, ' ').replace(/\b\w/g, character => character.toUpperCase());
  return {
    title,
    description: known?.description ?? 'A focused collaboration area.',
    avatarImage: known?.avatarImage,
    initials: getInitials(title),
  };
}

const CARD_BANNER = 'https://images.unsplash.com/photo-1690191863988-f685cddde463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800';

export const buildSubspaceAbout = (profile: SubspaceProfile): AboutState => ({
  about: {
    name: profile.title,
    tagline: profile.description,
    country: 'NL',
    city: 'Amsterdam',
    avatar: { id: 'avatar', uri: profile.avatarImage ?? null, altText: null, aspectRatio: 1 },
    // Subspaces have no page banner: production's view doesn't show this one.
    pageBanner: { id: 'page-banner', uri: null, altText: null },
    cardBanner: { id: 'card-banner', uri: CARD_BANNER, altText: null, aspectRatio: 416 / 256 },
    tagsetId: 'tagset-1',
    tags: ['Innovation', 'Collaboration'],
    profileId: `profile-${profile.title}`,
    references: [{ id: 'ref-1', title: 'Challenge Brief', uri: 'https://example.com/brief', description: '' }],
    what: 'This subspace focuses on developing strategies and practical solutions for this challenge area.',
    why: 'Because collaboration across disciplines is essential to make real progress on this challenge.',
    who: 'Subject matter experts, practitioners, and anyone passionate about contributing to this challenge.',
  },
  classifications: [],
});

// A subspace has no host of its own: whoever hosts the space leads here.
const LEAD = { ...ELENA, roleLabel: 'Lead' };

export const DEMO_SUBSPACE_UPDATES: UpdateMessage[] = [
  {
    id: 'su-1',
    author: LEAD,
    timestamp: new Date('2024-02-18').getTime(),
    body: "**Phase 2 Kickoff: What to Expect**\n\nPhase 2 of this challenge is now underway. Over the next four weeks we'll be prototyping and testing the top 5 ideas that emerged from Phase 1.",
  },
  {
    id: 'su-2',
    author: SARAH,
    timestamp: new Date('2024-02-10').getTime(),
    body: '**Community Survey Results**\n\nThank you to everyone who took part. We received 47 responses, and the top priorities are:\n\n1. More structured collaboration workshops\n2. Regular progress updates',
  },
  {
    id: 'su-3',
    author: LEAD,
    timestamp: new Date('2024-02-05').getTime(),
    body: "**Welcome & Phase 1 Recap**\n\nA warm welcome to all new members who joined this month! Here's a quick recap of what we accomplished in Phase 1.",
  },
];

export const DEMO_SUBSPACE_SETTINGS: SettingsValues = {
  ...DEMO_SETTINGS,
  allowedActions: [
    { key: 'subspaceAdminInvitations', enabled: true },
    { key: 'memberCreatePosts', enabled: true },
    { key: 'videoCalls', enabled: true },
    { key: 'guestContributions', enabled: false },
    { key: 'memberCreateSubspaces', enabled: false },
    { key: 'inheritMembershipRights', enabled: true },
  ],
};

export const DEMO_SUBSPACE_COMMUNITY: CommunityData = {
  // A subspace has no host of its own: whoever hosts the space leads here.
  members: DEMO_MEMBERS.slice(0, 14).map(member =>
    member.roleLabel === 'Host' ? { ...member, roleLabel: 'Lead', isLead: true, isAdmin: false } : member
  ),
  pending: DEMO_PENDING,
  organizations: [{ id: 'org1', displayName: 'Partner Org', isMember: true, isLead: false }],
  orgInvitations: [
    {
      id: 'inv1',
      organizationDisplayName: 'Green Future Labs',
      role: 'member',
      createdDate: '2024-02-18T10:00:00Z',
      canRevoke: true,
    },
  ],
  virtualContributors: [],
};

export const buildNestedSubspaces = (base: string): SubspaceTile[] =>
  [
    tile('n1', 'Solar Panel Research', 'Exploring next-gen photovoltaic technologies and materials.', '1509391366360-2e959784a276'),
    tile('n2', 'Wind Energy Models', 'Computational fluid dynamics models for wind turbine placement.', '1532601224476-15c79f2f7a51'),
    tile('n3', 'Policy Analysis', 'Reviewing legislative frameworks for renewable energy subsidies.', '1589829545856-d10d557cf95f', 'archived'),
  ].map(subspace => ({
    ...subspace,
    href: `${base}/subspaces/${subspace.name.toLowerCase().replace(/\s+/g, '-')}`,
  }));

const phase = (id: string, title: string, description: string, posts: string[], current = false): LayoutPoolColumn => ({
  id,
  title,
  description,
  isCurrentPhase: current,
  isHidden: false,
  isDeletable: true,
  layout: { descriptionCollapsed: false, showPublishDetails: true, sidebar: [] },
  defaultCalloutTemplate: null,
  callouts: posts.map((postTitle, index) => ({
    id: `${id}-${index}`,
    title: postTitle,
    description: '',
    flowStateTagsetId: id,
    profileUrl: `#${id}-${index}`,
  })),
});

export const buildSubspacePhases = (): LayoutPoolColumn[] => [
  phase('explore', 'Explore', 'Diverge: gather ideas, research, and inspiration.', ['Research: Stakeholder Interviews', 'Desk Research Summary'], true),
  phase('define', 'Define', 'Converge: synthesise insights into a clear problem statement.', ['Problem Statement v1']),
  phase('ideate', 'Ideate', 'Diverge: brainstorm and generate creative solutions.', ['Brainstorm: Solar Integration', 'Concept Map: Grid Modernisation']),
  phase('prototype', 'Prototype', 'Converge: build and test low-fidelity prototypes.', []),
];

/** Writes a flow down as a template's phases and starter posts. */
export const flowToTemplateContent = (columns: LayoutPoolColumn[]): TemplateContent => ({
  type: 'space',
  phases: columns.map(column => ({ name: column.title, description: column.description })),
  starterCallouts: columns.flatMap(column =>
    column.callouts.map(callout => ({ name: callout.title, framingKind: 'none' as const, flowStateName: column.title }))
  ),
  subspaceTemplates: [],
});

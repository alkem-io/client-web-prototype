import type { MembershipDetailQuestion } from '@/crd/components/space/settings/MembershipDetailDialog';
import type { PendingMembership } from '@/crd/components/space/settings/PendingMembershipsTable';
import type {
  CommunityMember,
  CommunityOrg,
  CommunityVC,
  PendingOrganizationInvitation,
} from '@/crd/components/space/settings/SpaceSettingsCommunityView';

const IMAGE = (photo: string) =>
  `https://images.unsplash.com/photo-${photo}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256`;

const member = (
  id: string,
  displayName: string,
  email: string,
  joinedDate: string,
  roleLabel: 'Host' | 'Admin' | 'Lead' | 'Member',
  avatarUrl?: string
): CommunityMember => ({
  id,
  displayName,
  email,
  avatarUrl,
  url: `/user/${displayName.toLowerCase().replace(/\s+/g, '-')}`,
  roleLabel,
  isLead: roleLabel === 'Lead',
  isAdmin: roleLabel === 'Admin' || roleLabel === 'Host',
  joinedDate,
});

const MORE_MEMBERS = [
  'James Wilson', 'Emma Thompson', 'Lucas Oliveira', 'Sophia Li', 'Oliver Smith',
  'Ava Patel', 'William Chen', 'Isabella Garcia', 'Henry Wilson', 'Mia Kim',
  'Alexander Wright', 'Charlotte Davis', 'Daniel Lee', 'Amelia White', 'Matthew Clark',
  'Harper Lewis', 'Joseph Hall', 'Evelyn Young', 'Samuel Allen', 'Abigail King',
];

export const DEMO_MEMBERS: CommunityMember[] = [
  member('u1', 'Elena Martinez', 'elena@alkemio.org', '2023-10-15', 'Host', IMAGE('1623853589874-864b1dd4d922')),
  member('u2', 'Sarah Chen', 'sarah.chen@example.com', '2023-11-02', 'Admin', IMAGE('1757347398206-7425300ef990')),
  member('u3', 'Maya Ross', 'maya.r@example.com', '2023-12-10', 'Lead', IMAGE('1589332911105-a6b59f2e4c4b')),
  member('u4', 'David Kim', 'dkim@design.co', '2024-01-05', 'Member', IMAGE('1651634099348-e4c38cfaa6d5')),
  member('u5', 'Robert Fox', 'robert.fox@example.com', '2024-01-12', 'Member', IMAGE('1651097681268-851acda33b18')),
  ...MORE_MEMBERS.map((name, index) =>
    member(`m${index + 6}`, name, `member${index + 6}@example.com`, '2024-02-15', index < 3 ? 'Lead' : 'Member')
  ),
];

const pending = (
  id: string,
  displayName: string,
  email: string,
  createdDate: string,
  overrides: Partial<PendingMembership>
): PendingMembership => ({
  id,
  displayName,
  email,
  createdDate,
  type: 'application',
  state: 'new',
  contributorType: 'user',
  canApprove: true,
  canReject: true,
  canDelete: true,
  canResend: false,
  ...overrides,
});

export const DEMO_PENDING: PendingMembership[] = [
  pending('p1', 'Michael Chen', 'm.chen@university.edu', '2024-02-20T10:00:00Z', {}),
  pending('p2', 'Jessica Alverez', 'jess.alverez@studio.com', '2024-02-21T10:00:00Z', {}),
  pending('a1', 'Lisa Park', 'lisa.park@venture.io', '2024-02-22T10:00:00Z', {
    state: 'approving',
    canApprove: false,
    canReject: false,
    canDelete: false,
  }),
  pending('i1', 'Thomas Wright', 'tom.wright@construction.com', '2024-02-18T10:00:00Z', {
    type: 'invitation',
    state: 'invited',
    canApprove: false,
    canReject: false,
  }),
  pending('i2', 'Emily Zhang', 'emily.z@tech.io', '2024-02-19T10:00:00Z', {
    type: 'invitation',
    state: 'invited',
    canApprove: false,
    canReject: false,
  }),
  pending('i3', 'new.member@example.com', 'new.member@example.com', '2024-02-23T10:00:00Z', {
    type: 'platformInvitation',
    state: 'invited',
    canApprove: false,
    canReject: false,
    canResend: true,
  }),
];

const JOIN_QUESTION = 'Why do you want to join this space?';
const LINK_QUESTION = 'Link to your portfolio or LinkedIn profile';

export const DEMO_APPLICATION_ANSWERS: Record<string, MembershipDetailQuestion[]> = {
  p1: [
    { id: 'q1', question: JOIN_QUESTION, answer: 'As a researcher in urban mobility at TU Delft, this space aligns with my work.' },
    { id: 'q2', question: LINK_QUESTION, answer: 'https://linkedin.com/in/michaelchen-research' },
  ],
  p2: [
    { id: 'q1', question: JOIN_QUESTION, answer: 'I run a design studio focused on social impact projects and would love to bring that perspective.' },
    { id: 'q2', question: LINK_QUESTION, answer: 'https://jessicaalverez.studio' },
  ],
  a1: [
    { id: 'q1', question: JOIN_QUESTION, answer: 'I work in venture capital focused on climate tech.' },
    { id: 'q2', question: LINK_QUESTION, answer: 'https://linkedin.com/in/lisapark-vc' },
  ],
};

export const DEMO_ORGS: CommunityOrg[] = [
  { id: 'org1', displayName: 'Acme Corp', url: '/org/acme-corp', isMember: true, isLead: false },
  { id: 'org2', displayName: 'Global Tech', url: '/org/global-tech', isMember: true, isLead: true },
];

export const DEMO_ORG_INVITATIONS: PendingOrganizationInvitation[] = [
  { id: 'inv1', organizationDisplayName: 'Green Future Labs', role: 'member', createdDate: '2024-02-18T10:00:00Z', canRevoke: true },
  { id: 'inv2', organizationDisplayName: 'Policy Institute', role: 'memberLead', createdDate: '2024-02-20T10:00:00Z', canRevoke: true },
];

export const DEMO_VCS: CommunityVC[] = [
  { id: 'vc1', displayName: 'Summarizer Bot', url: '/vc/summarizer-bot' },
  { id: 'vc2', displayName: 'Translation Assistant', url: '/vc/translation-assistant' },
];

export const INVITABLE_PEOPLE = [
  { userId: 'c1', displayName: 'Nina Bakker', location: 'Amsterdam, Netherlands' },
  { userId: 'c2', displayName: 'Omar Haddad', location: 'Rotterdam, Netherlands' },
  { userId: 'c3', displayName: 'Priya Nair', location: 'Berlin, Germany' },
  { userId: 'c4', displayName: 'Tomás Rivera', location: 'Madrid, Spain' },
];

export const INVITABLE_ORGS = [
  { userId: 's1', displayName: 'TU Delft' },
  { userId: 's2', displayName: 'Climate Lab' },
  { userId: 's3', displayName: 'Urban Futures' },
  { userId: 's4', displayName: 'Digital Commons' },
  { userId: 's5', displayName: 'Nexus Ventures' },
  { userId: 's6', displayName: 'Open Society Foundation' },
];

export const ADDABLE_VCS = [
  { id: 'vc3', displayName: 'Research Assistant', email: null },
  { id: 'vc4', displayName: 'Meeting Note Taker', email: null },
];

export const DEMO_APPLICATION_FORM = {
  description: 'Tell us a little about yourself and why you would like to join.',
  questions: [
    { question: JOIN_QUESTION, required: true, sortOrder: 0 },
    { question: LINK_QUESTION, required: false, sortOrder: 1 },
  ],
};

export const DEMO_GUIDELINES = {
  title: 'How we work together',
  body: 'Be respectful, share openly, and contribute constructively.',
  references: [],
};

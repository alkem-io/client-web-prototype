/**
 * Every person, organisation and virtual contributor the prototype shows, in
 * one place, so a hover card can be shown wherever one of them appears.
 *
 * Mock data only. It reads the fixtures that already exist (the space members
 * page, search, the VC library) rather than repeating them, and adds the names
 * that only appear loose in posts, comments and chats. Those extra names carry
 * no invented details: their card shows the name and the picture on the page.
 *
 * Read by `ContributorHoverLayer`.
 */
import { SPACE_MEMBERS, SPACE_ORGS } from '@/app/components/space/SpaceMembers';
import { MOCK_ORGS, MOCK_USERS } from '@/app/components/search/searchData';
import { MOCK_VC_LIBRARY } from '@/app/components/vc/VirtualContributor';

export type ContributorKind = 'user' | 'org' | 'vc';

export type Contributor = {
  kind: ContributorKind;
  name: string;
  slug: string;
  avatarUrl?: string | null;
  initials?: string;
  location?: string;
  /** A person's bio, or an organisation's / VC's description. */
  about?: string;
  tags?: string[];
};

export const slugify = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('');

export const profileUrlOf = (c: Pick<Contributor, 'kind' | 'slug'>) =>
  `/${c.kind === 'org' ? 'organization' : c.kind}/${c.slug}`;

// Names that appear in posts, comments, chats and lists without details anywhere.
const EXTRA_PEOPLE = [
  'Alex Contributor', 'Alice Chen', 'Francisco R.', 'Amara Osei', 'Anna Smith', 'Anna Visser', 'Bob Johnson',
  'Carol Lee', 'David Kumar', 'Donna Dublon', 'Emma Wilson', 'Erick Ntambo', 'Frank Wilson',
  'Grace Hopper', 'Ines Duarte', 'Jordan Smith', 'Joris Bakker', 'Luca Bertani', 'Lucas Meyer',
  'Marek Nowak', 'Maria Garcia', 'Mayke Ruiterman', 'Michael Park', 'Nadia Haddad', 'Nina Patel',
  'Petra Hendriks', 'Sarah Jenkins', 'Sophie Mulder', 'Thomas Mueller',
  'Alex Rivera', 'Alex Rodriguez', 'Alex Torres', 'Anna Martinez', 'Daniel Brooks', 'David Miller',
  'David Smith', 'Denise Larssen', 'Denise Larsson', 'Elena Rodriguez', 'Emily Davis',
  'Emily Rodriguez', 'Emily Zhang', 'Galin Berytin', 'Jeroen Nijkamp', 'Jessica Alverez',
  'Lisa Chen', 'Lisa Park', 'Marc Johnson', 'Maria Jansen', 'Mayke Ragin', 'Michael Chang',
  'Michael Chen', 'Mike Ross', 'Neil Smyth', 'Nina Petrova', 'Piet Sjoerdsma', 'Priya Sharma',
  'Robert Hayes', 'Robin Z. Tharakan', 'Sanne Vermeer', 'Simone Rietmeijer', 'Thomas Wright',
  'Tom Bakker', 'Tom Bradley', 'Tomasz Kowalski',
];

const EXTRA_ORGS = [
  'Acme Corp', 'Municipality Amsterdam', 'Partner Org',
  'City Planning Dept', 'Google Ventures', 'Green Future Org', 'Health Innovation Alliance',
  'Nexus Ventures', 'Open Climate Fix', 'Sandbox Organization', 'Urban Tech Alliance',
];

const EXTRA_VCS: Contributor[] = [
  {
    kind: 'vc', name: 'Summarizer Bot', slug: 'summarizer-bot',
    about: 'Automatically summarizes long discussions and documents',
    tags: ['Automation', 'Documentation', 'AI'],
  },
  {
    kind: 'vc', name: 'Translation Assistant', slug: 'translation-assistant',
    about: 'Translates content to 50+ languages in real-time',
    tags: ['Translation', 'Multilingual', 'Communication'],
  },
  { kind: 'vc', name: 'Research Assistant Bot', slug: 'research-assistant-bot' },
  {
    kind: 'vc', name: 'Design Advisor', slug: 'design-advisor',
    avatarUrl: 'https://images.unsplash.com/photo-1641312874336-6279a832a3dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256',
    about: 'AI assistant trained on design thinking and collaboration frameworks.',
  },
  { kind: 'vc', name: 'The Collaboration Methodologist', slug: 'collaboration-methodologist', initials: 'CM' },
  { kind: 'vc', name: 'Alkemio Knobi', slug: 'alkemio-knobi' },
  // The innovation hub's assistants.
  {
    kind: 'vc', name: 'VNG Kennisassistent', slug: 'vng-kennisassistent',
    about: 'AI-assistent gespecialiseerd in gemeentelijke regelgeving, VNG-resoluties en best practices.',
  },
  {
    kind: 'vc', name: 'Subsidie Navigator', slug: 'subsidie-navigator',
    about: 'Helpt gemeenten bij het vinden en aanvragen van relevante subsidies en fondsen.',
  },
  {
    kind: 'vc', name: 'Data Analyst Bot', slug: 'data-analyst-bot',
    about: 'Automatische analyse van gemeentelijke datasets en generatie van inzichten en rapportages.',
  },
  {
    kind: 'vc', name: 'Inkoop Adviseur', slug: 'inkoop-adviseur',
    about: 'Ondersteunt bij aanbestedingen en inkooptrajecten conform gemeentelijke richtlijnen.',
  },
  {
    kind: 'vc', name: 'Communicatie Coach', slug: 'communicatie-coach',
    about: 'Helpt bij het schrijven van heldere inwonercommunicatie en beleidsteksten.',
  },
  {
    kind: 'vc', name: 'Privacy Officer Bot', slug: 'privacy-officer-bot',
    about: "Adviseert over AVG-compliance, DPIA's en privacybeleid voor gemeentelijke systemen.",
  },
  {
    kind: 'vc', name: 'DataSynth Bot', slug: 'datasynth-bot',
    about: 'Generates synthetic datasets for urban modeling.',
  },
  {
    kind: 'vc', name: 'PolicyScanner', slug: 'policyscanner',
    about: 'Scans municipal meeting minutes for keywords.',
  },
];

const ALL: Contributor[] = [
  ...SPACE_MEMBERS.map((m): Contributor => ({
    kind: 'user',
    name: m.name,
    slug: slugify(m.name),
    avatarUrl: m.avatar,
    initials: m.initials,
    location: m.location,
    about: m.bio || undefined,
    tags: m.skills,
  })),
  ...MOCK_USERS.map((u): Contributor => ({ kind: 'user', name: u.name, slug: slugify(u.name), avatarUrl: u.avatar })),
  ...EXTRA_PEOPLE.map((name): Contributor => ({ kind: 'user', name, slug: slugify(name) })),
  ...SPACE_ORGS.map((o): Contributor => ({
    kind: 'org',
    name: o.name,
    slug: slugify(o.name),
    avatarUrl: o.avatar,
    initials: o.initials,
    location: o.location,
    about: o.description,
    tags: o.skillTags,
  })),
  ...MOCK_ORGS.map((o): Contributor => ({
    kind: 'org',
    name: o.name,
    slug: slugify(o.name),
    avatarUrl: o.avatar || undefined,
    about: o.tagline,
  })),
  ...EXTRA_ORGS.map((name): Contributor => ({ kind: 'org', name, slug: slugify(name) })),
  ...MOCK_VC_LIBRARY.map((v): Contributor => ({
    kind: 'vc',
    name: v.name,
    slug: v.slug,
    avatarUrl: v.avatarUrl,
    about: v.description,
    tags: v.tags,
  })),
  ...EXTRA_VCS,
];

// The first entry for a name wins: the earlier sources are the richer ones.
const BY_NAME = new Map<string, Contributor>();
const BY_SLUG = new Map<string, Contributor>();
for (const c of ALL) {
  const key = c.name.toLowerCase();
  if (!BY_NAME.has(key)) BY_NAME.set(key, c);
  const slugKey = `${c.kind}:${c.slug}`;
  if (!BY_SLUG.has(slugKey)) BY_SLUG.set(slugKey, c);
}

/** Longest first, so "Elena Martinez" is tried before a shorter name it contains. */
export const CONTRIBUTOR_NAMES = [...BY_NAME.keys()].sort((a, b) => b.length - a.length);

export const findContributorByName = (name: string | null | undefined) =>
  name ? BY_NAME.get(name.trim().toLowerCase()) : undefined;

export const findContributorBySlug = (kind: ContributorKind, slug: string) => BY_SLUG.get(`${kind}:${slug}`);

/**
 * Demo data for "who can read what I post" (client-web#7730): which spaces are
 * public or private, and whether the viewer is a member.
 *
 * Zuidplein 2030 is the example from the design, set up twice so every case has
 * a page to look at: once as a private space, once as a public one. Every other
 * space is public, and you are already a member of it.
 *
 * Add `?viewer=…` to any space or subspace address to change who is looking. It
 * is remembered in that browser tab.
 *   member   a member (the default)
 *   visitor  not a member: nothing new is shown
 *   new      a member on their first visit: shows the welcome dialog again
 */
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { type Audience, resolveAudience, type SpaceAccess } from '@/ahead/WhoCanRead';

type DemoPlace = { name: string; tagline: string; isPrivate: boolean };
export type DemoSubspace = DemoPlace & { slug: string; initials: string; color: string };
export type DemoSpace = DemoPlace & { description: string; subspaces: DemoSubspace[] };

const ZUIDPLEIN = {
  name: 'Zuidplein 2030',
  tagline: 'Rebuilding a district with the people who live in it.',
  description:
    'Residents, shop owners, the municipality and designers work together on what Zuidplein should be in 2030.',
};
const MOBILITY = {
  slug: 'mobility-and-streets',
  name: 'Mobility & Streets',
  tagline: 'Redesigning street use in the Zuidplein district, with the people who live on it.',
  initials: 'MS',
  color: '#3b6e8f',
};
const GREEN_ROOFS = {
  slug: 'green-roofs',
  name: 'Green roofs',
  tagline: 'Turning the flat roofs of Zuidplein into gardens.',
  initials: 'GR',
  color: '#2c8a7e',
};
const MARKET_SQUARE = {
  slug: 'market-square',
  name: 'Market square',
  tagline: 'Plans for the square, before they are shared.',
  initials: 'MS',
  color: '#b7791f',
};

export const DEMO_SPACES: Record<string, DemoSpace> = {
  'zuidplein-2030': {
    ...ZUIDPLEIN,
    isPrivate: true,
    subspaces: [
      { ...GREEN_ROOFS, isPrivate: false },
      { ...MOBILITY, isPrivate: false },
      { ...MARKET_SQUARE, isPrivate: true },
    ],
  },
  'zuidplein-2030-public': {
    ...ZUIDPLEIN,
    isPrivate: false,
    subspaces: [
      { ...GREEN_ROOFS, isPrivate: false },
      { ...MOBILITY, isPrivate: true },
      { ...MARKET_SQUARE, isPrivate: true },
    ],
  },
};

/** Subspaces outside the demo spaces that are marked private elsewhere in the mock data. */
const PRIVATE_SUBSPACES = new Set(['policy-frameworks']);

const KNOWN_NAMES: Record<string, string> = { 'green-energy': 'Green Energy Space' };
const nameFromSlug = (slug: string) =>
  KNOWN_NAMES[slug] ?? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

/** Own entries only: a slug comes from the address, so it can be anything. */
export const demoSpace = (spaceSlug: string): DemoSpace | undefined =>
  Object.hasOwn(DEMO_SPACES, spaceSlug) ? DEMO_SPACES[spaceSlug] : undefined;

export const demoSubspace = (spaceSlug: string, subspaceSlug: string): DemoSubspace | undefined =>
  demoSpace(spaceSlug)?.subspaces.find(s => s.slug === subspaceSlug);

/** `path` runs from the space down: space, subspace, sub-subspace. */
export function spaceAccess(path: string[]): SpaceAccess {
  const [spaceSlug, ...below] = path;
  const demo = demoSpace(spaceSlug);
  let access: SpaceAccess = { name: demo?.name ?? nameFromSlug(spaceSlug), isPrivate: demo?.isPrivate ?? false };
  below.forEach((slug, depth) => {
    const sub = depth === 0 ? demoSubspace(spaceSlug, slug) : undefined;
    access = {
      name: sub?.name ?? nameFromSlug(slug),
      isPrivate: sub?.isPrivate ?? PRIVATE_SUBSPACES.has(slug),
      parent: access,
    };
  });
  return access;
}

export const audienceFor = (path: string[]): Audience => resolveAudience(spaceAccess(path));

// ── Who is looking ──────────────────────────────────────────────────────────

const VIEWER_KEY = 'alkemio-demo-viewer';
const SEEN_KEY = 'alkemio-demo-welcome-seen';

function read(storage: () => Storage, key: string) {
  try {
    return storage().getItem(key);
  } catch {
    return null; // storage blocked: behave as a first visit
  }
}
function write(storage: () => Storage, key: string, value: string) {
  try {
    storage().setItem(key, value);
  } catch {
    // storage blocked: nothing to remember
  }
}
const session = () => window.sessionStorage;
const local = () => window.localStorage;

/** Members and admins see everything here; visitors see nothing new. */
export function useIsMember(): boolean {
  const [params] = useSearchParams();
  const asked = params.get('viewer');
  if (asked) write(session, VIEWER_KEY, asked === 'visitor' ? 'visitor' : 'member');
  return read(session, VIEWER_KEY) !== 'visitor';
}

/** Whether the once-only welcome still has to be shown for this space or subspace. */
export function useFirstVisit(path: string[]): [firstVisit: boolean, markSeen: () => void] {
  const [params] = useSearchParams();
  const isMember = useIsMember();
  const [dismissed, setDismissed] = useState<string[]>([]);

  const id = path.join('/');
  const seen = (read(local, SEEN_KEY) ?? '').split(' ');
  const demo = path.length === 1 ? demoSpace(path[0]) : path.length === 2 && demoSubspace(path[0], path[1]);
  const showAgain = params.get('viewer') === 'new';
  const firstVisit = isMember && !dismissed.includes(id) && (showAgain || (Boolean(demo) && !seen.includes(id)));

  const markSeen = () => {
    setDismissed(prev => [...prev, id]);
    if (!seen.includes(id)) write(local, SEEN_KEY, [...seen, id].join(' ').trim());
  };
  return [firstVisit, markSeen];
}

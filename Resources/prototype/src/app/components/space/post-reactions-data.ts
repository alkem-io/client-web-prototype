/**
 * Emoji responses on posts — data layer.
 *
 * Concept 02, unnamed variant: a space curates which emoji its members can use,
 * but nobody writes a word for them. The emoji is the whole signal, so nothing
 * here carries a label — the reactor list and the author notification show the
 * emoji itself rather than an invented name.
 *
 * Two platform rules are enforced here rather than left to callers:
 *  - one reaction per person, per post (`toggleReaction` replaces, never stacks)
 *  - reactions never aggregate beyond the post they belong to
 */

export type ReactionUser = {
  id: string;
  name: string;
  initials: string;
  /** Real profile picture. Falls back to initials when absent or the image 404s. */
  avatarUrl?: string;
};

export type PostReaction = {
  emoji: string;
  user: ReactionUser;
  /** Relative time, already humanised (the prototype has no clock). */
  at: string;
};

/**
 * The platform set, in display order — the same seven everywhere for v1.
 *
 * Per-space curation is designed (concept 02) but deliberately not built yet:
 * a fixed set is what fits the sprint, and it also means the first round of
 * usage data comes from one set rather than a hundred divergent ones. Order is
 * fixed too — it drives both the picker and the emoji shown on a post, so it
 * must never be sorted by popularity.
 *
 * Warm-only by rule: nothing here can be used to vote a person down.
 */
export const DEFAULT_REACTION_OPTIONS = ['❤️', '🙋', '👏', '💡', '🎯', '✅', '🚀'] as const;

/** The viewer, for optimistic rendering of their own reaction. */
export const VIEWER: ReactionUser = {
  id: 'viewer',
  name: 'You',
  initials: 'You',
};

/**
 * Community members reused from the space roster so reactions show real faces.
 * Kept in this module (rather than imported from `SpaceMembers`) because that
 * file keeps its roster private and this list needs to outlive it.
 */
export const REACTION_MEMBERS: ReactionUser[] = [
  {
    id: 'u1',
    name: 'Elena Martinez',
    initials: 'EM',
    avatarUrl:
      'https://images.unsplash.com/photo-1623853589874-864b1dd4d922?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGdsYXNzZXMlMjBibGFjayUyMGFuZCUyMHdoaXRlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5NDQyNTM3fDA&ixlib=rb-4.1.0&q=80&w=256',
  },
  {
    id: 'u2',
    name: 'Sarah Chen',
    initials: 'SC',
    avatarUrl:
      'https://images.unsplash.com/photo-1757347398206-7425300ef990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNtaWxpbmclMjBkYXJrJTIwaGFpciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTQ0MjUzN3ww&ixlib=rb-4.1.0&q=80&w=256',
  },
  {
    id: 'u3',
    name: 'Maya Ross',
    initials: 'MR',
    avatarUrl:
      'https://images.unsplash.com/photo-1589332911105-a6b59f2e4c4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNtaWxpbmclMjBkYXJrJTIwaGFpciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTQ0MjUzN3ww&ixlib=rb-4.1.0&q=80&w=256',
  },
  {
    id: 'u4',
    name: 'David Kim',
    initials: 'DK',
    avatarUrl:
      'https://images.unsplash.com/photo-1651634099348-e4c38cfaa6d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBiZWFyZCUyMHN1bnNldCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTQ0MjUzN3ww&ixlib=rb-4.1.0&q=80&w=256',
  },
  {
    id: 'u5',
    name: 'Robert Fox',
    initials: 'RF',
    avatarUrl:
      'https://images.unsplash.com/photo-1651097681268-851acda33b18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGRlciUyMG1hbiUyMHdoaXRlJTIwYmVhcmQlMjBnbGFzc2VzJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5NDQyNTM3fDA&ixlib=rb-4.1.0&q=80&w=256',
  },
  {
    id: 'u6',
    name: 'Amara Osei',
    initials: 'AO',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'u7',
    name: 'Tom de Vries',
    initials: 'TV',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'u8',
    name: 'Lucas Meyer',
    initials: 'LM',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'u9',
    name: 'Nina Patel',
    initials: 'NP',
    avatarUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'u10',
    name: 'Joris Bakker',
    initials: 'JB',
    avatarUrl:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

const WHEN = ['2h ago', 'yesterday', '2d ago', '3d ago', '4d ago', '5d ago', '6d ago', 'last week'];

/**
 * Small stable hash so a post's demo reactions never reshuffle between renders.
 *
 * FNV alone clusters badly on near-identical ids — a feed of `space-1`…`space-7`
 * put three of the first four in the same bucket — so the final avalanche
 * (murmur3's fmix32) is doing real work here, not decoration.
 */
function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  h = Math.imul(h, 3266489909);
  h ^= h >>> 16;
  return h >>> 0;
}

/**
 * Demo reactions for a post that has none of its own.
 *
 * This is prototype scaffolding: it exists so every existing post in the app
 * shows the feature without each feed having to be rewritten. Real callers pass
 * `post.reactions` and this is never reached.
 */
export function seedDemoReactions(postId: string, options: readonly string[] = DEFAULT_REACTION_OPTIONS): PostReaction[] {
  const h = hash(postId);
  // Roughly a quarter of posts have no reactions — the empty state is common in
  // a real feed and needs to look deliberate rather than broken.
  if (h % 4 === 0) return [];

  const count = 1 + (h % 9);

  // A post draws on one to three of the space's emoji, not all of them. The
  // obvious even spread across `options` put every emoji on every post with
  // more than a handful of reactions, which makes the row read as decoration
  // instead of telling you what people actually said.
  const palette: string[] = [];
  for (let i = 0; palette.length < 1 + (h % 3) && i < options.length * 2; i += 1) {
    const emoji = options[(h + i * 2) % options.length];
    if (!palette.includes(emoji)) palette.push(emoji);
  }

  const out: PostReaction[] = [];
  for (let i = 0; i < count; i += 1) {
    const user = REACTION_MEMBERS[(h + i * 7) % REACTION_MEMBERS.length];
    if (out.some(r => r.user.id === user.id)) continue;
    out.push({
      emoji: palette[(h + i) % palette.length],
      user,
      at: WHEN[(h + i) % WHEN.length],
    });
  }
  return out;
}

/**
 * Apply the viewer's choice. One reaction per person per post: picking a second
 * emoji moves your reaction rather than adding one, and picking the same emoji
 * again removes it.
 */
export function toggleReaction(
  reactions: PostReaction[],
  emoji: string,
  viewer: ReactionUser = VIEWER,
): PostReaction[] {
  const mine = reactions.find(r => r.user.id === viewer.id);
  const others = reactions.filter(r => r.user.id !== viewer.id);
  if (mine && mine.emoji === emoji) return others;
  return [...others, { emoji, user: viewer, at: 'just now' }];
}

/** The viewer's current reaction on this post, if any. */
export function viewerReactionOf(reactions: PostReaction[], viewer: ReactionUser = VIEWER): string | null {
  return reactions.find(r => r.user.id === viewer.id)?.emoji ?? null;
}

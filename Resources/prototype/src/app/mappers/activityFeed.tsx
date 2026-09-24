import {
  CalendarDays,
  FileText,
  LayoutGrid,
  Link2,
  Megaphone,
  MessageSquare,
  Mic,
  Presentation,
  StickyNote,
  User,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { InlineMarkdown } from '@/crd/components/common/InlineMarkdown';
import type { ActivityItemData } from '@/crd/components/dashboard/ActivityItem';

/**
 * Mock activity → `ActivityItemData`, mirroring client-web's
 * `src/main/crdPages/dashboard/dashboardDataMappers.tsx`.
 *
 * The row's anatomy is production's, and it is not the one the prototype used
 * to have:
 *
 *   avatar        the actor — `userName` is alt text and the accessible name,
 *                 never visible text
 *   icon badge    the *verb*, as a glyph on the avatar. CRD's own note: it is
 *                 there "so the user doesn't need a verb in the title"
 *   title         the **thing** — the callout / post / whiteboard / memo name,
 *                 or, for comments and updates, the authored text itself
 *   contextName   **where it happened** — the parent callout, post or space
 *
 * So a row reads "Q1 Innovation Challenge / Innovation Lab", not
 * "Sarah Chen posted a new challenge in Innovation Lab". Only MEMBER_JOINED
 * carries a verb, because production's string for it is "{{subject}} joined".
 *
 * `kind` uses production's `ActivityEventType` values verbatim so the fixtures
 * speak client-web's vocabulary (callout, memo, whiteboard, subspace) and the
 * icon labels can come straight from CRD's own `activity.iconLabel.*` keys.
 */
export type ActivityKind =
  | 'CALLOUT_PUBLISHED'
  | 'CALLOUT_POST_CREATED'
  | 'CALLOUT_POST_COMMENT'
  | 'DISCUSSION_COMMENT'
  | 'CALLOUT_WHITEBOARD_CREATED'
  | 'CALLOUT_WHITEBOARD_CONTENT_MODIFIED'
  | 'CALLOUT_MEMO_CREATED'
  | 'CALLOUT_LINK_CREATED'
  | 'MEMBER_JOINED'
  | 'SUBSPACE_CREATED'
  | 'CALENDAR_EVENT_CREATED'
  | 'UPDATE_SENT';

export type MockActivity = {
  id: string;
  kind: ActivityKind;
  /** Who did it. Rendered as the avatar only. */
  actor: { name: string; avatar: string };
  /** The entity's display name — or, for comment/update kinds, the authored markdown. */
  subject: string;
  /** Where it happened: the parent callout, post or space. */
  context: string;
  timestamp: string;
  href?: string;
};

// Production renders the badge glyph at `size-2.5`.
const ICON_CLASS = 'size-2.5';

const ICON: Record<ActivityKind, ReactNode> = {
  CALLOUT_PUBLISHED: <Megaphone aria-hidden="true" className={ICON_CLASS} />,
  CALLOUT_POST_CREATED: <FileText aria-hidden="true" className={ICON_CLASS} />,
  CALLOUT_POST_COMMENT: <MessageSquare aria-hidden="true" className={ICON_CLASS} />,
  DISCUSSION_COMMENT: <MessageSquare aria-hidden="true" className={ICON_CLASS} />,
  CALLOUT_WHITEBOARD_CREATED: <Presentation aria-hidden="true" className={ICON_CLASS} />,
  CALLOUT_WHITEBOARD_CONTENT_MODIFIED: <Presentation aria-hidden="true" className={ICON_CLASS} />,
  CALLOUT_MEMO_CREATED: <StickyNote aria-hidden="true" className={ICON_CLASS} />,
  CALLOUT_LINK_CREATED: <Link2 aria-hidden="true" className={ICON_CLASS} />,
  MEMBER_JOINED: <User aria-hidden="true" className={ICON_CLASS} />,
  SUBSPACE_CREATED: <LayoutGrid aria-hidden="true" className={ICON_CLASS} />,
  CALENDAR_EVENT_CREATED: <CalendarDays aria-hidden="true" className={ICON_CLASS} />,
  UPDATE_SENT: <Mic aria-hidden="true" className={ICON_CLASS} />,
};

/** Kinds whose title is user-authored text rather than an entity name. */
const AUTHORED_TEXT: ReadonlySet<ActivityKind> = new Set([
  'CALLOUT_POST_COMMENT',
  'DISCUSSION_COMMENT',
  'UPDATE_SENT',
]);

const initialsOf = (name: string) =>
  name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/**
 * @param iconLabel from CRD's `activity.iconLabel.<kind>` — the accessible name
 *                  for the badge, which is what carries the verb for a11y.
 */
export function toActivityItem(a: MockActivity, iconLabel: string): ActivityItemData {
  // Production's only verb-bearing title.
  const title = a.kind === 'MEMBER_JOINED' ? `${a.actor.name} joined` : a.subject;

  return {
    id: a.id,
    avatarUrl: a.actor.avatar,
    avatarInitials: initialsOf(a.actor.name),
    userName: a.actor.name,
    activityIcon: ICON[a.kind],
    activityIconLabel: iconLabel,
    // Comment bodies and updates are authored markdown; production renders them
    // through InlineMarkdown and supplies a plain fallback for the aria-label.
    title: AUTHORED_TEXT.has(a.kind) ? (
      <InlineMarkdown content={a.subject} clampLines={2} disableLinks={true} className="text-body" />
    ) : (
      title
    ),
    titlePlain: title,
    contextName: a.context,
    titleHref: a.href,
    timestamp: a.timestamp,
  };
}

/** Filter options the prototype's two selects offered. */
export const SPACE_FILTER_OPTIONS = [
  { value: 'all-spaces', label: 'Space: All Spaces' },
  { value: 'green-energy', label: 'Green Energy Space' },
  { value: 'community-garden', label: 'Community Garden' },
];

export const ROLE_FILTER_OPTIONS = [
  { value: 'all-roles', label: 'My role: All roles' },
  { value: 'lead', label: 'Lead' },
  { value: 'member', label: 'Member' },
];

import type {
  ForumDiscussionDetailData,
  ForumDiscussionListItemData,
} from '@/crd/components/forum/forumTypes';

/**
 * Forum fixtures → the data types CRD's forum components export.
 *
 * Two things need translating:
 *
 *  - **The icon.** CRD takes an `iconNode`, not a string, so the discussion's
 *    emoji is wrapped rather than passed raw. That is what lets production use
 *    a real icon component where the prototype uses an emoji.
 *  - **The sort key.** CRD sorts on a numeric `timestamp`; the fixtures only
 *    carry a display date (`Tue, 24/06/2025`). Parsed here, so newest/oldest
 *    sort by actual date — the prototype sorted by id string, which only
 *    happened to look right while ids were sequential.
 */

export type MockDiscussion = {
  id: string;
  title: string;
  emoji: string;
  author: { name: string; avatarUrl: string };
  date: string;
  commentCount: number;
  category: string;
  content?: string;
};

/** `Tue, 24/06/2025` → epoch ms. Returns 0 when the shape is unexpected. */
function parseDisplayDate(date: string): number {
  const match = date.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!match) return 0;
  const [, day, month, year] = match;
  return Date.UTC(Number(year), Number(month) - 1, Number(day));
}

const emojiNode = (emoji: string) => (
  <span aria-hidden="true" className="text-[20px] leading-none">
    {emoji}
  </span>
);

export function toDiscussionListItem(
  discussion: MockDiscussion,
  commentsLabel: string
): ForumDiscussionListItemData {
  return {
    id: discussion.id,
    title: discussion.title,
    iconNode: emojiNode(discussion.emoji),
    author: {
      id: discussion.author.name,
      displayName: discussion.author.name,
      avatarUrl: discussion.author.avatarUrl,
    },
    formattedDate: discussion.date,
    timestamp: parseDisplayDate(discussion.date),
    commentCount: discussion.commentCount,
    href: `/forum/${discussion.id}`,
    ariaLabel: `${discussion.title} by ${discussion.author.name}, ${discussion.date}, ${commentsLabel}`,
  };
}

export function toDiscussionDetail(
  discussion: MockDiscussion,
  contentNode: React.ReactNode
): ForumDiscussionDetailData {
  return {
    id: discussion.id,
    iconNode: emojiNode(discussion.emoji),
    title: discussion.title,
    categorySlug: discussion.category,
    shareUrl: `${window.location.origin}/forum/${discussion.id}`,
    body: { contentNode },
    author: {
      id: discussion.author.name,
      displayName: discussion.author.name,
      avatarUrl: discussion.author.avatarUrl,
      avatarColor: '#1d384a',
    },
    formattedDate: discussion.date,
  };
}

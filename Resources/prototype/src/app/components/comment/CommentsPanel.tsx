/**
 * Comments — production's `@/crd/components/comment/*`.
 *
 * CRD ships the whole system: `CommentThread` (count header, newest-first
 * top-level comments, oldest-first replies, per-comment reply input positioned
 * where the reply will land), `CommentItem`, `CommentInput` (with @-mention
 * support) and `CommentReactions`. Every comment surface in the prototype was
 * hand-rolled markup passed into a `commentsSlot`; this replaces all of them.
 *
 * This file is only the prototype's in-memory store: seeded demo threads keyed
 * by a thread id, plus the add / reply / delete / react handlers CRD calls.
 * A real client wires those to the server (`useCrdRoomComments`).
 */
import { useMemo, useState } from 'react';
import { CommentInput } from '@/crd/components/comment/CommentInput';
import { CommentThread } from '@/crd/components/comment/CommentThread';
import type { CommentAuthor, CommentData } from '@/crd/components/comment/types';

const CURRENT_USER: CommentAuthor = {
  id: 'me',
  name: 'Alex Rivera',
  avatarUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80',
};

const AVATARS: Record<string, string> = {
  'Sarah Jenkins':
    'https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=128',
  'Mirko de Boer':
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80',
  'Simone Rietmeijer':
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80',
  'Galin Berytin':
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80',
  'Denise Larssen':
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80',
};

const author = (name: string): CommentAuthor => ({
  id: name.toLowerCase().replace(/ /g, '-'),
  name,
  avatarUrl: AVATARS[name],
  profileUrl: `/user/${name.toLowerCase().replace(/ /g, '-')}`,
});

type Seed = {
  name: string;
  content: string;
  minutesAgo: number;
  parent?: number;
  reactions?: { emoji: string; count: number; hasReacted?: boolean }[];
};

/** A small, deterministic demo thread. Two of the seeds are replies. */
const SEEDS: Seed[] = [
  {
    name: 'Sarah Jenkins',
    content:
      'Great initiative! I think we should also consider the implications on local traffic patterns.',
    minutesAgo: 2880,
    reactions: [{ emoji: '👍', count: 2 }],
  },
  {
    name: 'Mirko de Boer',
    content: 'Agreed — do we have the modelling data from last quarter to compare against?',
    minutesAgo: 2820,
    parent: 0,
  },
  {
    name: 'Simone Rietmeijer',
    content: "Yes, I'll dig it out and post it here this afternoon.",
    minutesAgo: 2760,
    parent: 0,
  },
  {
    name: 'Denise Larssen',
    content: 'This lines up nicely with what the mobility group is working on.',
    minutesAgo: 1440,
  },
];

/** How many comments a seeded demo thread contains — so a card's footer count
 *  agrees with what opens inside it. */
export const SEEDED_COMMENT_COUNT = SEEDS.length;

const relative = (minutes: number) => {
  if (minutes < 60) return `${minutes} minutes ago`;
  if (minutes < 1440) return `${Math.round(minutes / 60)} hours ago`;
  const days = Math.round(minutes / 1440);
  return days === 1 ? 'Yesterday' : `${days} days ago`;
};

function seedThread(threadId: string): CommentData[] {
  const now = Date.now();
  return SEEDS.map((seed, index) => ({
    id: `${threadId}-c${index}`,
    author: author(seed.name),
    content: seed.content,
    timestamp: relative(seed.minutesAgo),
    timestampMs: now - seed.minutesAgo * 60_000,
    parentId: seed.parent !== undefined ? `${threadId}-c${seed.parent}` : undefined,
    reactions: (seed.reactions ?? []).map(r => ({
      emoji: r.emoji,
      count: r.count,
      hasReacted: r.hasReacted ?? false,
    })),
    canDelete: false,
  }));
}

export function CommentsPanel({
  threadId,
  canComment = true,
}: {
  /** Stable identity, so the same post keeps the same demo thread between renders. */
  threadId: string;
  canComment?: boolean;
}) {
  const [comments, setComments] = useState<CommentData[]>(() => seedThread(threadId));

  const add = (content: string, parentId?: string) => {
    if (!content.trim()) return;
    const now = Date.now();
    setComments(prev => [
      ...prev,
      {
        id: `${threadId}-local-${now}`,
        author: CURRENT_USER,
        content,
        timestamp: 'Just now',
        timestampMs: now,
        parentId,
        reactions: [],
        // Only your own comments can be deleted.
        canDelete: true,
      },
    ]);
  };

  const react = (commentId: string, emoji: string, adding: boolean) =>
    setComments(prev =>
      prev.map(comment => {
        if (comment.id !== commentId) return comment;
        const existing = comment.reactions.find(r => r.emoji === emoji);
        if (adding) {
          return {
            ...comment,
            reactions: existing
              ? comment.reactions.map(r =>
                  r.emoji === emoji ? { ...r, count: r.count + 1, hasReacted: true } : r
                )
              : [...comment.reactions, { emoji, count: 1, hasReacted: true }],
          };
        }
        return {
          ...comment,
          reactions: comment.reactions
            .map(r => (r.emoji === emoji ? { ...r, count: r.count - 1, hasReacted: false } : r))
            .filter(r => r.count > 0),
        };
      })
    );

  const container = useMemo(
    () => ({
      comments,
      currentUser: CURRENT_USER,
      canComment,
      onReply: (parentId: string, content: string) => add(content, parentId),
      onDelete: (commentId: string) =>
        setComments(prev => prev.filter(comment => comment.id !== commentId)),
      onAddReaction: (commentId: string, emoji: string) => react(commentId, emoji, true),
      onRemoveReaction: (commentId: string, emoji: string) => react(commentId, emoji, false),
    }),
    [comments, canComment]
  );

  return (
    <div className="space-y-4">
      {canComment && <CommentInput currentUser={CURRENT_USER} onSubmit={content => add(content)} />}
      <CommentThread {...container} />
    </div>
  );
}

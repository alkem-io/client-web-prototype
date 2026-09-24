/**
 * ReactionBar — thin adapter over production's reactions module.
 *
 * Production shipped emoji reactions after this prototype explored them
 * (`@/crd/components/reactions/*`), so the rendering is now entirely CRD's:
 * `CalloutReactionsBar` composes the total pill, the restricted picker and the
 * who-reacted popover. This file only maps the prototype's in-memory mock store
 * onto CRD's props so existing call sites keep their simple `{ id }` signature.
 *
 * One behavioural change comes with adopting production's component: its picker
 * renders exactly the emoji the server allows and never loads the full
 * emoji-picker library. The prototype's fixed seven (`DEFAULT_REACTION_OPTIONS`)
 * are passed as that allowed list, which preserves the design intent — a curated,
 * warm-only set — while matching production's mechanism.
 */
import { useCallback, useMemo, useState } from 'react';
import {
  CalloutReactionsBar,
  type CalloutReactionsSummary,
} from '@/crd/components/reactions/CalloutReactionsBar';
import type { WhoReactedRow } from '@/crd/components/reactions/WhoReactedPopover';
import {
  DEFAULT_REACTION_OPTIONS,
  type PostReaction,
  seedDemoReactions,
  toggleReaction,
  VIEWER,
  viewerReactionOf,
} from '@/app/components/space/post-reactions-data';

type ReactionBarProps = {
  /** Stable identity of the thing being reacted to — seeds the demo data so the
   *  same contribution keeps the same reactions between renders. */
  id: string;
  options?: readonly string[];
  canReact?: boolean;
  className?: string;
  onChange?: (reactions: PostReaction[]) => void;
};

export function ReactionBar({
  id,
  options = DEFAULT_REACTION_OPTIONS,
  canReact = true,
  className,
  onChange,
}: ReactionBarProps) {
  const [reactions, setReactions] = useState<PostReaction[]>(() => seedDemoReactions(id, options));

  const summary = useMemo<CalloutReactionsSummary>(() => {
    const emojis: string[] = [];
    for (const r of reactions) if (!emojis.includes(r.emoji)) emojis.push(r.emoji);
    return {
      // one reaction per person, so distinct reactors === reaction count
      total: reactions.length,
      // keep the curated order rather than order-of-arrival
      emojis: options.filter(e => emojis.includes(e)),
      myReactionEmoji: viewerReactionOf(reactions, VIEWER),
      allowedEmojis: [...options],
    };
  }, [reactions, options]);

  const whoReactedRows = useMemo<WhoReactedRow[]>(
    () =>
      reactions.map((r, i) => ({
        id: `${id}-${i}`,
        emoji: r.emoji,
        // the prototype has no clock; the store carries humanised strings only
        updatedDate: new Date().toISOString(),
        user: { displayName: r.user.name, avatarUrl: r.user.avatarUrl },
      })),
    [reactions, id]
  );

  // `toggleReaction` is a toggle: passing the emoji the viewer already has
  // removes it, which is how both add and remove are expressed below.
  const apply = useCallback(
    (emoji: string) => {
      setReactions(prev => {
        const next = toggleReaction(prev, emoji, VIEWER);
        onChange?.(next);
        return next;
      });
    },
    [onChange]
  );

  return (
    <div className={className}>
      <CalloutReactionsBar
        summary={summary}
        canReact={canReact}
        onAdd={apply}
        onRemove={() => {
          if (summary.myReactionEmoji) apply(summary.myReactionEmoji);
        }}
        whoReactedRows={whoReactedRows}
      />
    </div>
  );
}

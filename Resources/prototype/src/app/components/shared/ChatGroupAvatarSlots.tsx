/**
 * ChatGroupAvatarSlots — shows `FilledGroupAvatar` in production's chat list,
 * which draws its own avatars and has no slot for one. A temporary stand-in,
 * not a proposal: the proposal is `@/ahead/FilledGroupAvatar`, and the ask is
 * that production's `GroupAvatar` changes to that layout.
 *
 * HOW
 * Same approach as `ActivityDotSlots`: find each group row's avatar inside the
 * rendered list (the row is matched by the conversation's name) and draw
 * `FilledGroupAvatar` over production's 2 × 2 grid, at the same size. Nothing
 * in `src/crd/` is changed or copied. It looks again whenever the list changes,
 * so searching the list keeps it in place.
 *
 * WHEN IT GOES
 * When `GroupAvatar` has the new layout: delete this file and unwrap the list
 * in `MessagesOverlay`.
 */
import { type ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ChatMemberAvatar } from '@/crd/components/chat/types';
import { FilledGroupAvatar } from '@/ahead/FilledGroupAvatar';

type ChatGroupAvatarSlotsProps = {
  /** Group conversations without their own picture, by the name the list shows. */
  groups: { name: string; members: ChatMemberAvatar[] }[];
  children: ReactNode;
};

/** Production's `GroupAvatar` grid, inside a list row. */
const GRID_SELECTOR = 'div.grid.grid-cols-2.grid-rows-2.rounded-full';

type Found = { name: string; element: Element }[];

const sameFound = (a: Found, b: Found) =>
  a.length === b.length && a.every((f, i) => f.name === b[i].name && f.element === b[i].element);

export function ChatGroupAvatarSlots({ groups, children }: ChatGroupAvatarSlotsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [found, setFound] = useState<Found>([]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;
    const scan = () => {
      frame = 0;
      const next: Found = [];
      for (const row of root.querySelectorAll('li > button')) {
        const grid = row.querySelector(GRID_SELECTOR);
        const name = row.querySelector('.truncate')?.textContent?.trim();
        if (grid && name) next.push({ name, element: grid });
      }
      setFound(prev => (sameFound(prev, next) ? prev : next));
    };
    scan();
    const observer = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(scan);
    });
    observer.observe(root, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={rootRef} className="contents">
      {children}
      {found.map(({ name, element }) => {
        const group = groups.find(g => g.name === name);
        if (!group) return null;
        element.classList.add('relative');
        return createPortal(
          <FilledGroupAvatar members={group.members} size="sm" className="absolute inset-0 z-10 size-full" />,
          element,
          name
        );
      })}
    </div>
  );
}

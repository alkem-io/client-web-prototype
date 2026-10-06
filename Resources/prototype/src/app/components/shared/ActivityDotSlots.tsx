/**
 * ActivityDotSlots — puts `ActivityDot` back on production components that
 * have no place for it. A temporary stand-in, not a proposal: the proposal is
 * `@/ahead/ActivityDot` and the slots its header asks production for.
 *
 * WHAT IT DOES
 * The new-activity pulse (spec 014, `ActivityDot`) beside the things that
 * changed since your last visit: a space under My Spaces, a Recent Spaces card,
 * a tab inside a space, a space or subspace card, a post. The prototype had all
 * of these until the switch to production's components (2026-09-24 onward,
 * PHASE-2.md §1), because production draws the name itself and leaves nothing
 * next to it.
 *
 * HOW
 * Wrap a production component and name the spots: for each one, how to find
 * the element inside the rendered component, and the pulse's label. The pulse
 * is rendered into that element, after the name, exactly where a slot would
 * put it. Nothing in `src/crd/` is changed or copied. It re-finds the spots
 * whenever the component re-renders, so it survives tab switches and the like.
 *
 * Names that are cut off with "…" would cut the pulse off too. For those, a
 * slot can `prepare` the name element (a few layout classes, added once) so
 * the name still cuts off but leaves room for the pulse right after it. See
 * `cardNameSlot`.
 *
 * WHEN IT GOES
 * When production adds the `nameSuffix` slots listed in `ActivityDot`'s header
 * (`ExpandedSpaceCard` has a `nameSlot`, but only internally), pass
 * `<ActivityDot />` into them, delete this file, and drop the wrappers: search
 * for `ActivityDotSlots` in `src/app`. It lives outside `src/ahead/` because
 * that folder is the developers' agenda, and this is not something for them
 * to take over.
 */
import { type ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ActivityDot } from '@/ahead/ActivityDot';

export type ActivityDotSlot = {
  /** Stable key for this spot. */
  key: string;
  /** Finds the element(s) inside the wrapped component to put the pulse in. */
  find: (root: HTMLElement) => Element[];
  /** What a screen reader hears, e.g. "Green Energy Space has new activity". */
  label: string;
  /** Classes for the pulse; a function when it depends on the element found. */
  className?: string | ((element: Element) => string);
  /** Adjusts the found element's layout so the pulse fits; must be safe to repeat. */
  prepare?: (element: Element) => void;
};

type Found = Record<string, Element[]>;

const sameFound = (a: Found, b: Found) => {
  const keys = Object.keys(b);
  if (keys.length !== Object.keys(a).length) return false;
  return keys.every(k => a[k]?.length === b[k].length && b[k].every((el, i) => a[k][i] === el));
};

/**
 * The name on production's `SpaceCard` and `ExpandedSpaceCard`. Both draw it as
 * an `h3.text-card-title` that cuts off with "…", in two shapes:
 *
 *  - `SpaceCard`: the name is text in the h3, and the whole card is a link.
 *    The h3 shrinks to the name's width (never wider than the card) with room
 *    on the right, and the pulse sits in that room.
 *  - `ExpandedSpaceCard`: the h3 holds a link whose invisible overlay makes the
 *    whole card clickable. That overlay needs the h3 to stay unpositioned, so
 *    the h3 becomes a row instead: the link (allowed to shrink and cut off),
 *    then the pulse.
 *
 * Pass the card's `href` when the wrapper holds a whole list of cards; it picks
 * out the one card.
 */
export const cardNameSlot = (key: string, name: string, href?: string): ActivityDotSlot => ({
  key,
  find: root => [
    ...root.querySelectorAll(
      href ? `a[href="${href}"] h3.text-card-title, h3.text-card-title:has(a[href="${href}"])` : 'h3.text-card-title'
    ),
  ],
  label: `${name} has new activity`,
  prepare: element => {
    const link = element.querySelector(':scope > a');
    if (link) {
      element.classList.add('flex', 'items-center', 'gap-2');
      link.classList.add('min-w-0');
    } else {
      element.classList.add('relative', 'w-fit', 'max-w-full', 'pr-4');
    }
  },
  className: element =>
    element.querySelector(':scope > a') ? 'shrink-0' : 'absolute right-0 top-1/2 -translate-y-1/2',
});

type ActivityDotSlotsProps = {
  slots: ActivityDotSlot[];
  children: ReactNode;
  /** For "seen on hover": the pointer entering / leaving the wrapped component. */
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
};

export function ActivityDotSlots({ slots, children, onPointerEnter, onPointerLeave }: ActivityDotSlotsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [found, setFound] = useState<Found>({});
  const slotsRef = useRef(slots);
  slotsRef.current = slots;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;
    const scan = () => {
      frame = 0;
      const next: Found = {};
      for (const slot of slotsRef.current) {
        const elements = slot.find(root);
        if (elements.length > 0) next[slot.key] = elements;
      }
      setFound(prev => (sameFound(prev, next) ? prev : next));
    };
    scan();
    // The wrapped component may replace the elements (a tab becomes active, a
    // list re-renders): look again after any change inside it.
    const observer = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(scan);
    });
    observer.observe(root, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Slots can change without the DOM changing (a space is visited, the pulse goes).
  const slotKeys = slots.map(s => s.key).join('|');
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const next: Found = {};
    for (const slot of slots) {
      const elements = slot.find(root);
      if (elements.length > 0) next[slot.key] = elements;
    }
    setFound(prev => (sameFound(prev, next) ? prev : next));
    // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on the slot list
  }, [slotKeys]);

  return (
    <div ref={rootRef} className="contents" onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
      {children}
      {slots.flatMap(slot =>
        (found[slot.key] ?? []).map((element, i) => {
          slot.prepare?.(element);
          const className = typeof slot.className === 'function' ? slot.className(element) : slot.className;
          return createPortal(
            <ActivityDot className={className} label={slot.label} />,
            element,
            `${slot.key}:${i}`
          );
        })
      )}
    </div>
  );
}

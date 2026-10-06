/**
 * ActivityDotSlots — puts `ActivityDot` back on production components that
 * have no place for it.
 *
 * WHAT PRODUCTION WOULD GAIN
 * The new-activity pulse (spec 014, `ActivityDot`) beside the things that
 * changed since your last visit: a space under My Spaces, a space card under
 * Recent Spaces, a tab inside a space. The prototype had all three until the
 * switch to production's components on 2026-09-24 (PHASE-2.md §1), because
 * production draws the name itself and leaves nothing next to it.
 *
 * HOW
 * Wrap a production component and name the spots: for each one, how to find
 * the element inside the rendered component, and the pulse's label. The pulse
 * is rendered into that element, after the name, exactly where a slot would
 * put it. Nothing in `src/crd/` is changed or copied. It re-finds the spots
 * whenever the component re-renders, so it survives tab switches and the like.
 *
 * WHY IT IS HERE AND NOT IN CRD
 * This is a stand-in for one small upstream ask: an optional `nameSuffix`
 * (a slot for anything after the name) on `SidebarResourceItem`,
 * `CompactSpaceCard` and `SpaceNavigationTabs`' `TabItem`. When those land,
 * pass `<ActivityDot />` into them, delete this file, and drop the wrappers in
 * `app/components/dashboard/DashboardSidebar`, `dashboard/RecentSpaces` and
 * `space/SpaceNavigationTabs`.
 */
import { type ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ActivityDot } from './ActivityDot';

export type ActivityDotSlot = {
  /** Stable key for this spot. */
  key: string;
  /** Finds the element(s) inside the wrapped component to put the pulse in. */
  find: (root: HTMLElement) => Element[];
  /** What a screen reader hears, e.g. "Green Energy Space has new activity". */
  label: string;
  className?: string;
};

type Found = Record<string, Element[]>;

const sameFound = (a: Found, b: Found) => {
  const keys = Object.keys(b);
  if (keys.length !== Object.keys(a).length) return false;
  return keys.every(k => a[k]?.length === b[k].length && b[k].every((el, i) => a[k][i] === el));
};

export function ActivityDotSlots({ slots, children }: { slots: ActivityDotSlot[]; children: ReactNode }) {
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
    <div ref={rootRef} className="contents">
      {children}
      {slots.flatMap(slot =>
        (found[slot.key] ?? []).map((element, i) =>
          createPortal(
            <ActivityDot className={slot.className} label={slot.label} />,
            element,
            `${slot.key}:${i}`
          )
        )
      )}
    </div>
  );
}

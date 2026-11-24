/**
 * WhoCanReadStandIns — put `@/ahead/WhoCanRead` into production's space header,
 * subspace header and subspace list, which have no slot for it. Temporary, not
 * a proposal: the proposal is the ahead component and the slots its comment
 * asks production for.
 *
 * HOW
 * Each wraps production's component, finds the spot in what it rendered, and
 * draws the icon there with a portal. Nothing in `src/crd/` is changed.
 *  - Header: the box holding the title. On a space that box is a row, so the
 *    badge simply joins it. On a subspace it stacks title over tagline, so it
 *    becomes a two-column grid with the badge beside the title.
 *  - List: the box at the end of each row, matched by the row's link. Wrapped
 *    lists must not pass `isPrivate`, so production draws no lock of its own.
 *
 * WHEN IT GOES
 * When production has the slots: pass the pieces directly and delete this file.
 */
import { type ReactNode, type RefObject, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { type Audience, WhoCanReadListIcon } from '@/ahead/WhoCanRead';

/** Runs `scan` now and whenever the wrapped component changes what it rendered. */
function useRescan(rootRef: RefObject<HTMLElement | null>, scan: (root: HTMLElement) => void) {
  const scanRef = useRef(scan);
  scanRef.current = scan;
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;
    const run = () => {
      frame = 0;
      scanRef.current(root);
    };
    run();
    const observer = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(run);
    });
    observer.observe(root, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [rootRef]);
}

export function HeaderBadgeStandIn({ badge, children }: { badge?: ReactNode; children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<HTMLElement | null>(null);

  useRescan(rootRef, root => {
    const title = root.querySelector<HTMLElement>('h1');
    const found = title?.parentElement ?? null;
    if (title && found?.classList.contains('flex-col')) {
      Object.assign(found.style, {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, max-content) minmax(0, 1fr)',
        columnGap: '8px',
        alignItems: 'center',
      });
      const tagline = title.nextElementSibling as HTMLElement | null;
      if (tagline && !tagline.dataset.standIn) tagline.style.gridColumn = '1 / -1';
    }
    setBox(prev => (prev === found ? prev : found));
  });

  return (
    <div ref={rootRef} className="contents">
      {children}
      {badge &&
        box &&
        createPortal(
          <span
            data-stand-in="who-can-read"
            className="flex shrink-0"
            style={box.classList.contains('flex-col') ? { gridColumn: 2, gridRow: 1, minWidth: 24 } : undefined}
          >
            {badge}
          </span>,
          box
        )}
    </div>
  );
}

export function SubspaceListIconsStandIn({
  audiences,
  children,
}: {
  /** Row link → who can read that subspace. Leave out for non-members. */
  audiences?: Record<string, Audience>;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<Array<{ href: string; box: HTMLElement }>>([]);

  useRescan(rootRef, root => {
    const found = Object.keys(audiences ?? {}).flatMap(href => {
      const box = root.querySelector<HTMLElement>(`li > a[href="${CSS.escape(href)}"] > div:last-child`);
      return box ? [{ href, box }] : [];
    });
    setRows(prev =>
      prev.length === found.length && prev.every((row, i) => row.box === found[i].box) ? prev : found
    );
  });

  return (
    <div ref={rootRef} className="contents">
      {children}
      {audiences &&
        rows.map(
          ({ href, box }) =>
            audiences[href] &&
            createPortal(
              // First in the box, so it sits before production's chevron.
              <span style={{ order: -1 }} className="flex">
                <WhoCanReadListIcon audience={audiences[href]} />
              </span>,
              box,
              href
            )
        )}
    </div>
  );
}

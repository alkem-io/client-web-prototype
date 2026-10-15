/**
 * TitleFirstHeaderStandIn — draws `@/ahead/TitleFirstPostHeader` on
 * production's `PostCard`, which has no slot for it. A temporary stand-in, not
 * a proposal: the proposal is the ahead component and the header option its
 * comment asks production for.
 *
 * HOW
 * The wrapped card must be rendered with `showPublishDetails: false`, so CRD
 * puts the title in the header (in a `min-w-0 flex-1` box beside the action
 * buttons). That box is turned into a two-column grid, and the avatar and the
 * byline are rendered into it with portals: avatar left across both rows,
 * CRD's title top right, byline below it. CRD's own draft badge in that box
 * is hidden, because the byline shows it. Nothing in `src/crd/` is changed.
 *
 * WHEN IT GOES
 * When `PostCard` gets a header layout option: pass it from
 * `app/components/space/PostCard`, delete this file, and drop the wrapper.
 * It lives outside `src/ahead/` because it is not something for the
 * developers to take over.
 */
import { type ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { PostHeaderAvatar, PostHeaderByline } from '@/ahead/TitleFirstPostHeader';

type Author = { name: string; avatarUrl?: string; profileUrl?: string; role?: string };

const findTitleBox = (root: HTMLElement) =>
  root.querySelector<HTMLElement>('[data-slot="card-header"] > div.min-w-0.flex-1');

function prepare(box: HTMLElement) {
  Object.assign(box.style, {
    display: 'grid',
    gridTemplateColumns: 'auto minmax(0, 1fr)',
    columnGap: '12px',
    rowGap: '2px',
    alignItems: 'center',
  });
  for (const child of Array.from(box.children) as HTMLElement[]) {
    if (child.dataset.standIn) continue;
    if (child.tagName === 'H3') Object.assign(child.style, { gridColumn: '2', gridRow: '1' });
    else child.style.display = 'none'; // CRD's draft badge; the byline shows it
  }
}

export function TitleFirstHeaderStandIn({
  enabled,
  author,
  timestamp,
  isDraft,
  children,
}: {
  enabled: boolean;
  author?: Author;
  timestamp?: string;
  isDraft?: boolean;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;
    let frame = 0;
    const scan = () => {
      frame = 0;
      const found = findTitleBox(root);
      if (found) prepare(found);
      setBox((prev) => (prev === found ? prev : found));
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
  }, [enabled]);

  return (
    <div ref={rootRef} className="contents">
      {children}
      {enabled &&
        author &&
        box &&
        createPortal(
          <>
            <div data-stand-in="avatar" style={{ gridColumn: '1', gridRow: '1 / span 2' }}>
              <PostHeaderAvatar author={author} />
            </div>
            <div data-stand-in="byline" style={{ gridColumn: '2', gridRow: '2' }} className="min-w-0">
              <PostHeaderByline author={author} timestamp={timestamp} isDraft={isDraft} />
            </div>
          </>,
          box
        )}
    </div>
  );
}

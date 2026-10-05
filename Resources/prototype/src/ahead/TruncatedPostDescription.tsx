/**
 * TruncatedPostDescription — a post's description, collapsed with a hard cut.
 *
 * WHAT PRODUCTION WOULD GAIN
 * Production's `ExpandableMarkdown` collapses a post by clipping everything —
 * text and images alike — to a ~3-line band, then laying a fade gradient and a
 * "… READ MORE" chip over the bottom. On a post with an image that leaves a
 * smeared strip of photo under a gradient, and an image-only post collapses to
 * a sliver. This replaces that with the "post truncation" design:
 *
 *   · Text is cut cleanly at 3 lines. No gradient, mask or overlay — ever.
 *   · An image before the text (hero) stays visible, cropped to 160px.
 *   · Images after or between the text are hidden until "Read more".
 *   · An image-only post is treated like a hero: cropped to 160px with
 *     "Read more", so the image stays visible without taking over the feed.
 *   · No toggle at all unless the content really exceeds 3 lines
 *     ("exceeds", not "meets") — a 3-line post shows as-is.
 *   · "Read more" / "Show less" is a plain primary-colour link on its own line
 *     below the content, expanding inline.
 *   · Collapse off (`collapsible={false}`) shows everything, with no toggle.
 *
 * WHY IT IS HERE AND NOT IN THE CARD
 * CRD's `PostCard` renders `post.snippet` itself and offers no slot for the
 * description, so the prototype's `PostCard` wrapper withholds the snippet and
 * renders this in its place. The upstream ask: a `descriptionSlot` on
 * `PostCard`, or this behaviour inside `ExpandableMarkdown`.
 */
import { useLayoutEffect, useRef, useState } from 'react';
import { MarkdownContent } from '@/crd/components/common/MarkdownContent';
import { cn } from '@/crd/lib/utils';

type EmbeddedImage = { url: string; alt?: string; position?: 'before' | 'after' };

type TruncatedPostDescriptionProps = {
  /** Markdown body. Images written as `![alt](url)` on their own line count as images. */
  content?: string;
  /** Images attached outside the markdown, placed before or after the text. */
  embeddedImages?: EmbeddedImage[];
  /** The space's "collapse posts" setting. `false` shows the whole post, no toggle. */
  collapsible?: boolean;
  /** Lines of text shown while collapsed. */
  maxLines?: number;
  className?: string;
};

const IMAGE_LINE = /^\s*!\[([^\]]*)\]\(([^)\s]+)[^)]*\)\s*$/;
const HERO_MAX_HEIGHT = 160;

/**
 * Splits the markdown into the hero images that open it, the text, and every
 * other image — the three things the collapsed state treats differently.
 */
function splitContent(content: string, embedded: EmbeddedImage[]) {
  const hero: EmbeddedImage[] = embedded.filter(img => img.position === 'before');
  const trailing: EmbeddedImage[] = [];
  const textLines: string[] = [];
  let seenText = false;

  for (const line of content.split('\n')) {
    const image = line.match(IMAGE_LINE);
    if (image) {
      (seenText ? trailing : hero).push({ alt: image[1], url: image[2] });
    } else {
      if (line.trim()) seenText = true;
      textLines.push(line);
    }
  }
  trailing.push(...embedded.filter(img => img.position !== 'before'));
  const text = textLines.join('\n').trim();

  // No text: every image is the hero, so collapsing crops rather than hides it.
  if (!text) return { hero: [...hero, ...trailing], text, trailing: [] };
  return { hero, text, trailing };
}

// Before the first measurement: production's snippet line box, `text-body`
// (0.875rem) at `leading-relaxed` (1.625).
const fallbackHeight = (maxLines: number) => `calc(${maxLines} * 1.625 * 0.875rem)`;

/**
 * The rendered lines of text inside `el`, top to bottom. Counting real line
 * boxes — not multiples of a line height — is what lets the cut land exactly
 * under a line: paragraph gaps and headings would otherwise put it mid-line.
 */
function measureLines(el: HTMLElement) {
  const origin = el.getBoundingClientRect().top;
  const lines: { top: number; bottom: number }[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim()) continue;
    range.selectNodeContents(node);
    for (const rect of range.getClientRects()) {
      const top = rect.top - origin;
      const bottom = rect.bottom - origin;
      // Fragments on the same line (bold, links) share a top; merge them.
      const line = lines.find(l => Math.abs(l.top - top) < rect.height / 2);
      if (line) line.bottom = Math.max(line.bottom, bottom);
      else lines.push({ top, bottom });
    }
  }
  return lines.sort((a, b) => a.top - b.top);
}

export function TruncatedPostDescription({
  content = '',
  embeddedImages = [],
  collapsible = true,
  maxLines = 3,
  className,
}: TruncatedPostDescriptionProps) {
  const { hero, text, trailing } = splitContent(content, embeddedImages);
  const textRef = useRef<HTMLDivElement>(null);
  const [textOverflows, setTextOverflows] = useState(false);
  /** Height that ends exactly under line `maxLines`; null until measured. */
  const [cutAt, setCutAt] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Count the text's lines, re-measured as fonts load or the card resizes.
  // Strictly more than `maxLines` collapses — exactly `maxLines` does not.
  // The split view (where the ref lives) only mounts while collapsible and not
  // expanded, so re-run when either flips; a null ref keeps the last measurement.
  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const evaluate = () => {
      const lines = measureLines(el);
      setTextOverflows(lines.length > maxLines);
      setCutAt(lines.length > maxLines ? Math.ceil(lines[maxLines - 1].bottom) : null);
    };
    evaluate();
    const observer = new ResizeObserver(evaluate);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text, maxLines, collapsible, expanded]);

  // Any image counts as overflow: a hero (including an image-only post) needs its
  // crop, a later image needs hiding.
  const canCollapse = collapsible && (textOverflows || hero.length > 0 || trailing.length > 0);
  const collapsed = canCollapse && !expanded;
  // A hero can make a post collapsible on its own; its text is only cut if it is long.
  const cutText = collapsed && textOverflows;

  const renderImage = (img: EmbeddedImage, key: string, cropped: boolean) => (
    <img
      key={key}
      src={img.url}
      alt={img.alt ?? ''}
      className="block w-full rounded-lg object-cover"
      style={cropped ? { maxHeight: HERO_MAX_HEIGHT } : undefined}
    />
  );

  const showAsAuthored = !collapsible || expanded;

  return (
    <div className={cn('space-y-3', className)}>
      {showAsAuthored ? (
        // Expanded: the post exactly as written, images where the author put them.
        <>
          {embeddedImages.filter(img => img.position === 'before').map((img, i) => renderImage(img, `before-${i}`, false))}
          {content.trim() && (
            <MarkdownContent content={content} className="text-muted-foreground [&_img]:w-full" />
          )}
          {embeddedImages.filter(img => img.position !== 'before').map((img, i) => renderImage(img, `after-${i}`, false))}
        </>
      ) : (
        // Collapsible view: hero cropped, text cut cleanly, later images withheld.
        <>
          {hero.map((img, i) => renderImage(img, `hero-${i}`, collapsed))}
          {text && (
            <div
              className={cn(cutText && 'overflow-hidden')}
              style={cutText ? { maxHeight: cutAt ?? fallbackHeight(maxLines) } : undefined}
            >
              {/* Measured inside the clip so the height is the text's own, not the clamp's. */}
              <div ref={textRef} className="flow-root">
                <MarkdownContent content={text} className="text-muted-foreground" />
              </div>
            </div>
          )}
          {!collapsed && trailing.map((img, i) => renderImage(img, `trailing-${i}`, false))}
        </>
      )}

      {canCollapse && (
        <button
          type="button"
          aria-expanded={!collapsed}
          onClick={event => {
            event.stopPropagation();
            setExpanded(!expanded);
          }}
          className="block cursor-pointer rounded text-body-emphasis text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {collapsed ? 'Read more' : 'Show less'}
        </button>
      )}
    </div>
  );
}

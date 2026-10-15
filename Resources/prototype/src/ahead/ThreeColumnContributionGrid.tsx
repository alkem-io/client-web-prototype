/**
 * ThreeColumnContributionGrid — a callout's contributions, three across on wide
 * screens.
 *
 * WHAT PRODUCTION WOULD GAIN
 * Production's `ContributionGrid` is fixed at two columns, so on a desktop a
 * post's contributions (whiteboards, posts, form responses) sit as two wide
 * cards with a lot of empty space, and the collapsed state shows only four.
 * Three columns from the `lg` breakpoint up shows six while collapsed, and the
 * cards keep a size closer to the thumbnails they are.
 *
 *   · One column on phones, two on tablets, three from `lg` up.
 *   · The collapse threshold counts three per row, so "collapsed to 2 rows"
 *     still means two full rows.
 *   · Collapsed, it shows the first row in full plus a clean cut through the
 *     middle of the second, so it is obvious there is more. Production clips
 *     at a fixed 220px, which on wide screens leaves a thin strip of the
 *     second row (or cuts the first) and reads as a rendering mistake. The
 *     peek is measured from the first row, so it holds for any card height.
 *   · The button says how many are hidden ("+4 more", production's own
 *     `callout.moreContributions` string), not the total. `extraSlots` keeps
 *     the add card out of that count.
 *
 * WHY IT IS HERE AND NOT IN CRD
 * The first version of this changed `src/crd/…/ContributionGrid.tsx` directly,
 * which the next sync would have silently undone. The upstream ask is small:
 * a `columns` prop (2 | 3) on `ContributionGrid`, with
 * `ContributionsPreviewSkeleton` following the same column count so the
 * loading state matches. When that lands, delete this file and pass
 * `columns={3}` from `app/components/contribution/ContributionGrid`.
 */
import { ChevronDown, ChevronUp } from 'lucide-react';
import { type ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/crd/lib/utils';
import { Button } from '@/crd/primitives/button';

type ThreeColumnContributionGridProps = {
  children: ReactNode;
  totalCount: number;
  collapsedRows?: number;
  /** Children that are not contributions (the add card), left out of "+N more". */
  extraSlots?: number;
  className?: string;
};

const ITEMS_PER_ROW = 3;

export function ThreeColumnContributionGrid({
  children,
  totalCount,
  collapsedRows = 2,
  extraSlots = 0,
  className,
}: ThreeColumnContributionGridProps) {
  const { t } = useTranslation('crd-space');
  const [expanded, setExpanded] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  // First row in full + half of the second, and how many cards that first row holds.
  const [peek, setPeek] = useState<{ height: number; firstRow: number } | null>(null);

  const shouldCollapse = totalCount > collapsedRows * ITEMS_PER_ROW;
  const collapsed = shouldCollapse && !expanded;

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || !collapsed) return;
    const measure = () => {
      const cards = Array.from(grid.children) as HTMLElement[];
      if (cards.length === 0) return;
      const top = cards[0].offsetTop;
      const firstRow = cards.filter((c) => c.offsetTop === top);
      const rowHeight = Math.max(...firstRow.map((c) => c.offsetHeight));
      const gap = Number.parseFloat(getComputedStyle(grid).rowGap) || 0;
      setPeek({ height: rowHeight + gap + rowHeight / 2, firstRow: firstRow.length });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, [collapsed]);

  const hiddenCount = Math.max(0, totalCount - extraSlots - (peek?.firstRow ?? ITEMS_PER_ROW));

  return (
    <div className={cn('space-y-3', className)}>
      <div
        ref={gridRef}
        className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4', collapsed && 'overflow-hidden')}
        style={collapsed ? { maxHeight: peek ? peek.height : 300 } : undefined}
      >
        {children}
      </div>

      {shouldCollapse && (
        <div className="flex justify-center">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setExpanded(!expanded)}>
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" aria-hidden="true" />
                {t('callout.collapse')}
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
                {t('callout.moreContributions', { count: hiddenCount })}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

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
 *   · Expand / collapse behaves exactly as production's does.
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
import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/crd/lib/utils';
import { Button } from '@/crd/primitives/button';

type ThreeColumnContributionGridProps = {
  children: ReactNode;
  totalCount: number;
  collapsedRows?: number;
  className?: string;
};

const ITEMS_PER_ROW = 3;

export function ThreeColumnContributionGrid({
  children,
  totalCount,
  collapsedRows = 2,
  className,
}: ThreeColumnContributionGridProps) {
  const { t } = useTranslation('crd-space');
  const [expanded, setExpanded] = useState(false);

  const shouldCollapse = totalCount > collapsedRows * ITEMS_PER_ROW;

  return (
    <div className={cn('space-y-3', className)}>
      <div
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
          !expanded && shouldCollapse && 'max-h-[220px] overflow-hidden'
        )}
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
                {t('callout.expand')} ({totalCount})
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

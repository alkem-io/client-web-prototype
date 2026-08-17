import { Children, type ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { PlaceholderCard } from '@/app/components/ui/placeholder-card';
import { Button } from '@/app/components/ui/button';

type ContributionGridProps = {
  children: ReactNode;
  totalCount: number;
  onAddClick?: () => void;
  addLabel?: string;
  /**
   * Optional second line on the add card — for contribution types where the
   * cost of contributing isn't obvious from the label alone (e.g. a form's
   * question count). `PlaceholderCard` has always supported this; the grid
   * simply never passed it through.
   */
  addDescription?: string;
  addCardClassName?: string;
  /**
   * Overrides the default inline expansion of "+N MORE". Leave unset so the
   * grid expands in place — that's the point of the control. A parent's
   * "View all" dialog is a *separate* affordance, not a replacement.
   */
  onShowMore?: () => void;
  className?: string;
};

export function ContributionGrid({
  children,
  totalCount,
  onAddClick,
  addLabel = "+ Add",
  addDescription,
  addCardClassName,
  onShowMore,
  className
}: ContributionGridProps) {
  const [expanded, setExpanded] = useState(false);

  const itemsPerRow = 2;
  const maxItemsInCollapsedGrid = 3; // Show 3 real items + 1 add card = 4 total
  const showAddCard = !!onAddClick;
  const hasOverflow = totalCount > maxItemsInCollapsedGrid;
  const overflowCount = totalCount - maxItemsInCollapsedGrid;

  // Convert children to array properly
  const childrenArray = Children.toArray(children);
  const visibleChildren = !expanded ? childrenArray.slice(0, maxItemsInCollapsedGrid) : childrenArray;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visibleChildren}
        {showAddCard && (
          <PlaceholderCard
            size="sm"
            label={addLabel}
            description={addDescription}
            onClick={onAddClick}
            className={addCardClassName}
          />
        )}
      </div>

      {hasOverflow && !expanded && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onShowMore || (() => setExpanded(true))}
        >
          + {overflowCount} MORE
        </Button>
      )}

      {expanded && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => setExpanded(false)}
        >
          Show less
        </Button>
      )}
    </div>
  );
}

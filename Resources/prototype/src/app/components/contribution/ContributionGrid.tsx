import { ChevronDown, ChevronUp } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/app/components/ui/button';

type ContributionGridProps = {
  children: ReactNode;
  totalCount: number;
  collapsedRows?: number;
  className?: string;
};

export function ContributionGrid({ children, totalCount, collapsedRows = 2, className }: ContributionGridProps) {
  const [expanded, setExpanded] = useState(false);

  const itemsPerRow = 2;
  const collapsedCount = collapsedRows * itemsPerRow;
  const shouldCollapse = totalCount > collapsedCount;

  return (
    <div className={cn('space-y-3', className)}>
      <div
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 gap-4',
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
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
                Expand ({totalCount})
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

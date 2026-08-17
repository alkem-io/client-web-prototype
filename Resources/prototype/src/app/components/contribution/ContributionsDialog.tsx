/**
 * ContributionsDialog — "View all responses" for every contribution type.
 *
 * The feed deliberately collapses contributions to three items so one busy
 * callout can't dominate the scroll. That's right for the feed and wrong when
 * you actually want to read them, so this is the escape hatch: the same cards,
 * uncollapsed, in a roomier grid with the callout's title for context.
 *
 * The `form` contribution type has its own dialog (`FormResponsesDialog`)
 * because a form's answers share a schema and are worth comparing column by
 * column. Everything else is free-form, so there is nothing to line up — more
 * room is the whole improvement.
 */
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';

type ContributionsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The callout these contributions belong to. */
  calloutTitle: string;
  /** Plural noun for what's being listed, e.g. "Posts", "Whiteboards". */
  typeLabel: string;
  /** Every contribution card — not the collapsed subset the feed shows. */
  children: ReactNode;
  count: number;
  /** `list` for full-width rows (links & files); `grid` for cards. */
  layout?: 'grid' | 'list';
  /** Adds the same create affordance the feed offers, when the viewer may contribute. */
  onAddClick?: () => void;
  addLabel?: string;
};

export function ContributionsDialog({
  open,
  onOpenChange,
  calloutTitle,
  typeLabel,
  children,
  count,
  layout = 'grid',
  onAddClick,
  addLabel,
}: ContributionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl lg:max-w-4xl max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b text-left">
          <DialogTitle className="text-section-title">{typeLabel}</DialogTitle>
          <DialogDescription className="text-caption text-muted-foreground mt-1">
            {calloutTitle}
          </DialogDescription>
          <div className="mt-3">
            <Badge variant="secondary" className="text-badge">
              {count} {count === 1 ? 'contribution' : 'contributions'}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {count === 0 ? (
            <div className="py-12 text-center">
              <p className="text-body text-muted-foreground">Nothing here yet.</p>
              <p className="text-caption text-muted-foreground mt-1">
                Contributions appear here as people add them.
              </p>
            </div>
          ) : (
            <div
              className={cn(
                layout === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                  : 'flex flex-col gap-2'
              )}
            >
              {children}
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/20 sm:justify-between">
          {onAddClick ? (
            <Button variant="outline" onClick={onAddClick}>
              {addLabel ?? '+ Add'}
            </Button>
          ) : (
            <span />
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

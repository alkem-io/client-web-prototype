/**
 * Contribution grid — production's `@/crd/components/contribution/ContributionGrid`
 * with the prototype's "add" placeholder composed in as its last child.
 *
 * CRD owns the grid and its collapse/expand behaviour. The add card is CRD's
 * `ContributionAddCard`, rendered as a child rather than built in — which is
 * how CRD expects composition to work, and means no call site had to change.
 *
 * PHASE 1 REMOVAL (PHASE-2.md §8): `addDescription`, the optional second line
 * on the add card (e.g. "3 questions" on a form). CRD's `ContributionAddCard`
 * is `{ label, icon, onClick, disabled }` with no description.
 */
import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { ContributionAddCard } from '@/crd/components/contribution/ContributionAddCard';
import { ContributionGrid as CrdContributionGrid } from '@/crd/components/contribution/ContributionGrid';

type ContributionGridProps = {
  children: ReactNode;
  totalCount: number;
  onAddClick?: () => void;
  addLabel?: string;
  /** Accepted for call-site compatibility; not rendered — see the note above. */
  addDescription?: string;
  addCardClassName?: string;
  /** Superseded by CRD's own collapse control. */
  onShowMore?: () => void;
  className?: string;
};

export function ContributionGrid({
  children,
  totalCount,
  onAddClick,
  addLabel = '+ Add',
  addCardClassName,
  className,
}: ContributionGridProps) {
  return (
    <CrdContributionGrid
      // The add card occupies a grid slot, so it counts toward the total CRD
      // uses to decide whether the grid needs collapsing.
      totalCount={onAddClick ? totalCount + 1 : totalCount}
      className={className}
    >
      {children}
      {onAddClick && (
        <ContributionAddCard
          label={addLabel}
          icon={Plus}
          onClick={onAddClick}
          className={addCardClassName}
        />
      )}
    </CrdContributionGrid>
  );
}

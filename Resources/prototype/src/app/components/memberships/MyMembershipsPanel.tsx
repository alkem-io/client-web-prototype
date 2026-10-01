/**
 * My Spaces panel — production's
 * `@/crd/components/dashboard/MyMemberships/MyMembershipsPanel`.
 *
 * The prototype had built the same panel independently (search, role filter,
 * visibility filter, expandable tree, skeleton and both empty states), so this
 * is rule 1: production wins on a shared component. Two things improve as a
 * result — CRD's tree is recursive rather than capped at space + subspace, and
 * it is a real Radix `Dialog` instead of a hand-rolled backdrop with
 * `role="dialog"`, so focus trapping, Escape and scroll lock come for free.
 *
 * What is left here is only wiring: the mock fixtures, the tree mapping (see
 * `app/mappers/memberships.ts`) and router navigation.
 */
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { MyMembershipsPanel as CrdMyMembershipsPanel } from '@/crd/components/dashboard/MyMemberships/MyMembershipsPanel';
import { MOCK_MEMBERSHIPS } from '@/app/components/memberships/membershipData';
import { toMembershipTree } from '@/app/mappers/memberships';

interface MyMembershipsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MyMembershipsPanel({ open, onOpenChange }: MyMembershipsPanelProps) {
  const navigate = useNavigate();

  // Stable identity matters: CRD's panel expands the whole tree in an effect keyed
  // on `items`, so a fresh array each render would re-expand on every keystroke.
  const items = useMemo(() => toMembershipTree(MOCK_MEMBERSHIPS), []);

  return (
    <CrdMyMembershipsPanel
      open={open}
      onClose={() => onOpenChange(false)}
      items={items}
      onNavigate={href => {
        navigate(href);
        onOpenChange(false);
      }}
      browseAllHref="/spaces"
    />
  );
}

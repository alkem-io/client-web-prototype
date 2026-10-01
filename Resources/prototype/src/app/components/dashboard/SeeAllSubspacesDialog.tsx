import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/crd/primitives/dialog";
import { MembershipItem } from "@/app/components/memberships/membershipData";
import { SpaceCard } from '@/crd/components/space/SpaceCard';
import { membershipToSpaceCard } from '@/app/mappers/spaceCard';

interface SeeAllSubspacesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spaceName: string;
  spaceSlug?: string;
  subspaces: MembershipItem[];
}

export function SeeAllSubspacesDialog({
  open,
  onOpenChange,
  spaceName,
  spaceSlug = "",
  subspaces
}: SeeAllSubspacesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Subspaces in {spaceName}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
          {subspaces.map((sub) => (
            <SpaceCard
              key={sub.id}
              space={membershipToSpaceCard(sub, spaceSlug)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

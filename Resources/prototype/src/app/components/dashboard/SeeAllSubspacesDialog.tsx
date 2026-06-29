import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { MembershipItem } from "@/app/components/memberships/membershipData";
import { SpaceCard, SpaceCardData } from "@/app/components/space/SpaceCard";

interface SeeAllSubspacesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spaceName: string;
  spaceSlug?: string;
  subspaces: MembershipItem[];
}

function toSpaceCardData(sub: MembershipItem, _parentSlug: string): SpaceCardData {
  return {
    id: sub.id,
    slug: sub.slug,
    name: sub.name,
    description: sub.tagline || "",
    bannerImage: sub.image,
    initials: sub.initials,
    avatarColor: sub.color,
    isPrivate: sub.isPrivate,
    tags: [],
    memberCount: Math.floor(Math.random() * 20) + 3,
    leads: [
      { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64", type: "person" },
      { name: "Mike Ross", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=64&h=64", type: "person" },
    ],
  };
}

export function SeeAllSubspacesDialog({
  open,
  onOpenChange,
  spaceName,
  spaceSlug = "",
  subspaces,
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
              space={toSpaceCardData(sub, spaceSlug)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

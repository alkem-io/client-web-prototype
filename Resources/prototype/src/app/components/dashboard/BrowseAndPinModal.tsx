import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { IconButton } from "@/app/components/ui/icon-button";
import { SpaceCard, SpaceCardData } from "@/app/components/space/SpaceCard";
import { MOCK_MEMBERSHIPS, MembershipItem } from "@/app/components/memberships/membershipData";
import { Pin } from "lucide-react";
import { useMemo } from "react";

interface BrowseAndPinModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pinnedIds: Set<string>;
  onPin: (spaceId: string) => void;
}

function toSpaceCardData(item: MembershipItem): SpaceCardData {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    description: item.tagline || "",
    bannerImage: item.image,
    initials: item.initials,
    avatarColor: item.color,
    isPrivate: item.isPrivate,
    tags: [],
    memberCount: Math.floor(Math.random() * 20) + 3,
    leads: [
      { name: "User 1", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64", type: "person" },
      { name: "User 2", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=64", type: "person" },
    ],
  };
}

export function BrowseAndPinModal({
  open,
  onOpenChange,
  pinnedIds,
  onPin,
}: BrowseAndPinModalProps) {
  // Get all spaces that are not yet pinned
  const unpinnedSpaces = useMemo(() => {
    return MOCK_MEMBERSHIPS.filter(
      m => m.type === "space" && !pinnedIds.has(m.id)
    );
  }, [pinnedIds]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pin a Space</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {unpinnedSpaces.map(space => (
            <div key={space.id} className="relative group">
              <SpaceCard space={toSpaceCardData(space)} />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <IconButton
                  variant="default"
                  size="icon"
                  tooltipLabel="Pin this space"
                  onClick={() => onPin(space.id)}
                >
                  <Pin className="w-4 h-4" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

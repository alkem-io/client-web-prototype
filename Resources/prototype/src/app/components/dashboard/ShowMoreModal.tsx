import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { SpaceCard, SpaceCardData } from "@/app/components/space/SpaceCard";
import { MembershipItem } from "@/app/components/memberships/membershipData";

interface ShowMoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: "lead" | "host" | null;
  spaces: MembershipItem[];
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

export function ShowMoreModal({
  open,
  onOpenChange,
  category,
  spaces,
}: ShowMoreModalProps) {
  const titles = {
    lead: "Spaces I Lead & Administer",
    host: "Spaces I Host",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {category ? titles[category] : ""}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {spaces.map(space => (
            <SpaceCard
              key={space.id}
              space={toSpaceCardData(space)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

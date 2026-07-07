import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { IconButton } from "@/app/components/ui/icon-button";
import { MOCK_MEMBERSHIPS, MembershipItem } from "@/app/components/memberships/membershipData";
import { Pin, Lock } from "lucide-react";
import { useMemo } from "react";

interface BrowseAndPinModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pinnedIds: Set<string>;
  onPin: (spaceId: string) => void;
}

function CompactCard({ item, overlay }: { item: MembershipItem; overlay?: React.ReactNode }) {
  return (
    <div
      className="group relative overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        boxShadow: "none",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "var(--elevation-sm)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "none")
      }
    >
      {/* Banner - 2:1 aspect ratio */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "2 / 1" }}>
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${item.color}, ${item.color}88)`,
            }}
          />
        )}
        {item.isPrivate && (
          <div
            className="absolute top-2 right-2 backdrop-blur-sm p-1.5 rounded-full"
            style={{
              background:
                "color-mix(in srgb, var(--foreground) 50%, transparent)",
              color: "var(--primary-foreground)",
            }}
          >
            <Lock className="w-3 h-3" />
          </div>
        )}
        {overlay && <div className="absolute inset-0 flex items-center justify-center">{overlay}</div>}
      </div>

      {/* Footer: Avatar + Name */}
      <div className="p-3 flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg shrink-0 overflow-hidden"
          style={{
            border: "1px solid var(--border)",
            background: item.color,
          }}
        >
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
              {item.initials}
            </div>
          )}
        </div>
        <h3
          className="truncate text-sm font-medium"
          style={{
            color: "var(--card-foreground)",
          }}
        >
          {item.name}
        </h3>
      </div>
    </div>
  );
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
            <CompactCard
              key={space.id}
              item={space}
              overlay={
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <IconButton
                    variant="default"
                    size="icon"
                    tooltipLabel="Pin this space"
                    onClick={() => onPin(space.id)}
                  >
                    <Pin className="w-4 h-4" />
                  </IconButton>
                </div>
              }
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

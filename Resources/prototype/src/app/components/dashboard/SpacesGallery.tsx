import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { MOCK_MEMBERSHIPS, MembershipItem } from "@/app/components/memberships/membershipData";
import { SpaceCard, SpaceCardData } from "@/app/components/space/SpaceCard";
import { SeeAllSubspacesDialog } from "@/app/components/dashboard/SeeAllSubspacesDialog";

const BATCH_SIZE = 8;

/** Convert a MembershipItem (subspace) to SpaceCardData for the SpaceCard component */
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

export function SpacesGallery() {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [subspacesDialogOpen, setSubspacesDialogOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<{ name: string; slug: string; subspaces: MembershipItem[] } | null>(null);

  // Get only top-level spaces
  const spaces = MOCK_MEMBERSHIPS.filter((m) => m.type === "space");
  const visibleSpaces = spaces.slice(0, visibleCount);
  const hasMore = visibleCount < spaces.length;

  // Get subspaces for a given space
  const getSubspaces = (spaceId: string) =>
    MOCK_MEMBERSHIPS.filter((m) => m.type === "subspace" && m.parentId === spaceId);

  const handleSeeAllSubspaces = (space: MembershipItem) => {
    const subspaces = getSubspaces(space.id);
    setSelectedSpace({ name: space.name, slug: space.slug, subspaces });
    setSubspacesDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      {visibleSpaces.map((space) => {
        const subspaces = getSubspaces(space.id);
        const previewSubspaces = subspaces.slice(0, 4);

        return (
          <div
            key={space.id}
            className="overflow-hidden"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              boxShadow: "var(--elevation-sm)",
            }}
          >
            {/* Banner */}
            <div
              className="w-full cursor-pointer overflow-hidden"
              style={{ aspectRatio: "1536 / 256" }}
              onClick={() => navigate(`/space/${space.slug}`)}
            >
              {space.image ? (
                <img
                  src={space.image}
                  alt={space.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{ background: `linear-gradient(135deg, ${space.color}, ${space.color}88)` }}
                />
              )}
            </div>

            {/* Name + Tagline */}
            <div className="px-6 pt-5 pb-4 text-center">
              <h3
                className="text-lg font-bold cursor-pointer hover:text-primary transition-colors"
                style={{ color: "var(--card-foreground)" }}
                onClick={() => navigate(`/space/${space.slug}`)}
              >
                {space.name}
              </h3>
              {space.tagline && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {space.tagline}
                </p>
              )}
            </div>

            {/* Subspace Preview */}
            {previewSubspaces.length > 0 && (
              <div className="px-6 pb-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {previewSubspaces.map((sub) => (
                    <SpaceCard
                      key={sub.id}
                      space={toSpaceCardData(sub, space.slug)}
                    />
                  ))}
                </div>

                {/* See all subspaces link */}
                {subspaces.length > 4 && (
                  <div className="flex justify-center mt-3">
                    <Button variant="link" size="sm" onClick={() => handleSeeAllSubspaces(space)}>
                      See all {subspaces.length} Subspaces <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={() => setVisibleCount((c) => c + BATCH_SIZE)}>
            Load More
          </Button>
        </div>
      )}

      {/* See All Subspaces Dialog */}
      <SeeAllSubspacesDialog
        open={subspacesDialogOpen}
        onOpenChange={setSubspacesDialogOpen}
        spaceName={selectedSpace?.name ?? ""}
        spaceSlug={selectedSpace?.slug ?? ""}
        subspaces={selectedSpace?.subspaces ?? []}
      />
    </div>
  );
}

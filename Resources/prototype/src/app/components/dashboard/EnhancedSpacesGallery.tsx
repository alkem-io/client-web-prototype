import { useState, useMemo } from "react";
import { ChevronRight, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/app/components/ui/button";
import { SpaceCard, SpaceCardData } from "@/app/components/space/SpaceCard";
import { MOCK_MEMBERSHIPS, MembershipItem } from "@/app/components/memberships/membershipData";
import { ShowMoreModal } from "./ShowMoreModal";
import { BrowseAndPinModal } from "./BrowseAndPinModal";

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

export function EnhancedSpacesGallery() {
  const navigate = useNavigate();
  const spaces = useMemo(() => MOCK_MEMBERSHIPS.filter(m => m.type === "space"), []);

  // Modal state
  const [showMoreOpen, setShowMoreOpen] = useState(false);
  const [showMoreCategory, setShowMoreCategory] = useState<"lead" | "host" | null>(null);
  const [browseAndPinOpen, setBrowseAndPinOpen] = useState(false);
  const [pinned, setPinned] = useState<Set<string>>(
    new Set(spaces.filter(s => s.isPinned).map(s => s.id))
  );

  // Helper: get seen space IDs across multiple lists
  const getSeenIds = (...lists: MembershipItem[][]): Set<string> =>
    new Set(lists.flat().map(s => s.id));

  // Row 1: Pinned Spaces
  const pinnedSpaces = useMemo(
    () => spaces.filter(s => pinned.has(s.id)).slice(0, 4),
    [spaces, pinned]
  );
  const placeholderCount = 4 - pinnedSpaces.length;

  // Row 2: Recent Spaces (last 30 days)
  const recentSpaces = useMemo(() => {
    const seenIds = getSeenIds(pinnedSpaces);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return spaces
      .filter(
        s =>
          !seenIds.has(s.id) &&
          s.lastModified &&
          new Date(s.lastModified) > thirtyDaysAgo
      )
      .sort(
        (a, b) =>
          (b.lastModified?.getTime() ?? 0) -
          (a.lastModified?.getTime() ?? 0)
      )
      .slice(0, 4);
  }, [spaces, pinnedSpaces]);

  // Row 3: Spaces I Lead & Administer
  const leadSpaces = useMemo(() => {
    const seenIds = getSeenIds(pinnedSpaces, recentSpaces);
    return spaces
      .filter(
        s => !seenIds.has(s.id) && (s.role === "Lead" || s.role === "Admin")
      )
      .sort(
        (a, b) =>
          (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
      );
  }, [spaces, pinnedSpaces, recentSpaces]);

  // Row 4: Spaces I Host
  const hostSpaces = useMemo(() => {
    const seenIds = getSeenIds(pinnedSpaces, recentSpaces, leadSpaces);
    return spaces
      .filter(s => !seenIds.has(s.id) && s.role === "Host")
      .sort(
        (a, b) =>
          (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
      );
  }, [spaces, pinnedSpaces, recentSpaces, leadSpaces]);

  // Row 5: Spaces with Most Activity
  const activitySpaces = useMemo(() => {
    const seenIds = getSeenIds(
      pinnedSpaces,
      recentSpaces,
      leadSpaces,
      hostSpaces
    );
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return spaces
      .filter(
        s =>
          !seenIds.has(s.id) &&
          s.activityScore &&
          s.lastActivityDate &&
          new Date(s.lastActivityDate) > thirtyDaysAgo
      )
      .sort((a, b) => (b.activityScore ?? 0) - (a.activityScore ?? 0))
      .slice(0, 4);
  }, [spaces, pinnedSpaces, recentSpaces, leadSpaces, hostSpaces]);

  const handlePinSpace = (spaceId: string) => {
    setPinned(prev => new Set([...prev, spaceId]));
    setBrowseAndPinOpen(false);
  };

  return (
    <>
      <div className="space-y-8">
        {/* Row 1: Pinned Spaces (Always renders) */}
        <section>
          <h2 className="text-lg font-semibold mb-4">My Pinned Spaces</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {pinnedSpaces.map(space => (
              <SpaceCard
                key={space.id}
                space={toSpaceCardData(space)}
              />
            ))}
            {Array(placeholderCount)
              .fill(null)
              .map((_, i) => (
                <div
                  key={`placeholder-${i}`}
                  className="h-full rounded-xl border-2 border-dashed border-muted-foreground/30 bg-transparent hover:border-primary hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center p-4"
                  onClick={() => setBrowseAndPinOpen(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setBrowseAndPinOpen(true);
                    }
                  }}
                >
                  <div className="flex items-center justify-center rounded-full bg-muted shadow-sm mb-3 size-10">
                    <Plus className="text-muted-foreground" size={20} />
                  </div>
                  <span className="text-body-emphasis font-medium text-foreground text-center">
                    Pin a space
                  </span>
                </div>
              ))}
          </div>
        </section>

        {/* Row 2: Recent Spaces */}
        {recentSpaces.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4">My Recent Spaces</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentSpaces.map(space => (
                <SpaceCard
                  key={space.id}
                  space={toSpaceCardData(space)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Row 3: Spaces I Lead & Administer */}
        {leadSpaces.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4">
              Spaces I Lead & Administer
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {leadSpaces.slice(0, 4).map(space => (
                <SpaceCard
                  key={space.id}
                  space={toSpaceCardData(space)}
                />
              ))}
            </div>
            {leadSpaces.length > 4 && (
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowMoreCategory("lead");
                    setShowMoreOpen(true);
                  }}
                >
                  Show More: {leadSpaces.length} Spaces
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </section>
        )}

        {/* Row 4: Spaces I Host */}
        {hostSpaces.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Spaces I Host</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {hostSpaces.slice(0, 4).map(space => (
                <SpaceCard
                  key={space.id}
                  space={toSpaceCardData(space)}
                />
              ))}
            </div>
            {hostSpaces.length > 4 && (
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowMoreCategory("host");
                    setShowMoreOpen(true);
                  }}
                >
                  Show More: {hostSpaces.length} Spaces
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </section>
        )}

        {/* Row 5: Spaces with Most Activity */}
        {activitySpaces.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4">
              Spaces with Most Activity
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {activitySpaces.map(space => (
                <SpaceCard
                  key={space.id}
                  space={toSpaceCardData(space)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Modals */}
      <ShowMoreModal
        open={showMoreOpen}
        category={showMoreCategory}
        onOpenChange={setShowMoreOpen}
        spaces={showMoreCategory === "lead" ? leadSpaces : hostSpaces}
      />
      <BrowseAndPinModal
        open={browseAndPinOpen}
        onOpenChange={setBrowseAndPinOpen}
        pinnedIds={pinned}
        onPin={handlePinSpace}
      />
    </>
  );
}

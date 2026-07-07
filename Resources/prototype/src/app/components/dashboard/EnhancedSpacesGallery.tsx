import { useState, useMemo } from "react";
import { ChevronRight, Plus, Lock } from "lucide-react";
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

  // Row 2: Spaces with Most Activity (last 30 days)
  const activitySpaces = useMemo(() => {
    const seenIds = getSeenIds(pinnedSpaces);
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
  }, [spaces, pinnedSpaces]);

  // Row 3: Recent Spaces (last 30 days, last edited)
  const recentSpaces = useMemo(() => {
    const seenIds = getSeenIds(pinnedSpaces, activitySpaces);
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
  }, [spaces, pinnedSpaces, activitySpaces]);

  // Row 4: Spaces I Lead & Administer
  const leadSpaces = useMemo(() => {
    const seenIds = getSeenIds(pinnedSpaces, activitySpaces, recentSpaces);
    return spaces
      .filter(
        s => !seenIds.has(s.id) && (s.role === "Lead" || s.role === "Admin")
      )
      .sort(
        (a, b) =>
          (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
      );
  }, [spaces, pinnedSpaces, activitySpaces, recentSpaces]);

  // Row 5: Spaces I Host
  const hostSpaces = useMemo(() => {
    const seenIds = getSeenIds(pinnedSpaces, activitySpaces, recentSpaces, leadSpaces);
    return spaces
      .filter(s => !seenIds.has(s.id) && s.role === "Host")
      .sort(
        (a, b) =>
          (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
      );
  }, [spaces, pinnedSpaces, activitySpaces, recentSpaces, leadSpaces]);

  const handlePinSpace = (spaceId: string) => {
    setPinned(prev => new Set([...prev, spaceId]));
    setBrowseAndPinOpen(false);
  };

  return (
    <>
      <div className="space-y-8">
        {/* Row 1: Pinned Spaces (Always renders) - Compact banner + footer format */}
        <section>
          <h2 className="text-lg font-semibold mb-4">My Pinned Spaces</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {pinnedSpaces.map(space => (
              <div
                key={space.id}
                onClick={() => navigate(`/space/${space.slug}`)}
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
                {/* Banner */}
                <div className="relative aspect-video overflow-hidden">
                  {space.image ? (
                    <img
                      src={space.image}
                      alt={space.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{
                        background: `linear-gradient(135deg, ${space.color}, ${space.color}88)`,
                      }}
                    />
                  )}
                  {space.isPrivate && (
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
                </div>

                {/* Footer: Avatar + Name */}
                <div className="p-3 flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg shrink-0 overflow-hidden"
                    style={{
                      border: "1px solid var(--border)",
                      background: space.color,
                    }}
                  >
                    {space.image ? (
                      <img
                        src={space.image}
                        alt={space.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                        {space.initials}
                      </div>
                    )}
                  </div>
                  <h3
                    className="truncate text-sm font-medium"
                    style={{
                      color: "var(--card-foreground)",
                    }}
                  >
                    {space.name}
                  </h3>
                </div>
              </div>
            ))}
            {Array(placeholderCount)
              .fill(null)
              .map((_, i) => (
                <div
                  key={`placeholder-${i}`}
                  onClick={() => setBrowseAndPinOpen(true)}
                  className="group relative overflow-hidden cursor-pointer transition-all rounded-xl border-2 border-dashed border-muted-foreground/30 bg-transparent hover:border-primary hover:bg-primary/5"
                  style={{ aspectRatio: "1 / 1.2" }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setBrowseAndPinOpen(true);
                    }
                  }}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center p-4">
                    <div className="flex items-center justify-center rounded-full bg-muted shadow-sm mb-2 size-8">
                      <Plus className="text-muted-foreground" size={16} />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground text-center">
                      Pin a space
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Row 2: Spaces with Most Activity */}
        {activitySpaces.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Spaces with Most Activity</h2>
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

        {/* Row 3: Recent Spaces */}
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

        {/* Row 4: Spaces I Lead & Administer */}
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

        {/* Row 5: Spaces I Host */}
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

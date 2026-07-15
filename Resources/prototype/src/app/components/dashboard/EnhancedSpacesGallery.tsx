import { useState, useMemo } from "react";
import { ChevronRight, ChevronDown, Lock, Plus, Clock, Calendar, Mail, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/app/components/ui/button";
import { MOCK_MEMBERSHIPS, MembershipItem } from "@/app/components/memberships/membershipData";
import { ShowMoreModal } from "./ShowMoreModal";
import { BrowseAndPinModal } from "./BrowseAndPinModal";

// Mock open applications for new user flow (1 item for design)
const MOCK_OPEN_APPLICATIONS = [
  {
    id: 1,
    space: "Sustainability Goals 2024",
    spaceSlug: "sustainability-goals",
    spaceImage: "https://picsum.photos/1200/256?random=app1",
    spaceInitials: "SG",
    spaceColor: "#059669",
    submittedDate: "3 hours ago",
    status: "pending" as const,
  },
];

// Mock pending invitation for new user flow (1 item for design)
const MOCK_PENDING_INVITATIONS = [
  {
    id: 1,
    space: "Urban Mobility Lab",
    spaceSlug: "urban-mobility",
    spaceImage: "https://picsum.photos/1200/256?random=inv1",
    spaceInitials: "UM",
    spaceColor: "#2563eb",
    invitedBy: "Marc Johnson",
    invitedDate: "1 day ago",
    role: "Member",
  },
];

// Open Applications card component for new user view
function OpenApplicationCard({ application, onClick }: { application: typeof MOCK_OPEN_APPLICATIONS[0]; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/20 transition-colors cursor-pointer"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg shrink-0 overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          {application.spaceImage ? (
            <img src={application.spaceImage} alt={application.space} className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: application.spaceColor }}
            >
              {application.spaceInitials}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium" style={{ color: "var(--card-foreground)" }}>
            Application to join <span className="font-bold text-primary">{application.space}</span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
        Pending review
      </div>
    </div>
  );
}

// Pending Invitation card component for new user view
function PendingInvitationCard({ invitation, onClick }: { invitation: typeof MOCK_PENDING_INVITATIONS[0]; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/20 transition-colors cursor-pointer"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg shrink-0 overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          {invitation.spaceImage ? (
            <img src={invitation.spaceImage} alt={invitation.space} className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: invitation.spaceColor }}
            >
              {invitation.spaceInitials}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium" style={{ color: "var(--card-foreground)" }}>
            <span className="font-bold">{invitation.invitedBy}</span> invited you to join <span className="font-bold text-primary">{invitation.space}</span>
          </span>

        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button size="sm" variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10">
          Decline
        </Button>
        <Button size="sm">
          Accept
        </Button>
      </div>
    </div>
  );
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

// Responsive placeholder card (matches SpaceCardCompact format)
function ResponsivePlaceholderCard({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer transition-all overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary hover:bg-primary/5 relative"
      style={{
        background: "var(--card)",
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
    >
      {/* Invisible spacer to match other cards' total height (aspect-ratio 2/1 banner + h-14 footer) */}
      <div className="w-full" style={{ aspectRatio: "2 / 1" }} aria-hidden="true" />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center rounded-full bg-muted shadow-sm mb-2 size-10">
          <Plus className="text-muted-foreground group-hover:text-primary transition-colors" size={20} />
        </div>
        <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
          Pin a space
        </span>
      </div>

      {/* Footer spacer - matches card footer structure */}
      <div className="p-3 h-14" />
    </div>
  );
}

// Reusable card component (banner + footer format)
function SpaceCardCompact({ item, onClick }: { item: MembershipItem; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
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
      {/* Banner - 2:1 aspect ratio (wider, shorter) */}
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

interface EnhancedSpacesGalleryProps {
  newUserView?: boolean;
  hasPending?: boolean;
}

export function EnhancedSpacesGallery({ newUserView = false, hasPending = true }: EnhancedSpacesGalleryProps) {
  const navigate = useNavigate();
  const spaces = useMemo(() => MOCK_MEMBERSHIPS.filter(m => m.type === "space"), []);

  // Modal state
  const [showMoreOpen, setShowMoreOpen] = useState(false);
  const [showMoreCategory, setShowMoreCategory] = useState<"lead" | "host" | null>(null);
  const [browseAndPinOpen, setBrowseAndPinOpen] = useState(false);
  const [pinned, setPinned] = useState<Set<string>>(
    new Set(spaces.filter(s => s.isPinned).map(s => s.id))
  );

  // Collapse state for each row
  const [collapsedRows, setCollapsedRows] = useState<Set<string>>(new Set());
  const toggleRowCollapse = (rowId: string) => {
    setCollapsedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  // Helper: get seen space IDs across multiple lists
  const getSeenIds = (...lists: MembershipItem[][]): Set<string> =>
    new Set(lists.flat().map(s => s.id));

  // Row 1: My Recent Spaces (pinned space first, then recent by last modified)
  const myRecentSpaces = useMemo(() => {
    const pinnedSpace = spaces.find(s => pinned.has(s.id));
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recent = spaces
      .filter(
        s =>
          !pinned.has(s.id) &&
          s.lastModified &&
          new Date(s.lastModified) > thirtyDaysAgo
      )
      .sort(
        (a, b) =>
          (b.lastModified?.getTime() ?? 0) -
          (a.lastModified?.getTime() ?? 0)
      )
      .slice(0, pinnedSpace ? 3 : 4);

    return pinnedSpace ? [pinnedSpace, ...recent] : recent;
  }, [spaces, pinned]);

  // Row 2: Spaces with Most Activity (last 30 days)
  const activitySpaces = useMemo(() => {
    const seenIds = getSeenIds(myRecentSpaces);
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
  }, [spaces, myRecentSpaces]);

  // Row 3: Spaces I Lead & Administer
  const leadSpaces = useMemo(() => {
    const seenIds = getSeenIds(myRecentSpaces, activitySpaces);
    return spaces
      .filter(
        s => !seenIds.has(s.id) && (s.role === "Lead" || s.role === "Admin")
      )
      .sort(
        (a, b) =>
          (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
      );
  }, [spaces, myRecentSpaces, activitySpaces]);

  // Row 4: Spaces I Host
  const hostSpaces = useMemo(() => {
    const seenIds = getSeenIds(myRecentSpaces, activitySpaces, leadSpaces);
    return spaces
      .filter(s => !seenIds.has(s.id) && s.role === "Host")
      .sort(
        (a, b) =>
          (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
      );
  }, [spaces, myRecentSpaces, activitySpaces, leadSpaces]);

  const handlePinSpace = (spaceId: string) => {
    setPinned(prev => new Set([...prev, spaceId]));
    setBrowseAndPinOpen(false);
  };

  if (newUserView) {
    // Get spaces to show in explore section (Welcome first, then others, 2 rows = 8 cards)
    const welcomeSpace = spaces.find(s => s.id === "welcome");
    const otherSpaces = spaces.filter(s => s.id !== "welcome");
    const exploreSpaces = welcomeSpace ? [welcomeSpace, ...otherSpaces].slice(0, 8) : otherSpaces.slice(0, 8);
    const hasPendingItems = hasPending;

    return (
      <>
        <div className="space-y-8">
          {/* Welcome Banner — shown when no pending applications/invitations */}
          {!hasPendingItems && (
            <section
              className="rounded-lg p-6 md:p-8 flex items-center justify-between gap-6 relative overflow-hidden"
              style={{
                background: "color-mix(in srgb, var(--primary) 95%, white)",
                color: "white",
              }}
            >
              {/* Subtle background flair */}
              <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full opacity-10" style={{ background: "white" }} />
                <div className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full opacity-[0.07]" style={{ background: "white" }} />
                <div className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full opacity-[0.05]" style={{ background: "white" }} />
              </div>

              <div className="relative">
                <h2 className="text-lg font-semibold mb-1.5">Welcome to Alkemio!</h2>
                <p className="text-sm opacity-80 max-w-md leading-relaxed">
                  Great to have you here. Alkemio is where people collaborate on the
                  challenges that matter. Start by visiting our Welcome Space to learn
                  the basics and get the most out of the platform.
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0 relative">
                <Button
                  onClick={() => navigate("/space/welcome")}
                  variant="secondary"
                  size="sm"
                  className="bg-white text-primary hover:bg-white/90 border-0 font-medium"
                >
                  Visit the Welcome Space
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
                <Button
                  onClick={() => navigate("/docs")}
                  variant="secondary"
                  size="sm"
                  className="bg-white/15 hover:bg-white/25 text-white border border-white/30 font-medium"
                >
                  Documentation
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </section>
          )}

          {/* Open Applications & Invitations — shown when pending items exist */}
          {hasPendingItems && (
          <section>
            <button
              onClick={() => toggleRowCollapse("applications")}
              className="w-full flex items-center justify-between mb-4 hover:opacity-75 transition-opacity"
              type="button"
            >
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Pending Applications & Invitations</h2>
                <span className="rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-bold px-2 py-0.5">
                  {MOCK_OPEN_APPLICATIONS.length + MOCK_PENDING_INVITATIONS.length} pending
                </span>
              </div>
              {collapsedRows.has("applications") ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {!collapsedRows.has("applications") && (
              <div className="flex flex-col gap-3">
                {MOCK_OPEN_APPLICATIONS.map(app => (
                  <OpenApplicationCard
                    key={`app-${app.id}`}
                    application={app}
                    onClick={() => navigate(`/space/${app.spaceSlug}`)}
                  />
                ))}
                {MOCK_PENDING_INVITATIONS.map(inv => (
                  <PendingInvitationCard
                    key={`inv-${inv.id}`}
                    invitation={inv}
                    onClick={() => navigate(`/space/${inv.spaceSlug}`)}
                  />
                ))}
              </div>
            )}
          </section>
          )}

          {/* Explore Spaces — 2 rows of cards + button */}
          {exploreSpaces.length > 0 && (
            <section>
              <button
                onClick={() => toggleRowCollapse("explore")}
                className="w-full flex items-center justify-between mb-4 hover:opacity-75 transition-opacity"
                type="button"
              >
                <h2 className="text-lg font-semibold">Explore Spaces</h2>
                {collapsedRows.has("explore") ? (
                  <ChevronRight className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              {!collapsedRows.has("explore") && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {exploreSpaces.map(space => (
                      <SpaceCardCompact
                        key={space.id}
                        item={space}
                        onClick={() => navigate(`/space/${space.slug}`)}
                      />
                    ))}
                  </div>
                  <div className="flex justify-center mt-4">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/spaces")}
                    >
                      Explore all Spaces
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </>
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

  return (
    <>
      <div className="space-y-8">
        {/* Row 1: Last Active In (pinned space first) */}
        {myRecentSpaces.length > 0 && (
        <section>
          <button
            onClick={() => toggleRowCollapse("recent")}
            className="w-full flex items-center justify-between mb-4 hover:opacity-75 transition-opacity"
            type="button"
          >
            <h2 className="text-lg font-semibold">Last Active In</h2>
            {collapsedRows.has("recent") ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          {!collapsedRows.has("recent") && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {myRecentSpaces.map(space => (
              <SpaceCardCompact
                key={space.id}
                item={space}
                onClick={() => navigate(`/space/${space.slug}`)}
              />
            ))}
          </div>
          )}
        </section>
        )}

        {/* Row 2: Spaces with Most Activity */}
        {activitySpaces.length > 0 && (
          <section>
            <button
              onClick={() => toggleRowCollapse("activity")}
              className="w-full flex items-center justify-between mb-4 hover:opacity-75 transition-opacity"
              type="button"
            >
              <h2 className="text-lg font-semibold">Spaces with Most Activity</h2>
              {collapsedRows.has("activity") ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {!collapsedRows.has("activity") && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {activitySpaces.map(space => (
                <SpaceCardCompact
                  key={space.id}
                  item={space}
                  onClick={() => navigate(`/space/${space.slug}`)}
                />
              ))}
            </div>
            )}
          </section>
        )}

        {/* Row 3: Spaces I Lead & Administer */}
        {leadSpaces.length > 0 && (
          <section>
            <button
              onClick={() => toggleRowCollapse("lead")}
              className="w-full flex items-center justify-between mb-4 hover:opacity-75 transition-opacity"
              type="button"
            >
              <h2 className="text-lg font-semibold">Spaces I Lead & Administer</h2>
              {collapsedRows.has("lead") ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {!collapsedRows.has("lead") && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {leadSpaces.slice(0, 4).map(space => (
                <SpaceCardCompact
                  key={space.id}
                  item={space}
                  onClick={() => navigate(`/space/${space.slug}`)}
                />
              ))}
            </div>
            )}
            {leadSpaces.length > 4 && !collapsedRows.has("lead") && (
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
            <button
              onClick={() => toggleRowCollapse("host")}
              className="w-full flex items-center justify-between mb-4 hover:opacity-75 transition-opacity"
              type="button"
            >
              <h2 className="text-lg font-semibold">Spaces I Host</h2>
              {collapsedRows.has("host") ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {!collapsedRows.has("host") && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {hostSpaces.slice(0, 4).map(space => (
                <SpaceCardCompact
                  key={space.id}
                  item={space}
                  onClick={() => navigate(`/space/${space.slug}`)}
                />
              ))}
            </div>
            )}
            {hostSpaces.length > 4 && !collapsedRows.has("host") && (
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

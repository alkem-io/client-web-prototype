import { Fragment, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { ReadMoreText } from "@/app/components/ui/ReadMoreText";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { SpaceCard, type SpaceCardData } from "@/app/components/space/SpaceCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { Separator } from "@/app/components/ui/separator";
import {
  Info,
  ChevronLeft,
  ChevronDown,
  CalendarDays,
  List,
  Layers,
  MapPin,
  Bot,
  FileText,
  Users,
  Plus,
  Folder,
  Search,
  UserPlus,
  ArrowUpLeft,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import { SubspaceCommunityDialog } from "@/app/components/space/SubspaceCommunityDialog";
import { TagCloud, SubspaceQuickLinks } from "@/app/components/space/SpaceSidebar";
import { ProfileHoverCard } from "@/app/components/user/ProfileHoverCard";
import { VCHoverCard } from "@/app/components/user/VCHoverCard";
import { cn } from "@/lib/utils";
import {
  loadSubspaceSidebarWidgets,
  visibleWidgets,
} from "@/app/components/space/SidebarWidgets";

interface SubspaceSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
  parentSpaceName?: string;
  parentSpaceInitials?: string;
  parentSpaceBanner?: string;
  parentSpaceDescription?: string;
  parentSpaceHref?: string;
  /** Grandparent info for depth-2 (sub-subspace) stacking */
  grandparentSpaceName?: string;
  grandparentSpaceInitials?: string;
  grandparentSpaceBanner?: string;
  grandparentSpaceHref?: string;
}

const SUBSPACE_LEAD = {
  name: "David Kim",
  location: "Berlin, DE",
  avatar:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  initials: "DK",
};

const VIRTUAL_CONTRIBUTOR = {
  name: "Design Advisor",
  description: "AI assistant trained on design thinking and collaboration frameworks.",
  avatar:
    "https://images.unsplash.com/photo-1641312874336-6279a832a3dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256",
};

const SUB_SUBSPACES: (SpaceCardData & { status: string })[] = [
  {
    id: "ss-1",
    slug: "solar-panel-deployment",
    name: "Solar Panel Deployment",
    description: "Planning and rollout of residential solar panel installations across participating municipalities.",
    bannerImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    initials: "SP",
    avatarColor: "#f59e0b",
    isPrivate: false,
    tags: ["Solar", "Deployment"],
    memberCount: 8,
    status: "Active",
    leads: [
      { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", type: "person" },
    ],
    parent: { name: "Renewable Energy Transition", slug: "renewable-energy-transition", initials: "RE", avatarColor: "#22c55e" },
  },
  {
    id: "ss-2",
    slug: "wind-farm-feasibility",
    name: "Wind Farm Feasibility",
    description: "Feasibility studies for offshore and onshore wind projects in the northern corridor.",
    bannerImage: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=800&q=80",
    initials: "WF",
    avatarColor: "#0ea5e9",
    isPrivate: false,
    tags: ["Wind", "Feasibility"],
    memberCount: 6,
    status: "Active",
    leads: [
      { name: "David Kim", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", type: "person" },
    ],
    parent: { name: "Renewable Energy Transition", slug: "renewable-energy-transition", initials: "RE", avatarColor: "#22c55e" },
  },
  {
    id: "ss-3",
    slug: "battery-storage-research",
    name: "Battery Storage Research",
    description: "Research on grid-scale battery storage solutions and next-gen energy storage tech.",
    bannerImage: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&w=800&q=80",
    initials: "BS",
    avatarColor: "#8b5cf6",
    isPrivate: false,
    tags: ["Battery", "Research"],
    memberCount: 5,
    status: "Active",
    leads: [
      { name: "Emily Davis", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", type: "person" },
      { name: "Tech Innovations", avatar: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80", type: "org" },
    ],
    parent: { name: "Renewable Energy Transition", slug: "renewable-energy-transition", initials: "RE", avatarColor: "#22c55e" },
  },
];

export function SubspaceSidebar({
  isCollapsed,
  onToggleCollapse,
  className,
  parentSpaceName = "The Sandbox",
  parentSpaceInitials = "S",
  parentSpaceBanner = "https://images.unsplash.com/photo-1690191863988-f685cddde463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  parentSpaceDescription = "The place for all field builders on steward-ownership to learn, connect, discuss and collaborate.",
  parentSpaceHref = "#",
  grandparentSpaceName,
  grandparentSpaceInitials,
  grandparentSpaceBanner,
  grandparentSpaceHref,
}: SubspaceSidebarProps) {
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [railHovered, setRailHovered] = useState(false);
  const depth = grandparentSpaceName ? 2 : 1;

  // Admin-configured sidebar widgets — one set for the whole subspace,
  // set via Subspace Settings → Innovation Flow → Customize Sidebar.
  const widgetConfig = loadSubspaceSidebarWidgets();
  const visibleKeys = visibleWidgets(widgetConfig);
  // The challenge card is what the parent-space cards stack behind, so it only
  // gets that treatment while it leads the order. Moved down, it stands alone
  // and the parent stack falls back to normal flow at the top.
  const stackedChallenge = visibleKeys[0] === "intent";

  const quickActionButton = (Icon: React.ElementType, label: string, key: string) => (
    <button
      onClick={() => setOpenDialog(key)}
      className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-md transition-colors hover:bg-muted/50"
    >
      <Icon className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
      <span
        style={{
          fontSize: "var(--text-sm)",
          fontWeight: "var(--font-weight-medium)" as any,
          color: "var(--foreground)",
        }}
      >
        {label}
      </span>
    </button>
  );

  const challengeCard = (
          <div
            className="relative rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div
              className="p-4"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              <ReadMoreText
                maxLines={3}
                style={{
                  fontSize: "var(--text-sm)",
                  lineHeight: 1.6,
                  opacity: 0.92,
                }}
                toggleColor="var(--primary-foreground)"
                toggleOpacity={0.8}
              >
                How might we design a collaborative platform that empowers
                distributed teams to innovate effectively while maintaining social
                connection?
              </ReadMoreText>

              {/* Subspace Lead */}
              <div
                className="pt-3 mt-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}
              >
                <p
                  className="uppercase tracking-wider mb-2"
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    opacity: 0.6,
                    letterSpacing: "0.04em",
                  }}
                >
                  Lead
                </p>
                <div className="flex items-center gap-2.5">
                  <ProfileHoverCard
                    user={{
                      name: SUBSPACE_LEAD.name,
                      avatarUrl: SUBSPACE_LEAD.avatar,
                      initials: SUBSPACE_LEAD.initials,
                      location: SUBSPACE_LEAD.location,
                    }}
                  >
                    <button type="button" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full">
                      <Avatar
                        className="w-8 h-8"
                        style={{ border: "2px solid rgba(255,255,255,0.25)" }}
                      >
                        <AvatarImage src={SUBSPACE_LEAD.avatar} alt={SUBSPACE_LEAD.name} />
                        <AvatarFallback
                          style={{
                            background: "rgba(255,255,255,0.15)",
                            color: "white",
                            fontSize: "9px",
                            fontWeight: 700,
                          }}
                        >
                          {SUBSPACE_LEAD.initials}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </ProfileHoverCard>
                  <div>
                    <p style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>
                      {SUBSPACE_LEAD.name}
                    </p>
                    <p
                      className="flex items-center gap-1"
                      style={{ fontSize: "11px", opacity: 0.7 }}
                    >
                      <MapPin className="w-3 h-3" />
                      {SUBSPACE_LEAD.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
  );

  const widgetNodes: Record<string, React.ReactNode> = {
    intent: stackedChallenge ? null : challengeCard,
    post: (
      <Button
        size="sm"
        className="w-full gap-2 justify-start"
        onClick={() => window.dispatchEvent(new Event("open-add-post-modal"))}
      >
        <Plus className="w-4 h-4" />
        Post
      </Button>
    ),
    inviteUser: (
      <Button variant="outline" size="sm" className="w-full gap-2 justify-start">
        <UserPlus className="w-4 h-4" />
        Invite User
      </Button>
    ),
    createSubspace: (
      <Button variant="outline" size="sm" className="w-full gap-2 justify-start">
        <Plus className="w-4 h-4" />
        Create Subspace
      </Button>
    ),
    search: (
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search posts..."
          className="w-full h-9 pl-8 pr-3 transition-all text-sm rounded-md border border-border bg-input-background text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
        />
      </div>
    ),
    tags: (
      <TagCloud
        tags={["Strategy", "Policy", "Solar", "Grid", "Stakeholders", "Data", "Funding", "Community"]}
        activeTags={[]}
        toggleTag={() => {}}
      />
    ),
    subspaceLinks: <SubspaceQuickLinks />,
    community: quickActionButton(Users, "Community", "community"),
    events: quickActionButton(CalendarDays, "Events", "events"),
    index: quickActionButton(List, "Index", "index"),
  };

  // Keep buttons and quick-action rows visually grouped while they sit together,
  // so the default order still looks the way it did before it was configurable.
  const FAMILIES: Record<string, "action" | "quick"> = {
    post: "action",
    inviteUser: "action",
    createSubspace: "action",
    community: "quick",
    events: "quick",
    index: "quick",
  };
  const widgetGroups = visibleKeys.reduce<
    Array<{ family: "action" | "quick" | "solo"; keys: string[] }>
  >((acc, key) => {
    if (key === "intent" && stackedChallenge) return acc;
    const family = FAMILIES[key];
    const last = acc[acc.length - 1];
    if (family && last && last.family === family) last.keys.push(key);
    else acc.push({ family: family ?? "solo", keys: [key] });
    return acc;
  }, []);

  // The collapsed rail mirrors the same choices.
  const railIcons = visibleKeys
    .filter((k) => ["community", "events", "index", "subspaceLinks"].includes(k))
    .map((k) =>
      k === "community"
        ? { icon: Users, label: "Community", key: "community" }
        : k === "events"
        ? { icon: CalendarDays, label: "Events", key: "events" }
        : k === "index"
        ? { icon: List, label: "Index", key: "index" }
        : { icon: Layers, label: "Subspaces", key: "subspaces" }
    );

  return (
    <div
      className={cn(
        "relative transition-all duration-300 ease-in-out shrink-0",
        isCollapsed ? "w-12" : "w-full",
        className
      )}
      style={{ fontFamily: "var(--font-family, 'Inter', sans-serif)" }}
    >
      {/* ── Collapsed Rail View ── */}
      {isCollapsed && (
        <div className="flex flex-col items-center gap-0 pt-1">
          {/* Expand button */}
          <button
            onClick={onToggleCollapse}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground hover:bg-muted mb-1"
            title="Expand sidebar"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>

          {/* Parent space indicator */}
          <a
            href="#"
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-muted mb-1"
            title={`Go to ${parentSpaceName}`}
            style={{ textDecoration: "none" }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: 22,
                height: 22,
                borderRadius: 4,
                background: "var(--primary)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              <span style={{ color: "white", fontSize: "8px", fontWeight: 700, letterSpacing: "-0.02em" }}>
                {parentSpaceInitials}
              </span>
            </div>
          </a>

          {/* Divider */}
          <div className="w-5 h-px my-1.5" style={{ background: "var(--border)" }} />

          {/* Quick action icons */}
          {railIcons.map(({ icon: Icon, label, key }) => (
            <button
              key={key}
              onClick={() => setOpenDialog(key)}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
              title={label}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      )}

      {/* Sidebar content — hidden when collapsed */}
      <div
        className={cn(
          "flex flex-col gap-3 transition-opacity duration-200",
          isCollapsed
            ? "opacity-0 invisible pointer-events-none h-0 overflow-hidden"
            : "opacity-100 visible overflow-visible"
        )}
      >
        {/* ── Challenge Statement with Parent Stack ── */}
        <div
          style={{
            paddingTop: stackedChallenge ? (depth === 2 ? 28 : 14) : 0,
            paddingLeft: stackedChallenge ? (depth === 2 ? 20 : 10) : 0,
            marginTop: 4,
            paddingBottom: 0,
            overflow: "visible",
          }}
          className={cn("relative", !stackedChallenge && "flex flex-col gap-2")}
        >
          {/* Grandparent card (depth 2 only) */}
          {depth === 2 && grandparentSpaceBanner && (
            <a
              href={grandparentSpaceHref || "#"}
              className={cn("block no-underline", stackedChallenge && "absolute")}
              title={`Go to ${grandparentSpaceName}`}
              style={{
                ...(stackedChallenge
                  ? {
                      top: 0,
                      left: 0,
                      width: "calc(100% - 20px)",
                      height: "calc(100% - 28px)",
                    }
                  : { width: "100%" }),
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid var(--border)",
                background: "var(--card)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                transform: "translateY(0)",
                transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s",
              }}
            >
              <div style={{ aspectRatio: "16 / 9", overflow: "hidden" }}>
                <img src={grandparentSpaceBanner} alt={grandparentSpaceName} className="w-full h-full object-cover" style={{ display: "block" }} />
              </div>
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="flex items-center justify-center shrink-0" style={{ width: 18, height: 18, borderRadius: 4, background: "var(--primary)" }}>
                  <span style={{ color: "white", fontSize: "7px", fontWeight: 700 }}>{grandparentSpaceInitials}</span>
                </div>
                <span className="text-xs font-medium truncate" style={{ color: "var(--muted-foreground)" }}>{grandparentSpaceName}</span>
                <ArrowUpLeft className="w-3 h-3 shrink-0" style={{ color: "var(--muted-foreground)", opacity: 0, transition: "opacity 0.2s" }} />
              </div>
            </a>
          )}

          {/* Parent card — mini SpaceCard behind the challenge */}
          <a
            href={parentSpaceHref}
            className={cn("block no-underline", stackedChallenge && "absolute")}
            title={`Go to ${parentSpaceName}`}
            style={{
              ...(stackedChallenge
                ? {
                    top: depth === 2 ? 14 : 0,
                    left: depth === 2 ? 10 : 0,
                    width: "calc(100% - 20px)",
                    height: "calc(100% - 28px)",
                  }
                : { width: "100%" }),
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid var(--border)",
              background: "var(--card)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
              transform: railHovered ? "translateY(-3px)" : "translateY(0)",
              transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s",
            }}
            onMouseEnter={() => setRailHovered(true)}
            onMouseLeave={() => setRailHovered(false)}
          >
            <div style={{ aspectRatio: "16 / 9", overflow: "hidden" }}>
              <img
                src={parentSpaceBanner}
                alt={parentSpaceName}
                className="w-full h-full object-cover"
                style={{
                  display: "block",
                  filter: railHovered ? "brightness(1.05)" : "brightness(1)",
                  transition: "filter 0.3s",
                }}
              />
            </div>
            <div className="flex flex-col gap-1 px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center shrink-0" style={{ width: 20, height: 20, borderRadius: 4, background: "var(--primary)" }}>
                  <span style={{ color: "white", fontSize: "8px", fontWeight: 700 }}>{parentSpaceInitials}</span>
                </div>
                <span className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>{parentSpaceName}</span>
                <ArrowUpLeft className="w-3 h-3 shrink-0" style={{ color: "var(--muted-foreground)", opacity: railHovered ? 0.7 : 0, transition: "opacity 0.2s" }} />
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2" style={{ lineHeight: 1.4 }}>{parentSpaceDescription}</p>
            </div>
          </a>

          {stackedChallenge && challengeCard}
        </div>

        {/* ── Widgets — visibility and order come from Settings → Layout ── */}
        {widgetGroups.map((group, i) =>
          group.family === "action" ? (
            <div key={`g-${i}`} className="flex flex-col gap-2">
              {group.keys.map((k) => (
                <Fragment key={k}>{widgetNodes[k]}</Fragment>
              ))}
            </div>
          ) : group.family === "quick" ? (
            <div key={`g-${i}`} className="space-y-1">
              {group.keys.map((k) => (
                <Fragment key={k}>{widgetNodes[k]}</Fragment>
              ))}
            </div>
          ) : (
            <Fragment key={`g-${i}`}>{widgetNodes[group.keys[0]]}</Fragment>
          )
        )}

        {/* Collapse button */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex items-center gap-1.5 w-full mt-2 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Collapse sidebar"
        >
          <PanelLeftClose className="w-3.5 h-3.5" />
          <span>Collapse</span>
        </button>
      </div>

      {/* ── Quick Action Dialogs ── */}

      {/* Community Dialog */}
      <SubspaceCommunityDialog
        open={openDialog === "community"}
        onOpenChange={(open) => setOpenDialog(open ? "community" : null)}
      />



      {/* Events Dialog */}
      <Dialog open={openDialog === "events"} onOpenChange={(open) => setOpenDialog(open ? "events" : null)}>
        <DialogContent
          className="max-w-none sm:max-w-none max-h-[85vh] overflow-y-auto"
          style={{ width: 'calc((100vw - 2 * var(--grid-margin-desktop) - 11 * var(--grid-gutter)) / var(--grid-columns) * 6 + 5 * var(--grid-gutter))' }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" style={{ color: "var(--primary)" }} />
              Events
            </DialogTitle>
            <DialogDescription>Upcoming and past events for this subspace.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {[
              { title: "Strategy Workshop", date: "Apr 25, 2026", time: "10:00 – 12:00 CET", status: "upcoming", attendees: 14 },
              { title: "Stakeholder Review Meeting", date: "Apr 28, 2026", time: "14:00 – 15:30 CET", status: "upcoming", attendees: 8 },
              { title: "Policy Framework Feedback Session", date: "May 2, 2026", time: "09:00 – 11:00 CET", status: "upcoming", attendees: 22 },
              { title: "Community Solar Ideation Sprint", date: "Apr 15, 2026", time: "13:00 – 17:00 CET", status: "past", attendees: 18 },
              { title: "Monthly Progress Sync", date: "Apr 10, 2026", time: "11:00 – 12:00 CET", status: "past", attendees: 12 },
            ].map((event, i) => (
              <div
                key={i}
                className="p-3 rounded-lg"
                style={{
                  border: "1px solid var(--border)",
                  background: event.status === "upcoming" ? "var(--card)" : "var(--muted)",
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--foreground)" }}>{event.title}</p>
                    <p className="mt-1 flex items-center gap-1.5" style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                      <CalendarDays className="w-3 h-3" />
                      {event.date} · {event.time}
                    </p>
                  </div>
                  <span
                    className="shrink-0 px-2 py-0.5 rounded-full text-[11px] font-medium"
                    style={{
                      background: event.status === "upcoming"
                        ? "color-mix(in srgb, var(--primary) 12%, transparent)"
                        : "color-mix(in srgb, var(--muted-foreground) 12%, transparent)",
                      color: event.status === "upcoming" ? "var(--primary)" : "var(--muted-foreground)",
                    }}
                  >
                    {event.status === "upcoming" ? "Upcoming" : "Past"}
                  </span>
                </div>
                <p className="mt-1.5 flex items-center gap-1" style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                  <Users className="w-3 h-3" />
                  {event.attendees} attendees
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Index Dialog */}
      <Dialog open={openDialog === "index"} onOpenChange={(open) => setOpenDialog(open ? "index" : null)}>
        <DialogContent
          className="max-w-none sm:max-w-none max-h-[85vh] overflow-y-auto"
          style={{ width: 'calc((100vw - 2 * var(--grid-margin-desktop) - 11 * var(--grid-gutter)) / var(--grid-columns) * 6 + 5 * var(--grid-gutter))' }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <List className="w-5 h-5" style={{ color: "var(--primary)" }} />
              Index
            </DialogTitle>
            <DialogDescription>All posts and content organized in this subspace.</DialogDescription>
          </DialogHeader>
          <div className="space-y-1 mt-2">
            {[
              { title: "Kickoff: Municipal Transition Strategy", type: "Post", channel: "Strategy Docs", author: "Sarah Chen" },
              { title: "Renewable Grid Architecture — Visual Mapping", type: "Whiteboard", channel: "Strategy Docs", author: "David Kim" },
              { title: "Draft: Incentive Framework for Early Adopters", type: "Post", channel: "Policy Drafts", author: "Emily Davis" },
              { title: "Call for Ideas: Community Solar Projects", type: "Call for Whiteboards", channel: "Municipal Data", author: "Alex Torres" },
              { title: "Stakeholder Contact Directory", type: "Collection", channel: "Stakeholders", author: "Anna Martinez" },
              { title: "Comparative Analysis: EU Renewable Directives", type: "Post", channel: "Policy Drafts", author: "Robert Fox" },
            ].map((item, i) => (
              <button
                key={i}
                className="flex items-start gap-3 w-full text-left px-3 py-2.5 rounded-md transition-colors hover:bg-muted/50"
              >
                <FileText className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
                <div className="flex-1 min-w-0">
                  <p className="truncate" style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--foreground)" }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                    {item.type} · {item.channel} · {item.author}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Subspaces Dialog */}
      <Dialog open={openDialog === "subspaces"} onOpenChange={(open) => setOpenDialog(open ? "subspaces" : null)}>
        <DialogContent
          className="max-w-none sm:max-w-none max-h-[85vh] overflow-y-auto"
          style={{ width: 'calc((100vw - 2 * var(--grid-margin-desktop) - 11 * var(--grid-gutter)) / var(--grid-columns) * 6 + 5 * var(--grid-gutter))' }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" style={{ color: "var(--primary)" }} />
              Subspaces
            </DialogTitle>
            <DialogDescription>Explore focused workstreams and challenges within this subspace.</DialogDescription>
          </DialogHeader>

          {/* Header row with filter + create */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2">
              {["All", "Active", "Archived"].map((status) => (
                <button
                  key={status}
                  className={cn(
                    "px-3 py-1.5 rounded-full transition-colors",
                    status === "All"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    border: `1px solid ${status === "All" ? "var(--primary)" : "var(--border)"}`,
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
            <Button size="sm" className="shrink-0 gap-2">
              <Plus className="w-4 h-4" />
              Create Subspace
            </Button>
          </div>

          {/* Card Grid — mirrors SpaceSubspacesList layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {(SUB_SUBSPACES as (SpaceCardData & { status: string })[]).map((subspace) => (
              <SpaceCard
                key={subspace.id}
                space={subspace}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

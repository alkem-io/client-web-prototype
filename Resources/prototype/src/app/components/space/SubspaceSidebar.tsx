import { useState } from "react";
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
  Activity,
  CalendarDays,
  List,
  Layers,
  MapPin,
  Bot,
  Clock,
  MessageSquare,
  FileText,
  Users,
  Plus,
  Folder,
  Search,
  X,
} from "lucide-react";
import { SubspaceCommunityDialog } from "@/app/components/space/SubspaceCommunityDialog";
import { ProfileHoverCard } from "@/app/components/user/ProfileHoverCard";
import { VCHoverCard } from "@/app/components/user/VCHoverCard";
import { cn } from "@/lib/utils";

interface SubspaceSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
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
}: SubspaceSidebarProps) {
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "relative transition-all duration-300 ease-in-out shrink-0",
        isCollapsed ? "w-12" : "w-full",
        className
      )}
    >
      {/* Collapse toggle — positioned on the right edge */}
      <button
        onClick={onToggleCollapse}
        className={cn(
          "absolute -right-3 top-0 z-20 hidden md:flex items-center justify-center w-6 h-6 rounded-full transition-transform",
          isCollapsed && "rotate-180"
        )}
        style={{
          background: "var(--background)",
          border: "1px solid var(--border)",
          boxShadow: "var(--elevation-sm)",
          color: "var(--muted-foreground)",
        }}
      >
        <ChevronLeft className="w-3 h-3" />
      </button>

      {/* Sidebar content — hidden when collapsed */}
      <div
        className={cn(
          "flex flex-col w-full p-1.5 overflow-hidden transition-opacity duration-200",
          isCollapsed
            ? "opacity-0 invisible pointer-events-none"
            : "opacity-100 visible"
        )}
      >
        {/* 1. Description */}
        <div className="pb-3">
          <ReadMoreText
            maxLines={3}
            className="text-sm text-foreground/85 leading-relaxed"
            toggleColor="var(--foreground)"
            toggleOpacity={0.75}
          >
            How might we design a collaborative platform that empowers
            distributed teams to innovate effectively while maintaining social
            connection?
          </ReadMoreText>
        </div>

        {/* 2–3. Action buttons */}
        <div className="pb-4">
          <div className="flex flex-col gap-2">
            <Button size="sm" className="w-full gap-2 justify-start" onClick={() => window.dispatchEvent(new Event("open-add-post-modal"))}>
              <Plus className="w-4 h-4" />
              Post
            </Button>
            <Button variant="outline" size="sm" className="w-full gap-2 justify-start">
              <Plus className="w-4 h-4" />
              Create Subspace
            </Button>
          </div>
        </div>

        {/* ── divider ── */}
        <div className="mb-4" />

        {/* 4. Search bar */}
        <div className="pb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search posts…"
              className="w-full h-9 pl-8 pr-3 transition-all text-sm rounded-md border border-border bg-input-background text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.boxShadow = "0 0 0 1px var(--ring)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* Tag cloud */}
        <div className="flex flex-wrap gap-1.5 pb-4">
          {["Strategy", "Policy", "Solar", "Grid", "Stakeholders", "Data", "Funding", "Community"].map((tag) => (
            <button
              key={tag}
              className="px-2 py-0.5 rounded-full text-badge border transition-colors bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* ── divider ── */}
        <div className="mb-4" />

        {/* 5. Subspaces section */}
        <div className="pb-4">
          <SubspaceQuickLinks />
        </div>

        {/* ── divider ── */}
        <div className="mb-4" />

        {/* 6–9. Action links */}
        <div className="flex flex-col">
          {[
            { icon: Activity, label: "Recent Activity", key: "activity" },
            { icon: Users, label: "Community", key: "community" },
            { icon: CalendarDays, label: "Events", key: "events" },
            { icon: List, label: "Index", key: "index" },
          ].map(({ icon: Icon, label, key }) => (
            <button
              key={key}
              onClick={() => setOpenDialog(key)}
              className="flex items-center gap-2.5 w-full text-left py-1.5 rounded-md text-sm transition-colors hover:bg-muted/50"
            >
              <Icon
                className="w-4 h-4 shrink-0"
                style={{ color: "var(--primary)" }}
              />
              <span className="text-foreground/85">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Quick Action Dialogs ── */}

      {/* Community Dialog */}
      <SubspaceCommunityDialog
        open={openDialog === "community"}
        onOpenChange={(open) => setOpenDialog(open ? "community" : null)}
      />

      {/* Recent Activity Dialog */}
      <Dialog open={openDialog === "activity"} onOpenChange={(open) => setOpenDialog(open ? "activity" : null)}>
        <DialogContent
          className="max-w-none sm:max-w-none max-h-[85vh] overflow-y-auto"
          style={{ width: 'calc((100vw - 2 * var(--grid-margin-desktop) - 11 * var(--grid-gutter)) / var(--grid-columns) * 6 + 5 * var(--grid-gutter))' }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" style={{ color: "var(--primary)" }} />
              Recent Activity
            </DialogTitle>
            <DialogDescription>Latest updates and contributions in this subspace.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {[
              { user: "Sarah Chen", action: "posted", target: "Kickoff: Municipal Transition Strategy", time: "2 hours ago", icon: FileText },
              { user: "David Kim", action: "added a whiteboard to", target: "Renewable Grid Architecture", time: "5 hours ago", icon: FileText },
              { user: "Emily Davis", action: "commented on", target: "Draft: Incentive Framework", time: "1 day ago", icon: MessageSquare },
              { user: "Alex Torres", action: "created", target: "Call for Ideas: Community Solar", time: "2 days ago", icon: FileText },
              { user: "Anna Martinez", action: "updated", target: "Stakeholder Contact Directory", time: "3 days ago", icon: FileText },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-md" style={{ background: "color-mix(in srgb, var(--primary) 10%, transparent)" }}>
                    <item.icon className="w-3.5 h-3.5" style={{ color: "var(--primary)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--foreground)" }}>
                      <span style={{ fontWeight: 600 }}>{item.user}</span>{" "}
                      <span style={{ color: "var(--muted-foreground)" }}>{item.action}</span>{" "}
                      <span style={{ fontWeight: 500 }}>{item.target}</span>
                    </p>
                    <p className="flex items-center gap-1 mt-0.5" style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </p>
                  </div>
                </div>
                {i < 4 && <Separator className="mt-3" />}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

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

/* ─── Sub-components ─────────────────────────────────────────── */

const SUBSPACE_AVATARS = [
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=80",
  "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=80",
  "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=80",
];

function SubspaceQuickLinks() {
  const [collapsed, setCollapsed] = useState(false);

  const subspaces = SUB_SUBSPACES.slice(0, 3);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Subspaces
          </span>
          <ChevronDown className={cn("w-3 h-3 text-muted-foreground transition-transform", collapsed && "-rotate-90")} />
        </button>
      </div>
      {!collapsed && (
        <div className="flex flex-col gap-0.5">
          {subspaces.map((s, i) => (
            <button
              key={s.id}
              className="flex items-center gap-2.5 py-1.5 rounded-md text-sm hover:bg-muted/50 transition-colors text-left"
            >
              <img
                src={SUBSPACE_AVATARS[i % SUBSPACE_AVATARS.length]}
                alt={s.name}
                className="w-8 h-8 rounded-lg shrink-0 object-cover"
              />
              <span className="text-foreground/85 truncate">{s.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

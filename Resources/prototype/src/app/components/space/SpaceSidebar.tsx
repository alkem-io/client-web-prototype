import { useState } from "react";
import { ReadMoreText } from "@/app/components/ui/ReadMoreText";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import {
  Info,
  Plus,
  MapPin,
  Mail,
  UserPlus,
  Search,
  List,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AboutThisSpaceDialog } from "@/app/components/space/AboutThisSpaceDialog";

interface SpaceSidebarProps {
  spaceSlug: string;
  /** Controls which sections render below the info block */
  variant?: "home" | "community" | "workspaces" | "knowledge";
  /** Description of the currently active tab */
  activeTabDescription?: string;
}

const TAB_TAGS: Record<string, string[]> = {
  home:       ["Updates", "Events", "Ideas", "Announcements"],
  community:  ["Members", "Active", "Leads", "New"],
  workspaces: ["Active", "Planning", "Research", "Completed"],
  knowledge:  ["Reports", "Policy", "Research", "Data"],
};

const TAB_INDEX: Record<string, Array<{ title: string; type: string; author: string }>> = {
  home: [
    { title: "Kickoff: Municipal Transition Strategy", type: "Post", author: "Sarah Chen" },
    { title: "Q1 Community Update", type: "Post", author: "Elena Martinez" },
    { title: "Call for Ideas: Community Solar Projects", type: "Call", author: "Alex Torres" },
    { title: "Welcome to the Space", type: "Post", author: "Elena Martinez" },
  ],
  community: [
    { title: "Member Directory", type: "Collection", author: "Elena Martinez" },
    { title: "Onboarding Guide for New Members", type: "Post", author: "Sarah Chen" },
    { title: "Community Roles & Responsibilities", type: "Post", author: "Elena Martinez" },
  ],
  workspaces: [
    { title: "Renewable Energy Initiative", type: "Subspace", author: "David Kim" },
    { title: "Urban Planning Taskforce", type: "Subspace", author: "Emily Davis" },
    { title: "Transportation Working Group", type: "Subspace", author: "Marc Johnson" },
  ],
  knowledge: [
    { title: "Transition Case Studies & Policy Docs", type: "Collection", author: "Elena Martinez" },
    { title: "Q1 Sustainability Report", type: "Document", author: "Sarah Chen" },
    { title: "Grid Modernisation Reference Materials", type: "Collection", author: "David Kim" },
    { title: "Funding Opportunities for Municipal Energy Projects", type: "Document", author: "Emily Davis" },
  ],
};

export function SpaceSidebar({ spaceSlug, variant = "home", activeTabDescription }: SpaceSidebarProps) {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tags = TAB_TAGS[variant] ?? TAB_TAGS.home;
  const indexItems = TAB_INDEX[variant] ?? TAB_INDEX.home;
  const searchPlaceholder =
    variant === "workspaces" ? "Search subspaces…"
    : variant === "knowledge" ? "Search knowledge base…"
    : variant === "community" ? "Search community…"
    : "Search posts…";

  return (
    <div
      className="flex flex-col gap-3 w-full"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Info Block */}
      <InfoBlock onAboutClick={() => setAboutOpen(true)} tabDescription={activeTabDescription} />
      <AboutThisSpaceDialog open={aboutOpen} onOpenChange={setAboutOpen} spaceSlug={spaceSlug} />

      {/* Tab-specific CTA buttons */}
      <TabCTAButtons variant={variant} />

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
      </div>

      {/* Tag cloud */}
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
              activeTag === tag
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Index Button */}
      <div className="pt-1">
        <Button
          variant="outline"
          className="w-full gap-2"
          style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)" as any }}
          onClick={() => setIndexOpen(true)}
        >
          <List className="w-4 h-4" />
          Index
        </Button>
      </div>

      {/* Index Dialog */}
      <Dialog open={indexOpen} onOpenChange={setIndexOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <List className="w-5 h-5" style={{ color: "var(--primary)" }} />
              Index
            </DialogTitle>
            <DialogDescription>
              All content in this space's{" "}
              {variant === "workspaces" ? "subspaces" : variant === "knowledge" ? "knowledge base" : variant} view.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1 mt-2">
            {indexItems.map((item, i) => (
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
                    {item.type} · {item.author}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

function TabCTAButtons({ variant }: { variant: string }) {
  if (variant === "community") {
    return (
      <div className="flex flex-col gap-2">
        <Button size="sm" className="w-full gap-2">
          <Plus className="w-4 h-4" />
          Post
        </Button>
        <Button variant="outline" size="sm" className="w-full gap-2">
          <UserPlus className="w-4 h-4" />
          Add User
        </Button>
        <Button variant="outline" size="sm" className="w-full gap-2">
          <Mail className="w-4 h-4" />
          Contact Leads
        </Button>
      </div>
    );
  }
  if (variant === "workspaces") {
    return (
      <div className="flex flex-col gap-2">
        <Button size="sm" className="w-full gap-2">
          <Plus className="w-4 h-4" />
          Post
        </Button>
        <Button variant="outline" size="sm" className="w-full gap-2">
          <Plus className="w-4 h-4" />
          Create Subspace
        </Button>
      </div>
    );
  }
  // Home and Knowledge Base
  return (
    <Button size="sm" className="w-full gap-2">
      <Plus className="w-4 h-4" />
      Post
    </Button>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

function InfoBlock({ onAboutClick, tabDescription }: { onAboutClick: () => void; tabDescription?: string }) {
  return (
    <div
      className="p-5"
      style={{
        background: "var(--primary)",
        color: "var(--primary-foreground)",
        borderRadius: "var(--radius)",
      }}
    >
      <div className="mb-3">
        <ReadMoreText
          maxLines={3}
          style={{
            fontSize: "var(--text-sm)",
            lineHeight: 1.6,
            opacity: 0.9,
          }}
          toggleColor="var(--primary-foreground)"
          toggleOpacity={0.8}
        >
          {tabDescription || "About this space"}
        </ReadMoreText>
      </div>

      {/* Space Lead */}
      <div
        className="pt-3 mt-1"
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
        <div className="flex items-center gap-3">
          <Avatar
            className="w-8 h-8"
            style={{ border: "2px solid rgba(255,255,255,0.25)" }}
          >
            <AvatarImage
              src="https://images.unsplash.com/photo-1623853589874-864b1dd4d922?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGdsYXNzZXMlMjBibGFjayUyMGFuZCUyMHdoaXRlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5NDQyNTM3fDA&ixlib=rb-4.1.0&q=80&w=256"
              alt="Elena Martinez"
            />
            <AvatarFallback
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "white",
                fontSize: "9px",
                fontWeight: 700,
              }}
            >
              EM
            </AvatarFallback>
          </Avatar>
          <div>
            <p style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>
              Elena Martinez
            </p>
            <p
              className="flex items-center gap-1"
              style={{ fontSize: "11px", opacity: 0.7 }}
            >
              <MapPin className="w-3 h-3" />
              Amsterdam, NL
            </p>
          </div>
        </div>
      </div>

      {/* About this Space */}
      <button
        onClick={onAboutClick}
        className="w-full flex items-center justify-center gap-2 pt-3 mt-3 hover:underline cursor-pointer"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.15)",
          fontSize: "var(--text-sm)",
          fontWeight: "var(--font-weight-medium)" as any,
          color: "var(--primary-foreground)",
          opacity: 0.8,
          background: "none",
          border: "none",
          borderTopWidth: "1px",
          borderTopStyle: "solid",
          borderTopColor: "rgba(255,255,255,0.15)",
          padding: 0,
          paddingTop: "12px",
          marginTop: "12px",
        }}
      >
        <Info className="w-3.5 h-3.5" />
        About this Space
      </button>
    </div>
  );
}


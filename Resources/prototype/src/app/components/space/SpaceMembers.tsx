/**
 * Community contributors — a **contributors callout** with the prototype's rich
 * contributor cards.
 *
 * Structure is production's: contributors are a callout framing type (CRD's
 * `PostType` has `contributors`, and `CalloutDetailDialog` a
 * `contributorsFramingSlot`), so this is a post whose body is the collection —
 * not a bare grid on a tab. The People / Organisations type switch and the
 * All / Lead / Member role filter both mirror CRD's `ContributorCollection`,
 * including when each appears: the type switch at ≥2 types, the role filter
 * only when the set mixes leads and members.
 *
 * WHY NOT `ContributorCollection` ITSELF (rule 2): its cards are production's
 * compact `ContributorCard` — avatar, name, role, location. The prototype's are
 * richer: skills/tags, and a hover card (`ProfileHoverCard` / `OrgHoverCard`)
 * with bio, tags and location. `ContributorCollection` renders `ContributorCard`
 * internally and exposes no card slot, so the two cannot be combined today.
 *
 * NEEDS UPSTREAM: a `renderCard` / `cardSlot` prop on `ContributorCollection`.
 * With it this file collapses back to CRD's collection and keeps the rich
 * cards. Same class of blocker as `reactionsSlot` on the contribution cards —
 * see PHASE-2.md §12.
 *
 * Everything structural here is built from CRD primitives (`Tabs`,
 * `SearchField`, `Button`, `Card`, `Avatar`), never hand-rolled.
 */
import { useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, MapPin, MoreHorizontal, User, Users } from "lucide-react";
import { Link } from "react-router";
import { SearchField } from "@/crd/forms/SearchField";
import { Avatar, AvatarFallback, AvatarImage } from "@/crd/primitives/avatar";
import { Button } from "@/crd/primitives/button";
import { Card, CardContent } from "@/crd/primitives/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/crd/primitives/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/crd/primitives/tabs";
import { PostCard } from "@/app/components/space/PostCard";
import { ProfileHoverCard } from "@/ahead/ProfileHoverCard";
import { OrgHoverCard } from "@/ahead/OrgHoverCard";

// ── Types ──
interface MemberEntry {
  kind: "user";
  id: string;
  name: string;
  role: string;
  roleType: string;
  joinDate: string;
  avatar: string | null;
  initials: string;
  bio: string;
  tags: string[];
  skills?: string[];
  location?: string;
}

interface OrgEntry {
  kind: "org";
  id: string;
  name: string;
  type: string;
  description: string;
  avatar: string;
  initials: string;
  members: number;
  website: string;
  tags: string[];
  location?: string;
  skillTags?: string[];
}

type CommunityEntry = MemberEntry | OrgEntry;

// ── Mock Data: Users ──
const RAW_MEMBERS: Omit<MemberEntry, "kind">[] = [
  {
    id: "u1",
    name: "Elena Martinez",
    role: "Host",
    roleType: "admin",
    joinDate: "Oct 2023",
    avatar: "https://images.unsplash.com/photo-1623853589874-864b1dd4d922?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGdsYXNzZXMlMjBibGFjayUyMGFuZCUyMHdoaXRlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5NDQyNTM3fDA&ixlib=rb-4.1.0&q=80&w=256",
    initials: "EM",
    bio: "Community Host. Driving sustainable innovation in urban planning.",
    tags: ["Leads", "Members", "Active"],
    skills: ["Urban Planning", "Sustainability", "Community Design", "Policy", "Innovation", "Public Engagement"],
    location: "Barcelona, ES"
  },
  {
    id: "u2",
    name: "Sarah Chen",
    role: "Admin",
    roleType: "admin",
    joinDate: "Nov 2023",
    avatar: "https://images.unsplash.com/photo-1757347398206-7425300ef990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNtaWxpbmclMjBkYXJrJTIwaGFpciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTQ0MjUzN3ww&ixlib=rb-4.1.0&q=80&w=256",
    initials: "SC",
    bio: "Energy systems analyst with a passion for green tech.",
    tags: ["Leads", "Members", "Active"],
    skills: ["Energy Systems", "Green Tech", "Data Analysis", "Renewable Energy", "Smart Grids", "Python", "Research"],
    location: "Amsterdam, NL"
  },
  {
    id: "u3",
    name: "Maya Ross",
    role: "Lead",
    roleType: "moderator",
    joinDate: "Dec 2023",
    avatar: "https://images.unsplash.com/photo-1589332911105-a6b59f2e4c4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNtaWxpbmclMjBkYXJrJTIwaGFpciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTQ0MjUzN3ww&ixlib=rb-4.1.0&q=80&w=256",
    initials: "MR",
    bio: "Focusing on community engagement and policy.",
    tags: ["Leads", "Active", "Members"],
    skills: ["Community Engagement", "Policy Analysis", "Stakeholder Management", "Facilitation", "Workshop Design"],
    location: "Berlin, DE"
  },
  {
    id: "u4",
    name: "David Kim",
    role: "Member",
    roleType: "member",
    joinDate: "Jan 2024",
    avatar: "https://images.unsplash.com/photo-1651634099348-e4c38cfaa6d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBiZWFyZCUyMHN1bnNldCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2OTQ0MjUzN3ww&ixlib=rb-4.1.0&q=80&w=256",
    initials: "DK",
    bio: "",
    tags: ["Members", "Active"],
    skills: ["Software Development", "React", "TypeScript", "UX Design"],
    location: "Seoul, KR"
  },
  {
    id: "u5",
    name: "Robert Fox",
    role: "Member",
    roleType: "member",
    joinDate: "Jan 2024",
    avatar: "https://images.unsplash.com/photo-1651097681268-851acda33b18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGRlciUyMG1hbiUyMHdoaXRlJTIwYmVhcmQlMjBnbGFzc2VzJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5NDQyNTM3fDA&ixlib=rb-4.1.0&q=80&w=256",
    initials: "RF",
    bio: "",
    tags: ["Members"],
    skills: ["EU Policy", "Renewable Directives", "Legal", "Research", "Comparative Analysis", "Climate Law"],
    location: "Brussels, BE"
  },
  ...Array.from({ length: 24 }).map((_, i) => ({
    id: `m${i + 6}`,
    name:
      [
        "James Wilson", "Emma Thompson", "Lucas Oliveira", "Sophia Li", "Oliver Smith",
        "Ava Patel", "William Chen", "Isabella Garcia", "Henry Wilson", "Mia Kim",
        "Alexander Wright", "Charlotte Davis", "Daniel Lee", "Amelia White", "Matthew Clark",
        "Harper Lewis", "Joseph Hall", "Evelyn Young", "Samuel Allen", "Abigail King",
        "Benjamin Scott", "Elizabeth Green", "Jack Baker", "Victoria Adams",
      ][i] || `Member ${i + 6}`,
    role: i < 3 ? "Lead" : "Member",
    roleType: i < 3 ? "moderator" : "member",
    joinDate: "Feb 2024",
    avatar: null as string | null,
    initials:
      [
        "JW", "ET", "LO", "SL", "OS", "AP", "WC", "IG", "HW", "MK",
        "AW", "CD", "DL", "AW", "MC", "HL", "JH", "EY", "SA", "AK",
        "BS", "EG", "JB", "VA",
      ][i] || `M${i + 6}`,
    bio: i % 3 === 0 ? "" : "Passionate about contributing to the community space.",
    tags: i < 3 ? ["Leads", "Active", "Members"] : (i < 8 ? ["Members", "Active"] : ["Members"])
  })),
];

export const SPACE_MEMBERS = RAW_MEMBERS; // keep export for sidebar etc.

// ── Mock Data: Organizations ──
const RAW_ORGS: Omit<OrgEntry, "kind">[] = [
  {
    id: "org1",
    name: "Green Future Labs",
    type: "Research Institute",
    description: "Leading research in renewable energy systems and sustainable urban planning.",
    location: "Rotterdam, NL",
    skillTags: ["Renewable Energy", "Urban Planning", "Sustainability", "Research"],
    avatar: "https://images.unsplash.com/photo-1769697264314-28f093151bbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZW5ld2FibGUlMjBlbmVyZ3klMjBjb21wYW55JTIwZ3JlZW4lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3MjEwNDU4MXww&ixlib=rb-4.1.0&q=80&w=256",
    initials: "GF",
    members: 12,
    website: "https://greenfuturelabs.org",
    tags: ["Members", "Active"]
  },
  {
    id: "org2",
    name: "City of Amsterdam",
    type: "Municipality",
    description: "Municipal government driving sustainable urban transformation across the Netherlands.",
    location: "Amsterdam, NL",
    skillTags: ["Urban Policy", "Smart City", "Governance", "Climate Action"],
    avatar: "https://images.unsplash.com/photo-1760246964044-1384f71665b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBidWlsZGluZyUyMG1vZGVybnxlbnwxfHx8fDE3NzIwMTQ2Mjd8MA&ixlib=rb-4.1.0&q=80&w=256",
    initials: "CA",
    members: 8,
    website: "https://amsterdam.nl",
    tags: ["Members", "Active"]
  },
  {
    id: "org3",
    name: "Utrecht University",
    type: "Academic",
    description: "Faculty of Geosciences contributing research on climate adaptation and energy transition.",
    location: "Utrecht, NL",
    skillTags: ["Climate Adaptation", "Energy Transition", "Geosciences", "Academia"],
    avatar: "https://images.unsplash.com/photo-1631599143424-5bc234fbebf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzcyMDQ1OTQwfDA&ixlib=rb-4.1.0&q=80&w=256",
    initials: "UU",
    members: 5,
    website: "https://uu.nl",
    tags: ["Members", "Active"]
  },
  {
    id: "org4",
    name: "Sustainable Cities Fund",
    type: "NGO",
    description: "Non-profit funding innovative urban sustainability projects across Europe.",
    location: "Brussels, BE",
    skillTags: ["Funding", "Urban Sustainability", "Impact Investing", "EU Projects"],
    avatar: "https://images.unsplash.com/photo-1763050234301-b623bdf88749?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub25wcm9maXQlMjBjaGFyaXR5JTIwY29tbXVuaXR5JTIwb3JnYW5pemF0aW9ufGVufDF8fHx8MTc3MjEwNDU4Mnww&ixlib=rb-4.1.0&q=80&w=256",
    initials: "SC",
    members: 3,
    website: "https://sustainablecitiesfund.eu",
    tags: ["Members", "Active"]
  },
];

export const SPACE_ORGS = RAW_ORGS; // the hover-card directory reads it

// ── Merged list ──
const ALL_ENTRIES: CommunityEntry[] = [
  ...RAW_ORGS.map((o): OrgEntry => ({ ...o, kind: "org" })),
  ...RAW_MEMBERS.map((m): MemberEntry => ({ ...m, kind: "user" })),
];

/** Mirrors ContributorCollection's page size. */
const PAGE_SIZE = 9;

type ContributorType = "user" | "organization";
type RoleFilter = "all" | "lead" | "member";

/** Production never surfaces administrative status on a contributor card. */
const isLead = (role: string) => ["Host", "Admin", "Lead"].includes(role);

export function SpaceMembers() {
  const [activeType, setActiveType] = useState<ContributorType>("user");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const reset = () => setPage(0);

  const people = RAW_MEMBERS.map((m): MemberEntry => ({ ...m, kind: "user" }));
  const orgs = RAW_ORGS.map((o): OrgEntry => ({ ...o, kind: "org" }));

  // Role filter only filters people; organisations carry no lead/member split.
  const leadCount = people.filter(m => isLead(m.role)).length;
  const memberCount = people.length - leadCount;
  const showRoleFilter = activeType === "user" && leadCount > 0 && memberCount > 0;

  const activeSet: (MemberEntry | OrgEntry)[] = activeType === "user" ? people : orgs;

  const filtered = activeSet.filter(entry => {
    if (search && !entry.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeType === "user" && roleFilter !== "all") {
      const lead = isLead((entry as MemberEntry).role);
      return roleFilter === "lead" ? lead : !lead;
    }
    return true;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const visible = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  const roleCount = (rf: RoleFilter) =>
    rf === "all" ? people.length : rf === "lead" ? leadCount : memberCount;

  return (
    <PostCard
      post={{
        id: "callout-contributors",
        type: "contributors",
        title: "This is us!",
        snippet: "The people and organisations contributing to this space.",
        author: { name: "Elena Martinez" },
        timestamp: "2 days ago",
        commentCount: 0
      }}
      reactionsEnabled={false}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Type switch — shown at >=2 types, matching ContributorCollection. */}
          <Tabs
            className="w-full sm:w-auto"
            value={activeType}
            onValueChange={v => {
              setActiveType(v as ContributorType);
              setRoleFilter("all");
              reset();
            }}
          >
            <TabsList className="w-full max-w-full justify-start overflow-x-auto sm:w-fit sm:justify-center">
              <TabsTrigger value="user" className="flex-none sm:flex-1">
                <span>People</span>
                <span className="ml-1.5 rounded-full bg-background/60 px-1.5 text-caption text-muted-foreground">
                  {people.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="organization" className="flex-none sm:flex-1">
                <span>Organisations</span>
                <span className="ml-1.5 rounded-full bg-background/60 px-1.5 text-caption text-muted-foreground">
                  {orgs.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Role filter — only when the active set mixes leads and members. */}
          {showRoleFilter && (
            <Tabs
              className="w-full sm:w-auto"
              value={roleFilter}
              onValueChange={v => {
                setRoleFilter(v as RoleFilter);
                reset();
              }}
            >
              <TabsList className="w-full max-w-full justify-start overflow-x-auto sm:w-fit sm:justify-center">
                {(["all", "lead", "member"] as RoleFilter[]).map(rf => (
                  <TabsTrigger key={rf} value={rf} className="flex-none sm:flex-1">
                    <span className="capitalize">{rf}</span>
                    <span className="ml-1.5 rounded-full bg-background/60 px-1.5 text-caption text-muted-foreground">
                      {roleCount(rf)}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        </div>

        <SearchField
          value={search}
          onValueChange={value => {
            setSearch(value);
            reset();
          }}
          placeholder="Search by name..."
          ariaLabel="Search by name"
        />

        <p className="text-body text-muted-foreground">
          {filtered.length} {activeType === "user" ? "people" : "organisations"}
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map(entry =>
            entry.kind === "user" ? (
              <UserCard key={entry.id} member={entry} />
            ) : (
              <OrgCard key={entry.id} org={entry} />
            )
          )}
        </div>

        {pageCount > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={safePage === 0}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-body text-muted-foreground">
              Page {safePage + 1} of {pageCount}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage(p => Math.min(pageCount - 1, p + 1))}
              disabled={safePage >= pageCount - 1}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </PostCard>
  );
}

function UserCard({
  member
}: {
  member: MemberEntry;
}) {
  const profileTags = member.skills?.slice(0, 2) ?? [];

  return (
    <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300">
      <CardContent className="flex flex-1 flex-col p-0" style={{ paddingBottom: 0 }}>
        <div className="p-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <ProfileHoverCard
              user={{
                name: member.name,
                avatarUrl: member.avatar,
                initials: member.initials,
                bio: member.bio || undefined,
                tags: member.skills,
                location: member.location,
                profileUrl: `/user/${member.name.toLowerCase().replace(/\s+/g, "-")}`
              }}
            >
              <Link
                to={`/user/${member.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="transition-opacity hover:opacity-80"
              >
                <Avatar className="w-12 h-12" style={{ border: "1px solid var(--border)" }}>
                  {member.avatar && <AvatarImage src={member.avatar} alt={member.name} />}
                  <AvatarFallback
                    className="text-card-title"
                    >
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </ProfileHoverCard>
            <div>
              <Link
                to={`/user/${member.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="hover:text-primary transition-colors block text-card-title"
                style={{
                  color: "var(--foreground)"
                }}
              >
                {member.name}
              </Link>
              {/* The badge used to be hard-coded "Member" for everyone. It now
                  reflects the actual role, matching production's Lead / Member
                  split — and the role filter beside it. */}
              <div
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-caption font-medium border mt-1 bg-muted text-muted-foreground border-border"
                >
                <User className="w-3 h-3" />
                {isLead(member.role) ? "Lead" : "Member"}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              <DropdownMenuItem>Message</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Remove from Space</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-1 flex-col px-4 pb-4">
          <p
            className={`line-clamp-2 text-body${member.bio ? "" : " italic"}`}
            style={{
              color: "var(--muted-foreground)"
              }}
          >
            {member.bio || "User has not filled in their bio"}
          </p>
          {profileTags.length > 0 && (
            <div className="mt-3 flex gap-1 overflow-hidden">
              {profileTags.map((tag) => (
                <span
                  key={tag}
                  className="shrink min-w-0 truncate rounded-full border border-border bg-muted px-1.5 py-0.5 text-caption text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {member.location && (
            <div
              className="mt-3 flex items-center gap-1 text-caption"
              style={{
                color: "var(--muted-foreground)"
                }}
            >
              <MapPin className="w-3 h-3" />
              <span>{member.location}</span>
            </div>
          )}
          <div
            className="mt-auto flex items-center gap-1 pt-3 text-caption"
            style={{
              color: "var(--muted-foreground)"
              }}
          >
            <span>Joined this space {member.joinDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Organization Card ──
function OrgCard({ org }: { org: OrgEntry }) {
  const profileTags = org.skillTags?.slice(0, 2) ?? [];

  return (
    <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300">
      <CardContent className="flex h-full flex-col p-0" style={{ paddingBottom: 0 }}>
        <div className="p-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <OrgHoverCard
              org={{
                name: org.name,
                avatarUrl: org.avatar,
                initials: org.initials,
                location: org.location,
                description: org.description,
                tags: org.skillTags
              }}
            >
              <Link
                to={`/organization/${org.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="transition-opacity hover:opacity-80"
              >
              <Avatar
                className="w-12 h-12"
                style={{
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border)"
                }}
              >
                <AvatarImage
                  src={org.avatar}
                  alt={org.name}
                  style={{ borderRadius: "var(--radius)" }}
                />
                <AvatarFallback
                  className="text-caption font-bold"
                  style={{
                    borderRadius: "var(--radius)",
                    background: "color-mix(in srgb, var(--info) 15%, transparent)",
                    color: "var(--info)"
                  }}
                >
                  {org.initials}
                </AvatarFallback>
              </Avatar>
              </Link>
            </OrgHoverCard>
            <div>
              <Link
                to={`/organization/${org.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="hover:text-primary transition-colors block text-card-title"
                style={{
                  color: "var(--foreground)"
                }}
              >
                {org.name}
              </Link>
            </div>
          </div>

          <a
            href={org.website}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 p-1.5 transition-colors"
            style={{
              color: "var(--muted-foreground)",
              borderRadius: "var(--radius)"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="flex flex-1 flex-col px-4 pb-4">
          <p
            className="line-clamp-2 min-h-[2.5rem] text-body"
            style={{
              color: "var(--muted-foreground)"
              }}
          >
            {org.description}
          </p>
          {profileTags.length > 0 && (
            <div className="mt-3 flex gap-1 overflow-hidden">
              {profileTags.map((tag) => (
                <span
                  key={tag}
                  className="shrink min-w-0 truncate rounded-full border border-border bg-muted px-1.5 py-0.5 text-caption text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {org.location && (
            <div
              className="mt-3 flex items-center gap-1 text-caption"
              style={{
                color: "var(--muted-foreground)"
                }}
            >
              <MapPin className="w-3 h-3" />
              <span>{org.location}</span>
            </div>
          )}
          <div
            className="mt-auto flex items-center gap-1 pt-3 text-caption"
            style={{
              color: "var(--muted-foreground)"
              }}
          >
            <Users className="w-3 h-3" />
            <span>{org.members} members in this space</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
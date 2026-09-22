import { useState } from "react";
import { useParams, Link } from "react-router";
import { Mail, Send, Settings, UserPlus } from "lucide-react";
import { Button } from "@/crd/primitives/button";
import { IconButton } from "@/crd/primitives/icon-button";
import { Badge } from "@/crd/primitives/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/crd/primitives/avatar";
import { cn } from "@/crd/lib/utils";
interface OrgData {
  name: string;
  initials: string;
  avatarColor: string;
  tagline: string;
  bio: string;
  keywords: string[];
  associates: { id: string; name: string; avatar: string | null; initials: string }[];
  memberships: { id: string; name: string; image: string }[];
  leadSpaces: { id: string; name: string; image: string }[];
  resourcesHosted: { id: string; name: string; image: string }[];
}

const ORG_DATA: Record<string, OrgData> = {
  "sandbox-organization": {
    name: "Sandbox Organization",
    initials: "SO",
    avatarColor: "#0ea5e9",
    tagline: "For demonstration purposes",
    bio: "This Alkemio sandbox organization will be used for demonstration Spaces, Virtual Contributors and Innovation Packs for various use cases or sectors.",
    keywords: ["demo", "sandbox", "showcase", "examples"],
    associates: [
      { id: "u1", name: "Robin Z. Tharakan", avatar: "https://images.unsplash.com/photo-1651634099348-e4c38cfaa6d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256", initials: "RT" },
      { id: "u2", name: "Denise Larsson", avatar: "https://images.unsplash.com/photo-1757347398206-7425300ef990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256", initials: "DL" },
      { id: "u3", name: "Maloe van den Hoogen", avatar: "https://images.unsplash.com/photo-1623853589874-864b1dd4d922?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256", initials: "MH" },
      { id: "u4", name: "Neil Smyth", avatar: "https://images.unsplash.com/photo-1651097681268-851acda33b18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256", initials: "NS" },
      { id: "u5", name: "Support Alkemio", avatar: null, initials: "SA" },
      { id: "u6", name: "Jeroen Nijkamp", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", initials: "JN" },
      { id: "u7", name: "Rekencoördinator School A", avatar: null, initials: "RE" },
    ],
    memberships: [],
    leadSpaces: [],
    resourcesHosted: []
  }
};

function getOrgData(slug: string): OrgData {
  return ORG_DATA[slug] || {
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    initials: slug.substring(0, 2).toUpperCase(),
    avatarColor: "#64748b",
    tagline: "",
    bio: "",
    keywords: [],
    associates: [],
    memberships: [],
    leadSpaces: [],
    resourcesHosted: []
  };
}

type ProfileTab = "memberships" | "lead-spaces" | "resources";

export default function OrgProfilePage() {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const org = getOrgData(orgSlug || "");
  const [activeTab, setActiveTab] = useState<ProfileTab>("memberships");

  const tabs: { id: ProfileTab; label: string }[] = [
    { id: "memberships", label: "All Memberships" },
    { id: "lead-spaces", label: "Lead Spaces" },
    { id: "resources", label: "Resources Hosted" },
  ];

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="px-6 md:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-start-2 lg:col-span-10">
      {/* Header */}
      <div className="flex items-start gap-6 mb-8">
        <div
          className="w-24 h-24 rounded-xl flex items-center justify-center text-white text-hero shrink-0"
          style={{ backgroundColor: org.avatarColor }}
        >
          {org.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-page-title">{org.name}</h1>
              <p className="text-body text-muted-foreground mt-1">{org.tagline}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline">
                <UserPlus className="w-4 h-4 mr-2" /> Apply to join
              </Button>
              <Button variant="default">
                <Send className="w-4 h-4 mr-2" /> Message
              </Button>
              <IconButton tooltipLabel="Send Email" variant="outline" size="icon">
                <Mail className="w-4 h-4" />
              </IconButton>
              <Link to={`/organization/${orgSlug}/settings/profile`}>
                <IconButton tooltipLabel="Settings" variant="outline" size="icon">
                  <Settings className="w-4 h-4" />
                </IconButton>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left column — Bio + Keywords + Associates */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          {/* Bio */}
          <div>
            <h2 className="text-subsection-title font-semibold mb-2">Bio</h2>
            <p className="text-body text-muted-foreground">{org.bio}</p>
          </div>

          {/* Keywords */}
          {org.keywords.length > 0 && (
            <div>
              <h3 className="text-caption font-semibold uppercase tracking-wider text-muted-foreground mb-2">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {org.keywords.map((kw) => (
                  <Badge key={kw} variant="secondary" className="text-caption">{kw}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Associates */}
          <div>
            <h2 className="text-subsection-title font-semibold mb-3">{org.associates.length} associates</h2>
            <div className="grid grid-cols-4 gap-3">
              {org.associates.map((assoc) => (
                <div key={assoc.id} className="flex flex-col items-center gap-1.5">
                  <Avatar className="w-12 h-12 border">
                    {assoc.avatar ? <AvatarImage src={assoc.avatar} alt={assoc.name} /> : null}
                    <AvatarFallback className="text-caption">{assoc.initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-caption text-center text-muted-foreground truncate w-full">{assoc.name.split(" ")[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — Tabs */}
        <div className="flex-1 min-w-0">
          {/* Tab bar */}
          <div className="flex items-center gap-6 border-b mb-6">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  "pb-2.5 text-body font-medium transition-colors border-b-2 -mb-px",
                  activeTab === t.id
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="min-h-[200px]">
            {activeTab === "memberships" && (
              <p className="text-body text-muted-foreground">Not a member of any Space or Subspace yet.</p>
            )}
            {activeTab === "lead-spaces" && (
              <p className="text-body text-muted-foreground">Not leading any Spaces yet.</p>
            )}
            {activeTab === "resources" && (
              <p className="text-body text-muted-foreground">No resources hosted yet.</p>
            )}
          </div>
        </div>
      </div>
          </div>
        </div>
      </div>
    </div>
  );
}

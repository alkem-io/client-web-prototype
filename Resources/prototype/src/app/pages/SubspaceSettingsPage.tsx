import { useParams, Link, useLocation, Navigate } from "react-router";
import { SubspaceSettingsAbout } from "@/app/components/space/SubspaceSettingsAbout";
import { SubspaceSettingsLayout } from "@/app/components/space/SubspaceSettingsLayout";
import { SubspaceSettingsCommunity } from "@/app/components/space/SubspaceSettingsCommunity";
import { SubspaceSettingsUpdates } from "@/app/components/space/SubspaceSettingsUpdates";
import { SubspaceSettingsSubspaces } from "@/app/components/space/SubspaceSettingsSubspaces";
import { SubspaceSettingsSettings } from "@/app/components/space/SubspaceSettingsSettings";
import { Info, Layout, Users, Megaphone, Layers, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubspaceInfo {
  title: string;
  description: string;
  parentName: string;
  initials: string;
  avatarColor: string;
  avatarImage?: string;
  parentInitials: string;
  parentAvatarColor: string;
  memberCount: number;
}

const SUBSPACE_MAP: Record<string, SubspaceInfo> = {
  "renewable-energy-transition": {
    title: "Renewable Energy Transition",
    description: "Developing strategies for municipal energy transition to 100% renewables by 2030.",
    parentName: "Green Energy Space",
    initials: "RE",
    avatarColor: "#22c55e",
    avatarImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    parentInitials: "GE",
    parentAvatarColor: "#2563eb",
    memberCount: 24,
  },
  "urban-mobility-lab": {
    title: "Urban Mobility Lab",
    description: "Reimagining city transportation networks for better accessibility and reduced carbon footprint.",
    parentName: "Green Energy Space",
    initials: "UM",
    avatarColor: "#0891b2",
    avatarImage: "https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    parentInitials: "GE",
    parentAvatarColor: "#2563eb",
    memberCount: 18,
  },
  "green-infrastructure": {
    title: "Green Infrastructure",
    description: "Planning and implementation of urban green spaces, vertical gardens, and sustainable drainage.",
    parentName: "Green Energy Space",
    initials: "GI",
    avatarColor: "#16a34a",
    avatarImage: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    parentInitials: "GE",
    parentAvatarColor: "#2563eb",
    memberCount: 12,
  },
};

const DEFAULT_INFO: SubspaceInfo = {
  title: "Subspace",
  description: "A focused collaboration area.",
  parentName: "Space",
  initials: "SS",
  avatarColor: "#64748b",
  parentInitials: "SP",
  parentAvatarColor: "#475569",
  memberCount: 10,
};

export default function SubspaceSettingsPage() {
  const { spaceSlug, subspaceSlug, tab } = useParams<{
    spaceSlug: string;
    subspaceSlug: string;
    tab: string;
  }>();
  const location = useLocation();

  const info = (subspaceSlug && SUBSPACE_MAP[subspaceSlug]) || {
    ...DEFAULT_INFO,
    title: (subspaceSlug || "subspace")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  };

  // Redirect to 'about' if no tab
  if (!tab && location.pathname.endsWith("/settings")) {
    return (
      <Navigate
        to={`/space/${spaceSlug}/subspaces/${subspaceSlug}/settings/about`}
        replace
      />
    );
  }

  const tabs = [
    { label: "About", icon: Info, id: "about" },
    { label: "Layout", icon: Layout, id: "layout" },
    { label: "Community", icon: Users, id: "community" },
    { label: "Updates", icon: Megaphone, id: "updates" },
    { label: "Subspaces", icon: Layers, id: "subspaces" },
    { label: "Settings", icon: Settings, id: "settings" },
  ];

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Sticky header with title + tabs */}
      <div className="sticky top-16 z-20 bg-card">
        <div className="px-6 md:px-8 pt-8 pb-0">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-start-2 lg:col-span-10">
              <div className="flex items-center gap-4 mb-8">
                {info.avatarImage ? (
                  <div
                    className="w-12 h-12 rounded-full shrink-0 overflow-hidden"
                    style={{ border: "2px solid var(--border)" }}
                  >
                    <img src={info.avatarImage} alt={info.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-card-title font-bold shrink-0"
                    style={{ backgroundColor: info.avatarColor }}
                  >
                    {info.initials}
                  </div>
                )}
                <div>
                  <h1 className="text-page-title">{info.title}</h1>
                  <p className="text-muted-foreground text-body mt-0.5">{info.description}</p>
                </div>
              </div>

              <div className="flex items-end gap-0 overflow-x-auto no-scrollbar relative">
                {/* Bottom border line that runs the full width */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
                {tabs.map((item) => {
                  const isActive = tab === item.id;
                  return (
                    <Link
                      key={item.id}
                      to={`/space/${spaceSlug}/subspaces/${subspaceSlug}/settings/${item.id}`}
                      className={cn(
                        "relative flex items-center gap-2 px-4 py-2.5 transition-all duration-200 whitespace-nowrap select-none rounded-t-lg text-control",
                        isActive
                          ? "bg-background text-foreground font-semibold border border-border border-b-0 z-10 -mb-px"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="px-6 md:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-start-2 lg:col-span-10">
            <div>
              <div
                className="w-full min-h-[500px] p-6 md:p-8 shadow-sm"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
              >
                {tab === "about" ? (
                  <SubspaceSettingsAbout
                    subspaceName={info.title}
                    initials={info.initials}
                    avatarColor={info.avatarColor}
                    parentInitials={info.parentInitials}
                    parentAvatarColor={info.parentAvatarColor}
                    memberCount={info.memberCount}
                  />
                ) : tab === "layout" ? (
                  <SubspaceSettingsLayout />
                ) : tab === "community" ? (
                  <SubspaceSettingsCommunity />
                ) : tab === "updates" ? (
                  <SubspaceSettingsUpdates />
                ) : tab === "subspaces" ? (
                  <SubspaceSettingsSubspaces />
                ) : tab === "settings" ? (
                  <SubspaceSettingsSettings subspaceName={info.title} />
                ) : (
                  <div className="flex flex-col justify-center h-full min-h-[300px] space-y-4">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ background: "var(--muted)" }}
                    >
                      <div
                        className="w-8 h-8 rounded-md"
                        style={{
                          background:
                            "color-mix(in srgb, var(--muted-foreground) 20%, transparent)",
                        }}
                      />
                    </div>
                    <div>
                      <h2
                        className="capitalize text-section-title"
                        style={{ color: "var(--foreground)" }}
                      >
                        {tab}
                      </h2>
                      <p
                        className="text-body"
                        style={{
                          color: "var(--muted-foreground)",
                          marginTop: 4,
                        }}
                      >
                        This section is under construction.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

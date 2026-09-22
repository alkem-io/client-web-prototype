import { useParams, Link, useLocation, Navigate } from "react-router";
import { Building2, CreditCard, Users, Settings, Bell } from "lucide-react";
import { cn } from "@/crd/lib/utils";
import { OrgSettingsProfile } from "@/app/components/org/OrgSettingsProfile";
import { OrgSettingsAccount } from "@/app/components/org/OrgSettingsAccount";
import { OrgSettingsAssociates } from "@/app/components/org/OrgSettingsAssociates";
import { OrgSettingsSettings } from "@/app/components/org/OrgSettingsSettings";
import { OrgSettingsInvitations } from "@/app/components/org/OrgSettingsInvitations";

interface OrgData {
  name: string;
  initials: string;
  avatarColor: string;
  logo?: string;
}

const ORG_DATA: Record<string, OrgData> = {
  "sandbox-organization": {
    name: "Sandbox Organization",
    initials: "SO",
    avatarColor: "#0ea5e9",
    logo: undefined
  },
  "vng-innovation": {
    name: "VNG Innovation",
    initials: "VN",
    avatarColor: "#16a34a"
  }
};

function getOrgData(slug: string): OrgData {
  return ORG_DATA[slug] || {
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    initials: slug.substring(0, 2).toUpperCase(),
    avatarColor: "#64748b"
  };
}

export default function OrgSettingsPage() {
  const { orgSlug, tab } = useParams<{ orgSlug: string; tab: string }>();
  const location = useLocation();
  const org = orgSlug ? getOrgData(orgSlug) : getOrgData("");

  // Redirect to profile tab if no tab specified
  if (!tab && location.pathname.endsWith("/settings")) {
    return <Navigate to={`/organization/${orgSlug}/settings/profile`} replace />;
  }

  const tabs = [
    { label: "Profile", icon: Building2, id: "profile" },
    { label: "Account", icon: CreditCard, id: "account" },
    { label: "Associates", icon: Users, id: "associates" },
    { label: "Settings", icon: Settings, id: "settings" },
    { label: "Invitations", icon: Bell, id: "invitations" },
  ];

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Sticky header with org avatar + name + folder tabs */}
      <div className="sticky top-16 z-20 bg-card">
        <div className="px-6 md:px-8 pt-8 pb-0">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-start-2 lg:col-span-10">
              <div className="flex items-center gap-4 mb-8">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-card-title font-bold shrink-0"
                  style={{ backgroundColor: org.avatarColor }}
                >
                  {org.initials}
                </div>
                <div>
                  <h1 className="text-page-title">{org.name}</h1>
                </div>
              </div>

              <div className="flex items-end gap-0 overflow-x-auto no-scrollbar relative">
                {/* Bottom border line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
                {tabs.map((item) => {
                  const isActive = tab === item.id;
                  return (
                    <Link
                      key={item.id}
                      to={`/organization/${orgSlug}/settings/${item.id}`}
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
            <div className="w-full min-h-[500px]">
              {tab === "profile" ? (
                <OrgSettingsProfile org={org} />
              ) : tab === "account" ? (
                <OrgSettingsAccount />
              ) : tab === "associates" ? (
                <OrgSettingsAssociates />
              ) : tab === "settings" ? (
                <OrgSettingsSettings />
              ) : tab === "invitations" ? (
                <OrgSettingsInvitations />
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed rounded-xl bg-muted/5">
                  <p className="text-muted-foreground">Tab not found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

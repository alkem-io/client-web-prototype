import { useParams, Link, useLocation, Navigate } from "react-router";
import { User, CreditCard, Users, Bell, Settings, Shield, Building2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/crd/primitives/avatar";
import { cn } from "@/crd/lib/utils";
import { UserSettingsProfile } from "@/app/components/user/UserSettingsProfile";
import { UserSettingsSecurity } from "@/app/components/user/UserSettingsSecurity";
import { UserSettingsNotifications } from "@/app/components/user/UserSettingsNotifications";
import { UserSettingsGeneral } from "@/app/components/user/UserSettingsGeneral";
import { UserSettingsAccount } from "@/app/components/user/UserSettingsAccount";
import { UserSettingsMembership } from "@/app/components/user/UserSettingsMembership";
import { UserSettingsOrganizations } from "@/app/components/user/UserSettingsOrganizations";

export default function UserSettingsPage() {
  const { userSlug, tab } = useParams<{ userSlug: string; tab: string }>();
  const location = useLocation();
  const slug = userSlug || "user";

  // Redirect to profile tab if no tab specified
  if (!tab && location.pathname.endsWith("/settings")) {
    return <Navigate to={`/user/${slug}/settings/profile`} replace />;
  }

  const tabs = [
    { label: "Profile", icon: User, id: "profile" },
    { label: "Account", icon: CreditCard, id: "account" },
    { label: "Membership", icon: Users, id: "membership" },
    { label: "Organizations", icon: Building2, id: "organizations" },
    { label: "Notifications", icon: Bell, id: "notifications" },
    { label: "Settings", icon: Settings, id: "settings" },
    { label: "Security", icon: Shield, id: "security" },
  ];

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Sticky header with avatar + name + folder tabs */}
      <div className="sticky top-16 z-20 bg-card">
        <div className="px-6 md:px-8 pt-8 pb-0">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-start-2 lg:col-span-10">
              <div className="flex items-center gap-4 mb-8">
                <Avatar className="w-12 h-12 shrink-0">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Jeroen Nijkamp"
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-card-title font-bold">JN</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-page-title">Jeroen Nijkamp</h1>
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
                      to={`/user/${slug}/settings/${item.id}`}
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
                <UserSettingsProfile />
              ) : tab === "account" ? (
                <UserSettingsAccount />
              ) : tab === "membership" ? (
                <UserSettingsMembership />
              ) : tab === "organizations" ? (
                <UserSettingsOrganizations />
              ) : tab === "notifications" ? (
                <UserSettingsNotifications />
              ) : tab === "settings" ? (
                <UserSettingsGeneral />
              ) : tab === "security" ? (
                <UserSettingsSecurity />
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed rounded-xl bg-muted/5">
                  <p className="text-muted-foreground">Tab not found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

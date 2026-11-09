import { Bell, Bot, Briefcase, Cog, ShieldCheck, User, Users } from "lucide-react";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useParams } from "react-router";
import { UserAccountTab } from "@/app/components/user/settings/UserAccountTab";
import { DEMO_USER } from "@/app/components/user/settings/demoUser";
import { UserGeneralSettingsTab } from "@/app/components/user/settings/UserGeneralSettingsTab";
import { UserMembershipTab } from "@/app/components/user/settings/UserMembershipTab";
import { UserNotificationsTab } from "@/app/components/user/settings/UserNotificationsTab";
import { UserOrganizationsTab } from "@/app/components/user/settings/UserOrganizationsTab";
import { UserProfileTab } from "@/app/components/user/settings/UserProfileTab";
import { UserSecurityTab } from "@/app/components/user/settings/UserSecurityTab";
import { SettingsShell } from "@/crd/components/contributor/settings/SettingsShell";
import type { SettingsTabDescriptor } from "@/crd/components/contributor/settings/SettingsTabStrip";

type UserSettingsTabId =
  | "profile"
  | "account"
  | "membership"
  | "organizations"
  | "notifications"
  | "assistant"
  | "settings"
  | "security";

const TAB_BODIES: Partial<Record<UserSettingsTabId, ComponentType>> = {
  profile: UserProfileTab,
  account: UserAccountTab,
  membership: UserMembershipTab,
  organizations: UserOrganizationsTab,
  notifications: UserNotificationsTab,
  settings: UserGeneralSettingsTab,
  security: UserSecurityTab,
};

/** Production's settings shell and tabs, with demo state behind each tab. */
export default function UserSettingsPage() {
  const { t } = useTranslation("crd-contributorSettings");
  const { userSlug, tab } = useParams<{ userSlug: string; tab: string }>();
  const navigate = useNavigate();
  const slug = userSlug || "alex-rivera";

  const Body = TAB_BODIES[tab as UserSettingsTabId];
  if (!Body) return <Navigate to={`/user/${slug}/settings/profile`} replace />;

  const tabs: ReadonlyArray<SettingsTabDescriptor<UserSettingsTabId>> = [
    { id: "profile", label: t("shell.tabs.user.profile"), icon: User },
    { id: "account", label: t("shell.tabs.user.account"), icon: Briefcase },
    { id: "membership", label: t("shell.tabs.user.membership"), icon: Users },
    { id: "organizations", label: t("shell.tabs.user.organizations"), icon: Briefcase },
    { id: "notifications", label: t("shell.tabs.user.notifications"), icon: Bell },
    // Behind a feature flag in production, which ships off.
    { id: "assistant", label: t("shell.tabs.user.assistant"), icon: Bot, hidden: true },
    { id: "settings", label: t("shell.tabs.user.settings"), icon: Cog },
    { id: "security", label: t("shell.tabs.user.security"), icon: ShieldCheck },
  ];

  return (
    <SettingsShell
      header={{
        avatarUrl: DEMO_USER.avatarUrl,
        avatarFallback: "AR",
        avatarColor: DEMO_USER.avatarColor,
        displayName: DEMO_USER.displayName,
      }}
      tabs={tabs}
      activeTab={tab as UserSettingsTabId}
      onTabChange={(next) => navigate(`/user/${slug}/settings/${next}`)}
    >
      <Body />
    </SettingsShell>
  );
}

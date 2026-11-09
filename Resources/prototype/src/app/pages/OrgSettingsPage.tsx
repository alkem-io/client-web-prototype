import { Briefcase, Cog, Globe, Mail, Users } from "lucide-react";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useParams } from "react-router";
import { getDemoOrg } from "@/app/components/org/settings/demoOrg";
import { OrgAccountTab } from "@/app/components/org/settings/OrgAccountTab";
import { OrgAssociatesTab } from "@/app/components/org/settings/OrgAssociatesTab";
import { OrgGeneralSettingsTab } from "@/app/components/org/settings/OrgGeneralSettingsTab";
import { OrgInvitationsTab } from "@/app/components/org/settings/OrgInvitationsTab";
import { OrgMembershipTab } from "@/app/components/org/settings/OrgMembershipTab";
import { OrgProfileTab } from "@/app/components/org/settings/OrgProfileTab";
import { SettingsShell } from "@/crd/components/contributor/settings/SettingsShell";
import type { SettingsTabDescriptor } from "@/crd/components/contributor/settings/SettingsTabStrip";

type OrgSettingsTabId = "profile" | "account" | "associates" | "membership" | "invitations" | "settings";

const TAB_BODIES: Record<OrgSettingsTabId, ComponentType<{ orgSlug: string }>> = {
  profile: OrgProfileTab,
  account: OrgAccountTab,
  associates: OrgAssociatesTab,
  membership: OrgMembershipTab,
  invitations: OrgInvitationsTab,
  settings: OrgGeneralSettingsTab,
};

/** Production's settings shell and tabs, with demo state behind each tab. */
export default function OrgSettingsPage() {
  const { t } = useTranslation("crd-contributorSettings");
  const { orgSlug = "organization", tab } = useParams<{ orgSlug: string; tab: string }>();
  const navigate = useNavigate();
  const org = getDemoOrg(orgSlug);

  const Body = TAB_BODIES[tab as OrgSettingsTabId];
  if (!Body) return <Navigate to={`/organization/${orgSlug}/settings/profile`} replace />;

  const tabs: ReadonlyArray<SettingsTabDescriptor<OrgSettingsTabId>> = [
    { id: "profile", label: t("shell.tabs.org.profile"), icon: Briefcase },
    { id: "account", label: t("shell.tabs.org.account"), icon: Briefcase },
    { id: "associates", label: t("shell.tabs.org.associates"), icon: Users },
    { id: "membership", label: t("shell.tabs.org.membership"), icon: Globe },
    { id: "invitations", label: t("shell.tabs.org.invitations"), icon: Mail },
    { id: "settings", label: t("shell.tabs.org.settings"), icon: Cog },
  ];

  return (
    <SettingsShell
      header={{ avatarFallback: org.initials, avatarColor: org.color, displayName: org.displayName }}
      tabs={tabs}
      activeTab={tab as OrgSettingsTabId}
      onTabChange={(next) => navigate(`/organization/${orgSlug}/settings/${next}`)}
    >
      <Body orgSlug={orgSlug} />
    </SettingsShell>
  );
}

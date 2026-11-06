import { useState } from "react";
import { demoDelay, useDemoState } from "@/app/components/shared/useDemoState";
import { OrgSettingsTabView } from "@/crd/components/organization/settings/OrgSettingsTabView";

const SEED = {
  allowSpaceInvitations: true,
  allowUsersMatchingDomainToJoin: true,
  allowApplications: true,
  contributionRolesPubliclyVisible: true,
};

type Setting = keyof typeof SEED;

export function OrgGeneralSettingsTab({ orgSlug }: { orgSlug: string }) {
  const [settings, setSettings] = useDemoState(`org.${orgSlug}.settings`, SEED);
  const [saving, setSaving] = useState<Setting | null>(null);

  const toggle = (setting: Setting) => (next: boolean) => {
    setSaving(setting);
    demoDelay(() => {
      setSettings((previous) => ({ ...previous, [setting]: next }));
      setSaving(null);
    });
  };

  return (
    <OrgSettingsTabView
      loading={false}
      allowSpaceInvitations={settings.allowSpaceInvitations}
      allowSpaceInvitationsSaving={saving === "allowSpaceInvitations"}
      onToggleAllowSpaceInvitations={toggle("allowSpaceInvitations")}
      allowUsersMatchingDomainToJoin={settings.allowUsersMatchingDomainToJoin}
      allowUsersMatchingDomainToJoinSaving={saving === "allowUsersMatchingDomainToJoin"}
      onToggleAllowUsersMatchingDomainToJoin={toggle("allowUsersMatchingDomainToJoin")}
      allowApplications={settings.allowApplications}
      allowApplicationsSaving={saving === "allowApplications"}
      onToggleAllowApplications={toggle("allowApplications")}
      contributionRolesPubliclyVisible={settings.contributionRolesPubliclyVisible}
      privacySaving={saving === "contributionRolesPubliclyVisible"}
      onToggleContributionRoles={toggle("contributionRolesPubliclyVisible")}
    />
  );
}

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDemoMemberships } from "@/app/components/shared/useDemoMemberships";
import { demoDelay, useDemoState } from "@/app/components/shared/useDemoState";
import { ConfirmationDialog } from "@/crd/components/dialogs/ConfirmationDialog";
import { UserMembershipTabView } from "@/crd/components/user/settings/UserMembershipTabView";
import { DEMO_PENDING_APPLICATIONS, DEMO_USER_MEMBERSHIPS } from "./demoUser";

export function UserMembershipTab() {
  const { t } = useTranslation("crd-contributorSettings");
  const memberships = useDemoMemberships(
    "user.memberships",
    DEMO_USER_MEMBERSHIPS,
    t("user.membership.leave.success")
  );
  const [home, setHome] = useDemoState<{ spaceId: string | null; autoRedirect: boolean }>("user.homeSpace", {
    spaceId: DEMO_USER_MEMBERSHIPS[0]?.id ?? null,
    autoRedirect: false,
  });
  const [saving, setSaving] = useState(false);

  const saveHome = (next: Partial<typeof home>) => {
    setHome({ ...home, ...next });
    setSaving(true);
    demoDelay(() => setSaving(false));
  };

  return (
    <>
      <UserMembershipTabView
        loading={false}
        homeSpaceOptions={memberships.rows
          .filter((row) => row.type === "Space")
          .map((row) => ({ value: row.id, label: row.displayName }))}
        selectedHomeSpaceId={home.spaceId}
        autoRedirect={home.autoRedirect}
        homeSpaceSaving={saving}
        onSelectHomeSpace={(spaceId) => saveHome({ spaceId })}
        onToggleAutoRedirect={(autoRedirect) => saveHome({ autoRedirect })}
        memberships={memberships.visible}
        totalMemberships={memberships.visible.length}
        totalUnfiltered={memberships.rows.length}
        search={memberships.search}
        filter={memberships.filter}
        onSearchChange={memberships.onSearchChange}
        onFilterChange={memberships.onFilterChange}
        onClearFilters={memberships.onClearFilters}
        onLeave={memberships.onRequestLeave}
        pendingApplications={DEMO_PENDING_APPLICATIONS}
      />
      <ConfirmationDialog
        open={Boolean(memberships.pendingLeave)}
        onOpenChange={(open) => !open && !memberships.leaving && memberships.onCancelLeave()}
        variant="destructive"
        title={t("user.membership.leave.dialogTitle")}
        description={t("user.membership.leave.dialogDescription", {
          spaceName: memberships.pendingLeave?.displayName ?? "",
        })}
        confirmLabel={t("user.membership.leave.dialogConfirm")}
        loading={memberships.leaving}
        onConfirm={(event) => {
          event.preventDefault();
          memberships.onConfirmLeave();
        }}
        onCancel={memberships.onCancelLeave}
      />
    </>
  );
}

import { useTranslation } from "react-i18next";
import { useDemoMemberships } from "@/app/components/shared/useDemoMemberships";
import { ConfirmationDialog } from "@/crd/components/dialogs/ConfirmationDialog";
import { OrgMembershipTabView } from "@/crd/components/organization/settings/OrgMembershipTabView";
import { DEMO_ORG_MEMBERSHIPS } from "./demoOrg";

export function OrgMembershipTab({ orgSlug }: { orgSlug: string }) {
  const { t } = useTranslation("crd-contributorSettings");
  const memberships = useDemoMemberships(
    `org.${orgSlug}.memberships`,
    DEMO_ORG_MEMBERSHIPS,
    t("org.membership.leave.success")
  );

  return (
    <>
      <OrgMembershipTabView
        loading={false}
        title={t("org.membership.title")}
        rows={memberships.visible}
        totalShown={memberships.visible.length}
        totalUnfiltered={memberships.rows.length}
        search={memberships.search}
        filter={memberships.filter}
        onSearchChange={memberships.onSearchChange}
        onFilterChange={memberships.onFilterChange}
        onClearFilters={memberships.onClearFilters}
        onLeave={memberships.onRequestLeave}
        labels={{
          searchPlaceholder: t("org.membership.searchPlaceholder"),
          filterAll: t("org.membership.filter.all"),
          filterSpaces: t("org.membership.filter.spaces"),
          filterSubspaces: t("org.membership.filter.subspaces"),
          summary: (shown, total) => t("org.membership.summary", { shown, total }),
          filteredEmptyTitle: t("org.membership.filteredEmptyTitle"),
          filteredEmptyDescription: t("org.membership.filteredEmptyDescription"),
          clearFilters: t("org.membership.clearFilters"),
          emptyCaption: t("org.membership.empty"),
          roleLabel: (role) => (role === "Lead" ? t("org.membership.role.lead") : t("org.membership.role.member")),
          leave: t("org.membership.leave.button"),
          leaveAriaLabel: (name) => t("org.membership.leave.buttonAria", { name }),
          ledBy: t("org.membership.ledBy"),
          ledByAria: (count) => t("org.membership.ledByAria", { count }),
          leadsMore: (count) => t("org.membership.leadsMore", { count }),
        }}
      />
      <ConfirmationDialog
        open={Boolean(memberships.pendingLeave)}
        onOpenChange={(open) => !open && !memberships.leaving && memberships.onCancelLeave()}
        variant="destructive"
        title={t("org.membership.leave.dialogTitle")}
        description={t("org.membership.leave.dialogDescription", {
          spaceName: memberships.pendingLeave?.displayName ?? "",
        })}
        confirmLabel={t("org.membership.leave.dialogConfirm")}
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

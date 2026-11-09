import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { demoDelay, useDemoState } from "@/app/components/shared/useDemoState";
import { OrgInvitationsTabView } from "@/crd/components/organization/settings/OrgInvitationsTabView";
import { resolveDateFnsLocale } from "@/crd/lib/dateFnsLocale";
import { formatShortDate } from "@/crd/lib/dateTimeFormat";
import { DEMO_ORG_INVITATIONS } from "./demoOrg";

export function OrgInvitationsTab({ orgSlug }: { orgSlug: string }) {
  const { t, i18n } = useTranslation("crd-contributorSettings");
  const locale = resolveDateFnsLocale(i18n.language);
  const [invitations, setInvitations] = useDemoState(`org.${orgSlug}.invitations`, DEMO_ORG_INVITATIONS);
  const [pendingAccept, setPendingAccept] = useState<string | null>(null);
  const [pendingDecline, setPendingDecline] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const roleLabel = (role: "member" | "memberLead") =>
    role === "memberLead" ? t("org.invitations.roleMemberLead") : t("org.invitations.roleMember");
  const accepting = invitations.find((row) => row.id === pendingAccept);
  const declining = invitations.find((row) => row.id === pendingDecline);

  const resolve = (id: string | null, message: string) => {
    setPendingAccept(null);
    setPendingDecline(null);
    setBusy(true);
    demoDelay(() => {
      setInvitations((previous) => previous.filter((row) => row.id !== id));
      setBusy(false);
      toast.success(message);
    });
  };

  return (
    <OrgInvitationsTabView
      loading={false}
      title={t("org.invitations.title")}
      rows={invitations.map((row) => ({
        id: row.id,
        spaceDisplayName: row.spaceDisplayName,
        spaceUrl: row.spaceUrl,
        invitedByText: t("org.invitations.invitedBy", { name: row.invitedBy }),
        dateText: formatShortDate(row.createdDate, locale) ?? "",
        roleLabel: roleLabel(row.role),
        welcomeMessage: row.welcomeMessage,
        spacesToJoinText:
          row.spacesToJoin.length > 1
            ? t("org.invitations.spacesToJoin", { spaces: row.spacesToJoin.join(", ") })
            : undefined,
        canAct: true,
      }))}
      emptyLabel={t("org.invitations.empty")}
      acceptLabel={t("org.invitations.accept")}
      declineLabel={t("org.invitations.decline")}
      onAccept={setPendingAccept}
      onDecline={setPendingDecline}
      busy={busy}
      acceptConfirm={{
        open: Boolean(pendingAccept),
        title: t("org.invitations.acceptConfirmTitle"),
        body: t("org.invitations.acceptConfirmBody", {
          spaceName: accepting?.spaceDisplayName ?? "",
          role: accepting ? roleLabel(accepting.role) : "",
        }),
        confirmLabel: t("org.invitations.acceptConfirmAction"),
        onConfirm: () => resolve(pendingAccept, `${accepting?.spaceDisplayName ?? "Invitation"} accepted`),
        onCancel: () => setPendingAccept(null),
      }}
      declineConfirm={{
        open: Boolean(pendingDecline),
        title: t("org.invitations.declineConfirmTitle"),
        body: t("org.invitations.declineConfirmBody", { spaceName: declining?.spaceDisplayName ?? "" }),
        confirmLabel: t("org.invitations.declineConfirmAction"),
        onConfirm: () => resolve(pendingDecline, `${declining?.spaceDisplayName ?? "Invitation"} declined`),
        onCancel: () => setPendingDecline(null),
      }}
    />
  );
}

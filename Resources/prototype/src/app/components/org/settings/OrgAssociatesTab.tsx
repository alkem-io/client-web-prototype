import { Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { demoDelay, useDemoState } from "@/app/components/shared/useDemoState";
import { ConfirmationDialog } from "@/crd/components/dialogs/ConfirmationDialog";
import { OrgAssociateSettingsDialog } from "@/crd/components/organization/settings/OrgAssociateSettingsDialog";
import {
  type OrgAssociateListRow,
  OrgAssociatesTabView,
} from "@/crd/components/organization/settings/OrgAssociatesTabView";
import { MembershipDetailDialog } from "@/crd/components/space/settings/MembershipDetailDialog";
import type { PendingMembership } from "@/crd/components/space/settings/PendingMembershipsTable";
import { pickColorFromId } from "@/crd/lib/pickColorFromId";
import { Input } from "@/crd/primitives/input";
import { DEMO_ASSOCIATES, DEMO_PENDING, getDemoOrg } from "./demoOrg";
import { OrgInviteAssociatesDialog } from "./OrgInviteAssociatesDialog";

const MAX_ADMINS = 6;
const MAX_OWNERS = 3;

export function OrgAssociatesTab({ orgSlug }: { orgSlug: string }) {
  const { t } = useTranslation("crd-contributorSettings");
  const organizationName = getDemoOrg(orgSlug).displayName;
  const [associates, setAssociates] = useDemoState<OrgAssociateListRow[]>(`org.${orgSlug}.associates`, DEMO_ASSOCIATES);
  const [pending, setPending] = useDemoState<PendingMembership[]>(`org.${orgSlug}.pending`, DEMO_PENDING);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [roleError, setRoleError] = useState<string | undefined>();
  const [removing, setRemoving] = useState<OrgAssociateListRow | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [viewing, setViewing] = useState<PendingMembership | null>(null);
  const [resendingIds, setResendingIds] = useState<ReadonlySet<string>>(new Set());

  const term = search.trim().toLowerCase();
  const visible = associates.filter(
    (row) => row.displayName.toLowerCase().includes(term) || row.subtitle?.toLowerCase().includes(term)
  );
  const editing = associates.find((row) => row.id === editingId) ?? null;

  const removePending = (id: string) => setPending((previous) => previous.filter((row) => row.id !== id));

  const approve = (id: string) => {
    const row = pending.find((other) => other.id === id);
    if (!row) return;
    setAssociates((previous) => [
      ...previous,
      {
        id: row.id,
        displayName: row.displayName,
        avatarUrl: row.avatarUrl,
        subtitle: row.email,
        color: pickColorFromId(row.id),
        isAssociate: true,
        isAdmin: false,
        isOwner: false,
      },
    ]);
    removePending(id);
  };

  const saveRoles = (next: { isAssociate: boolean; isAdmin: boolean; isOwner: boolean }) => {
    if (!editing) return;
    const others = associates.filter((row) => row.id !== editing.id);
    if (!next.isOwner && editing.isOwner && !others.some((row) => row.isOwner)) {
      setRoleError(t("org.associates.errors.minOwner"));
      return;
    }
    if (next.isOwner && others.filter((row) => row.isOwner).length >= MAX_OWNERS) {
      setRoleError(t("org.associates.errors.limitOwner"));
      return;
    }
    if (next.isAdmin && others.filter((row) => row.isAdmin).length >= MAX_ADMINS) {
      setRoleError(t("org.associates.errors.limitAdmin"));
      return;
    }
    setRoleError(undefined);
    setSaving(true);
    demoDelay(() => {
      setAssociates((previous) => previous.map((row) => (row.id === editing.id ? { ...row, ...next } : row)));
      setSaving(false);
      setEditingId(null);
    });
  };

  return (
    <div className="space-y-4">
      {/* Ours: production's list has no search. */}
      <div className="relative max-w-sm">
        <Search
          aria-hidden="true"
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          aria-label="Search associates"
          placeholder="Search associates..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-9"
        />
      </div>

      <OrgAssociatesTabView
        associates={visible}
        loading={false}
        canManage={true}
        canInvite={true}
        onEdit={setEditingId}
        onInvite={() => setInviteOpen(true)}
        pending={pending}
        onPendingApprove={approve}
        onPendingReject={removePending}
        onPendingRevoke={removePending}
        onPendingResend={(id) => {
          setResendingIds((previous) => new Set(previous).add(id));
          demoDelay(() => {
            setResendingIds((previous) => {
              const next = new Set(previous);
              next.delete(id);
              return next;
            });
            toast.success("Invitation sent again");
          }, 800);
        }}
        resendingIds={resendingIds}
        onPendingView={(id) => setViewing(pending.find((row) => row.id === id) ?? null)}
      />

      <OrgAssociateSettingsDialog
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingId(null);
            setRoleError(undefined);
          }
        }}
        subject={editing}
        saving={saving}
        errorMessage={roleError}
        onSave={saveRoles}
        onRemove={() => {
          setRemoving(editing);
          setEditingId(null);
        }}
      />

      <ConfirmationDialog
        open={Boolean(removing)}
        onOpenChange={(open) => !open && setRemoving(null)}
        variant="destructive"
        title={t("org.associates.editor.removeConfirmTitle", { name: removing?.displayName ?? "" })}
        description={t("org.associates.editor.removeConfirmBody", { name: removing?.displayName ?? "" })}
        confirmLabel={t("org.associates.editor.remove")}
        onConfirm={() => {
          setAssociates((previous) => previous.filter((row) => row.id !== removing?.id));
          toast.success(t("org.associates.editor.removeSuccess", { name: removing?.displayName ?? "" }));
          setRemoving(null);
        }}
        onCancel={() => setRemoving(null)}
      />

      {viewing ? (
        <MembershipDetailDialog
          open={true}
          onOpenChange={(open) => !open && setViewing(null)}
          kind={viewing.type === "application" ? "application" : "invitation"}
          loading={false}
          displayName={viewing.displayName}
          email={viewing.email}
          avatarColor={pickColorFromId(viewing.id)}
          createdDate={viewing.createdDate}
          offeredRoleLabel={viewing.offeredRoleLabel}
          questions={[]}
          welcomeMessage={`Hi, we would like to invite you to associate with ${organizationName}.`}
        />
      ) : null}

      <OrgInviteAssociatesDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        organizationName={organizationName}
        existingNames={associates.map((row) => row.displayName)}
        onSent={(invitees, extraRoles) =>
          setPending((previous) => [
            ...previous,
            ...invitees.map((invitee, index): PendingMembership => {
              const isEmail = invitee.kind === "email";
              return {
                id: `invite-${Date.now()}-${index}`,
                type: isEmail ? "platformInvitation" : "invitation",
                state: "invited",
                contributorType: "user",
                displayName: invitee.kind === "email" ? invitee.email : invitee.displayName,
                email: invitee.kind === "email" ? invitee.email : undefined,
                createdDate: new Date().toISOString(),
                canApprove: false,
                canReject: false,
                canDelete: true,
                canResend: isEmail,
                offeredRoleLabel: extraRoles.join(" + "),
              };
            }),
          ])
        }
      />
    </div>
  );
}

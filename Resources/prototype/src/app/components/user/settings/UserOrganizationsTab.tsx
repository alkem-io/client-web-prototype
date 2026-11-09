import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { DEMO_CITIES, DEMO_COUNTRIES } from "@/app/components/shared/demoLocations";
import { useDemoState } from "@/app/components/shared/useDemoState";
import { OrganizationForm, type OrgFormValues } from "@/crd/components/admin/organizations/OrganizationForm";
import { ConfirmationDialog } from "@/crd/components/dialogs/ConfirmationDialog";
import { type OrgRowData, UserOrganizationsTabView } from "@/crd/components/user/settings/UserOrganizationsTabView";
import { pickColorFromId } from "@/crd/lib/pickColorFromId";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/crd/primitives/dialog";
import { DEMO_USER_ORGANIZATIONS } from "./demoUser";

const EMPTY_ORG: OrgFormValues = {
  nameID: "",
  displayName: "",
  contactEmail: "",
  domain: "",
  legalEntityName: "",
  website: "",
  tagline: "",
  description: "",
  city: "",
  country: "",
  references: [],
};

export function UserOrganizationsTab() {
  const { t } = useTranslation("crd-contributorSettings");
  const [rows, setRows] = useDemoState<OrgRowData[]>("user.organizations", DEMO_USER_ORGANIZATIONS);
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState<OrgRowData | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [draft, setDraft] = useState(EMPTY_ORG);

  const term = search.trim().toLowerCase();
  const visible = rows.filter(
    (row) => row.displayName.toLowerCase().includes(term) || row.location?.toLowerCase().includes(term)
  );

  return (
    <>
      <UserOrganizationsTabView
        loading={false}
        rows={visible}
        totalShown={visible.length}
        totalUnfiltered={rows.length}
        search={search}
        onSearchChange={setSearch}
        onClearFilters={() => setSearch("")}
        showCreateButton={true}
        onCreateOrganization={() => setCreateOpen(true)}
        onDisassociate={setPending}
      />

      <ConfirmationDialog
        open={Boolean(pending)}
        onOpenChange={(open) => !open && setPending(null)}
        variant="destructive"
        title={t("user.organizations.disassociate.dialogTitle")}
        description={t("user.organizations.disassociate.dialogDescription", { name: pending?.displayName ?? "" })}
        confirmLabel={t("user.organizations.disassociate.dialogConfirm")}
        onConfirm={() => {
          setRows((previous) => previous.filter((row) => row.id !== pending?.id));
          setPending(null);
          toast.success(t("user.organizations.disassociate.success"));
        }}
        onCancel={() => setPending(null)}
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("user.organizations.newOrganization")}</DialogTitle>
            <DialogDescription>{t("user.organizations.createDescription")}</DialogDescription>
          </DialogHeader>
          <OrganizationForm
            mode="create"
            values={draft}
            onChange={(patch) => setDraft((previous) => ({ ...previous, ...patch }))}
            onReferencesChange={(references) => setDraft((previous) => ({ ...previous, references }))}
            countries={DEMO_COUNTRIES}
            cityOptions={DEMO_CITIES}
            onCancel={() => setCreateOpen(false)}
            onSubmit={() => {
              const id = `org-${Date.now()}`;
              setRows((previous) => [
                ...previous,
                {
                  id,
                  displayName: draft.displayName,
                  location: [draft.city, draft.country].filter(Boolean).join(", ") || undefined,
                  color: pickColorFromId(id),
                  role: "Admin",
                  verified: false,
                  profileUrl: `/organization/${draft.nameID}`,
                  associatesCount: 1,
                },
              ]);
              setDraft(EMPTY_ORG);
              setCreateOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

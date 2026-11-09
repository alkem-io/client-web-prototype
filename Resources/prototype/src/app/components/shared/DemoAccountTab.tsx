import { Settings, Trash2 } from "lucide-react";
import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { CreateSpaceDialogV3 } from "@/app/components/dialogs/CreateSpaceDialogV3";
import { ContributorAccountView } from "@/crd/components/contributor/settings/ContributorAccountView";
import type {
  AccountResourceGroup,
  AccountResourceGroupId,
} from "@/crd/components/contributor/settings/ContributorAccountView.types";
import { ConfirmationDialog } from "@/crd/components/dialogs/ConfirmationDialog";
import { CreateInnovationHubDialog } from "@/crd/components/innovationHub/CreateInnovationHubDialog";
import type { CreateInnovationHubValues } from "@/crd/components/innovationHub/createInnovationHub.types";
import { CreateInnovationPackDialog } from "@/crd/components/innovationPack/CreateInnovationPackDialog";
import { pickColorFromId } from "@/crd/lib/pickColorFromId";
import { demoUpload } from "./demoLocations";
import { demoDelay, type LooseT, useDemoState } from "./useDemoState";

export type DemoAccountItem = {
  id: string;
  displayName: string;
  description?: string;
  avatarUrl?: string;
  href: string;
};

export type DemoAccountResources = Record<AccountResourceGroupId, DemoAccountItem[]>;

const LIMITS: Record<AccountResourceGroupId, number> = {
  spaces: 5,
  virtualContributors: 3,
  innovationPacks: 3,
  innovationHubs: 2,
};

const GROUP_IDS = Object.keys(LIMITS) as AccountResourceGroupId[];
const EMPTY_PACK = { name: "", description: "" };
const EMPTY_HUB: CreateInnovationHubValues = { subdomain: "", name: "", tagline: "", description: "" };

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

type DemoAccountTabProps = {
  scope: "user" | "org";
  stateKey: string;
  seed: DemoAccountResources;
  /** Shown in the create dialogs; left out for a person's own account. */
  accountName?: string;
  /** Rendered under the resource groups, with what the account currently holds. */
  children?: (resources: DemoAccountResources) => ReactNode;
};

/**
 * The Account tab of both a person and an organisation: production's view, the
 * create dialogs behind its tiles, and the delete and no-entitlement confirmations.
 */
export function DemoAccountTab({ scope, stateKey, seed, accountName, children }: DemoAccountTabProps) {
  const { t: typedT } = useTranslation("crd-contributorSettings");
  const t = typedT as unknown as LooseT;
  const navigate = useNavigate();
  const [resources, setResources] = useDemoState(stateKey, seed);
  const [pendingDelete, setPendingDelete] = useState<{ groupId: AccountResourceGroupId; item: DemoAccountItem } | null>(
    null
  );
  const [noEntitlementFor, setNoEntitlementFor] = useState<AccountResourceGroupId | null>(null);
  const [createSpaceOpen, setCreateSpaceOpen] = useState(false);
  const [createPackOpen, setCreatePackOpen] = useState(false);
  const [createHubOpen, setCreateHubOpen] = useState(false);
  const [pack, setPack] = useState(EMPTY_PACK);
  const [hub, setHub] = useState(EMPTY_HUB);
  const [creating, setCreating] = useState(false);

  const add = (groupId: AccountResourceGroupId, item: DemoAccountItem) =>
    setResources((previous) => ({ ...previous, [groupId]: [...previous[groupId], item] }));

  const openers: Partial<Record<AccountResourceGroupId, () => void>> = {
    spaces: () => setCreateSpaceOpen(true),
    innovationPacks: () => setCreatePackOpen(true),
    innovationHubs: () => setCreateHubOpen(true),
  };

  const groups: AccountResourceGroup[] = GROUP_IDS.map((groupId) => {
    const usage = resources[groupId].length;
    const limit = LIMITS[groupId];
    const isVirtualContributors = groupId === "virtualContributors";
    return {
      groupId,
      title: t(`${scope}.account.${groupId}.title`),
      // Production has paused creating Virtual Contributors for now, and shows a notice instead.
      canCreate: !isVirtualContributors,
      createPaused: isVirtualContributors,
      isEntitled: usage < limit,
      onCreate: () => (usage < limit ? openers[groupId]?.() : setNoEntitlementFor(groupId)),
      capacity: {
        usage,
        limit,
        isAvailable: true,
        perPlan:
          groupId === "spaces"
            ? {
                free: { usage: Math.min(usage, 3), limit: 3 },
                plus: { usage: Math.min(Math.max(usage - 3, 0), 1), limit: 1 },
                premium: { usage: Math.max(usage - 4, 0), limit: 1 },
              }
            : undefined,
      },
      items: resources[groupId].map((item) => ({
        ...item,
        color: pickColorFromId(item.id),
        actions: [
          {
            kind: "manage" as const,
            label: t(`${scope}.account.actions.manage`),
            icon: Settings,
            onClick: () => navigate(isVirtualContributors ? item.href : `${item.href}/settings`),
          },
          {
            kind: "delete" as const,
            label: t(`${scope}.account.actions.delete`),
            icon: Trash2,
            onClick: () => setPendingDelete({ groupId, item }),
          },
        ],
      })),
    };
  });

  const finishCreating = (run: () => void) => {
    setCreating(true);
    demoDelay(() => {
      run();
      setCreating(false);
    });
  };

  return (
    <>
      <div className="space-y-6">
        <ContributorAccountView groups={groups} loading={false} />
        {children?.(resources)}
      </div>

      <ConfirmationDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        variant="destructive"
        title={t("user.account.deleteDialog.title")}
        description={t("user.account.deleteDialog.description", { name: pendingDelete?.item.displayName ?? "" })}
        confirmLabel={t("user.account.deleteDialog.confirm")}
        onConfirm={() => {
          if (pendingDelete) {
            const { groupId, item } = pendingDelete;
            setResources((previous) => ({
              ...previous,
              [groupId]: previous[groupId].filter((other) => other.id !== item.id),
            }));
          }
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />

      <ConfirmationDialog
        open={Boolean(noEntitlementFor)}
        onOpenChange={(open) => !open && setNoEntitlementFor(null)}
        title={t("shared.account.noEntitlement.title")}
        description={t(`shared.account.noEntitlement.description.${noEntitlementFor ?? "spaces"}`)}
        confirmLabel={t("shared.account.noEntitlement.contactCta")}
        cancelLabel={t("shared.account.noEntitlement.cancel")}
        onConfirm={() => setNoEntitlementFor(null)}
        onCancel={() => setNoEntitlementFor(null)}
      />

      <CreateSpaceDialogV3 open={createSpaceOpen} onOpenChange={setCreateSpaceOpen} />

      <CreateInnovationPackDialog
        open={createPackOpen}
        onClose={() => setCreatePackOpen(false)}
        value={pack}
        errors={{}}
        onChange={setPack}
        creating={creating}
        canSubmit={pack.name.trim() !== "" && pack.description.trim() !== ""}
        accountName={accountName}
        onImageUpload={demoUpload}
        onCreate={() =>
          finishCreating(() => {
            const slug = slugify(pack.name);
            add("innovationPacks", {
              id: `pack-${slug}-${Date.now()}`,
              displayName: pack.name,
              href: `/templates/packs/${slug}`,
            });
            setPack(EMPTY_PACK);
            setCreatePackOpen(false);
            toast.success(`${pack.name} created`);
          })
        }
      />

      <CreateInnovationHubDialog
        open={createHubOpen}
        onClose={() => setCreateHubOpen(false)}
        value={hub}
        errors={{}}
        onChange={setHub}
        creating={creating}
        canSubmit={hub.subdomain.trim() !== "" && hub.name.trim() !== "" && hub.description.trim() !== ""}
        accountName={accountName}
        onImageUpload={demoUpload}
        onCreate={() =>
          finishCreating(() => {
            add("innovationHubs", {
              id: `hub-${hub.subdomain}-${Date.now()}`,
              displayName: hub.name,
              description: hub.tagline,
              href: `/innovation-hub/${slugify(hub.subdomain)}`,
            });
            setHub(EMPTY_HUB);
            setCreateHubOpen(false);
            toast.success(`${hub.name} created`);
          })
        }
      />
    </>
  );
}

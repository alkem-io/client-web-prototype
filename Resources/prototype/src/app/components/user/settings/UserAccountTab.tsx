import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { type DemoAccountResources, DemoAccountTab } from "@/app/components/shared/DemoAccountTab";
import { demoDelay } from "@/app/components/shared/useDemoState";
import { SettingsSection } from "@/crd/components/common/SettingsSection";
import type { DeleteAccountBlocker, DeleteAccountDialogState } from "@/crd/components/user/settings/DeleteAccount.types";
import { DeleteAccountCard } from "@/crd/components/user/settings/DeleteAccountCard";
import { DEMO_USER, DEMO_USER_ACCOUNT } from "./demoUser";

const BLOCKER_KIND = {
  spaces: "ACCOUNT_SPACE",
  virtualContributors: "ACCOUNT_VIRTUAL_CONTRIBUTOR",
  innovationPacks: "ACCOUNT_INNOVATION_PACK",
  innovationHubs: "ACCOUNT_INNOVATION_HUB",
} as const;

/**
 * Production's Danger Zone. As in production, an account that still holds anything
 * cannot be deleted: the check lists what is in the way, and only an emptied account
 * reaches the typed-name confirmation.
 */
function DemoDangerZone({ resources }: { resources: DemoAccountResources }) {
  const { t } = useTranslation("crd-contributorSettings");
  const [dialog, setDialog] = useState<DeleteAccountDialogState>({ kind: "closed" });
  const close = () => setDialog({ kind: "closed" });

  const onOpen = () => {
    setDialog({ kind: "preflight-loading" });
    demoDelay(() => {
      const blockers: DeleteAccountBlocker[] = (Object.keys(BLOCKER_KIND) as Array<keyof typeof BLOCKER_KIND>).flatMap(
        (groupId) =>
          resources[groupId].map((item) => ({
            kind: BLOCKER_KIND[groupId],
            resourceID: item.id,
            displayName: item.displayName,
            url: item.href,
            selfResolvable: true,
          }))
      );
      setDialog(
        blockers.length > 0
          ? {
              kind: "blocked",
              blockers,
              totals: Object.values(BLOCKER_KIND).map((kind) => ({
                kind,
                total: blockers.filter((blocker) => blocker.kind === kind).length,
              })),
              truncated: false,
            }
          : { kind: "confirm", typedName: "", deleting: false, error: false, externalSubscriptionLinked: false }
      );
    });
  };

  return (
    <SettingsSection
      title={t("user.account.dangerZone.title")}
      icon={<AlertTriangle className="size-4" />}
      iconColor="rose"
      defaultOpen={false}
    >
      <DeleteAccountCard
        displayName={DEMO_USER.displayName}
        dialog={dialog}
        onOpen={onOpen}
        onTypedNameChange={(typedName) =>
          setDialog((current) => (current.kind === "confirm" ? { ...current, typedName } : current))
        }
        onConfirm={() => {
          setDialog((current) => (current.kind === "confirm" ? { ...current, deleting: true } : current));
          demoDelay(() => {
            close();
            toast("In the real product this deletes the account and signs you out.");
          });
        }}
        onCancel={close}
        onDialogOpenChange={(open) => !open && close()}
        accountResourcesUrl="/user/alex-rivera/settings/account"
      />
    </SettingsSection>
  );
}

export function UserAccountTab() {
  return (
    <DemoAccountTab scope="user" stateKey="user.account" seed={DEMO_USER_ACCOUNT}>
      {(resources) => <DemoDangerZone resources={resources} />}
    </DemoAccountTab>
  );
}

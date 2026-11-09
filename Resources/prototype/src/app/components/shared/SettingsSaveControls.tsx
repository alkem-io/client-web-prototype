import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UnsavedChangesBar, type UnsavedChangesBarState } from "@/crd/components/common/UnsavedChangesBar";
import { ConfirmationDialog } from "@/crd/components/dialogs/ConfirmationDialog";
import { UnsavedChangesGuard } from "./UnsavedChangesGuard";

type SettingsSaveControlsProps = {
  state: UnsavedChangesBarState;
  isDirty: boolean;
  onSave: () => void;
  onDiscard: () => void;
};

/**
 * Production's unsaved-changes bar with what surrounds it in client-web: our guard
 * against leaving the page, and the Discard confirmation the bar leaves to its host.
 */
export function SettingsSaveControls({ state, isDirty, onSave, onDiscard }: SettingsSaveControlsProps) {
  const { t } = useTranslation("crd-common");
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);
  const count = state.kind === "clean" ? 0 : state.count;

  return (
    <>
      <UnsavedChangesGuard isDirty={isDirty} onSave={onSave} />
      <UnsavedChangesBar state={state} onSave={onSave} onDiscard={() => setConfirmingDiscard(true)} />
      <ConfirmationDialog
        open={confirmingDiscard}
        onOpenChange={setConfirmingDiscard}
        variant="destructive"
        title={t("unsavedChanges.discardDialog.title", { count })}
        description={t("unsavedChanges.discardDialog.description")}
        confirmLabel={t("unsavedChanges.discardDialog.confirm")}
        onConfirm={() => {
          onDiscard();
          setConfirmingDiscard(false);
        }}
        onCancel={() => setConfirmingDiscard(false)}
      />
    </>
  );
}

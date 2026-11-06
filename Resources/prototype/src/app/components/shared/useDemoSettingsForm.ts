import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { UnsavedChangesBarState } from "@/crd/components/common/UnsavedChangesBar";
import { demoDelay, useDemoState } from "./useDemoState";

/**
 * A settings form with save and discard: edits stay in a local draft until saved,
 * and the number of changed fields drives production's `UnsavedChangesBar`.
 */
export function useDemoSettingsForm<T extends object>(key: string, initial: T) {
  const { t } = useTranslation("crd-common");
  const [saved, setSaved] = useDemoState<T>(key, initial);
  const [values, setValues] = useState<T>(saved);
  const [saving, setSaving] = useState(false);

  const count = (Object.keys(values) as Array<keyof T>).filter(
    (field) => JSON.stringify(values[field]) !== JSON.stringify(saved[field])
  ).length;

  const barState: UnsavedChangesBarState = saving
    ? { kind: "saving", count }
    : count > 0
      ? { kind: "dirty", count, canSave: true }
      : { kind: "clean" };

  return {
    values,
    saving,
    isDirty: count > 0,
    barState,
    onChange: (patch: Partial<T>) => setValues((previous) => ({ ...previous, ...patch })),
    /** For what production commits straight away instead of through the bar, such as the avatar. */
    commit: (patch: Partial<T>) => {
      setValues((previous) => ({ ...previous, ...patch }));
      setSaved((previous) => ({ ...previous, ...patch }));
    },
    save: () => {
      setSaving(true);
      demoDelay(() => {
        setSaved(values);
        setSaving(false);
        toast.success(t("unsavedChanges.saved"));
      }, 800);
    },
    discard: () => setValues(saved),
  };
}

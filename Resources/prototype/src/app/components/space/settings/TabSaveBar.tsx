import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UnsavedChangesGuard } from '@/app/components/shared/UnsavedChangesGuard';
import { UnsavedChangesBar, type UnsavedChangesBarState } from '@/crd/components/common/UnsavedChangesBar';
import { ConfirmationDialog } from '@/crd/components/dialogs/ConfirmationDialog';

type TabSaveBarProps = {
  count: number;
  saving: boolean;
  save: () => void | Promise<void>;
  discard: () => void;
  canSave?: boolean;
  saveBlockedReason?: string;
};

/** Production's unsaved-changes bar, its discard confirmation, and the leave-page guard. */
export function TabSaveBar({ count, saving, save, discard, canSave = true, saveBlockedReason }: TabSaveBarProps) {
  const { t } = useTranslation('crd-common');
  const { t: tSettings } = useTranslation('crd-spaceSettings');
  const [discardOpen, setDiscardOpen] = useState(false);

  const state: UnsavedChangesBarState = saving
    ? { kind: 'saving', count }
    : count > 0
      ? { kind: 'dirty', count, canSave, saveBlockedReason }
      : { kind: 'clean' };

  return (
    <>
      <UnsavedChangesGuard isDirty={count > 0} onSave={() => void save()} />
      <UnsavedChangesBar state={state} onSave={() => void save()} onDiscard={() => setDiscardOpen(true)} />
      <ConfirmationDialog
        open={discardOpen}
        onOpenChange={setDiscardOpen}
        variant="destructive"
        title={t('unsavedChanges.discardDialog.title', { count })}
        description={t('unsavedChanges.discardDialog.description')}
        confirmLabel={t('unsavedChanges.discardDialog.confirm')}
        cancelLabel={tSettings('dirtyGuard.cancel')}
        onConfirm={() => {
          discard();
          setDiscardOpen(false);
        }}
        onCancel={() => setDiscardOpen(false)}
      />
    </>
  );
}

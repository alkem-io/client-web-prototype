import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { ConfirmationDialog } from '@/crd/components/dialogs/ConfirmationDialog';
import { SpaceSettingsTab } from './SpaceSettingsTab';
import { TemplateEditorDialog } from './TemplateEditorDialog';
import { DEMO_SUBSPACE_SETTINGS, type SubspaceProfile } from './subspaceDemoData';
import { buildContent, useDemoTemplates } from './templatesDemo';

type SubspaceOwnSettingsTabProps = {
  scope: string;
  profile: SubspaceProfile;
  /** Where a deleted subspace sends you: its parent space. */
  parentHref: string;
};

/**
 * A subspace's Settings tab: the shared tab, plus the two actions production adds
 * at the bottom for a subspace. In the demo, deleting returns you to the parent
 * space, but the subspace stays in the prototype's fixed data.
 */
export function SubspaceOwnSettingsTab({ scope, profile, parentHref }: SubspaceOwnSettingsTabProps) {
  const { t } = useTranslation('crd-spaceSettings');
  const navigate = useNavigate();
  const [, setTemplates] = useDemoTemplates();
  const [savingAsTemplate, setSavingAsTemplate] = useState<number | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <>
      <SpaceSettingsTab
        level="L1"
        scope={scope}
        initial={DEMO_SUBSPACE_SETTINGS}
        onSaveAsTemplate={() => setSavingAsTemplate(Date.now())}
        onDeleteSpace={() => setConfirmingDelete(true)}
      />

      {savingAsTemplate !== null && (
        <TemplateEditorDialog
          key={savingAsTemplate}
          intent="create"
          type="space"
          template={{
            card: { id: '', type: 'space', name: profile.title, description: profile.description, tags: [], color: '' },
            content: buildContent('space', profile.title, profile.description),
          }}
          onCancel={() => setSavingAsTemplate(null)}
          onSubmit={template => {
            setTemplates(previous => [...previous, template]);
            setSavingAsTemplate(null);
            toast.success('Saved to the top-level space’s templates.');
          }}
        />
      )}

      <ConfirmationDialog
        open={confirmingDelete}
        onOpenChange={setConfirmingDelete}
        variant="destructive"
        title={t('settings.dangerZone.deleteDialog.title')}
        description={t('settings.dangerZone.deleteDialog.description')}
        confirmLabel={t('settings.dangerZone.deleteDialog.confirm')}
        cancelLabel={t('dirtyGuard.cancel')}
        onConfirm={() => {
          setConfirmingDelete(false);
          toast.success('Subspace deleted.');
          navigate(parentHref);
        }}
        onCancel={() => setConfirmingDelete(false)}
      />
    </>
  );
}

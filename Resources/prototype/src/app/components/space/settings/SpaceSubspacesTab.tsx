import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import { ConfirmationDialog } from '@/crd/components/dialogs/ConfirmationDialog';
import { ChangeDefaultSubspaceTemplateDialog } from '@/crd/components/space/settings/ChangeDefaultSubspaceTemplateDialog';
import {
  CreateSubspaceDialog,
  type CreateSubspaceFieldErrors,
  type CreateSubspaceFormValues,
  type CreateSubspaceVisualConstraints,
} from '@/crd/components/space/settings/CreateSubspaceDialog';
import { SpaceSettingsSubspacesView, type SubspaceTile } from '@/crd/components/space/settings/SpaceSettingsSubspacesView';
import { getInitials } from '@/crd/lib/getInitials';
import { pickColorFromId } from '@/crd/lib/pickColorFromId';
import type { SubspaceSortMode } from '@/crd/lib/subspaceDrag';
import { demoDelay, demoMarkdownUpload, useDemoState } from './demoState';
import { DemoTemplatePicker } from './DemoTemplatePicker';
import { SubspaceCreationApplications } from './SubspaceCreationApplications';
import { TemplateEditorDialog } from './TemplateEditorDialog';
import { buildContent, type DemoTemplate, useDemoTemplates } from './templatesDemo';

const IMAGE = (photo: string) =>
  `https://images.unsplash.com/photo-${photo}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600`;

const tile = (
  id: string,
  name: string,
  description: string,
  photo: string,
  visibility: SubspaceTile['visibility'] = 'active'
): SubspaceTile => ({
  id,
  name,
  description,
  href: '#',
  avatarUrl: null,
  bannerUrl: IMAGE(photo),
  color: pickColorFromId(id),
  initials: getInitials(name),
  visibility,
  isPinned: false,
});

export const DEMO_SUBSPACES: SubspaceTile[] = [
  tile('1', 'Q4 Marketing Campaign', 'Planning and execution for the end-of-year marketing push.', '1748346918817-0b1b6b2f9bab'),
  tile('2', 'Product Roadmap 2024', 'Strategic planning for upcoming product features and releases.', '1760629863094-5b1e8d1aae74'),
  tile('3', 'Design System Review', 'Weekly syncs to update and maintain the design system components.', '1595411425732-e69c1abe2763'),
  tile('4', 'Legacy Migration', 'Moving old infrastructure to the new cloud provider.', '1761370981247-1dfd749ec96b', 'archived'),
];

const EMPTY_FORM: CreateSubspaceFormValues = {
  displayName: '',
  tagline: '',
  description: '',
  tags: [],
  spaceTemplateId: '',
  avatarFile: null,
  cardBannerFile: null,
};

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const AVATAR_CONSTRAINTS: CreateSubspaceVisualConstraints = {
  maxWidth: 410,
  maxHeight: 410,
  minWidth: 190,
  minHeight: 190,
  aspectRatio: 1,
  allowedTypes: IMAGE_TYPES,
};
const CARD_BANNER_CONSTRAINTS: CreateSubspaceVisualConstraints = {
  maxWidth: 416,
  maxHeight: 256,
  minWidth: 208,
  minHeight: 128,
  aspectRatio: 416 / 256,
  allowedTypes: IMAGE_TYPES,
};

type SpaceSubspacesTabProps = {
  level?: 'L0' | 'L1' | 'L2';
  scope?: string;
  initial?: SubspaceTile[];
  spaceName?: string;
  /** Our subspace-proposal sections, kept beneath production's screen on top-level spaces. */
  showCreationApplications?: boolean;
};

/**
 * Subspaces tab: production's screen and dialogs, on demo state, followed by our
 * form builder and proposal review, which production doesn't have.
 */
export function SpaceSubspacesTab({
  level = 'L0',
  scope = 'space',
  initial = DEMO_SUBSPACES,
  spaceName = 'Green Energy Space',
  showCreationApplications = level === 'L0',
}: SpaceSubspacesTabProps) {
  const { t } = useTranslation('crd-spaceSettings');
  const { spaceSlug = '' } = useParams<{ spaceSlug: string }>();
  const [subspaces, setSubspaces] = useDemoState(`${scope}:subspaces`, initial);
  const [sortMode, setSortMode] = useDemoState<SubspaceSortMode>(`${scope}:subspaces:sort`, 'manual');
  const [defaultTemplateId, setDefaultTemplateId] = useDemoState<string | undefined>(
    `${scope}:subspaces:defaultTemplate`,
    't1'
  );
  const [templates, setTemplates] = useDemoTemplates(scope);

  const [pendingDelete, setPendingDelete] = useState<SubspaceTile | null>(null);
  const [changeDefaultOpen, setChangeDefaultOpen] = useState(false);
  const [saveAsTemplate, setSaveAsTemplate] = useState<{ key: number; source: SubspaceTile } | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<CreateSubspaceFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [chosenTemplate, setChosenTemplate] = useState<DemoTemplate | null>(null);

  const closeCreate = () => {
    setCreateOpen(false);
    setForm(EMPTY_FORM);
    setErrors({});
    setChosenTemplate(null);
  };

  const submitCreate = async () => {
    if (!form.displayName.trim()) {
      setErrors({ displayName: t('subspaces.saveAsTemplate.errors.nameTooShort') });
      return;
    }
    setSubmitting(true);
    await demoDelay();
    const id = `subspace-${Date.now()}`;
    const bannerUrl = form.cardBannerFile ? URL.createObjectURL(form.cardBannerFile) : null;
    const avatarUrl = form.avatarFile ? URL.createObjectURL(form.avatarFile) : null;
    setSubspaces(previous => [
      {
        ...tile(id, form.displayName, form.tagline || form.description, ''),
        bannerUrl,
        avatarUrl,
      },
      ...previous,
    ]);
    setSubmitting(false);
    closeCreate();
    toast.success('Subspace created.');
  };

  return (
    <>
      <SpaceSettingsSubspacesView
        subspaces={subspaces}
        canCreate={true}
        canSaveAsTemplate={level === 'L0'}
        onCreate={() => setCreateOpen(true)}
        onChangeDefaultTemplate={level === 'L0' ? () => setChangeDefaultOpen(true) : undefined}
        onKebabAction={(id, action) => {
          const target = subspaces.find(subspace => subspace.id === id);
          if (!target) return;
          if (action === 'delete') setPendingDelete(target);
          if (action === 'saveAsTemplate') setSaveAsTemplate({ key: Date.now(), source: target });
          if (action === 'pinToggle') {
            setSubspaces(previous =>
              previous.map(subspace => (subspace.id === id ? { ...subspace, isPinned: !subspace.isPinned } : subspace))
            );
          }
        }}
        sortMode={sortMode}
        onSortModeChange={setSortMode}
        onReorder={ids =>
          setSubspaces(previous => ids.flatMap(id => previous.filter(subspace => subspace.id === id)))
        }
      />

      {showCreationApplications && <SubspaceCreationApplications scope={scope} spaceName={spaceName} />}

      <CreateSubspaceDialog
        open={createOpen}
        onOpenChange={open => {
          if (!open) closeCreate();
        }}
        values={form}
        errors={errors}
        selectedTemplateName={chosenTemplate?.card.name}
        selectedTemplateContent={chosenTemplate?.content}
        onOpenTemplatePicker={() => setPickerOpen(true)}
        onClearTemplate={() => {
          setChosenTemplate(null);
          setForm(previous => ({ ...previous, spaceTemplateId: '' }));
        }}
        submitting={submitting}
        canSubmit={form.displayName.trim().length > 0}
        avatarConstraints={AVATAR_CONSTRAINTS}
        cardBannerConstraints={CARD_BANNER_CONSTRAINTS}
        onChange={changes => {
          setForm(previous => ({ ...previous, ...changes }));
          setErrors({});
        }}
        onSubmit={() => void submitCreate()}
        {...demoMarkdownUpload}
      />

      <DemoTemplatePicker
        scope={scope}
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        allowedTypes={['space']}
        selectedId={form.spaceTemplateId || undefined}
        onSelect={template => {
          setChosenTemplate(template);
          setForm(previous => ({ ...previous, spaceTemplateId: template?.card.id ?? '' }));
        }}
      />

      <ChangeDefaultSubspaceTemplateDialog
        open={changeDefaultOpen}
        onOpenChange={setChangeDefaultOpen}
        templates={templates
          .filter(template => template.card.type === 'space')
          .map(template => ({ id: template.card.id, name: template.card.name }))}
        currentTemplateId={defaultTemplateId}
        libraryHref={`/space/${spaceSlug}/settings/templates`}
        onSave={id => {
          setDefaultTemplateId(id);
          setChangeDefaultOpen(false);
        }}
      />

      {saveAsTemplate && (
        <TemplateEditorDialog
          key={saveAsTemplate.key}
          intent="create"
          type="space"
          template={{
            card: {
              id: '',
              type: 'space',
              name: saveAsTemplate.source.name,
              description: saveAsTemplate.source.description,
              tags: [],
              color: '',
            },
            content: buildContent('space', saveAsTemplate.source.name, saveAsTemplate.source.description),
          }}
          onCancel={() => setSaveAsTemplate(null)}
          onSubmit={template => {
            setTemplates(previous => [...previous, template]);
            setSaveAsTemplate(null);
            toast.success('Saved to this space’s templates.');
          }}
        />
      )}

      <ConfirmationDialog
        open={pendingDelete !== null}
        onOpenChange={open => {
          if (!open) setPendingDelete(null);
        }}
        variant="destructive"
        title={t('subspaces.deleteDialog.title')}
        description={t('subspaces.deleteDialog.description', { name: pendingDelete?.name ?? '' })}
        confirmLabel={t('subspaces.deleteDialog.confirm')}
        cancelLabel={t('dirtyGuard.cancel')}
        onConfirm={() => {
          setSubspaces(previous => previous.filter(subspace => subspace.id !== pendingDelete?.id));
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}

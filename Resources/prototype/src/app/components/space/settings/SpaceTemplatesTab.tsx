import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmationDialog } from '@/crd/components/dialogs/ConfirmationDialog';
import { TemplatePicker } from '@/crd/components/templates/TemplatePicker';
import { TemplatePreviewDialog } from '@/crd/components/templates/TemplatePreviewDialog';
import { TemplatesManagerView } from '@/crd/components/templates/TemplatesManagerView';
import { TEMPLATE_TYPE_ORDER, type TemplateAction, type TemplateType } from '@/crd/components/templates/types';
import { demoDelay } from './demoState';
import { TemplateEditorDialog } from './TemplateEditorDialog';
import { DEMO_LIBRARY_TEMPLATES, type DemoTemplate, useDemoTemplates } from './templatesDemo';

const allow = () => true;

type Editing = { key: number; intent: 'create' | 'edit'; type: TemplateType; template?: DemoTemplate };

/**
 * Templates tab: production's manager view, picker, preview and editor. Preview,
 * create, edit, duplicate, delete and import all act on the demo list.
 */
export function SpaceTemplatesTab({ scope = 'space' }: { scope?: string }) {
  const { t } = useTranslation('crd-templates');
  const [templates, setTemplates] = useDemoTemplates(scope);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [pendingDelete, setPendingDelete] = useState<DemoTemplate | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [importType, setImportType] = useState<TemplateType | null>(null);
  const [importSearch, setImportSearch] = useState('');
  const [importPreviewId, setImportPreviewId] = useState<string | undefined>();
  /** Library template id → the copy of it in this space. */
  const [imported, setImported] = useState<ReadonlyMap<string, string>>(new Map());

  const find = (id: string | null) => templates.find(template => template.card.id === id);
  const preview = find(previewId);

  const onTemplateAction = async (id: string, action: TemplateAction) => {
    const template = find(id);
    if (!template) return;
    if (action === 'preview') setPreviewId(id);
    if (action === 'edit') setEditing({ key: Date.now(), intent: 'edit', type: template.card.type, template });
    if (action === 'delete') setPendingDelete(template);
    if (action === 'duplicate') {
      setDuplicatingId(id);
      await demoDelay();
      const copyId = `t-${Date.now()}`;
      setTemplates(previous => [
        ...previous,
        { ...template, card: { ...template.card, id: copyId, name: `${template.card.name} (copy)` } },
      ]);
      setDuplicatingId(null);
    }
  };

  const importable = DEMO_LIBRARY_TEMPLATES.filter(template => template.card.type === importType);

  return (
    <>
      <TemplatesManagerView
        holderKind="space"
        categories={TEMPLATE_TYPE_ORDER.map(type => ({
          type,
          templates: templates.filter(template => template.card.type === type).map(template => template.card),
        }))}
        duplicatingId={duplicatingId}
        canCreate={allow}
        canEdit={allow}
        canDelete={allow}
        canImport={allow}
        onCreate={type => setEditing({ key: Date.now(), intent: 'create', type })}
        onImport={setImportType}
        onTemplateAction={(id, action) => void onTemplateAction(id, action)}
      />

      {preview && (
        <TemplatePreviewDialog
          open={true}
          onClose={() => setPreviewId(null)}
          header={preview.card}
          content={preview.content}
          contentLoading={false}
          onEdit={() => {
            setPreviewId(null);
            setEditing({ key: Date.now(), intent: 'edit', type: preview.card.type, template: preview });
          }}
        />
      )}

      {editing && (
        <TemplateEditorDialog
          key={editing.key}
          intent={editing.intent}
          type={editing.type}
          template={editing.template}
          onCancel={() => setEditing(null)}
          onSubmit={saved => {
            setTemplates(previous =>
              editing.intent === 'edit'
                ? previous.map(template => (template.card.id === saved.card.id ? saved : template))
                : [...previous, saved]
            );
            setEditing(null);
          }}
        />
      )}

      <TemplatePicker
        mode="import"
        open={importType !== null}
        onClose={() => setImportType(null)}
        sources={[{ key: 'platform', templates: importable.map(template => template.card) }]}
        search={importSearch}
        onSearchChange={setImportSearch}
        onPreview={setImportPreviewId}
        previewId={importPreviewId}
        previewContent={DEMO_LIBRARY_TEMPLATES.find(template => template.card.id === importPreviewId)?.content}
        previewLoading={false}
        alreadyInSet={new Set(imported.keys())}
        onImport={id => {
          const source = DEMO_LIBRARY_TEMPLATES.find(template => template.card.id === id);
          if (!source) return;
          const copyId = `t-${Date.now()}`;
          setTemplates(previous => [...previous, { ...source, card: { ...source.card, id: copyId } }]);
          setImported(previous => new Map(previous).set(id, copyId));
        }}
        onRemoveFromSet={id => {
          const copy = find(imported.get(id) ?? null);
          if (copy) setPendingDelete(copy);
        }}
      />

      <ConfirmationDialog
        open={pendingDelete !== null}
        onOpenChange={open => {
          if (!open) setPendingDelete(null);
        }}
        variant="destructive"
        title={t('delete.title')}
        description={t('delete.body', { name: pendingDelete?.card.name ?? '' })}
        confirmLabel={t('delete.confirm')}
        cancelLabel={t('delete.cancel')}
        onConfirm={() => {
          const id = pendingDelete?.card.id;
          setTemplates(previous => previous.filter(template => template.card.id !== id));
          setImported(previous => new Map([...previous].filter(([, copyId]) => copyId !== id)));
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}

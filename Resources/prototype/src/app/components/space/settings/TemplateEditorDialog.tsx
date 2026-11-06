import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClassificationTemplateForm } from '@/crd/components/templates/forms/ClassificationTemplateForm';
import { CommunityGuidelinesTemplateForm } from '@/crd/components/templates/forms/CommunityGuidelinesTemplateForm';
import { PostTemplateForm } from '@/crd/components/templates/forms/PostTemplateForm';
import { SpaceTemplateForm } from '@/crd/components/templates/forms/SpaceTemplateForm';
import { TemplateFormDialog } from '@/crd/components/templates/TemplateFormDialog';
import type {
  ClassificationTemplateValues,
  CommunityGuidelinesTemplateValues,
  PostTemplateValues,
  SpaceTemplateValues,
  TemplateCardData,
  TemplateCommonValues,
  TemplateContent,
  TemplateFormErrors,
  TemplateType,
} from '@/crd/components/templates/types';
import { pickColorFromId } from '@/crd/lib/pickColorFromId';
import { demoDelay, demoMarkdownUpload } from './demoState';
import { buildContent, type DemoTemplate } from './templatesDemo';

const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-');

type TemplateEditorDialogProps = {
  intent: 'create' | 'edit';
  type: TemplateType;
  /** The template being edited, or the starting point of a new one. */
  template?: DemoTemplate;
  onSubmit: (template: DemoTemplate) => void;
  onCancel: () => void;
};

/**
 * Production's template dialog with production's per-type forms. Mount it with a
 * `key` for each opening, so it starts from `template` every time.
 *
 * Production's Post-collection and whiteboard forms are not part of its design
 * system: they sit in its app layer. So those two types edit only the name,
 * description and tags here.
 */
export function TemplateEditorDialog({ intent, type, template, onSubmit, onCancel }: TemplateEditorDialogProps) {
  const { t } = useTranslation('crd-templates');
  const initialCommon: TemplateCommonValues = {
    name: template?.card.name ?? '',
    description: template?.card.description ?? '',
    tags: template?.card.tags ?? [],
  };
  const initialContent = template?.content ?? buildContent(type, '', '');

  const [common, setCommon] = useState(initialCommon);
  const [content, setContent] = useState<TemplateContent>(initialContent);
  const [spaceUrl, setSpaceUrl] = useState('');
  const [spaceSource, setSpaceSource] = useState<string | undefined>();
  const [urlError, setUrlError] = useState<string | undefined>();
  const [recursive, setRecursive] = useState(false);
  const [errors, setErrors] = useState<TemplateFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const isDirty =
    JSON.stringify(common) !== JSON.stringify(initialCommon) ||
    JSON.stringify(content) !== JSON.stringify(initialContent) ||
    spaceSource !== undefined;

  const applySpaceUrl = () => {
    const match = /\/space\/([^/?#]+)/.exec(spaceUrl);
    if (!match) {
      setUrlError(t('form.space.urlErrors.invalidUrl', { defaultValue: 'This URL does not point to a space.' }));
      return;
    }
    setUrlError(undefined);
    setSpaceSource(match[1].replace(/-/g, ' '));
  };

  const slot = (() => {
    const shared = { errors };
    switch (content.type) {
      case 'post': {
        const value: PostTemplateValues = { ...common, type: 'post', defaultDescription: content.defaultDescription };
        return (
          <PostTemplateForm
            {...shared}
            {...demoMarkdownUpload}
            value={value}
            onChange={next => setContent({ type: 'post', defaultDescription: next.defaultDescription })}
          />
        );
      }
      case 'communityGuidelines': {
        const value: CommunityGuidelinesTemplateValues = {
          ...common,
          type: 'communityGuidelines',
          title: content.title,
          guidelinesMarkdown: content.guidelinesMarkdown,
          references: content.references,
        };
        return (
          <CommunityGuidelinesTemplateForm
            {...shared}
            {...demoMarkdownUpload}
            value={value}
            onChange={next =>
              setContent({
                type: 'communityGuidelines',
                title: next.title,
                guidelinesMarkdown: next.guidelinesMarkdown,
                references: next.references,
              })
            }
          />
        );
      }
      case 'classification': {
        const value: ClassificationTemplateValues = {
          ...common,
          type: 'classification',
          cardinality: content.cardinality,
          values: content.values,
        };
        return (
          <ClassificationTemplateForm
            {...shared}
            value={value}
            onChange={next =>
              setContent({
                type: 'classification',
                cardinality: next.cardinality,
                values: next.values.map((row, index) => ({
                  id: row.id ?? (slug(row.label) || `value-${index}`),
                  label: row.label,
                })),
              })
            }
          />
        );
      }
      case 'space': {
        const value: SpaceTemplateValues = { ...common, type: 'space', recursive, sourceSpaceId: spaceSource };
        return (
          <SpaceTemplateForm
            {...shared}
            value={value}
            onChange={next => setRecursive(next.recursive)}
            url={spaceUrl}
            onUrlChange={setSpaceUrl}
            onUseUrl={applySpaceUrl}
            urlResolving={false}
            urlError={urlError}
            sourceDisplayName={spaceSource}
            capturedStructure={content}
          />
        );
      }
      default:
        return null;
    }
  })();

  const submit = async () => {
    const nextErrors: TemplateFormErrors = {};
    if (!common.name.trim()) nextErrors.name = t('form.common.nameRequired');
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSubmitting(true);
    await demoDelay();
    const id = template?.card.id && intent === 'edit' ? template.card.id : `t-${Date.now()}`;
    const card: TemplateCardData = {
      ...template?.card,
      id,
      type,
      name: common.name,
      description: common.description,
      tags: common.tags,
      color: template?.card.color ?? pickColorFromId(id),
      ...(content.type === 'classification'
        ? { classification: { cardinality: content.cardinality, valueLabels: content.values.map(v => v.label) } }
        : {}),
    };
    onSubmit({ card, content });
  };

  return (
    <TemplateFormDialog
      open={true}
      intent={intent}
      type={type}
      commonValue={common}
      commonErrors={errors}
      onCommonChange={setCommon}
      perTypeFormSlot={slot}
      submitting={submitting}
      onSubmit={() => void submit()}
      onCancel={onCancel}
      isDirty={isDirty}
    />
  );
}

import { useState } from 'react';
import { TemplatePicker } from '@/crd/components/templates/TemplatePicker';
import type { TemplateType } from '@/crd/components/templates/types';
import { DEMO_LIBRARY_TEMPLATES, type DemoTemplate, useDemoTemplates } from './templatesDemo';

type DemoTemplatePickerProps = {
  open: boolean;
  onClose: () => void;
  allowedTypes: TemplateType[];
  selectedId?: string;
  onSelect: (template: DemoTemplate | null) => void;
  scope?: string;
};

/** Production's template picker, offering this space's templates and the platform library. */
export function DemoTemplatePicker({ open, onClose, allowedTypes, selectedId, onSelect, scope }: DemoTemplatePickerProps) {
  const [spaceTemplates] = useDemoTemplates(scope);
  const [search, setSearch] = useState('');
  const [previewId, setPreviewId] = useState<string | undefined>();

  const ofType = (list: DemoTemplate[]) => list.filter(template => allowedTypes.includes(template.card.type));
  const all = [...spaceTemplates, ...DEMO_LIBRARY_TEMPLATES];

  return (
    <TemplatePicker
      mode="select"
      open={open}
      onClose={onClose}
      allowedTypes={allowedTypes}
      selectedId={selectedId}
      onSelect={id => {
        onSelect(id ? (all.find(template => template.card.id === id) ?? null) : null);
        onClose();
      }}
      sources={[
        { key: 'space', templates: ofType(spaceTemplates).map(template => template.card) },
        { key: 'platform', templates: ofType(DEMO_LIBRARY_TEMPLATES).map(template => template.card) },
      ]}
      search={search}
      onSearchChange={setSearch}
      onPreview={setPreviewId}
      previewId={previewId}
      previewContent={all.find(template => template.card.id === previewId)?.content}
      previewLoading={false}
    />
  );
}

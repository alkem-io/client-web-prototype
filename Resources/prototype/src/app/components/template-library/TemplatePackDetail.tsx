/**
 * Innovation pack profile — production's
 * `@/crd/components/innovationPack/InnovationPackProfileView`.
 *
 * CRD owns the pack header (banner, provider, tags, share) and the template
 * sections grouped by type, each rendered read-only: on a pack's public profile
 * the kebab is Preview-only, because Duplicate/Edit/Delete write into the
 * viewer's own template set and a public viewer has none.
 *
 * REMOVED with the conversion: the prototype's "Apply pack to a space" dialog
 * and its per-template apply action. Production has no apply-from-profile flow —
 * templates are pulled in from the target Space's own template manager, not
 * pushed from the library. Recorded in PHASE-2.md §11.
 */
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { InnovationPackProfileView } from '@/crd/components/innovationPack/InnovationPackProfileView';
import type {
  TemplateCardData,
  TemplateCategorySection,
  TemplateType,
} from '@/crd/components/templates/types';
import { PACK_SPECIFIC_TEMPLATES } from '@/app/data/template-data';
import { toTemplateCardData, toTemplateType, type MockTemplate } from '@/app/mappers/templates';

const PACK_DATA = {
  id: 'pack-1',
  name: 'Design Sprint Kit',
  description:
    'A complete set of tools to run a 5-day Design Sprint. Validate ideas, solve big problems, and test prototypes with customers.',
  author: 'Google Ventures',
  templateCount: 14,
  tags: ['Innovation', 'Product', 'Strategy', 'Workshop'],
  image:
    'https://images.unsplash.com/photo-1554103210-26d928978fb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
};

/** CRD groups a pack's templates into one section per type. */
function groupByType(templates: MockTemplate[]): TemplateCategorySection[] {
  const byType = new Map<TemplateType, TemplateCardData[]>();
  for (const template of templates) {
    const type = toTemplateType(template.type);
    const list = byType.get(type) ?? [];
    list.push(toTemplateCardData(template));
    byType.set(type, list);
  }
  return [...byType.entries()].map(([type, list]) => ({ type, templates: list }));
}

export function TemplatePackDetail() {
  const navigate = useNavigate();

  const templates = useMemo(
    () => groupByType(PACK_SPECIFIC_TEMPLATES as MockTemplate[]),
    []
  );

  return (
    <InnovationPackProfileView
      pack={{
        id: PACK_DATA.id,
        name: PACK_DATA.name,
        description: PACK_DATA.description,
        tags: PACK_DATA.tags,
        bannerUrl: PACK_DATA.image,
        color: '#2563eb',
        templateCount: PACK_DATA.templateCount,
        url: `/templates/packs/${PACK_DATA.id}`,
        providerName: PACK_DATA.author,
      }}
      templates={templates}
      canManage={false}
      onTemplatePreview={id => navigate(`/templates/${id}`)}
      shareUrl={`${window.location.origin}/templates/packs/${PACK_DATA.id}`}
    />
  );
}

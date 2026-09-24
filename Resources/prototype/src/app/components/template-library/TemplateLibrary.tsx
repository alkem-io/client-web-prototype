/**
 * Template library — production's
 * `@/crd/components/innovationLibrary/InnovationLibraryView`.
 *
 * CRD owns the whole page: the packs row with its own search and "load more",
 * the template gallery with its type filter, search and paging, and the counts
 * beside each heading. This file is the prototype's fixtures, the paging state
 * CRD drives, and the mapping to CRD's exported card types.
 *
 * Vocabulary: the fixtures label template kinds with display names; production
 * uses the domain identifiers (a "Collaboration Tool" is a **callout**, and a
 * "Subspace" template is just a **space** template). See `app/mappers/templates.ts`.
 */
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { InnovationLibraryView } from '@/crd/components/innovationLibrary/InnovationLibraryView';
import type { TemplateTypeFilterValue } from '@/crd/components/innovationLibrary/TemplateTypeFilter';
import { ALL_TEMPLATES, TEMPLATE_PACKS } from '@/app/data/template-data';
import {
  toPackCardData,
  toTemplateCardData,
  toTemplateType,
  type MockTemplate,
  type MockTemplatePack,
} from '@/app/mappers/templates';

const PACKS_PER_PAGE = 6;
const TEMPLATES_PER_PAGE = 12;

export function TemplateLibrary() {
  const navigate = useNavigate();

  const [packsSearch, setPacksSearch] = useState('');
  const [templatesSearch, setTemplatesSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TemplateTypeFilterValue>('all');
  const [packsShown, setPacksShown] = useState(PACKS_PER_PAGE);
  const [templatesShown, setTemplatesShown] = useState(TEMPLATES_PER_PAGE);

  const filteredPacks = useMemo(() => {
    const q = packsSearch.toLowerCase();
    return (TEMPLATE_PACKS as MockTemplatePack[]).filter(
      pack =>
        !q ||
        pack.name.toLowerCase().includes(q) ||
        (pack.tags ?? []).some(tag => tag.toLowerCase().includes(q))
    );
  }, [packsSearch]);

  const filteredTemplates = useMemo(() => {
    const q = templatesSearch.toLowerCase();
    return (ALL_TEMPLATES as MockTemplate[]).filter(template => {
      const matchesSearch =
        !q ||
        template.name.toLowerCase().includes(q) ||
        (template.tags ?? []).some(tag => tag.toLowerCase().includes(q));
      const matchesType =
        typeFilter === 'all' || typeFilter.includes(toTemplateType(template.type));
      return matchesSearch && matchesType;
    });
  }, [templatesSearch, typeFilter]);

  return (
    <InnovationLibraryView
      packs={filteredPacks.slice(0, packsShown).map(toPackCardData)}
      packsTotal={filteredPacks.length}
      hasMorePacks={packsShown < filteredPacks.length}
      onLoadMorePacks={() => setPacksShown(n => n + PACKS_PER_PAGE)}
      packsSearch={packsSearch}
      onChangePacksSearch={next => {
        setPacksSearch(next);
        setPacksShown(PACKS_PER_PAGE);
      }}
      templates={filteredTemplates.slice(0, templatesShown).map(toTemplateCardData)}
      templatesTotal={filteredTemplates.length}
      hasMoreTemplates={templatesShown < filteredTemplates.length}
      onLoadMoreTemplates={() => setTemplatesShown(n => n + TEMPLATES_PER_PAGE)}
      activeTypeFilter={typeFilter}
      onChangeTypeFilter={next => {
        setTypeFilter(next);
        setTemplatesShown(TEMPLATES_PER_PAGE);
      }}
      templatesSearch={templatesSearch}
      onChangeTemplatesSearch={next => {
        setTemplatesSearch(next);
        setTemplatesShown(TEMPLATES_PER_PAGE);
      }}
      onTemplatePreview={id => navigate(`/templates/${id}`)}
    />
  );
}

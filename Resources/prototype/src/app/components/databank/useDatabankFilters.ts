import { useMemo } from 'react';
import { type FacetedSearchItem, useFacetedSearch } from '@/ahead/facetedSearch';
import {
  DATABANK_FACET_GROUPS,
  type DatabankBlock,
  type DatabankInitiative,
} from '@/app/data/databank-data';

/** Filter state for the Databank praktijkvoorbeelden tab: its content as `useFacetedSearch` items. */

const blockText = (block: DatabankBlock) => {
  switch (block.kind) {
    case 'paragraph':
    case 'subheading':
      return block.text;
    case 'labelValue':
      return `${block.label} ${block.text}`;
    case 'list':
      return block.items.join(' ');
    case 'video':
      return block.title;
  }
};

const toItem = (initiative: DatabankInitiative): FacetedSearchItem & { initiative: DatabankInitiative } => ({
  initiative,
  id: initiative.id,
  name: initiative.name,
  tags: initiative.tags,
  classifications: initiative.classifications,
  text: [
    initiative.tagline,
    initiative.lead.name,
    ...initiative.sections.flatMap(s => [s.title, ...s.blocks.map(blockText)]),
    ...initiative.links.map(l => l.name),
  ],
});

export function useDatabankFilters(initiatives: DatabankInitiative[]) {
  const items = useMemo(() => initiatives.map(toItem), [initiatives]);
  return useFacetedSearch(items, DATABANK_FACET_GROUPS);
}

export type DatabankFilters = ReturnType<typeof useDatabankFilters>;

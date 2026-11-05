import { FacetedSearchCard, type FacetLabels } from '@/ahead/FacetedSearchPanel';
import type { DatabankFilters } from './useDatabankFilters';

const DUTCH_LABELS: FacetLabels = {
  showMore: hidden => `+ ${hidden} ${hidden === 1 ? 'label' : 'labels'}`,
  showLess: 'Toon minder',
  selected: (selected, total) => `${selected} van ${total}`,
  selectedAria: (selected, total) => `${selected} van ${total} geselecteerd`,
  options: total => `${total} opties`,
  valueAria: (value, count) => `${value}, ${count} ${count === 1 ? 'initiatief' : 'initiatieven'}`,
};

/** Sidebar filter panel, with the Databank's Dutch wording. */
export function DatabankFilterPanel({ filters }: { filters: DatabankFilters }) {
  return (
    <FacetedSearchCard filters={filters} searchLabel="Zoeken" placeholder="Zoek initiatieven..." labels={DUTCH_LABELS} />
  );
}

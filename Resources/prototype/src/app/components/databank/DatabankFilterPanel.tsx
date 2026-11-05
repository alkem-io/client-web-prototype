import { type FacetLabels, FacetedSearchSummary, FacetSections } from '@/ahead/FacetedSearchPanel';
import { SearchField } from '@/crd/forms/SearchField';
import type { DatabankFilters } from './useDatabankFilters';

const DUTCH_LABELS: FacetLabels = {
  showMore: hidden => `+ ${hidden} ${hidden === 1 ? 'label' : 'labels'}`,
  showLess: 'Toon minder',
  selected: (selected, total) => `${selected} van ${total}`,
  selectedAria: (selected, total) => `${selected} van ${total} geselecteerd`,
  options: total => `${total} opties`,
  valueAria: (value, count) => `${value}, ${count} ${count === 1 ? 'initiatief' : 'initiatieven'}`,
};

/** Sidebar filter panel: "Zoeken" (production's `SearchField`) and the shared search panel parts. */
export function DatabankFilterPanel({ filters }: { filters: DatabankFilters }) {
  return (
    <section
      aria-label="Filters"
      className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4"
    >
      <div className="flex flex-col gap-3">
        {/* Wrapping <label>: SearchField takes no id, so the label is associated
            by nesting. Its aria-label repeats the same word. */}
        <label className="flex flex-col gap-1.5">
          <span className="text-card-title text-foreground">Zoeken</span>
          <SearchField
            value={filters.searchText}
            onValueChange={filters.setSearchText}
            placeholder="Zoek initiatieven..."
            ariaLabel="Zoeken"
            className="[&_input]:h-11"
          />
        </label>
        <FacetedSearchSummary filters={filters} />
      </div>

      <FacetSections filters={filters} labels={DUTCH_LABELS} />
    </section>
  );
}

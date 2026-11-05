import { useState } from 'react';
import { SearchField } from '@/crd/forms/SearchField';
import { DatabankChip } from './DatabankChip';
import type { DatabankFilters } from './useDatabankFilters';

/** How many values a facet group shows before "Toon alle N". */
const FACET_PREVIEW = 5;

/**
 * Sidebar filter panel: "Zoeken" (production's `SearchField`) and one toggle-
 * chip group per facet. Tags render without a heading; classification groups
 * carry their label.
 */
export function DatabankFilterPanel({ filters }: { filters: DatabankFilters }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <section
      aria-label="Filters"
      className="flex flex-col gap-6 rounded-lg border border-border bg-card p-4"
    >
      {/* Wrapping <label>: SearchField takes no id, so the label is associated
          by nesting. Its aria-label repeats the same word. */}
      <label className="flex flex-col gap-1.5">
        <span className="text-card-title text-foreground">Zoeken</span>
        <SearchField
          value={filters.searchText}
          onValueChange={filters.setSearchText}
          placeholder="Zoek op naam"
          ariaLabel="Zoeken"
          className="[&_input]:h-11"
        />
      </label>

      {filters.facets.map(facet => {
        const showAll = expanded[facet.group];
        const shown = showAll ? facet.values : facet.values.slice(0, FACET_PREVIEW);
        const headingId = `databank-facet-${facet.group.replace(/\W+/g, '-').toLowerCase()}`;
        const hasHeading = facet.group !== 'Tags';

        return (
          <div
            key={facet.group}
            role="group"
            aria-labelledby={hasHeading ? headingId : undefined}
            aria-label={hasHeading ? undefined : 'Tags'}
            className="flex flex-col gap-2"
          >
            {hasHeading && (
              <h2 id={headingId} className="text-card-title text-foreground">
                {facet.group}
              </h2>
            )}
            <div className="flex flex-wrap gap-1.5">
              {shown.map(v => (
                <DatabankChip
                  key={v.value}
                  variant={facet.group === 'Tags' ? 'outline' : 'filled'}
                  pressed={v.pressed}
                  disabled={v.disabled}
                  onClick={() => filters.toggle(v.group, v.value)}
                  aria-label={`${v.value}, ${v.count} ${v.count === 1 ? 'initiatief' : 'initiatieven'}`}
                >
                  <span>{v.value}</span>
                  <span className="opacity-75" aria-hidden="true">
                    {v.count}
                  </span>
                </DatabankChip>
              ))}
            </div>
            {facet.values.length > FACET_PREVIEW && (
              <button
                type="button"
                aria-expanded={!!showAll}
                onClick={() => setExpanded(prev => ({ ...prev, [facet.group]: !prev[facet.group] }))}
                className="-ml-2 min-h-8 self-start rounded-md px-2 text-body-emphasis text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {showAll ? 'Toon minder' : `Toon alle ${facet.values.length}`}
              </button>
            )}
          </div>
        );
      })}
    </section>
  );
}

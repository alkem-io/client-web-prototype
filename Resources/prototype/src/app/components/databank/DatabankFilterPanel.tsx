import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { SearchMatchSummary } from '@/crd/components/space/sidebar/SearchMatchSummary';
import { SearchField } from '@/crd/forms/SearchField';
import { Badge } from '@/crd/primitives/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/crd/primitives/collapsible';
import { DatabankChip } from './DatabankChip';
import type { DatabankFilters } from './useDatabankFilters';

/** How many values an open facet group shows before "Toon alle N". */
const FACET_PREVIEW = 5;

/**
 * Sidebar filter panel: "Zoeken" (production's `SearchField`), production's
 * match summary once a filter is active, and one toggle-chip section per
 * facet. Tags starts open, the rest closed; each header
 * carries a pill with how many values it holds, which switches to the primary
 * colour and "N van M" when values in it are selected, so a filter stays
 * noticeable while its section is closed.
 */
export function DatabankFilterPanel({ filters }: { filters: DatabankFilters }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

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
        {filters.hasActive && (
          <SearchMatchSummary
            count={filters.visible.length}
            hasMore={false}
            text={filters.searchText.trim()}
            tags={filters.active.map(f => f.value)}
            onClear={filters.clearAll}
          />
        )}
      </div>

      <div className="flex flex-col divide-y divide-border">
        {filters.facets.map(facet => {
          const showAll = expanded[facet.group];
          const shown = showAll ? facet.values : facet.values.slice(0, FACET_PREVIEW);
          const total = facet.values.length;
          const selected = facet.values.filter(v => v.pressed).length;

          return (
            <Collapsible key={facet.group} defaultOpen={facet.group === 'Tags'}>
              <h2>
                <CollapsibleTrigger className="group flex min-h-11 w-full items-center gap-2 rounded-md text-left text-card-title text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <span className="min-w-0 flex-1">{facet.group}</span>
                  <Badge
                    variant={selected > 0 ? 'default' : 'secondary'}
                    className="rounded-full"
                    aria-label={
                      selected > 0 ? `${selected} van ${total} geselecteerd` : `${total} opties`
                    }
                  >
                    {selected > 0 ? `${selected} van ${total}` : total}
                  </Badge>
                  <ChevronDown
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180"
                    aria-hidden="true"
                  />
                </CollapsibleTrigger>
              </h2>
              <CollapsibleContent className="flex flex-col gap-2 pb-4 pt-1">
                <div className="flex flex-wrap gap-1.5">
                  {shown.map(v => (
                    <DatabankChip
                      key={v.value}
                      variant={facet.group === 'Tags' ? 'outline' : 'filled'}
                      pressed={v.pressed}
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
                {total > FACET_PREVIEW && (
                  <button
                    type="button"
                    aria-expanded={!!showAll}
                    onClick={() => setExpanded(prev => ({ ...prev, [facet.group]: !prev[facet.group] }))}
                    className="-ml-2 min-h-8 self-start rounded-md px-2 text-body-emphasis text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {showAll ? 'Toon minder' : `Toon alle ${total}`}
                  </button>
                )}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </section>
  );
}

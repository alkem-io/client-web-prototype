import { X } from 'lucide-react';
import type { DatabankInitiative } from '@/app/data/databank-data';
import { InitiativeCard } from './InitiativeCard';
import type { DatabankFilters } from './useDatabankFilters';

/** Content column: heading + count, the active-filter pills, and the cards. */
export function DatabankResults({ filters, total }: { filters: DatabankFilters; total: number }) {
  return (
    <section
      aria-labelledby="databank-title"
      className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="databank-title" className="text-section-title text-foreground">
          Initiatieven
        </h2>
        <output className="text-caption text-muted-foreground" aria-live="polite">
          {filters.visible.length} van {total} initiatieven
        </output>
      </div>

      {filters.hasActive && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-caption text-muted-foreground">Gefilterd op:</span>
          {filters.active.map(f => (
            <button
              key={`${f.group}-${f.value}`}
              type="button"
              aria-label={`Verwijder filter ${f.value}`}
              onClick={() => filters.toggle(f.group, f.value)}
              className="inline-flex min-h-7 items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-caption font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {f.value}
              <X className="size-3" aria-hidden="true" />
            </button>
          ))}
          <button
            type="button"
            onClick={filters.clearAll}
            className="min-h-7 rounded-md px-2 text-body-emphasis text-foreground underline underline-offset-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Wis alles
          </button>
        </div>
      )}

      {filters.visible.map((initiative: DatabankInitiative) => (
        <InitiativeCard
          key={initiative.id}
          initiative={initiative}
          isActive={filters.isActive}
          onToggleFilter={filters.toggle}
        />
      ))}

      {filters.visible.length === 0 && (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-body text-muted-foreground">
          Geen initiatieven gevonden voor deze filters.
        </p>
      )}
    </section>
  );
}

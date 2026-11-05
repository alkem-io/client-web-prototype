import { InitiativeCard } from './InitiativeCard';
import type { DatabankFilters } from './useDatabankFilters';

/** Content column: heading + count and the cards. */
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

      {filters.visible.map(({ initiative }) => (
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

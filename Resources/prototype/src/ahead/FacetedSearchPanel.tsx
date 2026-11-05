import { ChevronDown } from 'lucide-react';
import { type ComponentProps, useState } from 'react';
import { SearchMatchSummary } from '@/crd/components/space/sidebar/SearchMatchSummary';
import { SearchField } from '@/crd/forms/SearchField';
import { cn } from '@/crd/lib/utils';
import { Badge } from '@/crd/primitives/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/crd/primitives/collapsible';
import type { FacetedSearch } from './facetedSearch';

/**
 * The parts of the sidebar search panel, on top of production's `SearchField`
 * and `SearchMatchSummary`.
 *
 * What production would gain: production's `SearchSection` shows one flat tag
 * list capped at two rows. Here tags and each classification are their own
 * section that opens and closes, with a pill saying how many values it holds.
 * The pill switches to the primary colour and "N of M" when values in it are
 * selected, so a filter stays noticeable while its section is closed.
 *
 * `FacetedSearchCard` is the widget itself. Search and facets can each be left
 * out, because the prototype's Settings → Layout switches them independently.
 */

/** How many values an open section shows before "+ N labels". */
const FACET_PREVIEW = 5;

export type FacetLabels = {
  showMore: (hidden: number) => string;
  showLess: string;
  selected: (selected: number, total: number) => string;
  selectedAria: (selected: number, total: number) => string;
  options: (total: number) => string;
  valueAria: (value: string, count: number) => string;
};

const ENGLISH_LABELS: FacetLabels = {
  showMore: hidden => `+ ${hidden} ${hidden === 1 ? 'label' : 'labels'}`,
  showLess: 'Show less',
  selected: (selected, total) => `${selected} of ${total}`,
  selectedAria: (selected, total) => `${selected} of ${total} selected`,
  options: total => `${total} options`,
  valueAria: (value, count) => `${value}, ${count} ${count === 1 ? 'item' : 'items'}`,
};

type FacetChipProps = ComponentProps<'button'> & {
  variant?: 'outline' | 'filled' | 'more';
  pressed?: boolean;
};

/**
 * The pill used for facet values.
 *
 * Geometry matches production's toggle tag chip (`CollapsibleTagList` in
 * interactive mode: `px-3 py-1.5 text-caption rounded-full`), so these sit
 * next to production's tag filters without looking like a second design.
 *
 * - `outline`: free tags (white, bordered)
 * - `filled`: classification values (soft fill)
 * - `more`: "Lees meer" / "+ N labels" expanders — an outline chip with a
 *   dashed border, so they read as part of the same set
 *
 * A pressed chip is filled with the primary colour. A disabled chip is muted
 * and dashed.
 */
export function FacetChip({ variant = 'outline', pressed, disabled, className, children, ...props }: FacetChipProps) {
  return (
    <button
      type="button"
      aria-pressed={variant === 'more' ? undefined : pressed}
      disabled={disabled}
      className={cn(
        'inline-flex min-h-7 max-w-full items-center gap-1 rounded-full border px-3 py-1 text-left text-caption font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        disabled
          ? 'cursor-not-allowed border-dashed border-border bg-muted text-muted-foreground'
          : pressed
            ? 'border-primary bg-primary text-primary-foreground'
            : variant === 'filled'
              ? 'border-secondary bg-secondary text-secondary-foreground hover:border-primary'
              : variant === 'more'
                ? 'self-start border-dashed border-border bg-card text-foreground hover:border-primary'
                : 'border-border bg-card text-foreground hover:border-primary',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/** Production's grey summary strip, shown once a search or filter is active. */
export function FacetedSearchSummary({ filters, className }: { filters: FacetedSearch; className?: string }) {
  if (!filters.hasActive) return null;
  return (
    <SearchMatchSummary
      className={className}
      count={filters.visible.length}
      hasMore={false}
      text={filters.searchText.trim()}
      tags={filters.active.map(f => f.value)}
      onClear={filters.clearAll}
    />
  );
}

/** One section per facet. Tags starts open, the rest closed. */
export function FacetSections({ filters, labels = ENGLISH_LABELS }: { filters: FacetedSearch; labels?: FacetLabels }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <div className="flex flex-col divide-y divide-border">
      {filters.facets.map(facet => {
        const showAll = expanded[facet.group];
        const shown = showAll ? facet.values : facet.values.slice(0, FACET_PREVIEW);
        const total = facet.values.length;
        const selected = facet.values.filter(v => v.pressed).length;

        return (
          <Collapsible key={facet.group} defaultOpen={facet.group === 'Tags'}>
            <h3>
              <CollapsibleTrigger className="group flex min-h-11 w-full items-center gap-2 rounded-md text-left text-card-title text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <span className="min-w-0 flex-1">{facet.group}</span>
                <Badge
                  variant={selected > 0 ? 'default' : 'secondary'}
                  className="rounded-full"
                  aria-label={selected > 0 ? labels.selectedAria(selected, total) : labels.options(total)}
                >
                  {selected > 0 ? labels.selected(selected, total) : total}
                </Badge>
                <ChevronDown
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180"
                  aria-hidden="true"
                />
              </CollapsibleTrigger>
            </h3>
            <CollapsibleContent className="flex flex-col gap-2 pb-4 pt-1">
              <div className="flex flex-wrap gap-1.5">
                {shown.map(v => (
                  <FacetChip
                    key={v.value}
                    variant={facet.group === 'Tags' ? 'outline' : 'filled'}
                    pressed={v.pressed}
                    onClick={() => filters.toggle(v.group, v.value)}
                    aria-label={labels.valueAria(v.value, v.count)}
                  >
                    <span>{v.value}</span>
                    <span className="opacity-75" aria-hidden="true">
                      {v.count}
                    </span>
                  </FacetChip>
                ))}
              </div>
              {total > FACET_PREVIEW && (
                <FacetChip
                  variant="more"
                  aria-expanded={!!showAll}
                  onClick={() => setExpanded(prev => ({ ...prev, [facet.group]: !prev[facet.group] }))}
                >
                  {showAll ? labels.showLess : labels.showMore(total - FACET_PREVIEW)}
                </FacetChip>
              )}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}

type FacetedSearchCardProps = {
  filters: FacetedSearch;
  /** The heading above the search field. */
  searchLabel: string;
  placeholder: string;
  showSearch?: boolean;
  showFacets?: boolean;
  labels?: FacetLabels;
};

/** The search widget: search field, match summary and facet sections in one card. */
export function FacetedSearchCard({
  filters,
  searchLabel,
  placeholder,
  showSearch = true,
  showFacets = true,
  labels,
}: FacetedSearchCardProps) {
  const hasFacets = showFacets && filters.facets.length > 0;
  if (!showSearch && !hasFacets) return null;

  return (
    <section aria-label="Filters" className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
      <div className="flex flex-col gap-3 empty:hidden">
        {showSearch && (
          // Wrapping <label>: SearchField takes no id, so the label is associated
          // by nesting. Its aria-label repeats the same word.
          <label className="flex flex-col gap-1.5">
            <span className="text-card-title text-foreground">{searchLabel}</span>
            <SearchField
              value={filters.searchText}
              onValueChange={filters.setSearchText}
              placeholder={placeholder}
              ariaLabel={searchLabel}
              className="[&_input]:h-11"
            />
          </label>
        )}
        <FacetedSearchSummary filters={filters} />
      </div>

      {hasFacets && <FacetSections filters={filters} labels={labels} />}
    </section>
  );
}

import { useMemo, useState } from 'react';
import {
  DATABANK_FACET_GROUPS,
  type DatabankInitiative,
} from '@/app/data/databank-data';

/**
 * Filter state for the Databank praktijkvoorbeelden tab.
 *
 * - Search matches name + tagline.
 * - Facet values combine with OR inside a group and AND across groups.
 * - Each facet chip shows how many initiatives would remain if it were added
 *   to the current filters; a chip that would leave nothing is disabled.
 * - Chips are ordered by how often the value occurs overall (then A–Z), not by
 *   the live count, so they don't jump around while you click.
 */

export type FacetGroup = (typeof DATABANK_FACET_GROUPS)[number];

export type ActiveFilter = { group: string; value: string };

export type FacetValue = {
  group: string;
  value: string;
  /** Results if this value were added to the current filters. */
  count: number;
  pressed: boolean;
  disabled: boolean;
};

export type Facet = {
  group: FacetGroup;
  values: FacetValue[];
};

const keyOf = (group: string, value: string) => `${group}\u0000${value}`;

/** Every `group + value` pair an initiative can be filtered by. */
export const facetKeysOf = (initiative: DatabankInitiative) => [
  ...initiative.tags.map(tag => keyOf('Tags', tag)),
  ...initiative.classifications.flatMap(c => c.values.map(value => keyOf(c.label, value))),
];

function matches(initiative: DatabankInitiative, filters: ActiveFilter[], query: string) {
  if (query && !`${initiative.name} ${initiative.tagline}`.toLowerCase().includes(query)) return false;

  const keys = new Set(facetKeysOf(initiative));
  const byGroup = new Map<string, ActiveFilter[]>();
  for (const f of filters) byGroup.set(f.group, [...(byGroup.get(f.group) ?? []), f]);

  return [...byGroup.values()].every(group => group.some(f => keys.has(keyOf(f.group, f.value))));
}

export function useDatabankFilters(initiatives: DatabankInitiative[]) {
  const [searchText, setSearchText] = useState('');
  const [active, setActive] = useState<ActiveFilter[]>([]);

  const query = searchText.trim().toLowerCase();

  const isActive = (group: string, value: string) =>
    active.some(f => f.group === group && f.value === value);

  const toggle = (group: string, value: string) =>
    setActive(prev =>
      prev.some(f => f.group === group && f.value === value)
        ? prev.filter(f => !(f.group === group && f.value === value))
        : [...prev, { group, value }]
    );

  const clearAll = () => {
    setActive([]);
    setSearchText('');
  };

  const visible = useMemo(
    () => initiatives.filter(i => matches(i, active, query)),
    [initiatives, active, query]
  );

  const facets = useMemo<Facet[]>(() => {
    const totals = new Map<string, number>();
    for (const i of initiatives) for (const k of facetKeysOf(i)) totals.set(k, (totals.get(k) ?? 0) + 1);

    return DATABANK_FACET_GROUPS.map(group => {
      const values = [...totals.keys()]
        .map(k => k.split('\u0000'))
        .filter(([g]) => g === group)
        .sort(([, a], [, b]) => totals.get(keyOf(group, b))! - totals.get(keyOf(group, a))! || a.localeCompare(b))
        .map(([, value]) => {
          const pressed = active.some(f => f.group === group && f.value === value);
          const count = initiatives.filter(i => matches(i, [...active, { group, value }], query)).length;
          return { group, value, count, pressed, disabled: !pressed && count === 0 };
        });
      return { group, values };
    }).filter(f => f.values.length > 0);
  }, [initiatives, active, query]);

  return {
    searchText,
    setSearchText,
    active,
    isActive,
    toggle,
    clearAll,
    visible,
    facets,
    hasActive: active.length > 0,
  };
}

export type DatabankFilters = ReturnType<typeof useDatabankFilters>;

import { useMemo, useState } from 'react';

/**
 * Search and facet filtering over one tab's content, for `FacetedSearchPanel`.
 *
 * What production would gain: facets built from what is actually on the tab,
 * including classifications, with a count on each value. Production's sidebar
 * (`useCalloutsSetTagsQuery`) has tags only, and no counts.
 *
 * The matching itself follows production's sidebar search (client-web
 * `buildFlowStateSearchTerms`, server `buildSearchQuery`): the search text and
 * every selected value are joined into one query, and an item matches if it
 * holds ANY word of it. Selecting more widens the results; best matches first.
 *
 * - Words are whole, case-insensitive and split on spaces and punctuation, with
 *   no stop words or stemming, like the search index's default text fields. So
 *   a selected "Klimaat en energie" also matches on "en".
 * - The name counts 3×, tags and classifications 2×, other text 1×, and rarer
 *   words count for more. An approximation of the server's ranking.
 * - No typo tolerance: production only applies it to document and whiteboard
 *   content, which the prototype's mock items do not carry.
 * - Each facet value shows how many items it finds on its own.
 * - Values are ordered by how often they occur overall (then A–Z), so they don't
 *   jump around while you click.
 */

export type FacetedSearchItem = {
  id: string;
  name: string;
  tags: string[];
  classifications?: { label: string; values: string[] }[];
  /** Everything else that is searchable. */
  text: string[];
};

export type ActiveFilter = { group: string; value: string };

export type FacetValue = {
  group: string;
  value: string;
  /** Items this value finds on its own. */
  count: number;
  pressed: boolean;
};

export type Facet = {
  group: string;
  values: FacetValue[];
};

const TAGS_GROUP = 'Tags';

type SearchDocument<T> = {
  item: T;
  fields: { weight: number; words: Set<string> }[];
};

const wordsOf = (text: string) => text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];

const toDocument = <T extends FacetedSearchItem>(item: T): SearchDocument<T> => {
  const field = (weight: number, texts: string[]) => ({ weight, words: new Set(wordsOf(texts.join(' '))) });
  return {
    item,
    fields: [
      field(3, [item.name]),
      field(2, [...item.tags, ...(item.classifications ?? []).flatMap(c => c.values)]),
      field(1, item.text),
    ],
  };
};

/** The items holding any word of `query`, best match first. */
function search<T>(documents: SearchDocument<T>[], query: string) {
  const words = [...new Set(wordsOf(query))];
  const rarity = new Map(
    words.map(word => {
      const found = documents.filter(d => d.fields.some(f => f.words.has(word))).length;
      return [word, Math.log(1 + (documents.length - found + 0.5) / (found + 0.5))];
    })
  );

  return documents
    .map(({ item, fields }) => ({
      item,
      score: words.reduce(
        (total, word) =>
          total + fields.reduce((sum, f) => sum + (f.words.has(word) ? f.weight * rarity.get(word)! : 0), 0),
        0
      ),
    }))
    .filter(hit => hit.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(hit => hit.item);
}

function facetValuesOf(item: FacetedSearchItem) {
  return [
    ...item.tags.map(value => ({ group: TAGS_GROUP, value })),
    ...(item.classifications ?? []).flatMap(c => c.values.map(value => ({ group: c.label, value }))),
  ];
}

/**
 * @param items Keep this referentially stable between renders.
 * @param groupOrder Facet groups in display order. Without it: Tags, then
 *   classifications in the order they are first met.
 */
export function useFacetedSearch<T extends FacetedSearchItem>(items: T[], groupOrder?: readonly string[]) {
  const [searchText, setSearchText] = useState('');
  const [active, setActive] = useState<ActiveFilter[]>([]);

  const documents = useMemo(() => items.map(toDocument), [items]);

  const isActive = (group: string, value: string) => active.some(f => f.group === group && f.value === value);

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

  const visible = useMemo(() => {
    const query = [searchText, ...active.map(f => f.value)].join(' ');
    return wordsOf(query).length > 0 ? search(documents, query) : items;
  }, [items, documents, active, searchText]);

  const facets = useMemo<Facet[]>(() => {
    const totals = new Map<string, Map<string, number>>();
    for (const item of items) {
      for (const { group, value } of facetValuesOf(item)) {
        const values = totals.get(group) ?? new Map<string, number>();
        values.set(value, (values.get(value) ?? 0) + 1);
        totals.set(group, values);
      }
    }

    const groups = groupOrder ?? [TAGS_GROUP, ...[...totals.keys()].filter(g => g !== TAGS_GROUP)];
    return groups.flatMap(group => {
      const values = totals.get(group);
      if (!values) return [];
      return {
        group,
        values: [...values.entries()]
          .sort(([a, aTotal], [b, bTotal]) => bTotal - aTotal || a.localeCompare(b))
          .map(([value]) => ({
            group,
            value,
            count: search(documents, value).length,
            pressed: active.some(f => f.group === group && f.value === value),
          })),
      };
    });
  }, [items, documents, active, groupOrder]);

  return {
    searchText,
    setSearchText,
    active,
    isActive,
    toggle,
    clearAll,
    visible,
    facets,
    hasActive: active.length > 0 || searchText.trim().length > 0,
  };
}

export type FacetedSearch<T extends FacetedSearchItem = FacetedSearchItem> = ReturnType<typeof useFacetedSearch<T>>;

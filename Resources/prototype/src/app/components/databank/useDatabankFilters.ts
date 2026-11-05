import { useMemo, useState } from 'react';
import {
  DATABANK_FACET_GROUPS,
  type DatabankBlock,
  type DatabankInitiative,
} from '@/app/data/databank-data';

/**
 * Filter state for the Databank praktijkvoorbeelden tab.
 *
 * Follows production's sidebar search (client-web `buildFlowStateSearchTerms`,
 * server `buildSearchQuery`): the search text and every selected value are
 * joined into one query, and an initiative matches if it holds ANY word of it.
 * Selecting more widens the results; best matches come first.
 *
 * - Words are whole, case-insensitive and split on spaces and punctuation, with
 *   no stop words or stemming, like the search index's default text fields. So
 *   a selected "Klimaat en energie" also matches on "en".
 * - The name counts 3×, tags and classifications 2×, other text 1×, and rarer
 *   words count for more. An approximation of the server's ranking.
 * - No typo tolerance: production only applies it to document and whiteboard
 *   content, which initiatives do not have.
 * - Each facet chip shows how many initiatives that value finds on its own.
 * - Chips are ordered by how often the value occurs overall (then A–Z), so they
 *   don't jump around while you click.
 */

export type FacetGroup = (typeof DATABANK_FACET_GROUPS)[number];

export type ActiveFilter = { group: string; value: string };

export type FacetValue = {
  group: string;
  value: string;
  /** Initiatives this value finds on its own. */
  count: number;
  pressed: boolean;
};

export type Facet = {
  group: FacetGroup;
  values: FacetValue[];
};

type SearchDocument = {
  initiative: DatabankInitiative;
  fields: { weight: number; words: Set<string> }[];
};

const keyOf = (group: string, value: string) => `${group}\u0000${value}`;

/** Every `group + value` pair an initiative can be filtered by. */
export const facetKeysOf = (initiative: DatabankInitiative) => [
  ...initiative.tags.map(tag => keyOf('Tags', tag)),
  ...initiative.classifications.flatMap(c => c.values.map(value => keyOf(c.label, value))),
];

const wordsOf = (text: string) => text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];

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

const toSearchDocument = (initiative: DatabankInitiative): SearchDocument => {
  const field = (weight: number, texts: string[]) => ({ weight, words: new Set(wordsOf(texts.join(' '))) });
  return {
    initiative,
    fields: [
      field(3, [initiative.name]),
      field(2, [...initiative.tags, ...initiative.classifications.flatMap(c => c.values)]),
      field(1, [
        initiative.tagline,
        initiative.lead.name,
        ...initiative.sections.flatMap(s => [s.title, ...s.blocks.map(blockText)]),
        ...initiative.links.map(l => l.name),
      ]),
    ],
  };
};

/** The initiatives holding any word of `query`, best match first. */
function search(documents: SearchDocument[], query: string) {
  const words = [...new Set(wordsOf(query))];
  const rarity = new Map(
    words.map(word => {
      const found = documents.filter(d => d.fields.some(f => f.words.has(word))).length;
      return [word, Math.log(1 + (documents.length - found + 0.5) / (found + 0.5))];
    })
  );

  return documents
    .map(({ initiative, fields }) => ({
      initiative,
      score: words.reduce(
        (total, word) =>
          total + fields.reduce((sum, f) => sum + (f.words.has(word) ? f.weight * rarity.get(word)! : 0), 0),
        0
      ),
    }))
    .filter(hit => hit.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(hit => hit.initiative);
}

export function useDatabankFilters(initiatives: DatabankInitiative[]) {
  const [searchText, setSearchText] = useState('');
  const [active, setActive] = useState<ActiveFilter[]>([]);

  const documents = useMemo(() => initiatives.map(toSearchDocument), [initiatives]);

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

  const visible = useMemo(() => {
    const query = [searchText, ...active.map(f => f.value)].join(' ');
    return wordsOf(query).length > 0 ? search(documents, query) : initiatives;
  }, [initiatives, documents, active, searchText]);

  const facets = useMemo<Facet[]>(() => {
    const totals = new Map<string, number>();
    for (const i of initiatives) for (const k of facetKeysOf(i)) totals.set(k, (totals.get(k) ?? 0) + 1);

    return DATABANK_FACET_GROUPS.map(group => {
      const values = [...totals.keys()]
        .map(k => k.split('\u0000'))
        .filter(([g]) => g === group)
        .sort(([, a], [, b]) => totals.get(keyOf(group, b))! - totals.get(keyOf(group, a))! || a.localeCompare(b))
        .map(([, value]) => ({
          group,
          value,
          count: search(documents, value).length,
          pressed: active.some(f => f.group === group && f.value === value),
        }));
      return { group, values };
    }).filter(f => f.values.length > 0);
  }, [initiatives, documents, active]);

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

export type DatabankFilters = ReturnType<typeof useDatabankFilters>;

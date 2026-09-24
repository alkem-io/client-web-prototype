/**
 * Search overlay — production's `@/crd/components/search/SearchOverlay`.
 *
 * CRD ships the whole search module: the portal and backdrop, the tag input
 * with its scope selector, the category sidebar with scroll-spy, each result
 * section's filter dropdown and load-more button, and the empty / loading /
 * no-results states. It also ships the four result cards.
 *
 * So this file is now only the prototype's data and behaviour: the `useSearch`
 * context wiring, the mock `performSearch`, and the tag / scope / filter /
 * visible-count state. Results are mapped to CRD's exported card types (see
 * `app/mappers/searchResults.ts`) and handed to each category as `children`.
 *
 * Spaces reuse `SpaceCard` rather than a search-specific card, which is what
 * production does too — a space result is the same object everywhere.
 */
import { Building2, FileText, Globe, MessageSquare, Users } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  type SearchCategoryId,
  type SidebarCategory,
} from '@/crd/components/search/SearchCategorySidebar';
import { OrgResultCard } from '@/crd/components/search/OrgResultCard';
import { PostResultCard } from '@/crd/components/search/PostResultCard';
import { ResponseResultCard } from '@/crd/components/search/ResponseResultCard';
import {
  SearchOverlay as CrdSearchOverlay,
  type SearchOverlayCategory,
  type SearchOverlayState,
} from '@/crd/components/search/SearchOverlay';
import { UserResultCard } from '@/crd/components/search/UserResultCard';
import { SpaceCard } from '@/crd/components/space/SpaceCard';
import { toSpaceCard } from '@/app/mappers/spaceCard';
import {
  toOrgResult,
  toPostResult,
  toResponseResult,
  toUserResult,
} from '@/app/mappers/searchResults';
import { useSearch } from '@/app/contexts/SearchContext';
import { CATEGORY_LABELS, performSearch, type SearchResults } from './searchData';

const CATEGORY_ORDER: SearchCategoryId[] = ['spaces', 'posts', 'responses', 'users', 'organizations'];

const CATEGORY_ICONS: Record<SearchCategoryId, React.ComponentType<{ className?: string }>> = {
  spaces: Globe,
  posts: FileText,
  responses: MessageSquare,
  users: Users,
  organizations: Building2,
};

const SECTION_FILTERS: Partial<Record<SearchCategoryId, { value: string; label: string }[]>> = {
  spaces: [
    { value: 'all', label: 'All' },
    { value: 'spaces', label: 'Spaces only' },
    { value: 'subspaces', label: 'Subspaces only' },
  ],
  posts: [
    { value: 'all', label: 'All' },
    { value: 'whiteboard', label: 'Whiteboards' },
    { value: 'memo', label: 'Memos' },
  ],
  responses: [
    { value: 'all', label: 'All' },
    { value: 'post', label: 'Posts' },
    { value: 'whiteboard', label: 'Whiteboards' },
    { value: 'memo', label: 'Memos' },
  ],
};

const INITIAL_VISIBLE = 4;
const LOAD_MORE_COUNT = 4;
const SEARCH_DELAY_MS = 400;

const SPACE_NAMES: Record<string, string> = {
  'green-energy': 'Green Energy Space',
  'sustainability-lab': 'Sustainability Lab',
  'urban-mobility': 'Urban Mobility Lab',
  'ocean-health': 'Ocean Health Initiative',
};

/** The space the viewer is currently inside, which scopes the search. */
function useCurrentSpace(): { name: string; slug: string } | null {
  const { pathname } = useLocation();
  const match = pathname.match(/^\/space\/([^/]+)/);
  if (!match) return null;
  const slug = match[1];
  return { slug, name: SPACE_NAMES[slug] ?? slug };
}

export function SearchOverlay() {
  const { isOpen, closeSearch, initialQuery, initialScope, clearInitialQuery } = useSearch();
  const navigate = useNavigate();
  const currentSpace = useCurrentSpace();

  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [scope, setScope] = useState<'all' | string>('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [sectionFilters, setSectionFilters] = useState<Record<string, string>>({});
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});

  const resetVisibleCounts = () =>
    setVisibleCounts(Object.fromEntries(CATEGORY_ORDER.map(c => [c, INITIAL_VISIBLE])));

  const runSearch = useCallback(
    (tags: string[], searchScope: 'all' | string) => {
      if (tags.length === 0) {
        setResults(null);
        return;
      }
      setLoading(true);
      // Mock latency, so the loading state is actually reachable in the prototype.
      setTimeout(() => {
        setResults(performSearch(tags, searchScope));
        setLoading(false);
        resetVisibleCounts();
      }, SEARCH_DELAY_MS);
    },
    []
  );

  // Opening with a query from the Header runs the search immediately; opening
  // without one (the mobile search icon) just shows the empty state.
  useEffect(() => {
    if (!isOpen) {
      setSearchTags([]);
      setInputValue('');
      setResults(null);
      setSectionFilters({});
      setVisibleCounts({});
      setScope('all');
      return;
    }
    if (initialQuery) {
      const scopeToUse = initialScope || 'all';
      setScope(scopeToUse);
      setSearchTags([initialQuery]);
      setInputValue('');
      clearInitialQuery();
      runSearch([initialQuery], scopeToUse);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const addTag = (term: string) => {
    const next = [...searchTags, term];
    setSearchTags(next);
    setInputValue('');
    runSearch(next, scope);
  };

  const removeTag = (index: number) => {
    const next = searchTags.filter((_, i) => i !== index);
    setSearchTags(next);
    runSearch(next, scope);
  };

  const changeScope = (next: 'all' | string) => {
    setScope(next);
    if (searchTags.length > 0) runSearch(searchTags, next);
  };

  const goTo = (path: string) => {
    closeSearch();
    navigate(path);
  };

  /**
   * Apply a section's filter pill. The predicate only ever reads `type` and
   * `parent`, which not every result type declares, so it reads them through a
   * local widening rather than constraining the generic — constraining it to an
   * all-optional shape trips TypeScript's weak-type check for the result types
   * that have neither field (users, organizations).
   */
  const filterItems = useCallback(
    <T,>(category: SearchCategoryId, items: readonly T[]): T[] => {
      const filter = sectionFilters[category] ?? 'all';
      if (filter === 'all') return [...items];
      const parentOf = (i: T) => (i as { parent?: unknown }).parent;
      if (category === 'spaces') {
        if (filter === 'spaces') return items.filter(i => !parentOf(i));
        if (filter === 'subspaces') return items.filter(i => Boolean(parentOf(i)));
      }
      return items.filter(i => (i as { type?: string }).type === filter);
    },
    [sectionFilters]
  );

  /** How many results a section shows once its filter is applied. */
  const filteredCount = useCallback(
    (category: SearchCategoryId): number =>
      filterItems(category, (results?.[category] ?? []) as unknown[]).length,
    [filterItems, results]
  );

  const state: SearchOverlayState = loading
    ? 'loading'
    : !results
      ? 'empty'
      : CATEGORY_ORDER.every(c => (results[c]?.length ?? 0) === 0)
        ? 'no-results'
        : 'results';

  /** Render one category's visible slice as CRD result cards. */
  const renderCategory = (category: SearchCategoryId): React.ReactNode => {
    if (!results) return null;
    const visible = visibleCounts[category] ?? INITIAL_VISIBLE;

    switch (category) {
      case 'spaces':
        return filterItems(category, results.spaces)
          .slice(0, visible)
          .map(space => {
            const data = toSpaceCard(space);
            // SpaceCard is an <a>, so without an explicit handler the anchor
            // navigates but nothing closes the overlay — it would stay open on
            // top of the destination. `onClick` makes it behave like the other
            // four result types.
            return <SpaceCard key={space.id} space={data} onClick={() => goTo(data.href)} />;
          });
      case 'posts':
        return filterItems(category, results.posts)
          .slice(0, visible)
          .map(post => (
            <PostResultCard
              key={post.id}
              post={toPostResult(post)}
              onClick={() => goTo(`/space/${post.spaceSlug}`)}
            />
          ));
      case 'responses':
        return filterItems(category, results.responses)
          .slice(0, visible)
          .map(response => (
            <ResponseResultCard
              key={response.id}
              response={toResponseResult(response)}
              onClick={() => goTo(`/space/${response.spaceSlug}`)}
            />
          ));
      case 'users':
        return filterItems(category, results.users)
          .slice(0, visible)
          .map(user => {
            const data = toUserResult(user);
            return <UserResultCard key={user.id} user={data} onClick={() => goTo(data.href)} />;
          });
      case 'organizations':
        return filterItems(category, results.organizations)
          .slice(0, visible)
          .map(org => {
            const data = toOrgResult(org);
            return <OrgResultCard key={org.id} org={data} onClick={() => goTo(data.href)} />;
          });
    }
  };

  const sidebarCategories: SidebarCategory[] = useMemo(
    () =>
      CATEGORY_ORDER.map(id => ({
        id,
        label: CATEGORY_LABELS[id],
        icon: CATEGORY_ICONS[id],
        count: results?.[id]?.length ?? 0,
      })),
    [results]
  );

  // Only categories with results get a section; the sidebar still lists them all.
  const categories: SearchOverlayCategory[] = useMemo(
    () =>
      CATEGORY_ORDER.filter(id => (results?.[id]?.length ?? 0) > 0).map(id => {
        const total = filteredCount(id);
        const visible = visibleCounts[id] ?? INITIAL_VISIBLE;
        return {
          id,
          label: CATEGORY_LABELS[id],
          icon: CATEGORY_ICONS[id],
          count: results?.[id]?.length ?? 0,
          filterOptions: SECTION_FILTERS[id],
          activeFilter: sectionFilters[id] ?? 'all',
          onFilterChange: (value: string) =>
            setSectionFilters(prev => ({ ...prev, [id]: value })),
          hasMore: total > visible,
          onLoadMore: () =>
            setVisibleCounts(prev => ({ ...prev, [id]: (prev[id] ?? INITIAL_VISIBLE) + LOAD_MORE_COUNT })),
          children: renderCategory(id),
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [results, sectionFilters, visibleCounts, filterItems, filteredCount]
  );

  return (
    <CrdSearchOverlay
      isOpen={isOpen}
      onClose={closeSearch}
      state={state}
      tags={searchTags}
      inputValue={inputValue}
      onInputChange={setInputValue}
      onTagAdd={addTag}
      onTagRemove={removeTag}
      maxTags={5}
      scope={currentSpace ? { currentSpaceName: currentSpace.name, activeScope: scope } : undefined}
      onScopeChange={changeScope}
      categories={categories}
      allSidebarCategories={sidebarCategories}
      disclaimer="Results are limited to content you have access to."
      noResultsTerms={searchTags.join(', ')}
      onSearchAll={currentSpace ? () => changeScope('all') : undefined}
    />
  );
}

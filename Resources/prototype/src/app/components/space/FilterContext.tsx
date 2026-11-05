import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation } from "react-router";
import { type FacetedSearch, type FacetedSearchItem, useFacetedSearch } from "@/ahead/facetedSearch";

interface FilterContextValue {
  filters: FacetedSearch;
  /** The feed on screen reports its content here, so the sidebar's facets come from it. */
  setFeedItems: (items: FacetedSearchItem[]) => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [feedItems, setFeedItems] = useState<FacetedSearchItem[]>([]);
  const filters = useFacetedSearch(feedItems);

  // A search never leaks across tabs — same rule as production's flow states.
  const { pathname } = useLocation();
  const [searchedPathname, setSearchedPathname] = useState(pathname);
  if (searchedPathname !== pathname) {
    setSearchedPathname(pathname);
    filters.clearAll();
  }

  return (
    <FilterContext.Provider value={{ filters, setFeedItems }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useSpaceFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error("useSpaceFilters must be used within a FilterProvider");
  }
  return ctx.filters;
}

/** The parts of a post the feed search reads. */
type SearchablePost = {
  id: string;
  title: string;
  snippet?: string;
  author?: { name: string };
  tags?: string[];
  classifications?: { label: string; values: string[] }[];
  commentTexts?: string[];
  contentPreview?: {
    documents?: { title: string }[];
    items?: { title: string }[];
    whiteboards?: { title: string }[];
  };
};

const toSearchItem = (post: SearchablePost): FacetedSearchItem => ({
  id: post.id,
  name: post.title,
  tags: post.tags ?? [],
  classifications: post.classifications,
  text: [
    post.snippet ?? "",
    post.author?.name ?? "",
    ...(post.commentTexts ?? []),
    ...[
      ...(post.contentPreview?.documents ?? []),
      ...(post.contentPreview?.items ?? []),
      ...(post.contentPreview?.whiteboards ?? []),
    ].map((preview) => preview.title),
  ],
});

/**
 * Connects a feed to the sidebar search: reports the posts it is showing, and
 * returns the ones the search leaves, best match first. `posts` must be
 * referentially stable between renders.
 */
export function useFeedSearch<T extends SearchablePost>(posts: T[]): T[] {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error("useFeedSearch must be used within a FilterProvider");
  }
  const { filters, setFeedItems } = ctx;

  const items = useMemo(() => posts.map(toSearchItem), [posts]);
  useEffect(() => {
    setFeedItems(items);
    return () => setFeedItems([]);
  }, [items, setFeedItems]);

  return useMemo(() => {
    if (!filters.hasActive) return posts;
    const byId = new Map(posts.map((post) => [post.id, post]));
    return filters.visible.flatMap((item) => byId.get(item.id) ?? []);
  }, [posts, filters.hasActive, filters.visible]);
}

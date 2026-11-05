import { createContext, useContext, useState, type ReactNode } from "react";

interface FilterContextValue {
  searchValue: string;
  activeTags: string[];
  setSearchValue: (value: string) => void;
  toggleTag: (tag: string) => void;
  clearTags: () => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [searchValue, setSearchValue] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearTags = () => setActiveTags([]);

  return (
    <FilterContext.Provider
      value={{ searchValue, activeTags, setSearchValue, toggleTag, clearTags }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useSpaceFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error("useSpaceFilters must be used within a FilterProvider");
  }
  return ctx;
}

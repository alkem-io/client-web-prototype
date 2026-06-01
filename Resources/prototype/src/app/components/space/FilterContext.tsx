import { createContext, useContext, ReactNode, useState } from "react";

interface FilterContextType {
  searchValue: string;
  activeTag: string | null;
  setSearchValue: (value: string) => void;
  setActiveTag: (tag: string | null) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [searchValue, setSearchValue] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  return (
    <FilterContext.Provider value={{ searchValue, activeTag, setSearchValue, setActiveTag }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useSpaceFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useSpaceFilters must be used within a FilterProvider");
  }
  return context;
}

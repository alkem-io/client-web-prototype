import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from "react";

const MIN_WIDTH = 300;
const DEFAULT_WIDTH = 350;
const STORAGE_KEY = "alkemio-drawer-width";

interface SpaceChatDrawerContextType {
  isOpen: boolean;
  width: number;
  spaceSlug: string | null;
  openDrawer: (slug: string) => void;
  closeDrawer: () => void;
  toggleDrawer: (slug: string) => void;
  setWidth: (w: number) => void;
}

const SpaceChatDrawerContext = createContext<SpaceChatDrawerContextType | undefined>(undefined);

export function SpaceChatDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [spaceSlug, setSpaceSlug] = useState<string | null>(null);
  const [width, setWidthState] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed >= MIN_WIDTH) return parsed;
      }
    } catch {}
    return DEFAULT_WIDTH;
  });

  const openDrawer = useCallback((slug: string) => {
    setSpaceSlug(slug);
    setIsOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleDrawer = useCallback((slug: string) => {
    setIsOpen((prev) => {
      if (prev && spaceSlug === slug) return false;
      setSpaceSlug(slug);
      return true;
    });
  }, [spaceSlug]);

  const setWidth = useCallback((w: number) => {
    const maxWidth = typeof window !== "undefined" ? Math.floor(window.innerWidth * 0.5) : 600;
    const clamped = Math.max(MIN_WIDTH, Math.min(w, maxWidth));
    setWidthState(clamped);
    try {
      localStorage.setItem(STORAGE_KEY, String(clamped));
    } catch {}
  }, []);

  const value = useMemo(
    () => ({ isOpen, width, spaceSlug, openDrawer, closeDrawer, toggleDrawer, setWidth }),
    [isOpen, width, spaceSlug, openDrawer, closeDrawer, toggleDrawer, setWidth]
  );

  return (
    <SpaceChatDrawerContext.Provider value={value}>
      {children}
    </SpaceChatDrawerContext.Provider>
  );
}

export function useSpaceChatDrawer() {
  const context = useContext(SpaceChatDrawerContext);
  if (!context) {
    throw new Error("useSpaceChatDrawer must be used within a SpaceChatDrawerProvider");
  }
  return context;
}

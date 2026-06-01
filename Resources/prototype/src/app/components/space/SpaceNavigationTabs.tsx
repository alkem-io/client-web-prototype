import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface SpaceNavigationTabsProps {
  spaceSlug: string;
  actionButton?: React.ReactNode;
  onActiveTabChange?: (description: string) => void;
}

export const SPACE_TABS = [
  { 
    label: "Home", 
    href: "/home",
    description: "Activity and updates from members of this space."
  },
  { 
    label: "Community", 
    href: "/community",
    description: "Members and contributors in this space."
  },
  { 
    label: "Subspaces", 
    href: "/subspaces",
    description: "Focused collaboration areas within this space."
  },
  { 
    label: "Knowledge Base", 
    href: "/knowledge-base",
    description: "Curated resources, documents, and knowledge."
  },
];

export function SpaceNavigationTabs({ spaceSlug, actionButton, onActiveTabChange }: SpaceNavigationTabsProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const scrollRef = useRef<HTMLDivElement>(null);

  const tabs = SPACE_TABS.map(tab => ({
    ...tab,
    href: `/space/${spaceSlug}${tab.href === "/home" ? "" : tab.href}`
  }));

  const isActive = (href: string) => {
    if (href.endsWith(`/${spaceSlug}`)) {
      return currentPath === href;
    }
    return currentPath.startsWith(href);
  };

  useEffect(() => {
    if (scrollRef.current) {
      const activeTab = scrollRef.current.querySelector(
        '[data-active="true"]'
      );
      if (activeTab) {
        activeTab.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
    // Notify parent of active tab description
    const activeTabData = tabs.find(tab => isActive(tab.href));
    if (activeTabData && onActiveTabChange) {
      onActiveTabChange(activeTabData.description);
    }
  }, [currentPath]);

  return (
    <nav className="w-full">
      <div className="flex items-center justify-between gap-4">
        <div
          ref={scrollRef}
          className="flex items-center gap-6 overflow-x-auto scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] overscroll-x-contain"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {tabs.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              to={tab.href}
              data-active={active}
              className={cn(
                "pb-2 transition-all duration-200 whitespace-nowrap border-b-2 select-none",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
              )}
              style={{
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                fontFamily: "'Inter', sans-serif",
                lineHeight: "20px",
              }}
            >
              {tab.label}
            </Link>
          );
        })}
        </div>
        {actionButton && (
          <div className="shrink-0">
            {actionButton}
          </div>
        )}
      </div>
    </nav>
  );
}

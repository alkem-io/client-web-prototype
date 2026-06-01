import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { useDesignVariant } from "@/app/contexts/DesignVariantContext";
import { CONVERSATIONS } from "@/app/components/messaging/messagingData";

interface SpaceNavigationTabsProps {
  spaceSlug: string;
}

export function SpaceNavigationTabs({ spaceSlug }: SpaceNavigationTabsProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const scrollRef = useRef<HTMLDivElement>(null);
  const { variant } = useDesignVariant();

  // Find unread count for the Space channel
  const spaceChannel = CONVERSATIONS.find(
    (c) => c.type === "space" && c.spaceSlug === spaceSlug
  );
  const chatUnread = spaceChannel?.unread ?? 0;

  const baseTabs = [
    { label: "Home", href: `/space/${spaceSlug}` },
    { label: "Community", href: `/space/${spaceSlug}/community` },
    { label: "Subspaces", href: `/space/${spaceSlug}/subspaces` },
    { label: "Knowledge Base", href: `/space/${spaceSlug}/knowledge-base` },
  ];

  // Add CHAT tab for Variant C and Variant E
  const tabs =
    variant === "C" || variant === "E"
      ? [
          ...baseTabs,
          { label: "Chat", href: `/space/${spaceSlug}/chat`, isChatTab: true },
        ]
      : baseTabs;

  const isActive = (href: string) => {
    // Exact match for home, startsWith for others to handle sub-routes
    if (href.endsWith(`/${spaceSlug}`)) {
      return currentPath === href;
    }
    return currentPath.startsWith(href);
  };

  // Automatically scroll the active tab into view
  useEffect(() => {
    if (scrollRef.current) {
      const activeTab = scrollRef.current.querySelector('[data-active="true"]');
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentPath]);

  return (
    <nav className="w-full">
      <div 
        ref={scrollRef}
        className="flex items-center gap-6 overflow-x-auto px-4 scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] overscroll-x-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          const isChatTab = "isChatTab" in tab && tab.isChatTab;

          return (
            <Link
              key={tab.href}
              to={tab.href}
              data-active={active}
              className={cn(
                "pb-3 text-sm font-medium transition-all duration-200 whitespace-nowrap border-b-2 select-none flex items-center gap-1.5",
                active
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
              )}
            >
              {isChatTab && (
                <MessageCircle
                  style={{ width: 14, height: 14 }}
                  className={active ? "text-primary" : "text-muted-foreground"}
                />
              )}
              {tab.label}
              {/* Unread badge for Chat tab */}
              {isChatTab && chatUnread > 0 && !active && (
                <span
                  className="flex items-center justify-center rounded-full"
                  style={{
                    minWidth: 16,
                    height: 16,
                    padding: "0 4px",
                    fontSize: "10px",
                    fontWeight: 700,
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                    lineHeight: 1,
                  }}
                >
                  {chatUnread}
                </span>
              )}
              {/* Active dot for Chat tab when active and has unread */}
              {isChatTab && chatUnread > 0 && active && (
                <span
                  className="rounded-full"
                  style={{
                    width: 6,
                    height: 6,
                    background: "var(--primary)",
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
import { cn } from "@/lib/utils";

export interface CalloutTab {
  id: string;
  label: string;
  description?: string;
  count?: number;
  pinned?: boolean;
  linkedToNext?: boolean;
}

interface CalloutTabsProps {
  tabs: CalloutTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function CalloutTabs({
  tabs,
  activeTab,
  onTabChange,
}: CalloutTabsProps) {
  return (
    <nav className="w-full">
      <div
        className="flex items-center gap-6 overflow-x-auto scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] overscroll-x-contain"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <div key={tab.id} className="inline-flex items-start shrink-0">
              <button
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "pb-2 transition-all duration-200 whitespace-nowrap border-b-2 select-none inline-flex items-center gap-1.5",
                  isActive ? "font-semibold" : "",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                )}
                style={{
                  fontSize: 14,
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: "20px",
                }}
              >
              {tab.label}
              </button>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

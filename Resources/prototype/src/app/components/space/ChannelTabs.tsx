import { cn } from "@/lib/utils";
import { ChevronsRight } from "lucide-react";

export interface CalloutTab {
  id: string;
  label: string;
  description?: string;
  count?: number;
  pinned?: boolean;
  linkedToNext?: boolean;
}

function FlowArrow() {
  return (
    <ChevronsRight className="w-3.5 h-3.5 text-muted-foreground/40 mt-[3px] -ml-[13px] mr-[7px]" />
  );
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
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          return (
            <div key={tab.id} className="inline-flex items-start shrink-0">
              {index > 0 && tabs[index - 1]?.linkedToNext && (
                <FlowArrow />
              )}
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

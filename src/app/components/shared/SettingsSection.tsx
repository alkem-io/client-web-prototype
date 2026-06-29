import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type IconColor = 'primary' | 'purple' | 'orange' | 'green' | 'blue' | 'rose' | 'amber';

const ICON_COLORS: Record<IconColor, string> = {
  primary: "bg-primary/10 text-primary",
  purple: "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
  orange: "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
  green: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  rose: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
};

interface SettingsSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  iconColor?: IconColor;
  defaultOpen?: boolean;
  collapsible?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function SettingsSection({
  title,
  description,
  icon,
  iconColor = 'primary',
  defaultOpen = true,
  collapsible = true,
  children,
  className,
}: SettingsSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("rounded-lg border bg-card", className)}>
      <button
        type="button"
        onClick={() => collapsible && setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center gap-3 px-6 py-5 text-left",
          collapsible && "cursor-pointer hover:bg-muted/30 transition-colors",
          !collapsible && "cursor-default"
        )}
      >
        {icon && (
          <div className={cn("flex items-center justify-center w-9 h-9 rounded-lg shrink-0", ICON_COLORS[iconColor])}>
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-subsection-title font-semibold">{title}</h3>
          {description && (
            <p className="text-body text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {collapsible && (
          <ChevronDown
            className={cn(
              "w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        )}
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-6 pb-6 pt-0">
          {children}
        </div>
      </div>
    </div>
  );
}

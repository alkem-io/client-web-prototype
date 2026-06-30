import { Plus } from "lucide-react";
import { Card, CardContent } from "./card";
import { cn } from "@/lib/utils";

interface PlaceholderCardProps {
  label: string;
  description?: string;
  size?: "sm" | "lg";
  onClick: () => void;
  className?: string;
}

/**
 * Placeholder card for adding new items to a collection.
 * Used for responses (whiteboards, documents, etc.), resources, and other repeatable items.
 *
 * - sm: 160px height (default for most collections)
 * - lg: 280px height (for prominent create actions like spaces)
 */
export function PlaceholderCard({
  label,
  description,
  size = "sm",
  onClick,
  className,
}: PlaceholderCardProps) {
  const isLarge = size === "lg";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "group/create flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 bg-transparent hover:border-primary hover:bg-primary/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer w-full",
        isLarge ? "min-h-[280px]" : "min-h-[160px]",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-muted shadow-sm transition-colors group-hover/create:bg-background mb-3",
          isLarge ? "mb-4 size-12" : "mb-3 size-10"
        )}
      >
        <Plus
          aria-hidden="true"
          className={cn(
            "text-muted-foreground group-hover/create:text-primary transition-colors",
            isLarge ? "size-6" : "size-5"
          )}
        />
      </div>

      {isLarge ? (
        <h3 className="text-subsection-title font-semibold text-foreground transition-colors group-hover/create:text-primary">
          {label}
        </h3>
      ) : (
        <span className="text-body-emphasis font-medium text-foreground transition-colors group-hover/create:text-primary">
          {label}
        </span>
      )}

      {description ? (
        <p className="mt-2 max-w-[200px] text-center text-body text-muted-foreground">
          {description}
        </p>
      ) : null}
    </button>
  );
}

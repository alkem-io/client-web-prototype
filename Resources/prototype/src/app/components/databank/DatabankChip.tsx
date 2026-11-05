import type { ComponentProps } from 'react';
import { cn } from '@/crd/lib/utils';

/**
 * The pill used everywhere on the Databank tab.
 *
 * Geometry matches production's toggle tag chip (`CollapsibleTagList` in
 * interactive mode: `px-3 py-1.5 text-caption rounded-full`), so these sit
 * next to production's tag filters without looking like a second design.
 *
 * - `outline`: free tags (white, bordered)
 * - `filled`: classification values (soft fill)
 * - `more`: "Lees meer" / "+ N labels" expanders — an outline chip with a
 *   dashed border, so they read as part of the same set
 *
 * A pressed chip is filled with the primary colour. A disabled chip is muted
 * and dashed.
 */
type DatabankChipProps = ComponentProps<'button'> & {
  variant?: 'outline' | 'filled' | 'more';
  pressed?: boolean;
};

export function DatabankChip({
  variant = 'outline',
  pressed,
  disabled,
  className,
  children,
  ...props
}: DatabankChipProps) {
  return (
    <button
      type="button"
      aria-pressed={variant === 'more' ? undefined : pressed}
      disabled={disabled}
      className={cn(
        'inline-flex min-h-7 max-w-full items-center gap-1 rounded-full border px-3 py-1 text-left text-caption font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        disabled
          ? 'cursor-not-allowed border-dashed border-border bg-muted text-muted-foreground'
          : pressed
            ? 'border-primary bg-primary text-primary-foreground'
            : variant === 'filled'
              ? 'border-secondary bg-secondary text-secondary-foreground hover:border-primary'
              : variant === 'more'
                ? 'self-start border-dashed border-border bg-card text-foreground hover:border-primary'
                : 'border-border bg-card text-foreground hover:border-primary',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

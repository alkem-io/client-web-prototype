/**
 * OptionTiles — a single-select row of tinted icon tiles.
 *
 * Why not the chip row the redesign uses today: chips read as filters, so a row
 * of them looks multi-select even when only one can be active, and nothing in
 * the row says "you have already chosen — the choice is None". A radio group
 * says both. Built on the Radix radio primitive (the same one `ui/radio-group`
 * wraps) so arrow keys roam the row, `aria-checked` is real, and a screen
 * reader announces "3 of 9".
 *
 * The tiles are deliberately monochrome. Colour on the settings pages marks a
 * *section* — one hue per group, a handful per page. Nine tinted options in a
 * single row borrows that vocabulary without its restraint and reads as noise,
 * so the chips stay neutral and selection is the only thing colour says.
 *
 * Explanations do not live in tooltips. `onPreview` reports whichever option
 * the pointer or keyboard is on, and the caller prints that sentence in a fixed
 * slot under the row — one line of plain language, always on the surface.
 */
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/crd/lib/utils";
import type { OptionDef } from "./options";

interface OptionTilesProps<T extends string> {
  options: OptionDef<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Announced as the group name — every radiogroup needs one. */
  label: string;
  /** Reports the option under the pointer/focus, or null on leave. */
  onPreview?: (option: OptionDef<T> | null) => void;
  /** Tailwind grid-template columns; tiles wrap on narrow widths. */
  columns?: string;
  className?: string;
}

export function OptionTiles<T extends string>({
  options,
  value,
  onChange,
  label,
  onPreview,
  columns = "grid-cols-3 sm:grid-cols-5",
  className
}: OptionTilesProps<T>) {
  return (
    <RadioGroupPrimitive.Root
      value={value}
      onValueChange={next => onChange(next as T)}
      aria-label={label}
      onMouseLeave={() => onPreview?.(null)}
      onBlur={() => onPreview?.(null)}
      className={cn("grid gap-1", columns, className)}
    >
      {options.map(option => {
        const selected = option.id === value;
        return (
          <RadioGroupPrimitive.Item
            key={option.id}
            value={option.id}
            disabled={option.disabled}
            onMouseEnter={() => onPreview?.(option)}
            onFocus={() => onPreview?.(option)}
            className={cn(
              "group flex flex-col items-center gap-2 rounded-xl px-1 py-2 outline-none transition-colors",
              "focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              option.disabled
                ? "cursor-not-allowed opacity-40"
                : "cursor-pointer hover:bg-muted/50",
            )}
          >
            <span
              className={cn(
                "flex size-11 items-center justify-center rounded-2xl transition-all",
                selected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground group-hover:bg-muted-foreground/15 group-hover:text-foreground",
              )}
            >
              <option.icon className="size-5" />
            </span>
            <span
              className={cn(
                "text-center leading-tight",
                selected
                  ? "text-body-emphasis text-foreground"
                  : "text-caption text-muted-foreground",
              )}
            >
              {option.label}
            </span>
          </RadioGroupPrimitive.Item>
        );
      })}
    </RadioGroupPrimitive.Root>
  );
}

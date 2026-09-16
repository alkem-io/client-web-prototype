/**
 * optionStyles — the tinted icon chips the space settings pages use for their
 * section headers, reused for the group headers inside the settings dialogs.
 *
 * Colour marks a *group*, never an individual option: one hue per section, a
 * handful per screen. Tinting nine options in a row borrows the vocabulary
 * without the restraint that makes it work.
 *
 * Literal class strings on purpose: Tailwind only ships classes it can see in
 * the source, so `bg-${color}-100` would compile to nothing.
 */
export type OptionColor =
  | "neutral"
  | "primary"
  | "purple"
  | "blue"
  | "green"
  | "amber"
  | "rose"
  | "orange";

/** Resting chip — soft tint, coloured glyph. */
export const CHIP_REST: Record<OptionColor, string> = {
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  purple: "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  green: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  rose: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
  orange: "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
};

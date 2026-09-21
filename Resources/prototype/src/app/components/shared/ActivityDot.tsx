import { cn } from "@/lib/utils";

/**
 * Ambient "new activity" marker (spec 014). Deliberately unlike the notification
 * bell: primary colour, no count, inline with content. The count, where known,
 * goes to assistive tech through `label` instead.
 *
 * The expanding halo is what carries attention — the resting dot stays 6px, so
 * the indicator gains presence without gaining weight.
 */
export function ActivityDot({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn("relative inline-flex items-center justify-center shrink-0 w-1.5 h-1.5", className)}>
      <span
        aria-hidden="true"
        className="activity-dot-halo absolute inset-0 rounded-full bg-primary"
      />
      <span
        aria-hidden="true"
        className="activity-dot-core relative w-1.5 h-1.5 rounded-full bg-primary"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

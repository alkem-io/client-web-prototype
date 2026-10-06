import { cn } from "@/crd/lib/utils";

/**
 * ActivityDot — a small pulse marking what is new since your last visit.
 *
 * WHAT PRODUCTION WOULD GAIN
 * An ambient "new activity" marker (spec 014). Deliberately unlike the
 * notification bell: primary colour, no count, inline with content, right
 * after the name of whatever changed. The count, where known, goes to
 * assistive tech through `label` instead. The expanding halo is what carries
 * attention — the resting dot stays 6px, so the indicator gains presence
 * without gaining weight.
 *
 * It appears on My Spaces rows, Recent Spaces cards, space tabs, space and
 * subspace cards, and post cards.
 *
 * WHAT PRODUCTION NEEDS TO ADD
 * Production draws those names itself and leaves nothing beside them. The
 * upstream ask: an optional `nameSuffix` slot (anything shown right after the
 * name) on `SidebarResourceItem`, `CompactSpaceCard`, `SpaceNavigationTabs`'
 * `TabItem`, `SpaceCard`, `ExpandedSpaceCard` and `PostCard`.
 *
 * Until then the prototype places the dot with a temporary stand-in,
 * `app/components/shared/ActivityDotSlots`, which is not part of this ask and
 * is deleted once the slots exist.
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

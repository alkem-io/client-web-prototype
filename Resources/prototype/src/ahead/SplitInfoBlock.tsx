/**
 * SplitInfoBlock — production's sidebar InfoBlock, split in two.
 *
 * What: the dark About box keeps only the description, and the leads move to
 * their own sidebar widget directly below it, listed like the Subspaces widget
 * (heading, collapsible, picture + name + location per lead).
 *
 * Why: the leads took about half the box, so the description stopped after 3
 * lines. With the leads out, the box stays roughly the same height and shows
 * 9 lines before "Read more". Leads also become a widget a space can switch
 * off or move, like every other sidebar widget.
 *
 * Ask for client-web (`crd/components/space/sidebar/InfoBlock`):
 *   - make the leads section optional/separate (a `LeadsSection` widget), and
 *   - a `maxLines` prop (or 9 by default when there are no leads in the box).
 * Same look as production otherwise: bg-primary, p-5, body text at 1.6,
 * underlined "Read more" that expands in place, 32px avatars with location.
 */
import { ChevronDown, MapPin } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/crd/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/crd/primitives/avatar";

export function AboutBlock({ description, maxLines = 9 }: { description: string; maxLines?: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || expanded) return;
    setOverflowing(el.scrollHeight > el.clientHeight + 1);
  }, [description, expanded]);

  return (
    <div className="bg-primary text-primary-foreground rounded-lg p-5">
      <p
        ref={ref}
        className="text-body leading-[1.6] text-primary-foreground overflow-hidden"
        style={
          expanded
            ? undefined
            : { display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: maxLines }
        }
      >
        {description}
      </p>
      {overflowing && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-2 text-body-emphasis text-primary-foreground underline underline-offset-2 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

export type SidebarLead = {
  name: string;
  avatarUrl?: string;
  initials: string;
  location?: string;
};

export function LeadsList({ leads }: { leads: SidebarLead[] }) {
  const [collapsed, setCollapsed] = useState(false);
  if (leads.length === 0) return null;

  return (
    <div className="flex flex-col pt-2 pb-2">
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        aria-expanded={!collapsed}
        className="flex items-center gap-1 self-start mb-3 hover:text-foreground transition-colors"
      >
        <span className="text-caption text-muted-foreground uppercase tracking-wider">
          {leads.length === 1 ? "Lead" : "Leads"}
        </span>
        <ChevronDown className={cn("w-3 h-3 text-muted-foreground transition-transform", collapsed && "-rotate-90")} />
      </button>
      {!collapsed && (
        <ul className="flex flex-col gap-3">
          {leads.map((lead) => (
            <li key={lead.name} className="flex items-center gap-3 min-w-0">
              <Avatar className="w-8 h-8 shrink-0">
                {lead.avatarUrl && <AvatarImage src={lead.avatarUrl} alt={lead.name} />}
                <AvatarFallback className="text-badge">{lead.initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-body font-medium text-foreground truncate">{lead.name}</p>
                {lead.location && (
                  <p className="flex items-center gap-1 text-caption text-muted-foreground">
                    <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
                    <span className="truncate">{lead.location}</span>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

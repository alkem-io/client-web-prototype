import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/crd/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/crd/primitives/avatar";
import { Input } from "@/crd/primitives/input";

/**
 * Contributor picker — option B from the client-web#10065 exploration
 * (branch contributor-picker-suggestions).
 *
 * This is production's `@/crd/forms/ContributorSelector` with the one new
 * behaviour the ticket asks for: the results dropdown opens the moment you
 * click or focus the box and shows the whole community *before* you type, so a
 * Lead can pick "the people from the Utrecht workshop" without remembering
 * every name. Production's selector only shows results once `searchQuery` is
 * non-empty; everything else here — chip row, result-row look, tokens — mirrors
 * it so a dev can fold this back by adding an "open on focus" path there.
 *
 * Upstream ask: add a "show the full community on focus" mode to
 * `ContributorSelector` in client-web. Until then this lives in src/app/.
 */

export interface CommunityContributor {
  id: string;
  name: string;
  kind: "user" | "org" | "vc";
  role: "lead" | "member";
  location?: string;
  avatarUrl?: string;
}

interface ContributorPickerProps {
  /** Everyone in this space's community — the only people the picker lists. */
  community: CommunityContributor[];
  /** Selected contributor ids (controlled). */
  value: string[];
  onChange: (ids: string[]) => void;
  /** How many results to show before asking the user to keep typing. */
  limit?: number;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** The muted caption beneath a name: role + where they're from, or the kind. */
function subLine(c: CommunityContributor): string {
  if (c.kind === "org") return c.role === "lead" ? "Lead organization" : "Member organization";
  if (c.kind === "vc") return "Virtual contributor";
  const role = c.role === "lead" ? "Lead" : "Member";
  return c.location ? `${role} · ${c.location}` : role;
}

/** The small tag on the right of a row — only where it adds something. */
function typeTag(c: CommunityContributor): string | null {
  if (c.role === "lead") return "Lead";
  if (c.kind === "org") return "Organization";
  if (c.kind === "vc") return "Virtual contributor";
  return null;
}

/** Leads first, then alphabetical — matches the exploration's ordering. */
function byLeadThenName(a: CommunityContributor, b: CommunityContributor): number {
  if (a.role !== b.role) return a.role === "lead" ? -1 : 1;
  return a.name.localeCompare(b.name);
}

function ContributorAvatar({ c, size }: { c: CommunityContributor; size: string }) {
  const square = c.kind !== "user";
  return (
    <Avatar className={cn(size, square && "rounded-md")}>
      {c.avatarUrl && <AvatarImage src={c.avatarUrl} alt="" />}
      <AvatarFallback
        className={cn("text-badge", square && "rounded-md", c.kind === "vc" && "bg-primary text-primary-foreground")}
      >
        {getInitials(c.name)}
      </AvatarFallback>
    </Avatar>
  );
}

export function ContributorPicker({ community, value, onChange, limit = 50, className }: ContributorPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Close when focus or a click lands outside the whole picker.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const selected = new Set(value);
  const sorted = [...community].sort(byLeadThenName);
  const chips = value.map(id => community.find(c => c.id === id)).filter(Boolean) as CommunityContributor[];

  const trimmed = query.trim().toLowerCase();
  // The dropdown shows everyone not already picked; picked people live in the
  // chip row above instead (add-style, like production's ContributorSelector).
  const results = sorted.filter(c => !selected.has(c.id) && (!trimmed || c.name.toLowerCase().includes(trimmed)));
  const shown = results.slice(0, limit);
  const capped = results.length > limit;

  const pick = (id: string) => {
    onChange([...value, id]);
    setQuery("");
    setOpen(true); // keep the list open so the next person is one click away
    inputRef.current?.focus();
  };

  const remove = (id: string) => onChange(value.filter(x => x !== id));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      if (query) setQuery("");
      else setOpen(false);
    }
    if (e.key === "ArrowDown" && open) {
      e.preventDefault();
      wrapperRef.current?.querySelector<HTMLButtonElement>("[data-row]")?.focus();
    }
  };

  return (
    <div ref={wrapperRef} className={cn("flex flex-col gap-2", className)}>
      {chips.length > 0 && (
        <ul className="flex flex-wrap gap-2" role="list">
          {chips.map(c => (
            <li key={c.id}>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-input-background py-1 pl-1 pr-1">
                <ContributorAvatar c={c} size="size-6" />
                <span className="text-control max-w-[14rem] truncate" title={c.name}>
                  {c.name}
                </span>
                <button
                  type="button"
                  onClick={() => remove(c.id)}
                  aria-label={`Remove ${c.name}`}
                  className="rounded-full p-0.5 hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                >
                  <X className="size-3" aria-hidden="true" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search members…"
          aria-label="Search this community"
          aria-expanded={open}
          aria-haspopup="listbox"
          autoComplete="off"
          className={cn("pl-9", query && "pr-9")}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="absolute right-1 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:outline-none"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}

        {open && (
          // preventDefault on mousedown keeps the input focused while you click
          // a row, so the dropdown stays put and you can pick the next person.
          <div
            className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-md border border-border bg-popover shadow-md"
            onMouseDown={e => e.preventDefault()}
          >
            {results.length === 0 ? (
              <p className="p-3 text-control text-muted-foreground">
                {trimmed
                  ? `No one in this community matches “${query.trim()}”.`
                  : "Everyone in this community is already selected."}
              </p>
            ) : (
              <ul className="py-1" role="listbox">
                {shown.map(c => {
                  const tag = typeTag(c);
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        data-row
                        onClick={() => pick(c.id)}
                        className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                      >
                        <ContributorAvatar c={c} size="size-8" />
                        <div className="flex min-w-0 flex-1 flex-col">
                          <span className="text-control truncate">{c.name}</span>
                          <span className="text-caption text-muted-foreground truncate">{subLine(c)}</span>
                        </div>
                        {tag && (
                          <span
                            className={cn(
                              "shrink-0 rounded-full border px-2 py-0.5 text-badge",
                              c.role === "lead" ? "border-foreground text-foreground" : "border-border text-muted-foreground"
                            )}
                          >
                            {tag}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
                {capped && (
                  <li className="border-t border-border px-3 py-2 text-center text-caption text-muted-foreground">
                    Showing {limit} of {results.length}. Keep typing to narrow it down.
                  </li>
                )}
              </ul>
            )}
          </div>
        )}
      </div>

      <p className="text-caption text-muted-foreground">Click the box to see everyone, or type a name.</p>
    </div>
  );
}

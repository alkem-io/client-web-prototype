import { Link } from "react-router";
import { Globe, Lock, ArrowRight, Building2, UserCheck } from "lucide-react";

/**
 * RichSubspaceCard — the "rich" variant of a subspace card.
 *
 * It is the existing SpaceCard identity column (banner, avatar, title, tagline,
 * tags, leads footer, open-subspace action) PLUS a What / Why / Who panel sourced
 * from the subspace's own About info-panel fields. Users can embed it inside a
 * post so people understand what a subspace is about before opening it.
 *
 * Each section body is long-form and clamped to a few lines with an ellipsis, so
 * two cards stay comparable at a glance. Layout is a container-query split:
 * side-by-side when the surrounding column is wide, stacked (identity on top)
 * when narrow — so it works in a 1- or 2-column feed and on mobile.
 */

export interface RichSubspaceLead {
  name: string;
  initials: string;
  color: string;
  type: "person" | "org";
}

export interface RichSubspaceCardData {
  slug: string;
  name: string;
  parentName: string;
  parentSlug: string;
  tagline: string;
  bannerImage?: string;
  avatarInitials: string;
  avatarColor: string;
  isPrivate: boolean;
  isMember?: boolean;
  tags: string[];
  /** Count of tags beyond those in `tags` (renders a "+N" chip). */
  extraTagCount?: number;
  leads: RichSubspaceLead[];
  /** About info-panel fields — long-form, paragraphs separated by blank lines. */
  what: string;
  why: string;
  who: string;
}

interface RichSubspaceCardProps {
  subspace: RichSubspaceCardData;
  className?: string;
}

function LeadAvatar({ lead }: { lead: RichSubspaceLead }) {
  return (
    <div
      className={`grid place-items-center text-[9.5px] font-bold text-white ring-2 ring-card ${
        lead.type === "org" ? "rounded-[7px]" : "rounded-full"
      }`}
      style={{ width: 26, height: 26, background: lead.color }}
      title={`${lead.name} (${lead.type})`}
    >
      {lead.initials}
    </div>
  );
}

/** Section: bold label + hairline rule header, then clamped long-form body. */
function QaBlock({ label, children }: { label: string; children: string }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="shrink-0 text-[13px] font-semibold uppercase tracking-[0.04em] text-foreground">{label}</span>
        <span className="flex-1 h-px bg-border" />
      </div>
      <p className="mt-2.5 whitespace-pre-line text-[14px] leading-relaxed text-muted-foreground line-clamp-5">
        {children}
      </p>
    </div>
  );
}

export function RichSubspaceCard({ subspace, className }: RichSubspaceCardProps) {
  const href = `/space/${subspace.parentSlug}/subspaces/${subspace.slug}`;
  const visibleLeads = subspace.leads.slice(0, 4);

  return (
    <div className={`@container ${className ?? ""}`}>
      <article
        className="flex flex-col @[520px]:flex-row overflow-hidden rounded-xl bg-card"
        style={{ border: "1px solid var(--border)" }}
      >
        {/* ── Identity column (the current SpaceCard) ── */}
        <div className="flex flex-col border-b @[520px]:border-b-0 @[520px]:border-r border-border @[520px]:w-[320px] @[520px]:shrink-0">
          {/* Banner */}
          <div className="relative overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
            {subspace.bannerImage ? (
              <img src={subspace.bannerImage} alt={subspace.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full" style={{ background: "linear-gradient(135deg, #0E7490 0%, #0F766E 52%, #15803D 100%)" }} />
            )}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, color-mix(in srgb, var(--foreground) 25%, transparent) 0%, transparent 52%)" }}
            />
            {subspace.isMember && (
              <div
                className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 backdrop-blur-sm"
                style={{ background: "color-mix(in srgb, var(--card) 90%, transparent)" }}
              >
                <UserCheck className="w-3 h-3 text-primary" aria-hidden="true" />
                <span className="text-badge uppercase text-foreground">Member</span>
              </div>
            )}
            <div
              className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 backdrop-blur-sm"
              style={{ background: "color-mix(in srgb, var(--card) 86%, transparent)" }}
            >
              {subspace.isPrivate ? (
                <Lock className="w-3 h-3 text-foreground" aria-hidden="true" />
              ) : (
                <Globe className="w-3 h-3 text-foreground" aria-hidden="true" />
              )}
              <span className="text-badge uppercase text-foreground">{subspace.isPrivate ? "Private" : "Public"}</span>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col flex-1 px-4">
            <div
              className="relative z-10 grid place-items-center text-white font-bold text-[15px]"
              style={{ width: 46, height: 46, marginTop: -26, borderRadius: 11, background: subspace.avatarColor, boxShadow: "0 0 0 3px var(--card), var(--elevation-sm)" }}
            >
              {subspace.avatarInitials}
            </div>

            <h3 className="mt-2.5 text-card-title text-card-foreground">
              <Link to={href} className="hover:text-primary transition-colors outline-none focus-visible:underline">
                {subspace.name}
              </Link>
            </h3>

            <p className="mt-1 flex items-center gap-1.5 text-caption text-muted-foreground">
              <Building2 className="w-3 h-3 shrink-0" style={{ color: "var(--muted-foreground)", opacity: 0.7 }} aria-hidden="true" />
              <span className="truncate">{subspace.parentName}</span>
            </p>

            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{subspace.tagline}</p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {subspace.tags.map((tag) => (
                <span key={tag} className="text-badge px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                  {tag}
                </span>
              ))}
              {!!subspace.extraTagCount && (
                <span className="text-badge px-2 py-0.5 rounded-full bg-muted text-muted-foreground">+{subspace.extraTagCount}</span>
              )}
            </div>

            {/* Footer region pinned to the bottom: LEADS row + Open subspace action */}
            <div className="mt-auto pt-4">
              <div className="flex items-center gap-2 -mx-4 px-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                <span className="text-badge uppercase text-muted-foreground">Leads</span>
                <div className="flex -space-x-2">
                  {visibleLeads.map((lead) => (
                    <LeadAvatar key={lead.name} lead={lead} />
                  ))}
                </div>
              </div>
              <div className="pt-4 pb-4">
                <Link
                  to={href}
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Open subspace
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Content panel (What / Why / Who) ── */}
        <div className="flex flex-col flex-1 min-w-0 gap-5 px-6 py-6">
          <QaBlock label="What">{subspace.what}</QaBlock>
          <QaBlock label="Why">{subspace.why}</QaBlock>
          <QaBlock label="Who">{subspace.who}</QaBlock>
        </div>
      </article>
    </div>
  );
}

import { Link } from "react-router";
import { Lock, Globe, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/contexts/LanguageContext";

export interface SpaceLead {
  name: string;
  avatar: string;
  type: "person" | "org";
}

export interface SpaceCardData {
  id: string;
  slug: string;
  name: string;
  description: string;
  bannerImage?: string;
  avatar?: string;
  initials: string;
  avatarColor: string;
  isPrivate: boolean;
  tags: string[];
  memberCount: number;
  leads: SpaceLead[];
  /** If this is a subspace, provide parent info */
  parent?: {
    name: string;
    slug: string;
    bannerImage?: string;
    avatar?: string;
    initials: string;
    avatarColor: string;
  };
}

interface SpaceCardProps {
  space: SpaceCardData;
  className?: string;
  compact?: boolean;
}

export function SpaceCard({ space, className, compact = false }: SpaceCardProps) {
  const href = space.parent
    ? `/space/${space.parent.slug}/subspaces/${space.slug}`
    : `/space/${space.slug}`;

  const maxVisibleLeads = 4;
  const visibleLeads = space.leads.slice(0, maxVisibleLeads);
  const overflowCount = space.leads.length - maxVisibleLeads;

  const { t } = useLanguage();

  if (compact) {
    return (
      <Link to={href} className={cn("group block outline-none", className)}>
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "var(--elevation-sm)";
            e.currentTarget.style.borderColor = "color-mix(in srgb, var(--primary) 30%, var(--border))";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          {/* Avatar */}
          <Avatar className="w-10 h-10 shrink-0 rounded-lg">
            {space.avatar ? (
              <AvatarImage src={space.avatar} alt={space.name} className="object-cover" />
            ) : null}
            <AvatarFallback
              className="rounded-lg text-xs font-semibold text-white"
              style={{ background: space.avatarColor }}
            >
              {space.initials}
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {space.name}
            </h3>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {space.description}
            </p>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span>{space.memberCount}</span>
            </div>
            {space.isPrivate && <Lock className="w-3.5 h-3.5 text-muted-foreground" />}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={href} className={cn("group block h-full outline-none", className)}>
      <div
        className="h-full flex flex-col rounded-xl transition-all duration-300"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          boxShadow: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "var(--elevation-sm)";
          e.currentTarget.style.borderColor = "color-mix(in srgb, var(--primary) 30%, var(--border))";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = "var(--border)";
        }}
      >
        {/* Banner Image */}
        <div className="relative" style={{ zIndex: 0 }}>
          <div className="overflow-hidden rounded-t-xl" style={{ aspectRatio: "16 / 9" }}>
            {space.bannerImage ? (
              <img
                src={space.bannerImage}
                alt={space.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background: "linear-gradient(135deg, var(--muted) 0%, var(--accent) 100%)",
                }}
              />
            )}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top, color-mix(in srgb, var(--foreground) 25%, transparent) 0%, transparent 50%)",
              }}
            />
          </div>

          {/* Privacy badge */}
          <div className="absolute top-3 right-3" style={{ zIndex: 3 }}>
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-full backdrop-blur-sm text-badge"
              style={{
                background: space.isPrivate
                  ? "color-mix(in srgb, var(--foreground) 50%, transparent)"
                  : "color-mix(in srgb, var(--background) 85%, transparent)",
                color: space.isPrivate ? "var(--primary-foreground)" : "var(--foreground)",
              }}
            >
              {space.isPrivate ? (
                <Lock style={{ width: 10, height: 10 }} />
              ) : (
                <Globe style={{ width: 10, height: 10 }} />
              )}
              <span>{space.isPrivate ? t("common.private") : t("common.public")}</span>
            </div>
          </div>


        </div>

        {/* Card Body */}
        <div className="flex flex-col flex-1" style={{ padding: "16px 16px 0" }}>
          {/* Name */}
          <h3
            className="truncate transition-colors duration-200 text-card-title"
            style={{
              color: "var(--card-foreground)",
            }}
          >
            {space.name}
          </h3>

          {/* Parent indicator for subspaces */}
          {space.parent && (
            <p
              className="truncate text-caption"
              style={{
                color: "var(--muted-foreground)",
                marginTop: 2,
              }}
            >
              {t("common.in")}:{" "}
              <span
                className="hover:underline"
                style={{ color: "var(--muted-foreground)" }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/space/${space.parent!.slug}`;
                }}
              >
                {space.parent.name}
              </span>
            </p>
          )}

          {/* Description */}
          <p
            className="line-clamp-2 text-body"
            style={{
              color: "var(--muted-foreground)",
              marginTop: 8,
            }}
          >
            {space.description}
          </p>

          {/* Tags */}
          {space.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5" style={{ marginTop: 10 }}>
              {space.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-badge"
                  style={{
                    padding: "2px 8px",
                    borderRadius: "999px",
                    background: "var(--secondary)",
                    color: "var(--secondary-foreground)",
                  }}
                >
                  {tag}
                </span>
              ))}
              {space.tags.length > 3 && (
                <span
                  className="text-badge"
                  style={{
                    padding: "2px 8px",
                    borderRadius: "999px",
                    background: "var(--muted)",
                    color: "var(--muted-foreground)",
                  }}
                >
                  +{space.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer — Leads + Member count */}
        <div
          className="flex items-center justify-between mt-auto"
          style={{
            padding: "12px 16px",
            marginTop: 12,
            borderTop: "1px solid var(--border)",
          }}
        >
          {/* Lead Avatars */}
          <div className="flex items-center gap-2">
            <span
              className="text-badge uppercase"
              style={{
                color: "var(--muted-foreground)",
              }}
            >
              {t("common.leads")}
            </span>
            <div className="flex -space-x-2">
              {visibleLeads.map((lead, i) => (
                <Avatar
                  key={i}
                  className="border-2"
                  style={{
                    width: 26,
                    height: 26,
                    borderColor: "var(--card)",
                  }}
                  title={`${lead.name} (${lead.type})`}
                >
                  <AvatarImage src={lead.avatar} alt={lead.name} />
                  <AvatarFallback
                    style={{
                      fontSize: "9px",
                      fontWeight: 600,
                      background: lead.type === "org" ? "var(--accent)" : "var(--secondary)",
                      color: lead.type === "org" ? "var(--accent-foreground)" : "var(--secondary-foreground)",
                    }}
                  >
                    {lead.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {overflowCount > 0 && (
                <div
                  className="flex items-center justify-center border-2 rounded-full"
                  style={{
                    width: 26,
                    height: 26,
                    borderColor: "var(--card)",
                    background: "var(--muted)",
                    fontSize: "9px",
                    fontWeight: 600,
                    color: "var(--muted-foreground)",
                  }}
                >
                  +{overflowCount}
                </div>
              )}
            </div>
          </div>


        </div>
      </div>
    </Link>
  );
}

/** Skeleton placeholder for loading state */
export function SpaceCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-xl animate-pulse"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Banner skeleton */}
      <div style={{ aspectRatio: "16 / 9", background: "var(--muted)" }} />

      {/* Body skeleton */}
      <div style={{ padding: "24px 16px 0" }}>
        <div
          className="rounded"
          style={{ width: "70%", height: 14, background: "var(--muted)", marginBottom: 8 }}
        />
        <div
          className="rounded"
          style={{ width: "100%", height: 12, background: "var(--muted)", marginBottom: 4 }}
        />
        <div
          className="rounded"
          style={{ width: "60%", height: 12, background: "var(--muted)", marginBottom: 12 }}
        />
        <div className="flex gap-1.5">
          <div className="rounded-full" style={{ width: 48, height: 18, background: "var(--muted)" }} />
          <div className="rounded-full" style={{ width: 56, height: 18, background: "var(--muted)" }} />
        </div>
      </div>

      {/* Footer skeleton */}
      <div
        className="flex items-center justify-between"
        style={{ padding: "12px 16px", marginTop: 12, borderTop: "1px solid var(--border)" }}
      >
        <div className="flex -space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-full border-2"
              style={{ width: 26, height: 26, background: "var(--muted)", borderColor: "var(--card)" }}
            />
          ))}
        </div>
        <div className="rounded" style={{ width: 40, height: 12, background: "var(--muted)" }} />
      </div>
    </div>
  );
}
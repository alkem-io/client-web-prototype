import React from "react";
import { Link } from "react-router";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/app/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OrgHoverCardData {
  name: string;
  avatarUrl?: string | null;
  initials?: string;
  location?: string;
  description?: string;
  tags?: string[];
  profileUrl?: string;
}

interface OrgHoverCardProps {
  org: OrgHoverCardData;
  children: React.ReactNode;
  sideOffset?: number;
  align?: "start" | "center" | "end";
  openDelay?: number;
  closeDelay?: number;
}

const MAX_VISIBLE_TAGS = 4;

export function OrgHoverCard({
  org,
  children,
  sideOffset = 8,
  align = "center",
  openDelay = 200,
  closeDelay = 0,
}: OrgHoverCardProps) {
  const profileUrl = org.profileUrl || `/organization/${org.name.toLowerCase().replace(/\s+/g, "-")}`;
  const visibleTags = org.tags?.slice(0, MAX_VISIBLE_TAGS) ?? [];
  const overflowCount = (org.tags?.length ?? 0) - MAX_VISIBLE_TAGS;

  return (
    <HoverCard openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent
        className="w-72 p-0 overflow-hidden"
        sideOffset={sideOffset}
        align={align}
      >
        <Link
          to={profileUrl}
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
        >
          <div className="p-4 pb-3">
            <div className="flex items-start gap-3">
              <Avatar
                className="w-14 h-14 shrink-0"
                style={{
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border)",
                }}
              >
                {org.avatarUrl && (
                  <AvatarImage
                    src={org.avatarUrl}
                    alt={org.name}
                    style={{ borderRadius: "var(--radius)" }}
                  />
                )}
                <AvatarFallback
                  className="text-caption font-bold"
                  style={{
                    borderRadius: "var(--radius)",
                    background: "color-mix(in srgb, var(--info) 15%, transparent)",
                    color: "var(--info)",
                  }}
                >
                  {org.initials || org.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 pt-0.5">
                <h4 className="text-body-emphasis font-semibold text-foreground leading-tight line-clamp-2">
                  {org.name}
                </h4>
                {org.location && (
                  <div className="flex items-center gap-1.5 mt-1 text-caption text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{org.location}</span>
                  </div>
                )}
              </div>
            </div>

            {org.description && (
              <p className="mt-3 text-caption text-muted-foreground line-clamp-2 leading-relaxed">
                {org.description}
              </p>
            )}

            {visibleTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {visibleTags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 text-caption font-medium rounded-full",
                      "bg-muted text-muted-foreground border border-border"
                    )}
                  >
                    {tag}
                  </span>
                ))}
                {overflowCount > 0 && (
                  <span className="text-caption text-muted-foreground font-medium px-1">
                    +{overflowCount}
                  </span>
                )}
              </div>
            )}
          </div>
        </Link>
      </HoverCardContent>
    </HoverCard>
  );
}

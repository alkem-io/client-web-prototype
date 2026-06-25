import React from "react";
import { Link } from "react-router";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/app/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Building2, Users, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OrgHoverCardData {
  name: string;
  avatarUrl?: string | null;
  initials?: string;
  type?: string;
  description?: string;
  memberCount?: number;
  website?: string;
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

export function OrgHoverCard({
  org,
  children,
  sideOffset = 8,
  align = "center",
  openDelay = 200,
  closeDelay = 0,
}: OrgHoverCardProps) {
  const profileUrl = org.profileUrl || `/organization/${org.name.toLowerCase().replace(/\s+/g, "-")}`;

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
                className="w-12 h-12 shrink-0"
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
                {org.type && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 mt-1 text-caption font-medium rounded-full",
                      "border"
                    )}
                    style={{
                      color: "var(--info)",
                      background: "color-mix(in srgb, var(--info) 10%, transparent)",
                      borderColor: "color-mix(in srgb, var(--info) 20%, transparent)",
                    }}
                  >
                    <Building2 className="w-3 h-3" />
                    {org.type}
                  </span>
                )}
              </div>
            </div>

            {org.description && (
              <p className="mt-3 text-caption text-muted-foreground line-clamp-2 leading-relaxed">
                {org.description}
              </p>
            )}

            {org.memberCount != null && (
              <div className="flex items-center gap-1.5 mt-3 text-caption text-muted-foreground">
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span>{org.memberCount} members</span>
              </div>
            )}
          </div>
        </Link>

        {org.website && (
          <div className="px-4 pb-4 -mt-1">
            <a
              href={org.website}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center justify-center gap-2 w-full px-3 py-1.5 rounded-md text-caption font-medium",
                "border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Visit website
            </a>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}

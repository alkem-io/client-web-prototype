import React from "react";
import { Link } from "react-router";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/app/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VCHoverCardData {
  name: string;
  avatarUrl?: string | null;
  initials?: string;
  description?: string;
  tags?: string[];
  hostName?: string;
  profileUrl?: string;
}

interface VCHoverCardProps {
  vc: VCHoverCardData;
  children: React.ReactNode;
  sideOffset?: number;
  align?: "start" | "center" | "end";
  openDelay?: number;
  closeDelay?: number;
}

const MAX_VISIBLE_TAGS = 4;

export function VCHoverCard({
  vc,
  children,
  sideOffset = 8,
  align = "center",
  openDelay = 200,
  closeDelay = 0,
}: VCHoverCardProps) {
  const profileUrl = vc.profileUrl || `/vc/${vc.name.toLowerCase().replace(/\s+/g, "-")}`;
  const visibleTags = vc.tags?.slice(0, MAX_VISIBLE_TAGS) ?? [];
  const overflowCount = (vc.tags?.length ?? 0) - MAX_VISIBLE_TAGS;

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
              <Avatar className="w-11 h-11 shrink-0 border border-border">
                {vc.avatarUrl && (
                  <AvatarImage src={vc.avatarUrl} alt={vc.name} />
                )}
                <AvatarFallback className="text-caption font-bold bg-muted">
                  {vc.initials || vc.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 pt-0.5">
                <h4 className="text-body-emphasis font-semibold text-foreground leading-tight">
                  {vc.name}
                </h4>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 mt-1 text-caption font-medium",
                    "text-muted-foreground"
                  )}
                >
                  <Bot className="w-3 h-3" />
                  Virtual Contributor
                </span>
              </div>
            </div>

            {vc.description && (
              <p className="mt-3 text-caption text-muted-foreground line-clamp-2 leading-relaxed">
                {vc.description}
              </p>
            )}

            {vc.hostName && (
              <p className="mt-2 text-caption text-muted-foreground">
                Hosted by <span className="font-medium text-foreground">{vc.hostName}</span>
              </p>
            )}

            {visibleTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {visibleTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-caption border border-border text-muted-foreground bg-muted/40"
                  >
                    {tag}
                  </span>
                ))}
                {overflowCount > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-caption text-muted-foreground">
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

import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Activity,
  FileText,
  Layers,
  MessageSquarePlus,
  UserPlus,
  Clock
} from "lucide-react";
import { Badge } from "@/crd/primitives/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/crd/primitives/avatar";
import { cn } from "@/crd/lib/utils";
import { useActivityIndicators } from "@/app/contexts/ActivityIndicatorsContext";
import {
  SPACE_CHANGES,
  activityAge,
  type ChangeKind,
  type SpaceRelation
} from "@/app/data/activity-data";

type ScopeKey = "all" | "mine" | "member" | "lead";

const SCOPES: { key: ScopeKey; label: string; matches: (r: SpaceRelation) => boolean }[] = [
  { key: "all", label: "All", matches: () => true },
  { key: "mine", label: "In my spaces", matches: (r) => r === "member" || r === "lead" },
  { key: "member", label: "Spaces I'm a member of", matches: (r) => r === "member" },
  { key: "lead", label: "Spaces I lead", matches: (r) => r === "lead" },
];

const KIND_ICON: Record<ChangeKind, React.ReactNode> = {
  post: <FileText className="w-3 h-3" />,
  contribution: <MessageSquarePlus className="w-3 h-3" />,
  callout: <MessageSquarePlus className="w-3 h-3" />,
  subspace: <Layers className="w-3 h-3" />,
  member: <UserPlus className="w-3 h-3" />
};

export function SpaceActivityPanel({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const [scope, setScope] = useState<ScopeKey>("all");
  const { hasContainerActivity, visitContainer } = useActivityIndicators();

  const active = SCOPES.find((s) => s.key === scope) ?? SCOPES[0];
  const visible = SPACE_CHANGES.filter((c) => active.matches(c.relation));

  const open = (href: string, containerId: string) => {
    visitContainer(containerId);
    onNavigate?.();
    navigate(href);
  };

  return (
    <>
      <div
        className="shrink-0 flex items-center gap-2 px-5 md:px-6 py-3 overflow-x-auto"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {SCOPES.map((s) => (
          <button
            key={s.key}
            onClick={() => setScope(s.key)}
            className={cn(
              "px-3 py-1.5 rounded-md transition-colors whitespace-nowrap text-control",
              scope === s.key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {visible.length > 0 ? (
          visible.map((c) => {
            const isNew = hasContainerActivity(c.containerId);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => open(c.href, c.containerId)}
                className={cn(
                  "w-full text-left flex gap-4 px-5 md:px-6 py-4 transition-colors hover:bg-muted/50",
                  isNew && "bg-primary/5 hover:bg-primary/10"
                )}
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                {/* self-start stops the wrapper stretching to row height, which
                    would anchor the badge to the row rather than the avatar. */}
                <div className="relative shrink-0 self-start">
                  <Avatar
                    className="w-10 h-10 rounded-lg"
                    style={{ border: "1px solid var(--border)" }}
                  >
                    <AvatarImage src={c.spaceAvatar} alt="" className="object-cover" />
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-caption font-bold">
                      {c.spaceInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className="absolute -bottom-1 -right-1 rounded-full p-0.5"
                    style={{
                      background: "var(--primary)",
                      color: "var(--primary-foreground)",
                      border: "2px solid var(--background)"
                    }}
                  >
                    {KIND_ICON[c.kind]}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-body leading-snug">
                    <span className="font-semibold">{c.summary}</span> in{" "}
                    <span className="font-medium">{c.spaceName}</span>
                  </p>
                  <p className="text-caption text-muted-foreground mt-0.5 truncate">{c.detail}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-caption text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {activityAge(c.containerId) || "recently"}
                    </span>
                    {c.relation === "lead" && (
                      <Badge variant="secondary" className="text-caption">
                        You lead this
                      </Badge>
                    )}
                  </div>
                </div>

                {isNew && (
                  <div className="shrink-0 mt-2">
                    <div className="activity-dot-core w-2 h-2 rounded-full bg-primary" />
                  </div>
                )}
              </button>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: "var(--muted)" }}
            >
              <Activity className="w-7 h-7" style={{ color: "var(--muted-foreground)", opacity: 0.5 }} />
            </div>
            <p className="text-body text-muted-foreground">
              No recent changes in these spaces
            </p>
          </div>
        )}
      </div>
    </>
  );
}

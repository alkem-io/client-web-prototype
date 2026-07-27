import { Link } from "react-router";
import { Info } from "lucide-react";

interface SubspaceHeaderProps {
  spaceSlug: string;
  subspaceSlug: string;
  title: string;
  description: string;
  parentSpaceName: string;
  imageUrl: string;
  initials: string;
  avatarColor: string;
  parentInitials: string;
  parentAvatarColor: string;
  parentBannerImage?: string;
  avatarImage?: string;
  memberCount?: number;
  onCommunityClick?: () => void;
  onInfoClick?: () => void;
  actionButtons?: React.ReactNode;
  variant?: 1 | 2 | 3 | 4 | 5;
  /** Admin-configured banner height (80–256px). Defaults to 160px. */
  bannerHeight?: number;
}

export function SubspaceHeader({
  spaceSlug,
  subspaceSlug,
  title,
  description,
  parentSpaceName,
  imageUrl,
  initials,
  avatarColor,
  avatarImage,
  parentInitials,
  parentAvatarColor,
  onInfoClick,
  actionButtons,
  variant = 1,
  bannerHeight = 160,
}: SubspaceHeaderProps) {
  const scaledContainer = { maxWidth: 1536, margin: "0 auto", width: "100%" };
  const usesScaling = variant !== 1;
  const clampedHeight = Math.max(80, Math.min(256, bannerHeight));

  return (
    <div
      className="flex flex-col"
    >
      {/* Banner — admin-configurable height, inside grid with margins, slides under nav bar */}
      {variant === 4 ? (
        <div style={{ marginTop: "-64px", height: "64px" }} />
      ) : (
        <div
          className="w-full px-4"
          style={{
            marginTop: "-64px",
            paddingTop: 0,
            ...(!usesScaling ? { paddingLeft: 32, paddingRight: 32 } : {}),
          }}
        >
          <div style={usesScaling ? scaledContainer : undefined}>
            {usesScaling ? (
              <div
                className="relative overflow-hidden rounded-lg"
                style={{ height: `${clampedHeight + 64}px`, width: "100%" }}
              >
                <img
                  src={imageUrl}
                  alt="Subspace banner"
                  className="w-full h-full object-cover"
                  style={{ display: "block" }}
                />
              </div>
            ) : (
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-start-2 lg:col-span-10">
                  <div
                    className="relative overflow-hidden rounded-lg"
                    style={{ height: `${clampedHeight + 64}px`, width: "100%" }}
                  >
                    <img
                      src={imageUrl}
                      alt="Subspace banner"
                      className="w-full h-full object-cover"
                      style={{ display: "block" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Compact info bar */}
      <div
        className="w-full px-4"
        style={{
          paddingTop: 12,
          paddingBottom: 12,
          ...(!usesScaling ? { paddingLeft: 32, paddingRight: 32 } : {}),
        }}
      >
        <div style={usesScaling ? scaledContainer : undefined}>
          {usesScaling ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 min-w-0">
                <h1 className="text-foreground truncate font-bold tracking-tight" style={{ fontSize: "clamp(20px, 2.5vw, 26px)", lineHeight: 1.3 }}>
                  {title}
                </h1>
                {onInfoClick && (
                  <button
                    onClick={onInfoClick}
                    className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-muted/60"
                    style={{ color: "var(--muted-foreground)" }}
                    title="About this Subspace"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-muted-foreground truncate" style={{ lineHeight: 1.4 }}>
                  {description}
                </p>
                {actionButtons && (
                  <div className="shrink-0">
                    {actionButtons}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-start-2 lg:col-span-10 flex flex-col gap-1">
                <div className="flex items-center gap-2 min-w-0">
                  <h1 className="text-foreground truncate font-semibold tracking-tight" style={{ fontSize: "clamp(20px, 2.5vw, 26px)", lineHeight: 1.3 }}>
                    {title}
                  </h1>
                  {onInfoClick && (
                    <button
                      onClick={onInfoClick}
                      className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-muted/60"
                      style={{ color: "var(--muted-foreground)" }}
                      title="About this Subspace"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-muted-foreground truncate text-sm" style={{ lineHeight: 1.5 }}>
                    {description}
                  </p>
                  {actionButtons && (
                    <div className="shrink-0">
                      {actionButtons}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

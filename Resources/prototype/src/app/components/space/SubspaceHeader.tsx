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
}: SubspaceHeaderProps) {
  const scaledContainer = { maxWidth: 1536, margin: "0 auto", width: "100%" };
  const usesScaling = variant !== 1;

  return (
    <div
      className="flex flex-col"
    >
      {/* Banner — compact strip for visual identity */}
      {variant === 4 ? (
        <div style={{ marginTop: "-64px", height: "64px" }} />
      ) : (
        <div
          className="w-full"
          style={{ marginTop: "-64px" }}
        >
          <div
            className="relative overflow-hidden"
            style={{ height: "80px", width: "100%" }}
          >
            <img
              src={imageUrl}
              alt="Subspace banner"
              className="w-full h-full object-cover"
              style={{ display: "block" }}
            />
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
            <div className="flex items-center gap-4">
              {/* Stacked avatars: parent behind, subspace in front */}
              <div className="relative shrink-0" style={{ width: 46, height: 46 }}>
                {/* Parent space avatar (behind, offset top-left) */}
                <div
                  className="absolute flex items-center justify-center overflow-hidden"
                  style={{
                    width: 36,
                    height: 36,
                    top: 0,
                    left: 0,
                    borderRadius: 10,
                    background: parentAvatarColor,
                    zIndex: 0,
                  }}
                >
                  <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700 }}>
                    {parentInitials}
                  </span>
                </div>
                {/* Subspace avatar (front, overlapping bottom-right) */}
                <div
                  className="absolute flex items-center justify-center overflow-hidden"
                  style={{
                    width: 36,
                    height: 36,
                    bottom: 0,
                    right: 0,
                    borderRadius: 10,
                    background: avatarImage ? undefined : avatarColor,
                    border: "2px solid var(--background)",
                    boxShadow: "0 2px 4px 0 rgba(0,0,0,0.12)",
                    zIndex: 1,
                  }}
                >
                  {avatarImage ? (
                    <img src={avatarImage} alt={title} className="w-full h-full object-cover" />
                  ) : (
                    <span style={{ color: "var(--primary-foreground)", fontSize: "13px", fontWeight: 600 }}>
                      {initials}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-0.5 min-w-0 flex-1 py-3 px-2">
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
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-start-2 lg:col-span-10 flex items-center gap-4">
                {/* Stacked avatars: parent behind, subspace in front */}
                <div className="relative shrink-0" style={{ width: 46, height: 46 }}>
                  {/* Parent space avatar (behind, offset top-left) */}
                  <div
                    className="absolute flex items-center justify-center overflow-hidden"
                    style={{
                      width: 36,
                      height: 36,
                      top: 0,
                      left: 0,
                      borderRadius: 10,
                      background: parentAvatarColor,
                      zIndex: 0,
                    }}
                  >
                    <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700 }}>
                      {parentInitials}
                    </span>
                  </div>
                  {/* Subspace avatar (front, overlapping bottom-right) */}
                  <div
                    className="absolute flex items-center justify-center overflow-hidden"
                    style={{
                      width: 36,
                      height: 36,
                      bottom: 0,
                      right: 0,
                      borderRadius: 10,
                      background: avatarImage ? undefined : avatarColor,
                      border: "2px solid var(--background)",
                      boxShadow: "0 2px 4px 0 rgba(0,0,0,0.12)",
                      zIndex: 1,
                    }}
                  >
                    {avatarImage ? (
                      <img src={avatarImage} alt={title} className="w-full h-full object-cover" />
                    ) : (
                      <span style={{ color: "var(--primary-foreground)", fontSize: "13px", fontWeight: 600 }}>
                        {initials}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-0 min-w-0 flex-1">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

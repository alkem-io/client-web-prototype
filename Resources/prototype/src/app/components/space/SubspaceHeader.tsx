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

  // Inherit banner settings from parent space
  const bannerSettings = (() => {
    try {
      const stored = localStorage.getItem('alkemio-banner-settings');
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  })();
  const bannerImage = bannerSettings?.image || imageUrl;
  const bannerHeight = bannerSettings?.height || 160;
  const bannerCropY = bannerSettings?.cropY ?? 30;

  return (
    <div
      className="flex flex-col"
    >
      {/* Banner — inherits height from parent space settings */}
      {variant === 4 ? (
        <div style={{ marginTop: "-64px", height: "64px" }} />
      ) : (
        <div
          className="w-full px-4"
          style={{ marginTop: "-64px" }}
        >
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-start-2 lg:col-span-10">
              <div
                className="relative overflow-hidden rounded-b-lg"
                style={{ height: bannerHeight, width: "100%" }}
              >
                <img
                  src={bannerImage}
                  alt="Subspace banner"
                  className="w-full h-full object-cover"
                  style={{ display: "block", objectPosition: `center ${bannerCropY}%` }}
                />
              </div>
            </div>
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
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <h1 className="text-foreground truncate font-bold tracking-tight" style={{ fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.2 }}>
                    {title}
                  </h1>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-muted-foreground truncate text-sm" style={{ lineHeight: 1.4 }}>
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
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <h1 className="text-foreground truncate font-semibold tracking-tight" style={{ fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.2 }}>
                      {title}
                    </h1>
                  </div>
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

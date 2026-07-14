import { Link } from "react-router";

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
      ) : (variant === 2 || variant === 3) ? (
        <div
          className="w-full px-4"
          style={{ marginTop: "-64px" }}
        >
          <div
            className="relative overflow-hidden"
            style={{ ...scaledContainer, height: "80px" }}
          >
            <img
              src={imageUrl}
              alt="Subspace banner"
              className="w-full h-full object-cover"
              style={{ display: "block" }}
            />
          </div>
        </div>
      ) : (
        <div
          className="w-full"
          style={{ marginTop: "-64px", paddingLeft: 32, paddingRight: 32 }}
        >
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-start-2 lg:col-span-10">
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
              <div
                className="shrink-0 overflow-hidden flex items-center justify-center self-stretch"
                style={{
                  width: 56,
                  aspectRatio: "1",
                  borderRadius: "var(--radius-md, 6px)",
                  border: "2px solid var(--border)",
                  background: avatarImage ? undefined : avatarColor
                }}
              >
                {avatarImage ? (
                  <img src={avatarImage} alt={title} className="w-full h-full object-cover" />
                ) : (
                  <span style={{ color: "var(--primary-foreground)", fontSize: "18px", fontWeight: 600 }}>
                    {initials}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-0.5 min-w-0 flex-1 py-3 px-2">
                <h1 className="text-foreground truncate font-bold tracking-tight" style={{ fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.2 }}>
                  {title}
                </h1>
                <p className="text-muted-foreground truncate" style={{ lineHeight: 1.4 }}>
                  {description}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-start-2 lg:col-span-10 flex items-center gap-4">
                {/* Avatar with parent badge overlay */}
                <div className="relative shrink-0" style={{ width: 52, height: 52 }}>
                  {/* Subspace avatar (main) */}
                  <div
                    className="w-full h-full flex items-center justify-center overflow-hidden"
                    style={{
                      borderRadius: "var(--radius-md, 6px)",
                      background: avatarImage ? undefined : avatarColor,
                      boxShadow: "0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.08)",
                    }}
                  >
                    {avatarImage ? (
                      <img src={avatarImage} alt={title} className="w-full h-full object-cover" />
                    ) : (
                      <span style={{ color: "var(--primary-foreground)", fontSize: "18px", fontWeight: 600 }}>
                        {initials}
                      </span>
                    )}
                  </div>
                  {/* Parent space badge (bottom-right corner overlay) */}
                  <div
                    className="absolute flex items-center justify-center overflow-hidden"
                    style={{
                      width: 22,
                      height: 22,
                      bottom: -4,
                      right: -4,
                      borderRadius: "var(--radius-sm, 4px)",
                      background: parentAvatarColor,
                      border: "2px solid var(--background)",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                  >
                    <span style={{ color: "#fff", fontSize: "8px", fontWeight: 700, letterSpacing: "-0.02em" }}>
                      {parentInitials}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-0 min-w-0 flex-1">
                  <h1 className="text-foreground truncate font-semibold tracking-tight" style={{ fontSize: "clamp(20px, 2.5vw, 26px)", lineHeight: 1.3 }}>
                    {title}
                  </h1>
                  <p className="text-muted-foreground truncate text-sm" style={{ lineHeight: 1.5 }}>
                    {description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

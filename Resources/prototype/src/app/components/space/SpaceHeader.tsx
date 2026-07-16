import { Link } from "react-router";

const BANNER_IMAGE = "https://images.unsplash.com/photo-1690191863988-f685cddde463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjBjaGFsbGVuZ2UlMjBjcmVhdGl2ZSUyMHdvcmtzaG9wJTIwdGVhbSUyMGNvbGxhYm9yYXRpb24lMjBpbm5vdmF0aW9uJTIwc3ByaW50JTIwZGVzaWduJTIwc3ByaW50fGVufDF8fHx8MTc2OTA5NDMxMHww&ixlib=rb-4.1.0&q=80&w=1920";

interface SpaceHeaderProps {
  spaceSlug: string;
  spaceName?: string;
  variant?: 1 | 2 | 3 | 4 | 5;
  onInfoClick?: () => void;
  actionButtons?: React.ReactNode;
}

export function SpaceHeader({ spaceSlug, variant = 1, onInfoClick, actionButtons }: SpaceHeaderProps) {

  // V2+ use a max-width container so content scales into margins on zoom
  const scaledContainer = { maxWidth: 1536, margin: "0 auto", width: "100%" };
  const usesScaling = variant !== 1;

  return (
    <div className="flex flex-col">
      {/* Banner */}
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
              src={BANNER_IMAGE}
              alt="Space banner"
              className="w-full h-full object-cover"
              style={{ display: "block" }}
            />
          </div>
        </div>
      )}

      {/* Compact info bar — title + tagline */}
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
                  <h1
                    className="text-foreground truncate font-bold tracking-tight"
                    style={{ fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.2 }}
                  >
                    Steward-Ownership Field Builder Community
                  </h1>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-muted-foreground truncate text-sm" style={{ lineHeight: 1.4 }}>
                  The place for all field builders on steward-ownership to learn, connect, discuss and collaborate.
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
                    <h1
                      className="text-foreground truncate font-bold tracking-tight"
                      style={{ fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.2 }}
                    >
                      Steward-Ownership Field Builder Community
                    </h1>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-muted-foreground truncate text-sm" style={{ lineHeight: 1.4 }}>
                    The place for all field builders on steward-ownership to learn, connect, discuss and collaborate.
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

import { Link } from "react-router";
import { cn } from "@/crd/lib/utils";

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

  // Read admin-configured banner settings
  const bannerSettings = (() => {
    try {
      const stored = localStorage.getItem('alkemio-banner-settings');
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  })();
  const bannerImage = bannerSettings?.image || BANNER_IMAGE;
  const bannerHeight = bannerSettings?.height || 160;
  const bannerCropY = bannerSettings?.cropY ?? 30;

  return (
    <div className="flex flex-col">
      {/* Banner */}
      {variant === 4 ? (
        <div style={{ marginTop: "-64px", height: "64px" }} />
      ) : (
        <div
          /* Production: `w-full` + `lg:px-8` — the banner runs flush to the
             viewport below lg and insets 32px at lg+, matching SpaceShell's
             body gutter. The prototype's flat px-4 put it 16px off. */
          className="w-full lg:px-8"
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
                  alt="Space banner"
                  className="w-full h-full object-cover"
                  style={{ display: "block", objectPosition: `center ${bannerCropY}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compact info bar — title + tagline */}
      <div
        /* Production: `w-full px-6 md:px-8` (24px → 32px). The flat inline 32px
           this replaced was 8px wide of production on mobile. The px-4 base is
           kept for the scaling variants, which are a prototype-only study. */
        className={cn("w-full", usesScaling ? "px-4" : "px-6 md:px-8")}
        style={{ paddingTop: 12, paddingBottom: 12 }}
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
                <p className="text-muted-foreground truncate text-body" style={{ lineHeight: 1.4 }}>
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
                  <p className="text-muted-foreground truncate text-body" style={{ lineHeight: 1.4 }}>
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

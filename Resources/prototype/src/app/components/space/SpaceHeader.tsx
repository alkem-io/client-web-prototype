/**
 * Space header — production's `@/crd/components/space/SpaceHeader`.
 *
 * This file is now the prototype's data wiring only: it reads the mock space
 * and the admin banner settings, and hands CRD the props it exports.
 *
 * PHASE 1 REMOVALS (see PHASE-2.md §5):
 *  - Banner **crop offset** (`cropY`). CRD sizes the banner by aspect ratio,
 *    not by height + crop, so there is nowhere to express a crop origin.
 *  - The **scaling variants** (`?v=2..5`). CRD has one header layout; the
 *    max-width-container study has no equivalent.
 *
 * Preserved: the admin-configured banner **image**, and its configured
 * **height** — approximated as CRD's `bannerAspectRatio` so a shorter banner
 * still reads as shorter.
 */
import { useMemo } from 'react';
import { SpaceHeader as CrdSpaceHeader } from '@/crd/components/space/SpaceHeader';
import type { HeaderActionIconsData } from '@/crd/components/space/HeaderActionIcons';
import { resolveBannerShape } from '@/app/mappers/spaceBanner';

const BANNER_IMAGE =
  'https://images.unsplash.com/photo-1690191863988-f685cddde463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjBjaGFsbGVuZ2UlMjBjcmVhdGl2ZSUyMHdvcmtzaG9wJTIwdGVhbSUyMGNvbGxhYm9yYXRpb24lMjBpbm5vdmF0aW9uJTIwc3ByaW50JTIwZGVzaWduJTIwc3ByaW50fGVufDF8fHx8MTc2OTA5NDMxMHww&ixlib=rb-4.1.0&q=80&w=1920&h=192&fit=crop';

const SPACE_TITLE = 'Steward-Ownership Field Builder Community';
const SPACE_TAGLINE =
  'The place for all field builders on steward-ownership to learn, connect, discuss and collaborate.';

/**
 * CRD bounds the ratio at 6–10 and 10 is the default slim strip.
 *
 * Important: CRD renders a real banner `<img>` as `w-full h-auto object-contain`
 * — the ratio only sizes the *placeholder* before load. So the rendered height
 * comes from the image's own shape, exactly as in production where the server
 * stores a banner already cropped to the admin's ratio. The prototype therefore
 * requests a banner-shaped crop from Unsplash rather than trying to force the
 * height with CSS the way the old header did.
 */

type SpaceHeaderProps = {
  spaceSlug: string;
  spaceName?: string;
  /** Prototype-only layout study — accepted so existing call sites keep working,
   *  but no longer changes rendering. See PHASE-2.md §5. */
  variant?: 1 | 2 | 3 | 4 | 5;
  onInfoClick?: () => void;
  actionButtons?: React.ReactNode;
};

export function SpaceHeader({ spaceSlug, spaceName, onInfoClick }: SpaceHeaderProps) {
  const banner = useMemo(() => resolveBannerShape(BANNER_IMAGE), []);

  const actions: HeaderActionIconsData = {
    showInfo: true,
    onInfoClick,
    showShare: true,
    showSettings: true,
    settingsHref: `/space/${spaceSlug}/settings`,
  };

  return (
    <CrdSpaceHeader
      title={spaceName ?? SPACE_TITLE}
      tagline={SPACE_TAGLINE}
      bannerUrl={banner.url}
      bannerAspectRatio={banner.ratio}
      actions={actions}
      overlayHeader={true}
    />
  );
}

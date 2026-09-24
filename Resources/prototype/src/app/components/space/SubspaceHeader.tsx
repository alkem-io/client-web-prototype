/**
 * Subspace header — production's `@/crd/components/space/SubspaceHeader`.
 *
 * Kept as a wrapper so `SubspacePage` passes the same props as before; the
 * rendering is entirely CRD's.
 *
 * PHASE 1 REMOVALS (see PHASE-2.md §6) — CRD's header shows title, tagline,
 * banner and action icons only. Not rendered any more:
 *  - the subspace **avatar** (initials / colour / image)
 *  - the **parent space stack**. Production does show ancestry, but in the
 *    sidebar via `ParentSpaceStack` — it returns when `SubspaceSidebar` is
 *    converted, so this is a move rather than a loss.
 *  - **member count** and the community shortcut it linked to.
 *
 * Banner: CRD takes the L0 root's banner for subspaces (a subspace has no
 * settable page banner), which is what `imageUrl` already carried here.
 */
import { useMemo } from 'react';
import { SubspaceHeader as CrdSubspaceHeader } from '@/crd/components/space/SubspaceHeader';
import { resolveBannerShape } from '@/app/mappers/spaceBanner';
import type { HeaderActionIconsData } from '@/crd/components/space/HeaderActionIcons';

type SubspaceHeaderProps = {
  spaceSlug: string;
  subspaceSlug: string;
  title: string;
  description?: string;
  /** L0 root banner, inherited by the subspace. */
  imageUrl?: string;
  avatarColor?: string;
  /** Accepted for call-site compatibility; see the phase-1 note above. */
  initials?: string;
  avatarImage?: string;
  parentSpaceName?: string;
  parentInitials?: string;
  parentAvatarColor?: string;
  parentBannerImage?: string;
  memberCount?: number;
  onCommunityClick?: () => void;
  onInfoClick?: () => void;
  actionButtons?: React.ReactNode;
  /** Prototype-only layout study (`?v=`); no longer changes rendering. PHASE-2.md §5. */
  variant?: 1 | 2 | 3 | 4 | 5;
};

export function SubspaceHeader({
  title,
  description,
  imageUrl,
  avatarColor,
  onInfoClick,
}: SubspaceHeaderProps) {
  // A subspace inherits the L0 root's banner, so it must take the same shape —
  // otherwise it renders at the raw image ratio and towers over the space page.
  const banner = useMemo(() => resolveBannerShape(imageUrl ?? ''), [imageUrl]);

  const actions: HeaderActionIconsData = {
    showInfo: true,
    onInfoClick,
    showShare: true,
    showSettings: true,
  };

  return (
    <CrdSubspaceHeader
      title={title}
      tagline={description}
      bannerUrl={banner.url}
      bannerAspectRatio={banner.ratio}
      color={avatarColor ?? 'var(--primary)'}
      actions={actions}
      overlayHeader={true}
    />
  );
}

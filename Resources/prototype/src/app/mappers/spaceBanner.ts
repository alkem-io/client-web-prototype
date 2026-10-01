import { DEFAULT_BANNER_ASPECT_RATIO } from '@/crd/lib/bannerAspectRatio';

/**
 * Banner shape for CRD's space / subspace headers.
 *
 * CRD renders a real banner `<img>` as `w-full h-auto object-contain` — the
 * `bannerAspectRatio` prop only sizes the *placeholder* before load. The
 * rendered height therefore comes from the image's own shape, exactly as in
 * production where the server stores a banner already cropped to the admin's
 * ratio.
 *
 * So the prototype has to request a banner-shaped crop rather than force the
 * height with CSS the way the old headers did. Subspaces inherit the L0 root's
 * banner, so both headers share this helper and end up the same shape.
 */
const CRD_RATIO_MIN = 6;
const CRD_RATIO_MAX = 10;
/** Desktop content band the admin's pixel height was chosen against. */
const BAND_WIDTH = 1140;
/** Width the crop is requested at; height follows from the ratio. */
const CROP_WIDTH = 1920;

export type BannerShape = { url: string; ratio: number };

/** Admin banner settings, as the prototype stores them. */
function readSettings(): { image?: string; height?: number } | null {
  try {
    const stored = localStorage.getItem('alkemio-banner-settings');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function resolveBannerShape(fallbackImage: string): BannerShape {
  const settings = readSettings();

  // Default to CRD's 10:1 slim strip; only deviate when an admin set a height.
  const ratio = settings?.height
    ? Math.min(CRD_RATIO_MAX, Math.max(CRD_RATIO_MIN, BAND_WIDTH / settings.height))
    : DEFAULT_BANNER_ASPECT_RATIO;

  const base = settings?.image || fallbackImage;
  const cropHeight = Math.round(CROP_WIDTH / ratio);
  const url = base.includes('images.unsplash.com')
    ? `${base.replace(/&h=\d+/g, '').replace(/&fit=\w+/g, '')}&h=${cropHeight}&fit=crop`
    : base;

  return { url, ratio };
}

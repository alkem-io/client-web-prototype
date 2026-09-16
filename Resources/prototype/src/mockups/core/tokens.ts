/**
 * tokens — the values the mockups are allowed to use.
 *
 * Everything here is read from the platform's own stylesheet at runtime rather
 * than copied, so a token change in `styles/theme.css` moves the mockups with
 * it. `MIN_TYPE_PX` is the one number that belongs to the mockups alone.
 */

/** Nothing in an exported image may be smaller than this at 1x (spec §6.8). */
export const MIN_TYPE_PX = 11;

/** Design canvases. Duo is 16:9 because two devices need the width. */
export const CANVAS = {
  laptop: { width: 1320, height: 900 },
  phone: { width: 889, height: 740 },
  duo: { width: 1560, height: 880 },
} as const;

/** Default device rects, used when a DeviceSpec omits `at`. */
export const DEVICE_DEFAULTS = {
  laptop: { width: 980, height: 630 },
  phone: { width: 300, height: 620 },
} as const;

export const BEZEL = { laptop: 13, phone: 11 } as const;

function cssVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

/** Live token read — call inside a component, not at module scope. */
export function tokens() {
  return {
    foreground: cssVar('--foreground', 'rgb(29,56,74)'),
    background: cssVar('--background', 'rgb(252,253,254)'),
    card: cssVar('--card', '#fff'),
    muted: cssVar('--muted', 'rgb(241,245,249)'),
    mutedForeground: cssVar('--muted-foreground', 'rgb(100,116,139)'),
    border: cssVar('--border', 'rgb(226,232,240)'),
    radius: cssVar('--radius', '6px'),
    elevation: cssVar('--elevation-sm', '0px 4px 6px 0px rgba(0,0,0,0.09)'),
  };
}

/** The lift a floating card gets. Deliberately stronger than --elevation-sm:
 *  a spill card has to read as being off the screen, not on it. */
export const SPILL_SHADOW =
  '0 18px 40px -12px rgba(16,35,50,.28), 0 4px 10px rgba(16,35,50,.08)';

export const DEVICE_SHADOW = {
  laptop: '0 30px 60px -20px rgba(16,35,50,.35)',
  phone: '0 34px 60px -18px rgba(16,35,50,.42), 0 6px 16px rgba(16,35,50,.16)',
} as const;

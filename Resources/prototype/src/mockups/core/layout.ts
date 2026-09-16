/**
 * layout — anchors to rects, without measuring anything.
 *
 * Corner anchors resolve against the *device* rect, so a card lands on the
 * bezel it is meant to break no matter where the device sits on the canvas.
 * Each card is pinned by the two edges nearest its anchor (a top-left card by
 * its left and top), so growing content pushes it away from the canvas edge
 * rather than off it — which is what made hand-placed cards drift.
 */
import type { Anchor, CardSpec, DeviceKind, OverflowMode, Rect } from './types';
import { CANVAS, DEVICE_DEFAULTS } from './tokens';

/** Fraction of a card's own width that hangs outside the device, in spill mode. */
const SPILL_X = 0.62;
/** How far past the device's top/bottom edge a card reaches, in design px. */
const SPILL_Y = 46;
/** Gap between device and card in contained mode. */
const CONTAIN_GAP = 28;

export type CardPlacement = {
  /** CSS offsets from the canvas edges. Exactly two of these are set. */
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  width: number;
};

export function defaultDeviceRect(
  kind: DeviceKind,
  canvas: { width: number; height: number },
  index = 0,
  count = 1,
): Rect {
  const size = DEVICE_DEFAULTS[kind];
  if (count === 1) {
    return {
      x: Math.round((canvas.width - size.width) / 2),
      y: Math.round((canvas.height - size.height) / 2),
      ...size,
    };
  }
  // Two devices read left-to-right: the wide one behind, the narrow one in
  // front and lower, the way a phone actually sits beside a laptop.
  const laneWidth = canvas.width / count;
  return {
    x: Math.round(laneWidth * index + (laneWidth - size.width) / 2),
    y: kind === 'phone'
      ? Math.round(canvas.height - size.height - 52)
      : Math.round((canvas.height - size.height) / 2 - 20),
    ...size,
  };
}

/**
 * Resolve one card to CSS offsets. `mode` decides whether the card breaks the
 * device edge or clears it; the geometry is otherwise identical, which is why
 * switching a composition between styles never needs the cards rewritten.
 */
export function placeCard(
  card: CardSpec,
  device: Rect,
  canvas: { width: number; height: number },
  mode: OverflowMode,
): CardPlacement {
  const w = card.width;

  if (Array.isArray(card.at)) {
    return { left: card.at[0], top: card.at[1], width: w };
  }

  const bx = card.bleed?.x ?? 0;
  const by = card.bleed?.y ?? 0;

  // How far the card's near edge sits outside the device edge.
  const outX = (mode === 'contained' ? w + CONTAIN_GAP : w * SPILL_X) + bx;
  const outY = (mode === 'contained' ? 0 : SPILL_Y) + by;

  const deviceRight = device.x + device.width;
  const deviceBottom = device.y + device.height;

  const anchor: Anchor = card.at;
  switch (anchor) {
    case 'top-left':
      return { left: device.x - outX, top: device.y - outY, width: w };
    case 'top-right':
      return { right: canvas.width - (deviceRight + outX), top: device.y - outY, width: w };
    case 'bottom-left':
      return { left: device.x - outX, bottom: canvas.height - (deviceBottom + outY), width: w };
    case 'bottom-right':
      return {
        right: canvas.width - (deviceRight + outX),
        bottom: canvas.height - (deviceBottom + outY),
        width: w,
      };
    case 'left-margin':
      return {
        left: device.x - outX,
        top: Math.round(device.y + device.height / 2 - 90),
        width: w,
      };
    case 'right-margin':
      return {
        right: canvas.width - (deviceRight + outX),
        top: Math.round(device.y + device.height / 2 - 90),
        width: w,
      };
  }
}

export function toStyle(p: CardPlacement): React.CSSProperties {
  return {
    position: 'absolute',
    left: p.left,
    right: p.right,
    top: p.top,
    bottom: p.bottom,
    width: p.width,
  };
}

export const canvasFor = (key: keyof typeof CANVAS) => ({ ...CANVAS[key] });

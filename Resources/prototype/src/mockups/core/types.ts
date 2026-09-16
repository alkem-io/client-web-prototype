/**
 * types — the composition contract.
 *
 * A composition is data, not a design exercise. Everything the layout engine,
 * the validator and the exporter need is declared here; nothing is inferred
 * from how the JSX happens to be written.
 */
import type { ReactNode } from 'react';

export type DeviceKind = 'laptop' | 'phone';

/**
 * What the device is showing. This is not cosmetic — it is what the validator
 * checks a cursor against. Named cursors exist on whiteboards, documents and
 * memos; anywhere else they are a lie, and `mockup:check` fails the build.
 */
export type ScreenKind =
  | 'space'
  | 'subspace'
  | 'whiteboard'
  | 'document'
  | 'memo'
  | 'notifications'
  | 'dashboard'
  | 'other';

export const CURSOR_LEGAL_ON: ScreenKind[] = ['whiteboard', 'document', 'memo'];

/**
 * Where a card sits. Corner anchors are resolved against the *device*, not the
 * canvas, so a card lands on the bezel it is meant to break regardless of how
 * the device is placed. An explicit `[x, y]` overrides everything.
 */
export type Anchor =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'left-margin'
  | 'right-margin';

/**
 * How much of the frame the cards are allowed to break.
 *  - `spill`     — cards straddle the device edge (the house style)
 *  - `contained` — cards sit in the canvas margins, clear of the device
 *  - `none`      — device only, no cards rendered
 */
export type OverflowMode = 'spill' | 'contained' | 'none';

export type Surface = 'flat' | 'photo';

export type CropName = 'default' | 'wide' | 'print' | 'transparent';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Person {
  id: string;
  name: string;
  initials: string;
  /** One accent per person, used for their cursor and name tag everywhere. */
  accent: string;
  role?: string;
  avatarUrl?: string;
}

export interface DeviceSpec {
  /** Referenced by cursors and by a photo template's slot mapping. */
  id: string;
  kind: DeviceKind;
  screenKind: ScreenKind;
  /** Outer device rect in design px. Omit to let the engine centre it. */
  at?: Rect;
  screen: ReactNode;
  /** Photo surface only: which slot of the template this device fills. */
  slot?: string;
}

export interface CardSpec {
  id: string;
  /** Which device this card breaks out of. Defaults to the first device. */
  from?: string;
  at: Anchor | [number, number];
  width: number;
  node: ReactNode;
  /**
   * Push the card further out of (positive) or into (negative) the device,
   * in design px. The engine picks a sane default per anchor; this tunes it.
   */
  bleed?: { x?: number; y?: number };
  /** Card ids this one may legally overlap. Anything else is a check failure. */
  stackWith?: string[];
  /** The node brings its own card surface — render only the lift. */
  bare?: boolean;
}

export interface CursorSpec {
  person: Person;
  /** Canvas coordinates in design px. */
  at: [number, number];
  /** Device id the cursor must fall inside. Defaults to the first device. */
  on?: string;
  label?: string;
}

export interface CompositionInput {
  id: string;
  /** The one sentence the image has to carry. */
  claim: string;
  /** The user story or flow this was generated from, kept for traceability. */
  story?: string;
  canvas?: { width: number; height: number };
  surface?: Surface;
  /** Photo surface only. */
  template?: string;
  overflow?: OverflowMode;
  devices: DeviceSpec[];
  cards?: CardSpec[];
  cursors?: CursorSpec[];
  crops?: CropName[];
  /**
   * Repo components this composition renders, by import path. `mockup:check`
   * fails on anything not recorded in COMPONENT-MAP.md.
   */
  uses?: string[];
  notes?: string;
}

export interface Composition extends Required<Omit<CompositionInput,
  'template' | 'story' | 'notes'>> {
  template?: string;
  story?: string;
  notes?: string;
}

export interface Finding {
  rule: string;
  severity: 'error' | 'warn';
  message: string;
  /** Canvas-space rect the problem sits in, for the overlay. */
  rect?: Rect;
}

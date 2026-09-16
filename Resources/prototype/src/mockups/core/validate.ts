/**
 * validate — the checks from spec §7, run against the real DOM.
 *
 * These run in the browser rather than over the composition data because the
 * defects they catch are all emergent: you cannot tell from a card's declared
 * width whether it lands on a heading, only from where the heading's ink
 * actually fell. `mockup:check` drives this same function headlessly.
 */
import { CURSOR_LEGAL_ON, type Composition, type Finding, type Rect } from './types';
import { MIN_TYPE_PX } from './tokens';

/** More than this much dead space under a screen's last content is a defect. */
const EMPTY_BAND_PX = 120;
/** Below 5% covered reads as a shadow edge; above 95% reads as intentional. */
const PARTIAL_LO = 0.05;
const PARTIAL_HI = 0.95;

type Box = Rect;

const area = (b: Box) => Math.max(0, b.width) * Math.max(0, b.height);

function intersect(a: Box, b: Box): Box {
  const x = Math.max(a.x, b.x);
  const y = Math.max(a.y, b.y);
  return {
    x,
    y,
    width: Math.min(a.x + a.width, b.x + b.width) - x,
    height: Math.min(a.y + a.height, b.y + b.height) - y,
  };
}

const overlaps = (a: Box, b: Box) => area(intersect(a, b)) > 0.5;

/** DOM rect to canvas coordinates. */
function toCanvas(r: DOMRect, origin: DOMRect, scale: number): Box {
  return {
    x: (r.left - origin.left) / scale,
    y: (r.top - origin.top) / scale,
    width: r.width / scale,
    height: r.height / scale,
  };
}

// ── colour ────────────────────────────────────────────────────────────────
function parseColor(css: string): [number, number, number, number] | null {
  const m = css.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
  if (parts.length < 3 || parts.some(n => Number.isNaN(n))) return null;
  return [parts[0], parts[1], parts[2], parts[3] ?? 1];
}

function luminance([r, g, b]: [number, number, number, number]): number {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(fg: [number, number, number, number], bg: [number, number, number, number]) {
  const a = luminance(fg);
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** First ancestor painting an opaque background — the text's real backdrop. */
function backdropOf(el: Element): [number, number, number, number] {
  let node: Element | null = el;
  while (node) {
    const c = parseColor(getComputedStyle(node).backgroundColor);
    if (c && c[3] > 0.85) return c;
    node = node.parentElement;
  }
  return [255, 255, 255, 1];
}

// ── element classification ────────────────────────────────────────────────
/**
 * A "discrete element" for the partial-occlusion rule: something a reader
 * perceives as one object. Containers are excluded deliberately — a card
 * whose padding a spill card clips is fine; a chip cut in half is not.
 */
function isDiscrete(el: Element): boolean {
  if (el.hasAttribute('data-mockup-ignore')) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === 'img' || tag === 'svg' || tag === 'button' || tag === 'input') return true;
  if (el.childElementCount === 0 && (el.textContent ?? '').trim().length > 0) return true;
  return false;
}

function visible(el: Element): boolean {
  const s = getComputedStyle(el);
  if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) return false;
  const r = el.getBoundingClientRect();
  return r.width > 0.5 && r.height > 0.5;
}

/** Ink boxes of a text node, measured with a Range so a full-width heading
 *  container does not report the whole row as text. */
function inkBoxes(node: Text, origin: DOMRect, scale: number): Box[] {
  if (!(node.textContent ?? '').trim()) return [];
  const range = document.createRange();
  range.selectNodeContents(node);
  return Array.from(range.getClientRects())
    .filter(r => r.width > 0.5 && r.height > 0.5)
    .map(r => toCanvas(r, origin, scale));
}

function textNodesIn(root: Element): Text[] {
  const out: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n = walker.nextNode();
  while (n) {
    if ((n.textContent ?? '').trim()) out.push(n as Text);
    n = walker.nextNode();
  }
  return out;
}

export interface ValidateOptions {
  stage: HTMLElement;
  composition: Composition;
  /** Scale the stage is currently rendered at. */
  scale: number;
}

export function validate({ stage, composition, scale }: ValidateOptions): Finding[] {
  const findings: Finding[] = [];
  const origin = stage.getBoundingClientRect();

  const cardEls = Array.from(stage.querySelectorAll<HTMLElement>('[data-mockup-card]'));
  const cards = cardEls.map(el => ({
    id: el.dataset.mockupCard ?? '?',
    box: toCanvas(el.getBoundingClientRect(), origin, scale),
  }));

  const screenEls = Array.from(stage.querySelectorAll<HTMLElement>('[data-mockup-screen]'));

  // ── 1 · text occlusion ──────────────────────────────────────────────────
  for (const screen of screenEls) {
    for (const node of textNodesIn(screen)) {
      const parent = node.parentElement;
      if (!parent || !visible(parent)) continue;
      for (const ink of inkBoxes(node, origin, scale)) {
        for (const card of cards) {
          if (overlaps(ink, card.box)) {
            findings.push({
              rule: 'text-occlusion',
              severity: 'error',
              message: `Card "${card.id}" covers text: "${(node.textContent ?? '').trim().slice(0, 46)}"`,
              rect: ink,
            });
          }
        }
      }
    }
  }

  // ── 2 · partial occlusion of a discrete element ─────────────────────────
  for (const screen of screenEls) {
    for (const el of Array.from(screen.querySelectorAll('*'))) {
      if (!isDiscrete(el) || !visible(el)) continue;
      const box = toCanvas(el.getBoundingClientRect(), origin, scale);
      const total = area(box);
      if (total < 4) continue;
      for (const card of cards) {
        const f = area(intersect(box, card.box)) / total;
        if (f > PARTIAL_LO && f < PARTIAL_HI) {
          findings.push({
            rule: 'partial-occlusion',
            severity: 'error',
            message: `Card "${card.id}" covers ${Math.round(f * 100)}% of <${el.tagName.toLowerCase()}> "${(el.textContent ?? '').trim().slice(0, 32)}" — cover it or clear it`,
            rect: box,
          });
        }
      }
    }
  }

  // ── 3 · undeclared card-on-card overlap ─────────────────────────────────
  const declared = new Map(composition.cards.map(c => [c.id, c.stackWith ?? []]));
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      const a = cards[i];
      const b = cards[j];
      if (!overlaps(a.box, b.box)) continue;
      const ok =
        (declared.get(a.id) ?? []).includes(b.id) || (declared.get(b.id) ?? []).includes(a.id);
      if (!ok) {
        findings.push({
          rule: 'card-overlap',
          severity: 'error',
          message: `Cards "${a.id}" and "${b.id}" overlap without stackWith`,
          rect: intersect(a.box, b.box),
        });
      }
    }
  }

  // ── 4 · empty band at the foot of a screen ──────────────────────────────
  for (const screen of screenEls) {
    const screenBox = toCanvas(screen.getBoundingClientRect(), origin, scale);
    let lowest = screenBox.y;
    for (const el of Array.from(screen.querySelectorAll('*'))) {
      if (!visible(el)) continue;
      const b = toCanvas(el.getBoundingClientRect(), origin, scale);
      // Content clipped by the fold still counts as filling the screen.
      lowest = Math.max(lowest, Math.min(b.y + b.height, screenBox.y + screenBox.height));
    }
    const gap = screenBox.y + screenBox.height - lowest;
    if (gap > EMPTY_BAND_PX) {
      findings.push({
        rule: 'empty-band',
        severity: 'error',
        message: `${Math.round(gap)}px of empty screen below the last content (max ${EMPTY_BAND_PX})`,
        rect: { x: screenBox.x, y: lowest, width: screenBox.width, height: gap },
      });
    }
  }

  // ── 5 · illegal cursors ─────────────────────────────────────────────────
  for (const cursor of composition.cursors) {
    const device =
      composition.devices.find(d => d.id === cursor.on) ?? composition.devices[0];
    if (!device) continue;
    if (!CURSOR_LEGAL_ON.includes(device.screenKind)) {
      findings.push({
        rule: 'illegal-cursor',
        severity: 'error',
        message: `Cursor for ${cursor.person.name} sits on a "${device.screenKind}" screen. Named cursors exist only on ${CURSOR_LEGAL_ON.join(', ')}.`,
      });
      continue;
    }
    const el = stage.querySelector<HTMLElement>(`[data-mockup-screen="${device.id}"]`);
    if (!el) continue;
    const box = toCanvas(el.getBoundingClientRect(), origin, scale);
    const [x, y] = cursor.at;
    if (x < box.x || y < box.y || x > box.x + box.width || y > box.y + box.height) {
      findings.push({
        rule: 'illegal-cursor',
        severity: 'error',
        message: `Cursor for ${cursor.person.name} at [${x}, ${y}] falls outside device "${device.id}"`,
      });
    }
  }

  // ── 6 · contrast and minimum type size ──────────────────────────────────
  const seen = new Set<Element>();
  for (const node of textNodesIn(stage)) {
    const el = node.parentElement;
    if (!el || seen.has(el) || !visible(el)) continue;
    seen.add(el);
    const style = getComputedStyle(el);
    const size = parseFloat(style.fontSize);
    if (size && size < MIN_TYPE_PX - 0.01) {
      findings.push({
        rule: 'min-type-size',
        severity: 'error',
        message: `${size}px text ("${(el.textContent ?? '').trim().slice(0, 32)}") is below the ${MIN_TYPE_PX}px floor`,
      });
    }
    const fg = parseColor(style.color);
    if (!fg) continue;
    const ratio = contrast(fg, backdropOf(el));
    const bold = Number(style.fontWeight) >= 700;
    const large = size >= 24 || (size >= 18.66 && bold);
    const min = large ? 3 : 4.5;
    if (ratio < min) {
      findings.push({
        rule: 'contrast',
        severity: 'warn',
        message: `Contrast ${ratio.toFixed(2)}:1 (needs ${min}:1) on "${(el.textContent ?? '').trim().slice(0, 32)}"`,
      });
    }
  }

  return findings;
}

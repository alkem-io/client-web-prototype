/**
 * defineComposition — the contract, with the defaults filled in.
 *
 * Compositions declare intent; everything structural (canvas size, device
 * placement, which crops to cut) has a default so a new mockup stays a short
 * file. `overflow` is the one knob most likely to be flipped per channel, so
 * it is a top-level field rather than something buried in a card.
 */
import type { Composition, CompositionInput } from './types';
import { CANVAS } from './tokens';
import { defaultDeviceRect } from './layout';

export function defineComposition(input: CompositionInput): Composition {
  const deviceCount = input.devices.length;
  const canvas =
    input.canvas ??
    (deviceCount > 1
      ? { ...CANVAS.duo }
      : input.devices[0]?.kind === 'phone'
        ? { ...CANVAS.phone }
        : { ...CANVAS.laptop });

  return {
    id: input.id,
    claim: input.claim,
    story: input.story,
    notes: input.notes,
    canvas,
    surface: input.surface ?? 'flat',
    template: input.template,
    overflow: input.overflow ?? 'spill',
    devices: input.devices.map((d, i) => ({
      ...d,
      at: d.at ?? defaultDeviceRect(d.kind, canvas, i, deviceCount),
    })),
    cards: input.cards ?? [],
    cursors: input.cursors ?? [],
    crops: input.crops ?? ['default'],
    uses: input.uses ?? [],
  };
}

const registry = new Map<string, Composition>();

export function register(c: Composition): Composition {
  registry.set(c.id, c);
  return c;
}

export const allCompositions = () =>
  [...registry.values()].sort((a, b) => a.id.localeCompare(b.id));

export const compositionById = (id: string) => registry.get(id);

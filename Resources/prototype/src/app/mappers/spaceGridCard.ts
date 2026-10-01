import type { SpaceGridCardData, SpaceGridCardLabels } from '@/crd/components/user/SpaceGridCard';
import { pickColorFromId } from '@/crd/lib/pickColorFromId';

/** The prototype's mock space shape, as held in page fixtures. */
export type MockSpace = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string;
  isPrivate?: boolean;
};

/**
 * Mock space → `SpaceGridCardData`.
 *
 * `color` is the deterministic accent CRD derives from the id, so a space keeps
 * the same gradient everywhere it appears — the same helper the client uses.
 */
export function toSpaceGridCard(space: MockSpace): SpaceGridCardData {
  return {
    id: space.id,
    title: space.title,
    description: space.description ?? null,
    href: `/space/${space.id}`,
    imageUrl: space.imageUrl,
    color: pickColorFromId(space.id),
    isPrivate: Boolean(space.isPrivate),
  };
}

export const SPACE_GRID_CARD_LABELS: SpaceGridCardLabels = {
  privacyPrivate: 'Private space',
  privacyPublic: 'Public space',
};

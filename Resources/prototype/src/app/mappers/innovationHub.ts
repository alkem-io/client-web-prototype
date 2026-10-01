import type { VirtualContributorCardItem } from '@/crd/components/common/profileTypes';
import type { InnovationPackCardData } from '@/crd/components/innovationPack/types';

/**
 * Innovation-hub fixtures → the data types CRD's hub sections export.
 *
 * Two shape differences, both resolved here:
 *  - the fixtures carry `image` / `avatar` and a Tailwind class in `color`;
 *    CRD wants `bannerUrl` / `avatarImageUrl` and a real colour value it can
 *    put in a gradient
 *  - the fixtures have no links; CRD's cards are anchors, so `url` / `href`
 *    are built from the id here
 *
 * `initials` is dropped — CRD derives its own fallback from the name.
 */

/** The fixtures use Tailwind pairs like `bg-blue-100 text-blue-700`. */
const PACK_COLORS: Record<string, string> = {
  'bg-blue-100 text-blue-700': '#2563eb',
  'bg-purple-100 text-purple-700': '#7c3aed',
  'bg-emerald-100 text-emerald-700': '#059669',
  'bg-amber-100 text-amber-700': '#d97706',
  'bg-rose-100 text-rose-700': '#e11d48',
  'bg-cyan-100 text-cyan-700': '#0891b2',
};

const FALLBACK_COLOR = '#1d384a';

export type MockHubPack = {
  id: string;
  name: string;
  description: string;
  templateCount: number;
  image?: string;
  initials?: string;
  color?: string;
  tags?: string[];
};

export type MockHubVC = {
  id: string;
  name: string;
  description: string;
  avatar?: string | null;
  initials?: string;
  tags?: string[];
};

export function toPackCard(pack: MockHubPack): InnovationPackCardData {
  return {
    id: pack.id,
    name: pack.name,
    description: pack.description,
    tags: pack.tags ?? [],
    bannerUrl: pack.image,
    color: (pack.color && PACK_COLORS[pack.color]) || FALLBACK_COLOR,
    templateCount: pack.templateCount,
    url: `/templates/${pack.id}`,
  };
}

export function toVirtualContributorCard(vc: MockHubVC): VirtualContributorCardItem {
  return {
    id: vc.id,
    displayName: vc.name,
    description: vc.description,
    type: 'Virtual Contributor',
    href: `/vc/${vc.id}`,
    avatarImageUrl: vc.avatar ?? null,
  };
}

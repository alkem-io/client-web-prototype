import type {
  SimpleResourceCardItem,
  TagsetGroup,
  VirtualContributorCardItem,
} from '@/crd/components/common/profileTypes';
import type { SpaceGridCardData } from '@/crd/components/user/SpaceGridCard';
import { pickColorFromId } from '@/crd/lib/pickColorFromId';

/**
 * Profile fixtures → the data types CRD's public profile views export.
 *
 * The shapes are already close: CRD's own demo profile is Alex Rivera, taken
 * from this prototype. What differs is naming (`title`/`name` → `displayName`,
 * `imageUrl` → `avatarImageUrl`) and that CRD wants a deterministic accent
 * colour per id (`pickColorFromId`) for the gradient it falls back to when an
 * image is missing.
 */

export type MockProfileSpace = {
  id: number | string;
  title: string;
  description?: string;
  isPrivate?: boolean;
  imageUrl?: string;
};

export type MockProfileOrg = {
  id: number | string;
  name: string;
  role?: string;
  memberCount?: number;
  imageUrl?: string;
  tags?: string[];
};

export type MockProfileVC = {
  id: number | string;
  name: string;
  slug?: string;
  description?: string;
  type?: string;
};

const slugify = (value: string) => value.toLowerCase().replace(/\s+/g, '-');

export function toProfileSpaceCard(space: MockProfileSpace): SpaceGridCardData {
  const id = String(space.id);
  return {
    id,
    title: space.title,
    description: space.description ?? null,
    href: `/space/${slugify(space.title)}`,
    imageUrl: space.imageUrl,
    color: pickColorFromId(id),
    isPrivate: space.isPrivate ?? false,
  };
}

export function toProfileVirtualContributor(vc: MockProfileVC): VirtualContributorCardItem {
  return {
    id: String(vc.id),
    displayName: vc.name,
    description: vc.description ?? null,
    type: vc.type ?? 'Virtual Contributor',
    href: `/vc/${vc.slug ?? slugify(vc.name)}`,
    avatarImageUrl: null,
  };
}

export function toSimpleResource(
  item: { id: number | string; name: string; description?: string },
  hrefPrefix: string
): SimpleResourceCardItem {
  return {
    id: String(item.id),
    displayName: item.name,
    description: item.description ?? null,
    href: `${hrefPrefix}/${slugify(item.name)}`,
    avatarImageUrl: null,
  };
}

/** The prototype stores org tags as a flat list; CRD groups tags into tagsets. */
export function toTagsets(groups: { key: string; name: string; tags: string[] }[]): TagsetGroup[] {
  return groups.filter(group => group.tags.length > 0);
}

export function toCompactOrg(org: MockProfileOrg) {
  return {
    id: String(org.id),
    displayName: org.name,
    avatarImageUrl: org.imageUrl ?? null,
    caption: org.role ?? null,
    secondaryCaption: null,
    href: `/organization/${slugify(org.name)}`,
    memberCount: org.memberCount ?? 0,
  };
}

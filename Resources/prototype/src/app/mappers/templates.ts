import type { InnovationPackCardData } from '@/crd/components/innovationPack/types';
import type { TemplateCardData, TemplateType } from '@/crd/components/templates/types';

/**
 * Template-library fixtures → the data types CRD's library exports.
 *
 * The main job here is vocabulary. The prototype labels template kinds with
 * display names ("Collaboration Tool", "Community Guidelines"); production uses
 * the domain's own identifiers, and a callout is what the prototype calls a
 * post-or-collaboration-tool. There is no separate "Subspace" template type in
 * production — a subspace template *is* a space template.
 */
const TYPE_MAP: Record<string, TemplateType> = {
  Space: 'space',
  Subspace: 'space',
  'Collaboration Tool': 'callout',
  Callout: 'callout',
  Post: 'post',
  Whiteboard: 'whiteboard',
  'Community Guidelines': 'communityGuidelines',
  Classification: 'classification',
};

/** The fixtures store a Tailwind class pair; CRD wants a colour it can gradient. */
const COLOR_MAP: Record<string, string> = {
  'bg-blue-100 text-blue-700': '#2563eb',
  'bg-green-100 text-green-700': '#059669',
  'bg-purple-100 text-purple-700': '#7c3aed',
  'bg-orange-100 text-orange-700': '#d97706',
  'bg-pink-100 text-pink-700': '#db2777',
};

const FALLBACK_COLOR = '#1d384a';

const colorOf = (value: string | undefined) =>
  (value && COLOR_MAP[value]) || FALLBACK_COLOR;

export type MockTemplatePack = {
  id: string;
  name: string;
  description: string;
  templateCount: number;
  tags?: string[];
  image?: string;
  color?: string;
  author?: string;
};

export type MockTemplate = {
  id: string;
  name: string;
  description?: string;
  type: string;
  tags?: string[];
  image?: string;
  previewContent?: string;
  color?: string;
  pack?: { name: string } | null;
};

export function toTemplateType(label: string): TemplateType {
  return TYPE_MAP[label] ?? 'post';
}

export function toPackCardData(pack: MockTemplatePack): InnovationPackCardData {
  return {
    id: pack.id,
    name: pack.name,
    description: pack.description,
    tags: pack.tags ?? [],
    bannerUrl: pack.image,
    color: colorOf(pack.color),
    templateCount: pack.templateCount,
    url: `/templates/packs/${pack.id}`,
    providerName: pack.author,
  };
}

export function toTemplateCardData(template: MockTemplate): TemplateCardData {
  return {
    id: template.id,
    type: toTemplateType(template.type),
    name: template.name,
    description: template.description ?? '',
    tags: template.tags ?? [],
    bannerUrl: template.image ?? template.previewContent,
    color: colorOf(template.color),
    url: `/templates/${template.id}`,
    ownerLabel: template.pack?.name,
  };
}

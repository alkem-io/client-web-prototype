import { AVAILABLE_CLASSIFICATION_TEMPLATES } from '@/app/components/classifications/ClassificationPickerDialog';
import { PACK_SPECIFIC_TEMPLATES } from '@/app/data/template-data';
import type { TemplateCardData, TemplateContent, TemplateType } from '@/crd/components/templates/types';
import { pickColorFromId } from '@/crd/lib/pickColorFromId';
import { useDemoState } from './demoState';

/** A template card plus the content its preview and editor show. */
export type DemoTemplate = { card: TemplateCardData; content: TemplateContent };

const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export function buildContent(type: TemplateType, name: string, description: string): TemplateContent {
  switch (type) {
    case 'space':
      return {
        type,
        phases: [
          { name: 'Home', description: 'Where the space starts.' },
          { name: 'Community', description: 'Who is taking part.' },
          { name: 'Subspaces', description: 'Work split into smaller groups.' },
          { name: 'Knowledge', description: 'What has been learned so far.' },
        ],
        starterCallouts: [
          { name: 'Welcome', framingKind: 'none', flowStateName: 'Home', description: description },
          { name: 'Introduce yourself', framingKind: 'none', flowStateName: 'Community' },
        ],
        subspaceTemplates: [],
      };
    case 'callout':
      return {
        type,
        framingKind: 'none',
        framingTitle: name,
        framingDescription: description,
        allowedContributionTypes: ['post'],
        commentsEnabled: true,
      };
    case 'whiteboard':
      return { type };
    case 'post':
      return { type, defaultDescription: `## ${name}\n\n${description}` };
    case 'communityGuidelines':
      return { type, title: name, guidelinesMarkdown: description, references: [] };
    case 'classification':
      return { type, cardinality: 'MULTI_SELECT', values: [] };
  }
}

const make = (id: string, type: TemplateType, name: string, description: string, tags: string[]): DemoTemplate => ({
  card: { id, type, name, description, tags, color: pickColorFromId(id) },
  content: buildContent(type, name, description),
});

const classification = (id: string, sourceId: string, description: string, tags: string[]): DemoTemplate | null => {
  const source = AVAILABLE_CLASSIFICATION_TEMPLATES.find(template => template.id === sourceId);
  if (!source) return null;
  const cardinality = source.cardinality === 'multi' ? ('MULTI_SELECT' as const) : ('SINGLE_SELECT' as const);
  return {
    card: {
      id,
      type: 'classification',
      name: source.name,
      description,
      tags,
      color: pickColorFromId(id),
      classification: { cardinality, valueLabels: source.values },
    },
    content: {
      type: 'classification',
      cardinality,
      values: source.values.map(label => ({ id: slug(label), label })),
    },
  };
};

/** The templates held by this space. */
export const DEMO_SPACE_TEMPLATES: DemoTemplate[] = [
  make('t1', 'space', 'Creative Thinking Space', 'A complete setup for design thinking workshops including whiteboards and breakout rooms.', ['Workshop', 'Design']),
  make('t2', 'space', 'Agile Project Space', 'Pre-configured for scrum teams with kanban boards and daily standup tools.', ['Agile', 'Management']),
  make('t3', 'callout', 'Brainstorming Session', 'Structured flow for generating and voting on ideas.', ['Ideation']),
  make('t4', 'whiteboard', 'Customer Journey Map', 'Visual template for mapping user experiences.', ['UX', 'Mapping']),
  make('t5', 'whiteboard', 'Retrospective Board', 'Start/Stop/Continue layout for team retrospectives.', ['Agile', 'Team']),
  make('t6', 'post', 'Product Requirements Doc', 'Standard PRD template with sections for features, metrics, and timeline.', ['Product', 'Doc']),
  ...[
    classification('t8', 'ct-sdg', 'The 17 UN SDGs for classifying space impact areas.', ['SDG', 'Impact']),
    classification('t9c', 'ct-sector', 'Industry sector classification for cross-portfolio reporting.', ['Sector', 'Reporting']),
  ].filter((template): template is DemoTemplate => template !== null),
  make('t7', 'communityGuidelines', 'Open Source Code of Conduct', 'Standard Contributor Covenant tailored for open innovation spaces.', ['Community', 'Legal']),
];

const LIBRARY_TYPE: Record<string, TemplateType | undefined> = {
  Space: 'space',
  Subspace: 'space',
  'Collaboration Tool': 'callout',
  Whiteboard: 'whiteboard',
  Post: 'post',
  'Community Guidelines': 'communityGuidelines',
};

/** The platform library that templates can be imported or picked from. */
export const DEMO_LIBRARY_TEMPLATES: DemoTemplate[] = [
  ...PACK_SPECIFIC_TEMPLATES.flatMap((template): DemoTemplate[] => {
    const type = LIBRARY_TYPE[template.type];
    return type ? [make(`library-${template.id}`, type, template.name, template.description, template.tags ?? [])] : [];
  }),
  ...[
    classification('library-language', 'ct-language', 'The language a space works in.', ['Language']),
    classification('library-region', 'ct-region', 'Where in the world a space is active.', ['Region']),
  ].filter((template): template is DemoTemplate => template !== null),
];

export const useDemoTemplates = (scope = 'space') =>
  useDemoState<DemoTemplate[]>(`${scope}:templates`, DEMO_SPACE_TEMPLATES);

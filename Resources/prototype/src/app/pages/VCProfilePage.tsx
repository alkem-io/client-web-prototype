/**
 * Virtual contributor public profile — production's
 * `@/crd/components/virtualContributor/VCPublicProfileView`.
 *
 * CRD composes the page: `VCPageHero` (bot avatar fallback, type badge,
 * keyword chips), `VCProfileSidebar` (description, host card, links, body of
 * knowledge) and `VCContentView` (Functionality / AI Engine / Monitoring).
 * Follows CRD's own `crd/app/pages/VCProfileDemoPage` composition.
 *
 * The prototype's fixture already lined up closely — capabilities, data access
 * and the AI-engine questions are the same set. Two shape differences:
 *
 *  - Role requirements were a markdown string; CRD takes a ReactNode, so the
 *    emphasis is real markup rather than `**` that never rendered.
 *  - The AI engine was a flat object of booleans; CRD models each question as
 *    a card with its own icon and answer type, which is what lets "Unknown"
 *    and the web-access clock glyph render distinctly from a plain No.
 *
 * NO MESSAGE BUTTON: production deliberately omits one on a VC profile
 * (FR-030). The prototype had none either.
 */
import { useParams } from 'react-router';
import { VCPublicProfileView } from '@/crd/components/virtualContributor/VCPublicProfileView';

const SIDEBAR_LABELS = {
  descriptionTitle: 'Description',
  descriptionEmpty: 'No description provided.',
  hostTitle: 'Host',
  hostEmpty: 'No host.',
  referencesTitle: 'Links',
  referencesEmpty: 'No links yet.',
  bodyOfKnowledgeTitle: 'Body of Knowledge',
  bodyOfKnowledgeLoading: 'Loading body of knowledge',
  bodyOfKnowledgePrivateTooltip: 'Body of knowledge is private.',
  bodyOfKnowledgeVisitButton: 'Visit',
};

const CONTENT_LABELS = {
  functionalityHeading: 'Functionality',
  capabilitiesTitle: 'Functional Capabilities',
  dataAccessTitle: 'Data access from the Space where it is a member',
  roleRequirementsTitle: 'Role Requirements',
  aiEngineHeading: 'AI Engine: Alkemio AI',
  yesAnswer: 'Yes',
  noAnswer: 'No',
  unknownAnswer: 'Unknown',
  technicalReferencesNotAvailable: 'Not available',
};

export default function VCProfilePage() {
  const { vcSlug } = useParams<{ vcSlug: string }>();
  const slug = vcSlug || 'softmann';

  const vc = {
    name: 'Softmann',
    avatarUrl:
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80',
    description: 'A secret UX helper tool',
    keywords: ['UX', 'UI', 'Design Research', 'HCI'],
    host: {
      id: 'host-jnijkamp',
      displayName: 'Jeroen Nijkamp',
      avatarImageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      caption: 'Provider',
      secondaryCaption: null,
      href: '/user/jnijkamp',
    },
    references: [
      { id: 'vc-ref-1', name: 'UX Design Guidelines', uri: 'https://example.com/ux-guidelines', description: null },
      { id: 'vc-ref-2', name: 'Research Methodology', uri: 'https://example.com/research-methodology', description: null },
    ],
  };

  const roleRequirementsContent = (
    <p className="text-body text-foreground">
      This VC needs to be granted <strong>member rights</strong> to function correctly.
    </p>
  );

  const monitoringBody = (
    <p>
      Usage is monitored by Alkemio per the{' '}
      <a
        href="https://welcome.alkem.io/legal/#tc"
        target="_blank"
        rel="noreferrer"
        className="text-primary underline-offset-4 hover:underline"
      >
        Terms &amp; Conditions
      </a>
      .
    </p>
  );

  return (
    <VCPublicProfileView
      hero={{
        avatarImageUrl: vc.avatarUrl,
        displayName: vc.name,
        settingsUrl: `/vc/${slug}/settings`,
        typeBadgeLabel: 'Virtual Contributor',
        keywords: vc.keywords,
      }}
      sidebar={{
        description: vc.description,
        host: vc.host,
        references: vc.references,
        bodyOfKnowledge: {
          kind: 'space',
          spaceProfile: {
            id: 'space-lux-lab',
            url: '/space/lux-lab',
            displayName: 'Lux-Lab',
            level: 'L0',
            avatarImageUrl:
              'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
            color: '#7c3aed',
            initials: 'LL',
          },
          hasReadAccess: true,
          description: 'Trained on the open knowledge base of the Lux-Lab space.',
          vcDisplayName: vc.name,
          spaceContextDescription: `${vc.name}'s knowledge is sourced from the Lux-Lab space.`,
        },
        labels: SIDEBAR_LABELS,
      }}
      contentView={{
        functionality: {
          capabilities: [
            { label: 'Answer questions in comments', enabled: true },
            { label: 'Create new posts', enabled: false },
            { label: 'Invite other contributors', enabled: false },
          ],
          dataAccess: [
            { label: 'About page', enabled: true },
            { label: 'Posts & Contributions', enabled: false },
            { label: 'Subspaces', enabled: false },
          ],
          roleRequirements: { kind: 'memberRequired' },
        },
        roleRequirementsContent,
        aiEngine: {
          engineName: 'Alkemio AI',
          cards: [
            {
              id: 'openModelTransparency',
              iconName: 'eye',
              title: 'Open Model Transparency',
              description: 'Does the VC use an open-weight model?',
              booleanAnswer: { value: true },
            },
            {
              id: 'dataUsageDisclosure',
              iconName: 'database',
              title: 'Data Usage Disclosure',
              description: 'Is interaction data used in any way for model training?',
              booleanAnswer: { value: false },
            },
            {
              id: 'knowledgeRestriction',
              iconName: 'shieldCheck',
              title: 'Knowledge Restriction',
              description:
                'Is the VC prompted to limit the responses to a specific body of knowledge?',
              textValue: 'Yes',
            },
            {
              id: 'webAccess',
              iconName: 'globe',
              title: 'Web Access',
              description: 'Can the VC access or search the web?',
              booleanAnswer: { value: false, noIcon: 'clock' },
            },
            {
              id: 'physicalLocation',
              iconName: 'mapPin',
              title: 'Physical Location',
              description: 'Where is the AI service hosted?',
              textValue: 'Sweden, EU',
            },
            {
              id: 'technicalReferences',
              iconName: 'fileText',
              title: 'Technical References',
              description:
                'Access to detailed information on the underlying models specifications',
              action: { href: 'https://example.com/tech-details.pdf', label: 'SEE DOCUMENTATION' },
            },
          ],
        },
        monitoring: { heading: 'Monitoring by Alkemio', body: monitoringBody },
        labels: CONTENT_LABELS,
      }}
      loading={{ hero: false, sidebar: false, bodyOfKnowledge: false, contentView: false }}
      loadingLabels={{
        hero: 'Loading profile header',
        sidebar: 'Loading profile details',
        bodyOfKnowledge: 'Loading body of knowledge',
        contentView: 'Loading content',
      }}
    />
  );
}

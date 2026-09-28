/**
 * Organisation public profile — production's
 * `@/crd/components/organization/OrganizationPublicProfileView`.
 *
 * CRD composes the page: `OrganizationPageHero` (avatar, name, tagline,
 * location, verified badge, message action), `OrganizationProfileSidebar`
 * (bio, tagsets, references, the associates grid with its 12-item
 * show-more/less cap) and `OrganizationResourceSections` behind a
 * `ProfileResourceTabStrip`. Follows CRD's own
 * `crd/app/pages/OrganizationProfileDemoPage` composition.
 *
 * TAB NAMES: the prototype used Memberships / Lead Spaces / Resources.
 * Production's three are Resources Hosted / Lead Spaces / All Memberships,
 * in that order — same content, production's wording and ordering.
 *
 * NOT TOUCHED: the organisation settings pages. Those are the prototype's own
 * redesign — PHASE-2.md section 3.
 */
import { useState } from 'react';
import { useParams } from 'react-router';
import type { ResourceTabKey } from '@/crd/components/common/ProfileResourceTabStrip';
import { OrganizationPublicProfileView } from '@/crd/components/organization/OrganizationPublicProfileView';
import { SpaceGridCard } from '@/crd/components/user/SpaceGridCard';
import { SPACE_GRID_CARD_LABELS } from '@/app/mappers/spaceGridCard';
import { toProfileSpaceCard } from '@/app/mappers/profile';

const TABS = [
  { key: 'resourcesHosted' as ResourceTabKey, label: 'Resources Hosted' },
  { key: 'leading' as ResourceTabKey, label: 'Lead Spaces' },
  { key: 'memberOf' as ResourceTabKey, label: 'All Memberships' },
];

const SIDEBAR_LABELS = {
  bioTitle: 'Bio',
  bioEmpty: 'No bio yet.',
  referencesTitle: 'Links',
  associatesTitle: (count: number) => `${count} associates`,
  associatesSignInCta: 'Sign in to view associates.',
  associatesShowMore: (count: number) => `Show more (${count})`,
  associatesShowLess: 'Show less',
  socialLinksTitle: 'Social',
};

const SECTIONS_LABELS = {
  spacesSubsection: 'Spaces',
  virtualContributorsSubsection: 'Virtual Contributors',
  templatePacksSubsection: 'Template Packs',
  customHomepagesSubsection: 'Custom Homepages',
  spacesLeading: 'Lead Spaces',
  memberOf: 'All Memberships',
  emptyResourcesHosted: 'No resources hosted yet.',
  emptyLeading: 'Not leading any spaces yet.',
  emptyMembership: 'No memberships yet.',
  spacePrivacy: SPACE_GRID_CARD_LABELS,
};

interface OrgData {
  name: string;
  initials: string;
  avatarColor: string;
  tagline: string;
  bio: string;
  keywords: string[];
  associates: { id: string; name: string; avatar: string | null; initials: string }[];
  memberships: { id: string; name: string; image: string }[];
  leadSpaces: { id: string; name: string; image: string }[];
  resourcesHosted: { id: string; name: string; image: string }[];
}

const ORG_DATA: Record<string, OrgData> = {
  "sandbox-organization": {
    name: "Sandbox Organization",
    initials: "SO",
    avatarColor: "#0ea5e9",
    tagline: "For demonstration purposes",
    bio: "This Alkemio sandbox organization will be used for demonstration Spaces, Virtual Contributors and Innovation Packs for various use cases or sectors.",
    keywords: ["demo", "sandbox", "showcase", "examples"],
    associates: [
      { id: "u1", name: "Robin Z. Tharakan", avatar: "https://images.unsplash.com/photo-1651634099348-e4c38cfaa6d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256", initials: "RT" },
      { id: "u2", name: "Denise Larsson", avatar: "https://images.unsplash.com/photo-1757347398206-7425300ef990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256", initials: "DL" },
      { id: "u3", name: "Maloe van den Hoogen", avatar: "https://images.unsplash.com/photo-1623853589874-864b1dd4d922?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256", initials: "MH" },
      { id: "u4", name: "Neil Smyth", avatar: "https://images.unsplash.com/photo-1651097681268-851acda33b18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256", initials: "NS" },
      { id: "u5", name: "Support Alkemio", avatar: null, initials: "SA" },
      { id: "u6", name: "Jeroen Nijkamp", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", initials: "JN" },
      { id: "u7", name: "Rekencoördinator School A", avatar: null, initials: "RE" },
    ],
    memberships: [],
    leadSpaces: [],
    resourcesHosted: []
  }
};

function getOrgData(slug: string): OrgData {
  return ORG_DATA[slug] || {
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    initials: slug.substring(0, 2).toUpperCase(),
    avatarColor: "#64748b",
    tagline: "",
    bio: "",
    keywords: [],
    associates: [],
    memberships: [],
    leadSpaces: [],
    resourcesHosted: []
  };
}


export default function OrgProfilePage() {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const org = getOrgData(orgSlug || '');
  const [activeTab, setActiveTab] = useState<ResourceTabKey>('resourcesHosted');

  const gridCards = (spaces: { id: string; name: string; image: string }[]) =>
    spaces.map(space => (
      <SpaceGridCard
        key={space.id}
        space={toProfileSpaceCard({ id: space.id, title: space.name, imageUrl: space.image })}
        labels={SPACE_GRID_CARD_LABELS}
      />
    ));

  return (
    <OrganizationPublicProfileView
      hero={{
        avatarImageUrl: null,
        color: org.avatarColor,
        displayName: org.name,
        tagline: org.tagline || null,
        location: null,
        verified: false,
        settingsHref: `/organization/${orgSlug}/settings`,
        onSendMessage: null,
      }}
      sidebar={{
        bio: org.bio || null,
        tagsets: org.keywords.length > 0
          ? [{ key: 'keywords', name: 'Keywords', tags: org.keywords }]
          : [],
        references: [],
        associates: {
          associates: org.associates.map(a => ({
            id: a.id,
            displayName: a.name,
            avatarImageUrl: a.avatar,
            url: `/user/${a.name.toLowerCase().replace(/\s+/g, '-')}`,
          })),
          totalCount: org.associates.length,
          canReadUsers: true,
        },
        labels: SIDEBAR_LABELS,
      }}
      tabStrip={{
        tabs: TABS,
        activeTab,
        onSelectTab: setActiveTab,
        ariaLabel: 'Organization profile resource tabs',
      }}
      rightColumn={{
        activeTab,
        hostedSpaces: org.resourcesHosted.map(r =>
          toProfileSpaceCard({ id: r.id, title: r.name, imageUrl: r.image })
        ),
        hostedVirtualContributors: [],
        hostedInnovationPacks: [],
        hostedInnovationHubs: [],
        leadSpaces: gridCards(org.leadSpaces),
        memberOf: gridCards(org.memberships),
        labels: SECTIONS_LABELS,
      }}
      loading={{ hero: false, sidebar: false, hostedResources: false, memberships: false }}
      loadingLabels={{
        hero: 'Loading profile header',
        sidebar: 'Loading profile details',
        hostedResources: 'Loading hosted resources',
        memberships: 'Loading memberships',
      }}
    />
  );
}

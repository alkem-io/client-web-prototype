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

const AVATARS = {
  robin: "https://images.unsplash.com/photo-1651634099348-e4c38cfaa6d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256",
  denise: "https://images.unsplash.com/photo-1757347398206-7425300ef990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256",
  maloe: "https://images.unsplash.com/photo-1623853589874-864b1dd4d922?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256",
  neil: "https://images.unsplash.com/photo-1651097681268-851acda33b18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256",
  jeroen: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  sarah: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  david: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  anna: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  elena: "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256",
  james: "https://images.unsplash.com/photo-1603143704710-99d6011f107e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256",
  robert: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  emily: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

const BANNERS = {
  solar: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=60",
  city: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=60",
  park: "https://images.unsplash.com/photo-1448375240586-dfd8d3cd6052?auto=format&fit=crop&w=800&q=60",
  transit: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=60",
  garden: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=60",
  hack: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=60",
  wind: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=800&q=60",
  water: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=60",
  data: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&w=800&q=60",
};

const ORG_DATA: Record<string, OrgData> = {
  "sandbox-organization": {
    name: "Sandbox Organization",
    initials: "SO",
    avatarColor: "#0ea5e9",
    tagline: "For demonstration purposes",
    bio: "This Alkemio sandbox organization will be used for demonstration Spaces, Virtual Contributors and Innovation Packs for various use cases or sectors.",
    keywords: ["demo", "sandbox", "showcase", "examples"],
    associates: [
      { id: "u1", name: "Robin Z. Tharakan", avatar: AVATARS.robin, initials: "RT" },
      { id: "u2", name: "Denise Larsson", avatar: AVATARS.denise, initials: "DL" },
      { id: "u3", name: "Maloe van den Hoogen", avatar: AVATARS.maloe, initials: "MH" },
      { id: "u4", name: "Neil Smyth", avatar: AVATARS.neil, initials: "NS" },
      { id: "u5", name: "Support Alkemio", avatar: null, initials: "SA" },
      { id: "u6", name: "Jeroen Nijkamp", avatar: AVATARS.jeroen, initials: "JN" },
      { id: "u7", name: "Rekencoördinator School A", avatar: null, initials: "RE" },
    ],
    memberships: [
      { id: "m1", name: "Green Energy Space", image: BANNERS.solar },
      { id: "m2", name: "Community Garden", image: BANNERS.garden },
    ],
    leadSpaces: [{ id: "l1", name: "Welcome", image: BANNERS.city }],
    resourcesHosted: [
      { id: "r1", name: "Demo Space Templates", image: BANNERS.data },
      { id: "r2", name: "Onboarding Playbook", image: BANNERS.hack },
    ],
  },

  cityscale: {
    name: "CityScale",
    initials: "CS",
    avatarColor: "#2563eb",
    tagline: "Smart city infrastructure for mid-sized municipalities",
    bio: "CityScale builds the digital backbone for municipal energy, mobility and water systems. We work with city administrations across Europe to turn climate commitments into deployed infrastructure.\n\nOur teams pair urban planners with software engineers, so the models we build are the ones cities can actually operate.",
    keywords: ["Smart Cities", "IoT", "Urban Planning", "Energy"],
    associates: [
      { id: "cs1", name: "Alex Rivera", avatar: AVATARS.jeroen, initials: "AR" },
      { id: "cs2", name: "Sarah Chen", avatar: AVATARS.sarah, initials: "SC" },
      { id: "cs3", name: "David Kim", avatar: AVATARS.david, initials: "DK" },
      { id: "cs4", name: "Emily Davis", avatar: AVATARS.emily, initials: "ED" },
      { id: "cs5", name: "Robert Fox", avatar: AVATARS.robert, initials: "RF" },
    ],
    memberships: [
      { id: "cm1", name: "Public Transit Data", image: BANNERS.transit },
      { id: "cm2", name: "Civic Hacking", image: BANNERS.hack },
    ],
    leadSpaces: [
      { id: "cl1", name: "Renewable Energy Grid", image: BANNERS.solar },
      { id: "cl2", name: "Smart Traffic Systems", image: BANNERS.city },
    ],
    resourcesHosted: [
      { id: "cr1", name: "Municipal Energy Toolkit", image: BANNERS.solar },
      { id: "cr2", name: "Mobility Modelling Pack", image: BANNERS.transit },
    ],
  },

  "open-climate-fix": {
    name: "Open Climate Fix",
    initials: "OC",
    avatarColor: "#059669",
    tagline: "Open source machine learning for climate",
    bio: "A non-profit product lab working on the fastest routes to cutting greenhouse gas emissions. Everything we build is open source, from solar forecasting models to the datasets behind them.",
    keywords: ["Climate", "Machine Learning", "Open Source", "Forecasting"],
    associates: [
      { id: "oc1", name: "Anna Smith", avatar: AVATARS.anna, initials: "AS" },
      { id: "oc2", name: "James Wilson", avatar: AVATARS.james, initials: "JW" },
      { id: "oc3", name: "Elena Rodriguez", avatar: AVATARS.elena, initials: "ER" },
    ],
    memberships: [{ id: "om1", name: "Green Energy Space", image: BANNERS.solar }],
    leadSpaces: [{ id: "ol1", name: "Solar Forecasting", image: BANNERS.solar }],
    resourcesHosted: [{ id: "or1", name: "Open Climate Datasets", image: BANNERS.data }],
  },

  "urban-tech-alliance": {
    name: "Urban Tech Alliance",
    initials: "UT",
    avatarColor: "#7c3aed",
    tagline: "A network for people building the cities we want to live in",
    bio: "The Urban Tech Alliance connects 2,400 practitioners across technology, infrastructure and policy. We run working groups, publish shared standards, and host the annual Urban Futures gathering.",
    keywords: ["Technology", "Infrastructure", "Sustainability", "Network"],
    associates: [
      { id: "ut1", name: "Maya Ross", avatar: AVATARS.maloe, initials: "MR" },
      { id: "ut2", name: "Lucas Oliveira", avatar: null, initials: "LO" },
      { id: "ut3", name: "Sophia Li", avatar: null, initials: "SL" },
      { id: "ut4", name: "Neil Smyth", avatar: AVATARS.neil, initials: "NS" },
    ],
    memberships: [
      { id: "um1", name: "Urban Green Spaces", image: BANNERS.park },
      { id: "um2", name: "Public Transit Data", image: BANNERS.transit },
    ],
    leadSpaces: [{ id: "ul1", name: "Urban Futures", image: BANNERS.city }],
    resourcesHosted: [],
  },

  "green-future-labs": {
    name: "Green Future Labs",
    initials: "GF",
    avatarColor: "#16a34a",
    tagline: "Research and pilots for the energy transition",
    bio: "Green Future Labs runs applied research on renewable energy systems, from community solar to grid-scale storage. We partner with municipalities to move promising pilots into production.",
    keywords: ["Research", "Renewables", "Energy Storage", "Pilots"],
    associates: [
      { id: "gf1", name: "Sarah Chen", avatar: AVATARS.sarah, initials: "SC" },
      { id: "gf2", name: "David Kim", avatar: AVATARS.david, initials: "DK" },
      { id: "gf3", name: "Emily Davis", avatar: AVATARS.emily, initials: "ED" },
    ],
    memberships: [{ id: "gm1", name: "Green Energy Space", image: BANNERS.solar }],
    leadSpaces: [
      { id: "gl1", name: "Renewable Energy Transition", image: BANNERS.wind },
      { id: "gl2", name: "Battery Storage Research", image: BANNERS.data },
    ],
    resourcesHosted: [{ id: "gr1", name: "Energy Pilot Templates", image: BANNERS.wind }],
  },

  "utrecht-university": {
    name: "Utrecht University",
    initials: "UU",
    avatarColor: "#dc2626",
    tagline: "Faculty of Geosciences",
    bio: "The Faculty of Geosciences studies the Earth system and how societies can live within it. Our sustainability groups collaborate with cities and civil society on the practical side of the transition.",
    keywords: ["Education", "Research", "Geosciences", "Sustainability"],
    associates: [
      { id: "uu1", name: "Anna Martinez", avatar: AVATARS.anna, initials: "AM" },
      { id: "uu2", name: "Robert Fox", avatar: AVATARS.robert, initials: "RF" },
    ],
    memberships: [
      { id: "uum1", name: "Green Energy Space", image: BANNERS.solar },
      { id: "uum2", name: "Community Garden", image: BANNERS.garden },
    ],
    leadSpaces: [{ id: "uul1", name: "Water Systems Research", image: BANNERS.water }],
    resourcesHosted: [{ id: "uur1", name: "Field Research Methods", image: BANNERS.park }],
  },

  "city-of-amsterdam": {
    name: "City of Amsterdam",
    initials: "CA",
    avatarColor: "#d97706",
    tagline: "Municipality",
    bio: "Amsterdam's sustainability and digitalisation programmes, working in the open with residents, researchers and local businesses.",
    keywords: ["Municipality", "Policy", "Participation", "Open Data"],
    associates: [
      { id: "ca1", name: "Maloe van den Hoogen", avatar: AVATARS.maloe, initials: "MH" },
      { id: "ca2", name: "Denise Larsson", avatar: AVATARS.denise, initials: "DL" },
      { id: "ca3", name: "Jeroen Nijkamp", avatar: AVATARS.jeroen, initials: "JN" },
    ],
    memberships: [{ id: "cam1", name: "Urban Green Spaces", image: BANNERS.park }],
    leadSpaces: [{ id: "cal1", name: "Community Engagement", image: BANNERS.hack }],
    resourcesHosted: [{ id: "car1", name: "Participation Playbook", image: BANNERS.hack }],
  },

  "sustainable-cities-fund": {
    name: "Sustainable Cities Fund",
    initials: "SF",
    avatarColor: "#0891b2",
    tagline: "Financing the urban transition",
    bio: "We fund municipal sustainability projects that are too small for infrastructure banks and too large for grants. Our portfolio spans energy retrofits, mobility pilots and green infrastructure.",
    keywords: ["Funding", "Finance", "Investment", "Cities"],
    associates: [
      { id: "sf1", name: "James Wilson", avatar: AVATARS.james, initials: "JW" },
      { id: "sf2", name: "Elena Rodriguez", avatar: AVATARS.elena, initials: "ER" },
    ],
    memberships: [{ id: "sfm1", name: "Green Energy Space", image: BANNERS.solar }],
    leadSpaces: [],
    resourcesHosted: [{ id: "sfr1", name: "Funding Application Templates", image: BANNERS.data }],
  },
};

/**
 * Any organisation linked from elsewhere in the prototype resolves here. The
 * named entries above cover every org the app actually links to; the fallback
 * below gives an unlisted slug a plausible profile rather than a blank page,
 * so clicking an organisation never dead-ends.
 */
const FALLBACK_COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#db2777", "#0891b2"];

function getOrgData(slug: string): OrgData {
  const known = ORG_DATA[slug];
  if (known) return known;

  const name = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  // Deterministic, so the same slug always renders the same colour.
  const colorIndex =
    [...slug].reduce((total, char) => total + char.charCodeAt(0), 0) % FALLBACK_COLORS.length;

  return {
    name,
    initials: name
      .split(" ")
      .map(word => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    avatarColor: FALLBACK_COLORS[colorIndex],
    tagline: "Working in the open on Alkemio",
    bio: `${name} collaborates with other organisations and contributors across the platform. This profile has not been filled in yet — an admin can add a bio, links and keywords from the organisation settings.`,
    keywords: ["Collaboration"],
    associates: [
      { id: `${slug}-a1`, name: "Sarah Chen", avatar: AVATARS.sarah, initials: "SC" },
      { id: `${slug}-a2`, name: "David Kim", avatar: AVATARS.david, initials: "DK" },
    ],
    memberships: [{ id: `${slug}-m1`, name: "Green Energy Space", image: BANNERS.solar }],
    leadSpaces: [],
    resourcesHosted: [],
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

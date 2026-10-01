/**
 * User public profile — production's
 * `@/crd/components/user/UserPublicProfileView`.
 *
 * CRD composes the whole page: `UserPageHero` (avatar, name, tagline,
 * location, message action), `UserProfileSidebar` (bio, tagsets,
 * organisations, links) and `UserResourceSections` behind a
 * `ProfileResourceTabStrip`. Its own demo page (`crd/app/pages/
 * UserProfileOtherDemoPage`) is the composition this follows — and CRD's demo
 * profile is literally Alex Rivera, taken from this prototype, so the shapes
 * already line up.
 *
 * TAB CHANGE: the prototype had five tabs — All Resources, Hosted Spaces,
 * Virtual Contributors, Leading, Member Of. Production has three, because
 * hosted spaces, virtual contributors, template packs and innovation hubs are
 * subsections *within* "Resources Hosted" rather than tabs of their own.
 * Nothing is lost; it is one level shallower.
 *
 * NOT TOUCHED: the user settings pages. Those are the prototype's own
 * redesign — PHASE-2.md section 3.
 */
import { useState } from 'react';
import { useParams } from 'react-router';
import { CompactContributorCard } from '@/crd/components/common/CompactContributorCard';
import type { ResourceTabKey } from '@/crd/components/common/ProfileResourceTabStrip';
import { SpaceGridCard } from '@/crd/components/user/SpaceGridCard';
import { UserPublicProfileView } from '@/crd/components/user/UserPublicProfileView';
import { SPACE_GRID_CARD_LABELS } from '@/app/mappers/spaceGridCard';
import {
  toCompactOrg,
  toProfileSpaceCard,
  toProfileVirtualContributor,
} from '@/app/mappers/profile';

const TABS = [
  { key: 'resourcesHosted' as ResourceTabKey, label: 'Resources Hosted' },
  { key: 'leading' as ResourceTabKey, label: 'Leading' },
  { key: 'memberOf' as ResourceTabKey, label: 'Member Of' },
];

const SIDEBAR_LABELS = {
  aboutTitle: 'About',
  organizationsTitle: 'Organizations',
  referencesTitle: 'Links',
  socialLinksTitle: 'Social',
  bioEmpty: 'No bio yet.',
  organizationsEmpty: 'Not part of any organization yet.',
};

const SECTIONS_LABELS = {
  spacesSubsection: 'Spaces',
  virtualContributorsSubsection: 'Virtual Contributors',
  templatePacksSubsection: 'Template Packs',
  customHomepagesSubsection: 'Custom Homepages',
  spacesLeading: 'Spaces Leading',
  memberOf: 'Member of',
  emptyResourcesHosted: 'No resources hosted yet.',
  emptyLeading: 'Not leading any spaces yet.',
  emptyMembership: 'No memberships yet.',
  spacePrivacy: SPACE_GRID_CARD_LABELS,
};

export default function UserProfilePage() {
  const { userSlug } = useParams<{ userSlug: string }>();
  const [activeTab, setActiveTab] = useState<ResourceTabKey>('resourcesHosted');

  // Mock Data
  const user = {
    name: "Alex Rivera",
    username: userSlug || "arivera",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    location: "San Francisco, CA",
    bio: `Passionate about sustainable urban planning and civic technology. Leading the transition to renewable energy grids at CityScale.
    
Always looking for collaborators on open source climate data projects. Feel free to reach out if you're interested in smart city infrastructure!`,
    isOwnProfile: true, // For demo purposes
  };

  const organizations = [
    { id: 1, name: "CityScale", role: "Director of Innovation", memberCount: 142, imageUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80", tags: ["Smart Cities", "IoT", "Urban Planning"] },
    { id: 2, name: "Open Climate Fix", role: "Contributor", memberCount: 850, imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80", tags: ["Climate", "Machine Learning", "Open Source"] },
    { id: 3, name: "Urban Tech Alliance", role: "Member", memberCount: 2400, imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80", tags: ["Technology", "Infrastructure", "Sustainability"] },
  ];

  const hostedSpaces = [
    { id: 1, title: "Renewable Energy Grid", description: "Collaborating on the future of distributed energy resources and microgrid implementation.", memberCount: 45, isPrivate: false, role: "host", imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 2, title: "Smart Traffic Systems", description: "AI-driven traffic management solutions for mid-sized cities.", memberCount: 12, isPrivate: true, role: "host", imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
  ];

  const virtualContributors = [
    { id: 1, name: "DataSynth Bot", slug: "datasynth-bot", description: "Generates synthetic datasets for urban modeling.", type: "AI Model" },
    { id: 2, name: "PolicyScanner", slug: "policyscanner", description: "Scans municipal meeting minutes for keywords.", type: "Scraper" },
  ];

  const leadingSpaces = [
    { id: 3, title: "Urban Green Spaces", description: "Designing accessible parks and recreational areas in dense urban environments.", memberCount: 89, isPrivate: false, role: "facilitator", imageUrl: "https://images.unsplash.com/photo-1448375240586-dfd8d3cd6052?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
  ];

  const memberSpaces = [
    { id: 4, title: "Public Transit Data", description: "Open data standards for public transportation systems.", memberCount: 230, isPrivate: false, role: "member", imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 5, title: "Community Gardens", description: "Local food production initiatives.", memberCount: 56, isPrivate: false, role: "member", imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 6, title: "Civic Hacking", description: "Weekly hackathons for civic tech projects.", memberCount: 120, isPrivate: false, role: "member", imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
  ];


  const organizationsSlot = organizations.map(org => {
    const data = toCompactOrg(org);
    return (
      <CompactContributorCard
        key={data.id}
        id={data.id}
        displayName={data.displayName}
        avatarImageUrl={data.avatarImageUrl}
        caption={data.caption}
        secondaryCaption={data.secondaryCaption}
        href={data.href}
        badge={{ label: String(data.memberCount), icon: 'users' }}
      />
    );
  });

  const gridCards = (spaces: typeof hostedSpaces) =>
    spaces.map(space => (
      <SpaceGridCard
        key={space.id}
        space={toProfileSpaceCard(space)}
        labels={SPACE_GRID_CARD_LABELS}
      />
    ));

  return (
    <UserPublicProfileView
      hero={{
        avatarImageUrl: user.avatarUrl,
        color: '#1d384a',
        displayName: user.name,
        tagline: 'Sustainable urban planning & civic technology',
        location: user.location,
        // The prototype treats this as the viewer's own profile.
        showSettingsIcon: user.isOwnProfile,
        settingsHref: `/user/${userSlug ?? user.username}/settings`,
      }}
      sidebar={{
        bio: user.bio,
        tagsets: [
          {
            key: 'keywords',
            name: 'Keywords',
            tags: ['Smart Cities', 'Renewables', 'Civic Tech'],
          },
        ],
        organizationsSlot,
        organizationsEmpty: organizations.length === 0,
        labels: SIDEBAR_LABELS,
      }}
      tabStrip={{
        tabs: TABS,
        activeTab,
        onSelectTab: setActiveTab,
        ariaLabel: 'User profile resource tabs',
      }}
      sections={{
        activeTab,
        hostedSpaces: hostedSpaces.map(toProfileSpaceCard),
        hostedVirtualContributors: virtualContributors.map(toProfileVirtualContributor),
        hostedInnovationPacks: [],
        hostedInnovationHubs: [],
        spacesLeading: gridCards(leadingSpaces),
        spacesMember: gridCards(memberSpaces),
        labels: SECTIONS_LABELS,
      }}
      loading={{ hero: false, organizations: false, hostedResources: false, memberships: false }}
      loadingLabels={{
        hero: 'Loading profile header',
        organizations: 'Loading organizations',
        hostedResources: 'Loading hosted resources',
        memberships: 'Loading memberships',
      }}
    />
  );
}

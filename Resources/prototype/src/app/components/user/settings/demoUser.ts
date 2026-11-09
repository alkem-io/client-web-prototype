import type { DemoAccountResources } from "@/app/components/shared/DemoAccountTab";
import type { MembershipRowData } from "@/crd/components/contributor/settings/MembershipsSection.types";
import type { UserProfileFormValues } from "@/crd/components/user/settings/UserProfileTabView.types";
import { MOCK_ALEX_RIVERA as ALEX } from "@/crd/app/data/profiles";
import { pickColorFromId } from "@/crd/lib/pickColorFromId";

/**
 * The person every user settings page shows: Alex Rivera, the person the rest of
 * the prototype links to (`/user/alex-rivera/settings/...`).
 */
export const DEMO_USER = {
  id: ALEX.id,
  displayName: ALEX.hero.displayName,
  avatarUrl: ALEX.hero.avatarImageUrl,
  avatarColor: ALEX.hero.color,
};

const tagsOf = (key: string) => ALEX.tagsets.find((tagset) => tagset.key === key)?.tags ?? [];

const recognized = (network: string, uri: string) => ({
  id: `ref-${network}`,
  name: network,
  uri,
  description: "",
  recognized: true,
});

export const DEMO_USER_PROFILE: UserProfileFormValues = {
  profileId: "profile-alex-rivera",
  displayName: ALEX.hero.displayName,
  firstName: "Alex",
  lastName: "Rivera",
  email: "alex.rivera@cityscale.org",
  phone: "+1 415 555 0142",
  tagline: ALEX.hero.tagline,
  city: "San Francisco",
  country: "US",
  bio: ALEX.bio,
  skills: { id: "tagset-skills", tags: tagsOf("skills") },
  keywords: { id: "tagset-keywords", tags: tagsOf("keywords") },
  avatar: { id: "avatar-alex-rivera", uri: ALEX.hero.avatarImageUrl, altText: ALEX.hero.displayName },
  references: [
    {
      id: "ref-portfolio",
      name: "Transit data portfolio",
      uri: "https://example.org/alex-rivera/transit",
      description: "Open datasets from the transit programme",
      recognized: false,
    },
  ],
  recognizedReferences: {
    linkedin: recognized("linkedin", "https://www.linkedin.com/in/alex-rivera"),
    bsky: recognized("bsky", "https://bsky.app/profile/alex-rivera.bsky.social"),
    github: null,
  },
};

const toAccountItem = (item: { id: string; displayName: string; description?: string | null; href: string }) => ({
  id: item.id,
  displayName: item.displayName,
  description: item.description ?? undefined,
  href: item.href,
});

const slugOf = (id: string, prefix: string) => id.replace(prefix, "");

const IMAGE = (id: string) => `https://images.unsplash.com/${id}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400`;

/** The banner in the shared mock data no longer exists at its address, so this space has its own. */
const LEADING_SPACES = ALEX.leadingSpaces.map((space) => ({
  ...space,
  imageUrl: IMAGE("photo-1623251606108-512c7c4a3507"),
}));

export const DEMO_USER_ACCOUNT: DemoAccountResources = {
  spaces: [
    ...LEADING_SPACES.map((space) => ({
      id: space.id,
      displayName: space.title,
      description: space.description,
      avatarUrl: space.imageUrl,
      href: space.href,
    })),
    {
      id: "space-green-energy-alpha",
      displayName: "Green Energy Space Alpha",
      description: "Central collaborative workspace for the Q1 innovation sprint.",
      avatarUrl: IMAGE("photo-1765728617352-895327fcf036"),
      href: "/space/green-energy-space-alpha",
    },
    {
      id: "space-remote-lounge",
      displayName: "Remote Team Lounge",
      description: "Casual hangout space for distributed team members.",
      avatarUrl: IMAGE("photo-1568992688243-52608227497d"),
      href: "/space/remote-team-lounge",
    },
  ],
  virtualContributors: ALEX.hostedVirtualContributors.map(toAccountItem),
  innovationPacks: ALEX.hostedInnovationPacks.map((pack) => ({
    ...toAccountItem(pack),
    href: `/templates/packs/${slugOf(pack.id, "pack-")}`,
  })),
  innovationHubs: ALEX.hostedInnovationHubs.map((hub) => ({
    ...toAccountItem(hub),
    href: `/innovation-hub/${slugOf(hub.id, "hub-")}`,
  })),
};

const LEADS = [
  { id: "lead-sarah", displayName: "Sarah Chen", avatarUrl: "https://i.pravatar.cc/150?img=1" },
  { id: "lead-jordan", displayName: "Jordan Park", avatarUrl: "https://i.pravatar.cc/150?img=3" },
];

export const DEMO_USER_MEMBERSHIPS: MembershipRowData[] = [
  ...LEADING_SPACES.map((space) => ({
    id: space.id,
    displayName: space.title,
    avatarUrl: space.imageUrl,
    color: space.color,
    type: "Space" as const,
    role: "Lead" as const,
    spaceUrl: space.href,
    leadUsers: [{ id: ALEX.id, displayName: ALEX.hero.displayName, avatarUrl: ALEX.hero.avatarImageUrl }],
  })),
  ...ALEX.memberSpaces.map((space) => ({
    id: space.id,
    displayName: space.title,
    avatarUrl: space.imageUrl,
    color: space.color,
    type: "Space" as const,
    role: "Member" as const,
    spaceUrl: space.href,
    leadUsers: LEADS,
  })),
  {
    id: "subspace-bus-routes",
    displayName: "Bus Route Redesign",
    color: pickColorFromId("subspace-bus-routes"),
    type: "Subspace",
    role: "Admin",
    spaceUrl: "/space/public-transit/subspaces/bus-route-redesign",
    leadUsers: LEADS.slice(0, 1),
  },
];

export const DEMO_PENDING_APPLICATIONS = [
  { id: "application-ai-research", displayName: "AI Research Collective", spaceUrl: "/space/ai-research-collective" },
];

export const DEMO_USER_ORGANIZATIONS = ALEX.organizations.map((org, index) => ({
  id: org.id,
  displayName: org.displayName,
  avatarUrl: org.avatarImageUrl ?? undefined,
  location: ["San Francisco, US", "London, GB", "Amsterdam, NL"][index],
  color: pickColorFromId(org.id),
  role: index === 0 ? ("Admin" as const) : ("Associate" as const),
  verified: index !== 2,
  profileUrl: org.href ?? "",
  associatesCount: org.memberCount,
}));

export const DEMO_LANGUAGES = [
  { code: "bg", label: "Български" },
  { code: "de", label: "Deutsch" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "nl", label: "Nederlands" },
];

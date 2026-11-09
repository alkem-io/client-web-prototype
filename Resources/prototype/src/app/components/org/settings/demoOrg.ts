import type { DemoAccountResources } from "@/app/components/shared/DemoAccountTab";
import type { MembershipRowData } from "@/crd/components/contributor/settings/MembershipsSection.types";
import type { OrgAssociateListRow } from "@/crd/components/organization/settings/OrgAssociatesTabView";
import type { OrgProfileFormValuesData } from "@/crd/components/organization/settings/OrgProfileTabView";
import type { PendingMembership } from "@/crd/components/space/settings/PendingMembershipsTable";
import { MOCK_ALEX_RIVERA, MOCK_ORG_ALKEMIO as ALKEMIO } from "@/crd/app/data/profiles";
import { pickColorFromId } from "@/crd/lib/pickColorFromId";

/** Named after the address, so any organisation reached by link looks like itself. */
export function getDemoOrg(slug: string) {
  const isAlkemio = slug === ALKEMIO.slug;
  const displayName = isAlkemio
    ? ALKEMIO.hero.displayName
    : slug.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  return {
    slug,
    displayName,
    initials: displayName.slice(0, 2).toUpperCase(),
    color: pickColorFromId(`org-${slug}`),
  };
}

const tagsOf = (key: string) => ALKEMIO.tagsets.find((tagset) => tagset.key === key)?.tags ?? [];

export function getDemoOrgProfile(slug: string): OrgProfileFormValuesData {
  const { displayName } = getDemoOrg(slug);
  return {
    profileId: `profile-${slug}`,
    organizationId: `org-${slug}`,
    nameID: slug,
    displayName,
    tagline: ALKEMIO.hero.tagline ?? "",
    description: ALKEMIO.bio,
    city: "Amsterdam",
    country: "NL",
    keywords: { id: "tagset-keywords", tags: tagsOf("keywords") },
    capabilities: { id: "tagset-capabilities", tags: tagsOf("capabilities") },
    contactEmail: "hello@alkem.io",
    domain: "alkem.io",
    legalEntityName: "Stichting Alkemio",
    website: "https://alkem.io",
    avatar: { id: `avatar-${slug}`, uri: null, altText: displayName },
    references: [
      {
        id: "ref-handbook",
        name: "Foundation handbook",
        uri: "https://alkem.io/handbook",
        description: "",
        recognized: false,
      },
    ],
    recognizedReferences: {
      linkedin: {
        id: "ref-linkedin",
        name: "linkedin",
        uri: "https://www.linkedin.com/company/alkemio",
        description: "",
        recognized: true,
      },
      bsky: {
        id: "ref-bsky",
        name: "bsky",
        uri: "https://bsky.app/profile/alkem.io",
        description: "",
        recognized: true,
      },
      github: {
        id: "ref-github",
        name: "github",
        uri: "https://github.com/alkem-io",
        description: "",
        recognized: true,
      },
    },
    verifiedStatus: slug === ALKEMIO.slug ? "verified" : "notVerified",
  };
}

const IMAGE = (id: string) =>
  `https://images.unsplash.com/${id}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400`;

export const DEMO_ORG_ACCOUNT: DemoAccountResources = {
  spaces: [
    ...ALKEMIO.leadSpaces.map((space) => ({
      id: space.id,
      displayName: space.title,
      description: space.description,
      avatarUrl: space.imageUrl,
      href: space.href,
    })),
    {
      id: "space-open-innovation",
      displayName: "Open Innovation",
      description: "Open innovation practices and methodology.",
      avatarUrl: IMAGE("photo-1676276376052-dc9c9c0b6917"),
      href: "/space/open-innovation",
    },
    {
      id: "space-digital-autonomy",
      displayName: "Digital Autonomy",
      description: "The European landscape for digital autonomy.",
      avatarUrl: IMAGE("photo-1735639013995-086e648eaa38"),
      href: "/space/digital-autonomy",
    },
  ],
  virtualContributors: ALKEMIO.hostedVirtualContributors.map((vc) => ({
    id: vc.id,
    displayName: vc.displayName,
    description: vc.description,
    href: vc.href,
  })),
  innovationPacks: ALKEMIO.hostedInnovationPacks.map((pack) => ({
    id: pack.id,
    displayName: pack.displayName,
    description: pack.description ?? undefined,
    href: `/templates/packs/${pack.id.replace("pack-", "")}`,
  })),
  innovationHubs: ALKEMIO.hostedInnovationHubs.map((hub) => ({
    id: hub.id,
    displayName: hub.displayName,
    description: hub.description ?? undefined,
    href: `/innovation-hub/${hub.id.replace("hub-", "")}`,
  })),
};

const ALEX_AVATAR = MOCK_ALEX_RIVERA.hero.avatarImageUrl;

/** Production has one line under a name; email and location share it, so search can match both. */
const member = (
  id: string,
  displayName: string,
  email: string,
  location: string,
  role: "owner" | "admin" | "associate",
  avatarUrl?: string
): OrgAssociateListRow => ({
  id,
  displayName,
  avatarUrl,
  subtitle: `${email} · ${location}`,
  color: pickColorFromId(id),
  isAssociate: true,
  isAdmin: role === "admin",
  isOwner: role === "owner",
});

export const DEMO_ASSOCIATES: OrgAssociateListRow[] = [
  member("u1", "Neil Smyth", "neil@alkemio.org", "Leidschendam, NL", "owner", "https://i.pravatar.cc/150?img=12"),
  member("u2", "Robin Z. Tharakan", "robin@alkemio.org", "Den Haag, NL", "admin", "https://i.pravatar.cc/150?img=15"),
  member("u3", "Denise Larsson", "denise@alkem.io", "Amsterdam, NL", "admin", "https://i.pravatar.cc/150?img=5"),
  member("u4", "Maloe van den Hoogen", "maloe@alkem.io", "Amsterdam, NL", "associate", "https://i.pravatar.cc/150?img=9"),
  member("u5", "Support Alkemio", "support+1@alkem.io", "Den Haag, NL", "associate"),
  member("u6", "Alex Rivera", "alex.rivera@cityscale.org", "San Francisco, US", "associate", ALEX_AVATAR),
];

export const DEMO_PENDING: PendingMembership[] = [
  {
    id: "p1",
    type: "application",
    state: "new",
    contributorType: "user",
    displayName: "Michael Chen",
    email: "m.chen@university.edu",
    createdDate: "2026-10-20T09:30:00.000Z",
    canApprove: true,
    canReject: true,
    canDelete: false,
    canResend: false,
  },
  {
    id: "p2",
    type: "invitation",
    state: "invited",
    contributorType: "user",
    displayName: "Jessica Alverez",
    email: "jess.alverez@studio.com",
    createdDate: "2026-10-28T14:00:00.000Z",
    canApprove: false,
    canReject: false,
    canDelete: true,
    canResend: false,
    offeredRoleLabel: "Associate + Admin",
  },
  {
    id: "p3",
    type: "platformInvitation",
    state: "invited",
    contributorType: "user",
    displayName: "sam@openclimate.example",
    email: "sam@openclimate.example",
    createdDate: "2026-11-02T08:15:00.000Z",
    canApprove: false,
    canReject: false,
    canDelete: true,
    canResend: true,
    offeredRoleLabel: "Associate",
  },
];

/** People who could be invited in the demo's search. */
export const DEMO_INVITE_CANDIDATES = ALKEMIO.associates.slice(0, 8).map((person) => ({
  userId: person.id,
  displayName: person.displayName,
  avatarUrl: person.avatarImageUrl ?? undefined,
}));

export const DEMO_ORG_MEMBERSHIPS: MembershipRowData[] = [
  ...ALKEMIO.leadSpaces.map((space) => ({
    id: space.id,
    displayName: space.title,
    avatarUrl: space.imageUrl,
    color: space.color,
    type: "Space" as const,
    role: "Lead" as const,
    spaceUrl: space.href,
    leadUsers: [{ id: "u1", displayName: "Neil Smyth", avatarUrl: "https://i.pravatar.cc/150?img=12" }],
  })),
  ...ALKEMIO.memberOfSpaces.map((space) => ({
    id: space.id,
    displayName: space.title,
    avatarUrl: space.imageUrl,
    color: space.color,
    type: "Space" as const,
    role: "Member" as const,
    spaceUrl: space.href,
    leadUsers: [{ id: "lead-sarah", displayName: "Sarah Chen", avatarUrl: "https://i.pravatar.cc/150?img=1" }],
  })),
  {
    id: "subspace-allotments",
    displayName: "Neighbourhood Allotments",
    color: pickColorFromId("subspace-allotments"),
    type: "Subspace",
    role: "Member",
    spaceUrl: "/space/community-gardens/subspaces/neighbourhood-allotments",
    leadUsers: [],
  },
];

export const DEMO_ORG_INVITATIONS = [
  {
    id: "si1",
    spaceDisplayName: "Green Energy Innovation",
    spaceUrl: "/space/green-energy-innovation",
    invitedBy: "Elena Martinez",
    createdDate: "2026-10-18",
    role: "member" as const,
    welcomeMessage: "We would love your organisation's experience with municipal energy projects.",
    spacesToJoin: [],
  },
  {
    id: "si2",
    spaceDisplayName: "Urban Mobility Lab",
    spaceUrl: "/space/urban-mobility-lab",
    invitedBy: "Sarah Chen",
    createdDate: "2026-10-30",
    role: "memberLead" as const,
    spacesToJoin: ["Urban Mobility Lab", "Mobility Pilots"],
  },
];

/**
 * Subspace community dialog — production's
 * `@/crd/components/space/SubspaceCommunityDialog` wrapping its `SpaceMembers`.
 *
 * This is the home CRD intends for the member grid: production removed it from
 * the community *tab* (feature 008, US6 — the tab uses a contributor-collection
 * callout now) and kept it inside this dialog. That is also why `SpaceMembers`
 * owns its own search, filter pills and paging — in a dialog there is no
 * sidebar search to defer to.
 */
import { useTranslation } from 'react-i18next';
import { SubspaceCommunityDialog as CrdSubspaceCommunityDialog } from '@/crd/components/space/SubspaceCommunityDialog';
import { SpaceMembers } from '@/crd/components/space/SpaceMembers';
import { toMemberCard, toOrgCard } from '@/app/mappers/members';

interface MemberEntry {
 kind: "user";
 id: string;
 name: string;
 role: string;
 roleType: string;
 joinDate: string;
 avatar: string | null;
 initials: string;
 bio: string;
}

interface OrgEntry {
 kind: "org";
 id: string;
 name: string;
 type: string;
 description: string;
 avatar: string;
 initials: string;
 members: number;
 website: string;
}

type CommunityEntry = MemberEntry | OrgEntry;

// ── Mock Data ──
const RAW_MEMBERS: Omit<MemberEntry, "kind">[] = [
 { id: "su1", name: "Sarah Chen", role: "Lead", roleType: "moderator", joinDate: "Nov 2023", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", initials: "SC", bio: "Facilitator leading the renewable energy transition workstream." },
 { id: "su2", name: "David Kim", role: "Member", roleType: "member", joinDate: "Jan 2024", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", initials: "DK", bio: "Wind energy specialist contributing research and technical analysis." },
 { id: "su3", name: "Emily Davis", role: "Member", roleType: "member", joinDate: "Feb 2024", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", initials: "ED", bio: "Battery storage researcher focusing on grid-scale solutions." },
 { id: "su4", name: "Alex Torres", role: "Member", roleType: "member", joinDate: "Mar 2024", avatar: null, initials: "AT", bio: "Community solar advocate." },
 { id: "su5", name: "Anna Martinez", role: "Lead", roleType: "moderator", joinDate: "Dec 2023", avatar: null, initials: "AM", bio: "Policy and stakeholder engagement lead." },
 ...Array.from({ length: 11 }).map((_, i) => ({
 id: `sm${i + 6}`,
 name: ["James Wilson", "Emma Thompson", "Lucas Oliveira", "Sophia Li", "Oliver Smith", "Ava Patel", "William Chen", "Isabella Garcia", "Henry Wilson", "Mia Kim", "Alexander Wright"][i] || `Member ${i + 6}`,
 role: "Member" as const,
 roleType: "member" as const,
 joinDate: "Apr 2024",
 avatar: null as string | null,
 initials: ["JW", "ET", "LO", "SL", "OS", "AP", "WC", "IG", "HW", "MK", "AW"][i] || `M${i}`,
 bio: i % 2 === 0 ? "Contributing to the subspace community." : ""
 })),
];

const RAW_ORGS: Omit<OrgEntry, "kind">[] = [
 {
 id: "sorg1",
 name: "Green Future Labs",
 type: "Research Institute",
 description: "Leading research in renewable energy systems and sustainable urban planning.",
 avatar: "https://images.unsplash.com/photo-1769697264314-28f093151bbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256",
 initials: "GF",
 members: 4,
 website: "https://greenfuturelabs.org"
 },
 {
 id: "sorg2",
 name: "Utrecht University",
 type: "Academic",
 description: "Faculty of Geosciences contributing research on climate adaptation and energy transition.",
 avatar: "https://images.unsplash.com/photo-1631599143424-5bc234fbebf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=256",
 initials: "UU",
 members: 3,
 website: "https://uu.nl"
 },
];

const ALL_ENTRIES: CommunityEntry[] = [
 ...RAW_ORGS.map((o): OrgEntry => ({ ...o, kind: "org" })),
 ...RAW_MEMBERS.map((m): MemberEntry => ({ ...m, kind: "user" })),
];

const FILTERS = ["All", "Lead", "Member", "Organization"];

// ── Props ──
interface SubspaceCommunityDialogProps {
 open: boolean;
 onOpenChange: (open: boolean) => void;
}

export function SubspaceCommunityDialog({ open, onOpenChange }: SubspaceCommunityDialogProps) {
  const { t } = useTranslation('crd-space');

  const members = [
    ...RAW_ORGS.map(toOrgCard),
    ...RAW_MEMBERS.map(toMemberCard),
  ];

  return (
    <CrdSubspaceCommunityDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('community.title', { defaultValue: 'Community' })}
      description={t('community.description', {
        defaultValue: 'The people and organisations in this subspace.',
      })}
    >
      <SpaceMembers members={members} />
    </CrdSubspaceCommunityDialog>
  );
}

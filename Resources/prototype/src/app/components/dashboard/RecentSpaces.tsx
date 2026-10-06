/**
 * Recent Spaces — production's `@/crd/components/dashboard/RecentSpaces`.
 *
 * This file is now only the prototype's data + behaviour wiring: it holds the
 * mock spaces, maps them to CRD's exported `CompactSpaceCardData`, and keeps
 * the MyMemberships panel the prototype opens from here.
 *
 * The activity dot beside each space name: CRD renders the name itself and has
 * no slot for it (PHASE-2.md §1), so `@/ahead/ActivityDotSlots` puts it there
 * until `CompactSpaceCard` gains a name-suffix slot.
 */
import { useState } from 'react';
import { RecentSpaces as CrdRecentSpaces } from '@/crd/components/dashboard/RecentSpaces';
import type { CompactSpaceCardData } from '@/crd/components/dashboard/CompactSpaceCard';
import { MyMembershipsPanel } from '@/app/components/memberships/MyMembershipsPanel';
import { useActivityIndicators } from '@/app/contexts/ActivityIndicatorsContext';
import { spaceContainer } from '@/app/data/activity-data';
import { type ActivityDotSlot, ActivityDotSlots } from '@/ahead/ActivityDotSlots';

const RECENT_SPACES: CompactSpaceCardData[] = [
  {
    id: '1',
    name: 'Innovation Lab',
    href: '/space/innovation-lab',
    bannerUrl:
      'https://images.unsplash.com/photo-1623652554515-91c833e3080e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsYWJvcmF0aW9uJTIwdGVhbXdvcmslMjBpbm5vdmF0aW9uJTIwZGVzaWduJTIwdGhpbmtpbmclMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NjkwODc1ODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    isPrivate: true,
    isHomeSpace: false,
    initials: 'IL',
  },
  {
    id: '2',
    name: 'Design Workshop',
    href: '/space/design-workshop',
    bannerUrl:
      'https://images.unsplash.com/photo-1735639013995-086e648eaa38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFpbnN0b3JtaW5nJTIwY3JlYXRpdmUlMjB3b3Jrc2hvcCUyMHRlYW18ZW58MXx8fHwxNzY5MDg3NTg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    isPrivate: false,
    isHomeSpace: false,
    initials: 'DW',
  },
  {
    id: '3',
    name: 'Team Sync',
    href: '/space/team-sync',
    bannerUrl:
      'https://images.unsplash.com/photo-1768659347532-74d3b1efb0ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjBtZWV0aW5nJTIwY29sbGFib3JhdGlvbiUyMHRlYW18ZW58MXx8fHwxNzY5MDg3NTg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    isPrivate: true,
    isHomeSpace: false,
    initials: 'TS',
  },
  {
    id: '4',
    name: 'Future Strategy',
    href: '/space/future-strategy',
    bannerUrl:
      'https://images.unsplash.com/photo-1676276376052-dc9c9c0b6917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbm5vdmF0aW9uJTIwbGFiJTIwdGVhbXdvcmslMjBtb2Rlcm4lMjBvZmZpY2V8ZW58MXx8fHwxNzY5MDg3NTg2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    isPrivate: false,
    isHomeSpace: false,
    initials: 'FS',
  },
];

export function RecentSpaces() {
  const [membershipsOpen, setMembershipsOpen] = useState(false);
  const { hasContainerActivity } = useActivityIndicators();

  // The pulse sits right after the space name on its card. It goes in the
  // name's row rather than inside the name, which cuts long names off with
  // "…" and would cut the pulse off with them.
  const activitySlots: ActivityDotSlot[] = RECENT_SPACES.filter(space =>
    hasContainerActivity(spaceContainer(space.href.replace('/space/', '')))
  ).map(space => ({
    key: space.id,
    find: root =>
      [...root.querySelectorAll(`a[href="${space.href}"] p.text-card-title`)].flatMap(name =>
        name.parentElement ? [name.parentElement] : []
      ),
    label: `${space.name} has new activity`,
    className: '-ml-1',
  }));

  return (
    <div className="space-y-4">
      <ActivityDotSlots slots={activitySlots}>
        <CrdRecentSpaces
          spaces={RECENT_SPACES}
          hasHomeSpace={true}
          // "Explore all *your* Spaces" is the membership set, which is what the
          // panel lists. On main this panel had no trigger at all and was dead
          // code; CRD's link is the one production puts it behind.
          onExploreAllClick={() => setMembershipsOpen(true)}
        />
      </ActivityDotSlots>
      <MyMembershipsPanel open={membershipsOpen} onOpenChange={setMembershipsOpen} />
    </div>
  );
}

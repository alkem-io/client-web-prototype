/**
 * Space navigation tabs — production's `@/crd/components/space/SpaceNavigationTabs`.
 *
 * The prototype drives tabs by route; CRD drives them by index with an optional
 * `href` per tab, so this wrapper maps between the two and keeps query params
 * on navigation.
 *
 * The activity dot beside a tab label when that tab has unseen content: CRD's
 * `TabItem` is `{ label, index, href }` with nowhere to hang one (PHASE-2.md
 * §1), so `@/ahead/ActivityDotSlots` puts it after the label instead.
 */
import { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { SpaceNavigationTabs as CrdSpaceNavigationTabs } from '@/crd/components/space/SpaceNavigationTabs';
import { useActivityIndicators } from '@/app/contexts/ActivityIndicatorsContext';
import { tabContainer } from '@/app/data/activity-data';
import { type ActivityDotSlot, ActivityDotSlots } from '@/ahead/ActivityDotSlots';

interface SpaceNavigationTabsProps {
  spaceSlug: string;
  actionButton?: React.ReactNode;
  onActiveTabChange?: (description: string) => void;
}

export const SPACE_TABS = [
  { 
    label: "Home", 
    href: "/home",
    description: "Activity and updates from members of this space."
  },
  { 
    label: "Community", 
    href: "/community",
    description: "Members and contributors in this space."
  },
  { 
    label: "Subspaces", 
    href: "/subspaces",
    description: "Focused collaboration areas within this space."
  },
  { 
    label: "Knowledge Base", 
    href: "/knowledge-base",
    description: "Curated resources, documents, and knowledge."
  },
];

export function SpaceNavigationTabs({
  spaceSlug,
  actionButton,
  onActiveTabChange,
}: SpaceNavigationTabsProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { hasContainerActivity } = useActivityIndicators();
  const queryString = searchParams.toString();
  const suffix = queryString ? `?${queryString}` : '';

  const hrefFor = (tabHref: string) =>
    `/space/${spaceSlug}${tabHref === '/home' ? '' : tabHref}${suffix}`;

  // The Home tab's path is the bare space URL, so it only matches exactly —
  // otherwise every child route would light it up as well.
  const activeIndex = Math.max(
    0,
    SPACE_TABS.findIndex(tab => {
      const path = hrefFor(tab.href).split('?')[0];
      return path.endsWith(`/${spaceSlug}`)
        ? location.pathname === path
        : location.pathname.startsWith(path);
    })
  );

  useEffect(() => {
    onActiveTabChange?.(SPACE_TABS[activeIndex]?.description ?? '');
  }, [activeIndex, onActiveTabChange]);

  // Desktop tabs and the mobile tab bar both carry role="tab"; match on the
  // label text so the pulse lands in both.
  const activitySlots: ActivityDotSlot[] = SPACE_TABS.filter(tab =>
    hasContainerActivity(tabContainer(spaceSlug, tab.href.slice(1)))
  ).map(tab => ({
    key: tab.href,
    find: root =>
      [...root.querySelectorAll('[role="tab"]')].filter(el => el.firstChild?.textContent === tab.label),
    label: `${tab.label} has new activity`,
    className: 'ml-2 align-middle',
  }));

  return (
    <ActivityDotSlots slots={activitySlots}>
      <CrdSpaceNavigationTabs
        tabs={SPACE_TABS.map((tab, index) => ({
          label: tab.label,
          index,
          href: hrefFor(tab.href),
        }))}
        activeIndex={activeIndex}
        onTabChange={index => navigate(hrefFor(SPACE_TABS[index].href))}
        action={actionButton}
      />
    </ActivityDotSlots>
  );
}

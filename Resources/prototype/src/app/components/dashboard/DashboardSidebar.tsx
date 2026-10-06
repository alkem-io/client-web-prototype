/**
 * Dashboard sidebar — production's `@/crd/components/dashboard/DashboardSidebar`.
 *
 * This file is now only data + behaviour wiring: it holds the prototype's mock
 * menu, spaces and virtual contributors, maps them to CRD's exported
 * `SidebarMenuItemData` / `SidebarResourceSection`, and owns the two dialogs
 * the menu opens.
 *
 * Two things deliberately live *outside* CRD's component:
 *
 * - The New User View / Has Pending switches are prototype demo controls, not
 *   design. They drive which dashboard variant is on screen so the empty and
 *   pending states can be shown without a backend. They render in their own
 *   labelled block below the sidebar rather than being smuggled into CRD's.
 * - `sticky top-20` is gone. Production's `DashboardLayout` renders the sidebar
 *   in a plain `<nav className="hidden md:block">` that scrolls with the page,
 *   and it also supplies the `<nav>` element — so this component returns a
 *   fragment, not a nav.
 *
 * PHASE 1 REMOVALS — recorded in PHASE-2.md §1:
 *   · the activity dot beside each space name (CRD renders the name; no slot)
 *     — back since 2026-10-06 through `@/ahead/ActivityDotSlots`
 *   · the Bot glyph on virtual contributors (`SidebarResourceItem` takes
 *     `initials` or an image, not an icon)
 *   · the active-route highlight on menu rows (CRD's rows have no active state)
 */
import { useState } from 'react';
import { DashboardSidebar as CrdDashboardSidebar } from '@/crd/components/dashboard/DashboardSidebar';
import type {
  SidebarMenuItemData,
  SidebarResourceSection,
} from '@/crd/components/dashboard/DashboardSidebar';
import { Switch } from '@/crd/primitives/switch';
import { InvitationsDialog } from '@/app/components/dialogs/InvitationsDialog';
import { CreateSpaceDialogV3 } from '@/app/components/dialogs/CreateSpaceDialogV3';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { useActivityIndicators } from '@/app/contexts/ActivityIndicatorsContext';
import { spaceContainer } from '@/app/data/activity-data';
import { type ActivityDotSlot, ActivityDotSlots } from '@/ahead/ActivityDotSlots';

interface DashboardSidebarProps {
  activityView: boolean;
  onToggleView: (value: boolean) => void;
  newUserView: boolean;
  onToggleNewUserView: (value: boolean) => void;
  hasPending: boolean;
  onToggleHasPending: (value: boolean) => void;
}

const MY_SPACES: SidebarResourceSection = {
  title: 'My Spaces',
  // Space avatars are rounded squares everywhere in production — the circle is
  // reserved for people. CRD exposes that as `square`.
  square: true,
  items: [
    {
      id: 'green-energy',
      name: 'Green Energy Space',
      href: '/space/green-energy',
      initials: 'GE',
      avatarUrl:
        'https://images.unsplash.com/photo-1690191863988-f685cddde463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    },
    {
      id: 'community-garden',
      name: 'Community Garden',
      href: '/space/community-garden',
      initials: 'CG',
      avatarUrl:
        'https://images.unsplash.com/photo-1768659347532-74d3b1efb0ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    },
    {
      id: 'digital-trans',
      name: 'Digital Transformation',
      href: '/space/digital-trans',
      initials: 'DT',
      avatarUrl:
        'https://images.unsplash.com/photo-1676276376052-dc9c9c0b6917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    },
  ],
};

const VIRTUAL_CONTRIBUTORS: SidebarResourceSection = {
  title: 'Virtual Contributors',
  items: [
    { id: 'softmann', name: 'Softmann', href: '/vc/softmann', initials: 'SM' },
    {
      id: 'collaboration-methodologist',
      name: 'The Collaboration Methodologist',
      href: '/vc/collaboration-methodologist',
      initials: 'CM',
    },
  ],
};

export function DashboardSidebar({
  activityView,
  onToggleView,
  newUserView,
  onToggleNewUserView,
  hasPending,
  onToggleHasPending,
}: DashboardSidebarProps) {
  const [showInvitations, setShowInvitations] = useState(false);
  const [showCreateSpace, setShowCreateSpace] = useState(false);
  const { t } = useLanguage();
  const { hasContainerActivity } = useActivityIndicators();

  // The pulse goes at the end of a My Spaces row, as it did before the switch.
  const activitySlots: ActivityDotSlot[] = MY_SPACES.items
    .filter(item => item.href && hasContainerActivity(spaceContainer(item.id)))
    .map(item => ({
      key: item.id,
      find: root => [...root.querySelectorAll(`a[href="${item.href}"]`)],
      label: `${item.name} has new activity`,
      className: 'ml-auto mr-1',
    }));

  // `iconName` is a key into CRD's own icon map — the design system decides
  // which glyph each row gets, so the prototype cannot pass an arbitrary icon.
  const menuItems: SidebarMenuItemData[] = [
    {
      id: 'invitations',
      label: t('nav.invitations'),
      iconName: 'Mail',
      onClick: () => setShowInvitations(true),
      badgeCount: 2,
    },
    {
      id: 'create-space',
      label: 'Create my own Space',
      iconName: 'Rocket',
      onClick: () => setShowCreateSpace(true),
    },
    { id: 'tips', label: 'Tips & Tricks', iconName: 'Lightbulb', href: '#' },
    { id: 'templates', label: 'Template Library', iconName: 'Lightbulb', href: '/templates' },
    { id: 'account', label: 'My Account', iconName: 'Tag', href: '/user/alex-rivera/settings/account' },
  ];

  return (
    <>
      <ActivityDotSlots slots={activitySlots}>
        <CrdDashboardSidebar
          menuItems={menuItems}
          resourceSections={[MY_SPACES, VIRTUAL_CONTRIBUTORS]}
          activityEnabled={activityView}
          onActivityToggle={onToggleView}
        />
      </ActivityDotSlots>

      {/* Prototype demo controls — no production equivalent. */}
      <div className="mt-6 space-y-3 border-t border-border pt-4">
        <div className="flex items-center gap-2 px-2">
          <Switch id="new-user-view" checked={newUserView} onCheckedChange={onToggleNewUserView} />
          <label htmlFor="new-user-view" className="text-caption cursor-pointer text-muted-foreground">
            New User View
          </label>
        </div>
        {newUserView && (
          <div className="flex items-center gap-2 px-2">
            <Switch id="has-pending" checked={hasPending} onCheckedChange={onToggleHasPending} />
            <label htmlFor="has-pending" className="text-caption cursor-pointer text-muted-foreground">
              Has Pending
            </label>
          </div>
        )}
      </div>

      <InvitationsDialog open={showInvitations} onOpenChange={setShowInvitations} />
      <CreateSpaceDialogV3 open={showCreateSpace} onOpenChange={setShowCreateSpace} />
    </>
  );
}

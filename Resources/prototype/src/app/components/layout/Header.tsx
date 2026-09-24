/**
 * Platform header — production's `@/crd/layouts/Header`.
 *
 * This file is now the prototype's wiring only: it connects the search, grid,
 * notifications, messages and language contexts to the props CRD exports, and
 * passes the prototype's breadcrumb trail into CRD's `breadcrumbs` slot.
 *
 * PHASE 1 REMOVALS (see PHASE-2.md §7):
 *  - the **dark / light mode toggle** in the user menu. CRD's `UserMenu` has no
 *    such entry; theme switching is not a production feature.
 *  - **activity dots** on the messages icon.
 *
 * Kept, because CRD supports them directly: the grid overlay toggle
 * (`showGridToggle`), the breadcrumb trail (`breadcrumbs` slot), the Beta badge
 * (via `user.role`), and banner-overlay transparency (`overlayBanner`).
 */
import { BookOpen, Compass, Lightbulb, MessageCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Header as CrdHeader } from '@/crd/layouts/Header';
import type { CrdNavigationHrefs, CrdPlatformNavigationItem, CrdUserInfo } from '@/crd/layouts/types';
import { AppBreadcrumb } from '@/app/components/layout/AppBreadcrumb';
import { LANGUAGES, useLanguage, type Language } from '@/app/contexts/LanguageContext';
import { useMessages } from '@/app/contexts/MessagesContext';
import { useNotifications } from '@/app/contexts/NotificationsContext';
import { useSearch } from '@/app/contexts/SearchContext';

const USER: CrdUserInfo = {
  name: 'Jeroen Nijkamp',
  initials: 'JN',
  avatarUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=64&h=64',
  role: 'Beta',
};

const NAVIGATION_HREFS: CrdNavigationHrefs = {
  home: '/',
  spaces: '/spaces',
  messages: '/messages',
  notifications: '/notifications',
  profile: '/user/me',
  account: '/user/me/settings/account',
  admin: '/admin',
  login: '/auth',
};

const PLATFORM_NAV: CrdPlatformNavigationItem[] = [
  { icon: <Lightbulb className="h-4 w-4" />, label: 'Template Library', href: '/templates' },
  { icon: <MessageCircle className="h-4 w-4" />, label: 'Forum', href: '/forum' },
  { icon: <Compass className="h-4 w-4" />, label: 'Explore Spaces', href: '/spaces' },
  { icon: <BookOpen className="h-4 w-4" />, label: 'Documentation', href: '/docs' },
];

export function Header({ className }: { className?: string; onMenuClick?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { openSearch } = useSearch();
  const { openNotifications } = useNotifications();
  const { openMessages } = useMessages();
  const { language, setLanguage } = useLanguage();

  /*
   * Pages with a banner let the header sit transparently over it until the
   * banner scrolls away. CRD owns the fade itself (120px threshold); this only
   * decides *where* it applies, using the original prototype's route test.
   * Pair with `overlayHeader` on SpaceHeader / SubspaceHeader, which slides the
   * banner up under the sticky header so there is something to see through to.
   */
  const hasBanner =
    location.pathname.startsWith('/space') || location.pathname.startsWith('/innovation-hub');

  // Cmd+K / Ctrl+K opens search — CRD's Header has no keyboard shortcut.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [openSearch]);

  return (
    <CrdHeader
      className={className}
      user={USER}
      authenticated={true}
      isAdmin={true}
      navigationHrefs={NAVIGATION_HREFS}
      platformNavigationItems={PLATFORM_NAV}
      currentPath={location.pathname}
      pendingInvitationsCount={2}
      unreadNotificationsCount={5}
      unreadMessagesCount={3}
      languages={LANGUAGES.map(l => ({ code: l.code, label: l.label }))}
      currentLanguage={language}
      onLanguageChange={code => setLanguage(code as Language)}
      breadcrumbs={<AppBreadcrumb />}
      onSearchClick={() => openSearch()}
      onNotificationsClick={() => openNotifications()}
      onMessagesClick={() => openMessages()}
      onLogout={() => navigate('/auth')}
      showGridToggle={true}
      overlayBanner={hasBanner}
    />
  );
}

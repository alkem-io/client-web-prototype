import { createBrowserRouter } from "react-router";
import { RootWrapper } from "./layouts/RootWrapper";
import { MainLayout } from "./layouts/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { SpaceHome } from "./pages/SpaceHome";
import { SpaceCommunity } from "./pages/SpaceCommunity";
import { SpaceSubspaces } from "./pages/SpaceSubspaces";
import { SpaceKnowledgeBase } from "./pages/SpaceKnowledgeBase";
import { SpaceChatPage } from "./pages/SpaceChatPage";
import { SpaceSettingsPage } from "./pages/SpaceSettingsPage";
import SubspacePage from "./pages/SubspacePage";
import SubspaceSettingsPage from "./pages/SubspaceSettingsPage";
import UserProfilePage from "./pages/UserProfilePage";
import UserAccountPage from "./pages/UserAccountPage";
import UserProfileSettingsPage from "./pages/UserProfileSettingsPage";
import UserMembershipPage from "./pages/UserMembershipPage";
import UserOrganizationsPage from "./pages/UserOrganizationsPage";
import UserNotificationsPage from "./pages/UserNotificationsPage";
import UserGenericSettingsPage from "./pages/UserGenericSettingsPage";
import TemplateLibraryPage from "./pages/TemplateLibraryPage";
import TemplatePackDetailPage from "./pages/TemplatePackDetailPage";
import TemplateDetailPage from "./pages/TemplateDetailPage";
import DesignSystemPage from "./pages/DesignSystemPage";
import CreateSpaceSelectionPage from "./pages/CreateSpaceSelectionPage";
import CreateSpaceChatPage from "./pages/CreateSpaceChatPage";
import EcosystemAnalyticsPage from "./pages/analytics/EcosystemAnalyticsPage";
import BrowseSpacesPage from "./pages/BrowseSpacesPage";
import NotFoundPage from "./pages/NotFoundPage";
import NotificationsPage from "./pages/NotificationsPage";
import MessagesPage from "./pages/MessagesPage";
import AdminPage from "./pages/AdminPage";
import OnboardingPage from "./pages/OnboardingPage";

export const router = createBrowserRouter([
  {
    /* RootWrapper provides router-dependent overlays (SearchOverlay) */
    Component: RootWrapper,
    children: [
      /* ─── Standalone pages (no MainLayout) ─── */
      {
        path: "/design-system",
        Component: DesignSystemPage,
      },
      {
        path: "/create-space/chat",
        Component: CreateSpaceChatPage,
      },
      {
        path: "/analytics",
        Component: EcosystemAnalyticsPage,
      },
      {
        path: "/onboarding",
        Component: OnboardingPage,
      },

      /* ─── Main application routes (with MainLayout) ─── */
      {
        path: "/",
        Component: MainLayout,
        children: [
          /* Dashboard */
          { index: true, Component: Dashboard },

          /* Browse & Create Spaces */
          { path: "spaces", Component: BrowseSpacesPage },
          { path: "create-space", Component: CreateSpaceSelectionPage },

          /* Template Library */
          { path: "templates", Component: TemplateLibraryPage },
          { path: "templates/:templateId", Component: TemplateDetailPage },
          { path: "templates/packs/:packSlug", Component: TemplatePackDetailPage },
          { path: "templates/packs/:packSlug/:templateId", Component: TemplateDetailPage },

          /* Notifications (full page) */
          { path: "notifications", Component: NotificationsPage },

          /* Messages (full-page inbox) */
          { path: "messages", Component: MessagesPage },

          /* Platform Admin */
          { path: "admin", Component: AdminPage },
          { path: "admin/:section", Component: AdminPage },

          /* ─── Space Routes ─── */
          { path: "space/:spaceSlug", Component: SpaceHome },
          { path: "space/:spaceSlug/community", Component: SpaceCommunity },
          { path: "space/:spaceSlug/subspaces", Component: SpaceSubspaces },
          { path: "space/:spaceSlug/knowledge-base", Component: SpaceKnowledgeBase },
          { path: "space/:spaceSlug/chat", Component: SpaceChatPage },

          /* Space Settings */
          { path: "space/:spaceSlug/settings", Component: SpaceSettingsPage },
          { path: "space/:spaceSlug/settings/:tab", Component: SpaceSettingsPage },

          /* Subspace/Challenge */
          { path: ":spaceSlug/challenges/:subspaceSlug", Component: SubspacePage },

          /* Subspace Settings */
          { path: "space/:spaceSlug/subspaces/:subspaceSlug/settings", Component: SubspaceSettingsPage },
          { path: "space/:spaceSlug/subspaces/:subspaceSlug/settings/:tab", Component: SubspaceSettingsPage },

          /* ─── User Routes ─── */
          { path: "user/:userSlug", Component: UserProfilePage },
          { path: "user/:userSlug/settings/profile", Component: UserProfileSettingsPage },
          { path: "user/:userSlug/settings/account", Component: UserAccountPage },
          { path: "user/:userSlug/settings/membership", Component: UserMembershipPage },
          { path: "user/:userSlug/settings/organizations", Component: UserOrganizationsPage },
          { path: "user/:userSlug/settings/notifications", Component: UserNotificationsPage },
          {
            path: "user/:userSlug/settings/general",
            element: <UserGenericSettingsPage title="General Settings" />,
          },
          {
            path: "user/:userSlug/settings/*",
            element: <UserGenericSettingsPage title="Account Settings" />,
          },

          /* 404 catch-all */
          { path: "*", Component: NotFoundPage },
        ],
      },
    ],
  },
]);

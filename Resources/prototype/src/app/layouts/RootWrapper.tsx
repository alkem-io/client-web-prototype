import { Outlet } from "react-router";
import { SearchOverlay } from "@/app/components/search/SearchOverlay";
import { GridOverlayProvider } from "@/app/contexts/GridOverlayContext";
import { GridOverlay } from "@/app/components/layout/GridOverlay";
import { NotificationsProvider } from "@/app/contexts/NotificationsContext";
import { NotificationsOverlay } from "@/app/components/layout/NotificationsOverlay";
import { MessagesProvider } from "@/app/contexts/MessagesContext";
import { MessagesOverlay } from "@/app/components/layout/MessagesOverlay";
import { ActivityIndicatorsProvider } from "@/app/contexts/ActivityIndicatorsContext";
import { ActivityVisitTracker } from "@/app/components/shared/ActivityVisitTracker";

/**
 * Root wrapper rendered inside RouterProvider.
 * Provides router-dependent overlays (SearchOverlay needs useLocation/useNavigate).
 */
export function RootWrapper() {
  return (
    <GridOverlayProvider>
      <NotificationsProvider>
        <MessagesProvider>
          <ActivityIndicatorsProvider>
            <ActivityVisitTracker />
            <SearchOverlay />
            <NotificationsOverlay />
            <MessagesOverlay />
            <GridOverlay />
            <Outlet />
          </ActivityIndicatorsProvider>
        </MessagesProvider>
      </NotificationsProvider>
    </GridOverlayProvider>
  );
}

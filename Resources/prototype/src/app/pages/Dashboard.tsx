import { useState, useEffect } from "react";
import { RecentSpaces } from "@/app/components/dashboard/RecentSpaces";
import { ActivityFeed } from "@/app/components/dashboard/ActivityFeed";
import { DashboardSidebar } from "@/app/components/dashboard/DashboardSidebar";
import { DashboardLayout } from "@/crd/components/dashboard/DashboardLayout";
import { UpdateBanner } from "@/app/components/dashboard/UpdateBanner";
import { EnhancedSpacesGallery } from "@/app/components/dashboard/EnhancedSpacesGallery";

const STORAGE_KEY = "alkemio-activity-view";
const NEW_USER_VIEW_KEY = "alkemio-new-user-view";
const HAS_PENDING_KEY = "alkemio-has-pending";

export function Dashboard() {
  const [activityView, setActivityView] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === "true";
  });

  const [newUserView, setNewUserView] = useState(() => {
    const stored = localStorage.getItem(NEW_USER_VIEW_KEY);
    return stored === "true";
  });

  const [hasPending, setHasPending] = useState(() => {
    const stored = localStorage.getItem(HAS_PENDING_KEY);
    return stored === null ? true : stored === "true";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(activityView));
  }, [activityView]);

  useEffect(() => {
    localStorage.setItem(NEW_USER_VIEW_KEY, String(newUserView));
  }, [newUserView]);

  useEffect(() => {
    localStorage.setItem(HAS_PENDING_KEY, String(hasPending));
  }, [hasPending]);

  return (
    /*
     * Production's DashboardLayout owns the page margins: the px-6/md:px-8
     * gutter, the 12-col grid, the inset content band, the fixed 240px sidebar
     * and the mobile drawer. The prototype previously hand-rolled this with the
     * sidebar at `col-span-2` starting in the gutter column, which put every
     * dashboard surface ~117px left of where production draws it.
     */
    <DashboardLayout
      sidebar={
        <DashboardSidebar
          activityView={activityView}
          onToggleView={setActivityView}
          newUserView={newUserView}
          onToggleNewUserView={setNewUserView}
          hasPending={hasPending}
          onToggleHasPending={setHasPending}
        />
      }
    >
      {/*
       * No wrapper grid, matching production's `DashboardWithMemberships`:
       * `DashboardLayout` already renders its children into a
       * `space-y-6` column, so each section is a direct child.
       *
       * The prototype previously nested everything in `grid grid-cols-9` and
       * split the two activity feeds 5/4 — that asymmetry is why the columns
       * did not match client-web.
       */}
      {activityView ? (
        <>
          <RecentSpaces />
          <UpdateBanner />
          {/* Production's exact markup for the activity pair: two equal
              columns, stacked below `lg`. */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityFeed title="Latest Activity in my Spaces" type="spaces" />
            <ActivityFeed title="My Latest Activity" type="personal" />
          </div>
        </>
      ) : (
        <EnhancedSpacesGallery newUserView={newUserView} hasPending={hasPending} />
      )}
    </DashboardLayout>
  );
}

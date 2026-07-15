import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { RecentSpaces } from "@/app/components/dashboard/RecentSpaces";
import { ActivityFeed } from "@/app/components/dashboard/ActivityFeed";
import { DashboardSidebar } from "@/app/components/dashboard/DashboardSidebar";
import { UpdateBanner } from "@/app/components/dashboard/UpdateBanner";
import { EnhancedSpacesGallery } from "@/app/components/dashboard/EnhancedSpacesGallery";

const STORAGE_KEY = "alkemio-activity-view";
const NEW_USER_VIEW_KEY = "alkemio-new-user-view";
const HAS_PENDING_KEY = "alkemio-has-pending";

export function Dashboard() {
  const navigate = useNavigate();
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
    <div className="px-6 md:px-8 py-8 w-full">
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar — occupies the 1-col margin area + 1 more col */}
        <div className="hidden md:block col-span-2">
          <DashboardSidebar
            activityView={activityView}
            onToggleView={setActivityView}
            newUserView={newUserView}
            onToggleNewUserView={setNewUserView}
            hasPending={hasPending}
            onToggleHasPending={setHasPending}
          />
        </div>
        {/* Main content — 9 columns, leaving 1-col margin on right */}
        <div className="col-span-12 md:col-span-9 grid grid-cols-9 gap-6">
          {/* Explore all Spaces — consistent position across all views (hidden for new user view) */}
          {!(newUserView && !activityView) && (
          <div className="col-span-9 flex justify-end">
            <button
              onClick={() => navigate("/spaces")}
              className="flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none text-control"
              style={{ color: "var(--primary)" }}
              type="button"
            >
              Explore all Spaces <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          )}
          {activityView ? (
            <>
              <div className="col-span-9">
                <RecentSpaces />
              </div>
              <div className="col-span-9">
                <UpdateBanner />
              </div>
              <div className="col-span-9 lg:col-span-5">
                <ActivityFeed title="Latest Activity in my Spaces" type="spaces" />
              </div>
              <div className="col-span-9 lg:col-span-4">
                <ActivityFeed title="My Latest Activity" type="personal" />
              </div>
            </>
          ) : (
            <div className="col-span-9">
              <EnhancedSpacesGallery newUserView={newUserView} hasPending={hasPending} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

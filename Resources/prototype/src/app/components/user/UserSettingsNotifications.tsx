import { useState } from "react";
import { Mail, Megaphone, Users, Shield, Circle } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/app/components/ui/switch";
import { Button } from "@/app/components/ui/button";
import { SettingsSection } from "@/app/components/shared/SettingsSection";
import { SaveBar } from "@/app/components/shared/SaveBar";
import { UnsavedChangesGuard } from "@/app/components/shared/UnsavedChangesGuard";
import { useActivityIndicators } from "@/app/contexts/ActivityIndicatorsContext";

const INITIAL_PREFS = {
  emailNotifications: true,
  inAppNotifications: true,
  spaceUpdates: true,
  communityUpdates: true,
  forumReplies: true,
  memberRequests: false,
  applicationStatus: true,
  roleChanges: true,
  platformAnnouncements: true,
};

export function UserSettingsNotifications() {
  const [prefs, setPrefs] = useState(INITIAL_PREFS);
  const [savedPrefs, setSavedPrefs] = useState(INITIAL_PREFS);
  const [isSaving, setIsSaving] = useState(false);
  const activity = useActivityIndicators();

  const isDirty = JSON.stringify(prefs) !== JSON.stringify(savedPrefs);

  const handleMarkAllRead = () => {
    const { cleared, undo } = activity.markAllRead();
    if (cleared === 0) {
      toast("Nothing new to clear");
      return;
    }
    toast(`${cleared} item${cleared === 1 ? "" : "s"} marked as read`, {
      duration: 6000,
      action: { label: "Undo", onClick: undo },
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setSavedPrefs({ ...prefs });
      setIsSaving(false);
    }, 800);
  };

  const handleDiscard = () => {
    setPrefs({ ...savedPrefs });
  };

  const toggle = (key: keyof typeof prefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <UnsavedChangesGuard isDirty={isDirty} />
      <div className="space-y-6">
        {/* New activity indicators — applied immediately, so deliberately outside
            the SaveBar's dirty tracking. */}
        <SettingsSection title="New activity" icon={<Circle className="w-4 h-4" />} iconColor="blue">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-body">Show new activity indicators</div>
                <p className="text-caption text-muted-foreground mt-0.5">
                  Display a small dot on spaces, tabs, cards and posts that have changed since you
                  last looked.
                </p>
              </div>
              <Switch checked={activity.enabled} onCheckedChange={activity.setEnabled} />
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-body">Mark everything as read</div>
                <p className="text-caption text-muted-foreground mt-0.5">
                  Clears every indicator across all your spaces.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
                Mark all as read
              </Button>
            </div>
            <div className="flex items-start justify-between gap-4 pt-2 border-t border-border">
              <div>
                <div className="text-body text-muted-foreground">Restore demo indicators</div>
                <p className="text-caption text-muted-foreground mt-0.5">
                  Prototype only — brings every dot back so the feature can be demonstrated again.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  activity.resetAll();
                  toast("Activity indicators restored");
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </SettingsSection>

        {/* Communication */}
        <SettingsSection title="Communication" icon={<Mail className="w-4 h-4" />} iconColor="blue">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-body">Email notifications</span>
              <Switch checked={prefs.emailNotifications} onCheckedChange={() => toggle("emailNotifications")} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-body">In-app notifications</span>
              <Switch checked={prefs.inAppNotifications} onCheckedChange={() => toggle("inAppNotifications")} />
            </div>
          </div>
        </SettingsSection>

        {/* Updates */}
        <SettingsSection title="Updates" icon={<Megaphone className="w-4 h-4" />} iconColor="green" defaultOpen={false}>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-body">Space updates</span>
              <Switch checked={prefs.spaceUpdates} onCheckedChange={() => toggle("spaceUpdates")} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-body">Community updates</span>
              <Switch checked={prefs.communityUpdates} onCheckedChange={() => toggle("communityUpdates")} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-body">Forum replies</span>
              <Switch checked={prefs.forumReplies} onCheckedChange={() => toggle("forumReplies")} />
            </div>
          </div>
        </SettingsSection>

        {/* Membership */}
        <SettingsSection title="Membership" icon={<Users className="w-4 h-4" />} iconColor="amber" defaultOpen={false}>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-body">New member requests</span>
              <Switch checked={prefs.memberRequests} onCheckedChange={() => toggle("memberRequests")} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-body">Application status changes</span>
              <Switch checked={prefs.applicationStatus} onCheckedChange={() => toggle("applicationStatus")} />
            </div>
          </div>
        </SettingsSection>

        {/* Admin */}
        <SettingsSection title="Admin" icon={<Shield className="w-4 h-4" />} iconColor="purple" defaultOpen={false}>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-body">Role changes</span>
              <Switch checked={prefs.roleChanges} onCheckedChange={() => toggle("roleChanges")} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-body">Platform announcements</span>
              <Switch checked={prefs.platformAnnouncements} onCheckedChange={() => toggle("platformAnnouncements")} />
            </div>
          </div>
        </SettingsSection>
      </div>

      <SaveBar isDirty={isDirty} isSaving={isSaving} onSave={handleSave} onDiscard={handleDiscard} />
    </>
  );
}

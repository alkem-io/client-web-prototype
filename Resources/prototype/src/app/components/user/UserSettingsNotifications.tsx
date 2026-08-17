import { useState } from "react";
import { Mail, Megaphone, Users, Shield } from "lucide-react";
import { Switch } from "@/app/components/ui/switch";
import { SettingsSection } from "@/app/components/shared/SettingsSection";
import { SaveBar } from "@/app/components/shared/SaveBar";
import { UnsavedChangesGuard } from "@/app/components/shared/UnsavedChangesGuard";

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

  const isDirty = JSON.stringify(prefs) !== JSON.stringify(savedPrefs);

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

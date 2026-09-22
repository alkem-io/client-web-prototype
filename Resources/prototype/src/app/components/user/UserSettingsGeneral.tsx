import { useState } from "react";
import { Eye, Globe } from "lucide-react";
import { Switch } from "@/crd/primitives/switch";
import { SettingsSection } from "@/app/components/shared/SettingsSection";
import { SaveBar } from "@/app/components/shared/SaveBar";
import { UnsavedChangesGuard } from "@/app/components/shared/UnsavedChangesGuard";

const INITIAL_SETTINGS = {
  profilePublic: true,
  showActivity: true,
  language: "English"
};

export function UserSettingsGeneral() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [savedSettings, setSavedSettings] = useState(INITIAL_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setSavedSettings({ ...settings });
      setIsSaving(false);
    }, 800);
  };

  const handleDiscard = () => {
    setSettings({ ...savedSettings });
  };

  return (
    <>
      <UnsavedChangesGuard isDirty={isDirty} />
      <div className="space-y-6">
        {/* Privacy */}
        <SettingsSection title="Privacy" icon={<Eye className="w-4 h-4" />} iconColor="blue">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-body">Profile visible to everyone</span>
              <Switch
                checked={settings.profilePublic}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, profilePublic: checked }))}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-body">Show activity publicly</span>
              <Switch
                checked={settings.showActivity}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showActivity: checked }))}
              />
            </div>
          </div>
        </SettingsSection>

        {/* Language */}
        <SettingsSection title="Language & Locale" icon={<Globe className="w-4 h-4" />} iconColor="green" defaultOpen={false}>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-body">Preferred language</span>
              <select
                value={settings.language}
                onChange={(e) => setSettings((prev) => ({ ...prev, language: e.target.value }))}
                className="rounded-md border border-border bg-background px-3 py-1.5 text-body"
              >
                <option>English</option>
                <option>Nederlands</option>
                <option>Deutsch</option>
                <option>Français</option>
              </select>
            </div>
          </div>
        </SettingsSection>
      </div>

      <SaveBar isDirty={isDirty} isSaving={isSaving} onSave={handleSave} onDiscard={handleDiscard} />
    </>
  );
}

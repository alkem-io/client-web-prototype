import { useState } from "react";
import { Users, Eye } from "lucide-react";
import { Switch } from "@/crd/primitives/switch";
import { SettingsSection } from "@/app/components/shared/SettingsSection";

export function OrgSettingsSettings() {
  const [domainJoin, setDomainJoin] = useState(true);
  const [showRoles, setShowRoles] = useState(true);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Membership */}
      <SettingsSection title="Membership" icon={<Users className="w-4 h-4" />} iconColor="blue">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-body-emphasis">Allow users matching the organisation's domain to join</p>
            <p className="text-caption text-muted-foreground">When enabled, users whose email domain matches this organisation can self-join without an invitation.</p>
          </div>
          <Switch checked={domainJoin} onCheckedChange={setDomainJoin} />
        </div>
      </SettingsSection>

      {/* Privacy */}
      <SettingsSection title="Privacy" icon={<Eye className="w-4 h-4" />} iconColor="purple">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-body-emphasis">Show contribution roles publicly</p>
            <p className="text-caption text-muted-foreground">When enabled, the organisation's role assignments (Admin, Owner, Associate) are visible on its public profile.</p>
          </div>
          <Switch checked={showRoles} onCheckedChange={setShowRoles} />
        </div>
      </SettingsSection>
    </div>
  );
}

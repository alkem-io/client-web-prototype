import { Building2, Plus } from "lucide-react";
import { Badge } from "@/crd/primitives/badge";
import { Button } from "@/crd/primitives/button";
import { SettingsSection } from "@/app/components/shared/SettingsSection";

export function UserSettingsOrganizations() {
  const orgs = [
    { name: "Alkemio Foundation", role: "Owner", members: 8, initials: "AF", color: "#2563eb" },
    { name: "VNG Innovation", role: "Associate", members: 42, initials: "VN", color: "#16a34a" },
    { name: "Digital Society School", role: "Associate", members: 15, initials: "DS", color: "#7c3aed" },
  ];

  return (
    <div className="space-y-6">
      {/* My Organizations */}
      <SettingsSection title="My Organizations" icon={<Building2 className="w-4 h-4" />} iconColor="purple">
        <div className="space-y-2">
          {orgs.map((org) => (
            <div key={org.name} className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-muted/10">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-caption"
                  style={{ backgroundColor: org.color }}
                >
                  {org.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-body-emphasis truncate">{org.name}</p>
                  <p className="text-caption text-muted-foreground">{org.members} members</p>
                </div>
              </div>
              <Badge variant="secondary">{org.role}</Badge>
            </div>
          ))}
        </div>
      </SettingsSection>

      {/* Create Organization */}
      <SettingsSection title="Create Organization" icon={<Plus className="w-4 h-4" />} iconColor="green" defaultOpen={false}>
        <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-border rounded-xl bg-muted/10">
          <Building2 className="w-8 h-8 text-muted-foreground mb-3" />
          <p className="text-body text-muted-foreground mb-4">Create a new organization to collaborate with your team</p>
          <Button>
            <Plus className="w-4 h-4 mr-1.5" />
            New Organization
          </Button>
        </div>
      </SettingsSection>
    </div>
  );
}

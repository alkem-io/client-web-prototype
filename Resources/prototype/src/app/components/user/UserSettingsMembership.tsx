import { Users, Clock } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { SettingsSection } from "@/app/components/shared/SettingsSection";

export function UserSettingsMembership() {
  const spaces = [
    { name: "Innovation Lab", role: "Lead", members: 24 },
    { name: "Design Workshop", role: "Member", members: 12 },
    { name: "Sustainability Hub", role: "Admin", members: 56 },
    { name: "Open Education", role: "Member", members: 89 },
  ];

  const pending = [
    { name: "AI Research Collective", date: "2025-07-20", status: "Pending" },
  ];

  return (
    <div className="space-y-6">
      {/* My Spaces */}
      <SettingsSection title="My Spaces" icon={<Users className="w-4 h-4" />} iconColor="blue">
        <div className="space-y-2">
          {spaces.map((space) => (
            <div key={space.name} className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-muted/10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-caption">
                  {space.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-body-emphasis truncate">{space.name}</p>
                  <p className="text-caption text-muted-foreground">{space.members} members</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="secondary">{space.role}</Badge>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                  Leave
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SettingsSection>

      {/* Pending Applications */}
      <SettingsSection title="Pending Applications" icon={<Clock className="w-4 h-4" />} iconColor="amber" defaultOpen={false}>
        {pending.length > 0 ? (
          <div className="space-y-2">
            {pending.map((app) => (
              <div key={app.name} className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-muted/10">
                <div className="min-w-0">
                  <p className="text-body-emphasis truncate">{app.name}</p>
                  <p className="text-caption text-muted-foreground">Applied {app.date}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline">{app.status}</Badge>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-border rounded-xl bg-muted/10">
            <p className="text-body text-muted-foreground">No pending applications</p>
          </div>
        )}
      </SettingsSection>
    </div>
  );
}

import { useState } from "react";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/crd/primitives/button";
import { Badge } from "@/crd/primitives/badge";

const MOCK_SPACE_INVITATIONS = [
  {
    id: "si1",
    spaceName: "Green Energy Innovation",
    spaceInitials: "GE",
    spaceColor: "#16a34a",
    invitedBy: "Elena Martinez",
    invitedDate: "2024-02-18"
  },
  {
    id: "si2",
    spaceName: "Urban Mobility Lab",
    spaceInitials: "UM",
    spaceColor: "#7c3aed",
    invitedBy: "Sarah Chen",
    invitedDate: "2024-02-20"
  },
];

export function OrgSettingsInvitations() {
  const [invitations, setInvitations] = useState(MOCK_SPACE_INVITATIONS);

  const accept = (id: string) => setInvitations((prev) => prev.filter((i) => i.id !== id));
  const decline = (id: string) => setInvitations((prev) => prev.filter((i) => i.id !== id));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-page-title">Space Invitations</h2>
        <p className="text-body text-muted-foreground mt-1">
          Spaces that have invited this organisation to join as a member.
        </p>
      </div>

      {invitations.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] border border-dashed rounded-xl bg-muted/5">
          <p className="text-body text-muted-foreground">No pending invitations.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invitations.map((inv) => (
            <div
              key={inv.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-body shrink-0"
                  style={{ backgroundColor: inv.spaceColor }}
                >
                  {inv.spaceInitials}
                </div>
                <div>
                  <div className="text-body-emphasis">{inv.spaceName}</div>
                  <div className="text-caption text-muted-foreground">
                    Invited by {inv.invitedBy} ·{" "}
                    {new Date(inv.invitedDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="ml-1 bg-amber-500/10 text-amber-600 border-amber-500/20 text-caption"
                >
                  <Bell className="w-3 h-3 mr-1" /> Pending
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="gap-1.5" onClick={() => accept(inv.id)}>
                  <Check className="w-3.5 h-3.5" /> Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => decline(inv.id)}
                >
                  <X className="w-3.5 h-3.5" /> Decline
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

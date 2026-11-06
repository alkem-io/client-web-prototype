import { Circle } from "lucide-react";
import { toast } from "sonner";
import { useActivityIndicators } from "@/app/contexts/ActivityIndicatorsContext";
import { SettingsSection } from "@/crd/components/common/SettingsSection";
import { Button } from "@/crd/primitives/button";
import { Switch } from "@/crd/primitives/switch";

/**
 * NewActivitySettingsSection — the person's control over the new-activity dots.
 *
 * WHAT PRODUCTION WOULD GAIN
 * Production has no `ActivityDot` yet, so it has nothing to control here. Once
 * it adopts the dot (spec 014), people need three things from their
 * notification settings: turn the dots off altogether, clear every dot at once
 * with an undo, and (prototype only) bring them back to demonstrate the feature
 * again. The switch applies at once, like the rest of production's tab.
 *
 * WHAT PRODUCTION NEEDS TO ADD
 * `UserNotificationsTabView` has no slot for an extra section, so the prototype
 * renders this next to it. The upstream ask: production owns this section inside
 * that view, without the demo reset row.
 */
export function NewActivitySettingsSection() {
  const activity = useActivityIndicators();

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

  return (
    <SettingsSection title="New activity" icon={<Circle className="size-4" />} iconColor="blue">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-body">Show new activity indicators</div>
            <p className="text-caption text-muted-foreground mt-0.5">
              Display a small dot on spaces, tabs, cards and posts that have changed since you last looked.
            </p>
          </div>
          <Switch
            checked={activity.enabled}
            onCheckedChange={activity.setEnabled}
            aria-label="Show new activity indicators"
          />
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-body">Mark everything as read</div>
            <p className="text-caption text-muted-foreground mt-0.5">Clears every indicator across all your spaces.</p>
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
  );
}

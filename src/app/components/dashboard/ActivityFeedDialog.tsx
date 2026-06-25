import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { ActivityFeed } from "@/app/components/dashboard/ActivityFeed";

interface ActivityFeedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "spaces" | "personal";
}

export function ActivityFeedDialog({ open, onOpenChange, type }: ActivityFeedDialogProps) {
  const title = type === "spaces" ? "Latest Activity in my Spaces" : "My Latest Activity";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="p-0">
          <ActivityFeed title={title} type={type} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

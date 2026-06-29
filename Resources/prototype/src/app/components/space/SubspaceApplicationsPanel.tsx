import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";
import {
  CheckCircle2, XCircle, Clock, MessageSquare, Zap, MapPin,
} from "lucide-react";
import { cn } from "@/app/components/ui/utils";
import type { ApplicationFormConfig, SubspaceApplication } from "@/app/components/dialogs/SubspaceApplicationDialog";

interface SubspaceApplicationsPanelProps {
  applications: SubspaceApplication[];
  formConfig: ApplicationFormConfig;
  spaceName: string;
  onApprove?: (appId: string, message: string) => void;
  onReject?: (appId: string, message: string) => void;
}

type ApplicationStatus = SubspaceApplication["status"];

const STATUS_CONFIG: Record<ApplicationStatus, { icon: typeof CheckCircle2; color: string; label: string }> = {
  draft: { icon: MessageSquare, color: "text-muted-foreground", label: "Draft" },
  submitted: { icon: Clock, color: "text-amber-600", label: "Pending review" },
  "under-review": { icon: Zap, color: "text-blue-600", label: "Under review" },
  approved: { icon: CheckCircle2, color: "text-emerald-600", label: "Approved" },
  rejected: { icon: XCircle, color: "text-red-600", label: "Declined" },
};

export function SubspaceApplicationsPanel({
  applications,
  formConfig,
  spaceName,
  onApprove,
  onReject,
}: SubspaceApplicationsPanelProps) {
  const [selectedApp, setSelectedApp] = useState<SubspaceApplication | null>(null);

  const pendingApps = applications.filter((app) => app.status === "submitted");
  const reviewedApps = applications.filter((app) => app.status !== "submitted" && app.status !== "draft");

  if (applications.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-body-emphasis">No applications yet</p>
        <p className="text-caption text-muted-foreground">When members apply, they'll appear here</p>
      </div>
    );
  }

  return (
    <>
      {/* Pending applications section */}
      {pendingApps.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <p className="text-caption font-semibold text-muted-foreground uppercase tracking-wide">
              Waiting for your review ({pendingApps.length})
            </p>
          </div>
          <div className="space-y-2">
            {pendingApps.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                isSelected={selectedApp?.id === app.id}
                onSelect={() => setSelectedApp(app)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Reviewed applications section */}
      {reviewedApps.length > 0 && (
        <div className="space-y-3 mt-8 pt-6 border-t">
          <p className="text-caption font-semibold text-muted-foreground uppercase tracking-wide">
            Review history
          </p>
          <div className="space-y-2">
            {reviewedApps.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                isSelected={selectedApp?.id === app.id}
                onSelect={() => setSelectedApp(app)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      {selectedApp && (
        <ApplicationDetailDialog
          app={selectedApp}
          formConfig={formConfig}
          spaceName={spaceName}
          onClose={() => setSelectedApp(null)}
          onApprove={(message) => {
            onApprove?.(selectedApp.id, message);
            setSelectedApp(null);
            toast.success("Subspace proposal approved! The member has been notified.");
          }}
          onReject={(message) => {
            onReject?.(selectedApp.id, message);
            setSelectedApp(null);
            toast.success("Application declined. Feedback sent to member.");
          }}
        />
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Application Card
   ═══════════════════════════════════════════════════════════════════════════════ */

interface ApplicationCardProps {
  app: SubspaceApplication;
  isSelected: boolean;
  onSelect: () => void;
}

function ApplicationCard({ app, isSelected, onSelect }: ApplicationCardProps) {
  const statusConfig = STATUS_CONFIG[app.status];
  const StatusIcon = statusConfig.icon;
  const titleAnswer = app.answers.title || "Unnamed proposal";

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left p-4 rounded-lg border transition-all",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarFallback>{app.applicantName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-body-emphasis truncate">{app.applicantName}</p>
            <Badge variant="outline" className={cn("text-caption flex-shrink-0", statusConfig.color)}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.label}
            </Badge>
          </div>
          <p className="text-caption text-muted-foreground truncate">{titleAnswer}</p>
          <p className="text-caption text-muted-foreground mt-0.5">
            {new Date(app.submittedAt).toLocaleDateString()}
          </p>
        </div>

        <div className="text-muted-foreground">→</div>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Application Detail Dialog
   ═══════════════════════════════════════════════════════════════════════════════ */

interface ApplicationDetailDialogProps {
  app: SubspaceApplication;
  formConfig: ApplicationFormConfig;
  spaceName: string;
  onClose: () => void;
  onApprove: (message: string) => void;
  onReject: (message: string) => void;
}

function ApplicationDetailDialog({
  app,
  formConfig,
  spaceName,
  onClose,
  onApprove,
  onReject,
}: ApplicationDetailDialogProps) {
  const [reviewMode, setReviewMode] = useState<null | "approve" | "reject">(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusConfig = STATUS_CONFIG[app.status];
  const StatusIcon = statusConfig.icon;

  const handleApprove = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onApprove(message);
      onClose();
    }, 800);
  };

  const handleReject = () => {
    if (!message.trim()) {
      toast.error("Please share feedback with the applicant");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onReject(message);
      onClose();
    }, 800);
  };

  const titleAnswer = app.answers.title || "Unnamed proposal";

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader className="pb-6 border-b">
          <div className="space-y-3">
            <div>
              <DialogTitle className="text-section-title">{titleAnswer}</DialogTitle>
              <DialogDescription className="text-body text-muted-foreground mt-1">
                Proposal from {app.applicantName}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <StatusIcon className={cn("w-4 h-4", statusConfig.color)} />
              <span className="text-caption text-muted-foreground">{statusConfig.label}</span>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Applicant Card */}
          <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/30">
            <Avatar className="w-14 h-14">
              <AvatarFallback>{app.applicantName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-body-emphasis">{app.applicantName}</p>
              <p className="text-caption text-muted-foreground">{app.applicantEmail}</p>
              <p className="text-caption text-muted-foreground mt-1">
                Submitted {new Date(app.submittedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Full application details */}
          <div className="space-y-4">
            <p className="text-caption font-semibold text-muted-foreground uppercase tracking-wide">Application Details</p>
            {formConfig.questions.map((question) => {
              const answer = app.answers[question.id];
              if (!answer) return null;

              return (
                <div key={question.id} className="p-3 rounded-lg border bg-muted/30">
                  <p className="text-caption font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    {question.label}
                  </p>
                  <p className="text-body whitespace-pre-wrap">
                    {typeof answer === "string" ? answer : JSON.stringify(answer)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Review section */}
          {app.status === "submitted" && !reviewMode && (
            <div className="space-y-3 pt-4 border-t">
              <p className="text-body-emphasis">What do you think?</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => setReviewMode("approve")}
                  className="flex-1 gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve
                </Button>
                <Button
                  onClick={() => setReviewMode("reject")}
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Decline
                </Button>
              </div>
            </div>
          )}

          {/* Approval/Rejection message form */}
          {reviewMode && (
            <div className="space-y-3 p-4 rounded-lg bg-muted/30 border">
              <div>
                <p className="text-body-emphasis capitalize mb-2">
                  {reviewMode === "approve" ? "Optional message" : "Feedback for applicant"}
                </p>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    reviewMode === "approve"
                      ? "Let them know what happens next..."
                      : "Share constructive feedback..."
                  }
                  className="h-24 bg-background"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setReviewMode(null);
                    setMessage("");
                  }}
                >
                  Back
                </Button>
                <Button
                  size="sm"
                  disabled={isSubmitting || (reviewMode === "reject" && !message.trim())}
                  onClick={reviewMode === "approve" ? handleApprove : handleReject}
                >
                  {isSubmitting ? "Sending..." : "Send"}
                </Button>
              </div>
            </div>
          )}

          {/* Review history */}
          {app.reviewedAt && (
            <div className="p-4 rounded-lg border bg-muted/30">
              <p className="text-caption font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Reviewed
              </p>
              <p className="text-caption text-muted-foreground">
                {new Date(app.reviewedAt).toLocaleDateString()} by {app.reviewedBy || "Space team"}
              </p>
              {app.reviewMessage && (
                <p className="text-body mt-3">{app.reviewMessage}</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

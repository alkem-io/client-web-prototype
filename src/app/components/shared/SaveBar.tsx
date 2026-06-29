import { Button } from "@/app/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SaveBarProps {
  isDirty: boolean;
  isSaving?: boolean;
  onSave: () => void;
  onDiscard?: () => void;
  className?: string;
}

export function SaveBar({ isDirty, isSaving = false, onSave, onDiscard, className }: SaveBarProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t border-primary bg-card/95 backdrop-blur-sm transition-all duration-300",
        isDirty
          ? "translate-y-0 opacity-100 shadow-[0_-6px_20px_rgba(0,0,0,0.12)]"
          : "translate-y-full opacity-0 pointer-events-none",
        className
      )}
    >
      <div className="flex items-center justify-between px-6 md:px-8 py-3.5 max-w-screen-xl mx-auto">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
          </span>
          <p className="text-sm font-medium text-foreground">
            Unsaved changes
          </p>
        </div>
        <div className="flex items-center gap-3">
          {onDiscard && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDiscard}
              disabled={isSaving}
            >
              Discard
            </Button>
          )}
          <Button
            size="sm"
            onClick={onSave}
            disabled={!isDirty || isSaving}
            className="min-w-[80px]"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

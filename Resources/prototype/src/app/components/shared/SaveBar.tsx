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
        "fixed bottom-0 left-0 right-0 z-50 border-t border-primary/35 bg-primary/[0.09] backdrop-blur-sm transition-all duration-300",
        isDirty
          ? "translate-y-0 opacity-100 shadow-[0_-4px_16px_rgba(0,0,0,0.10)]"
          : "translate-y-full opacity-0 pointer-events-none",
        className
      )}
    >
      <div className="px-6 md:px-8 py-3">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-start-2 lg:col-span-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex rounded-full h-2 w-2 bg-primary" />
              <p className="text-sm text-foreground/70">
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
                onClick={onSave}
                disabled={!isDirty || isSaving}
                className="min-w-[120px] px-5 py-2.5 text-sm font-medium shadow-md hover:shadow-lg transition-shadow"
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
      </div>
    </div>
  );
}

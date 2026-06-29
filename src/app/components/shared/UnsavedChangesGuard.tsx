import { useEffect, useCallback, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import { buttonVariants } from "@/app/components/ui/button";
import { useBlocker } from "react-router";

interface UnsavedChangesGuardProps {
  isDirty: boolean;
  onSave?: () => void;
}

export function UnsavedChangesGuard({ isDirty, onSave }: UnsavedChangesGuardProps) {
  const [showDialog, setShowDialog] = useState(false);

  // Block navigation with react-router when dirty
  const blocker = useBlocker(isDirty);

  // Show dialog when blocker fires
  useEffect(() => {
    if (blocker.state === "blocked") {
      setShowDialog(true);
    }
  }, [blocker.state]);

  // Browser beforeunload (close tab / refresh)
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const handleDiscard = useCallback(() => {
    setShowDialog(false);
    if (blocker.state === "blocked") {
      blocker.proceed();
    }
  }, [blocker]);

  const handleSave = useCallback(() => {
    setShowDialog(false);
    onSave?.();
    // After saving, proceed with navigation
    setTimeout(() => {
      if (blocker.state === "blocked") {
        blocker.proceed();
      }
    }, 100);
  }, [blocker, onSave]);

  const handleCancel = useCallback(() => {
    setShowDialog(false);
    if (blocker.state === "blocked") {
      blocker.reset();
    }
  }, [blocker]);

  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unsaved changes</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes that will be lost if you leave this page.
            Would you like to save before leaving?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            Stay on page
          </AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={handleDiscard}
          >
            Discard changes
          </AlertDialogAction>
          {onSave && (
            <AlertDialogAction onClick={handleSave}>
              Save & leave
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

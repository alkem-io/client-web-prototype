/**
 * CurrentSignMemoDialog — what ships today, rebuilt from the screenshot.
 *
 * Kept so the comparison is honest rather than remembered. Everything here is
 * deliberate: the 768px modal, the PDF at 52% inside a 480px-tall box, the
 * instruction printed twice, the ALL-CAPS MUI buttons, and a "Continue to
 * Cleverbase" that names a company without saying what it will do to you.
 */
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { NativePdfViewer } from "../NativePdfViewer";

interface CurrentSignMemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CurrentSignMemoDialog({ open, onOpenChange }: CurrentSignMemoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full gap-4 p-6 sm:max-w-[768px]">
        <div>
          <DialogTitle className="text-subsection-title">Sign memo</DialogTitle>
          <DialogDescription className="mt-2">
            Review the exact PDF copy before starting the signing session. Each signed PDF is a
            separate copy; the memo remains editable.
          </DialogDescription>
        </div>

        {/* The same sentence, again, as a heading. */}
        <p className="text-body">Review the exact PDF before continuing</p>

        <NativePdfViewer zoom={52} className="h-[480px] w-full" />

        <a href="#" className="text-body text-primary underline underline-offset-2">
          Open PDF preview
        </a>

        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            className="text-caption uppercase tracking-wide"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button className="text-caption uppercase tracking-wide">Continue to Cleverbase</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

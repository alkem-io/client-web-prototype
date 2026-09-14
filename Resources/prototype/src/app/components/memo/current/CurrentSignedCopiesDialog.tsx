/**
 * CurrentSignedCopiesDialog — today's list, rebuilt from the screenshot.
 *
 * Four lines of text per copy, an underlined name that is not a link, a machine
 * timestamp, and three identical ALL-CAPS buttons of equal weight. The answer
 * the screen exists to give — is this signature good? — only appears after you
 * press the third one, as a bare sentence with no colour and no icon.
 */
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Separator } from "@/app/components/ui/separator";
import type { SignedCopy } from "../signingData";

interface CurrentSignedCopiesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  copies: SignedCopy[];
}

/** The screenshot's format: `09/11/2026, 17:04:20`. */
function machineStamp(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getMonth() + 1)}/${p(d.getDate())}/${d.getFullYear()}, ${d.toTimeString().slice(0, 8)}`;
}

export function CurrentSignedCopiesDialog({
  open,
  onOpenChange,
  copies,
}: CurrentSignedCopiesDialogProps) {
  const [verified, setVerified] = useState<Record<string, boolean>>({});

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full gap-4 p-6 sm:max-w-[744px]">
        <div>
          <DialogTitle className="text-subsection-title">Signed copies</DialogTitle>
          <DialogDescription className="mt-2">
            Each signed PDF is a separate copy; the memo remains editable. Later edits do not
            change an existing signed copy.
          </DialogDescription>
        </div>

        <div className="space-y-4">
          {copies.map((copy, i) => (
            <div key={copy.id} className="space-y-3">
              <p className="text-body">
                <span className="underline">{copy.signer.name}</span>
                <span className="ml-3 text-muted-foreground">
                  Recorded: {machineStamp(copy.signedAt)}
                </span>
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-caption uppercase tracking-wide">
                  Open PDF
                </Button>
                <Button variant="outline" size="sm" className="text-caption uppercase tracking-wide">
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-caption uppercase tracking-wide"
                  onClick={() => setVerified(prev => ({ ...prev, [copy.id]: true }))}
                >
                  Verify signature
                </Button>
              </div>
              {verified[copy.id] && <p className="text-body">The PDF is unmodified</p>}
              {i < copies.length - 1 && <Separator />}
            </div>
          ))}
        </div>

        <p className="text-body text-muted-foreground">
          Downloaded PDFs can be independently verified with standard PDF tools.
        </p>

        <div className="flex justify-end">
          <Button
            variant="ghost"
            className="text-caption uppercase tracking-wide"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

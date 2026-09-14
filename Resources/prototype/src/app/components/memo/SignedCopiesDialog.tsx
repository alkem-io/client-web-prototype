/**
 * SignedCopiesDialog — the list of signed PDFs, as the main deliverable.
 *
 * The version this replaces was a plain text list: underlined names that looked
 * like links but were not, machine timestamps (`09/11/2026, 17:04:20` — a date
 * that means two different days depending on where you read it), three equal
 * ALL-CAPS buttons per row, and a verification result that only existed after
 * you had gone looking for it.
 *
 * Three moves fix it. The answer comes first: every copy is verified as the
 * list opens, and a strip at the top says whether they all passed, so the
 * common case is answered before you read a single row. The signers get faces.
 * And the list is a place you can act from — the sign button lives in the
 * footer, so "I should sign this too" does not require closing the dialog and
 * hunting for the button you came from.
 */
import { useEffect, useRef, useState } from "react";
import { Info, ShieldCheck, TriangleAlert } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { cn } from "@/lib/utils";
import { SignMemoButton } from "./SignMemoButton";
import { SignedCopyCard } from "./SignedCopyCard";
import { uniqueSigners, type SignedCopy, type Signer } from "./signingData";

interface SignedCopiesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  copies: SignedCopy[];
  /** Drives the footer button's two states — see SignMemoButton. */
  cleverbaseLinked: boolean;
  currentUser: Signer;
  onSign: () => void;
}

export function SignedCopiesDialog({
  open,
  onOpenChange,
  copies,
  cleverbaseLinked,
  currentUser,
  onSign,
}: SignedCopiesDialogProps) {
  // Verification runs on open rather than on demand: the question "are these
  // good?" is the reason the screen exists, so it should not cost a click.
  const [states, setStates] = useState<Record<string, SignedCopy["verification"]>>({});

  useEffect(() => {
    if (!open) return;
    setStates(Object.fromEntries(copies.map(c => [c.id, "checking" as const])));
    const timer = setTimeout(() => {
      setStates(Object.fromEntries(copies.map(c => [c.id, c.verification])));
    }, 900);
    return () => clearTimeout(timer);
  }, [open, copies]);

  const resolved = copies.map(copy => ({ ...copy, verification: states[copy.id] ?? "checking" }));
  const checking = resolved.some(c => c.verification === "checking");
  const altered = resolved.filter(c => c.verification === "modified").length;
  const signers = uniqueSigners(copies);
  const alreadySigned = copies.some(c => c.signer.id === currentUser.id);

  const contentRef = useRef<HTMLDivElement>(null);

  const recheck = (copy: SignedCopy) => {
    setStates(prev => ({ ...prev, [copy.id]: "checking" }));
    setTimeout(() => setStates(prev => ({ ...prev, [copy.id]: copy.verification })), 900);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={contentRef}
        onOpenAutoFocus={event => {
          event.preventDefault();
          contentRef.current?.focus();
        }}
        className="flex max-h-[88vh] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
      >
        <div className="flex shrink-0 items-start gap-4 border-b px-6 py-5 pr-14">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
            <ShieldCheck className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-section-title">Signed copies</DialogTitle>
            <DialogDescription className="mt-0.5">
              Each signature belongs to one copy of this memo. The memo itself stays editable —
              later edits never change a copy that has already been signed.
            </DialogDescription>
          </div>
        </div>

        {copies.length > 0 && (
          /* The verdict, before the list. */
          <div className="flex shrink-0 flex-wrap items-center gap-3 border-b bg-muted/25 px-6 py-3">
            <span className="flex -space-x-2">
              {signers.slice(0, 4).map(signer => (
                <Avatar key={signer.id} className="size-7 ring-2 ring-background">
                  <AvatarImage src={signer.avatar} alt="" />
                  <AvatarFallback className="text-badge">{signer.initials}</AvatarFallback>
                </Avatar>
              ))}
            </span>
            <p className="text-caption text-muted-foreground">
              <span className="text-body-emphasis text-foreground">
                {copies.length} {copies.length === 1 ? "copy" : "copies"}
              </span>{" "}
              signed by {signers.length} {signers.length === 1 ? "person" : "people"}
            </p>
            <span
              className={cn(
                "ml-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-medium",
                checking
                  ? "bg-muted text-muted-foreground"
                  : altered > 0
                    ? "bg-destructive/10 text-destructive"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
              )}
            >
              {altered > 0 && !checking ? (
                <TriangleAlert className="size-3.5" />
              ) : (
                <ShieldCheck className="size-3.5" />
              )}
              {checking
                ? "Checking signatures…"
                : altered > 0
                  ? `${altered} ${altered === 1 ? "copy has" : "copies have"} been altered`
                  : "All signatures check out"}
            </span>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {copies.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <ShieldCheck className="size-7" />
              </div>
              <div>
                <p className="text-subheader">Nobody has signed this memo yet</p>
                <p className="mx-auto mt-1 max-w-sm text-caption text-muted-foreground">
                  Signing takes a snapshot of the memo as a PDF and records who stood behind it.
                  The memo keeps working exactly as it does now.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {resolved.map(copy => (
                  <SignedCopyCard key={copy.id} copy={copy} onRecheck={recheck} />
                ))}
              </div>
              <p className="mt-5 flex items-start gap-2 text-caption text-muted-foreground">
                <Info className="mt-0.5 size-3.5 shrink-0" />
                Any PDF reader can check these signatures. You don't need Alkemio to prove a copy
                is genuine.
              </p>
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 border-t px-6 py-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <SignMemoButton
            linked={cleverbaseLinked}
            onSign={onSign}
            label={alreadySigned ? "Sign again" : "Sign this memo"}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

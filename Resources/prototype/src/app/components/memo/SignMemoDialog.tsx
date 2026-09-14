/**
 * SignMemoDialog — the screen before the handoff to Cleverbase.
 *
 * What was wrong with the dialog this replaces:
 *
 * 1. The document got the least room. A 715×480 modal rendered the PDF at 52%
 *    inside the browser's own viewer, so the widest, loudest thing on screen
 *    was a toolbar full of controls nobody needs here — print, rotate, draw,
 *    undo. The thing you are being asked to check was a grey postage stamp.
 * 2. It said the same sentence twice: a paragraph asking you to review the PDF,
 *    then a heading asking you to review the PDF.
 * 3. It never said what "Continue to Cleverbase" does. You leave Alkemio, you
 *    identify yourself, you come back — none of that was on the screen, and the
 *    button named a company most users have never heard of.
 * 4. The reassurance that actually matters — signing does not lock the memo —
 *    was a subordinate clause in the small print.
 *
 * So: one wide dialog, the document taking the whole left side at a size where
 * the browser opens it near 100%, and a right rail that answers "what happens
 * if I press the button" before you press it. The rail borrows the settings
 * pages' vocabulary — tinted chip, plain-word heading, one sentence — rather
 * than inventing a new one.
 */
import { useRef } from "react";
import {
  ExternalLink,
  FileText,
  Fingerprint,
  PenLine,
  Signature,
  SquareArrowOutUpRight,
  UserCheck,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { NativePdfViewer } from "./NativePdfViewer";
import type { Signer } from "./signingData";
import { cn } from "@/lib/utils";

interface SignMemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memoTitle: string;
  /** The memo's own content, so the snapshot shows the document being signed. */
  memoMarkdown?: string;
  signer: Signer;
  onContinue: () => void;
}

/** The journey, in the order it happens. Three steps is the whole story. */
const STEPS = [
  {
    icon: SquareArrowOutUpRight,
    tint: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    title: "You go to Cleverbase",
    body: "This tab opens Cleverbase, the service Alkemio uses to witness signatures.",
  },
  {
    icon: Fingerprint,
    tint: "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
    title: "You confirm it's you",
    body: "With the ID method you linked to your account. Alkemio never sees those details.",
  },
  {
    icon: UserCheck,
    tint: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    title: "You land back here",
    body: "Your signed copy is attached to the memo. The whole trip takes about a minute.",
  },
];

export function SignMemoDialog({
  open,
  onOpenChange,
  memoTitle,
  memoMarkdown,
  signer,
  onContinue,
}: SignMemoDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={contentRef}
        /* Without this the first tabbable element — the tertiary "open in a new
           tab" link — opens wearing a focus ring, which reads as the thing to
           press. Focus goes to the dialog itself instead, so the title is what
           gets announced and nothing is pre-selected. */
        onOpenAutoFocus={event => {
          event.preventDefault();
          contentRef.current?.focus();
        }}
        className="flex h-[min(92vh,820px)] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-[1280px]"
      >
        {/* Header — pr-14 clears the close X DialogContent renders itself. */}
        <div className="flex shrink-0 items-start gap-4 border-b px-6 py-5 pr-14">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Signature className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-section-title">Sign this memo</DialogTitle>
            <DialogDescription className="mt-0.5">
              This is exactly what gets signed. Have a read, then confirm it's you.
            </DialogDescription>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          {/* ── The document ── */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col px-6 py-5">
            <div className="mb-3 flex shrink-0 items-center gap-2">
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <p className="min-w-0 truncate text-body-emphasis">{memoTitle}</p>
              <span className="shrink-0 text-caption text-muted-foreground">
                · 1 page · made just now
              </span>
              <Button
                variant="link"
                size="sm"
                className="ml-auto shrink-0 gap-1.5 px-0"
                onClick={() => window.open("#", "_blank")}
              >
                Open in a new tab
                <ExternalLink className="size-3.5" />
              </Button>
            </div>

            <NativePdfViewer
              markdown={memoMarkdown}
              zoom={100}
              className="min-h-0 flex-1 rounded-xl border shadow-sm"
            />
          </div>

          {/* ── What pressing the button does ── */}
          <aside className="flex w-full shrink-0 flex-col gap-5 overflow-y-auto border-t bg-muted/25 px-6 py-5 lg:w-[360px] lg:border-l lg:border-t-0">
            <div>
              <p className="text-label uppercase text-muted-foreground">What happens next</p>
              <ol className="mt-3 space-y-1">
                {STEPS.map((step, i) => (
                  <li key={step.title} className="flex gap-3">
                    {/* The rail: chip, then a line down to the next chip. */}
                    <div className="flex shrink-0 flex-col items-center">
                      <span
                        className={cn(
                          "flex size-9 items-center justify-center rounded-xl",
                          step.tint,
                        )}
                      >
                        <step.icon className="size-4.5" />
                      </span>
                      {i < STEPS.length - 1 && (
                        <span className="my-1 w-px flex-1 bg-border" aria-hidden="true" />
                      )}
                    </div>
                    <div className={cn("min-w-0", i < STEPS.length - 1 && "pb-4")}>
                      <p className="text-body-emphasis">{step.title}</p>
                      <p className="mt-0.5 text-caption text-muted-foreground">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* The misconception this feature invites, answered in its own card
                rather than in a subordinate clause of the small print. */}
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-2">
                <PenLine className="size-4 shrink-0 text-muted-foreground" />
                <p className="text-body-emphasis">Signing doesn't lock the memo</p>
              </div>
              <p className="mt-1.5 text-caption text-muted-foreground">
                The memo stays editable by everyone who can edit it today. Your signature belongs
                to this copy alone — later edits don't change it, and don't break it.
              </p>
            </div>
          </aside>
        </div>

        {/* ── Footer ── */}
        <div className="flex shrink-0 flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage src={signer.avatar} alt="" />
              <AvatarFallback className="text-badge">{signer.initials}</AvatarFallback>
            </Avatar>
            <p className="text-caption text-muted-foreground">
              Signing as <span className="text-foreground">{signer.name}</span>
            </p>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onContinue} className="gap-2">
              Continue to Cleverbase
              <ExternalLink className="size-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

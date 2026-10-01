/**
 * MemoSignedDialog — the moment you get back from Cleverbase.
 *
 * This is the only screen in the flow with nothing to decide, so it is the only
 * one allowed to be pleased with itself. You went somewhere else, proved who
 * you were, and came back: the return should land, not read like a receipt.
 *
 * The celebration is one burst, once. Dots fly out of the seal on entry and
 * stop; the ring pulses twice and stops. Nothing loops — a dialog that keeps
 * twitching while you read it is a dialog you close quickly.
 *
 * The copy you just made is shown with the same `SignedCopyCard` the list uses,
 * on purpose: this is the first time anyone sees that card, and the shape they
 * learn here is the shape they will meet again under Signed copies.
 *
 * (Timing: this is meant to fire the moment the Cleverbase redirect returns —
 * today it only appears after the memo is closed and reopened, which is being
 * fixed separately. The design assumes the fixed behaviour.)
 */
import { useRef } from "react";
import { BadgeCheck } from "lucide-react";
import { Button } from "@/crd/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@/crd/primitives/dialog";
import { SignedCopyCard } from "./SignedCopyCard";
import type { SignedCopy } from "./signingData";
import { cn } from "@/crd/lib/utils";

interface MemoSignedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memoTitle: string;
  copy: SignedCopy;
  onViewAll: () => void;
}

/**
 * Twelve dots on a ring around the seal. Position comes from the wrapper so the
 * animation utilities keep full control of `transform` on the dot itself.
 */
const CONFETTI = Array.from({ length: 11 }, (_, i) => {
  // A half-ring over the top of the seal, never below it: the title sits there,
  // and a dot landing on a word reads as a rendering fault rather than a spark.
  const angle = Math.PI + (i / 10) * Math.PI;
  const radius = 64 + (i % 3) * 16;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius * 0.9,
    delay: 90 + (i % 5) * 60,
    size: i % 3 === 0 ? 8 : 6,
    tint: [
      "bg-emerald-400",
      "bg-amber-400",
      "bg-purple-400",
      "bg-blue-400",
      "bg-rose-400",
    ][i % 5],
    round: i % 2 === 0
  };
});

export function MemoSignedDialog({
  open,
  onOpenChange,
  memoTitle,
  copy,
  onViewAll
}: MemoSignedDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={contentRef}
        onOpenAutoFocus={event => {
          event.preventDefault();
          contentRef.current?.focus();
        }}
        className="w-full gap-0 overflow-hidden p-0 sm:max-w-xl"
      >
        {/* ── The moment ── */}
        <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-background px-6 pb-6 pt-10 text-center dark:from-emerald-500/10">
          {/* Soft glow behind the seal. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 size-[320px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-emerald-400/20 blur-3xl"
          />

          <div className="relative mx-auto size-24">
            {CONFETTI.map((dot, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="absolute left-1/2 top-1/2"
                style={{ transform: `translate(${dot.x - dot.size / 2}px, ${dot.y - dot.size / 2}px)` }}
              >
                <span
                  className={cn(
                    "block animate-in fade-in zoom-in-0 fill-mode-backwards duration-700",
                    dot.tint,
                    dot.round ? "rounded-full" : "rounded-[2px]",
                  )}
                  style={{
                    width: dot.size,
                    height: dot.size,
                    animationDelay: `${dot.delay}ms`
                  }}
                />
              </span>
            ))}

            {/* One ring, pulsing twice, then still. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 animate-ping rounded-full bg-emerald-500/25 [animation-iteration-count:2]"
            />
            <div className="relative flex size-24 animate-in zoom-in-50 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 duration-500">
              <BadgeCheck className="size-12" strokeWidth={1.75} />
            </div>
          </div>

          <DialogTitle className="mt-5 text-page-title">It's signed</DialogTitle>
          <DialogDescription className="mx-auto mt-1.5 max-w-sm">
            Your signed copy of <span className="text-foreground">{memoTitle}</span> is saved and
            verified. It will stay exactly as it reads now.
          </DialogDescription>
        </div>

        {/* ── What you just made ── */}
        <div className="px-6 pb-2">
          <SignedCopyCard copy={copy} />
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4">
          <Button variant="ghost" onClick={onViewAll}>
            See all signed copies
          </Button>
          <Button onClick={() => onOpenChange(false)}>Back to the memo</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

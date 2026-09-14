/**
 * SignedCopyCard — one signed PDF, as a thing you can look at.
 *
 * The list this replaces was four lines of text and three identical ALL-CAPS
 * outline buttons per row: OPEN PDF, DOWNLOAD, VERIFY SIGNATURE, all the same
 * weight, so nothing told you which one you wanted. Worse, the answer to the
 * only question the screen exists to answer — is this signature good? — was
 * hidden behind the third button, and appeared as a bare sentence of text once
 * you clicked it.
 *
 * Here verification runs when the list opens and its result is the first thing
 * on the card, the signer gets a face, and the actions are ranked: one worded
 * button for the thing people want (open it), icons for the rest.
 *
 * The page thumbnail is not decoration. Copies differ only by *when* they were
 * taken, so a row of near-identical pages is an honest picture of what you are
 * looking at, and it is what makes the list legible at a glance rather than
 * readable line by line.
 */
import {
  Download,
  ExternalLink,
  Loader2,
  RefreshCw,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { IconButton } from "@/app/components/ui/icon-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  formatSignedAtPrecise,
  formatSignedAtRelative,
  type SignedCopy,
  type VerificationState,
} from "./signingData";

interface SignedCopyCardProps {
  copy: SignedCopy;
  /** `compact` drops the thumbnail and stacks the actions — for the side panel. */
  density?: "comfortable" | "compact";
  onOpen?: (copy: SignedCopy) => void;
  onDownload?: (copy: SignedCopy) => void;
  onRecheck?: (copy: SignedCopy) => void;
  className?: string;
}

const VERIFICATION: Record<
  VerificationState,
  { icon: typeof ShieldCheck; label: string; detail: string; chip: string; spin?: boolean }
> = {
  verified: {
    icon: ShieldCheck,
    label: "Verified",
    detail: "Re-checked against the signature inside the file — not a byte has changed since it was signed.",
    chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  checking: {
    icon: Loader2,
    label: "Checking…",
    detail: "Re-hashing the file against the signature it carries.",
    chip: "bg-muted text-muted-foreground",
    spin: true,
  },
  modified: {
    icon: TriangleAlert,
    label: "Altered — does not match",
    detail: "The file no longer matches the signature it carries. Treat this copy as untrustworthy.",
    chip: "bg-destructive/10 text-destructive",
  },
};

/** A page, drawn small. Faux lines come from the copy so no two look identical. */
function PageThumbnail({ copy }: { copy: SignedCopy }) {
  const state = VERIFICATION[copy.verification];
  return (
    <div className="relative shrink-0">
      <div className="h-[66px] w-[50px] overflow-hidden rounded-md border bg-white p-[5px] shadow-sm">
        <div className="space-y-[3px]">
          {copy.excerpt.map((w, i) => (
            <div
              key={i}
              className={cn("h-[2px] rounded-full", w === 0 ? "bg-transparent" : "bg-neutral-300")}
              style={{ width: `${w || 10}%` }}
            />
          ))}
        </div>
      </div>
      {/* The seal reads at thumbnail size where a word would not. */}
      <span
        className={cn(
          "absolute -bottom-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full ring-2 ring-card",
          copy.verification === "modified"
            ? "bg-destructive text-white"
            : copy.verification === "checking"
              ? "bg-muted text-muted-foreground"
              : "bg-emerald-600 text-white",
        )}
      >
        <state.icon className={cn("size-3", state.spin && "animate-spin")} />
      </span>
    </div>
  );
}

export function SignedCopyCard({
  copy,
  density = "comfortable",
  onOpen,
  onDownload,
  onRecheck,
  className,
}: SignedCopyCardProps) {
  const state = VERIFICATION[copy.verification];
  const compact = density === "compact";

  /* Compact drops to icons in a row under the text: in a 320px rail a worded
     button plus two icons stacks into a three-storey column, which makes every
     card twice as tall as the thing it describes. */
  const actions = (
    <div className={cn("flex shrink-0 items-center gap-1", compact && "ml-auto")}>
      {compact ? (
        <IconButton
          variant="ghost"
          size="icon"
          tooltipLabel="Open PDF"
          className="size-7"
          onClick={() => onOpen?.(copy)}
        >
          <ExternalLink className="size-4" />
        </IconButton>
      ) : (
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => onOpen?.(copy)}>
          Open
          <ExternalLink className="size-3.5" />
        </Button>
      )}
      <IconButton
        variant="ghost"
        size="icon"
        tooltipLabel={`Download PDF · ${copy.fileSize}`}
        className={cn(compact && "size-7")}
        onClick={() => onDownload?.(copy)}
      >
        <Download className="size-4" />
      </IconButton>
      <IconButton
        variant="ghost"
        size="icon"
        tooltipLabel="Check this signature again"
        className={cn(compact && "size-7")}
        onClick={() => onRecheck?.(copy)}
        disabled={copy.verification === "checking"}
      >
        <RefreshCw className={cn("size-4", copy.verification === "checking" && "animate-spin")} />
      </IconButton>
    </div>
  );

  return (
    <div
      className={cn(
        "group flex gap-4 rounded-xl border bg-card p-4 transition-colors hover:border-foreground/15 hover:bg-muted/30",
        compact && "gap-3 p-3",
        className,
      )}
    >
      {!compact && <PageThumbnail copy={copy} />}

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar className="size-6 shrink-0">
            <AvatarImage src={copy.signer.avatar} alt="" />
            <AvatarFallback className="text-badge">{copy.signer.initials}</AvatarFallback>
          </Avatar>
          <p className="min-w-0 truncate text-body-emphasis">{copy.signer.name}</p>
        </div>

        {/* Dated in words, with the machine timestamp kept for whoever needs it. */}
        <p className="flex flex-wrap items-center gap-x-1.5 text-caption text-muted-foreground">
          <Tooltip>
            <TooltipTrigger asChild>
              <span>Signed {formatSignedAtRelative(copy.signedAt)}</span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Recorded {formatSignedAtPrecise(copy.signedAt)}
            </TooltipContent>
          </Tooltip>
          {copy.editsSince > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    {copy.editsSince} {copy.editsSince === 1 ? "edit" : "edits"} since
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[260px]">
                  The memo has moved on, this copy hasn't. That's the point — it still reads the
                  way it did when it was signed.
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </p>

        <div className="flex min-w-0 items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={cn(
                  "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-caption font-medium",
                  state.chip,
                )}
              >
                <state.icon className={cn("size-3.5", state.spin && "animate-spin")} />
                {state.label}
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[280px]">
              {state.detail}
            </TooltipContent>
          </Tooltip>
          {compact && actions}
        </div>
      </div>

      {!compact && actions}
    </div>
  );
}

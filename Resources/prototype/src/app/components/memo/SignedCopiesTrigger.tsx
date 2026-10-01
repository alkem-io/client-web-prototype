/**
 * SignedCopiesTrigger — the way into the signed-copies list.
 *
 * Today it is an outlined button sitting above the post, in the row where the
 * commands live, competing with Sign memo for the same attention. But it is not
 * a command — it is a fact about the document, and the person reading it mostly
 * wants to know *that* copies exist, not to go and manage them.
 *
 * So it moves down into the byline, next to the author and the date, where the
 * document's other facts already are, and it stops being outlined. Faces do the
 * work the border used to: a stack of signer avatars says who, the count says
 * how many, and the whole thing is a quiet text button you can still click.
 *
 * `tone="toolbar"` keeps a ghost-button version for the memo's own top bar,
 * where there is no byline to sit in.
 */
import { ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/crd/primitives/avatar";
import { Button } from "@/crd/primitives/button";
import { cn } from "@/crd/lib/utils";
import type { Signer } from "./signingData";

interface SignedCopiesTriggerProps {
  count: number;
  /** De-duplicated signers, newest first; up to three faces are shown. */
  signers: Signer[];
  onClick: () => void;
  tone?: "meta" | "toolbar";
  className?: string;
}

export function SignedCopiesTrigger({
  count,
  signers,
  onClick,
  tone = "meta",
  className
}: SignedCopiesTriggerProps) {
  if (count === 0) return null;

  const label = `${count} signed ${count === 1 ? "copy" : "copies"}`;
  const faces = signers.slice(0, 3);

  if (tone === "toolbar") {
    return (
      <Button variant="ghost" size="sm" className={cn("gap-2", className)} onClick={onClick}>
        <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
        {label}
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group inline-flex items-center gap-2 rounded-md px-1.5 py-0.5 -mx-1.5 text-caption text-muted-foreground",
        "transition-colors hover:bg-muted/60 hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className,
      )}
    >
      <span className="flex -space-x-1.5">
        {faces.map(signer => (
          <Avatar key={signer.id} className="size-5 ring-2 ring-background">
            <AvatarImage src={signer.avatar} alt="" />
            <AvatarFallback className="text-[9px]">{signer.initials}</AvatarFallback>
          </Avatar>
        ))}
      </span>
      <span className="underline-offset-2 group-hover:underline">{label}</span>
    </button>
  );
}

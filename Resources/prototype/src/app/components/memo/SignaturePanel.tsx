/**
 * SignaturePanel — the same list, as a rail inside the memo instead of a dialog.
 *
 * The alternative worth putting next to the dialog. A dialog is right when
 * signatures are something you occasionally go and check; a rail is right when
 * they are part of what the document *is* — you see who stands behind the memo
 * while you read it, and signing is a button you can reach without leaving the
 * page you are on.
 *
 * The cost is width: the rail takes ~320px away from the memo permanently, and
 * memos are a reading surface. So it is drawn as collapsible, and the trade is
 * the thing to decide — this component exists to make that trade visible rather
 * than to argue for it.
 */
import { PanelRightClose, ShieldCheck } from "lucide-react";
import { IconButton } from "@/app/components/ui/icon-button";
import { cn } from "@/lib/utils";
import { SignMemoButton } from "./SignMemoButton";
import { SignedCopyCard } from "./SignedCopyCard";
import type { SignedCopy, Signer } from "./signingData";

interface SignaturePanelProps {
  copies: SignedCopy[];
  cleverbaseLinked: boolean;
  currentUser: Signer;
  onSign: () => void;
  onCollapse?: () => void;
  className?: string;
}

export function SignaturePanel({
  copies,
  cleverbaseLinked,
  currentUser,
  onSign,
  onCollapse,
  className,
}: SignaturePanelProps) {
  const alreadySigned = copies.some(c => c.signer.id === currentUser.id);
  const allVerified = copies.length > 0 && copies.every(c => c.verification === "verified");

  return (
    <aside className={cn("flex w-[320px] shrink-0 flex-col border-l bg-muted/20", className)}>
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <p className="text-body-emphasis">Signatures</p>
        <span className="rounded-full bg-muted px-1.5 text-caption text-muted-foreground">
          {copies.length}
        </span>
        {onCollapse && (
          <IconButton
            variant="ghost"
            size="icon"
            tooltipLabel="Hide signatures"
            className="ml-auto size-7"
            onClick={onCollapse}
          >
            <PanelRightClose className="size-4" />
          </IconButton>
        )}
      </div>

      {allVerified && (
        <p className="border-b bg-emerald-50 px-4 py-2 text-caption text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          All signatures check out
        </p>
      )}

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {copies.length === 0 ? (
          <p className="px-1 py-6 text-center text-caption text-muted-foreground">
            No signatures yet. Signing takes a PDF snapshot of the memo — the memo itself keeps
            working as it does now.
          </p>
        ) : (
          copies.map(copy => (
            <SignedCopyCard key={copy.id} copy={copy} density="compact" />
          ))
        )}
      </div>

      <div className="border-t p-3">
        <SignMemoButton
          linked={cleverbaseLinked}
          onSign={onSign}
          label={alreadySigned ? "Sign again" : "Sign memo"}
          className="w-full"
        />
      </div>
    </aside>
  );
}

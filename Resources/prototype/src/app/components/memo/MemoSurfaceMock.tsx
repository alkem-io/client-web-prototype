/**
 * MemoSurfaceMock — enough of the memo editor to judge where the buttons go.
 *
 * Memos are not built in the prototype yet, so this is a stand-in for the
 * screen in the screenshots: title bar, editor toolbar, body, status line. It
 * exists for one question — the ticket's "reconsider what the right position
 * is" — which cannot be answered by looking at a button on its own.
 *
 * `placement="current"` reproduces what ships today: two outlined, shouting
 * buttons side by side in the title bar, where a command and a fact compete as
 * equals. `placement="proposed"` keeps one command in the bar and moves the
 * fact down into the byline with the document's other facts.
 */
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Italic,
  Link2,
  List,
  ListOrdered,
  Maximize2,
  Minus,
  Quote,
  Share2,
  Smile,
  Table,
  Wifi,
  X
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/crd/primitives/avatar";
import { Button } from "@/crd/primitives/button";
import { IconButton } from "@/crd/primitives/icon-button";
import { cn } from "@/crd/lib/utils";
import { SignMemoButton } from "./SignMemoButton";
import { SignedCopiesTrigger } from "./SignedCopiesTrigger";
import { SignaturePanel } from "./SignaturePanel";
import { uniqueSigners, type SignedCopy, type Signer } from "./signingData";

interface MemoSurfaceMockProps {
  title: string;
  author: Signer;
  copies: SignedCopy[];
  cleverbaseLinked: boolean;
  currentUser: Signer;
  placement?: "current" | "proposed";
  withPanel?: boolean;
  onSign: () => void;
  onOpenCopies: () => void;
  className?: string;
}

const TOOLBAR = [Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code, Minus, Table, Link2, Image, Smile];

const BODY = [
  "Once in a generation, sometimes once in a lifetime, a singular event blindsides the entire planet. 25 years on, does the memory of the Nine-Eleven attacks against New York's Twin Towers, the Pentagon and in Pennsylvania fade into history or is it still as raw and vivid as on that sunny September morning?",
  "Back then, the world was still processing the end of the Cold War. Western spies who'd learned Russian suddenly had to take Arabic lessons, the element of surprise compounded by the shock of non-state actors killing thousands on U.S. soil. Each big anniversary since has been a marker of its own time.",
];

export function MemoSurfaceMock({
  title,
  author,
  copies,
  cleverbaseLinked,
  currentUser,
  placement = "proposed",
  withPanel = false,
  onSign,
  onOpenCopies,
  className
}: MemoSurfaceMockProps) {
  const current = placement === "current";

  return (
    <div className={cn("overflow-hidden rounded-xl border bg-card shadow-sm", className)}>
      {/* ── Title bar ── */}
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <p className="min-w-0 flex-1 truncate text-subsection-title">{title}</p>

        {current ? (
          /* What ships today: a fact and a command, both outlined, both shouting. */
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-caption uppercase tracking-wide"
              onClick={onOpenCopies}
            >
              Signed copies ({copies.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-caption uppercase tracking-wide"
              onClick={onSign}
            >
              Sign memo
            </Button>
          </div>
        ) : (
          <SignMemoButton linked={cleverbaseLinked} onSign={onSign} size="sm" />
        )}

        <div className="flex items-center">
          <IconButton variant="ghost" size="icon" tooltipLabel="Share" className="size-8">
            <Share2 className="size-4" />
          </IconButton>
          <IconButton variant="ghost" size="icon" tooltipLabel="Full screen" className="size-8">
            <Maximize2 className="size-4" />
          </IconButton>
          <IconButton variant="ghost" size="icon" tooltipLabel="Close" className="size-8">
            <X className="size-4" />
          </IconButton>
        </div>
      </div>

      {/* ── Editor toolbar ── */}
      <div className="flex items-center gap-0.5 border-b px-3 py-1.5 text-muted-foreground">
        {TOOLBAR.map((Icon, i) => (
          <span key={i} className="flex size-7 items-center justify-center rounded-md">
            <Icon className="size-4" />
          </span>
        ))}
      </div>

      <div className="flex min-h-[320px]">
        <div className="min-w-0 flex-1 px-6 py-5">
          {/* ── Byline: where the document's facts live ── */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pb-4">
            <Avatar className="size-6">
              <AvatarImage src={author.avatar} alt="" />
              <AvatarFallback className="text-badge">{author.initials}</AvatarFallback>
            </Avatar>
            <span className="text-caption text-foreground">{author.name}</span>
            <span className="text-caption text-muted-foreground">· Today</span>
            {!current && copies.length > 0 && (
              <>
                <span className="text-caption text-muted-foreground">·</span>
                <SignedCopiesTrigger
                  count={copies.length}
                  signers={uniqueSigners(copies)}
                  onClick={onOpenCopies}
                />
              </>
            )}
          </div>

          <div className="space-y-3">
            {BODY.map((p, i) => (
              <p key={i} className={cn("text-body", i === 0 && "text-body-emphasis")}>
                {p}
              </p>
            ))}
          </div>
        </div>

        {withPanel && (
          <SignaturePanel
            copies={copies}
            cleverbaseLinked={cleverbaseLinked}
            currentUser={currentUser}
            onSign={onSign}
          />
        )}
      </div>

      {/* ── Status line ── */}
      <div className="flex items-center gap-2 border-t px-4 py-2 text-caption text-muted-foreground">
        <Avatar className="size-5">
          <AvatarImage src={currentUser.avatar} alt="" />
          <AvatarFallback className="text-[9px]">{currentUser.initials}</AvatarFallback>
        </Avatar>
        <span className="ml-auto flex items-center gap-1.5">
          <Wifi className="size-3.5" />
          Saved
        </span>
      </div>
    </div>
  );
}

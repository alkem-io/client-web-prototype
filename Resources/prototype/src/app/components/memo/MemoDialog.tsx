/**
 * MemoDialog — the memo itself, opened from "Open Memo" in the feed.
 *
 * The prototype had no memo surface: a memo post showed a preview with an Open
 * Memo button that fell through to the post dialog, so there was nowhere for the
 * signing entry points to live. This is that surface — the screen from the
 * screenshots, with the two entry points placed as 013 proposes:
 *
 * - **Sign memo** keeps the title bar, as the one command there.
 * - **Signed copies** sits in the byline with the author and the date, because
 *   it is a fact about the document rather than something to do to it.
 *
 * The three signing dialogs are hosted here and the round trip is simulated:
 * continuing appends a real copy to the store, so the count in the byline, the
 * feed card and the post dialog all move at once.
 */
import { useState } from "react";
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
  Loader2,
  Maximize2,
  Minus,
  Quote,
  Share2,
  Smile,
  Table,
  Wifi,
  X,
} from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/app/components/ui/dialog";
import { IconButton } from "@/app/components/ui/icon-button";
import { MemoSignedDialog } from "./MemoSignedDialog";
import { SignMemoButton } from "./SignMemoButton";
import { SignMemoDialog } from "./SignMemoDialog";
import { SignedCopiesDialog } from "./SignedCopiesDialog";
import { SignedCopiesTrigger } from "./SignedCopiesTrigger";
import { CURRENT_USER, signMemo, useMemoSigning, useSignedCopies } from "./memoSigningStore";
import { uniqueSigners, type SignedCopy } from "./signingData";

interface MemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The post id the memo belongs to — the key signed copies are stored under. */
  memoId: string;
  title: string;
  markdown: string;
  author: { name: string; avatarUrl?: string };
  timestamp?: string;
}

/** Read-only editor chrome, so the memo reads as the editable thing it is. */
const TOOLBAR = [
  Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered,
  Quote, Code, Minus, Table, Link2, Image, Smile,
];

/** Markdown mapped onto the prototype's typography tokens. */
const MARKDOWN_COMPONENTS = {
  h1: (props: { children?: React.ReactNode }) => (
    <h1 className="mt-6 mb-2 text-section-title first:mt-0" {...props} />
  ),
  h2: (props: { children?: React.ReactNode }) => (
    <h2 className="mt-5 mb-2 text-subsection-title first:mt-0" {...props} />
  ),
  h3: (props: { children?: React.ReactNode }) => (
    <h3 className="mt-4 mb-1 text-body-emphasis first:mt-0" {...props} />
  ),
  p: (props: { children?: React.ReactNode }) => <p className="mb-3 text-body" {...props} />,
  ul: (props: { children?: React.ReactNode }) => (
    <ul className="mb-3 list-disc space-y-1 pl-5 text-body" {...props} />
  ),
  ol: (props: { children?: React.ReactNode }) => (
    <ol className="mb-3 list-decimal space-y-1 pl-5 text-body" {...props} />
  ),
  table: (props: { children?: React.ReactNode }) => (
    <div className="mb-3 overflow-x-auto rounded-lg border">
      <table className="w-full border-collapse text-body" {...props} />
    </div>
  ),
  th: (props: { children?: React.ReactNode }) => (
    <th className="border-b bg-muted/40 px-3 py-2 text-left text-label uppercase text-muted-foreground" {...props} />
  ),
  td: (props: { children?: React.ReactNode }) => (
    <td className="border-b px-3 py-2 last:border-0" {...props} />
  ),
};

export function MemoDialog({
  open,
  onOpenChange,
  memoId,
  title,
  markdown,
  author,
  timestamp = "Today",
}: MemoDialogProps) {
  const { cleverbaseLinked, signingEnabled } = useMemoSigning();
  const copies = useSignedCopies(memoId);

  const [signOpen, setSignOpen] = useState(false);
  const [copiesOpen, setCopiesOpen] = useState(false);
  const [justSigned, setJustSigned] = useState<SignedCopy | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  /* Stands in for the round trip: leave, identify, come back signed. */
  const runHandoff = () => {
    setSignOpen(false);
    setRedirecting(true);
    setTimeout(() => {
      setRedirecting(false);
      setJustSigned(signMemo(memoId));
    }, 1400);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="flex h-[min(92vh,860px)] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-[1100px] [&>button]:hidden"
        >
          {/* ── Title bar ── */}
          <div className="flex shrink-0 items-center gap-2 border-b px-4 py-3">
            <DialogTitle className="min-w-0 flex-1 truncate">{title}</DialogTitle>
            <DialogDescription className="sr-only">
              Memo by {author.name}, {timestamp}
            </DialogDescription>

            {signingEnabled && (
              <SignMemoButton
                linked={cleverbaseLinked}
                onSign={() => setSignOpen(true)}
                size="sm"
              />
            )}

            <div className="flex items-center">
              <IconButton variant="ghost" size="icon" tooltipLabel="Share" className="size-8">
                <Share2 className="size-4" />
              </IconButton>
              <IconButton variant="ghost" size="icon" tooltipLabel="Full screen" className="size-8">
                <Maximize2 className="size-4" />
              </IconButton>
              <IconButton
                variant="ghost"
                size="icon"
                tooltipLabel="Close"
                className="size-8"
                onClick={() => onOpenChange(false)}
              >
                <X className="size-4" />
              </IconButton>
            </div>
          </div>

          {/* ── Editor toolbar ── */}
          <div className="flex shrink-0 items-center gap-0.5 border-b px-3 py-1.5 text-muted-foreground">
            {TOOLBAR.map((Icon, i) => (
              <span key={i} className="flex size-7 items-center justify-center rounded-md">
                <Icon className="size-4" />
              </span>
            ))}
          </div>

          {/* ── The memo ── */}
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 md:px-10">
            <div className="mx-auto max-w-[760px]">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pb-5">
                <Avatar className="size-6">
                  <AvatarImage src={author.avatarUrl} alt="" />
                  <AvatarFallback className="text-badge">
                    {author.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-caption text-foreground">{author.name}</span>
                <span className="text-caption text-muted-foreground">· {timestamp}</span>
                {copies.length > 0 && (
                  <>
                    <span className="text-caption text-muted-foreground">·</span>
                    <SignedCopiesTrigger
                      count={copies.length}
                      signers={uniqueSigners(copies)}
                      onClick={() => setCopiesOpen(true)}
                    />
                  </>
                )}
              </div>

              <Markdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
                {markdown}
              </Markdown>
            </div>
          </div>

          {/* ── Status line ── */}
          <div className="flex shrink-0 items-center gap-2 border-t px-4 py-2 text-caption text-muted-foreground">
            <Avatar className="size-5">
              <AvatarImage src={CURRENT_USER.avatar} alt="" />
              <AvatarFallback className="text-[9px]">{CURRENT_USER.initials}</AvatarFallback>
            </Avatar>
            <span className="ml-auto flex items-center gap-1.5">
              <Wifi className="size-3.5" />
              Saved
            </span>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── The flow ── */}
      <SignMemoDialog
        open={signOpen}
        onOpenChange={setSignOpen}
        memoTitle={title}
        memoMarkdown={markdown}
        signer={CURRENT_USER}
        onContinue={runHandoff}
      />
      {justSigned && (
        <MemoSignedDialog
          open
          onOpenChange={next => !next && setJustSigned(null)}
          memoTitle={title}
          copy={justSigned}
          onViewAll={() => {
            setJustSigned(null);
            setCopiesOpen(true);
          }}
        />
      )}
      <SignedCopiesDialog
        open={copiesOpen}
        onOpenChange={setCopiesOpen}
        copies={copies}
        cleverbaseLinked={cleverbaseLinked}
        currentUser={CURRENT_USER}
        onSign={() => {
          setCopiesOpen(false);
          setSignOpen(true);
        }}
      />

      {redirecting && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-3 bg-background/85 backdrop-blur-sm">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
          <p className="text-body text-muted-foreground">Taking you to Cleverbase…</p>
          <p className="text-caption text-muted-foreground">
            (Stood in for — the real flow leaves Alkemio and returns.)
          </p>
        </div>
      )}
    </>
  );
}

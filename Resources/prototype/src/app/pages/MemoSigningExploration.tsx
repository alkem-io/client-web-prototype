/**
 * MemoSigningExploration — the memo signing flow, before and after.
 *
 * Memos are not built in the prototype, so this page carries the whole feature:
 * the two screens from the screenshots rebuilt as they ship today, the three
 * screens proposed to replace them, and the placement question the ticket
 * raises about where the two buttons belong.
 *
 * Standalone route (`/memo-signing`), same shape as the other exploration pages.
 */
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  FileText,
  Loader2,
  MapPin,
  PartyPopper,
  ShieldCheck,
  SignpostBig,
} from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Separator } from "@/app/components/ui/separator";
import { Switch } from "@/app/components/ui/switch";
import { MemoSignedDialog } from "@/app/components/memo/MemoSignedDialog";
import { MemoSurfaceMock } from "@/app/components/memo/MemoSurfaceMock";
import { SignMemoDialog } from "@/app/components/memo/SignMemoDialog";
import { SignedCopiesDialog } from "@/app/components/memo/SignedCopiesDialog";
import { CurrentSignMemoDialog } from "@/app/components/memo/current/CurrentSignMemoDialog";
import { CurrentSignedCopiesDialog } from "@/app/components/memo/current/CurrentSignedCopiesDialog";
import { DEMO_COPIES, DEMO_SIGNERS } from "@/app/components/memo/signingData";

const MEMO_TITLE = "testing the signing flow";

/** What each screen is for, what is wrong with it today, what replaces it. */
const SCREENS = [
  {
    icon: Eye,
    tint: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    step: "Before",
    title: "Sign this memo",
    now: "A 768px modal with the PDF at 52% inside the browser's viewer, the same instruction printed twice, and a button naming a company it never explains.",
    next: "One wide dialog. The document takes the whole left side at a size where the browser opens it near 100%; the right rail says what pressing the button will do to you before you press it.",
  },
  {
    icon: PartyPopper,
    tint: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    step: "The return",
    title: "It's signed",
    now: "Nothing lands. The confirmation only turns up once the memo has been closed and reopened, so the moment you came back for happens off-screen.",
    next: "A one-shot celebration on return: the seal, the burst, and the copy you just made — shown with the same card the list uses, so the shape is already familiar next time.",
  },
  {
    icon: ShieldCheck,
    tint: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    step: "After",
    title: "Signed copies",
    now: "Lines of text, a machine timestamp, three identical ALL-CAPS buttons per row, and the verification result hidden behind the third one.",
    next: "Signed copies as things you can see: a page thumbnail with a seal, the signer's face, a date in words, and the verdict already on the card when the list opens.",
  },
];

const PRINCIPLES = [
  {
    icon: FileText,
    title: "The document gets the room",
    old: "715×480 of modal, of which the PDF got a 480px box — so the browser opened the page at 52% and the widest thing on screen was a toolbar of controls nobody needs here.",
    change:
      "The embed cannot be replaced — it is the browser's viewer, toolbar and all. What a bigger frame buys is the page opening near 100%, which turns the toolbar from the headline into a strip along the top.",
  },
  {
    icon: SignpostBig,
    title: "Say what the button does before it does it",
    old: "\"Continue to Cleverbase\" named a company, not an outcome. Nothing said you would leave Alkemio, be asked to prove your identity, and come back.",
    change:
      "Three steps in the settings pages' vocabulary — tinted chip, plain-word heading, one sentence each. Go, prove it's you, land back here. About a minute.",
  },
  {
    icon: CheckCircle2,
    title: "Answer the question the screen exists for",
    old: "Is this signature good? You could only find out by pressing VERIFY SIGNATURE on each row and reading a bare line of text underneath it.",
    change:
      "Every copy is checked as the list opens and the verdict is the first thing on the card — with one strip at the top for the answer most people came for: all of them check out.",
  },
  {
    icon: MapPin,
    title: "A fact is not a command",
    old: "Signed copies sat in the title bar as an outlined button beside Sign memo — a thing you can read about the document, dressed as a thing to do to it.",
    change:
      "It moves into the byline with the document's other facts, as a quiet text button with the signers' faces. Sign memo stays in the bar and stops competing.",
  },
  {
    icon: ShieldCheck,
    title: "Never hide the button from the people who haven't set it up",
    old: "No linked Cleverbase account meant no button — so the only people who could learn the feature exists were the ones who had already found it.",
    change:
      "Always shown when signing is on for the space. Without a linked account it is aria-disabled (still focusable, so keyboards reach the explanation) and carries a hover card with a link to the docs — a tooltip cannot hold a link.",
  },
];

/** The ticket, line by line, and where each item landed. */
const TICKET = [
  { item: "Success popup timing", status: "Anton", note: "Fixed separately; the design here assumes it fires on return from Cleverbase." },
  { item: "Make the success popup celebratory", status: "Done", note: "MemoSignedDialog — seal, one-shot burst, the copy you just made." },
  { item: "Signed versions button: placement and style", status: "Done", note: "Text button with signer faces, moved out of the command row into the byline." },
  { item: "Signed versions dialog styling", status: "Done", note: "SignedCopiesDialog — thumbnails, faces, verdict-first, dates in words." },
  { item: "Memo → PDF conversion styling", status: "Anton", note: "Out of scope here; the mock renders the PDF as it currently comes out." },
  { item: "Always show Sign when the feature is on", status: "Done", note: "SignMemoButton — aria-disabled state with a hover card linking the docs." },
];

export default function MemoSigningExploration() {
  const [linked, setLinked] = useState(true);
  const [copyCount, setCopyCount] = useState(3);
  const [withPanel, setWithPanel] = useState(false);

  const [signOpen, setSignOpen] = useState(false);
  const [currentSignOpen, setCurrentSignOpen] = useState(false);
  const [copiesOpen, setCopiesOpen] = useState(false);
  const [currentCopiesOpen, setCurrentCopiesOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const copies = DEMO_COPIES.slice(0, copyCount);
  const currentUser = DEMO_SIGNERS.jeroen;

  /**
   * Deep links, so a single screen can be sent to someone for review:
   * `?screen=sign|success|copies|current-sign|current-copies`, plus `linked=0`
   * and `copies=0|1|3` to land straight in a particular state.
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("linked") === "0") setLinked(false);
    const n = params.get("copies");
    if (n !== null && ["0", "1", "3"].includes(n)) setCopyCount(Number(n));
    if (params.get("panel") === "1") setWithPanel(true);
    switch (params.get("screen")) {
      case "sign": setSignOpen(true); break;
      case "success": setSuccessOpen(true); break;
      case "copies": setCopiesOpen(true); break;
      case "current-sign": setCurrentSignOpen(true); break;
      case "current-copies": setCurrentCopiesOpen(true); break;
    }
  }, []);

  /** Stands in for the round trip: leave, identify, come back signed. */
  const runHandoff = () => {
    setSignOpen(false);
    setRedirecting(true);
    setTimeout(() => {
      setRedirecting(false);
      setSuccessOpen(true);
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-[1100px] px-6 py-8">
          <Badge variant="secondary" className="mb-3">
            Exploration
          </Badge>
          <h1 className="text-page-title">Memo signing — before, moment, after</h1>
          <p className="mt-2 max-w-3xl text-body text-muted-foreground">
            Signing a memo means leaving Alkemio, proving who you are at Cleverbase, and coming
            back with a frozen PDF copy of a document that stays editable. Three of those four
            ideas are unusual, and the two screens that carry them currently explain none of it.
            This rebuilds both, and adds the one that is missing: the return.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button size="lg" className="gap-2" onClick={() => setSignOpen(true)}>
              Walk the proposed flow
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => setCurrentSignOpen(true)}>
              Open today's dialog
            </Button>
          </div>
          <p className="mt-3 text-caption text-muted-foreground">
            Continuing from the proposed dialog simulates the Cleverbase round trip and lands on
            the success screen.
          </p>
        </div>
      </header>

      {/* ── State the whole page runs on ── */}
      <div className="sticky top-0 z-20 border-b bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-x-8 gap-y-3 px-6 py-3">
          <div className="flex items-center gap-2.5">
            <Switch id="linked" checked={linked} onCheckedChange={setLinked} />
            <Label htmlFor="linked" className="text-caption">
              Cleverbase account linked
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-caption text-muted-foreground">Signed copies</span>
            {[0, 1, 3].map(n => (
              <Button
                key={n}
                variant={copyCount === n ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2.5"
                onClick={() => setCopyCount(n)}
              >
                {n}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2.5">
            <Switch id="panel" checked={withPanel} onCheckedChange={setWithPanel} />
            <Label htmlFor="panel" className="text-caption">
              Signatures rail
            </Label>
          </div>
          <p className="ml-auto hidden text-caption text-muted-foreground lg:block">
            Turn the link off to see the state the ticket asks for.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-[1100px] px-6 py-10">
        {/* ── The three screens ── */}
        <section className="space-y-6">
          <div>
            <h2 className="text-section-title">Three screens, one trip</h2>
            <p className="mt-1 text-body text-muted-foreground">
              Two exist and are being rebuilt. The middle one is new.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {SCREENS.map(screen => (
              <article key={screen.title} className="flex flex-col rounded-xl border bg-card p-5">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${screen.tint}`}
                  >
                    <screen.icon className="size-4.5" />
                  </span>
                  <div>
                    <p className="text-label uppercase text-muted-foreground">{screen.step}</p>
                    <h3 className="text-subsection-title">{screen.title}</h3>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <p className="text-label uppercase text-muted-foreground">Today</p>
                    <p className="mt-1 text-caption text-muted-foreground">{screen.now}</p>
                  </div>
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                    <p className="text-label uppercase text-primary">Proposed</p>
                    <p className="mt-1 text-caption">{screen.next}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 rounded-xl border bg-muted/20 p-4">
            <Button onClick={() => setSignOpen(true)}>Before — proposed</Button>
            <Button variant="outline" onClick={() => setCurrentSignOpen(true)}>
              Before — today
            </Button>
            <Separator orientation="vertical" className="mx-1 h-9" />
            <Button onClick={() => setSuccessOpen(true)}>The return — new</Button>
            <Separator orientation="vertical" className="mx-1 h-9" />
            <Button onClick={() => setCopiesOpen(true)}>After — proposed</Button>
            <Button variant="outline" onClick={() => setCurrentCopiesOpen(true)}>
              After — today
            </Button>
          </div>
        </section>

        <Separator className="my-10" />

        {/* ── Placement ── */}
        <section className="space-y-6">
          <div>
            <h2 className="text-section-title">Where the two buttons live</h2>
            <p className="mt-1 max-w-3xl text-body text-muted-foreground">
              The ticket asks whether Signed copies belongs above the post at all. It is a fact
              about the document, not a command — so it moves down to where the document's other
              facts already are, and stops being outlined. Sign memo keeps the bar to itself.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <p className="mb-2 text-label uppercase text-muted-foreground">Today</p>
              <MemoSurfaceMock
                title={MEMO_TITLE}
                author={currentUser}
                currentUser={currentUser}
                copies={copies}
                cleverbaseLinked={linked}
                placement="current"
                onSign={() => setCurrentSignOpen(true)}
                onOpenCopies={() => setCurrentCopiesOpen(true)}
              />
            </div>

            <div>
              <p className="mb-2 text-label uppercase text-primary">Proposed</p>
              <MemoSurfaceMock
                title={MEMO_TITLE}
                author={currentUser}
                currentUser={currentUser}
                copies={copies}
                cleverbaseLinked={linked}
                placement="proposed"
                withPanel={withPanel}
                onSign={() => setSignOpen(true)}
                onOpenCopies={() => setCopiesOpen(true)}
              />
              <p className="mt-2 text-caption text-muted-foreground">
                With the link switched off, Sign memo stays exactly where it is — greyed, still
                focusable, and carrying the reason plus a link to the documentation.
              </p>
            </div>
          </div>
        </section>

        <Separator className="my-10" />

        {/* ── The alternative ── */}
        <section className="space-y-4">
          <h2 className="text-section-title">The alternative: signatures as a rail</h2>
          <p className="max-w-3xl text-body text-muted-foreground">
            Switch on <span className="text-foreground">Signatures rail</span> above to put the
            list inside the memo instead of behind a dialog. It reads well — you see who stands
            behind the memo while you read it, and signing is one button away without leaving the
            page. It costs 320px of a reading surface, permanently, for something most readers
            check once. The dialog is the recommendation; this is here so the trade is visible
            rather than argued.
          </p>
        </section>

        <Separator className="my-10" />

        {/* ── Principles ── */}
        <section className="space-y-6">
          <div>
            <h2 className="text-section-title">What changes, and why</h2>
            <p className="mt-1 text-body text-muted-foreground">
              Five decisions, each against what ships today.
            </p>
          </div>

          <div className="space-y-4">
            {PRINCIPLES.map(principle => (
              <article key={principle.title} className="rounded-xl border bg-card p-5">
                <div className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground">
                    <principle.icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1 space-y-3">
                    <h3 className="text-subsection-title">{principle.title}</h3>
                    <div className="rounded-lg border bg-muted/30 p-3">
                      <p className="text-label uppercase text-muted-foreground">Today</p>
                      <p className="mt-1 text-body text-muted-foreground">{principle.old}</p>
                    </div>
                    <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <p className="text-body">{principle.change}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <Separator className="my-10" />

        {/* ── The ticket ── */}
        <section className="space-y-4">
          <h2 className="text-section-title">Against the ticket</h2>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[640px] border-collapse text-body">
              <thead>
                <tr className="border-b bg-muted/40 text-left">
                  <th className="px-4 py-2.5 text-label uppercase text-muted-foreground">Item</th>
                  <th className="px-4 py-2.5 text-label uppercase text-muted-foreground">Here</th>
                  <th className="px-4 py-2.5 text-label uppercase text-muted-foreground">Note</th>
                </tr>
              </thead>
              <tbody>
                {TICKET.map(row => (
                  <tr key={row.item} className="border-b last:border-0">
                    <td className="px-4 py-2.5">{row.item}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={row.status === "Done" ? "default" : "secondary"}>
                        {row.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-caption text-muted-foreground">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* ── Dialogs ── */}
      <SignMemoDialog
        open={signOpen}
        onOpenChange={setSignOpen}
        memoTitle={MEMO_TITLE}
        signer={currentUser}
        onContinue={runHandoff}
      />
      <CurrentSignMemoDialog open={currentSignOpen} onOpenChange={setCurrentSignOpen} />
      <MemoSignedDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        memoTitle={MEMO_TITLE}
        copy={DEMO_COPIES[0]}
        onViewAll={() => {
          setSuccessOpen(false);
          setCopiesOpen(true);
        }}
      />
      <SignedCopiesDialog
        open={copiesOpen}
        onOpenChange={setCopiesOpen}
        copies={copies}
        cleverbaseLinked={linked}
        currentUser={currentUser}
        onSign={() => {
          setCopiesOpen(false);
          setSignOpen(true);
        }}
      />
      <CurrentSignedCopiesDialog
        open={currentCopiesOpen}
        onOpenChange={setCurrentCopiesOpen}
        copies={copies.length ? copies : DEMO_COPIES.slice(0, 2)}
      />

      {/* The round trip, stood in for. */}
      {redirecting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-background/85 backdrop-blur-sm">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
          <p className="text-body text-muted-foreground">Taking you to Cleverbase…</p>
          <p className="text-caption text-muted-foreground">
            (Stood in for — the real flow leaves Alkemio and returns.)
          </p>
        </div>
      )}
    </div>
  );
}

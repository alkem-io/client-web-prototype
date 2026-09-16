/**
 * PostDialogExploration — side-by-side comparison page for the Create Post
 * dialog: the current chip-and-panel dialog next to a version cut along the
 * lines of the pre-redesign dialog.
 *
 * Standalone route (`/post-dialog`), same shape as the other exploration pages.
 */
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronsDownUp,
  CircleDot,
  LayoutPanelTop,
  Palette,
  PanelBottomOpen,
  SquareStack,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { AddPostModal } from "@/app/components/space/AddPostModal";
import { AddPostDialogCompact } from "@/app/components/space/post-dialog-compact/AddPostDialogCompact";

const PRINCIPLES = [
  {
    icon: Palette,
    title: "Borrowed tone: the space settings pages",
    old: "The old dialog was warmer than today's, but it was still MUI grey: notched outlines, ALL-CAPS buttons, no colour anywhere.",
    now: "Uppercase micro-labels, and option names — “Tasks”, “Form” — that mean nothing until you hover for a tooltip.",
    change:
      "The settings vocabulary, used with its own restraint: a tinted chip and a plain-word heading per *group*, one sentence of explanation, and a caption that names whatever option you are pointing at. Colour marks sections, never individual options — nine tinted tiles in a row was tried and read as noise.",
  },
  {
    icon: ChevronsDownUp,
    title: "Growth is bounded",
    old: "Choosing a collection type cost nothing: its settings opened elsewhere. The composer was the same height whether you added a whiteboard collection or nothing at all.",
    now: "Every choice expands a panel in place. Empty the current dialog is 625px of content; add a contributor block and a form and it is 1,359px, and 1,674px with More options open.",
    change:
      "Same journey, 1,330px — and picking a response type adds nothing at all, because its settings are a stacked dialog.",
  },
  {
    icon: CircleDot,
    title: "Radio groups, not chips",
    old: "A circle-and-label row with “None” selected by default. You could see it was a single choice, and that a choice had been made.",
    now: "Pill chips read as multi-select filters. Nothing communicates that picking Poll drops Whiteboard, and no state reads as “deliberately none”.",
    change:
      "One control in both places — OptionTiles, a Radix radio group with arrow-key roving, a real aria-checked state and “None” always first. Comments is a yes/no, so it is a switch row, the way the settings pages write every binary.",
  },
  {
    icon: SquareStack,
    title: "Settings open as a dialog",
    old: "“Collection Settings” opened stacked over the composer with its own Back / Save. The composer never changed height.",
    now: "Settings expand into a grey panel under the chip you just clicked. Choosing Form drops a whole questionnaire builder into the middle of the composer.",
    change:
      "CollectionSettingsDialog and AttachmentSettingsDialog — transactional, Back discards, Save commits. Picking a type costs zero vertical space.",
  },
  {
    icon: LayoutPanelTop,
    title: "A canvas, not a form",
    old: "Title* and Tags sat side by side in outlined fields — legible, but three boxes to fill in before you had written a word.",
    now: "Title is a borderless input styled like a heading, and tags are buried in “More options” where nobody finds them.",
    change:
      "One quiet writing surface: a title line that shows a hairline once it has content, the editor, and a “# Add tags” row underneath. Tags are back where you can reach them, and nothing around the words is boxed.",
  },
  {
    icon: PanelBottomOpen,
    title: "Content inline, configuration in a dialog",
    old: "A whiteboard preview appeared in the post body with Edit and delete on it; settings never did.",
    now: "Content and configuration both expand into the same grey panel, so a memo editor and a contributor query look alike.",
    change:
      "If picking it gives you something to write (memo, media, document, whiteboard), you author it inline. If it gives you something to configure (poll, action, contributors, subspaces), the form opens stacked.",
  },
];

/** Body scroll heights, Chrome 1440×900, same path walked in both dialogs. */
const MEASUREMENTS = [
  { state: "Empty", now: "625px", next: "690px" },
  { state: "+ Contributors in the body", now: "988px", next: "884px" },
  { state: "+ Form response type", now: "1,359px", next: "1,212px" },
  { state: "+ everything else open", now: "1,674px", next: "1,330px" },
];

const NOT_RESTORED = [
  "ALL-CAPS button labels — the button system defines its own casing.",
  "Borders around every group; cards carry the grouping now.",
  "A collapsed section that hides its own state — the header subtitle says what is inside it.",
  "Tooltips as the only place an option is explained.",
  "Colour on individual options — it belongs to sections, as on the settings pages.",
  "The old three-option ceiling. All nine attachments and seven response types are still offered.",
];

export default function PostDialogExploration() {
  const [compactOpen, setCompactOpen] = useState(false);
  const [currentOpen, setCurrentOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-[1100px] px-6 py-8">
          <Badge variant="secondary" className="mb-3">
            Exploration
          </Badge>
          <h1 className="text-page-title">Create Post — progressive disclosure</h1>
          <p className="mt-2 max-w-3xl text-body text-muted-foreground">
            The pre-redesign posting dialog was easier to digest than the one we have now, and not
            because it did less: it disclosed less at once. This explores what the current dialog
            looks like when it is re-cut along those lines — same components, same tokens, same
            capabilities, different disclosure strategy.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button size="lg" className="gap-2" onClick={() => setCompactOpen(true)}>
              Open the proposal
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => setCurrentOpen(true)}>
              Open the current dialog
            </Button>
          </div>
          <p className="mt-3 text-caption text-muted-foreground">
            Open both empty and they look comparable. Pick Form in each — that is where they
            diverge.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-6 py-10">
        <section className="space-y-6">
          <div>
            <h2 className="text-section-title">What the old dialog got right</h2>
            <p className="mt-1 text-body text-muted-foreground">
              Five strategies, each mapped to what it becomes on the current design system.
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
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-lg border bg-muted/30 p-3">
                        <p className="text-label uppercase text-muted-foreground">Old dialog</p>
                        <p className="mt-1 text-body text-muted-foreground">{principle.old}</p>
                      </div>
                      <div className="rounded-lg border bg-muted/30 p-3">
                        <p className="text-label uppercase text-muted-foreground">Today</p>
                        <p className="mt-1 text-body text-muted-foreground">{principle.now}</p>
                      </div>
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

        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-section-title">Default state, in order</h2>
            <ol className="space-y-2 text-body text-muted-foreground">
              {[
                "Title* and Tags — one row, labelled, framed",
                "Description — rich text, 180px",
                "Add something to it — nine neutral tiles, None selected, caption under the row",
                "Link to something else — one quiet ghost button",
                "How people can respond — collapsed, with its state in the subtitle",
                "Post — Save as Draft appears once there is something to save",
              ].map((item, index) => (
                <li key={item} className="flex gap-3">
                  <span className="w-4 shrink-0 text-caption tabular-nums">{index + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-3">
            <h2 className="text-section-title">Not brought back</h2>
            <ul className="space-y-2 text-body text-muted-foreground">
              {NOT_RESTORED.map(item => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Separator className="my-10" />

        <section className="space-y-4">
          <div>
            <h2 className="text-section-title">Measured, not estimated</h2>
            <p className="mt-1 text-body text-muted-foreground">
              Scroll height of the dialog body in Chrome at 1440×900, walking the same path in
              both: empty → add a contributor block → add a form collection → open everything
              that is left.
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[560px] border-collapse text-body">
              <thead>
                <tr className="border-b bg-muted/40 text-left">
                  <th className="px-4 py-2.5 text-label uppercase text-muted-foreground">State</th>
                  <th className="px-4 py-2.5 text-label uppercase text-muted-foreground">Today</th>
                  <th className="px-4 py-2.5 text-label uppercase text-muted-foreground">
                    Proposal
                  </th>
                </tr>
              </thead>
              <tbody>
                {MEASUREMENTS.map(row => (
                  <tr key={row.state} className="border-b last:border-0">
                    <td className="px-4 py-2.5">{row.state}</td>
                    <td className="px-4 py-2.5 tabular-nums text-muted-foreground">{row.now}</td>
                    <td className="px-4 py-2.5 tabular-nums font-medium">{row.next}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-caption text-muted-foreground">
            The tone costs something: section headers that explain themselves run 65px more than
            today's empty dialog. Everything after that is cheaper — the fully-loaded post is 344px
            shorter, and choosing Form still never drops a questionnaire builder into the composer.
          </p>
        </section>

        <Separator className="my-10" />

        <section className="space-y-3">
          <h2 className="text-section-title">Open questions</h2>
          <ul className="space-y-2 text-body text-muted-foreground">
            <li className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
              <span>
                Nine attachment tiles is a lot for one row. Worth testing whether the four rare ones
                (Document, Action, Contributors, Subspaces) belong behind a “More” tile.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
              <span>
                Picking a configuration-first type opens its settings dialog immediately. That is
                fast when you meant it and abrupt when you were browsing — the alternative is a
                Settings button on the preview card only.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
              <span>
                Response options collapsed by default assumes most posts are plain posts. If the
                data says otherwise, the bar should open pre-expanded for space admins.
              </span>
            </li>
          </ul>
        </section>
      </main>

      <AddPostDialogCompact open={compactOpen} onOpenChange={setCompactOpen} />
      <AddPostModal open={currentOpen} onOpenChange={setCurrentOpen} />
    </div>
  );
}

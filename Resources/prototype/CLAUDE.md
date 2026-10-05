# client-web-prototype

Design prototype for [Alkemio client-web](https://github.com/alkem-io/client-web).

## The one rule

**`src/crd/` is production. Never edit it.**

It is a byte-identical copy of client-web's `src/crd/` design system, pinned to
a commit recorded in [`src/crd/PROVENANCE.md`](src/crd/PROVENANCE.md). Every
primitive, design token, typography token and shared component comes from there.

If a CRD component needs to change, **the change belongs in client-web** and
arrives here on the next sync. Editing `src/crd/` locally recreates exactly the
prototype↔production drift this setup exists to remove.

```
src/crd/     ← production, read-only, synced        (the design system)
src/app/     ← prototype explorations, yours to edit (the design work)
src/ahead/   ← what we have and production does not  (the dev agenda)
src/mockups/ ← visual artifacts, committed           (a picture of the idea)
```

`src/app/` imports from `@/crd/*`. Never the reverse.

## Syncing with production

```bash
npm run sync:crd:check   # what changed upstream? (changes nothing)
npm run sync:crd         # pull it in, then `npm run build`
```

A build failure after a sync is the *point*: it tells you a CRD API changed and
prototype code needs updating. Fix the prototype, not the vendored layer.

**A green build is not the end of a sync.** Both commands print an
*ahead-of-production* report at the end. Read it — see the next section. A sync
that pulls in a component we already built ourselves and leaves both in place is
a sync that made the drift worse, and the build will not tell you.

## Which component do I use?

1. **Does `src/crd/` have it, and does the prototype have no deliberate new
   design for it?** Use production's. It wins — including where you would have
   styled it differently. Disagreements get resolved in client-web so both move
   together.
2. **Is the prototype deliberately *ahead* of production here?** Then the
   prototype's version stays. It adopts production's primitives, tokens,
   typography and libraries — but keeps its own design, because being ahead is
   the entire point of this repo. Do **not** replace it with production's.
3. **Is it a new exploration?** Build it in `src/app/`, composed from
   `@/crd/primitives/*` and CRD tokens. Then it is ready for dev to port across
   with no translation step.
4. **Never** copy a CRD component into `src/app/` to tweak it.

> **The distinction in rule 1 vs 2 matters, and it is easy to get wrong.**
> "Production wins" settles *styling disagreements about the same thing*. It
> does **not** mean "delete prototype work that production hasn't caught up to
> yet". A component existing in both trees is not sufficient evidence that they
> solve the same problem — check what the prototype's version does that
> production's does not before replacing anything.
>
> This was got wrong once: the Space/Subspace Settings → Layout tab was
> replaced with production's `SpaceSettingsLayoutView`, discarding the tab-icon
> picker, the sidebar mode (expanded / railed / hidden), the `tags` widget and
> the per-tab widget editor — none of which production has. It was restored
> from `main` and rebased. A future sync agent must apply rule 2, not rule 1,
> to any surface where the prototype leads.

> **Second trap, same shape: the space search box.**
> `SpaceSubspacesList` ships with its own search field, which looks like proof
> that production searches each section separately. It is not. Production uses
> that component in exactly two places — embedded as a callout body, and inside
> a dialog with `disableFilters` — never as a standalone tab.
>
> The real model is in client-web's `CrdSpaceTabPage`: the **tab page** owns
> `searchText` + `tagsFilter`, passes them to the sidebar's `SearchSection`
> widget, and uses them to filter that tab's callouts. One box, in the sidebar,
> filtering the page — which is exactly what the prototype's `FilterContext`
> already does. Do not "fix" it into per-section search boxes; that was tried on
> 2026-09-24 and reverted, and the tell is tabs rendering two or three search
> fields.

`src/app/components/ui/` holds the 19 primitives the prototype has and
production does not (sidebar, command, drawer, form, chart, hover-card,
placeholder-card, …). They are fair game to edit — and they are also the
shortlist of what to upstream next.

## How work runs here

Jeroen is the **designer** on this project, not a developer. He describes what he
wants in words; everything else is yours to do. He does not run git commands and
should not be asked to. Whichever assistant you are — Copilot, Claude Code, or
Claude running inside Copilot — these apply.

1. **Catch up with production first.** Run `npm run sync:crd` when a new piece of
   work starts, before building anything, and read the report it prints. This is
   the one step here that happens without being asked — he should not have to
   remember it. Designing against a month-old copy of the design system is how
   the same component gets built twice.
2. **Start a branch before editing anything.** One per piece of work, named after
   the work. Never build on `main`. **Exploratory work gets a branch too** — a
   visual artifact is a real file, so there is no version of "just looking" that
   leaves the repo untouched. Say the branch name back in one line.
3. **Commit as you go**, with messages that say what changed and why. He does not
   make commits; you do. Commit each adjustment rather than batching them up —
   that history is what makes "the one before you changed the card layout"
   something he can actually ask for.
4. **Push only when he wants someone else to see it** — then give him the link.
5. **Never merge to `main` unless he says it is ready.** That call is his. Merging
   means the design is ready for a developer to build in client-web — not that a
   developer has built it.
6. **Tell him where to look**, with a link and what to look at. "The build passes"
   is not a result he can check.
7. When you propose ahead-of-production work, **name `src/ahead/` explicitly**, so
   it is visible that the rule was applied rather than guessed at.

**Expect to go round several times.** Most of his time on a piece of work goes on
looking at it and saying what is wrong. That loop is the process working, not
evidence the brief was poor — do not try to shortcut it by building further ahead
than he asked for.

**Write for a designer.** No `HEAD`, no "the index", no "upstream", no "rebase".
Say what happened in plain words. If a sentence would need a second sentence to
explain it, it is the wrong sentence.

**One assistant at a time in a folder.** A working copy has one branch, one set of
files. Two assistants in the same folder will overwrite each other's work without
either noticing. For parallel work, use a separate git worktree per assistant.

### Two kinds of work

Work arrives as one of two kinds, and they do not start the same way. Ask which
it is, or infer it and say which you assumed.

**Concrete** — *"we need this feature, and this is how it works."* Build it.

**Exploratory** — *"let's see what this could even be."* Do not start building the
real thing. Make a **visual artifact** first, iterate on that, and build only once
the scope has stopped moving. Work of this kind here: the invitation flow, the
create-space flow — built as `CreateSpaceDialogV2` and `V3`, so the iteration is
still visible in the names.

A visual artifact is **a real file in this repo**, not an image rendered into the
conversation:

```bash
npm run mockup:new     # scaffold one
npm run mockup:dev     # look at it
npm run mockup:check   # check it
npm run mockup:build   # export an image to send someone
```

They live in [`src/mockups/`](src/mockups/) as compositions, and they are
committed on the branch like any other work — which is the reason exploratory work
needs a branch at all.

**Say which kind of thing you are handing him.** A keepable artifact and a
throwaway screenshot for this conversation only are both reasonable answers to
"show me"; which one he got should never be left implied. He has had to ask.

**Once the artifact settles, the artifact and the conversation around it are the
brief.** Do not make him re-describe in words what the artifact already shows.

**Not in scope is a finished outcome.** An exploration that is not going ahead
goes to the *icebox*: leave the branch unmerged and leave it alone. Do not delete
the branch, and do not fold the artifact into `main` to tidy up. Some sit for
months, some are never picked up again, and both are fine.

[`WORKFLOW.excalidraw`](WORKFLOW.excalidraw) is the picture of all of this,
written for him rather than for you.

## When the prototype is ahead

Being ahead is the point of this repo. The failure mode is what happens *after*
production catches up: two versions of the same screen, both maintained, neither
known to be a duplicate. Nobody notices, because noticing depends on remembering
— so it is not remembered here, it is reported.

**Where ahead-of-production work goes:**

| It is… | It lives in… |
|---|---|
| A new reusable component production should eventually own | `src/ahead/`, with a header comment saying what and why |
| A primitive production has no equivalent of | `src/app/components/ui/` |
| A whole page, flow or tab set — too big to move | wherever it already lives, listed in [`src/ahead/watchlist.json`](src/ahead/watchlist.json) |
| An exploration that is not meant to be upstreamed | `src/app/`, as normal |

`src/ahead/` is read by the dev team as an agenda, so keep it to that: no pages,
no mock data, no wrappers around things production already has. Past ten or so
entries it has stopped being a list of decisions and become a parking lot.

**The duty on every sync.** `npm run sync:crd` ends with the ahead-of-production
report: a name match upstream for anything in `src/ahead/` or
`src/app/components/ui/`, and for each watchlist surface, how many of its parts
now exist upstream — `[ ]` still ours, `[~]` production started it, `[!]`
production has it. If anything is flagged, say so and work it through; do not
report a sync as clean because the build passed.

**Graduating one.** Delete ours, repoint the imports to `@/crd/…`, verify in the
browser (a green build does not mean it renders), and record it in the "Recently
graduated" table in [`src/ahead/README.md`](src/ahead/README.md).

Two things this does *not* mean:

- **Graduation is not automatic.** Rule 2 above still applies: check what ours
  does that production's does not. Adopting CRD's `ContributorCollection` today
  would cost the hover cards, so it is deliberately on hold — recorded as a
  decision, with the upstream ask that would unblock it. "Noticed and held" is a
  valid outcome. "Not noticed" is the one to prevent.
- **Graduation usually costs something**, and that cost is the next thing to ask
  production for. `ExpandedSpaceCard` has nowhere to put an `ActivityDot`. Write
  the ask down in `src/ahead/README.md` rather than quietly accepting the loss.

Measured at `cc126d7a`: production has built **every settings tab the prototype
has** — space 9/9, subspace 5/5, user 6/6, organisation 4/4, packs 2/2. Settings
are no longer ahead; they are two complete designs of the same screens that have
never been compared. **Do not convert them** — that comparison is a design
decision for the dev session, not a mechanical swap.

## Typography

Use the semantic tokens, never raw Tailwind size+weight combos. The full table
is in [`src/crd/CLAUDE.md`](src/crd/CLAUDE.md) Golden Rule #8 — that document is
the design system's own rulebook and applies here in full.

```tsx
<h1 className="text-page-title">…</h1>     // not text-2xl font-bold
<p className="text-body">…</p>             // not text-sm
<span className="text-caption">…</span>    // not text-xs
```

Two things worth knowing:

- **`text-control` uppercases.** Production's buttons, tabs, menu rows and
  select triggers render UPPERCASE (12px/500). The CRD `Button` applies it
  itself — do not add a size class to a `<Button>`, it overrides the token and
  silently drops the uppercase. Production's own docs say 14px; the CSS says
  12px and the CSS is what renders.
- **`text-hero`, `text-display`, `text-subheader`, `text-sidebar-label` are not
  registered in production's `cn()`.** Combined with a text colour they get
  dropped entirely. See [`UPSTREAM-BUGS.md`](UPSTREAM-BUGS.md).

## Stack

Matched to client-web exactly, so copied components run unmodified.

| | |
|---|---|
| React | 19.2.1 |
| Vite | 7 |
| Tailwind | 4 |
| Radix + shadcn/ui | via `@/crd/primitives` |
| Icons | `lucide-react` 1.x |
| Drag & drop | `@dnd-kit` |
| Markdown editor | TipTap (`@/crd/forms/markdown/MarkdownEditor`) |
| i18n | `react-i18next`, `crd-*` namespaces, 27 namespaces × 6 languages |

Not available, deliberately: MUI, Emotion, react-quill, react-dnd. They were
removed to match production and must not come back.

## Running

```bash
npm install
npm run dev        # prototype, on http://localhost:5180
npm run build      # must stay green
npm run typecheck
```

The port is pinned (`strictPort`) because another project on this machine takes
Vite's default 5173, and a stale tab there has been read as a regression here
twice. If `npm run dev` fails on the port, something else is using 5180 — find
it rather than switching ports.

**Verify in the browser, not just in the build.** A green build has repeatedly
hidden broken rendering here: a missing slot, a component that throws on mount,
a page that reads "Page Not Found". Screenshot the screen you changed.

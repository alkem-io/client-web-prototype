---
applyTo: "Resources/[Pp]rototype/**"
---

# Alkemio design prototype — the rules that are not negotiable

The full version of this is [`Resources/prototype/CLAUDE.md`](../../Resources/prototype/CLAUDE.md).
It is the canonical file despite the name — any AI tool working in this folder
should read it. If this summary ever disagrees with it, **that file wins.**

## 0. How work runs here — read this first

Jeroen is the **designer**, not a developer. He describes what he wants in words;
everything else is yours. He does not run git commands.

1. **Start a branch before editing anything.** One per piece of work. Never build
   on `main`. Say the branch name back in one line.
2. **Commit as you go**, with messages saying what changed and why. He does not
   make commits; you do.
3. **Push only when he wants someone else to see it**, and give him the link.
4. **Never merge to `main` unless he says it is ready.**
5. **Tell him where to look** — a link and what to look at. "The build passes" is
   not something he can check.
6. Proposing ahead-of-production work? **Name `src/ahead/` out loud.**

**Write for a designer.** No `HEAD`, no "the index", no "upstream", no "rebase".
Plain words for what actually happened.

**One assistant at a time per folder** — a working copy has one branch and one set
of files, and two assistants will overwrite each other silently. Use a separate
git worktree for parallel work.

## 1. `src/crd/` is production. Never edit it.

It is a byte-identical copy of [client-web](https://github.com/alkem-io/client-web)'s
design system, pinned to a commit in `src/crd/PROVENANCE.md`. A change to a CRD
component belongs in client-web and arrives here via `npm run sync:crd`. Editing
it locally recreates the exact prototype↔production drift this setup exists to
remove.

```
src/crd/   ← production, read-only, synced        (the design system)
src/app/   ← prototype explorations, yours to edit (the design work)
src/ahead/ ← what we have and production does not  (the dev agenda)
```

`src/app/` imports from `@/crd/*`. Never the reverse. Never copy a CRD component
into `src/app/` to tweak it.

## 2. Do not delete prototype work just because production has something similar

"Production wins" settles *styling disagreements about the same thing*. It does
**not** mean replacing work production has not caught up to yet. A component
existing in both trees is not evidence they solve the same problem — check what
ours does that theirs does not, first. This was got wrong once and cost the
Settings → Layout tab's icon picker, sidebar modes and per-tab widget editor.

## 3. A green build is not the end of a sync

`npm run sync:crd` ends by printing an ahead-of-production report: components in
`src/ahead/` or `src/app/components/ui/` whose name now exists upstream, and for
each surface in `src/ahead/watchlist.json`, how many of its parts production has
built — `[ ]` still ours, `[~]` started, `[!]` production has it. Read it. A sync
that pulls in a component we already built ourselves and leaves both in place
has made the drift worse, and the build will not tell you.

Graduating one: delete ours, repoint imports to `@/crd/…`, verify in the browser,
record it in `src/ahead/README.md`. It is not automatic — "noticed and held, for
this reason" is a valid outcome. Not noticing is the one to prevent.

## 4. Do not convert the settings pages

Production has built every settings tab the prototype has (space 9/9, subspace
5/5, user 6/6, organisation 4/4, packs 2/2). They are two complete designs of the
same screens that have never been compared. That comparison is a design decision,
not a mechanical swap.

## 5. Verify in the browser

`npm run dev` serves on **5180** (pinned — another project here takes 5173). A
green build has repeatedly hidden broken rendering in this repo: a missing slot,
a component throwing on mount, a page reading "Page Not Found". Screenshot what
you changed.

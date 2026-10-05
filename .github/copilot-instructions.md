# client-web-prototype

This repository holds more than one thing. Work out which one you are in before
following any convention you find here.

| Path | What it is |
|---|---|
| `Resources/prototype/` | **The Alkemio design prototype.** Almost all active work. Has its own rules — see below. |
| `Resources/` (rest) | Design briefs, analyses and mockups supporting that work |
| `specs/`, `.specify/` | Spec Kit feature specs |

## Working in `Resources/prototype/`

Read [`Resources/prototype/CLAUDE.md`](../Resources/prototype/CLAUDE.md) first.
It is the canonical guide despite the name — it is for any AI tool, not just
Claude. A short version of the non-negotiables is in
[`.github/instructions/prototype.instructions.md`](instructions/prototype.instructions.md),
which applies automatically to files under that path.

The one that matters most, because it is the easiest to break by accident:

> **`Resources/prototype/src/crd/` is a read-only copy of production's design
> system. Never edit it.** Changes belong in
> [client-web](https://github.com/alkem-io/client-web) and arrive here via
> `npm run sync:crd`.

## How work runs here

Jeroen is the designer, not a developer. **Start a branch before editing
anything, commit as you go, and never merge to `main` unless he says it is
ready.** He does not run git commands. Write for a designer — plain words, no git
vocabulary. Full version in
[`Resources/prototype/CLAUDE.md`](../Resources/prototype/CLAUDE.md), section
"How work runs here".

## Keeping these files honest

`CLAUDE.md` is the source. The files in `.github/` are deliberately short
summaries that point at it, rather than copies — this project exists to remove
drift between duplicated things, and these instruction files are not exempt. If
you change a rule, change it in `CLAUDE.md`, and only update the summaries if the
*non-negotiables* changed.

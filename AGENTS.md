# AGENTS.md

Conventions for any AI coding agent working in this repository — Copilot, Codex,
Cursor, Claude Code, or otherwise.

This repository holds more than one project. Almost all active work is the
**Alkemio design prototype** in [`Resources/prototype/`](Resources/prototype/),
which has its own rules.

**Read [`Resources/prototype/CLAUDE.md`](Resources/prototype/CLAUDE.md) before
changing anything in there.** It is the canonical guide despite the name — it is
written for any tool, not just Claude. Everything else (this file,
`.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`) is a
summary that points at it. If a summary disagrees with it, that file wins.

The three that are easiest to break by accident:

1. **`Resources/prototype/src/crd/` is production, read-only.** A byte-identical
   copy of [client-web](https://github.com/alkem-io/client-web)'s design system.
   Fixes belong in client-web and arrive via `npm run sync:crd`. Never edit it,
   and never copy a component out of it to tweak.
2. **Do not delete prototype work because production has something similar.**
   Being ahead of production is the point of the repo. Check what ours does that
   theirs does not, before replacing anything.
3. **A green build is not the end of a sync.** `npm run sync:crd` prints an
   ahead-of-production report at the end, listing anything production has now
   built that we still maintain our own copy of. Read it and act on it.

Full detail, including where ahead-of-production work lives and how it graduates:
`Resources/prototype/CLAUDE.md`.

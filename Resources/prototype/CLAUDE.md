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
src/mockups/ ← Figma Make mockup pipeline
```

`src/app/` imports from `@/crd/*`. Never the reverse.

## Syncing with production

```bash
npm run sync:crd:check   # what changed upstream? (changes nothing)
npm run sync:crd         # pull it in, then `npm run build`
```

A build failure after a sync is the *point*: it tells you a CRD API changed and
prototype code needs updating. Fix the prototype, not the vendored layer.

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

`src/app/components/ui/` holds the 19 primitives the prototype has and
production does not (sidebar, command, drawer, form, chart, hover-card,
placeholder-card, …). They are fair game to edit — and they are also the
shortlist of what to upstream next.

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
npm run dev        # prototype
npm run build      # must stay green
npm run typecheck
```

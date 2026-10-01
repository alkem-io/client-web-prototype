# Vendored from client-web — DO NOT EDIT

`client-web-index.css` is a byte-identical copy of **`src/index.css`** from
https://github.com/alkem-io/client-web (branch `develop`).

## Why this exists separately from `src/crd/`

The CRD design system is only half of what production renders. The other half
is this global app stylesheet, which lives *outside* `src/crd/` and therefore
was not picked up when the design system was vendored. It carries:

- `scrollbar-gutter: stable` on `<html>` — reserves the scrollbar track, which
  makes production's usable page width ~15px narrower than a naive copy. Every
  grid, card and column inherits that difference.
- Custom scrollbar width and colours.
- `html body[data-scroll-locked] { margin-right: 0 }` — stops the page shifting
  sideways whenever a Radix dialog, sheet, or dropdown opens.
- `#root { height:100%; display:flex; flex-direction:column }`.
- `.markdown` / `.tiptap` typography — Source Sans Pro at 12–14px with
  `letter-spacing: 0.13px`. This governs **all rendered markdown and the whole
  editor surface**, and is not expressible through CRD tokens.

Load order matters: client-web imports `crd.css` first, then this file, so this
one wins where they overlap (`src/index.tsx`).

Synced by `npm run sync:crd` alongside `src/crd/`.

# Vendored from client-web — DO NOT EDIT BY HAND

This folder is a **byte-identical copy** of `src/crd/` from the Alkemio
production client, and is the **single source of truth** for components,
primitives and design tokens in this prototype.

| | |
|---|---|
| Source repo | https://github.com/alkem-io/client-web |
| Branch | `develop` |
| Commit | `90ae07ff70c373d177574471f20885802397d5e7` |
| Commit date | 2026-09-21 09:47:49 +0300 |
| Vendored on | 2026-09-21 |
| Files | 881 |

## Rules

1. **Never edit anything in this folder.** If a CRD component needs to change,
   the change belongs in client-web and comes back here on the next sync.
   Editing here silently recreates the drift this migration removed.
2. **Production wins on every conflict**, including choices the prototype used
   to make differently (uppercase `.text-control`, the navy dark palette,
   `--input` matching `--border`).
3. Prototype-only exploration lives in `src/app/`, imports from `@/crd/*`,
   and never the other way round.

## A second vendored file

`src/crd/` is only half of what production renders. The global app stylesheet
(`src/index.css` in client-web) lives outside it and is vendored separately at
**`src/vendor/client-web-index.css`** — see that folder's README. It supplies
the reserved scrollbar gutter (which determines the real page width), the
scroll-lock compensation, `#root` layout, and all `.markdown` / `.tiptap`
typography. `npm run sync:crd` keeps both in step.

## Re-syncing

```bash
git clone --depth 1 --branch develop --filter=blob:none --sparse \
  https://github.com/alkem-io/client-web.git /tmp/cw-src
cd /tmp/cw-src && git sparse-checkout set src/crd
rsync -a --delete /tmp/cw-src/src/crd/ <prototype>/src/crd/
# then update the commit SHA in this file
```

Diff before overwriting to see what production changed:
`diff -rq /tmp/cw-src/src/crd <prototype>/src/crd`

## Known deviations from a clean standalone build

- `*.test.tsx` / `*.spec.tsx` / `__mocks__` are kept so the folder stays
  byte-identical for diffing, but they import `@/main/test/testUtils` and
  `@/core/i18n/config`, which do not exist here. They are excluded in
  `tsconfig.json` and are never reachable from `main.tsx`, so they do not
  affect the build.
- Everything else in this folder is self-contained: the only cross-layer
  imports in non-test code are none.

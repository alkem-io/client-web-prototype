# Bugs found in client-web while aligning the prototype

Defects in `src/crd/` surfaced during the prototype work
(first batch 2026-09-21, against `develop@90ae07ff`). They affect **production**, not just
the prototype. None is fixed here — `src/crd/` is vendored read-only — so
each needs a client-web PR.

---

## 1. Inter is declared but never loaded

**Severity:** every CRD page renders in the wrong typeface.

`src/crd/styles/crd.css` and `theme.css` set the CRD font stack to Inter:

```css
.crd-root {
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif, …;
}
```

But `index.html` only preloads **Montserrat** and **Source Sans Pro**:

```html
<link href="https://fonts.googleapis.com/css2?family=Montserrat:…&family=Source+Sans+Pro:…" rel="stylesheet" …>
```

Inter is never downloaded, so every CRD surface silently falls through to
`ui-sans-serif` / `system-ui` — SF Pro on macOS, Segoe UI on Windows. The
typography tokens were metric-tuned for Inter (the `-0.025em` tracking on
`--text-display` / `--text-hero` in particular), so the intended rhythm is not
what ships.

**Fix** — add Inter to `index.html` alongside the existing two:

```html
<link rel="preload" as="style"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap">
<link rel="stylesheet" media="print" onload="this.media='all'"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap">
```

The weights matter: `typography.css` uses 400/500/600/700, and `font-light`
(300) / `font-extrabold` (800) appear in components.

**Decide first:** is Inter actually intended? If the design direction is
Source Sans Pro, then `crd.css` is wrong instead and should say so. Right now
the CSS and the font loading disagree, and the CSS is losing silently.

### Measured on live production, 2026-09-21

Verified against `https://alkem.io/home` in Chrome on macOS, signed in. The
same string rendered at 14px/400 through the real CSS stack
(`Inter, ui-sans-serif, system-ui, sans-serif`):

| | width | using Inter? | loaded Inter faces |
|---|---|---|---|
| production `alkem.io/home` | **307.78px** | **no** | **0** |
| system-ui alone (control) | 307.78px | — | — |
| prototype (loads Inter) | 316.97px | yes | 3 |

Production renders **identically to `system-ui`** — i.e. SF Pro on macOS,
Segoe UI on Windows. `document.fonts` registers zero Inter faces. The platform
has never shipped the typeface its design system specifies.

Note for whoever verifies this: `document.fonts.check('14px Inter')` returns
`true` on production, which looks like Inter is present. It is not — Chrome
returns `true` for a font it cannot find, because no matching face is pending.
Measure a rendered width against a `system-ui` control instead; that is what
the numbers above do.

**Impact:** every Alkemio user sees a different typeface from the one the
design system specifies, and a different one on macOS vs Windows. The
typography tokens' tracking (`-0.025em` on `--text-display` / `--text-hero`)
was tuned for Inter's metrics, so hero headings are mistracked as well.

---

## 2. Four typography tokens are dropped whenever combined with a text colour

**Severity:** hero and section headings render at inherited body size.

`src/crd/lib/utils.ts` registers CRD's typography tokens with `tailwind-merge`
so they are treated as font sizes rather than colours — but the list is missing
four of the fourteen tokens defined in `typography.css`:

```ts
const CRD_TYPOGRAPHY_TOKENS = [
  'page-title', 'section-title', 'subsection-title', 'card-title',
  'body', 'body-emphasis', 'control', 'caption', 'label', 'badge',
] as const;
// missing: display, hero, subheader, sidebar-label
```

An unregistered `text-*` token is classified as a **text colour**, so it lands
in the same conflict group as `text-foreground` / `text-muted-foreground` and
the later class wins. Verified against the installed `tailwind-merge`:

```
cn('text-hero', 'text-foreground')              => 'text-foreground'          ← text-hero DROPPED
cn('text-display', 'text-muted-foreground')     => 'text-muted-foreground'    ← text-display DROPPED
cn('text-subheader', 'text-destructive')        => 'text-destructive'         ← text-subheader DROPPED
cn('text-sidebar-label', 'text-muted-foreground')=> 'text-muted-foreground'   ← text-sidebar-label DROPPED
cn('text-page-title', 'text-foreground')        => 'text-page-title text-foreground'   ✓ (registered)
cn('text-body', 'text-muted-foreground')        => 'text-body text-muted-foreground'   ✓ (registered)
```

The file's own doc comment predicts this — *"When the dropped class happens to
be the color, the text becomes invisible"* — and then the list omits four
tokens. In practice the size is what gets dropped, so profile/space/user/org
hero headings fall back to inherited size rather than `clamp(22px, 3vw, 32px)`.

**Fix** — complete the list:

```ts
const CRD_TYPOGRAPHY_TOKENS = [
  'display',
  'hero',
  'page-title',
  'section-title',
  'subsection-title',
  'subheader',
  'card-title',
  'body',
  'body-emphasis',
  'control',
  'caption',
  'label',
  'sidebar-label',
  'badge',
] as const;
```

That is the full set from `typography.css`. Worth adding a unit test asserting
every `--text-*` token in `typography.css` appears in this array, so the two
cannot drift again.

> Note: the prototype's pre-migration `cn()` registered 13 of the 14 (it had
> everything except a `display`/`hero` gap) — this regression was introduced
> when the helper was ported into `src/crd/`.

---

## 3. `text-control` is documented as 14px but is 12px

**Severity:** documentation only — but it misleads anyone following the
migration table.

Three places disagree about the size of `text-control`:

| Source | Says |
|---|---|
| `src/crd/styles/typography.css` → `--text-control` | **12px** ← what actually renders |
| its own inline comment: *"Same size as body, medium weight"* | 14px (body is 14px) |
| `src/crd/CLAUDE.md` Golden Rule #8 table | 14px |

Verified in a browser: a CRD `<Button>` computes to `font-size: 12px`,
`font-weight: 500`, `text-transform: uppercase`.

**Fix** — decide which is intended, then make all three agree. If 12px is
correct, drop "Same size as body" from the comment and change the CLAUDE.md
table row to 12px. If 14px is correct, change the token — but note that will
resize every button, tab, menu row and select trigger in the product.

---

## 4. Memo and document framing previews are too small in the space feed

**Severity:** UX. On a post with an attached memo or document (the framing,
not contributions), the feed preview is a thin strip. You can't read a memo,
and a document shows only a small icon. Whiteboard previews right next to them
are a full 16:9 box.

All three framings are rendered in `src/crd/components/space/PostCard.tsx`,
each with a different height:

| Framing | Feed preview | ~height on a 640px-wide card |
|---|---|---|
| Whiteboard (l.441) | `aspect-video` | 360px |
| Memo (l.473) | `h-32` | **128px** |
| Document (l.550) | `CalloutCollaboraPreview size="compact"` → `h-28` | **112px** |

The memo is the worst case: `CroppedMarkdown` gets about 100px of text, and the
centred "Open Memo" overlay covers most of that.

**Fix:** give all three the whiteboard's size, so every framing preview is the
same 16:9 box:

```diff
 // PostCard.tsx — memo framing
-  className="relative block w-full cursor-pointer overflow-hidden rounded-lg border border-border bg-muted/30 h-32 text-left …"
+  className="relative block w-full cursor-pointer overflow-hidden rounded-lg border border-border bg-muted/30 aspect-video text-left …"
 …
-    <div className="p-3 h-full">
+    <div className="p-4 h-full">
       <CroppedMarkdown content={post.framingMemoMarkdown} maxHeight="100%" />

 // PostCard.tsx — document framing
   <CalloutCollaboraPreview
     documentType={post.framingDocumentType}
     onOpen={onOpenFramingDocument ?? onClick ?? (() => {})}
     previewImageUrl={post.framingDocumentPreviewUrl}
-    size="compact"
   />
```

After this change nothing in `src/crd` uses `size="compact"` on
`CalloutCollaboraPreview`. Either remove the variant, or keep it and leave its
render test in `CalloutCollaboraPreview.test.tsx`. Its doc comment ("shorter
fixed height for the space feed card") should be updated either way.

**Optional follow-up for consistency:** in the callout detail dialog,
`CalloutMemoPreview` is capped at `maxHeight="16rem"` while whiteboard and
document previews there are `aspect-video`. Making the memo box `aspect-video`
as well (or raising the cap) would give all three framings the same size in
the dialog too.

---

## Impact on this prototype

The prototype uses production's `cn()` unmodified, so it inherits bug #2 until
the client-web fix lands. Bug #1 does not affect the prototype: it loads Inter
itself (`src/styles/fonts.css`) — which is also why the prototype and
production currently render in different typefaces.

# 013 — Memo signing flow

**Status:** proposal, built in the prototype at `/memo-signing`
**Date:** 11 September 2026
**Scope:** the screens either side of the Cleverbase handoff — not the handoff itself

---

## The problem

Signing a memo is an unusual thing to ask someone to do. It means:

1. leaving Alkemio for a company most users have never heard of,
2. proving your legal identity there,
3. coming back with a **frozen PDF copy** of a document that **stays editable**.

Three of those four ideas are counter-intuitive, and the two screens that carry
them explain none of it. The before-screen shows the document at 52% inside the
browser's own PDF toolbar and says "Continue to Cleverbase". The after-screen is
a text list with a machine timestamp and three identical ALL-CAPS buttons per
row. Between them, at the moment the user gets back, nothing happens at all.

---

## What ships today

### Before — "Sign memo"

| Observed | Why it hurts |
|---|---|
| 768 × ~830 modal; the PDF gets a 480px box and opens at **52%** | The one thing the screen asks you to check is the smallest thing on it, and the browser's toolbar — print, rotate, draw, undo — is the widest. |
| "Review the exact PDF copy before starting the signing session…" followed by the heading "Review the exact PDF before continuing" | The same instruction, twice, in two registers. |
| "CONTINUE TO CLEVERBASE" | Names a company, not an outcome. Nothing says you will leave the site, be asked for ID, and return. |
| "…the memo remains editable" as a subordinate clause | The single most important reassurance, buried in small print. |
| "Open PDF preview" link below the embed | Ambiguous — the PDF is already previewed above it. |

### After — "Signed copies"

| Observed | Why it hurts |
|---|---|
| `Jeroen Nijkamp  Recorded: 09/11/2026, 17:04:20` | Underlined name that is not a link. A date that reads as 9 November in most of Europe and 11 September in the US. Seconds nobody needs. |
| `OPEN PDF` · `DOWNLOAD` · `VERIFY SIGNATURE`, equal weight | Three commands of identical rank; nothing says which one you want. |
| "The PDF is unmodified" appears only after pressing the third button | The question the screen exists to answer is hidden behind a click, and answered in prose with no colour, icon or status. |
| No faces, no document, no version context | A list of signatures that shows neither the signers nor what was signed. |

### The moment between them

Nothing. The confirmation only appears once the memo has been closed and
reopened — so the payoff for the whole trip happens off-screen. *(Being fixed
separately; this design assumes the corrected behaviour.)*

---

## Constraints taken as given

- **The PDF embed cannot be replaced.** It is the browser's viewer, toolbar and
  all. Every mock here draws it honestly, including the dark chrome.
- **The handoff is a real redirect.** The user leaves Alkemio and returns.
- **Signing requires a linked Cleverbase account.** Users without one must still
  see the button.
- The memo → PDF conversion has styling faults of its own. Out of scope here.

---

## The proposal

### 1. Before — `SignMemoDialog`

One wide dialog (1280 × 820 max), split:

- **Left, dominant:** the document. At this width the browser opens the page at
  ~100% instead of 52%, which is the entire argument for the size. Above it, one
  line of file facts and an "Open in a new tab" text link — replacing the
  ambiguous "Open PDF preview" and putting the escape hatch *with* the document.
- **Right, 360px:** what pressing the button will do, in the space settings
  pages' vocabulary — tinted chip, plain-word heading, one sentence:
  1. **You go to Cleverbase** — this tab opens Cleverbase.
  2. **You confirm it's you** — with your linked ID method; Alkemio never sees it.
  3. **You land back here** — copy attached, about a minute.
- Below the steps, in its own card rather than in small print: **"Signing
  doesn't lock the memo."**
- Footer: *Signing as [avatar] Name* on the left, `Cancel` / `Continue to
  Cleverbase ↗` on the right. Sentence case.

The instruction is printed once.

### 2. The return — `MemoSignedDialog` *(new)*

The only screen in the flow with nothing to decide, so the only one allowed to
celebrate. A seal, a one-shot confetti burst over the top of it, the title
**"It's signed"**, and the copy just made — rendered with the *same card the
list uses*, so the shape is already familiar the next time it is met.

Nothing loops: the burst plays once, the ring pulses twice, then the screen is
still. `See all signed copies` / `Back to the memo`.

### 3. After — `SignedCopiesDialog`

- **Verification runs on open, not on demand.** A strip under the header answers
  the common case before any row is read: avatars, "3 copies signed by 3
  people", and **All signatures check out**.
- **Each copy is a card:** a page thumbnail with a seal on its corner, the
  signer's face and name, the date in words ("Signed Today at 17:04" — the
  machine timestamp survives in a tooltip), a verdict chip, and "2 edits since"
  where the memo has moved on.
- **Actions are ranked:** `Open` as the one worded button, download and re-check
  as icon buttons with tooltips.
- **The list is a place to act from:** the sign button lives in the footer, so
  "I should sign this too" does not mean closing the dialog and hunting for the
  button you came from.
- Empty state included.

### 4. Entry points

**`SignMemoButton`** — always rendered when signing is enabled for the space.
Without a linked Cleverbase account it is `aria-disabled`, not `disabled`:

> A truly disabled button leaves the tab order and swallows pointer events, so
> the explanation attached to it is reachable by neither keyboard nor, reliably,
> mouse. The explanation is the whole point, so the button stays focusable and
> refuses the action itself.

The explanation is a **hover card, not a tooltip**, because it has to carry a
link to the documentation and tooltip contents cannot be clicked. It opens on
hover, on focus, and on tap (controlled `open`).

**`SignedCopiesTrigger`** — moves out of the command row. It is a *fact about
the document*, not a command, so it sits in the byline with the author and the
date as a quiet text button carrying the signers' faces: `👤👤👤 3 signed copies`.
A `tone="toolbar"` ghost variant remains for surfaces with no byline.

### 5. Alternative: `SignaturePanel`

The same list as a 320px rail inside the memo. Reads well — you see who stands
behind the memo while you read it — but costs 320px of a reading surface
permanently for something most readers check once. **The dialog is the
recommendation;** the rail is built so the trade can be seen rather than argued.

---

## Against the ticket

| Ticket item | Here |
|---|---|
| Success popup timing | Anton. Design assumes the fixed behaviour. |
| Make the success popup celebratory | `MemoSignedDialog`. |
| Signed versions button — placement and style | Text button with faces, moved into the byline. |
| Signed versions dialog — styling | `SignedCopiesDialog`. |
| Memo → PDF conversion styling | Anton. Out of scope. |
| Always show Sign when the feature is on | `SignMemoButton`, aria-disabled + hover card with docs link. |

---

## Files

```
src/app/components/memo/
  signingData.ts            types, fixtures, date formatting
  NativePdfViewer.tsx       honest stand-in for the browser's PDF viewer
  SignMemoDialog.tsx        before
  MemoSignedDialog.tsx      the return (new)
  SignedCopiesDialog.tsx    after — the main deliverable
  SignedCopyCard.tsx        one signed PDF, shared by dialog / panel / success
  SignaturePanel.tsx        after, as an in-memo rail (alternative)
  SignMemoButton.tsx        entry point, both states
  SignedCopiesTrigger.tsx   the quiet byline affordance
  MemoSurfaceMock.tsx       enough memo editor to judge placement
  current/                  today's two dialogs, rebuilt from the screenshots
src/app/pages/MemoSigningExploration.tsx
```

Route: **`/memo-signing`**. Deep links for review:
`?screen=sign|success|copies|current-sign|current-copies`, plus `linked=0`,
`copies=0|1|3`, `panel=1`.

---

## In the prototype

The flow is wired into the running app, not only the exploration page.

**Click path:** `/space/green-energy/knowledge-base` → the memo post *Policy
Decision Record: Community Solar* → **Open Memo** → **Sign memo** → *Continue to
Cleverbase* → the return → **2 signed copies** in the byline.

What that touched:

| File | Change |
|---|---|
| `memo/MemoDialog.tsx` | **New.** Memos had no surface of their own — "Open Memo" fell through to the post dialog — so there was nowhere for the entry points to live. This is the memo, with Sign memo in the title bar and signed copies in the byline. |
| `memo/memoSigningStore.ts` | **New.** Signing shows in four places at once; they have to agree. Signing appends a real copy, so every count moves together. |
| `space/SpaceKnowledgeFeed.tsx` | Memo posts open `MemoDialog` via `onOpenFraming`. |
| `dialogs/PostDetailDialog.tsx` | Memo posts now show their memo (with an Open Memo affordance — they previously showed nothing) and carry the signed-copies trigger in the byline. |
| `user/UserSettingsSecurity.tsx` | A **Digital signing** section — where "you need a Cleverbase account" actually resolves. Unlink there and every Sign button greys out. |
| `memo/NativePdfViewer.tsx` | Takes the memo's own content, so the snapshot shows the document being signed rather than a sample. |

Sign memo is deliberately **not** repeated in the post dialog: the command
belongs on the memo, and the post only needs the way in plus the fact that
copies exist.

Known carry-over: the memo preview inside the post dialog renders raw markdown
(`# Context`), matching what the feed card already does. Fixing it is a change
to the existing preview, not to this flow.

---

## Open questions

1. **Who may sign** is "anyone who can see the memo with a linked Cleverbase
   account". There is no way to *ask* someone to sign, and no pending state. If
   requesting signatures is wanted, the after-screen needs an awaiting section
   and that is a separate flow.
2. **Re-signing.** The footer says "Sign again" once you have a copy. Whether a
   second copy from the same person is desirable or a mistake to be prevented is
   a product call — the screenshots show it happening.
3. **The documentation URL** is a placeholder (`CLEVERBASE_DOCS_URL`).
4. **"Alkemio never sees those details"** in step 2 should be checked against
   what Cleverbase actually returns before it ships as a promise.

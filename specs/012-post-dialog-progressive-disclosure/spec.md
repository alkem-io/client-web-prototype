# 012 — Create Post dialog: progressive disclosure

**Branch:** `main` (exploration)
**Created:** August 18, 2026
**Status:** Exploration — live in the prototype; comparison page at `/post-dialog`
**Revision:** August 20, 2026 — tone pass (structure from the old dialog, voice from the space settings pages), then a restraint pass: option colour removed, the writing area unboxed, the response section returned to one column.
**Input:** The pre-redesign (MUI) posting dialog was more accessible and easier to digest than the current one. Response options were collapsed until asked for, per-type settings opened as their own dialog. Re-cut the current dialog along those lines using current components, tokens and patterns.

---

## Design Philosophy

The old dialog was not simpler because it did less. It disclosed less at once, and it put the cost of each choice somewhere other than the composer.

The current dialog took the opposite bet: every option visible, every panel expanded in place. That reads as generous and behaves as noise — fourteen options compete for attention before the author has typed a title, and the dialog's height is a function of how ambitious the post is.

This exploration keeps every capability and changes only *when* each one shows up.

### Key Principles

0. **Structure from the old dialog, tone from the space settings pages.** The disclosure argument (below) makes the dialog shorter; on its own it also made it colder — grey circles, uppercase labels, and option names that only a tooltip could explain. The settings pages had already solved that half: a tinted icon chip, a plain-word heading, one sentence per group, and choices that explain themselves on the surface.
0b. **Colour marks a group, never an option.** The settings pages use one hue per section and a handful per screen. An intermediate revision tinted all nine attachment tiles from the same palette; it borrowed the vocabulary without the restraint and read as noise. Tiles are now neutral, and the only colour in the composer is the two section chips.
0c. **The canvas is not a form.** Three framed fields stacked at the top read as paperwork. The title is a bare line that shows a hairline once it has content, the editor follows, and tags are a quiet `# Add tags` row underneath. The required title keeps its affordance through the disabled Post button rather than through a box and an asterisk.
1. **Growth is bounded.** Choosing a response type must cost the composer zero vertical space. Its configuration opens as a stacked dialog, the way `Collection Settings` did before.
2. **Single choices look single.** Attachment and response type are radio groups with an explicit `None`, not chip rows that read as multi-select filters.
3. **Content is authored inline; configuration is not.** If picking an option gives you something to *write*, you write it in the composer. If it gives you something to *configure*, the form opens stacked.
4. **Collapsed is not hidden.** The collapsed "Response options" bar states what is inside it (`Comments on · Links & Files`), so folding never costs the author knowledge of their own post.
5. **Required fields look required.** Framed, labelled inputs with a visible `*`, not a borderless input styled like a heading.

---

## What the old dialog did

Read off the four screenshots of the previous design:

| Zone | Old behaviour |
|---|---|
| Header | `Add Post` · `FIND TEMPLATE` · close |
| Identity | `Title*` and `Tags` side by side, outlined, labelled |
| Body | `Description` in a framed rich-text editor |
| Attachment | One line: label left, `None / Whiteboard / Poll` as circle-icon radios right. Unavailable options stayed visible and greyed |
| Attachment result | The whiteboard preview rendered **above** the picker with `EDIT` and a delete icon on it |
| References | A quiet `+ Add Reference` row |
| Response options | A rule with a chevron — **collapsed by default** |
| Response options (open) | Two cards: `Comments` (No Comments / Comments) and `Add a Collection` (None / Links & Files / Posts / Whiteboards) with a `COLLECTION SETTINGS` button |
| Collection settings | A **separate stacked dialog**: default title, tags, default description, three permission switches, `BACK` / `SAVE` |
| Footer | `SAVE AS DRAFT` appeared only once there was something to save; `POST` always |

Every one of those behaviours is carried over. The visual language is not: circles, rules, ALL-CAPS labels and notched outlines are replaced by the current tokens and components.

---

## The design

### Anatomy of the default state

```
┌ Create Post                                    [Find Template] [×] ┐
│                                                                     │
│  Title *                              Tags                          │
│  [_________________________]          [__________________]          │
│                                                                     │
│  Description                                                        │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ toolbar                                                       │  │
│  │                                                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌ Additional content        One per post — it sits under the desc ┐ │
│  │  ⃝  ⃝  ⃝  ⃝  ⃝  ⃝  ⃝  ⃝  ⃝                                       │ │
│  │ None Whiteboard Memo Document Media Poll Action Contrib Subsp   │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  + Add reference                                                    │
│                                                                     │
│  RESPONSE OPTIONS ──────────────── Comments on · no collection  ⌄   │
├─────────────────────────────────────────────────────────────────────┤
│                                              Save as Draft    Post  │
└─────────────────────────────────────────────────────────────────────┘
```

Expanding `Response options` reveals the old dialog's two cards, side by side:

```
  What people can add
   ⃝     ⃝      ⃝      ⃝     ⃝       ⃝          ⃝
  None Links  Posts  Tasks Memos Whiteboards Form
        “People add links and files”

  ┌ Set up the collection ─────────────────────[Set it up]┐
  ┌ People can comment on this post ─────────────[switch ]┐
```

### The disclosure rule

| Option | Where it is configured | Why |
|---|---|---|
| Whiteboard | Inline preview + `Edit` | The board is the content |
| Memo | Inline rich-text editor | The text is the content |
| Document, Media | Inline upload area | The file is the content |
| Poll | Stacked dialog + inline preview | A question and its options are a form |
| Action (CTA) | Stacked dialog + inline preview | Label and target are a form |
| Contributors, Subspaces | Stacked dialog + inline placeholder grid | A query is a form |
| Every response type | `Collection settings` dialog | Defaults, permissions, templates, questions |

The result: the composer's height depends on what the author has *written*, never on what they have *configured*.

### Measured effect

Scroll height of the dialog body, Chrome at 1440×900, walking the same path in both:

| State | Current dialog | This design |
|---|---|---|
| Empty | 625px | 690px |
| \+ Contributors in the body | 988px | 884px |
| \+ Form response type | 1,359px | 1,212px |
| \+ everything else opened | 1,674px | 1,330px |

The tone costs 65px at the start: a section header that explains itself is taller than an uppercase label. Everything after that is cheaper, and the fully-loaded post is 344px shorter.

Revision history, for anyone weighing a trade back:

| Revision | Empty | Fully loaded |
|---|---|---|
| Disclosure only (grey, tooltips) | 645px | 1,134px |
| \+ tone (colour, choice cards, two columns) | 715px | 1,440px |
| \+ restraint (neutral tiles, one column) | **690px** | **1,330px** |

---

## Components, tokens and patterns

Nothing new enters the design system except one composite control.

| Concern | Used |
|---|---|
| Dialogs | `Dialog` / `DialogContent` / `DialogTitle` / `DialogDescription`, with the built-in close X (header reserves `pr-12`) |
| Buttons | `Button` variants per `prototype/CLAUDE.md`: `default` for Post/Save, `ghost` for Save as Draft and Back (`size="sm" className="gap-1 px-2"`), `outline` for Find Template / Settings |
| Icon-only | `IconButton` everywhere, with `tooltipLabel` |
| Disclosure | `Collapsible` for Response options |
| Fields | `Label` + `Input`, `MarkdownEditor`, `Textarea`, `Select`, `Switch` |
| Typography | `text-subsection-title` (dialog titles), `text-body-emphasis` (field labels, card titles), `text-label uppercase` (section headers), `text-caption` (helper text) |
| Colour | `bg-card` / `border-border` for grouping cards, `bg-muted/40` for card headers, `bg-muted/10` for footers, `text-destructive` for the required marker |
| Settings vocabulary | `SettingsSection` (shared) for the two optional groups: tinted icon chip, plain-word title, sentence, chevron. Extended with optional controlled `open` / `onOpenChange` so the composer can scroll the revealed section into view |
| Group colour | `optionStyles.ts` — the settings pages' `ICON_COLORS` palette, for section chips inside the stacked dialogs |
| Binary settings | `Switch` in a soft bordered row, the same markup `SpaceSettingsSettings` uses for its permission toggles |
| New | `OptionTiles` — one neutral tile row + caption, used for both pickers |

### `OptionTiles`

One control, used for both pickers: a single-select row of neutral icon tiles with a shared caption line.

- Built on `@radix-ui/react-radio-group` (the same primitive `ui/radio-group` wraps), so arrow keys roam the row, `aria-checked` is real, and a screen reader announces "3 of 9".
- Selected: filled `bg-primary` circle, `text-body-emphasis` label. Unselected: bordered circle, `text-caption text-muted-foreground`.
- Disabled options stay visible at 40% — the old dialog's greyed-out `Poll` taught what the platform could do; a hidden option teaches nothing.
- Explanations are **not** in tooltips. The row reports whichever tile the pointer or keyboard is on, and the caption under it prints that sentence — one fixed-height line, so nothing jumps.

A revision rendered the seven response types as full choice cards — icon, name and sentence each, in two columns. It explained more and cost 200px, and the split column made a single decision read across a gutter. The caption line does the same explaining in one line: "Tasks" tells a first-time author nothing, and pointing at it says "People add tasks to a shared board".

---

## Accessibility

- Single-choice controls are real radio groups, replacing eight and six loose `<button>`s.
- The required title is a labelled `Input` with a visible `*`; `Post` stays disabled until it has content.
- Icon-only controls are `IconButton`, so each has a tooltip and an `aria-label`.
- Expanding `Response options` scrolls the revealed section into view — a disclosure control that appears to do nothing is worse than no disclosure control.
- The collapsed bar carries a text summary of its contents, so the state is available without expanding.

---

## Deliberately not restored

- ALL-CAPS button labels — the button system defines its own casing.
- Borders around every group; cards carry the grouping now.
- Collapsed sections that hide their state.
- The old three-option ceiling. All nine body attachments and seven response types the platform has today are offered.

---

## Open questions

1. **Nine tiles in one row.** Worth testing whether the four rare ones (Document, Action, Contributors, Subspaces) belong behind a `More` tile, or whether visible-but-quiet is the better teacher.
2. **Auto-opening settings.** Picking a configuration-first type opens its dialog immediately. Fast when intended, abrupt when browsing. The alternative is a `Settings` button on the preview card only.
3. **Collapsed by default for everyone?** This assumes most posts are plain posts. If the data says space admins mostly create collections, the bar should open pre-expanded for them.
4. **Where the required marker went.** The unboxed title has no visible `*`; the disabled Post button carries the requirement instead. Worth watching in testing — it is the one affordance this pass traded for calm.
5. **Transactional vs live-apply.** These settings dialogs use Back / Save, unlike the small gear panels elsewhere in the prototype, which apply immediately. Justified by the size of the payload (a questionnaire), but it is a second convention in the same product.

---

## Files

| Path | Role |
|---|---|
| `src/app/components/space/post-dialog-compact/AddPostDialogCompact.tsx` | The composer |
| `src/app/components/space/post-dialog-compact/OptionTiles.tsx` | Radio tile row + caption, used by both pickers |
| `src/app/components/space/post-dialog-compact/optionStyles.ts` | Tinted chip palette for group headers |
| `src/app/components/space/post-dialog-compact/CollectionSettingsDialog.tsx` | Response-type settings, incl. the form builder |
| `src/app/components/space/post-dialog-compact/AttachmentSettingsDialog.tsx` | Poll / Action / Contributors / Subspaces settings |
| `src/app/components/space/post-dialog-compact/options.ts` | Option registries |
| `src/app/components/space/post-dialog-compact/types.ts` | Config shapes and defaults |
| `src/app/pages/PostDialogExploration.tsx` | Comparison page at `/post-dialog` |

Every "Post" button in the prototype now opens this dialog — `SpaceFeed`, `SpaceKnowledgeFeed`, `WorkspacesFeed`, `CommunityFeed` and `SubspacePage` were switched over (the prop interface is identical, so it was a one-line swap each). `AddPostModal.tsx` itself is untouched and still reachable from `/post-dialog`, so the old behaviour stays available for comparison and reverting is a matter of swapping the imports back.

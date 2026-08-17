# 011 — Form Response Type

**Branch:** `feat/form-response-type`
**Created:** August 5, 2026
**Status:** Draft — prototype implemented for US1–US3 and US5
**Revision:** Aug 6, 2026 — Form moved from a callout *framing* to a callout *response type* (stakeholder decision). Required questions and answer length caps removed; per-question answer types (US5) added.
**Epic:** [alkem-io/alkemio#2005](https://github.com/alkem-io/alkemio/issues/2005) — "Form option added to post/callout"
**Input:** As a user I want to be able to use forms in my Alkemio post, so that I can ask a structured set of questions and collect each person's answers as a contribution to the callout.

---

## Design Philosophy

A Form is a **response type**: a fifth option alongside Links & Files, Posts, Memos and Whiteboards. The callout keeps its own framing — text, whiteboard, whatever suits — and the question list defines the *shape of what contributors submit*. It is the structured sibling of the free-form post contribution.

### Why a response type, not a framing

An earlier revision modelled Form as a framing, on the reasoning that the questions are what the callout is “about”. Resolved with stakeholders in the other direction, and the response-type reading holds up better:

- **The two axes stay orthogonal.** Every other framing can pair with any contribution type. Making Form a framing would have created the only framing that dictates its own contribution type — a special case in a system that otherwise has none.
- **A form callout can now also be a whiteboard callout.** Context in the framing, structure in the response. That combination is unreachable if Form occupies the framing slot.
- **It matches what the questions *are*.** A question set is a schema for submissions, the same role `Set Default Response` already plays for post contributions — just enforced rather than suggested.
- **It settles where the questions render.** As a framing, hiding them behind a Respond button contradicted every other framing preview (memo crops its markdown, whiteboard shows its image). As a contribution schema, not rendering them as head content is correct — you engage with them when you go to answer.

**Key Principles**

1. **The callout keeps its own head content.** Title and description give the context; the form gives the structure. They are separate slots and neither impersonates the other.
2. **Responses are contributions.** They render in `ContributionGrid` beside posts, memos and whiteboards. The table view is a second read of the same data, not a replacement.
3. **Visibility is stated before it is relied on.** Respondents are told who will read their answers *before* they write them; authors see a badge confirming what they configured.
4. **Your own words are always yours.** Whatever the visibility setting, a contributor can always see what they submitted.
5. **The question carries its own shape.** Each question declares how it is answered — a line, a paragraph, or a choice — picked while writing the question rather than configured afterwards. This follows the Google Forms flow most people already know.
6. **Nothing is compulsory.** No question can be marked required and no answer is length-capped. A partial response is a real response, and a form that refuses to submit teaches people to abandon it.

**Where Form sits**

| Axis | Options |
|---|---|
| Framing (head content) | text · whiteboard · memo · media gallery · document · link · poll · board |
| Response type | links & files · posts · memos · whiteboards · **form** |

Any framing may pair with any response type, Form included.

---

## User Scenarios & Testing

### P1 — US1 Create a Form callout with questions

A space admin creating a callout picks **Form** from the **Responses** chip strip and builds an ordered question list. Each question carries prompt text, an optional explanation, and an answer type — short answer, paragraph, or multiple choice — chosen inline while writing the question. Two form-level settings behind the gear decide who may read responses and whether one person may submit more than once.

**Why this priority:** without authoring there is nothing to respond to. This is the issue's p0.

**Independent test**
1. Open the create-post dialog and select the **Form** chip in the Responses strip.
2. Add three questions; leave the first as Short answer, switch the second to Paragraph, switch the third to Multiple choice and fill in its options.
3. Reorder two questions with the up/down controls, then delete one.
4. Open the gear; set visibility to *Administrators only* and leave multiple responses off.

**Acceptance scenarios**
- Given the Form chip is selected, when the author types a question, then the value persists while the panel stays open — it is not discarded on re-render.
- Given a new question, when it is added, then its answer type defaults to **Short answer**.
- Given a question, when the author switches it to **Multiple choice**, then two blank options appear so there is somewhere to type.
- Given a choice question with exactly two options, when the author looks at the remove control, then it is disabled — a choice needs at least two.
- Given a short or paragraph question, when the author looks below it, then an inert preview shows the shape of the answer respondents will give.
- Given three questions, when the author moves the second up, then it swaps with the first and the numbering updates.
- Given a single remaining question, when the author looks at its delete control, then it is disabled — a form cannot have zero questions.
- Given the Form chip is active, when the author clicks it again, then the form is removed as the response type.

### P1 — US2 Submit a response

A space member opens the form, answers the questions and submits. The response is attributed to them and appears as a contribution on the callout without a page reload.

**Why this priority:** the create/respond loop is the feature. Everything else refines it.

**Independent test**
1. Find a Form callout in the feed; confirm the prompt reads `n questions` plus a summary of the answer types.
2. Click **Respond**; confirm the dialog lists the questions in `sortOrder`, each with the right input for its type.
3. Submit with everything blank; confirm it goes through — nothing is compulsory.
4. Answer a choice question, submit, and confirm the chosen option's label appears on the response card and in the table.

**Acceptance scenarios**
- Given a `short` question, when the dialog renders, then it shows a single-line `Input`.
- Given a `long` question, when the dialog renders, then it shows a multi-line `Textarea`.
- Given a `choice` question, when the dialog renders, then it shows one selectable card per option and at most one can be picked.
- Given a blank form, when the user submits, then it is accepted — there is no required-field gate and no length cap.
- Given a valid submission, when the user submits, then a toast confirms it and names who will be able to read the response.
- Given a single-response form the user has already answered, when they look at the card, then the action reads **View your response** and opens their answers read-only.
- Given a multi-response form, when the user has answered twice, then the card reads `2 responses from you` and the action reads **Add another response**.
- Given a viewer without contribution rights, when they look at the card, then the action is disabled with a tooltip explaining why.

### P2 — US3 Response visibility

A per-form setting decides who can read the collected responses: space administrators only (the default), or anyone with read access to the space. A contributor can always see their own response.

**Why this priority:** the loop works without it, but forms that collect candid input are unusable until the author can promise who reads them.

**Independent test**
1. On an `admins`-visibility form as an admin, confirm all responses are listed.
2. Switch the viewer to a non-admin member; confirm only their own response remains, labelled "Your response".
3. On a `spaceMembers`-visibility form, confirm both roles see everything.

**Acceptance scenarios**
- Given `responseVisibility: 'admins'` and a non-admin viewer, when the card renders, then the section header reads `YOUR RESPONSE (n)` rather than `RESPONSES (n)` and the count reflects only their own.
- Given `responseVisibility: 'admins'` and a non-admin viewer with no response of their own, when the card renders, then no responses section appears at all.
- Given any visibility setting, when the card renders, then a badge states the current rule (`🔒 Admins only` / `Space members`).
- Given a restricted viewer opens the responses table, when it renders, then it explains that other responses are visible to administrators only.

---

## Edge Cases

**A form with no questions.** The respond dialog renders an empty state and the Submit button is disabled. The authoring panel prevents reaching zero by disabling the last delete control, so this is only reachable through seeded data.

**An answer left blank on an optional question.** Stored as an empty string. The read-only view renders "No answer given"; the responses table renders "No answer"; the contribution card's answer count excludes it, and its snippet falls through to the first *non-empty* answer.

**A respondent who loses contribution rights after answering.** On a single-response form they keep read access to their own submission — the action stays enabled as **View your response**. On a multi-response form the action disables; their existing responses remain reachable through the contribution grid.

**A response whose author has no avatar.** Falls back to the initial, matching every other author surface.

**More responses than the grid shows.** `ContributionGrid` collapses at three and offers `+ N MORE`; the separate **View all responses** button opens the table regardless.

**Long answers in the table.** Cells clamp to three lines; clicking a row expands every cell in it. The table scrolls horizontally inside its own container so the dialog body never does.

---

## Requirements

### Functional Requirements

#### FR-001: Response-type registration
`form` is a member of the callout's contribution-type union, offered as a chip in the create dialog's **Responses** strip. It is deliberately **not** a `PostType`: `POST_TYPE_DESCRIPTORS` is untouched and a form callout reports whichever framing it actually has.

#### FR-002: Question model
A form holds an ordered list of questions, each with `question`, optional `explanation`, `sortOrder`, and `answerType`. `question` / `explanation` / `sortOrder` mirror Alkemio's generic form-question model so production can map across without renaming; `answerType` and `options` extend it.

#### FR-002a: Answer types
`answerType` is one of `short` (single line), `long` (paragraph), or `choice` (pick one supplied option). `ANSWER_TYPE_DESCRIPTORS` is the single source of truth for each type's icon, label and helper text — a typed `Record` so a new type cannot fall through to a default renderer. New questions default to `short`.

#### FR-002b: Choice options
A `choice` question carries `options: { id, label }[]`. Switching a question to `choice` seeds two blank options so there is somewhere to type; the editor refuses to drop below two. The submitted answer stores the chosen option's **label**, so every read path — cards, table, read-back — renders it as plain text with no lookup.

#### FR-003: Respond prompt
The callout's contributions area renders a prompt with question count, a summary of the answer types present, the viewer's own response status, and exactly one action — the structured counterpart of the "+ Add Post" placeholder card. The framing area is untouched, and the questions themselves live in the dialog.

#### FR-004: Respond dialog
Questions render in `sortOrder`, one input per `answerType`: `short` → `Input`, `long` → `Textarea`, `choice` → a `RadioGroup` of selectable option cards.

#### FR-005: No submission validation
Nothing is required and nothing is length-capped, so Submit is always live and a blank answer is a legitimate reply. The only gate left is a form with zero questions.

#### FR-006: Single vs. multiple responses
`allowMultipleResponses` decides whether a contributor may submit again. The card's action label and status line follow from it.

#### FR-007: Attribution
Every response records its author and an ISO submission timestamp. Anonymity is out of scope.

#### FR-008: Response visibility
`responseVisibility` is `'admins'` (default) or `'spaceMembers'`. Filtering is applied once, centrally, and own responses are always included.

#### FR-009: Responses as contributions
Visible responses render as cards in `ContributionGrid`, each showing author, date, a snippet of the first non-empty answer, and an answer count. The viewer's own is badged.

#### FR-010: Responses table
A dialog presents one row per respondent and one column per question, with row-level expansion and horizontal scrolling.

#### FR-011: Detail view
The callout detail dialog renders the full question list read-only, plus the responses the viewer may see.

#### FR-015: Orthogonality
Selecting Form as the response type places no constraint on the callout's framing, and vice versa. The response-type strip is single-select, so Form and Posts cannot both be collected on one callout.

#### FR-012: Post-creation form settings
A gear control in the callout header opens a settings dialog where response visibility and the multiple-response rule can be changed after the callout exists. The control renders only for viewers permitted to change settings; its absence is the permission check.

#### FR-013: Retroactive exposure warning
Changing visibility from `admins` to `spaceMembers` while responses already exist is a consequential edit: respondents were told only administrators would read their answers at the moment they wrote them. The dialog names the number of responses affected, explains what saving does, and the confirm button becomes destructive and reads **Reveal and save**. Every other settings change saves silently.

#### FR-014: Settings edits never touch collected data
A settings save patches only `responseVisibility` and `allowMultipleResponses`. Questions and responses are out of its reach by construction.

### Non-Functional Requirements

- **NFR-000** `PostType`, `POST_TYPE_DESCRIPTORS` and `SubspaceBoardView.TYPE_ICONS` carry no `form` entry. A form callout is typed by its framing.
- **NFR-001** No change to the subspace-application form feature (`SubspaceApplicationDialog`, `SubspaceFormBuilderDialog`, `SubspaceApplicationsPanel`, route `/form`). The models stay parallel; the `CalloutForm*` prefix prevents import-site collisions.
- **NFR-002** Every icon-only control uses `IconButton` for tooltip and aria-label.
- **NFR-003** Semantic typography tokens only — no raw `text-sm` / `text-base`.
- **NFR-004** Light and dark themes both supported; no page-level horizontal scroll at narrow widths.

---

## Key Entities

### CalloutFormData
The contribution payload on `PostCardData.contributionForm`. Named for the axis it belongs to — it is not a `framing*` field.

| Field | Type | Notes |
|---|---|---|
| `questions` | `CalloutFormQuestion[]` | Displayed in `sortOrder` |
| `responseVisibility` | `'admins' \| 'spaceMembers'` | Defaults to `admins` |
| `allowMultipleResponses` | `boolean` | Single vs. multiple per contributor |
| `responses` | `CalloutFormResponse[]` | Unfiltered; visibility applied at read time |

### CalloutFormQuestion

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | Stable key; answers reference it |
| `question` | `string` | The field label |
| `explanation` | `string?` | Helper text |
| `sortOrder` | `number` | Ascending |
| `answerType` | `'short' \| 'long' \| 'choice'` | How the question is answered; defaults to `short` on new questions |
| `options` | `{ id, label }[]?` | `choice` only; minimum two |

### CalloutFormResponse

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | |
| `author` | `{ id, name, avatarUrl? }` | Attributed, never anonymous |
| `submittedAt` | `string` | ISO-8601 |
| `answers` | `{ questionId, value }[]` | Empty `value` = unanswered optional |

### Visibility helpers
`visibleResponses(form, userId, isAdmin)` is the single place the US3 rule is applied; `responsesAreRestricted(form, isAdmin)` reports whether the viewer is seeing a subset. Centralising both is what keeps the card count, the grid and the table from disagreeing.

---

## UI Component Structure

### Wireframe 1 — Callout in feed (text framing + form responses, admin view)

```
┌─ CARD ────────────────────────────────────┐
│ 📄 Post · 1 day ago                ⚙  ⋮   │
│ Hackathon Submission Form                 │
│ Submit your project before Friday…        │
│ ┌───────────────────────────────────────┐ │
│ │ 📋  4 questions · 2 short · 1 choice   │ │
│ │     ○ You haven't responded yet       │ │
│ │                        [  Respond  ]  │ │
│ └───────────────────────────────────────┘ │
│ ─────────────────────────────────────────  │
│ RESPONSES (3)            🔒 Admins only    │
│ ┌────────────┐ ┌────────────┐             │
│ │ M. Chang   │ │ A. Silva   │             │
│ │ 28 Jul     │ │ 29 Jul     │             │
│ │ Households…│ │ Co-ops…    │             │
│ │ 📋 4 answers│ │ 📋 4 answers│            │
│ └────────────┘ └────────────┘             │
│ [        View all responses          ]    │
│ 💬 4 Comments                              │
└───────────────────────────────────────────┘
```

### Wireframe 2 — Respond dialog

```
┌───────────────────────────────────────────────┐
│ 📋 Hackathon Submission Form              ✕  │
│    4 questions                                │
│    🔒 Only space administrators can see your   │
│       response                                │
├───────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────┐ │
│ │ 1. Which area should we prioritise?       │ │
│ │  ◉ Roof survey backlog                    │ │
│ │  ○ Grid connection studies                │ │
│ │  ○ Community outreach                     │ │
│ └───────────────────────────────────────────┘ │
│ ┌───────────────────────────────────────────┐ │
│ │ 2. What is currently blocking you?        │ │
│ │    Anything from missing data to a…       │ │
│ │ ┌───────────────────────────────────────┐ │ │
│ │ │                                       │ │ │
│ │ └───────────────────────────────────────┘ │ │
│ └───────────────────────────────────────────┘ │
├───────────────────────────────────────────────┤
│                    [Cancel]  [ Submit Form ]  │
└───────────────────────────────────────────────┘
```

### Wireframe 3 — Authoring panel (Responses strip, create-post dialog)

```
RESPONSES
( Links & Files )( ●Form ✕ )( Posts )( Memos )( Whiteboards )

┌───────────────────────────────────────────────┐
│ 📋 Form                                       │
│    Ask questions and collect answers          │
│ ┌───────────────────────────────────────────┐ │
│ │ 1. [ Ask a question    ] [ Short answer ▾]│ │
│ │    [ Add an explanation (optional)      ] │ │
│ │    ┌───────────────────────────────────┐  │ │
│ │    │ A single line — a name, a place…  │  │ │
│ │    └───────────────────────────────────┘  │ │
│ │                          ▲   ▼   🗑        │ │
│ └───────────────────────────────────────────┘ │
│  …switched to Multiple choice:                │
│ ┌───────────────────────────────────────────┐ │
│ │ 2. [ Ask a question ] [ Multiple choice ▾]│ │
│ │    ○ [ Option 1                     ] ✕   │ │
│ │    ○ [ Option 2                     ] ✕   │ │
│ │    + Add option                           │ │
│ └───────────────────────────────────────────┘ │
│ + Add question                                │
│ ───────────────────────────────────────────── │
│ Who can see responses                         │
│ [ Administrators only              ▾ ]        │
│ People can always see their own response.     │
│                                               │
│ Allow multiple responses            ( ● )     │
└───────────────────────────────────────────────┘
```

### Wireframe 4 — Responses table

```
┌─ Responses ───────────────────────────────────────────────┐
│ Hackathon Submission Form                                 │
│ [3 responses]  🔒 Visible to administrators only          │
├──────────────┬──────────────────┬─────────────────────────┤
│ RESPONDENT   │ 1. What problem… │ 2. What technologies…   │
├──────────────┼──────────────────┼─────────────────────────┤
│ ▸ M. Chang   │ Households can't │ React + Vite on the     │
│   28 Jul     │ tell whether…    │ front end, a small…     │
├──────────────┼──────────────────┼─────────────────────────┤
│ ▾ A. Silva   │ Community energy │ TypeScript end to end,  │
│   29 Jul     │ co-ops spend     │ SQLite for the ledger,  │
│              │ weeks recon…     │ and a rules engine we   │
│              │ (expanded)       │ wrote ourselves…        │
└──────────────┴──────────────────┴─────────────────────────┘
```

---

## Design Tokens & Visual Style

| Element | Style |
|---|---|
| Card preview block | `mt-4 rounded-xl border border-border bg-muted/30 p-4 flex items-center justify-between gap-4` |
| Preview icon chip | `p-2 rounded-lg bg-primary/10 text-primary` + `size-5` icon |
| Preview headline | `text-body-emphasis` |
| Preview status line | `text-caption text-muted-foreground`, `size-3` icon, `text-success` when responded |
| Preview action | `Button variant="default" size="sm"` → `variant="outline"` once responded |
| Disabled action | `border-destructive/40 text-destructive`, wrapped in a `<span>` so the Tooltip still fires |
| Dialog | `sm:max-w-2xl md:max-w-3xl max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden` |
| Dialog header | `px-6 pt-6 pb-4 border-b text-left`, title `text-section-title` |
| Dialog body | `px-6 py-5 flex flex-col gap-5 overflow-y-auto` |
| Dialog footer | `px-6 py-4 border-t bg-muted/20` |
| Question card (respond) | `rounded-xl border bg-muted/30 p-4 flex flex-col gap-3`; `border-destructive/50` when invalid |
| Question label | `text-body-emphasis`, index prefix `text-muted-foreground` |
| Question explanation | `text-caption text-muted-foreground mt-1` |
| Answer input · short | `Input` `bg-background` |
| Answer input · long | `Textarea` `bg-background min-h-24` |
| Answer input · choice | `RadioGroup`; each option a `Label` `flex items-center gap-3 rounded-lg border p-3`, selected `border-primary bg-primary/5` |
| Type picker | `SelectTrigger` `h-8 w-[172px] shrink-0 bg-background`, items icon + label |
| Choice option row (author) | radio glyph `w-4 h-4 rounded-full border`, `Input` `h-8`, remove `IconButton` |
| Answer preview (author) | `rounded-md border border-dashed border-border/70 bg-muted/20 px-3`, `h-8` short / `h-14` long |
| Error message | `text-caption text-destructive` |
| Responses section header | `text-label font-semibold text-muted-foreground` |
| Visibility badge | `text-caption text-muted-foreground` + `Lock` / `Users` at `w-3 h-3` |
| Response card | matches `ContributionPostCard` — `p-4 border rounded-lg bg-card … h-[180px]`; `border-primary/40` when own |
| Table header | `sticky top-0 bg-muted/50 backdrop-blur-sm`, `text-label uppercase text-muted-foreground` |
| Table own-row | `bg-primary/5` |
| Authoring panel | `mt-2 p-4 border rounded-xl bg-muted/30 space-y-4 animate-in fade-in slide-in-from-top-2` |
| Authoring question row | `p-3 border rounded-lg bg-background space-y-3` |

---

## Out of Scope

- **US4 — Notifications.** Alerting admins on submission and the submitter on receipt.
- **US6 — Form templates.** Making Form a first-class template-library kind. This alone touches `template-data.ts` (`CATEGORIES`, `TEMPLATE_TYPES`, the `structure` ladder), `TemplateLibrary`, `TemplateDetail`, `TemplatePackDetail`, `TemplateSettingsPage`, `PackSettingsPage` and `SpaceSettingsTemplates` — the Classification kind is the worked precedent.
- **Unifying the two form models.** The subspace-application feature keeps its own `FormField` model. Merging them is a refactor with its own risk profile.
- **Persisting created callouts.** `AddPostModal` does not append to the feed for *any* framing or response type; the Form panel matches that behaviour rather than diverging from it.
- **Required questions and answer length limits.** Removed deliberately — see FR-005.
- **Further answer types.** Checkboxes (multi-select), dropdowns, file upload, date, linear scale, and per-question conditional logic.
- **Anonymous responses, deadlines, closing a form, editing a submitted response, and exporting responses to CSV.**

---

## Implementation Checklist

- [x] `calloutFormTypes.ts` — model + `ANSWER_TYPE_DESCRIPTORS` + `sortedQuestions` / `visibleResponses` / `responsesAreRestricted` / `canSubmitResponse` / `answerTypeBreakdown` helpers
- [x] `PostCardData.contributionForm` + `onOpenFormSettings` prop (no `PostType` change)
- [x] Respond prompt rendered by the feed's `getContributionPreview`, not by `PostCard`
- [x] `CalloutFormPreview.tsx` — in-card summary with three action states + disabled state
- [x] `FormRespondDialog.tsx` — respond and read-only modes, one renderer per answer type
- [x] `FormResponsesDialog.tsx` — per-question table with row expansion
- [x] `FormSettingsDialog.tsx` — post-creation visibility + multiple-response settings, retroactive-exposure warning
- [x] Gear control in the callout header, rendered only for permitted viewers
- [x] `ContributionFormResponseCard.tsx` — response as a contribution
- [x] `useCalloutFormMock.ts` — submission state, dialog targets, visibility filtering
- [x] `AddPostModal.tsx` — Form chip in the **Responses** strip + question builder with per-question type picker and choice-option editor + settings gear
- [x] `SpaceKnowledgeFeed.tsx` — four demo states, hook, contribution branch, dialogs
- [x] `SpaceFeed.tsx` — one demo form, same wiring
- [x] `PostDetailDialog.tsx` — read-only question list + visible responses
- [x] `SubspaceBoardView.tsx` — no `form` entry needed (form is not a framing)
- [ ] US4 notifications
- [ ] US6 form templates in the template library
- [ ] Backend schema + resolvers (production)

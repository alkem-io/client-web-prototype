# COMPONENT-MAP

Every element a composition renders, and what is actually behind it. `mockup:check`
parses the backticked `@/…` paths in this file: a composition that lists a component
in `uses` which is not recorded here fails the build.

Status is one of **exists** · **exists but differs** · **does not exist**.

---

## The post surface

| Element in the spec | Component | Status | Notes |
|---|---|---|---|
| Post card | `@/app/components/space/PostCard` | exists | The UI calls it a Post; the data layer calls it a Callout (`callout.post`, `callout.whiteboard`, …). Takes `PostCardData`. |
| Reactions | `@/app/components/space/PostReactions` | **exists but differs** | Renders **one pill** — the emoji given, then a single total. Never a count per emoji: *"sorting by count would rank them, which is the comparative signal this whole concept avoids."* Set is fixed platform-wide for v1: ❤️ 🙋 👏 💡 🎯 ✅ 🚀, warm-only by rule. One reaction per person per post. |
| Tags on a post | `@/app/components/common/CollapsibleTagList` | **exists but differs** | Secondary badges in a wrap row in the card **body**, via `ReferencesAndTagsStrip` — not header pills. Capped at two rows with an exact `+N` chip. |
| References / files | `@/app/components/callout/ReferencesAndTagsStrip` | exists | One line per reference; files get a muted chip treatment. |
| Document / spreadsheet preview | `@/app/components/callout/CalloutCollaboraPreview` | **exists but differs** | The integration is **Collabora**. The feed shows an icon, a type chip (`text` / `spreadsheet` / `presentation`) and an Open Document button — **not** the table. The spec's "header row plus three data rows" only exists once the document is opened. |
| Whiteboard thumbnail | `@/app/components/contribution/ContributionWhiteboardCard` | exists | A static image thumbnail with an Open Whiteboard hover overlay; falls back to a `Presentation` glyph. **There is no canvas** — Excalidraw is not a dependency of this repo. |
| Task board | `@/app/components/contribution/TaskBoard` | exists | A **response type** (`tasks`), not a body attachment. |
| Media gallery | `@/app/components/mediaGallery/MediaGalleryFeedGrid` | exists | A body **attachment** (`framingMediaGallery`), up to 4 thumbnails plus a "+N more" overlay. |
| Contribution grid | `@/app/components/contribution/ContributionGrid` | exists | Renders collected responses. |

### The two lists a post is built from

Authoritative source: `@/app/components/space/post-dialog-compact/options.ts`.

**Body attachment** (composer label *Additional content*) — `None` · `Whiteboard` · `Memo` ·
`Document` · `Media` · `Poll` · `Action` · `Contributors` · `Subspaces`

**Response type** (composer label *Add a Collection*) — `None` · `Links & Files` · `Posts` ·
`Tasks` · `Memos` · `Whiteboards` · `Form`

Plus comments on/off. A post can carry **both** an attachment and a response type at once —
`SpaceKnowledgeFeed` has `type: "poll", contributionType: "posts"`.

---

## Space and subspace chrome

| Element | Component | Status | Notes |
|---|---|---|---|
| Innovation-flow phases as tabs | `@/app/components/space/ChannelTabs` | exists | `CalloutTabs`, with a `FlowArrow` chevron between linked phases. Defaults: Explore → Define → Ideate → Prototype; four flow templates ship; phases are editable, so custom names are legitimate. |
| Space tabs | `@/app/components/space/SpaceNavigationTabs` | exists | Home · Community · Subspaces · Knowledge Base. |
| Subspace rail | `@/app/components/space/SubspaceSidebar` | exists but differs | Takes `isCollapsed` / `onToggleCollapse` plus parent-space props. Not used in the mockups yet — the rail is composed from `ui/card` so it can be sized to the design canvas. |
| Mobile bottom bar | `@/app/components/space/SpaceShell` | exists | `lg:hidden fixed bottom-0` tab bar with scrollable labels, separator and hamburger; commented *"matches production mobile"*. Plus a FAB above it. |
| Page shell | `@/app/components/space/SpaceShell` | exists but differs | Needs router and filter context. Mockup screens compose the chrome themselves; see `parts/screens.tsx`. |

---

## ui primitives

All **exist** and are used directly:

`@/app/components/ui/avatar` · `@/app/components/ui/badge` · `@/app/components/ui/button` ·
`@/app/components/ui/card` · `@/app/components/ui/separator` · `@/app/components/ui/tooltip` ·
`@/app/components/ui/breadcrumb` · `@/app/components/ui/placeholder-card`

---

## Does not exist — must not be depicted as if it does

| Spec asks for | Reality |
|---|---|
| Whiteboard canvas | No `@excalidraw/*` dependency. Flow 3 needs it added. |
| Named cursors, anywhere | No cursor system in the repo. The mockups' `Cursor` is mockup-local, and the validator restricts it to whiteboard / document / memo screens. |
| Community map | No map library. `analytics/netherlandsMap.ts` is hand-simplified province outlines — exactly what spec §6.5 forbids. Flow 6 was cut. |
| Poll renderer | `PollConfig` is `{ question, options[], multipleChoice }`. **No deadline, no live tally.** `parts/cards.tsx → PollCard` is mockup-local and draws only those fields. |
| Standing phase list | Phases render as tabs; there is no list component. `parts/cards.tsx → PhaseFlowCard` is mockup-local. Phases carry `label`, `description`, `linkedToNext` — **no dates**. |
| Co-signers | Not a concept. Reactions are. |
| Published-decision status | No decision object and no sign-off. A decision is an ordinary post tagged as one. |
| Seen-by / read receipts | Do not exist. |
| "New since you opened" in a feed | Does not exist. (Notification **read state** does — `NotificationsPage`.) |
| Who's-online for a space | Does not exist. `MessagesOverlay` shows "Active now" on DMs only. |
| Typing indicators in comments | The only typing indicator in the repo is in `CreateSpaceChat`, the space-creation assistant. Unverified elsewhere. |
| Host dashboard | `OrgProfilePage` has three tabs and no metrics, no activity trend, no stalled state. |

---

## Mockup-local components

These live in `src/mockups/` and are **not** platform UI. Each renders a feature that exists
but has no renderer in the repo, and each is listed above with the reason.

- `parts/cards.tsx → PollCard`
- `parts/cards.tsx → PhaseFlowCard`
- `parts/screens.tsx → TopBar`, `RailBlock`, `PhaseBlock`, `LeadsBlock`
- `frame/Cursor.tsx`
- `core/density.tsx` — `TextLines`, `TruncatedTable`, `MediaPlaceholder`, `AvatarStack`

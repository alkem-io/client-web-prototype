# 014 — New activity indicators

**Branch:** `main` (exploration)
**Created:** September 16, 2026
**Status:** Built in the prototype. Concepts page at `/activity-dots-concepts.html`; live across sidebars, tabs, cards, posts, innovation-flow phases and the notifications dialog.
**Revision:** September 21, 2026 — stakeholder review. Post dots moved from clear-on-sight to clear-on-hover; dots gained a pulsing halo; a **Recent activity** tab was added to the notifications dialog; the bell now opens that dialog directly; the unread-only filters were dropped; the settings block moved from General to Notifications.
**Input:** Client request — *"when I am in a space I want to have visual indication of where things have changed. Yes I can go to the activity view, but far better would be to have some visual feedback that sort of signals to me 'hey, something changed over here'."* Subtle dots on the subspace list, menu headers, subspace cards, posts and dashboard cards. Easy to dismiss, easy to disable, plus a mark-all-as-read.

---

## Design Philosophy

The activity feed already answers *what happened*. Nobody asks it, because answering that question costs a deliberate trip to a separate view, and the thing you actually wanted to know — *is it worth my time to go back into that space* — is buried inside the answer.

This feature moves the signal to where the decision is made. Not a feed you visit, but a mark on the thing itself, visible from wherever you already are.

The hard part is not drawing the dot. It is stopping the dot from becoming an inbox.

### Key Principles

1. **It is a "what's new" signal, not an unread ledger.** The dot answers *has this place changed since I was last here*. It does not track whether you have personally read all four hundred posts in a space you lurk in. A ledger can never be cleared honestly, so it teaches people to ignore it.
2. **Clearing is a side effect of using the platform, never a chore.** You clear dots by going places and looking at things. The explicit `Mark all as read` exists as an escape valve, not as the primary mechanism. If people reach for it routinely, the model is wrong.
3. **New content counts; chatter about existing content does not.** A new contribution changes what is in a space. A comment on a three-month-old post does not change the shape of the space, and comment volume is exactly what makes notification systems unbearable.
4. **Marking read costs a deliberate gesture, not an accident.** Clear-on-sight was tried first and failed in use: any post above the fold cleared roughly 800ms after arrival, so the dot was gone before it could be perceived. Post dots only ever survived below the fold, which made them look broken. Hovering is the smallest gesture that still means *I chose to look at this*.
5. **Ambient, never demanding.** The notification bell already owns "this concerns *you*, act on it". Dots own "this *place* changed, if you're curious". These must not look alike, or everything inherits the bell's obligation.
6. **Containers and items clear differently, on purpose.** A container clears when you go there. An item clears when you attend to it. Conflating them either makes top-level dots sticky forever or makes them vanish before they've done their job.
7. **One switch.** Per-surface granularity is a settings tax nobody pays, and every toggle added is a support question earned.
8. **A dot everywhere says nothing.** The signal only carries meaning against quiet neighbours. Seeding, and later the real data, must leave some spaces, tabs and phases undotted — if every row in a list is marked, the list is just decorated.
9. **No unread-only filter.** Filtering to "just the new things" turns an ambient signal into a work queue, and it duplicates what the dots already do in place. Scope filters answer *whose spaces*; nothing filters by read state.

---

## The model

### Two models were on the table

| | **Unread ledger** | **Since last visit** |
|---|---|---|
| Unit of state | Read flag per item, per user | One timestamp per container, per user |
| Dot means | You haven't opened this | This changed since you were here |
| Clears | Only by opening every item | By showing up |
| Cost | Grows with content volume | Constant |
| Failure mode | Permanent guilt, ignored dots | Brief blind spots |

The client's own words — *"people returning to the platform after some time can quickly see where there has been activity"* — describe the second. We use it for containers.

### The hybrid, and where the seam is

Pure since-last-visit is too coarse for a post feed: once you've visited Home, everything in it is "seen" even if you scrolled past none of it. So the seam sits between **places** and **things**:

| | Containers | Items |
|---|---|---|
| **What** | Space, subspace, sub-subspace, tab, innovation-flow phase | Post, memo, whiteboard, document, form response |
| **State** | `lastVisitedAt` timestamp | Membership in a seen set |
| **Clears when** | You navigate to it | You hover it for 400ms, or open it |
| **Rolls up?** | Yes — into parent containers | **No** |

The container hierarchy is three levels deep:

```
space
 ├─ tab (Home · Community · Subspaces · Knowledge Base)
 └─ subspace
     ├─ innovation-flow phase
     └─ sub-subspace
```

**Subspaces hang off the space, not off the Subspaces tab.** If they hung off the tab, the tab could never clear on visit — it would keep relighting from its children, which is exactly the sticky-parent failure this model exists to avoid.

### The rollup rule

> A container's dot = its own unvisited new activity **OR** any child *container* still dotted.

Worked example, which the concepts page demonstrates live:

```
Sidebar: Green Energy Transition  ●      ← lit
  └ tabs:  Home   Community ●   Subspaces ●   Knowledge Base
  └ nested: Solar Rooftops ●

visit Community, visit Subspaces
  → both tab dots clear
  → sidebar space dot STAYS LIT   (Solar Rooftops still dotted)

enter Solar Rooftops
  → card dot and its sidebar twin clear together
  → sidebar space dot finally clears

…while four posts inside Home remain dotted throughout.
```

Item dots deliberately do **not** feed the rollup. If they did, the sidebar dot would survive until every post in the space had been scrolled past, which is the sticky-parent failure that makes this kind of feature hated.

**Accepted consequence:** a clean sidebar can still contain dotted posts. This reads as *"you've been here; here's what you haven't looked at yet"* rather than *"you have failed to clear your inbox."* It is a deliberate inconsistency, not an oversight.

### Containers rendered as items

Subspace cards and dashboard cards look like items and behave like containers. **Scrolling past one must not clear it** — only entering the space it points at does. Getting this backwards would kill the dot before it has done its job, since these cards are precisely the ones people scan past on the way somewhere else.

Where the same container appears twice — a subspace in the sidebar *and* as a card — both instances clear together.

---

## What counts as activity

| Counts | Does not count |
|---|---|
| New post | Comments and replies |
| New contribution to a callout — memo, whiteboard, document, link, **form response** (per [011](../011-form-response-type/spec.md)) | Reactions |
| New callout | Edits to existing content |
| New subspace | Anything **you** did |
| New member joined | |

The line is **new content vs. chatter about existing content**. Comments are excluded for this version; they are the highest-volume, lowest-signal event type, and including them would make dots permanent in any active space. Revisit once the dots have been live long enough to judge.

---

## Visual language

**One treatment everywhere: a solid 6px dot in navy `#1d384a`** (`--primary`).

Five treatments were built and compared on the concepts page — solid dot, ring, dot + row tint, edge bar, dot + bold label. The edge bar is the most elegant on rows and cards and has nowhere to live on a tab; adopting it would mean two visual languages instead of one. Bold labels were rejected outright: bold text says *unfinished work*, a dot says *news*, and the brief asked for the second.

### Placement per surface

| Surface | Placement |
|---|---|
| App sidebar space row | Right-aligned at the end of the row |
| Dashboard sidebar — My Spaces | Right-aligned at the end of the row |
| In-space sidebar — subspace quick links | Right-aligned at the end of the row |
| Space navigation tab | Inline, immediately after the tab label |
| Innovation-flow phase tab | Inline, immediately after the phase label |
| Subspace card | **Beside the card title**, not in the banner |
| Dashboard / space card | **Beside the card title**, not in the banner |
| Post / contribution card | Inline, immediately after the post title |
| Recent activity row | Right-aligned, matching the notification row pattern |

The banner corner was tried and rejected: it reads as a decorative badge on the image rather than as a property of the thing, and it collides with any future overlay on the banner.

There are three separate sidebars in the app — the global one, the dashboard's My Spaces list, and the in-space subspace list. All three carry dots; they are distinct components and each had to be wired individually.

### Motion

The resting dot proved too quiet to notice in use. Rather than enlarging or brightening it — which would have cost the calm that made navy the right choice — the dot gained an **expanding halo**:

| Layer | Behaviour |
|---|---|
| Core | Opacity breathes 1 → 0.65 → 1 |
| Halo | Scales 1 → 2.6× while fading 0.45 → 0, then rests |
| Cycle | 2.4s, synchronised across all dots |

The halo finishes fading at 70% of the cycle, so roughly a third of every cycle is completely still. It reads as *a ping every few seconds*, not as continuous motion — which matters when a dozen dots share a screen.

**Presence without weight** is the point: at rest the indicator is still a 6px navy dot, so a busy page does not become a field of markers. Motion in peripheral vision does the attention-getting that colour would otherwise have to.

`prefers-reduced-motion` stops both animations and hides the halo entirely, leaving the static dot.

### Known tradeoff

Navy is the same value as body text (`--foreground`). That makes the dot genuinely unobtrusive, which is on-brief, but it also means there is **no colour distinction at all** — it reads as quiet punctuation. Two consequences:

- The signal leans entirely on shape and position, so the accessible name (below) is doing real work, not just compliance work.
- If testing shows people miss it, the first fix is **7px, not a brighter colour** — size preserves the language, colour changes it.

The concepts page keeps a live switcher for navy / signal blue / teal so this can be re-argued with evidence.

### Not like the bell

| | Notification bell | Activity dot |
|---|---|---|
| Colour | `--destructive` red | `--primary` navy |
| Count | Visible number | None |
| Position | Badge on a corner | Inline with content |
| Motion | Static | Slow halo ping |
| Means | Concerns you. Act. | Place changed. Optional. |

Activity dots **must never** render in destructive red and **must never** carry a visible count.

The two systems now share one dialog but remain distinct: the bell's red dot means *either* has something, while inside, the two tabs keep the semantics apart.

---

## Clearing and control

### Mark all as read

Three entry points, all clearing the same state:

| Where | Scope | Purpose |
|---|---|---|
| Space header action bar | That space and everything beneath it | The everyday control. Appears only when the space has activity. |
| Notifications dialog → Recent activity tab | Everything | Where people already are when they've just read the list |
| Settings → Notifications | Everything | The once-a-quarter reset |

The per-space control sits in the space's icon toolbar rather than an overflow menu — it is conditional on there being something to clear, so it never appears as a dead option.

Per-space clearing must hit the space panel **and** that space's sidebar rows together, or the rollup rule immediately relights the sidebar and the action looks broken.

**No confirmation dialog. An undo toast instead** — it states the count and offers `Undo` for six seconds. Undo restores exactly the set that was cleared, not the full original state.

The toast counts what the user can see. Clearing from the activity tab reports the number of *listed updates*, not the raw container-plus-item count underneath — a toast claiming "24 items" beside a list of 11 rows reads as a bug.

### Settings

One switch, in **Settings → Notifications**.

> **Show new activity indicators**
> Display a small dot on spaces, tabs, cards and posts that have changed since you last looked.

Off hides every dot everywhere and suspends all read-tracking.

This block sits **outside** the page's SaveBar dirty-tracking: the switch applies immediately, and the other two rows are actions rather than preferences. A display toggle that needs saving would be a trap.

*Originally specified for General settings, on the reasoning that this is a display preference rather than a delivery preference. Moved to Notifications at stakeholder request once the Recent activity tab put the rest of the feature behind the bell — findability won over taxonomy.*

### Recent activity tab

The dots answer *where* something changed. They do not answer *what*. The notifications dialog gains a second tab — **Recent activity** — that lists the changes themselves, so the two halves of the feature share one dialog and one read state.

| | Notifications tab | Recent activity tab |
|---|---|---|
| Answers | What concerns me? | What changed in my spaces? |
| Unit | A notification addressed to you | A change in a container |
| Read state | Per notification | The same `VisitRecord` the dots use |

Each row leads with what changed — `3 new posts in Green Energy Space` — followed by one line of detail, the age of the activity, and a dot while unread. Clicking navigates to the container, marking it visited on the way, exactly as arriving there by any other route would.

**The leading image identifies the place, not the person:**

| Layer | Content |
|---|---|
| Main square (40px, rounded) | The space or subspace avatar, falling back to its initials |
| Corner badge | The action — post, contribution, subspace, member |

Profile pictures were tried in two arrangements — one face leading the row, then a cluster of contributor faces badged onto the action icon — and both were dropped. This is a list of *places that changed*, and the filters above it are about whose spaces you are looking at, so the space is the thing worth recognising. Faces also forced a judgement on every aggregate row about who to credit, which is a question the data often cannot answer honestly.

Using the same avatar the sidebar and cards use means a row is recognisable before it is read.

Names stay in the detail line, never the title. The title answers *what changed*; who did it is supporting information, and leading with a bold name made the list read like a notification feed rather than a record of changes.

**Scope filters**, which nest rather than overlap arbitrarily:

| Filter | Includes |
|---|---|
| All | Every space visible to you |
| In my spaces | `member` ∪ `lead` |
| Spaces I'm a member of | `member` only |
| Spaces I lead | `lead` only |

`In my spaces` is the union of the two role filters, so the counts always reconcile. A third relation, `following`, covers spaces you can see but have not joined; it appears only under `All`.

There is **no unread-only filter** on either tab. It was built, then removed: it duplicates what the dots already communicate in place, and it reframes an ambient signal as a queue to be emptied.

**Mark all as read** lives in the dialog header and switches meaning with the tab. On the activity tab it calls the same global clear as the settings page, so dots and list can never disagree.

### Opening the dialog

The bell **opens the dialog directly**. An earlier preview dropdown — three notifications and a "view all" link — was removed: it hid the activity tab two clicks deep, and the whole feature was invisible to anyone who only ever glanced at the dropdown.

The bell's red indicator now reflects *either* tab having something, otherwise recent activity would be unreachable-by-accident from the header.

`openNotifications(tab)` accepts which tab to land on, so any surface can deep-link straight to the activity list.

**Accepted cost:** there is no longer a quick glance at notifications; every check is a full dialog. This matches production behaviour, which is what was asked for.

### Cold start

Everything before your **join date** for a given space — or before your **first-ever login**, for members who predate the feature — is treated as already read. A new member of a three-year-old space starts clean. Without this, the feature's first impression is a wall of dots, which teaches exactly the wrong reflex.

---

## Accessibility

- The dot is decorative in markup (`aria-hidden`); the meaning lives in a visually hidden label on the parent control: `"Green Energy Transition, new activity"`, or where a count is known, `"3 new items"`.
- Assistive tech therefore gets **more** than sighted users — a count where the visual is deliberately numberless.
- Shape and position carry the signal, not colour alone, which satisfies non-colour-only requirements — though see the navy tradeoff above.
- Clearing must not fire for users who never attended to the item: hover is required, so keyboard and screen-reader users clear a post by opening it rather than by scrolling past.
- `prefers-reduced-motion` suppresses the fade-out; dots simply disappear.

---

## Requirements

### Functional

- **FR-001**: System MUST show a solid navy dot on any container with activity newer than that container's `lastVisitedAt`.
- **FR-002**: System MUST show a dot on any item created after the viewer's baseline and not in their seen set.
- **FR-003**: System MUST clear a container's dot on navigation to that container.
- **FR-004**: System MUST clear an item's dot when the item is hovered for ≥400ms, or when it is opened.
- **FR-004a**: System MUST NOT clear an item's dot merely because the item scrolled through the viewport.
- **FR-005**: System MUST NOT clear a container's dot merely because the container's representation (card, row) scrolled into view.
- **FR-006**: System MUST propagate container dots to ancestor containers, and MUST NOT propagate item dots.
- **FR-007**: System MUST clear all linked representations of the same container together.
- **FR-008**: System MUST exclude the viewer's own actions from counting as activity.
- **FR-009**: Users MUST be able to mark all as read per space, from the activity tab, and from settings.
- **FR-010**: System MUST offer undo for ≥6s after a mark-all action, restoring only the cleared set.
- **FR-010a**: A mark-all toast MUST report the count the user can see, not the underlying record count.
- **FR-011**: Users MUST be able to disable all indicators via a single switch in Settings → Notifications.
- **FR-012**: System MUST treat all activity predating space join (or first login) as read.
- **FR-013**: Dots MUST NOT use `--destructive` or display a visible count.
- **FR-014**: Every dot MUST expose an accessible name on its parent control.
- **FR-015**: Dots cleared during a visit MUST NOT reappear for activity arriving while the user remains on the page. *(See open item OQ-2.)*
- **FR-016**: The notifications dialog MUST offer a Recent activity tab listing recent container changes, filterable by All / in my spaces / member / lead.
- **FR-016a**: An activity row MUST lead with the space or subspace avatar (initials fallback), badged with the action kind. Contributor profile pictures MUST NOT be used.
- **FR-016b**: Actor names MUST appear in the detail line, not the row title.
- **FR-017**: Opening a change from that list MUST mark its container visited.
- **FR-018**: Mark-all-as-read on the activity tab MUST clear the same state the dots read from.
- **FR-019**: Dots MUST animate with a halo ping, and MUST NOT animate under `prefers-reduced-motion`.
- **FR-020**: The notification bell MUST open the dialog directly, and MUST indicate when either tab has something new.
- **FR-021**: Neither tab MAY offer an unread-only or new-only filter.
- **FR-022**: An innovation-flow phase MUST count as a container; the phase open on arrival counts as visited.

### Key entities

- **VisitRecord** — `{ containerId, containerType, lastVisitedAt }`. One per user per container. Containers: space, subspace, tab, innovation-flow phase.
- **SeenSet** — set of item ids the user has seen. Items: post, memo, whiteboard, document, link, form response.
- **Baseline** — per-space join timestamp, falling back to a global first-login timestamp.
- **IndicatorPreference** — single boolean.
- **SpaceChange** — a row in the activity tab: `{ containerId, href, spaceName, spaceAvatar, spaceInitials, relation, kind, summary, detail }`. Keyed by `containerId` so the list and the dots read the same state.
- **SpaceRelation** — `lead | member | following`. Drives the scope filters; `lead ∪ member` is "my spaces".

---

## Prototype implementation notes

Following the established `alkemio-*` localStorage convention and the existing React Context pattern (no state library):

| Key | Contents |
|---|---|
| `alkemio-activity-enabled` | `"true"` / `"false"` |
| `alkemio-activity-visits` | `{ [containerId]: ISO8601 }` |
| `alkemio-activity-seen` | `string[]` of item ids |
| `alkemio-activity-baseline` | `ISO8601` |

- New `ActivityIndicatorsContext` alongside the existing contexts. It must stay separate from `NotificationsContext` — two systems, two states, deliberately.
- Shared `<ActivityDot />` in `components/shared/`, taking only a `label` for the accessible name.
- A **dev reset control** to restore all dots, so the feature can be demoed repeatedly. Lives with the settings block.

### Where it lives

| File | Role |
|---|---|
| `data/activity-data.ts` | Mock registry: container hierarchy, activity timestamps, `SPACE_CHANGES` |
| `contexts/ActivityIndicatorsContext.tsx` | Read state, rollup, mark-all, undo |
| `components/shared/ActivityDot.tsx` | The dot |
| `components/shared/ActivityVisitTracker.tsx` | Marks containers visited from the URL |
| `components/layout/SpaceActivityPanel.tsx` | The Recent activity tab |
| `styles/index.css` | `activity-dot-ping` / `activity-dot-breathe` keyframes |

Wired surfaces: `layout/Sidebar`, `dashboard/DashboardSidebar`, `space/SpaceSidebar`, `space/SpaceNavigationTabs`, `space/ChannelTabs`, `space/SpaceCard`, `space/RichSubspaceCard`, `dashboard/RecentSpaces`, `space/PostCard`, `space/SpaceShell`, `layout/NotificationsOverlay`, `user/UserSettingsNotifications`.

### Two pre-existing bugs found on the way

- **`<Toaster />` was never mounted.** Every `toast()` call in the prototype — roughly twenty components — silently did nothing. Found because the undo toast didn't appear. Now mounted in `App.tsx`.
- **`KanbanBoardPost.tsx` and `SubspaceBoardView.tsx` were deleted in commit `54b50760`** while `SubspacePage.tsx` still imported them, breaking the dev server and the build. Restored from `418206c4`.

### One testability warning

Clear-on-sight originally used `IntersectionObserver`. **IntersectionObserver callbacks never fire in the headless browser behind the agent tooling**, so the mechanic could not be verified there. The sight approach has since been replaced by hover, which removes the problem entirely — but the constraint still applies to any future viewport-dependent behaviour.

### Touch devices

Hover does not exist on touch. Item dots there must clear on **tap-to-open** only, which means a mobile user scrolling a feed keeps their dots until they open something. Whether that is correct or merely tolerable is part of OQ-3.

---

## Open items

| # | Item | Status |
|---|---|---|
| **OQ-1** | **Decay window.** How long activity stays "new" before it stops producing a dot (14 days? 30?). Without decay, a dormant space you never re-enter stays dotted indefinitely. | **Deferred to a future version** by agreement. Flagged as the most likely source of long-tail annoyance. |
| **OQ-2** | **No re-dotting mid-visit.** Dots clear optimistically and stay clear until you navigate away and return; activity landing while you sit on the page does not relight them. Chosen because a dot reappearing on something you just looked at reads as a bug and turns the feature into whack-a-mole. Costs a blind spot for people who leave tabs open all day. | **Proposed — needs sign-off** |
| **OQ-3** | **Mobile, touch and collapsed sidebar.** Dot placement on avatar-only rows; whether dots appear in the universal breadcrumb ([003](../003-universal-breadcrumb/)); and how item dots clear without hover. | **Pinned — deferred** |
| **OQ-4** | **Comments.** Excluded for now. Worth revisiting once there is evidence of how noisy dots actually get. | Revisit post-launch |
| **OQ-5** | **Navy contrast.** Dot is the same value as body text. Fix by size before colour if testing shows it's missed. | Partly mitigated by the halo ping. Monitor. |
| **OQ-6** | **Indefinite motion.** An always-pinging dot is arguably WCAG 2.2.2 moving content. Reduced-motion and the settings switch are both off-ramps, but a variant that **pulses for ~10s after arrival then settles** would serve the returning-user case without nagging all day. | Open — one-line change if wanted |
| **OQ-7** | **Scope filter semantics.** "In my spaces" is modelled as `lead ∪ member`. If stakeholders meant something narrower — spaces you created, say — the relation model needs a fourth value. | Needs confirmation |
| **OQ-8** | **Loss of the notification preview.** The bell now always opens a full dialog. If the quick glance is missed, the dropdown markup is recoverable from git history. | Monitor |

---

## Success Criteria

- **SC-001**: A returning user can identify which of their spaces changed since their last visit without opening any space or the activity feed.
- **SC-002**: Normal navigation clears the majority of a user's dots — `Mark all as read` is used by a minority of users, not as routine hygiene.
- **SC-003**: Users describe the dots as informative rather than obligating when asked; they do not report feeling behind.
- **SC-004**: Users distinguish activity dots from notification badges unprompted when shown both.
- **SC-005**: Fewer than 5% of users disable the feature.
- **SC-006**: A newly joined member of an established space sees no dots for pre-existing content.
- **SC-007**: A user asked "what changed while you were away?" can answer from the Recent activity tab without visiting any space.

---

## References

- Concepts page — `Resources/Prototype/public/activity-dots-concepts.html`
- [011 — Form Response Type](../011-form-response-type/spec.md) — defines "response" as a callout contribution
- [007 — Dashboard spaces view](../007-dashboard-spaces-view/) — the activity feed this feature complements
- [003 — Universal breadcrumb](../003-universal-breadcrumb/) — relevant to OQ-3

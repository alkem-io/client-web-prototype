# Phase 2 — ahead-of-production work to re-add

Phase 1 is integrating client-web's CRD components everywhere one exists. Where
a prototype component wrapped a CRD-equivalent with an extra feature that CRD
has no slot for, **the feature is removed in phase 1 and listed here.**

Nothing on this list is abandoned. Each entry records what was dropped, where it
was, and what CRD needs for it to come back — usually a `*Slot` prop, following
the convention `PostCard.reactionsSlot` and `CalloutDetailDialog.reactionsSlot`
already set.

> Recover any original from `main`:
> `git show main:Resources/prototype/src/app/components/<path>`

---

## 1. Activity indicators (the dot / pulse)

**What:** a small animated dot beside a space, tab or post name showing new
activity since the viewer's last visit. Spec `014-new-activity-indicators`.
Driven by `ActivityIndicatorsContext` + `ActivityDot`, both still in the repo.

**Why it blocks:** the dot renders *inline, next to the name*, and CRD renders
the name itself. No slot exists on any of the components it needs to sit in.

**Needs upstream:** a `nameSuffixSlot` (or `badgeSlot`) on `CompactSpaceCard`,
`SpaceCard`, `SidebarResourceItem`, `SpaceNavigationTabs`.

**Dropped from:**

| Prototype file | CRD component it moved to |
|---|---|
| `dashboard/RecentSpaces.tsx` | `dashboard/RecentSpaces` |
| `space/SpaceNavigationTabs.tsx` | `space/SpaceNavigationTabs` |
| `layout/Header.tsx` (messages icon) | `layouts/Header` |
| `dashboard/DashboardSidebar.tsx` | `dashboard/DashboardSidebar` |
| _(further entries added as phase 1 proceeds)_ | |

`RecentSpaces` originally rendered `<ActivityDot>` inline after `{space.name}`,
gated on `hasContainerActivity(spaceContainer(space.slug))`.

`SpaceNavigationTabs` showed a dot beside a tab label when that tab had unseen
content (`hasContainerActivity(tabContainer(...))`). CRD's `TabItem` is
`{ label, index, href }` — nowhere to hang one.

`DashboardSidebar` rendered `<ActivityDot className="ml-auto mr-1">` after each
My Spaces row, gated on `hasContainerActivity(spaceContainer(slug))`. CRD's
`SidebarResourceItem` renders avatar + name and nothing else.

**Restored 2026-10-06** on the dashboard sidebar, Recent Spaces, the space
tabs, space cards (Explore Spaces, a space's Subspaces tab, innovation hubs),
subspace cards in the feed and post cards, through
`src/ahead/ActivityDotSlots.tsx`: it renders the dot into
production's component after the name, without changing or copying it. The
upstream ask above still stands; when the slots land, that file goes. The
messages icon is not restored: it never had a pulse, only the red dot that
production's header already has.

Still intact (not yet converted): `layout/Sidebar`, `space/SpaceSidebar`,
`space/ChannelTabs`, `space/PostCard`, `space/RichSubspaceCard`.

---

## 8. Dashboard sidebar — icon glyphs and active state

**Dropped from:** `dashboard/DashboardSidebar.tsx` (now wraps CRD's)

| Removed | Note |
|---|---|
| Bot glyph on virtual contributors | `SidebarResourceItem` takes `initials` or an image, not an icon — VCs now show "SM" / "CM" |
| Active-route highlight on menu rows | CRD's rows have hover only; nothing marks the current page |
| `sticky top-20` | Production's `DashboardLayout` scrolls the sidebar with the page, and supplies the `<nav>` itself |

**Kept, outside CRD's component:** the New User View / Has Pending switches.
They are prototype demo controls, not design — they select which dashboard
variant renders without a backend — so they sit in their own block below the
sidebar rather than being smuggled into CRD's markup.

**Needs upstream, if wanted:** an icon/avatar override on `SidebarResourceItem`
(virtual contributors are not people and not spaces), and an `active` flag on
`SidebarMenuItemData`.

---

## 7. Header extras

**Dropped from:** `layout/Header.tsx` (now wraps `@/crd/layouts/Header`)

| Removed | Note |
|---|---|
| Dark / light mode toggle | CRD's `UserMenu` has no theme entry; theme switching is not a production feature |
| Activity dots on the messages icon | Same slot problem as §1 |

**Kept** (CRD supports them directly): breadcrumb trail via the `breadcrumbs`
slot, grid overlay via `showGridToggle`, Beta badge via `user.role`, unread
counts, language switcher, and banner-overlay transparency via `overlayBanner`
+ `overlayHeader`. Cmd+K search is re-implemented in the wrapper — CRD's Header
has no keyboard shortcut.

---

## 2. Reactions on contributions

**What:** an emoji reaction footer inside each contribution card. Confirmed as
wanted by the client — production currently attaches reactions only at callout
level.

**Why it blocks:** CRD's contribution cards own their bordered box and expose no
slots, so a footer cannot be composed in from outside.

**Needs upstream:** `reactionsSlot` on `ContributionPostCard`,
`ContributionMemoCard`, `ContributionWhiteboardCard` — exactly what `PostCard`
already has.

**Dropped from:**

| Prototype file (deleted) | CRD component now used |
|---|---|
| `contribution/ContributionPostCard.tsx` | `contribution/ContributionPostCard` |
| `contribution/ContributionMemoCard.tsx` | `contribution/ContributionMemoCard` |
| `contribution/ContributionWhiteboardCard.tsx` | `contribution/ContributionWhiteboardCard` |

Each rendered, at the foot of the card body:

```tsx
{reactionsEnabled && (
  <div className="mt-2.5 pt-2.5 border-t border-border/60">
    <ReactionBar id={reactionId ?? `contribution-post:${title}`} />
  </div>
)}
```

`reactionsEnabled` defaulted to `true` and was never passed explicitly, so every
contribution in the feed showed a reaction row. Adopting CRD's cards also gains
`signedCopiesCount` / `onOpenSignedCopies` on the memo card, which the prototype
did not have.

Note: the reactions themselves already use production's module — `ReactionBar`
in `space/ReactionBar.tsx` adapts the mock store onto `CalloutReactionsBar`.
Only the *placement inside contribution cards* is blocked.

---

## 3. Settings redesign — TABLED, NOT TOUCHED

Spec `008-profile-settings-redesign` plus the Space/Subspace settings work.
Deliberately **excluded from phase 1** — these files are not being converted.

`space/SpaceSettings*.tsx` · `space/SubspaceSettings*.tsx` ·
`user/UserSettings*.tsx` · `org/OrgSettings*.tsx` · `shared/SettingsSection.tsx`

CRD has its own complete settings suite (`space/settings/*View.tsx`,
`contributor/settings/*`). Reconciling the two designs is a phase-2 decision,
not a mechanical swap.

Measured against upstream `cc126d7a`: production has **every** tab we have —
space 9/9, subspace 5/5, user 6/6, organisation 4/4, pack and template 2/2. So
this is no longer "we are ahead"; it is two complete designs of the same screens
that have never been compared. Tracked as a surface in
[`src/ahead/watchlist.json`](src/ahead/watchlist.json), so each sync re-reports
it rather than leaving it to memory.

---

## 5. Space banner configuration + layout variants

**What:** `SPACE_LAYOUT_CHANGES_SUMMARY.md §1` proposes an admin-configurable
banner — height 80–256px (default 160) plus an interactive crop box, stored in
`localStorage['alkemio-banner-settings']` as `{ image, height, cropY }`.
Separately, `SpaceShell`/`SpaceHeader` carried a `variant` (`?v=1..5`) layout
study where V2+ used a 1536px max-width container so content scales into the
margins on zoom.

**Dropped from:** `space/SpaceHeader.tsx`

- **Crop offset (`cropY`) — removed.** CRD sizes the banner by
  `bannerAspectRatio` (server-bounded 6–10), so there is no way to express a
  crop origin.
- **Layout variants — no longer change rendering.** The `variant` prop is still
  accepted so `SpaceShell` and `SpaceChatPage` compile, but CRD has one header
  layout. `SpaceShell` still branches on `variant` for its own body; that is
  untouched and will need deciding when `SpaceShell` is converted.

**Preserved:** the configured banner **image**, and its **height** — mapped onto
`bannerAspectRatio` as `clamp(6, 1140 / height, 10)`, so a shorter banner still
reads as shorter.

**Needs upstream, if the design is still wanted:** a crop-origin prop on
`SpaceHeader` (e.g. `bannerFocalY`), or agreement that aspect-ratio sizing
replaces height + crop.

---

## 6. Subspace header — avatar, parent stack, member count

**Dropped from:** `space/SubspaceHeader.tsx` (now wraps CRD's)

CRD's `SubspaceHeader` renders title, tagline, banner and action icons only.
No longer shown:

| Removed | Note |
|---|---|
| Subspace avatar (initials / colour / image) | CRD's header has no avatar block |
| Parent space stack | **Moves, not lost** — production shows ancestry in the sidebar via `ParentSpaceStack`. Returns when `SubspaceSidebar` is converted. |
| Member count | No field on CRD's header |
| `onCommunityClick` shortcut | Was attached to the member count |

The props are still accepted by the wrapper so `SubspacePage` compiles
unchanged; they are simply not forwarded.

**Decide in phase 2:** whether the subspace avatar belongs in the header (needs
an upstream prop) or whether production's sidebar-ancestry treatment is
accepted instead.

---

## 9. Callout detail dialog — form framing and memo signing

**Dropped from / moved in:** `dialogs/PostDetailDialog.tsx` (now wraps CRD's
`callout/CalloutDetailDialog`)

| Item | What happened |
|---|---|
| Form questions + responses | **Kept**, rendered through `contributionsSlot`. Production has no form callout type, so there is no framing slot for it. Extracted to `callout/CalloutFormFraming.tsx`. |
| Signed-copies trigger | **Moved**, not lost — it used to sit on the author byline; CRD builds that cluster itself from `callout.author`, so it now sits under the memo framing preview. |
| `contentPreview` blocks + `stats` | **Removed with their data.** Those fields no longer exist on `PostCardData` (aligned to CRD's shape earlier), so the dialog had been referencing fields that were already gone. |

**Needs upstream, if the form callout type is wanted in production:** a
`formFramingSlot` on `CalloutDetailDialog`, plus a `form` value in `PostType`.
Until then `contributionsSlot` is the honest home — the questions are the schema
for what contributors submit and the responses are the contributions.

**Note:** the reactions bar now goes through `reactionsSlot` using the
prototype's `ReactionBar` adapter. This is the slot the dev described — in the
client a `<CalloutReactionsConnector>` is passed here.

---

## 10. Template library — apply-to-space flow

**Dropped from:** `template-library/TemplatePackDetail.tsx` (now wraps CRD's
`innovationPack/InnovationPackProfileView`)

| Removed | Note |
|---|---|
| "Apply pack to a space" dialog | Production has no apply-from-profile flow |
| Per-template apply action | Same — the kebab on a public pack profile is Preview-only |

**Why production works this way:** templates are pulled in from the *target*
Space's own template manager (`TemplatesManagerView` with `canImport`), not
pushed from the library. A viewer on a public pack profile has no template set
of their own to write into, which is why CRD reduces the card menu to Preview
there via `readOnly`.

**Decide in phase 2:** whether push-from-library is a wanted addition, in which
case it needs an `applySlot` (or an `onApply` action) on
`InnovationPackProfileView` upstream.

---

## 11. Chat — message extras and space channels

**Converted:** `layout/MessagesOverlay.tsx` → CRD's `chat/ChatPanel` +
`ChatConversationList` + `ChatThreadView`.

**Dropped, because CRD's chat types have no field for them:**

| Fixture field | Note |
|---|---|
| `muted` on a conversation | No mute state on `ChatListItem` |
| `isEdited` on a message | No edited marker on `ChatMessage` |
| `replyTo` (quoted reply) | No reply-to field; production threads are flat |
| `attachment` (image / document / audio) | No attachment field on `ChatMessage` |

**Needs upstream if wanted:** those four fields on `ChatListItem` /
`ChatMessage`, plus the rendering in `ChatMessageBubble`.

**NOT converted — legacy, not active work:** the space channels —
`messaging/SpaceChannelView`, `messaging/SpaceChatTab`,
`messaging/SpaceChannelComposer`, `messaging/ChatRail`, `pages/SpaceChatPage`
(~2,100 lines). A Slack-style chat channel belonging to a Space. Production has
no channel concept at all, and this is **not reachable in the prototype either**
— `SpaceChatPage` has no route. It is carried over from an earlier project and
left in place in case the idea returns. Deliberately left out of `HANDOVER.md`:
it is not part of this work and would only raise questions in the dev session.

Also still the prototype's: `pages/MessagesPage`, `messaging/ChatView`,
`messaging/ConversationList` and `messaging/NewConversationFlow` — the
full-page messaging surface. CRD models chat only as a panel, so a full page
is another place the prototype leads.

---

## 12. Contributor collection — rich cards

**Where:** `space/SpaceMembers.tsx` (the contributors callout on the community tab)

The community tab is now a **contributors callout**, matching production:
contributors are a callout framing type (CRD's `PostType` has `contributors`
and `spaces`; `CalloutDetailDialog` has the matching framing slots), so the
collection is a post's body rather than a bare grid on a tab.

**Why it does not use `ContributorCollection` itself:** CRD's collection renders
its own `ContributorCard` and exposes **no card slot**.

**Mostly resolved upstream.** As of `cc126d7a`, `ContributorCardData` carries
`tagline`, `tags`, `associatesCount`, `websiteUrl`, `joinedMonthLabel` and
`canMessage` with a "…" menu — i.e. everything the prototype's card shows except
one thing: the **hover card** (`ProfileHoverCard` / `OrgHoverCard`, now in
`src/ahead/`) with bio, tags and location. The richness ask is satisfied; only
the hover behaviour is still ours.

So the collection's chrome is reproduced from CRD primitives (`Tabs`,
`SearchField`, `Button`, `Card`, `Avatar`), matching `ContributorCollection`'s
behaviour exactly — including when each control appears: the type switch at ≥2
types, the role filter only when the active set mixes leads and members.

**Needs upstream (narrowed):** somewhere to hang hover behaviour — a
`cardSlot`/`renderCard` prop, or simply `onContributorHover`. With either, this
file collapses onto CRD's collection with nothing lost. Without it, the swap is
still worth making and costs the hover cards; see the note at the end of
[`src/ahead/README.md`](src/ahead/README.md). Same class of blocker as
`reactionsSlot` on the contribution cards (§2).

Fixed in passing: the rich card hard-coded "Member" for every person regardless
of role, so a Host or Admin read as Member. It now shows Lead / Member, which
also makes the badges agree with the role filter's counts.

---

## 4. Other prototype-only features

Not blocked — no CRD equivalent exists at all, so they simply stay:
richer subspace cards (`RichSubspaceCard`), contributor hover cards
(`ProfileHoverCard`, `OrgHoverCard`, `VCHoverCard`), the analytics pages,
memo signing explorations, the v2/v3 creation dialogs, and the mockup pipeline.

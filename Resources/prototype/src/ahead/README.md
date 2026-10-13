# Ahead of production

**This folder is the agenda for the next design/development conversation.**

The prototype is always a few steps ahead of
[client-web](https://github.com/alkem-io/client-web): that is its job. The risk
is that "ahead" quietly becomes "diverged" — production builds the same thing,
nobody notices, and two versions drift apart for months.

This folder is how that gets noticed. It tracks everything the prototype has
that production does not, in two forms:

- **Components** — single files, living in this folder.
- **Surfaces** — whole pages, flows and tab sets, too big to move here. They
  stay where they are and are listed in [`watchlist.json`](./watchlist.json).

Either way, `npm run sync:crd` reports on them every time it runs. Nobody has
to remember.

## How something leaves

1. `npm run sync:crd:check` reports what changed upstream.
2. The report ends with the ahead-of-production check: for components, a name
   match upstream; for surfaces, a count of how many of their parts now exist
   upstream. That is the graduation signal.
3. Delete ours, repoint the imports to `@/crd/…`, record it below.

Read a surface marked `[!]` as: *production has this now — our version is a
duplicate, and anything built on top of it is being built twice.*

## Components in this folder

Each one carries a header comment saying what it is and why production should
have it. That comment is what development reads.

| Component | What production would gain |
|---|---|
| `ProfileHoverCard` | Hovering a person shows bio, skills and location without leaving the page — wherever a person appears: avatars, names, comment and post authors, chat, lists, sentences like "Simone Rietmeijer on Thu". Needs a way to give a hover card to the components that show a contributor (`CommentItem`, `ChatMessageBubble`, `ContributorCard`, `PostCard`, `ActivityItem`, …), e.g. a `renderContributor` slot. Until then a stand-in shows them across the whole app (`app/components/shared/ContributorHoverLayer`, not part of the ask) |
| `OrgHoverCard` | The same for organisations |
| `VCHoverCard` | The same for virtual contributors |
| `ActivityDot` | A small animated dot marking what is new since your last visit, right after the name: My Spaces rows, Recent Spaces cards, space tabs, space and subspace cards, post cards. Needs an optional `nameSuffix` slot on `SidebarResourceItem`, `CompactSpaceCard`, `SpaceNavigationTabs`' `TabItem`, `SpaceCard`, `ExpandedSpaceCard` and `PostCard`. Until then a stand-in places it (`app/components/shared/ActivityDotSlots`, not part of the ask) |
| `TruncatedPostDescription` | Collapsed posts cut cleanly at 3 lines — no fade over text or images; a hero image crops to 160px, later images wait for "Read more", an image-only post crops like a hero. Needs a `descriptionSlot` on `PostCard` (or the behaviour in `ExpandableMarkdown`) |
| `ThreeColumnContributionGrid` | A callout's contributions three across on wide screens instead of two, cards closer to thumbnail size. Collapsed, it shows the first row in full plus a clean cut through the middle of the second, so it is clear there is more; production clips at a fixed 220px, which leaves a thin strip that reads as a mistake. The button says how many are hidden ("+3 more"), not the total. Needs a `columns` prop on `ContributionGrid` (and `ContributionsPreviewSkeleton`), and the collapse measured from the first row |
| `TimeGroupedChatThreadView` | Calmer chats (client-web#10377): messages grouped by sender and time, a time only at the start of each day and after an hour of quiet, the exact time of any message on hover or tap. Needs a time-aware `computeMessageRunFlags`, a way to leave out `ChatMessageBubble`'s timestamp line, and separators in `ChatThreadView` |
| `ChatOptionsMenu` | A tidier chat header (client-web#10378): the gear stays in the chat list only, so it no longer pulls you out of a chat; group chats get a "more" menu with Group settings and Leave group, with room for mute and pin later; tapping the group's picture or name opens its settings. The menu fits `ChatPanel`'s `headerActions`; the tap needs an `onTitleClick` on `ChatPanel`. Until then a stand-in in `MessagesOverlay` listens for it (not part of the ask) |
| `FilledGroupAvatar` | Group avatars that fill the circle (client-web#10378): halves for two faces, a half and two quarters for three, quarters for four, three faces and "+N" from five. The ask is for `GroupAvatar` itself to change to this, which fixes the chat list and header at once. Until then a stand-in draws it over the list's avatars (`app/components/shared/ChatGroupAvatarSlots`, not part of the ask) |
| `BandedResponseCards` | Memo, whiteboard and document responses without the blue title fade (product#2207): a label strip in the platform background colour, with a thin line above it, holds the author's profile picture, the title and the author, so the label reads apart from the preview; memo previews shrink to a grey thumbnail with no fade; cards are a fixed 200px so the collapsed grid never cuts off the label; the hover wash stays and sits under the strip. The ask is to change the footer of `ContributionMemoCard`, `ContributionWhiteboardCard` and `ContributionDocumentCard` themselves. A name check cannot see this graduate: after each sync, check whether production's cards still use `bg-gradient-to-t` |

If this list grows past ten or so entries, the process has stopped working.
Nothing else belongs in this folder: not pages, not mock data, not wrappers
around components production already has.

## Surfaces on the watchlist

Status as of upstream `13cd741a` (2026-10-09). Run the check for current numbers.

| Surface | Upstream | Note |
|---|---|---|
| Space settings | `[!]` 9/9 | Production built the full tab set. Ours is now the duplicate. |
| Subspace settings | `[!]` 5/5 | Production reuses the space views one level down. |
| User profile settings | `[!]` 6/6 | Profile, notifications, security, organisations, memberships. |
| Organisation settings | `[!]` 4/4 | Profile, associates, invitations. |
| Pack and template settings | `[!]` 2/2 | `InnovationPackAdminView`, `InnovationPackForm`. |
| Subspace application wizard | `[~]` 1/2 | `ApplicationFormEditor` landed; the wizard has not. |
| Memo signing | `[~]` 1/2 | `MemoSigningDialog` landed; the signature panel has not. |
| Template detail as a full page | `[ ]` 0/2 | Still a dialog upstream. |

**The settings surfaces are the live question for the dev session.** The
prototype designed them ahead of production, production has since built its
own, and the two have not been compared. Converting them is deliberately
*parked*, not forgotten — the designs need to be looked at side by side first,
because whichever way that goes, one of the two sets is redundant work.

## Recently graduated

Kept as a record, so it is clear the process works:

| Was | Became | Status |
|---|---|---|
| `CalloutFormFraming` and the prototype's form flow | Production's forms: `CalloutFormBox`, `CalloutFormFillIn`, `CalloutFormOwnResponses`, `CalloutFormResponsesTable`, `CalloutFormResponseDialog`, `FormQuestionsEditor`, `FormSettingsDialog` | **Done** on 2026-10-13, by design decision: follow production. A form is now added to a post ("Add to post"), not a response type. Ours is deleted; `app/components/callout/PostFormBox` only holds demo state. Production's version also brought multiple-choice, one-or-many responses and open/closed. The compact post dialog exploration still shows the old model. |
| `MemoFramingPreview` | `crd/components/space/PostCard` (memo framing now `aspect-video`) and `CalloutCollaboraPreview` (one 16:9 size, `compact` removed) | **Done** at `13cd741a`. Deleted; the prototype's `PostCard` lets CRD draw both previews again. Production's memo box is ours with 12px padding instead of 16px. |
| `RichSubspaceCard` | `crd/components/space/ExpandedSpaceCard` | **Done.** Deleted; `SpaceFeed` renders CRD's card through `richSubspaceToSpaceCard()`. |
| Our rich contributor cards | `crd/components/callout/ContributorCollection/ContributorCard` — gained tagline, tags, associates count, website, join month and messaging | **Noticed, waiting on one thing.** Adopting it today costs the hover cards, because the collection draws its own. Held until there is a slot or an `onContributorHover` — not forgotten. PHASE-2 §12. |

Graduating costs something each time, and that cost is the next upstream ask:

- `ExpandedSpaceCard` has no activity indicator, so subspace cards lost their
  `ActivityDot`. Back since 2026-10-06 through a stand-in
  (`app/components/shared/ActivityDotSlots`); what it
  still needs upstream is somewhere to go on CRD's cards.
- `ContributorCollection` renders its own cards with no slot, so adopting it
  costs the hover cards. Same shape of ask: a slot, or an `onContributorHover`.

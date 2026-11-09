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

Read a surface marked `[!]` as: *production has screens by these names — compare
what each one does, then decide.* A name match alone does not make ours a
duplicate.

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
| `BandedResponseCards` | Memo, whiteboard and document responses without the blue title fade (product#2207): a label strip in the platform background colour, with a thin line above it, holds the author's profile picture, the title and the author, so the label reads apart from the preview; memo previews are compact, with dark headings and grey body text like a post response, and cut cleanly with no fade; cards are a fixed 200px so the collapsed grid never cuts off the label; the hover wash stays and sits under the strip. Post responses, which have no preview, get the same label at the top: picture, title, then "author · date" in grey. Links and files become the same 200px card in the same grid instead of a list: a plain link icon or the coloured file type as the picture, the label strip giving the title with the address or file type ("PDF") in grey, "Open Link" (a new string) or "Download" on hover. No profile picture, file size or site icon on these: links do not carry them, so they would need server work, and they are parked until after the server move. The ask is to change `ContributionMemoCard`, `ContributionWhiteboardCard`, `ContributionDocumentCard` and `ContributionPostCard` themselves, and to show links as these cards. A name check cannot see this graduate: after each sync, check whether production's cards still use `bg-gradient-to-t` |
| `TitleFirstPostHeader` | Posts in the feed lead with what they are about: the title on top beside the author's picture, "author · time" subtle underneath, the same order as the label on response cards. Needs a header layout option on `PostCard` (or this as its default). Until then a stand-in places it (`app/components/shared/TitleFirstHeaderStandIn`, not part of the ask) |
| `NewActivitySettingsSection` | A person controls the new-activity dots from their notification settings: dots on or off, and mark everything as read, with undo. Sits beneath production's `UserNotificationsTabView`. Needs a place for it in that view, or a section of its own |
| `ShareQrCode` | A QR code in the share dialog (alkemio#2222): small beside Copy QR code, Download image and Show larger; clicking it fills the dialog for a room to scan. Navy rounded squares, Alkemio logo in the centre; the download is a PNG named after the item; a reminder that only people with access can open it, hidden for public items. Needs nothing structural: `ShareDialog` already renders `children`. The ask is to render it in every share dialog, pass the item's access, and add its strings to `crd-common`. Shown on forum discussions |
| `DigitalSigningSettingsSection` | A person links their Cleverbase account for digital signing, which memo signing depends on. Sits beneath production's `UserSecurityTabView`. Needs a place for it in that view, or a section of its own |

If this list grows past ten or so entries, the process has stopped working.
Nothing else belongs in this folder: not pages, not mock data, not wrappers
around components production already has.

## Surfaces on the watchlist

Status as of upstream `4f6f3811` (2026-11-06). Run the check for current numbers.

| Surface | Upstream | Note |
|---|---|---|
| Pack and template settings | `[!]` 2/2 | `InnovationPackAdminView`, `InnovationPackForm`. Not compared yet, and not part of the settings decision below. |
| Subspace application wizard | `[~]` 1/2 | `ApplicationFormEditor` landed; the wizard has not. The form builder for proposing a subspace stays ours, beneath production's Subspaces tab. |
| Memo signing | `[~]` 1/2 | `MemoSigningDialog` landed; the signature panel has not. |
| Template detail as a full page | `[ ]` 0/2 | Still a dialog upstream. |
| Databank praktijkvoorbeelden | `[ ]` 0/3 | Subspaces as a filterable database. |

## Settings: we follow production

**Decided by Jeroen on 2026-11-06.** Production built our settings pages, so space,
subspace, profile and organisation settings use production's screens wherever
possible. Only what production cannot do yet stays ours. This replaces the earlier
"parked" position and the earlier decision that our space settings stay.

**Stays ours, because production does not have it:**

| What | Where it sits | Ask for production |
|---|---|---|
| New-activity dot settings | Beneath Notifications (`NewActivitySettingsSection`) | A place for it in `UserNotificationsTabView` |
| Cleverbase digital signing | Beneath Security (`DigitalSigningSettingsSection`) | A place for it in `UserSecurityTabView` |
| Form builder and applications review for proposing a subspace | Beneath the space Subspaces tab | A place for it in `SpaceSettingsSubspacesView` |
| "Start collapsed" for the sidebar | Beneath the space Layout tab | A setting in `SpaceSettingsLayoutView` |
| Search box for an organisation's associates | Above the Associates tab | A search field in `OrgAssociatesTabView` |
| Save Flow as Template | In the subspace Layout tab's header actions | A flow-only save in `SpaceSettingsLayoutView` |
| A short explanation of each sidebar widget (widget hints, approved 2026-10-07) | Not shown any more: production's sidebar dialog lists names only, with no place for them | A one-line hint per widget in `PhaseLayoutDialog`. The wording is in `app/components/space/SidebarWidgets.tsx` |

**Goes away with our old screens. Agreed with Jeroen on 2026-11-06: follow production as closely as possible.**

| What | Area | Why it does not stay |
|---|---|---|
| Reordering tabs on a top-level space | Space Layout | Production blocks this on purpose |
| Collapsible columns that spring open while dragging | Space and subspace Layout | No way to add it without changing production's screen |
| A separate on/off for tag chips | Space and subspace Layout | Production includes tags in Search, so turning Search on now turns on both |
| Archiving a subspace | Subspace settings, Subspaces | Production can filter archived subspaces but has no way to archive one. **Ask for production:** an archive action in `SpaceSettingsSubspacesView` |
| Title and pinning on an update | Subspace settings, Updates | Production left these out on purpose: the server does not store them |
| Filter and sortable columns on members | Subspace settings, Community | No way to add it without changing production's screen |
| License card | Profile, Account | Not in production's screen |
| Cancel an application (the button did nothing yet) | Profile, Membership | Not in production's screen |
| Privacy switches (they had no effect yet) | Profile, Settings | Not in production's screen |

Also gone, as small differences that follow from the same decision:

- **Space:** dragging a banner freely (production's crop dialog replaces it), the
  avatar on top-level spaces, the storage count card, the plans link, the link from
  the classification picker to Templates, and the hover card on virtual contributors
  in Community, which is one more place for the hover-card slot asked for under
  `ProfileHoverCard`.
- **Profile:** the Twitter field (production has Bluesky), the overall email and
  in-app switches (production has one per kind of notification), and the application
  date, status and member counts on Membership.
- **Organisation:** the second domain switch on Associates (it is still on Settings).
- **Subspace:** the parent space's avatar in the About preview, per-section save
  buttons, summary tiles, virtual contributors at subspace level, member counts and
  last-active dates on subspaces, the four fixed flows in Load Template (production's
  template picker replaces them), and the row of phases above the Layout board.
- **Everywhere:** buttons that never did anything, and the sidebar mode choice, which
  was never saved.

**Where the demo falls short of production, and why that is fine for now:**

- Production's sidebar dialog offers widgets our member pages cannot show yet
  (Apply/Join, Latest Update, Contact Leads, Virtual Contributors, Community
  Guidelines, Community, Recent Activity). Choosing one does nothing, and the choice
  is forgotten on reload.
- Subspace sidebar choices save in settings, but the member subspace page does not
  read them. It never did.
- Post collapse is per tab in the dialog, but our feeds read one setting, so a change
  affects every tab. Tab renames, added tabs and the publisher switch do not reach
  member pages.
- Demo changes mostly reset on reload.

## Recently graduated

Kept as a record, so it is clear the process works:

| Was | Became | Status |
|---|---|---|
| Our space, subspace, profile and organisation settings | Production's settings screens in `crd/components/space/settings`, `user/settings`, `organization/settings` and `contributor/settings` | **Done** on 2026-11-06 at `4f6f3811`, by design decision: follow production. Our old tabs are deleted, and each tab now holds only demo state around production's screen (`app/components/space/settings`, `user/settings`, `org/settings`). See "Settings: we follow production" above. |
| `TimeGroupedChatThreadView`, `ChatOptionsMenu`, `FilledGroupAvatar` | Production's own `ChatThreadView` (day separators, a time after an hour of quiet, exact time on hover or tap, grouped corners), `ChatOptionsMenu`, `ChatPanel`'s `onTitleClick`, and `GroupAvatar` filling the circle | **Done** at `71f8ddcf` (client-web#10377, #10378). All three deleted, and both stand-ins with them (`ChatGroupAvatarSlots` and the title-click listener in `MessagesOverlay`). Production also added an expand/collapse toggle to the chat panel. Still not built anywhere: reactions overlapping the bubble's bottom edge. |
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

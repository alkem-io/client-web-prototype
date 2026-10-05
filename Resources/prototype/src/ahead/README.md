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
| `ProfileHoverCard` | Hovering a person shows bio, skills and location without leaving the page |
| `OrgHoverCard` | The same for organisations |
| `VCHoverCard` | The same for virtual contributors |
| `ActivityDot` | A small animated dot marking what is new since your last visit |
| `CalloutFormFraming` | Forms as a callout type — a question set people answer in a space |
| `ThreeColumnContributionGrid` | A callout's contributions three across on wide screens instead of two — six visible while collapsed, cards closer to thumbnail size. Needs a `columns` prop on `ContributionGrid` (and `ContributionsPreviewSkeleton`) |

If this list grows past ten or so entries, the process has stopped working.
Nothing else belongs in this folder: not pages, not mock data, not wrappers
around components production already has.

## Surfaces on the watchlist

Status as of upstream `cc126d7a` (2026-10-02). Run the check for current numbers.

| Surface | Upstream | Note |
|---|---|---|
| Space settings | `[!]` 9/9 | Production built the full tab set. Ours is now the duplicate. |
| Subspace settings | `[!]` 5/5 | Production reuses the space views one level down. |
| User profile settings | `[!]` 6/6 | Profile, notifications, security, organisations, memberships. |
| Organisation settings | `[!]` 4/4 | Profile, associates, invitations. |
| Pack and template settings | `[!]` 2/2 | `InnovationPackAdminView`, `InnovationPackForm`. |
| Subspace application wizard | `[~]` 1/3 | `ApplicationFormEditor` landed; the wizard and form-as-callout have not. |
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
| `RichSubspaceCard` | `crd/components/space/ExpandedSpaceCard` | **Done.** Deleted; `SpaceFeed` renders CRD's card through `richSubspaceToSpaceCard()`. |
| Our rich contributor cards | `crd/components/callout/ContributorCollection/ContributorCard` — gained tagline, tags, associates count, website, join month and messaging | **Noticed, waiting on one thing.** Adopting it today costs the hover cards, because the collection draws its own. Held until there is a slot or an `onContributorHover` — not forgotten. PHASE-2 §12. |

Graduating costs something each time, and that cost is the next upstream ask:

- `ExpandedSpaceCard` has no activity indicator, so subspace cards lost their
  `ActivityDot`. The dot stays in this folder; what it needs upstream is
  somewhere to go on CRD's cards.
- `ContributorCollection` renders its own cards with no slot, so adopting it
  costs the hover cards. Same shape of ask: a slot, or an `onContributorHover`.

# Where this branch is at

Branch: `crd-alignment` · 5 commits, all signed · **not merged, no PR open**

## What we set out to do

The prototype and production had drifted apart. Every handover cost time
reconciling the differences. So: make the prototype use production's actual
components, so what we design is what gets built.

## What changed

The prototype now uses **111 of production's components**, up from 13. (That is
the number of distinct components imported from `src/crd/` — reproducible, not
an estimate.)

These screens are now built from production's components rather than our own
copies:

| Screen | What it means |
|---|---|
| Dashboard | Sidebar, recent spaces, activity feeds, My Spaces panel |
| Space pages | Header, tabs, sidebar, post cards, the post detail dialog |
| Subspace pages | Header, sidebar, community dialog |
| Search | The whole overlay |
| Innovation Hub | Banner, spaces, packs, virtual contributors |
| Template library | Browse page and pack pages |
| Forum | All of it |
| Chat | The panel and the bubble in the bottom-right corner |
| Comments | Threads, replies and reactions, everywhere comments appear |
| Profiles | User, organisation and virtual-contributor profile pages |

## What we kept as ours, on purpose

These are places the prototype is **ahead** of production. They stay.

- Hover cards on people, organisations and virtual contributors
- Activity dots showing what's new
- Emoji reactions on individual contributions
- Forms as a callout type
- Memo signing
- The template detail page — production shows a pop-up, we show a full page
- The mobile layout studies

Two things dropped off this list because production built them: the richer
subspace cards (now CRD's `ExpandedSpaceCard`) and the richer contributor cards
(CRD's `ContributorCard` gained tagline, tags, associates count, website, join
month and messaging). That is the process working — see below.

Everything we removed to make room is written down in `PHASE-2.md`, with what
it would take to bring each one back. Nothing was thrown away.

## How we stop drifting again

Being ahead of production is the prototype's job. Quietly staying ahead after
production catches up is the problem — two versions of the same screen, both
being maintained, neither known to be a duplicate.

So everything we are ahead on is now tracked in one place, `src/ahead/`:

- Single components live in that folder, each with a comment saying what it is
  and why production should have it. **That folder is the agenda** — it is meant
  to be read as a list of things to decide on.
- Bigger pieces — whole pages and flows — stay where they are and are listed in
  `src/ahead/watchlist.json`.

Every `npm run sync:crd` ends by reporting on both: a component whose name now
exists upstream, and for each larger surface, how many of its parts production
has built. No one has to remember.

**The first thing it found: settings.** Production has built every settings tab
the prototype has — space 9/9, subspace 5/5, user 6/6, organisation 4/4, packs
and templates 2/2. So settings are not "ahead" any more; they are two complete
designs of the same screens that have never been put side by side. We have
deliberately not converted them, because that comparison is a design decision,
not a mechanical swap. It is the main thing we would like to go through
together.

## What we need from the dev team

**Three small additions to the design system.** Each one unblocks something we
had to remove:

1. **A slot for reactions on contribution cards.** The card owns its own box, so
   we can't add a reaction row from outside. The post card already has this —
   the contribution cards need the same.
2. **A slot for a badge next to a name**, on space cards, sidebar rows and tabs.
   This is what the "new activity" dot needs.
3. **A way to hang a hover card on the contributor collection** — either "let us
   supply the card" or just an "on hover" callback. Production's card has caught
   up on content (skills, join date, website, messaging); the one thing it can't
   do is show a profile preview on hover, and the collection draws its own cards,
   so there is nowhere to put it.

**Three bugs we found in production.** Written up with measurements in
`UPSTREAM-BUGS.md`:

1. **The font never loads.** The design system asks for Inter, but the app never
   downloads it — so production actually renders in the system font. The
   spacing was tuned for Inter, so it doesn't look as intended. Two lines to
   fix.
2. **Four text styles are missing** from the styling helper, so they get
   silently dropped.
3. **A text style is documented as 14px but is actually 12px.**

**One thing we did differently on purpose.** Production uses a different page
width on different pages — the template library, the pack page and everything
else each sit at a different margin. We made them consistent. Production already
has a helper for this that isn't being used everywhere. Worth a look.

## Worth knowing

- The prototype runs on **localhost:5174**.
- Inter is currently switched **off**, so the prototype looks like production
  does today. One line in `src/styles/index.css` turns it back on.
- `src/crd/` is a straight copy of production's design system. Never edit it —
  changes go into client-web and come back on the next sync.

## Not done yet

- One dialog: the classification picker. It is only reachable from Space
  settings, which we are leaving alone for now, so it waits for that work.

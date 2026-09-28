# Where this branch is at

Branch: `crd-alignment` · 5 commits, all signed · **not merged, no PR open**

## What we set out to do

The prototype and production had drifted apart. Every handover cost time
reconciling the differences. So: make the prototype use production's actual
components, so what we design is what gets built.

## What changed

The prototype now uses **70 of production's components**, up from 13.

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

## What we kept as ours, on purpose

These are places the prototype is **ahead** of production. They stay.

- The settings redesign (space, subspace, user, organisation)
- Activity dots showing what's new
- Emoji reactions on individual contributions
- Richer subspace cards and contributor cards
- Memo signing
- The template detail page — production shows a pop-up, we show a full page
- Space channels — production has no channels at all
- The mobile layout studies

Everything we removed to make room is written down in `PHASE-2.md`, with what
it would take to bring each one back. Nothing was thrown away.

## What we need from the dev team

**Three small additions to the design system.** Each one unblocks something we
had to remove:

1. **A slot for reactions on contribution cards.** The card owns its own box, so
   we can't add a reaction row from outside. The post card already has this —
   the contribution cards need the same.
2. **A slot for a badge next to a name**, on space cards, sidebar rows and tabs.
   This is what the "new activity" dot needs.
3. **A way to supply your own card** to the contributor collection. Ours shows
   skills, join date and a hover card; production's shows name and role only.
   Right now it's one or the other.

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

- Comments are still ours everywhere — production has a full comment system we
  haven't adopted.
- User profile and organisation pages.
- Three dialogs that have a production equivalent.

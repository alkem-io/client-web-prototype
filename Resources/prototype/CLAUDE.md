# prototype/ — Visual Design Guide

This folder is a **design reference** for building `src/crd/` components. It demonstrates visual patterns and standards that developers should follow.

## For Developers Building `src/crd/`

Use this prototype as a visual reference for:
- Button patterns and variants
- Dialog layouts and footer patterns
- Placeholder card patterns (responses, resources, etc.)
- Consistent sizing, spacing, and interaction patterns

## Button System Standards

### Primary CTAs (`variant="default"`)
**Use for:** Main actions that move user forward
- Create Space
- Create Resource
- Create Subspace
- Post Comment
- Save Changes
- Submit Form

**Pattern:** Right side of dialog, paired with Cancel/Back on left
**Size:** `default` (36px height) for standard, `lg` (40px) for hero sections

---

### Secondary Buttons (`variant="secondary"`)
**Use for:** Important alternative CTAs (rare)
- Next Step (when primary is Confirm)
- Preview (when primary is Publish)

**Rule:** Use sparingly, always paired with primary button

---

### Outline Buttons (`variant="outline"`)
**Use for:** Navigation, secondary actions, tertiary CTAs
- Load More
- Browse All
- Cancel (alternative to ghost)
- Secondary navigation

**Pattern:** `size="sm"` for compact, `default` for standard

---

### Ghost Buttons (`variant="ghost"`)
**Use for:** Minimal, contextual actions
- Cancel in dialogs (left side of button pair)
- Back buttons in multi-step flows (with left chevron icon)
- Toolbar buttons
- Icon buttons (use IconButton wrapper always)

**Rule:** Back button: `size="sm"` with `className="gap-1 px-2"`

---

### Link Buttons (`variant="link"`)
**Use for:** Text-only actions in content
- Show more / Show less (for expanded content)
- Learn more in paragraphs
- See all X (navigation links)

**Pattern:** `size="sm"` for inline text, no size param for standard

---

### Destructive Buttons (`variant="destructive"`)
**Use for:** Dangerous actions in confirmation dialogs ONLY
- Delete Space
- Remove Member

**Rule:** Never elsewhere. Pair with Cancel button on left.

---

## Dialog Footer Pattern (Standard)

**Multi-step dialog:**
```
[← Back] [Cancel/ghost] [Primary action/default]
```

**Simple dialog:**
```
[Cancel/ghost] [Primary action/default]
```

**Destructive confirmation:**
```
[Keep/ghost or outline] [Delete/destructive]
```

---

## PlaceholderCard Pattern

**Use for:** Collections where users add multiple items
- Response types (whiteboards, documents, posts)
- Resources
- Documents
- Templates
- Subspaces

**Component:** `PlaceholderCard` in `src/app/components/ui/placeholder-card.tsx`

**Sizes:**
- `size="sm"` (160px) — Most collections
- `size="lg"` (280px) — Prominent creates (spaces, VCs)

**Pattern:** Use in grid alongside actual items. Much more discoverable than small buttons.

---

## Icon Button Rule

**Every icon-only button must use `IconButton` wrapper.**

This component provides:
- Automatic tooltips
- Proper aria-labels
- Consistent focus states

```tsx
<IconButton
  variant="ghost"
  tooltipLabel="Delete"
>
  <Trash className="w-4 h-4" />
</IconButton>
```

---

## Size Pairings

| Button Size | Use Case | Icon Size |
|---|---|---|
| `sm` (32px) | Compact forms, dialogs, back buttons | w-4 h-4 |
| `default` (36px) | Standard forms, CTAs, main buttons | w-4 h-4 |
| `lg` (40px) | Hero CTAs, prominent actions | w-5 h-5 |
| `icon` (36px square) | Icon-only, use IconButton wrapper | w-4 h-4 |

---

## Label Standards

**Action Verbs:**
- Create (new items): "Create Space", "Create Resource"
- Add (to collection): "Add Member", "Add Resource"
- Contribute (responses): "Add Whiteboard", "Add Document"
- Submit/Save (forms): "Save Changes", "Submit Form"
- View/Navigate: "Open Whiteboard", "View Details"
- Load/Show: "Load More", "Show More"
- Delete (danger): "Delete Space" (explicit label)
- Cancel/Exit: "Cancel", "Close"

---

## For Designers & Stakeholders

This prototype demonstrates:
- ✅ Consistent button variants
- ✅ Standardized dialog layouts
- ✅ Placeholder card pattern for response discoverability
- ✅ Proper icon button implementation with tooltips
- ✅ Clear visual hierarchy and interaction patterns

Reference this when reviewing designs or providing feedback to developers.

---

**Last Updated:** June 30, 2026
**Status:** Visual Design Guide (in progress)

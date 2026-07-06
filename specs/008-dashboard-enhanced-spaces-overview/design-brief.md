# Design Brief: Enhanced Dashboard Spaces Overview

> **Feature**: Multi-row dashboard view with categorized spaces  
> **Status**: Design Phase  
> **Created**: 2026-07-06  
> **Iteration**: Feedback-driven enhancement to 007-dashboard-spaces-view  
> **Goal**: Provide users with a richer visual overview of their spaces organized by relationship type and activity

---

## 1. Problem Statement

The current "Normal" dashboard view (007-dashboard-spaces-view) displays all spaces in a single, sequential gallery. While this works, it lacks hierarchy and context. Users must scroll through all spaces to find what they're looking for, missing important information:

- Which spaces they lead or administer?
- Which spaces they host?
- What's their most recently active spaces?
- Which spaces have they pinned for quick access?

**User Need**: A dashboard that surfaces spaces by relationship type and relevance in one view, reducing cognitive load and enabling faster navigation.

---

## 2. Design Principles

1. **Organized Hierarchy** — Group spaces by user relationship (pinned → recent → leading → hosting → active)
2. **Smart Deduplication** — Each space appears once, in its highest-priority row
3. **Visual Clarity** — Light, simple refinement of existing view; not a busy dashboard
4. **Scannable** — Row headers and clear section breaks let users quickly find what they need
5. **Consistent Patterns** — Reuse existing SpaceCard component and grid layout
6. **Progressive Disclosure** — "Show more" buttons available for lead/host rows; other rows are max 4 items

---

## 3. Current State vs. Enhanced State

### Current (007-dashboard-spaces-view)
- Single vertical gallery of all spaces
- Ordered by creation date
- LOAD MORE pagination every 8 items
- No categorization or hierarchy

### Enhanced (This Brief)
- 5 categorized rows with specific ordering
- Smart deduplication across rows
- Different "show more" behaviors per row
- Placeholder cards for empty pinned slots
- Cleaner, more scannable layout

---

## 4. Visual Layout & Row Structure

### Row Ordering (Top to Bottom)

```
┌────────────────────────────────────────────────────────────────┐
│ 1. MY PINNED SPACES                                   [4 slots]│
│    ├─ [Card 1] [Card 2] [Card 3] [Placeholder]                │
│    └─ (Always shows 4 slots; unfilled = placeholder cards)     │
├────────────────────────────────────────────────────────────────┤
│ 2. MY RECENT SPACES                                    [max 4] │
│    ├─ [Card 1] [Card 2] [Card 3]                              │
│    └─ (No "show more"; max 4 items)                           │
├────────────────────────────────────────────────────────────────┤
│ 3. SPACES I LEAD & ADMINISTER                          [4 + SM]│
│    ├─ [Card 1] [Card 2] [Card 3] [Card 4]                    │
│    └─ [ Show More >> ]  (if >4 spaces; shows rest in dialog)  │
├────────────────────────────────────────────────────────────────┤
│ 4. SPACES I HOST                                       [4 + SM] │
│    ├─ [Card 1] [Card 2] [Card 3] [Card 4]                    │
│    └─ [ Show More >> ]  (if >4 spaces)                        │
├────────────────────────────────────────────────────────────────┤
│ 5. SPACES WITH MOST ACTIVITY                           [max 4] │
│    ├─ [Card 1] [Card 2] [Card 3] [Card 4]                    │
│    └─ (No "show more"; max 4 items)                           │
└────────────────────────────────────────────────────────────────┘
```

---

## 5. Row Specifications

### Row 1: My Pinned Spaces

**Purpose**: Quick access to frequently-used spaces  
**Max Items**: Always 4 slots (fixed)  
**Behavior**:
- Shows exactly 4 card slots, always
- Pinned spaces (where `isPinned === true`): display as real cards
- Empty slots: display as placeholder cards (identical design to the "pin a space" placeholder on Profile > Account tab)
- User can click placeholder to open a "Browse & Pin" modal
- Sorted by: most-recently-pinned-first

**Placeholder Card Design**:
- Same dimensions as SpaceCard
- Centered icon: Pin with a `+` (or similar "add" indicator)
- Centered text: "Pin a space" (or "Add to pinned")
- Ghost/muted background styling
- Click → Opens modal to browse unpinned spaces to pin

**Example States**:
- 0/4 pinned: 4 placeholder cards
- 2/4 pinned: 2 real cards + 2 placeholders
- 4/4 pinned: 4 real cards

---

### Row 2: My Recent Spaces

**Purpose**: Quickly revisit recently-edited spaces  
**Max Items**: 4 (no "show more")  
**Behavior**:
- Shows up to 4 spaces
- Sorted by: last-edited-first (most recent first)
- Only shows spaces not already in Row 1 (deduplication)
- If fewer than 4: shows all available, gap is empty
- If 0 available: row does not render

**Data Requirement**: `lastModified` or `lastEdited` timestamp on space

---

### Row 3: Spaces I Lead & Administer

**Purpose**: Access and manage spaces where user has leadership role  
**Max Visible Items**: 4 (shows 4 by default)  
**"Show More" Behavior**: If more than 4, shows a "Show More" button that opens a centered modal dialog

**"Show More" Modal**:
- Title: "Spaces I Lead & Administer"
- Grid layout: same 3-4 column responsive grid as main rows
- Displays all spaces in this category
- Click a card to navigate to that space
- Close modal to return to dashboard
- Same SpaceCard component as in rows

**Sorting**: most-recently-created-first (within this category)  
**Data Requirement**: User role field (e.g., `userRole === 'lead' || 'admin'`)

**Edge Cases**:
- 0 spaces: row does not render
- 1-4 spaces: show all, no "Show More" button
- 5+ spaces: show 4 + "Show More" button

---

### Row 4: Spaces I Host

**Purpose**: Access and manage spaces where user is the host/creator  
**Max Visible Items**: 4 (shows 4 by default)  
**"Show More" Behavior**: Identical to Row 3

**Data Requirement**: `userRole === 'host'` or space creator

**Edge Cases**: Same as Row 3

---

### Row 5: Spaces with Most Activity

**Purpose**: Discover high-engagement spaces  
**Max Items**: 4 (no "show more")  
**Behavior**:
- Shows up to 4 most-active spaces
- "Activity" = any contribution (post, comment, whiteboard edit, response)
- Sorted by: most-active-first (time window = last 30 days; implementation detail)
- Only shows spaces not already in Rows 1–4 (deduplication)
- If fewer than 4: shows all available
- If 0 available: row does not render

**Data Requirement**: Activity score or last-activity timestamp per space

---

## 6. Deduplication Logic

**Rule**: A space appears in exactly one row — the highest-priority row it qualifies for.

**Priority Order**:
1. Pinned? → Row 1
2. Recent? → Row 2
3. Lead/Administer? → Row 3
4. Host? → Row 4
5. High Activity? → Row 5
6. (Not in any category → hidden)

**Implementation**:
```
pinnedSpaces = getSpaces().filter(s => s.isPinned).slice(0, 4)
placeholderCount = 4 - pinnedSpaces.length

recentSpaces = getSpaces()
  .filter(s => !s.isPinned) // exclude pinned
  .filter(s => isRecent(s))
  .sort(byLastEdited)
  .slice(0, 4)

leadSpaces = getSpaces()
  .filter(s => !s.isPinned && !recentSpaces.includes(s)) // exclude higher-priority rows
  .filter(s => s.userRole === 'lead' || 'admin')
  .sort(byCreatedDate)

hostSpaces = getSpaces()
  .filter(s => !s.isPinned && !recentSpaces.includes(s) && !leadSpaces.includes(s))
  .filter(s => s.userRole === 'host')
  .sort(byCreatedDate)

activitySpaces = getSpaces()
  .filter(s => !s.isPinned && !recentSpaces.includes(s) && !leadSpaces.includes(s) && !hostSpaces.includes(s))
  .filter(s => hasRecentActivity(s))
  .sort(byActivityScore)
  .slice(0, 4)
```

---

## 7. Component Structure & Styling

### Row Container
```tsx
<section>
  <h2>Row Title</h2>  {/* text-lg font-semibold, mb-4 */}
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
    {/* SpaceCard components */}
  </div>
  {hasMore && <ShowMoreButton />}
</section>
```

**Row Title Styling**:
- Font: Semibold, 18px / 1.125rem
- Color: var(--foreground)
- Margin: 0 0 1rem 0 (mb-4)
- No icon or badge needed

**Row Spacing**:
- Between rows: space-y-8 (or explicit mb-8 on each section)
- Grid gap: 1rem (gap-4)

### Show More Button
- Variant: `outline`
- Size: `default` or `sm`
- Label: "Show More: [Count] Spaces"
- Placement: Centered below grid, mt-4
- Click action: Opens centered modal with full grid

### Show More Modal
- Style: Centered dialog (same as existing activity dialogs)
- Backdrop: Dark overlay (bg-black/50 or similar)
- Title: Row name ("Spaces I Lead & Administer", etc.)
- Body: Full-width grid (same as row grid)
- Close: X button in top-right or outside modal click

---

## 8. Empty States & Edge Cases

### Empty Rows (No Render)
Rows 2, 3, 4, 5 do not render if they have 0 spaces to display.

**Example**: User with 2 pinned spaces, 0 recent, 3 lead spaces, 0 host spaces, 0 active spaces:
- Row 1: 2 real + 2 placeholder cards (renders)
- Row 2: (hidden — 0 recent spaces)
- Row 3: 3 lead cards (renders, no "Show More")
- Row 4: (hidden — 0 host spaces)
- Row 5: (hidden — 0 active spaces)

### Pinned Spaces (Always Renders)
Row 1 always renders, even if all 4 slots are placeholders.

**Placeholder card click**: Opens a modal to browse & pin available spaces
- Title: "Pin a Space"
- Shows all non-pinned spaces user belongs to
- Grid layout: same responsive grid
- User clicks to pin (or uses a pin icon on the card)
- Modal closes on pin or user closes it

### Space with No Banner Image
- Use existing default gradient (from SpaceCard component)
- Initials + avatarColor as background

### Space with Very Long Name
- SpaceCard handles truncation via CSS (existing behavior)

### New User (0 spaces)
- Row 1: 4 placeholder cards → "Browse & Pin" modal on click
- All other rows: hidden
- Consider adding a CTA banner: "Get started by exploring spaces" with link to /spaces

---

## 9. Mock Data Structure

Extend existing `MOCK_MEMBERSHIPS` with new fields:

```tsx
interface MembershipItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  image?: string;
  color: string;
  initials: string;
  type: "space" | "subspace";
  parentId?: string;
  isPrivate: boolean;
  
  // NEW FIELDS FOR ENHANCED DASHBOARD
  isPinned?: boolean;  // true if in user's pinned list
  lastModified?: Date; // last edit timestamp
  userRole?: "member" | "lead" | "admin" | "host"; // user's relationship to space
  activityScore?: number; // aggregated activity metric (0–100 scale)
  lastActivityDate?: Date; // when last activity occurred
}
```

### Sample Data
```tsx
const mockSpaces = [
  {
    id: "space-1",
    slug: "vng-innovation",
    name: "VNG Innovation Hub",
    tagline: "Gemeente collaboratie platform",
    image: "...",
    isPinned: true,
    userRole: "lead",
    lastModified: new Date("2026-07-05"),
    activityScore: 85,
  },
  // ... more spaces
];
```

---

## 10. Key Behaviors & Interactions

### Navigation
- **Space card click** → Navigate to `/space/[slug]`
- **Placeholder card click** → Open "Browse & Pin" modal
- **"Show More" button** → Open centered modal with full category grid
- **Modal card click** → Navigate to space, close modal

### Pinning
- Clicking placeholder card opens browse modal
- User clicks to pin a space (adds to `isPinned = true`)
- Pinned space immediately appears in Row 1
- Update persists (localStorage for prototype, backend for production)

### View Persistence
- Keep existing Activity View toggle behavior
- When not in Activity view, show enhanced dashboard
- Remember last view choice in localStorage (existing behavior)

---

## 11. Responsive Breakpoints

**Grid Layout**:
- Mobile (default): 2 columns
- Tablet (sm): 3 columns
- Desktop (lg): 4 columns

**Example Tailwind**:
```tsx
className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
```

Row titles and spacing adjust automatically with Tailwind utilities.

---

## 12. Visual Design Refinements

### Row Dividers
- Subtle: 1px border-bottom or just spacing (space-y-8)
- No explicit divider line needed; spacing is enough
- Consider light background alternation if needed (light gray every other row)

### Typography
- Row titles: Semibold 18px, color-foreground
- Existing SpaceCard typography (unchanged)

### Shadows & Elevation
- Maintain existing SpaceCard shadows
- No additional elevation changes
- Consistent with current design system

---

## 13. Implementation Checklist

### Figma Design Phase
- [ ] Create row layouts in Figma using existing SpaceCard component
- [ ] Design placeholder card variant
- [ ] Design "Show More" modal layout
- [ ] Design "Browse & Pin" modal
- [ ] Responsive mockups (mobile, tablet, desktop)
- [ ] Add annotations for deduplication logic

### Prototype Phase
- [ ] Create enhanced SpacesGallery component (replaces current)
- [ ] Implement row filtering/deduplication logic
- [ ] Create placeholder card component
- [ ] Create show-more modal component
- [ ] Create browse-and-pin modal component
- [ ] Implement responsive grid layouts
- [ ] Test edge cases (0 spaces, all rows empty, etc.)
- [ ] Add mock data with all new fields

### Acceptance Criteria
- [ ] All 5 rows render correctly per spec
- [ ] Deduplication logic works (no space in 2+ rows)
- [ ] Placeholder cards show/hide appropriately
- [ ] "Show More" opens correct modal with all spaces
- [ ] Navigation to spaces works
- [ ] Pinning/unpinning works (prototype)
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Empty states handled per spec

---

## 14. Future Considerations

- **Pinning UX**: Consider drag-to-reorder within Row 1 (later iteration)
- **Filter Options**: Could add per-row filters (e.g., "Show only active spaces" in Row 5)
- **Activity Metrics**: Dashboard could show activity metrics per space (posts, comments, etc.)
- **Search**: Global search to find specific spaces
- **Favorites vs. Pinned**: Clarify if pinning is the same as favoriting (align with existing UX)

---

## 15. Related Specs & Components

- **007-dashboard-spaces-view** — Original spec; this is an enhancement
- **SpaceCard.tsx** — Reused component for all space displays
- **MOCK_MEMBERSHIPS** — Extend with new fields
- **Dashboard.tsx** — Parent component; minimal changes (swap SpacesGallery with new component)
- **DashboardSidebar.tsx** — No changes needed

---

## Appendix: Grid Layout Examples

### Desktop (4 Columns)
```
[Card 1] [Card 2] [Card 3] [Card 4]
```

### Tablet (3 Columns)
```
[Card 1] [Card 2] [Card 3]
[Card 4] [Card 5]
```

### Mobile (2 Columns)
```
[Card 1] [Card 2]
[Card 3] [Card 4]
[Card 5]
```

---

**Status**: Ready for Figma design phase  
**Next Step**: Design mockups in Figma using this brief as spec  
**Figma Owner**: [To be assigned]  
**Design Review Date**: [To be scheduled]

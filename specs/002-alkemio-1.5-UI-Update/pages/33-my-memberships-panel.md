# Page 33: My Memberships Panel

> Route: Triggered from Dashboard "Explore all your Spaces" button (overlay, no route change)
> Access: All authenticated users
> Ref: [master-brief.md](../master-brief.md) for component mapping
> Target file: src/app/components/memberships/MyMembershipsPanel.tsx

---

## Purpose

The My Memberships panel shows all spaces and subspaces where the authenticated user holds a role (Admin, Lead, or Member). It is distinct from "Browse All Spaces" (Page 31), which shows all public spaces regardless of membership.

Primary use cases:
1. Navigate quickly to a space the user belongs to.
2. Provide a clean, scannable overview of where the user is active.
3. See parent–child space hierarchy at a glance.

This is not a management surface. Actions like leaving spaces or changing roles remain in Account Settings > Membership (Page 11).

---

## Design Direction

The panel uses a list-oriented layout (not cards) for density and scannability. Parent spaces and their subspaces form a collapsible tree.

Principles:
- **One image per row**: parent spaces show a banner thumbnail; subspaces show an avatar. Never both on the same row.
- **Clear hierarchy**: subspaces are indented beneath their parent with a collapsible chevron.
- **Privacy visible at a glance**: Lock / Globe icon on the left side of every row.
- **Subtle role indication**: small colored dot + text label instead of heavy badge pills.
- **Lower cognitive load**: clean typography, generous spacing, minimal chrome.

---

## Layout Pattern

Full-viewport overlay (not shadcn Dialog), matching the same pattern as `SearchOverlay.tsx` and `MessagesOverlay.tsx`.

Overlay shell:
- Positioning: `fixed inset-0` with `z-[101]`
- Grid: 12-column grid (`grid-cols-12`) with `gap-6 px-6 md:px-8 py-[5vh]`
- Content panel: `lg:col-start-2 lg:col-span-10` (1 column gap on each side)
- Full-span on mobile: `max-md:col-start-1 max-md:col-span-12 max-md:p-0`
- Background: `var(--background)` with `1px solid var(--border)` border
- Border radius: `var(--radius-xl)`
- Shadow: `var(--elevation-sm)`
- Backdrop: `color-mix(in srgb, var(--foreground) 50%, transparent)` with `blur(2px)`, click-outside closes

---

## UI Structure

Top to bottom:

### 1. Header
- Title: "My Spaces"
- Subtitle: "{N} space(s) you're part of" — updates with filter state
- Close button (X icon) top-right

### 2. Search + Filter Row (single row)
- **Left** (flexed): Search Input with magnifying glass prefix icon, inline clear (X) when query is non-empty. Placeholder: "Search your spaces..."
- **Right** (fixed-width): Two Select dropdowns side-by-side:
  - Role filter: All Roles | Admin | Lead | Member (w-[130px])
  - Visibility filter: All | Public | Private (w-[120px])
- No tab bar (All / Spaces / Subspaces tabs are removed)

### 3. Scrollable list body
- Flat list of parent space groups separated by `Separator` components
- Each group: parent row + optionally expanded subspace rows beneath

---

## Parent Space Row

Each parent space appears as a single horizontal row.

Row anatomy (left to right):
1. **Chevron toggle** (`ChevronRight`, w-4 h-4) — only if space has subspaces. Rotates 90° when expanded. If no subspaces, empty `w-5` spacer.
2. **Privacy icon** (`Lock` or `Globe`, w-3.5 h-3.5, `text-muted-foreground`)
3. **Banner thumbnail** — clickable, `w-16 h-10`, `rounded-md`, `object-cover`. Falls back to gradient (`linear-gradient(135deg, color, darker)`) if no image.
4. **Name + tagline** (flex-1, min-w-0, text-left):
   - Name: `text-sm font-medium truncate`
   - Tagline (optional): `text-xs text-muted-foreground truncate`
5. **Subspace count badge** (optional) — `Badge variant="outline"`, `text-[11px] font-normal`, e.g. "2 subspaces"
6. **Role indicator** — colored dot (w-1.5 h-1.5 rounded-full) + role text (`text-xs text-muted-foreground`). Dot colors:
   - Admin: `var(--destructive)`
   - Lead: `var(--primary)`
   - Member: `var(--muted-foreground)`

Row spacing: `px-5 py-3`, hover: `bg-muted/40`

Groups are separated by shadcn `Separator` between each parent row.

---

## Subspace Row

Subspaces are nested beneath their parent when expanded. They are indented and slightly smaller.

Row anatomy (left to right):
1. **Indentation** — `padding-left: 5rem` to visually nest under parent
2. **Privacy icon** (`Lock` or `Globe`, w-3.5 h-3.5, same size as parent)
3. **Avatar** — `Avatar` component, `w-8 h-8 rounded-md`. Uses `AvatarImage` with fallback to colored initials (`AvatarFallback` with `text-[10px]`). No banner thumbnail on subspaces.
4. **Name** — `text-sm truncate` (no tagline shown for subspaces)
5. **Role indicator** — same dot + text pattern as parent row

Row spacing: `py-2.5 pr-5`, hover: `bg-muted/40`

---

## Expand / Collapse Behavior

- All groups are **expanded by default** when the panel opens.
- Clicking the chevron toggles that group's subspaces.
- Chevron animates from right-pointing to down-pointing (`rotate-90`, 150ms transition).

---

## States

**Loading:**
- Show 5 skeleton rows matching the parent row shape:
  - `Skeleton` blocks for chevron, privacy icon, banner thumbnail, text lines, and role indicator
  - Separated by `Separator` between each skeleton row

**Empty (no memberships):**
- Centered `Layers` icon + "You're not part of any spaces yet." + "Browse all spaces" outline button

**Empty (filtered, no matches):**
- Centered `SearchX` icon + "No spaces match your search." + "Clear filters" link button

---

## Interaction Details

- **Open**: Dashboard "Explore all your Spaces" button (`<button>`, not `<Link>`). Controlled via `useState` in the parent component.
- **Close**: X button, backdrop click, or Escape key.
- **Search**: client-side, real-time filter by space name, tagline, and subspace name.
- **Filters**: client-side, update list and header count immediately.
- **Navigation**: clicking a parent row or subspace row navigates to that space (`/space/{slug}`) and closes the panel.
- **Keyboard**: Tab navigation through controls and rows; Enter activates focused item.

---

## Components Used

- `Input` — search field
- `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` — role and visibility filters. `SelectContent` must use `z-[200]` to render above the `z-[101]` overlay.
- `Badge` (variant `outline`) — subspace count on parent rows
- `Avatar`, `AvatarImage`, `AvatarFallback` — subspace avatars (rounded-md)
- `Separator` — row dividers between parent groups
- `Skeleton` — loading state
- `Button` — empty state CTA
- Lucide icons: `Search`, `X`, `Lock`, `Globe`, `Layers`, `SearchX`, `ChevronRight`

---

## Data Shape

```ts
type MembershipRole = "Admin" | "Lead" | "Member";

interface MembershipItem {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  isPrivate: boolean;
  role: MembershipRole;
  initials: string;
  color: string;           // fallback gradient color
  type: "space" | "subspace";
  parentId?: string;        // for subspaces only
  parentName?: string;      // for subspaces only
  image?: string;           // banner URL (spaces) or avatar URL (subspaces)
}
```

Groups are computed: parent spaces mapped to their child subspaces via `parentId`.

---

## What This Is NOT

- Not a card grid. No card components. No multi-column responsive grid.
- No All / Spaces / Subspaces tab bar.
- No shadcn `Dialog`/`DialogContent` wrapper — uses raw `fixed inset-0` overlay with 12-col grid.
- No duplicate images per row (no banner + avatar together).
- No colored pill badges for roles — uses subtle dot + text pattern.

## Prototype Status

Implemented and validated in the prototype at:
- `Resources/prototype/src/app/components/memberships/MyMembershipsPanel.tsx`
- `Resources/prototype/src/app/components/memberships/membershipData.ts`

Reference patterns used:
- `src/app/components/search/SearchOverlay.tsx` (for full-viewport overlay pattern)
- `src/app/pages/UserMembershipPage.tsx` (membership data shape)

---

## Implementation Prompt

```text
Create a new component: src/app/components/memberships/MyMembershipsPanel.tsx.

Trigger:
- Open from Dashboard "Explore all your Spaces" button (<button>, not <Link>).
- Controlled via useState in the parent component (open / onOpenChange).

Overlay shell (NOT shadcn Dialog):
- Backdrop: fixed inset-0 z-[100], color-mix(in srgb, var(--foreground) 50%, transparent), backdrop-filter: blur(2px). Click-outside closes.
- Overlay: fixed inset-0 z-[101], grid grid-cols-12 gap-6 px-6 md:px-8 py-[5vh], pointer-events-none.
- Content panel: lg:col-start-2 lg:col-span-10 (col-span-12 on mobile), pointer-events-auto.
  Background: var(--background), border: 1px solid var(--border), border-radius: var(--radius-xl), box-shadow: var(--elevation-sm).
  Flex column, overflow hidden.

Header:
- Title: "My Spaces"
- Subtitle: "{N} space(s) you're part of" with live filtered count.
- Close button (X icon) top-right.

Search + Filter row (single row, border-b):
- Left (flex-1): Input with Search icon prefix, inline clear X. Placeholder "Search your spaces..."
- Right: Two Select dropdowns:
  - Role: All Roles | Admin | Lead | Member (w-[130px])
  - Visibility: All | Public | Private (w-[120px])
  - SelectContent must use className="z-[200]" to render above the overlay.
- No tab bar.

Content (flex-1 overflow-y-auto):
- List of parent space groups separated by Separator.
- Each group: parent row + expanded subspace rows.

Parent space row (left to right):
- ChevronRight toggle (w-4 h-4, rotates 90° when expanded). Spacer if no subspaces.
- Privacy icon: Lock or Globe (w-3.5 h-3.5, text-muted-foreground).
- Banner thumbnail: w-16 h-10, rounded-md, object-cover. Gradient fallback.
- Name (text-sm font-medium truncate) + optional tagline (text-xs text-muted-foreground truncate).
- Subspace count: Badge variant="outline" (text-[11px] font-normal), e.g. "2 subspaces".
- Role indicator: colored dot (w-1.5 h-1.5 rounded-full) + text-xs label.
  - Admin: var(--destructive)
  - Lead: var(--primary)
  - Member: var(--muted-foreground)
- Row: px-5 py-3, hover bg-muted/40.

Subspace row (left to right):
- Indentation: padding-left 5rem.
- Privacy icon: Lock or Globe (w-3.5 h-3.5, same as parent).
- Avatar: w-8 h-8 rounded-md, with AvatarFallback (colored initials). No banner.
- Name: text-sm truncate. No tagline.
- Role indicator: same dot + text as parent.
- Row: py-2.5 pr-5, hover bg-muted/40.

Expand/collapse:
- All groups expanded by default on open.
- Chevron toggles group. 150ms rotate transition.

States:
- Loading: 5 skeleton rows matching parent row shape, separated by Separator.
- Empty memberships: centered Layers icon + message + "Browse all spaces" outline button.
- Empty filtered: centered SearchX icon + message + "Clear filters" link button.

Behavior:
- Search and filters are client-side and instant.
- Escape / backdrop click closes.
- Row click navigates to /space/{slug} and closes panel.

Do not add management actions (leave space / change role), timestamps, unread badges, or member counts.
Do not use shadcn Dialog/DialogContent. Do not use card grid. Do not use tab bar.
Do not show both banner and avatar on the same row.
```

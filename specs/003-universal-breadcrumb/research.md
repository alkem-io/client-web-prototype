# Research: Universal Breadcrumb Navigation

**Feature**: 003-universal-breadcrumb  
**Date**: 2026-03-31

## 1. Breadcrumb Integration Strategy — Where in the Header?

### Decision: Inline within `Header.tsx`, after the logo, before right-side icons

### Rationale
- Both `MainLayout` and `SpaceLayout` already render `<Header />`, so placing the breadcrumb inside the Header component automatically covers all pages.
- The Header uses a left/right flex layout: logo on the left, icon row on the right. The breadcrumb trail fits naturally in the left section, extending from the logo with chevron separators.
- This matches the old Alkemio platform pattern (logo → space icon → subspace icon in the header bar).
- No new layout component needed — just expand the existing left side of the Header.

### Alternatives Considered
- **Separate bar below header**: Rejected — user clarified breadcrumb should be part of the header, not a separate bar. Would also add 40px vertical space on every page.
- **Inside each layout component**: Rejected — would require duplicating breadcrumb logic in MainLayout and SpaceLayout separately.

## 2. Route-to-Breadcrumb Mapping Strategy

### Decision: `useBreadcrumbs()` custom hook using `useLocation()` + `useParams()` + static route config

### Rationale
- react-router v7 `useMatches()` returns matched route objects, but the prototype uses `createBrowserRouter` with `Component` references (no `loader` or `handle` metadata currently).
- Simplest approach: a custom hook that reads the current pathname and params, then maps to breadcrumb segments using a static config object. This avoids modifying every route definition.
- Space/subspace names are hardcoded in the prototype (mock data), so the hook can look them up from the same mock data sources already used by page components.

### Alternatives Considered
- **react-router `handle` metadata on each route**: Clean pattern, but requires modifying all ~25 route definitions in routes.tsx. Considered overkill for a prototype with mock data. Can be adopted later for the production app.
- **React context provider**: Over-engineered — the breadcrumb is a pure function of the current URL. No shared state needed.

## 3. Responsive Collapse Pattern

### Decision: Use shadcn `BreadcrumbEllipsis` inside a `DropdownMenu` for collapsed segments

### Rationale
- The existing `breadcrumb.tsx` already exports `BreadcrumbEllipsis` (MoreHorizontal icon in a 9×9 container).
- Standard pattern: when viewport < 768px and breadcrumb has 3+ segments, show first (logo) + ellipsis dropdown + last (current page). The dropdown renders the hidden middle segments as clickable links.
- shadcn's `DropdownMenu` (already in the project) provides the popover for collapsed items.
- Only requires a CSS media query check or a `useMediaQuery` hook to toggle between full and collapsed rendering.

### Alternatives Considered
- **CSS overflow scroll**: Rejected — horizontal scrolling breadcrumbs are poor UX on mobile. Users don't expect to scroll a breadcrumb.
- **Show only parent + current**: Rejected — loses intermediate context. The ellipsis pattern preserves all information behind one click.

## 4. Segment Display Format (Icon + Text Combo)

### Decision: Tiered format — logo only → avatar + text → text only

### Rationale
- **Home**: Platform logo (AlkemioSymbolSquare, 24×24) — already in the Header. No text label needed; the logo is universally recognized.
- **Spaces & Subspaces**: Small avatar (20×20, shadcn `Avatar` with `AvatarImage`/`AvatarFallback`) + space name text. Avatar provides instant visual recognition; text provides clarity.
- **Deeper levels** (settings sections, content titles, tab names): Text only. Adding icons for "Profile", "Community", "Knowledge Base" etc. would require a mapping table and add visual noise without aiding recognition.

### Alternatives Considered
- **Icons only (like old platform)**: Rejected per clarification — user wants to try icon + text combo. Old platform's icon-only approach required users to memorize icons.
- **Text only everywhere**: Visually flat, misses the opportunity to use space avatars for quick recognition at the top hierarchy levels.

## 5. In-Banner Breadcrumb Removal

### Decision: Remove breadcrumb overlays from SpaceHeader and SubspaceHeader

### Rationale
- SpaceHeader currently renders a `<Breadcrumb>` component overlaid on the banner image (white text: "Home / [Space Name]"). This will be redundant with the header breadcrumb.
- SubspaceHeader renders a `<Link>` with `ChevronLeft` icon ("← Back to [Space Name]") at the top of the banner. Also redundant.
- Both should be removed. The action buttons (Settings, Share, etc.) currently adjacent to the banner breadcrumb should remain — they can be repositioned within the banner without the breadcrumb.

### Changes Required
- `SpaceHeader.tsx`: Remove the `<Breadcrumb>` component and its containing div from the banner overlay. Keep the action icons div.
- `SubspaceHeader.tsx`: Remove the `<Link to={...}>` back-link and its containing flex row. Keep the utility icon buttons.

## 6. Header Logo Behavior Change

### Decision: Logo always visible (remove Dashboard hiding logic)

### Rationale
- Current Header hides the logo on the Dashboard (`isDashboard` check). Since the logo now serves as the breadcrumb root/Home segment, it must always be visible for consistency.
- On the Dashboard, only the logo is shown (no additional breadcrumb segments) — this is the root.
- The `isDashboard` conditional rendering of the logo in Header.tsx should be removed.

### Alternatives Considered
- **Keep hiding on Dashboard**: Rejected — the logo is the anchor of the breadcrumb. Hiding it on one page breaks the mental model.

## 7. Separator Styling

### Decision: ChevronRight (already the shadcn default), styled to match header context

### Rationale
- `BreadcrumbSeparator` defaults to `<ChevronRight />` at `size-3.5` — consistent with spec FR-005.
- In the header, separators should use `text-muted-foreground` to be visible but not dominant.
- No custom separator needed.

## 8. Text Truncation Strategy

### Decision: CSS `max-width` + `text-overflow: ellipsis` on segment text, with `title` attribute for tooltip

### Rationale
- Per FR-009, long space/subspace names must be truncated.
- A `max-w-[160px]` (desktop) / `max-w-[100px]` (mobile) on segment text spans, combined with `truncate` (Tailwind shorthand for `overflow-hidden text-ellipsis whitespace-nowrap`), handles this cleanly.
- The native HTML `title` attribute provides a hover tooltip with the full name — no tooltip library needed.
- 160px accommodates ~20-25 characters at 14px, which covers most space names while preventing breadcrumb overflow.

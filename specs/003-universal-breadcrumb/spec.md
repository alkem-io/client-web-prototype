# Feature Specification: Universal Breadcrumb Navigation

**Feature Branch**: `003-universal-breadcrumb`  
**Created**: 2026-03-30  
**Status**: Draft  
**Input**: User description: "Design and add a universal breadcrumb navigation component visible on all pages so users can always see where they are and quickly navigate back in the page hierarchy"

## Clarifications

### Session 2026-03-31

- Q: Should the universal breadcrumb replace or coexist with existing in-banner breadcrumbs on Space/Subspace pages? → A: Replace — the universal breadcrumb bar replaces all in-banner breadcrumbs. Space Home and Subspace banners will have their built-in breadcrumb/back-link removed.
- Q: Should the breadcrumb be visible on the Dashboard, and how should the Home segment be represented? → A: Show on all pages including Dashboard. The Home segment is the platform logo already present in the top navigation bar. The breadcrumb trail extends from the logo (similar to the current Alkemio platform where logo → space icon → subspace icon appear as icon-based breadcrumb segments in the header bar).
- Q: Should breadcrumb segments use icons only, text labels only, or a combination? → A: Icon + text combo. The Home segment is the platform logo (icon only). Space and subspace segments show their avatar/icon alongside the name. Deeper levels (tabs, settings sections, content titles) use text only to avoid clutter.
- Q: When a user clicks a tab (Community, Subspaces, Knowledge Base) on a Space page, should the breadcrumb update to reflect the active tab? → A: No. Tabs are sub-views of the Space page, not separate hierarchical levels. The breadcrumb stays at [Logo] > [Space] regardless of which tab is active.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate Hierarchy from Any Page (Priority: P1)

A user is deep within the platform (e.g., viewing a subspace within a space) and wants to quickly understand where they are in the page hierarchy and navigate back to a parent level. A persistent breadcrumb trail at the top of every page shows the full path from the dashboard to the current location. Each segment is clickable, allowing the user to jump to any ancestor page in one click.

**Why this priority**: This is the core value proposition — wayfinding and quick navigation. Without this, users get lost in nested content hierarchies and must rely on the browser back button or sidebar navigation.

**Independent Test**: Can be fully tested by navigating to any subspace page and verifying the breadcrumb displays the correct path (e.g., "Home / Space Name / Subspace Name") with each ancestor segment being clickable and routing correctly.

**Acceptance Scenarios**:

1. **Given** a user is on a Subspace page, **When** they look at the breadcrumb in the header, **Then** they see [Logo] > [Space avatar + Space Name] > [Subspace avatar + Subspace Name] with Logo and Space segment as clickable links and Subspace as the current (non-clickable) page label.
2. **Given** a user is on a Space Home page, **When** they look at the breadcrumb in the header, **Then** they see [Logo] > [Space avatar + Space Name] with Logo as a clickable link and Space as the current page label.
3. **Given** a user clicks on the "Home" segment in the breadcrumb, **When** the navigation completes, **Then** they are taken to the Dashboard page.
4. **Given** a user clicks on a Space Name segment in the breadcrumb from a nested page, **When** the navigation completes, **Then** they are taken to that Space's home page.

---

### User Story 2 - Breadcrumb on Settings and Account Pages (Priority: P2)

A user navigating through their account settings (Profile, Membership, Organizations, Notifications) or space settings pages sees a breadcrumb showing the path to their current settings section. This helps the user understand they are within a settings context and quickly jump back to the parent settings page or to the space/account level.

**Why this priority**: Settings pages are deeply nested and users frequently navigate between different settings sections. Without breadcrumbs, users must rely on the settings sidebar alone and lose context about where they are in the overall platform hierarchy.

**Independent Test**: Can be fully tested by navigating to Account Profile Settings and verifying the breadcrumb shows "Home / Account Settings / Profile" with appropriate clickable links.

**Acceptance Scenarios**:

1. **Given** a user is on the Account Profile settings page, **When** they look at the breadcrumb, **Then** they see [Logo] > Account Settings > Profile with Logo and Account Settings as clickable links.
2. **Given** a user is on a Space Settings Profile page, **When** they look at the breadcrumb, **Then** they see [Logo] > [Space avatar + Space Name] > Settings > Profile with each ancestor segment clickable.
3. **Given** a user clicks on "Account Settings" in the breadcrumb from a sub-settings page, **When** the navigation completes, **Then** they are taken to the main Account Settings page.

---

### User Story 3 - Breadcrumb on Content Detail Pages (Priority: P3)

A user viewing a specific content item — such as a post detail page, a template detail page, or a template pack page — sees a breadcrumb that traces the path back to the content's parent context. This allows the user to quickly return to the list or parent page without using the browser back button.

**Why this priority**: Content detail pages are leaf nodes in the hierarchy. Users often browse multiple items in sequence and need an efficient way to return to the list view or parent context.

**Independent Test**: Can be fully tested by opening a Post Detail page from a Space and verifying the breadcrumb shows [Logo] > [Space Name] > [Post Title] with appropriate clickable links.

**Acceptance Scenarios**:

1. **Given** a user is on a Post Detail page within a space, **When** they look at the breadcrumb, **Then** they see [Logo] > [Space avatar + Space Name] > [Post Title] with ancestors clickable. (Note: "Knowledge Base" tab does not add a segment, consistent with the tabs-are-sub-views clarification.)
2. **Given** a user is on a Template Detail page from the Template Library, **When** they look at the breadcrumb, **Then** they see [Logo] > Template Library > [Pack Name] > [Template Name] with ancestors clickable.
3. **Given** a user is viewing a post from search results, **When** they look at the breadcrumb, **Then** the breadcrumb still shows the canonical path to the post's location in the hierarchy (not the search path).

---

### User Story 4 - Responsive Breadcrumb on Small Screens (Priority: P4)

A user on a tablet or narrow browser window sees a breadcrumb that adapts gracefully to limited horizontal space. When the full path is too long to fit, intermediate segments are collapsed behind an ellipsis menu while always showing the first (Home) and last (current page) segments.

**Why this priority**: Mobile/tablet users need the same wayfinding capability but the full breadcrumb path may not fit on narrow screens. This ensures the feature works across all viewport sizes.

**Independent Test**: Can be fully tested by resizing the browser to a narrow width on a deeply nested page and verifying intermediate breadcrumb segments collapse into an expandable "..." menu.

**Acceptance Scenarios**:

1. **Given** a user is on a deeply nested page with a viewport under 768px, **When** the breadcrumb renders, **Then** it shows the Home icon, an ellipsis dropdown, and the current page name.
2. **Given** a user clicks the ellipsis in a collapsed breadcrumb, **When** the dropdown opens, **Then** they see the hidden intermediate path segments as clickable links.
3. **Given** a user is on a page with only two breadcrumb segments, **When** the viewport is narrow, **Then** both segments are shown without collapsing (no ellipsis needed).

---

### Edge Cases

- What happens when a page has no parent context (e.g., the Dashboard)? — Only the platform logo is shown in the header (no additional breadcrumb segments), since the user is already at the root.
- What happens when a space or subspace name is very long? — The breadcrumb truncates individual segment text with an ellipsis after a maximum character limit, showing the full name on hover via tooltip.
- What happens when a page is accessed via a direct URL (deep link)? — The breadcrumb still shows the full canonical hierarchy path, not just the current page.
- What happens when the user is not authenticated and lands on a public page? — The breadcrumb still functions, showing the path for publicly accessible pages.
- What happens when a parent page in the breadcrumb no longer exists (e.g., deleted space)? — Out of scope for the prototype (which uses static mock data). In a production implementation, the segment should be rendered as non-clickable text.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display a breadcrumb navigation trail on every page of the platform, integrated into the top navigation bar starting from the platform logo.
- **FR-002**: The breadcrumb MUST show the full hierarchical path from the Dashboard (Home) to the current page.
- **FR-003**: Each ancestor segment in the breadcrumb MUST be a clickable link that navigates to that page.
- **FR-004**: The current (active) page segment MUST be displayed as non-clickable text, visually distinct from clickable ancestors.
- **FR-005**: The breadcrumb MUST use a consistent separator between segments (chevron icon) across all pages.
- **FR-006**: The Home segment of the breadcrumb MUST be the platform logo already present in the top navigation bar, linking to the Dashboard. The breadcrumb trail extends from this logo as additional segments.
- **FR-007**: The breadcrumb MUST be integrated into the top navigation bar, extending from the platform logo. It is part of the header, not a separate bar below it.
- **FR-008**: On narrow viewports (below 768px width), the breadcrumb MUST collapse intermediate segments into an expandable ellipsis dropdown while always showing the first and last segments.
- **FR-009**: Long segment names MUST be truncated with an ellipsis and show the full name on hover via tooltip.
- **FR-009a**: Breadcrumb segment display format MUST follow this pattern: Home = platform logo icon only; space and subspace segments = avatar/icon + text name; deeper levels (tabs, settings sections, content titles) = text only.
- **FR-010**: The breadcrumb MUST be accessible: using semantic `nav` landmark with `aria-label="breadcrumb"`, an ordered list structure, and `aria-current="page"` on the active segment.
- **FR-011**: The breadcrumb MUST support the following page hierarchies:
  - Dashboard (Home) — logo only, no additional segments
  - [Logo] > [Space Name]
  - [Logo] > [Space Name] > [Subspace Name]
  - [Logo] > [Space Name] > Settings > [Section]
  - [Logo] > Account Settings > [Section]
  - [Logo] > [Space Name] > [Post Title]
  - [Logo] > Template Library > [Pack Name] > [Template Name]
  - [Logo] > Explore Spaces
  - [Logo] > Search
  - Note: Space tab views (Community, Subspaces, Knowledge Base) do NOT add a breadcrumb segment; the breadcrumb remains at [Logo] > [Space Name].
- **FR-012**: The breadcrumb MUST update dynamically as the user navigates between pages without requiring a full page reload.
- **FR-013**: The breadcrumb MUST replace all existing in-banner breadcrumb patterns: remove the "Home / [Space Name]" overlay from the Space Home banner and the "← Back to [Space Name]" back-link from the Subspace banner. The universal breadcrumb bar is the single source of wayfinding navigation.
- **FR-014**: The breadcrumb MUST use the existing design system color tokens and typography scale for visual consistency with the rest of the platform.

### Key Entities

- **Breadcrumb Segment**: A single item in the breadcrumb trail. Attributes: display label, navigation target (URL), position in the hierarchy, whether it is the current page.
- **Page Hierarchy**: The parent-child relationship between pages that determines breadcrumb content. Each page knows its parent context and its own display name.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of platform pages display a breadcrumb navigation bar showing the user's current location in the hierarchy.
- **SC-002**: Users can navigate from any nested page back to the Dashboard in 2 clicks or fewer using the breadcrumb.
- **SC-003**: The breadcrumb is fully usable on viewports as narrow as 320px, with no content overflow or layout breakage.
- **SC-004**: All breadcrumb segments accurately reflect the current page hierarchy — no stale, incorrect, or missing segments on any page.
- **SC-005**: Screen reader users can identify the breadcrumb as a navigation landmark and traverse the path segments logically.
- **SC-006**: 90% of users in usability testing can correctly identify their location in the platform hierarchy by reading the breadcrumb.

## Assumptions

- The platform already has a consistent top navigation bar (AppBar/header) with the platform logo on the left side; the breadcrumb trail extends from this logo within the same header bar.
- Each page in the application has metadata or routing information that defines its parent page in the hierarchy.
- The existing shadcn Breadcrumb component (already present in the design system) provides the building blocks needed for this feature.
- The Dashboard/Home page is the universal root of the breadcrumb hierarchy for all pages.
- Space tab pages (Community, Subspaces, Knowledge Base) are sub-views of the Space Home page and do not add a breadcrumb segment. The breadcrumb remains at [Logo] > [Space Name] regardless of which tab is active.
- The breadcrumb is integrated into the top NavBar (not a separate bar below it). Existing in-banner breadcrumbs (Space Home overlay, Subspace back-link) will be removed so the header breadcrumb trail is the sole breadcrumb.

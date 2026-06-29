# Feature Specification: Dashboard Normal View (Spaces Gallery)

**Feature Branch**: `007-dashboard-spaces-view`  
**Created**: 2026-06-23  
**Status**: Draft  
**Input**: Screenshot reference of the current Alkemio "Normal" dashboard view — a vertically scrolling gallery of the user's spaces with banner images, names, taglines, and subspace previews.

## Problem Statement

The redesigned dashboard currently only implements the "Activity" view — two-column activity feeds showing recent platform activity. The original Alkemio dashboard had a second view mode (toggled via an "Activity View" switch): the "Normal" view, which displays all spaces the user belongs to as a vertically stacked gallery with visual previews and nested subspace cards. This view is being requested back as it serves users who want to visually browse and navigate their spaces rather than scan activity feeds.

## Screenshot Reference

The attached screenshot shows the current production "Normal" view with:
- Left sidebar with navigation, spaces list, and virtual contributors
- Main content: vertically stacked space cards (banner image → name → tagline → subspace preview cards)
- "LOAD MORE" button at the bottom
- Lock icons on private subspaces
- A "See x Subspaces or x Members >>" link below each space's subspace row

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Browse My Spaces (Priority: P1)

A user logs in and wants to visually browse all spaces they belong to. They toggle the Activity View **off** in the sidebar (or arrive at the dashboard with it already off). The main content area shows a vertical gallery of spaces, ordered by creation date, each displaying a banner image, space name, and tagline. The user scrolls through to find the space they want and clicks it to navigate there.

**Why this priority**: This is the core purpose of the Normal view — providing visual orientation across all the user's spaces. Without this, the view has no reason to exist.

**Independent Test**: Toggle Activity View off on the dashboard and verify a vertically scrolling list of all user's spaces appears with banner, name, and tagline for each.

**Acceptance Scenarios**:

1. **Given** the user is on the dashboard with Activity View toggled off, **When** the page loads, **Then** the main content area displays all spaces the user belongs to as vertically stacked cards ordered by creation date
2. **Given** a space card is displayed, **When** the user views it, **Then** they see the space's banner image (full width of content area), space name (centered below banner), and tagline/description text
3. **Given** a space card is displayed, **When** the user clicks the banner or space name, **Then** they navigate to that space's home page
4. **Given** the user has more spaces than fit on one screen, **When** they scroll to the bottom, **Then** a "LOAD MORE" button is visible to load additional spaces

---

### User Story 2 — Preview Subspaces (Priority: P1)

Below each space card, the user sees a horizontal row of 3–4 subspace preview cards (thumbnail + name + lock icon if private). This lets users quickly dive into a specific subspace without first entering the parent space.

**Why this priority**: Subspace navigation is a key differentiator of this view vs. just having a list of spaces — it exposes the hierarchy and enables faster navigation.

**Independent Test**: Verify that spaces with subspaces display a row of 3–4 subspace cards below the space name/tagline, each clickable to navigate to the subspace.

**Acceptance Scenarios**:

1. **Given** a space has subspaces, **When** displayed in the Normal view, **Then** a horizontal row of up to 3–4 subspace cards appears below the space's tagline
2. **Given** a subspace card, **When** the user views it, **Then** it shows a thumbnail/banner image, the subspace name, and a lock icon if the subspace is private
3. **Given** a subspace card, **When** the user clicks it, **Then** they navigate to that subspace's page
4. **Given** a space has more subspaces than the preview shows, **When** the user views the space, **Then** a "See all Subspaces" link appears below the subspace card row

---

### User Story 3 — See All Subspaces Dialog (Priority: P2)

A user wants to see all subspaces under a specific space. They click the "See all Subspaces" link below the limited preview row, and a dialog opens showing the full list of subspaces in the same card grid layout.

**Why this priority**: Depends on the subspace preview existing first (P1). Provides the full exploration path when the preview isn't sufficient.

**Independent Test**: Click "See all Subspaces" for a space with more than 4 subspaces and verify a dialog opens showing the complete subspace grid.

**Acceptance Scenarios**:

1. **Given** a space has more than 3–4 subspaces, **When** the user clicks "See all Subspaces," **Then** a dialog opens displaying all subspaces for that space
2. **Given** the dialog is open, **When** the user views it, **Then** subspaces are displayed in the same card grid layout (thumbnail + name + lock icon)
3. **Given** the dialog is open, **When** the user clicks a subspace card, **Then** the dialog closes and they navigate to that subspace

---

### User Story 4 — Access Activity Feeds via Sidebar Dialogs (Priority: P2)

While in the Normal view, the user still wants to check recent activity without switching views. The sidebar includes "Latest Activity in my Spaces" and "My Latest Activity" links. Clicking either opens a separate dialog showing the corresponding activity feed (same content as the full Activity view).

**Why this priority**: Activity awareness is still important even in the Normal view, but it's secondary to the space browsing purpose. The dialog approach avoids forcing the user to switch views entirely.

**Independent Test**: Click "Latest Activity in my Spaces" in the sidebar while in Normal view and verify a dialog opens with the same activity feed as the Activity view's left column.

**Acceptance Scenarios**:

1. **Given** the user is in the Normal view, **When** they click "Latest Activity in my Spaces" in the sidebar, **Then** a dialog opens showing the "Latest Activity in my Spaces" feed (same content/filters as Activity view)
2. **Given** the user is in the Normal view, **When** they click "My Latest Activity" in the sidebar, **Then** a separate dialog opens showing "My Latest Activity" feed
3. **Given** an activity dialog is open, **When** the user clicks an activity item, **Then** they navigate to the relevant content (post, space, etc.)
4. **Given** an activity dialog is open, **When** the user closes it, **Then** they remain on the Normal view dashboard

---

### Edge Cases

- What happens when a user belongs to zero spaces? Show an empty state with a prompt to explore/create spaces
- What happens when a space has no banner image? Show a placeholder/default gradient banner
- What happens when a space has zero subspaces? The subspace row and "See all" link are simply not rendered for that space
- What happens when a space has a very long tagline? Truncate with ellipsis after 2 lines
- What happens when the user clicks LOAD MORE and there are no more spaces? Button disappears or shows disabled state
- What happens when a subspace has no thumbnail? Show a placeholder with the subspace initials

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a vertically stacked gallery of all spaces the user belongs to when Activity View is toggled OFF
- **FR-002**: Each space card MUST display: full-width banner image (preserving the original aspect ratio, no forced crop), space name (centered), and tagline/description
- **FR-003**: Spaces MUST be ordered by creation date
- **FR-004**: Each space with subspaces MUST display a horizontal row of up to 3–4 subspace preview cards
- **FR-005**: Each subspace card MUST show: thumbnail image, subspace name, and lock icon (if private)
- **FR-006**: Spaces with more subspaces than the preview limit MUST show a "See all Subspaces" link below the preview row
- **FR-007**: The "See all Subspaces" link MUST open a centered modal dialog (same style as activity dialogs) displaying all subspaces in the same card grid layout
- **FR-008**: The left sidebar MUST include "Latest Activity in my Spaces" and "My Latest Activity" navigation items that each open a separate centered modal dialog (with backdrop overlay) containing the activity feed
- **FR-009**: Activity modal dialogs MUST contain the same feed content and filtering as the full Activity view columns
- **FR-010**: The "LOAD MORE" button MUST load the next batch of 8 spaces when clicked (initial page also shows 8)
- **FR-011**: The Activity View toggle in the sidebar MUST switch between the Normal view (spaces gallery) and the Activity view (feed columns)
- **FR-014**: The system MUST persist the user's last selected view (Normal or Activity) and restore it on subsequent dashboard visits
- **FR-012**: Clicking a space banner or name MUST navigate to that space's home page
- **FR-013**: Clicking a subspace card MUST navigate to that subspace's page

### Key Entities

- **Space Card**: Banner image URL, space name, tagline, list of subspaces, privacy status, creation date
- **Subspace Card**: Thumbnail image URL, subspace name, privacy status (lock icon), navigation URL
- **Activity Dialog**: Activity feed data (same schema as Activity view), filter state (Space, Role)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can visually identify and navigate to any of their spaces within 5 seconds of viewing the Normal dashboard
- **SC-002**: Users can access a specific subspace in ≤2 clicks from the dashboard (direct click on subspace card)
- **SC-003**: The view toggle correctly switches between Normal and Activity views with no page reload
- **SC-004**: LOAD MORE button loads additional spaces without losing scroll position
- **SC-005**: Activity dialogs display the same data as the Activity view with identical filtering capabilities

## Clarifications

### Session 2026-06-23

- Q: Default view state on dashboard load? → A: Remember last used (persist user's toggle preference)
- Q: LOAD MORE batch size? → A: 8 initial + 8 per load
- Q: Banner image aspect ratio? → A: Fixed aspect ratio of 1536×256px (6:1), displayed via CSS aspect-ratio
- Q: Activity dialog style? → A: Centered modal dialog (overlay with backdrop)
- Q: "See all Subspaces" dialog style? → A: Same centered modal (consistent with activity dialogs)

## Assumptions

- Space banner images are already available in the data model and served at appropriate resolutions
- Subspace data (name, banner, privacy status) is available when rendering the parent space card
- The existing Activity view component/data can be reused inside dialogs without modification
- The sidebar Activity View toggle state is persisted per-user (localStorage or server-side preference)

---

## Visual Layout Reference

```
┌──────────────────────────────────────────────────────────┐
│  Top Navigation Bar                                      │
├─────────┬────────────────────────────────────────────────┤
│ Left    │                                                │
│ Sidebar │  ┌──────────────────────────────────────────┐  │
│         │  │  [Banner Image — full width]             │  │
│ - Latest│  │           Space Name                     │  │
│   Activ.│  │      Tagline / description               │  │
│ - My    │  ├──────────────────────────────────────────┤  │
│   Activ.│  │  [Sub1 Card] [Sub2 Card] [Sub3 Card]     │  │
│ - Invite│  │       See all Subspaces >>               │  │
│ - Create│  └──────────────────────────────────────────┘  │
│ - Tips  │                                                │
│ - Acct  │  ┌──────────────────────────────────────────┐  │
│         │  │  [Banner Image — full width]             │  │
│ Toggle: │  │           Space Name                     │  │
│ [OFF]   │  │      Tagline / description               │  │
│         │  ├──────────────────────────────────────────┤  │
│ Spaces: │  │  [Sub1 Card] [Sub2 Card]                 │  │
│ - GE    │  └──────────────────────────────────────────┘  │
│ - CG    │                                                │
│ - DT    │              [ LOAD MORE ]                     │
│         │                                                │
│ VCs:    │                                                │
│ - SM    │                                                │
│ - CM    │                                                │
├─────────┴────────────────────────────────────────────────┤
│  Footer                                                  │
└──────────────────────────────────────────────────────────┘
```

## Sidebar Modifications (vs. Activity View)

The left sidebar is identical to the Activity view sidebar **except**:
- **Added** (above existing nav items, under Invitations): "Latest Activity in my Spaces" link → opens dialog
- **Added**: "My Latest Activity" link → opens dialog
- The Activity View toggle shows **OFF** state (Normal view active)

All other sidebar items remain unchanged: Invitations, Tips & Tricks, My Account, Create my own Space, Spaces list, Virtual Contributors list.

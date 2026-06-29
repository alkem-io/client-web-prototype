# Feature Specification: Profile Hover Card

**Feature Branch**: `005-profile-hover-card`  
**Created**: 2026-06-10  
**Status**: Draft  
**Input**: User description: "Profile hover card - a hover state for user avatars that shows at-a-glance user info without leaving current context"

## Problem Statement

Users currently have no way to quickly identify or learn about other users without navigating away from their current page. When browsing member lists, comment threads, or contributor sections, users must click through to a full profile page to see basic information like a person's location or skills. This interrupts workflow and adds unnecessary navigation steps for a simple "who is this person?" moment.

The previous platform design included a hover card on user avatars that solved this problem. The redesigned UI needs an equivalent feature that fits the new design system.

## User Scenarios & Testing *(mandatory)*
### User Story 1 - Quick User Identification (Priority: P1)

A user is browsing a space's member list and sees several avatars. They want to quickly learn who someone is without leaving the page. They hover over an avatar and within 200ms a card appears showing the user's name, photo, location, and top skills. They glance at the info and move their cursor away — the card disappears.

**Why this priority**: This is the core value of the feature — providing at-a-glance context about any user without page navigation. Every other story depends on this fundamental interaction working correctly.

**Independent Test**: Can be fully tested by hovering any user avatar on any page and verifying the card appears with correct user data within 200ms.

**Acceptance Scenarios**:

1. **Given** a user avatar is visible on any page, **When** the user hovers over it for 200ms, **Then** a hover card appears showing the user's profile photo, full name, location, and top 3-5 skill/interest tags with an overflow count
2. **Given** a hover card is visible, **When** the user moves their cursor away from both the avatar and the card, **Then** the card disappears immediately
3. **Given** a user avatar is visible, **When** the user focuses it via keyboard (Tab), **Then** the same hover card appears

---

### User Story 2 - Navigate to Full Profile (Priority: P2)

A user sees someone interesting in the hover card and wants to learn more. The entire hover card acts as a link — clicking anywhere on it navigates to that person's full profile page.

**Why this priority**: After identifying a user, the natural next action is viewing their full profile. This provides the bridge from quick glance to deep exploration.

**Independent Test**: Can be fully tested by hovering an avatar, then clicking the card, and verifying navigation to the correct user's profile page.

**Acceptance Scenarios**:

1. **Given** a hover card is displayed, **When** the user clicks anywhere on the card (except the message button), **Then** they are navigated to the user's full profile page
2. **Given** a hover card is displayed, **When** the user presses Enter while the card has keyboard focus, **Then** they are navigated to the user's full profile page

---

### User Story 3 - Quick Message from Hover Card (Priority: P3)

A user wants to quickly send a message to someone they see in a member list without navigating to their profile first. They hover over the avatar, see the hover card, and click the "Message" button to open the messaging interface.

**Why this priority**: Messaging is the primary action users want to take after identifying someone, but it depends on the card existing first (P1) and can function as an enhancement.

**Independent Test**: Can be fully tested by hovering an avatar, clicking the message button, and verifying the messaging interface opens for that specific user.

**Acceptance Scenarios**:

1. **Given** a hover card is displayed, **When** the user clicks the "Message" button, **Then** the messaging interface opens with the hovered user as the recipient
2. **Given** a hover card is displayed, **When** the user clicks the "Message" button, **Then** the user remains on the current page (messaging opens as overlay/sidebar)

---

### Edge Cases

- What happens when hovering an avatar of a user who has been deactivated or deleted? Card should show a graceful "User no longer active" state
- What happens when the user's profile data is still loading? Card should show a skeleton/loading state briefly
- What happens when the avatar is near the edge of the viewport? Card must auto-position to remain fully visible
- What happens when hovering between multiple avatars quickly? Only the most recently hovered avatar triggers a card (debounced at 200ms)
- What happens for users with no location or tags set? Those fields should be omitted (not shown as empty) and the card should adapt its height
- What happens when the user has an extremely long name? Name should truncate with ellipsis after 2 lines

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a hover card when any user avatar on the platform is hovered for 200ms or longer
- **FR-002**: System MUST display the hover card when any user avatar receives keyboard focus (Tab navigation)
- **FR-003**: The hover card MUST show the user's profile photo (matching the avatar but larger), full display name, location (if set), and top 3-5 tags with a "+N" overflow count
- **FR-004**: The hover card MUST include a "Message" action button that opens the messaging interface for that user
- **FR-005**: Clicking anywhere on the hover card (except the Message button) MUST navigate to the user's full profile page
- **FR-006**: The hover card MUST dismiss immediately when the cursor leaves both the trigger avatar and the card area
- **FR-007**: The hover card MUST auto-position itself to remain fully visible within the viewport (avoid clipping at edges)
- **FR-008**: The system MUST debounce hover triggers — rapid cursor movement across multiple avatars should only show a card for the final resting position
- **FR-009**: The hover card MUST gracefully handle missing profile data (no location, no tags) by omitting empty fields rather than showing blank space
- **FR-010**: The hover card MUST be a desktop-only feature (not triggered on touch devices)
- **FR-011**: The hover card MUST work on all avatar sizes across the platform (from small inline avatars to larger grid thumbnails)
- **FR-012**: The hover card MUST have a visual style consistent with the new design system (not a copy of the old design)

### Key Entities

- **User Profile Card Data**: Display name, profile photo URL, location (city + country code), tags/skills (ordered by relevance, limited to first 5), total tag count, messaging availability
- **Avatar Trigger**: Any rendered user avatar component across the platform, regardless of size or context

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify another user's name, location, and skills within 2 seconds of hovering (card appears in ≤200ms, info is scannable)
- **SC-002**: Users can initiate a message to any visible user within 3 seconds (hover + click Message)
- **SC-003**: The hover card works consistently on 100% of user avatar instances across the platform
- **SC-004**: Users can navigate to a full profile via hover card in under 2 seconds (hover + click)
- **SC-005**: The hover card never obscures the content the user was originally viewing (smart positioning)
- **SC-006**: Keyboard-only users can access the same hover card information as mouse users

## Assumptions

- User profile data (name, location, tags) is already available or can be fetched efficiently when needed
- The messaging system exists and can be invoked programmatically (open conversation with a specific user)
- The platform has a consistent avatar component used across all pages (single integration point)
- Tags are already ordered by relevance/importance in the user's profile data
- Desktop breakpoint is clearly defined in the design system for the touch/hover distinction

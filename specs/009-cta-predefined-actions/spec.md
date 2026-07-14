# 009 — CTA Predefined Space Actions

## Overview

Add a predefined space action picker to the Call to Action section in the Create Post dialog, allowing space administrators and community managers to quickly direct members to consistent, context-independent space actions without manually finding URLs.

## Motivation

The "Apply to join" button for public spaces is moving into the "About this space" dialog, making it less visible. Space admins need a way to surface membership actions (and other space actions) prominently within posts. This feature provides a quick-select mechanism for common space actions as CTA targets.

## User Story

As a **space administrator or community manager**, I want to select a predefined space action as the Call to Action when creating a post, so that I can quickly direct community members to consistent, context-independent space actions without having to manually find and copy internal URLs.

## Acceptance Criteria

1. A small icon button is displayed next to the URL and Display Name input fields in the CTA section
2. Clicking the icon button opens a popover/dropdown with predefined space actions
3. Only context-independent actions are shown (actions that behave the same regardless of where in the space/subspace they are triggered)
4. Only member-level actions are shown (admin-only actions like "Invite users" are excluded)
5. Selecting a predefined action auto-populates both the URL field and the Display Name field
6. The user can still manually enter a custom URL (the picker is optional)
7. The user can override the auto-populated Display Name with a custom label
8. The CTA button renders correctly on the published post, linking to the selected action
9. The "Join this space" action is smart: it auto-detects whether the space uses open membership or applications and adjusts the label/URL accordingly
10. Actions that are disabled in space settings (e.g., "Create a post" when `memberCreatePosts` is off) are shown greyed out with a tooltip explaining why
11. The published CTA should be styled as an internal action (no "external link" indicator)

## Predefined Space Actions

### Category: Membership

| Action | Default Display Name | URL Pattern | Disabled When |
|--------|---------------------|-------------|---------------|
| Join this space | "Join this space" / "Apply to join" | `/space/{slug}/join` | Never (always available for non-members) |

### Category: Navigate / Open

| Action | Default Display Name | URL Pattern | Disabled When |
|--------|---------------------|-------------|---------------|
| View events | "View upcoming events" | `/space/{slug}/calendar` | `subspaceEvents` is off |
| View community | "Meet the community" | `/space/{slug}/community` | Never |
| View subspaces | "Explore subspaces" | `/space/{slug}/subspaces` | Never |
| View knowledge base | "Browse knowledge base" | `/space/{slug}/knowledge-base` | Never |

### Category: Create / Contribute

| Action | Default Display Name | URL Pattern | Disabled When |
|--------|---------------------|-------------|---------------|
| Create a post | "Share something" | `/space/{slug}/new-post` | `memberCreatePosts` is off |
| Create a subspace | "Start a subspace" | `/space/{slug}/new-subspace` | `memberCreateSubspaces` is off |
| Add an event | "Add an event" | `/space/{slug}/new-event` | `subspaceEvents` is off |

### Category: Connect

| Action | Default Display Name | URL Pattern | Disabled When |
|--------|---------------------|-------------|---------------|
| Contact leads | "Get in touch" | `/space/{slug}/contact-leads` | Never |

## UI Design

### Picker Trigger
- Small icon button (e.g., `Zap` or `ListChecks` icon) placed to the right of the URL input field
- Tooltip on hover: "Choose a space action"

### Picker Popover
- Anchored to the icon button, opens below/above depending on viewport
- Actions grouped by category with subtle section headers
- Each action shows: icon + label
- Disabled actions: greyed out text + disabled cursor + tooltip on hover explaining the reason (e.g., "Members are not allowed to create posts in this space")
- Selecting an action closes the popover and fills both fields

### Filled State
- After selection, the URL field shows the resolved URL (read-only or editable)
- Display Name field is populated but fully editable
- A small indicator (badge or icon) could show "Space action" next to the URL to indicate it's a predefined action vs. manual URL

## Technical Notes

- The space slug is available from the current route context
- Space settings (which actions are enabled/disabled) are available from space configuration
- The membership policy (open vs. application) determines the "Join" action variant
- URL patterns use relative paths that resolve correctly within the platform

## Out of Scope

- Admin-only actions (Invite users, Manage settings)
- Context-dependent actions (actions tied to specific pages, tabs, or flow states)
- Custom action definitions (only the predefined list is supported)

# Feature Specification: Collapsed Posts

**Feature Branch**: `006-collapsed-posts`  
**Created**: 2026-06-22  
**Status**: Draft  
**Input**: GitHub ticket — Redesign collapsed post visual treatment to align with the updated UI

## Problem Statement

When posts in a space exceed a certain length, they are visually truncated with a gradient/fade overlay and a "... LEES MEER" (Read More) indicator. This gradient treatment feels like a stylistic mismatch with the cleaner, component-driven aesthetic of the Alkemio 1.5 UI redesign. The fade obscures content in an imprecise way — particularly problematic when posts contain images or embedded media, where the gradient creates an awkward visual artifact over non-text content.

Space admins can currently toggle whether posts in their space collapse by default. This setting should remain, but be **off** (posts fully expanded) for newly created spaces.

## Current Behavior

| Aspect | Current Implementation |
|--------|----------------------|
| Collapse trigger | Posts exceeding a height threshold are auto-collapsed |
| Visual indicator | Gradient/fade overlay from transparent → white over the bottom portion of the post |
| Action label | "... LEES MEER" (Read More) text at the bottom-right corner |
| Image handling | Gradient overlays images/embeds — creates awkward visual conflict |
| Default for new spaces | Collapse is **on** by default |
| Expand interaction | Inline expand |

### Screenshots of Current Implementation

**Post with embedded image (collapsed):**  
The gradient fade overlays the image, creating visual noise and obscuring content in an uncontrolled way.

**Post with text content (collapsed):**  
Body text fades out with a white gradient. The "... LEES MEER" link sits at the bottom-right. The fade feels heavy-handed relative to the clean card-based layout surrounding it.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Scan a Feed of Collapsed Posts (Priority: P1)

A user opens a space's Home tab and sees a feed of posts. Several posts are long and have been collapsed by the space admin's setting. The user can clearly see which posts have more content and can quickly scan post titles and previews without visual noise from fading gradients.

**Why this priority**: This is the primary use case — every user visiting a space with collapse enabled will encounter this view.

**Independent Test**: Navigate to a space with collapse enabled and verify that collapsed posts display cleanly, with a clear but unobtrusive truncation indicator.

**Acceptance Scenarios**:

1. **Given** a post exceeds ~3 lines (~80px) of visible content, **When** collapse is enabled for the space, **Then** the post is truncated at approximately 3 lines with a clear "Read more" affordance
2. **Given** a collapsed post contains only text, **When** viewed in the feed, **Then** the truncation point is a clean cut-off (no gradient/fade) with a visible expand action
3. **Given** a collapsed post is displayed, **When** compared to surrounding UI elements, **Then** the truncation treatment uses the same design language as the rest of the updated UI (card borders, typography, spacing)

---

### User Story 2 — Expand a Collapsed Post Inline (Priority: P1)

A user sees a collapsed post they want to read in full. They click the expand affordance (e.g., "Read more") and the post expands in place within the feed, revealing the full content without page navigation.

**Why this priority**: Expand is the direct counterpart to collapse — both must work together.

**Independent Test**: Click the expand action on a collapsed post and verify the full content appears inline.

**Acceptance Scenarios**:

1. **Given** a collapsed post with a "Read more" indicator, **When** the user clicks the expand affordance, **Then** the post expands smoothly inline to show full content
2. **Given** an expanded post, **When** viewed in the feed, **Then** a "Show less" or collapse affordance is optionally available to re-collapse it
3. **Given** a post that was just expanded, **When** the user scrolls, **Then** the feed maintains stable scroll position (no layout jump that loses the user's place)

---

### User Story 3 — Collapsed Post with Image/Embed (Priority: P1)

A user sees a collapsed post that contains an image, video embed, or other rich media. The truncation treatment handles the media gracefully — either showing it fully or providing a clear visual indication of hidden content without overlaying a gradient on the media.

**Why this priority**: The gradient-over-image problem is explicitly called out in the ticket as the primary visual issue.

**Acceptance Scenarios**:

1. **Given** a collapsed post containing an image, **When** viewed in the feed, **Then** no gradient or fade is overlaid on the image itself
2. **Given** a collapsed post with both text and an image, **When** the text exceeds the collapse threshold, **Then** the text is truncated cleanly and the image handling is contextually appropriate (see Design Direction below)
3. **Given** a collapsed post with an embedded video, **When** viewed in the feed, **Then** the embed is treated consistently with images (no overlay artifacts)

---

### Edge Cases

- What happens when a post has only an image and no text? → Should not collapse (no text to truncate)
- What happens when a post has exactly 3 lines? → Should not collapse (threshold is "exceeds", not "meets")
- What happens when a post contains a very tall single image + short text? → Image handling rules apply (see Design Direction)
- What happens when a user has "Reduce motion" accessibility preference? → Expand animation should respect `prefers-reduced-motion`

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Only the post description/snippet text MUST be truncated at approximately 3 lines when collapse is enabled — all other content (images, documents, whiteboards, collections) remains fully visible at normal size
- **FR-002**: Truncation MUST NOT use a gradient or fade overlay on any content
- **FR-003**: A clear "Read more" affordance MUST be visible on every collapsed post
- **FR-004**: Clicking the "Read more" affordance MUST expand the post inline within the feed
- **FR-005**: The expand interaction MUST NOT cause a page navigation
- **FR-006**: Images and embeds within a collapsed post MUST NOT have any overlay treatment (no gradient, no semi-transparent mask)
- **FR-007**: The collapse setting MUST default to **off** (posts fully expanded) for newly created spaces
- **FR-008**: Existing spaces with collapse enabled MUST retain their current setting (no migration disruption)
- **FR-009**: The collapse/expand transition SHOULD animate smoothly (respect `prefers-reduced-motion`)
- **FR-010**: Posts with content that does not exceed the collapse threshold MUST NOT show any truncation indicator

### Non-Functional Requirements

- **NFR-001**: The collapsed post treatment MUST be visually consistent with the Alkemio 1.5 design system (card styling, typography, spacing)
- **NFR-002**: The "Read more" affordance MUST have sufficient color contrast (WCAG AA minimum)
- **NFR-003**: The "Read more" affordance MUST be keyboard accessible

### Key Entities

- **Post Card**: The containing card component for a single post in the feed
- **Collapse Threshold**: ~3 lines of text / ~80px visible height before truncation kicks in
- **Expand Affordance**: The interactive element that triggers inline expand ("Read more" / "Show less")
- **Space Collapse Setting**: Admin-level toggle controlling whether posts in a space collapse by default

## Design Direction *(visual spec)*

### Approach: Hard Truncation + Platform-Consistent "Read more" Link

Replace the gradient fade with a clean, CSS-based line clamp — matching the pattern already used in the prototype's `PostCard` component (`line-clamp-3`).

> **Design system grounding**: The prototype already uses `line-clamp-3` for post snippets, and a `text-muted-foreground hover:text-primary` pattern for subtle interactive text actions (e.g., "Show more" in the Activity Feed). The collapsed post treatment extends these existing patterns rather than introducing new ones.

---

### Text-Only Posts

```
┌─────────────────────────────────────────────────────┐
│  👤 Simone Rietmeijer  •  24-6-2025                │
│  📄 Post                                    • • •  │
│                                                     │
│  Why Alkemio looks the way it does                  │
│                                                     │
│  So much collaboration today is fleeting. A meeting │
│  ends, a chat thread scrolls away, and the          │
│  momentum quietly disappears. Alkemio is designed...│
│                                                     │
│  Read more                                          │
│─────────────────────────────────────────────────────│
│  💬 0 reacties                                      │
└─────────────────────────────────────────────────────┘
```

- **Truncation**: CSS `line-clamp-3` on the post body (already used in `PostCard.tsx`)
- **Ellipsis**: Browser-native via `-webkit-line-clamp` — ends with `...` automatically
- **"Read more" link**: Sits below the clamped text, above the `CardFooter` border

**"Read more" styling** (using existing design tokens):

| Property | Value | Token |
|----------|-------|-------|
| Font size | 12px | `text-caption` |
| Font weight | 500 | `font-medium` |
| Color (default) | `rgba(100, 116, 139)` | `text-muted-foreground` |
| Color (hover) | `rgba(29, 56, 74)` | `hover:text-primary` |
| Transition | colors, 150ms | `transition-colors` |
| Cursor | pointer | `cursor-pointer` |

This matches the existing "Show more" button pattern in `ActivityFeed.tsx`:
```
text-sm font-medium text-muted-foreground hover:text-primary transition-colors
```

---

### Posts with Images/Embeds

Image handling depends on **position** relative to text:

#### Image appears AFTER text (below the fold)

The image is hidden entirely when collapsed. The "Read more" link is the only indicator that more content exists.

```
┌─────────────────────────────────────────────────────┐
│  👤 Simone Rietmeijer  •  24-6-2025                │
│  📄 Post                                    • • •  │
│                                                     │
│  Join the call!                                     │
│                                                     │
│  Here are the details for our upcoming session...   │
│                                                     │
│  Read more                                          │
│─────────────────────────────────────────────────────│
│  💬 0 reacties                                      │
└─────────────────────────────────────────────────────┘
         ↑ image is hidden — revealed on expand
```

**Rationale**: Keeps collapsed cards compact and uniform. The "Read more" affordance is sufficient to signal hidden content.

#### Image appears BEFORE text (hero position)

The image is shown at a fixed max-height with a clean crop — no gradient, no overlay. Just `overflow: hidden` with `object-fit: cover`.

```
┌─────────────────────────────────────────────────────┐
│  👤 Simone Rietmeijer  •  24-6-2025                │
│  📄 Post                                    • • •  │
│                                                     │
│  Join the call!                                     │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │                                             │    │
│  │         [image — 160px max, cropped]        │    │
│  │                                             │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Read more                                          │
│─────────────────────────────────────────────────────│
│  💬 0 reacties                                      │
└─────────────────────────────────────────────────────┘
```

**Image crop styling:**

| Property | Value |
|----------|-------|
| Max height | `160px` |
| Overflow | `hidden` |
| Object fit | `cover` |
| Border radius | `var(--radius)` (6px) |

**Rationale**: When the image is the primary content (like the "Join the call!" post with the meeting banner), hiding it would remove the post's visual identity. The clean crop preserves the preview without the gradient problem.

#### Image-only posts (no text beyond title)

Do not collapse. There is no text body to truncate, and the image *is* the content.

---

### "Show Less" (Re-collapse)

After expanding, an optional "Show less" link appears at the end of the full content, using the same styling as "Read more". This keeps the interaction reversible without requiring a page reload.

---

### What to Avoid

- ❌ Gradient/fade overlays (the current approach)
- ❌ Semi-transparent masks over images
- ❌ Overlaid text on top of content
- ❌ Heavy borders or separators to indicate truncation
- ❌ New visual patterns not already present in the design system

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Collapsed posts are visually consistent with surrounding card-based UI (no gradient mismatch)
- **SC-002**: Users can clearly distinguish between collapsed and fully-displayed posts
- **SC-003**: Image/embed posts do not have any overlay artifacts when collapsed
- **SC-004**: The "Read more" affordance is discoverable — users expand posts without confusion
- **SC-005**: New spaces default to posts being fully expanded (collapse off)

## Assumptions

- The space admin collapse toggle already exists in the platform settings
- The post feed component already supports variable-height post cards
- The inline expand interaction (click to reveal full content) is already technically feasible in the current architecture
- The design system includes a `text-primary` color token suitable for the "Read more" link

## Out of Scope

- Settings UI for enabling/disabling collapse per space (existing — no visual redesign needed)
- Post creation or editing flows
- Feed pagination or infinite scroll behavior
- Post reactions, comments, or other interactive elements within the post card

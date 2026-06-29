# Feature Specification: V3 Template-Driven Creation Dialogs

**Feature Branch**: `005-v3-creation-dialogs`  
**Created**: 2026-06-16  
**Status**: Draft  
**Input**: Template-driven creation flows for Space, Virtual Contributor, Innovation Hub, and Template Pack — inspired by Microsoft Office's "File > New" template selection pattern.

---

## Design Philosophy

The V3 creation dialogs shift from a "blank form" paradigm to a **template-first** approach. Users are presented with a curated gallery of templates before entering configuration. This reduces cognitive load, provides inspirational starting points, and aligns with the broader platform direction of being template-driven.

### Key Principles

1. **Template-first, not form-first** — Users browse and select before configuring
2. **Progressive disclosure** — Only show fields relevant to what the template hasn't already defined
3. **Visual & sectioned** — Inspired by the Space Settings page: clear section headers, icons, generous whitespace, inline saves
4. **Consistent dialog sizing** — Large modal (similar to the search dialog from home page), maintaining 1-column margin on either side

### Approach by Entity Type

| Entity | Creation Flow |
|--------|--------------|
| **Space** | Template gallery → Wizard steps (same V2 steps in V3 visual style) |
| **Virtual Contributor** | Template gallery (lighter, capability-focused cards) → Wizard steps |
| **Innovation Hub** | Direct wizard (no template picker — straightforward form) |
| **Template Pack** | Direct wizard (admin tool — no template picker) |

---

## User Scenarios & Testing

### User Story 1 — Create a Space from Template (Priority: P1)

A user wants to create a new Space. They open the creation dialog and see a visually rich gallery of Space templates organized by category. The first option is always "Blank Space". They browse templates, select one (e.g., "Community of Practice"), and proceed to a wizard where fields are pre-filled with template defaults. They adjust the name, optionally tweak other fields, and create.

**Why this priority**: This is the most common creation flow on the platform and the primary showcase for the template-driven approach.

**Independent Test**: Can be fully tested by opening the Space creation dialog, selecting a template, reviewing pre-filled wizard steps, and creating a space.

**Acceptance Scenarios**:

1. **Given** a user clicks "Create Space", **When** the dialog opens, **Then** they see a template gallery with "Blank Space" pre-selected as the first item
2. **Given** templates are displayed, **When** a user selects a template, **Then** a brief description/metadata is shown for that template
3. **Given** a template is selected, **When** the user clicks "Continue", **Then** wizard steps appear with fields pre-filled from the template
4. **Given** a template pre-fills most fields, **When** the wizard loads, **Then** steps with all fields pre-filled show a summary view (not editable fields) unless the user explicitly expands them
5. **Given** "Blank Space" is selected, **When** the user proceeds, **Then** all wizard steps show empty fields in the new visual style

---

### User Story 2 — Create a Virtual Contributor from Template (Priority: P2)

A user wants to create a new AI-powered Virtual Contributor. They see a lighter template gallery showing capability-focused cards (e.g., "Research Assistant", "Community Moderator", "Brainstorm Partner"). After selecting, they proceed through identity and capability configuration steps.

**Why this priority**: VCs benefit from archetypes that help users understand what's possible without needing to configure from scratch.

**Independent Test**: Can be fully tested by opening the VC creation dialog, selecting an archetype template, and verifying pre-filled knowledge source and capabilities.

**Acceptance Scenarios**:

1. **Given** a user clicks "Create Virtual Contributor", **When** the dialog opens, **Then** they see a gallery of VC archetype templates with "Blank VC" first
2. **Given** a VC template is selected, **When** the user proceeds, **Then** knowledge source type and capabilities are pre-configured based on the archetype
3. **Given** the "Research Assistant" template is selected, **When** wizard loads, **Then** capabilities like "Answer questions" and "Summarize" are pre-checked

---

### User Story 3 — Create an Innovation Hub (Priority: P3)

A user (typically an admin) wants to create an Innovation Hub. Since Hubs are high-level containers with straightforward configuration, they go directly to a multi-step wizard (no template gallery) in the new V3 visual style.

**Why this priority**: Innovation Hubs are less frequent to create but still need the updated visual treatment.

**Independent Test**: Can be fully tested by opening the Hub creation dialog and completing the wizard without a template step.

**Acceptance Scenarios**:

1. **Given** a user clicks "Create Innovation Hub", **When** the dialog opens, **Then** they see the wizard directly (Step 1: Hub Identity) — no template gallery
2. **Given** the user fills required fields (Subdomain, Name), **When** they proceed through steps, **Then** sections are visually clear with icons, labels, and generous spacing consistent with V3 style
3. **Given** the user reaches "Curate Spaces" step, **When** they add spaces, **Then** the drag/reorder interaction works as in V2

---

### User Story 4 — Create a Template Pack (Priority: P4)

An admin/creator wants to create a Template Pack. As this is a power-user/admin tool, it goes directly to a wizard without a template gallery, using the V3 visual style.

**Why this priority**: Template Packs are created by admins, not end-users. Functional correctness matters more than discovery UX.

**Independent Test**: Can be fully tested by opening the Template Pack creation dialog and completing the wizard.

**Acceptance Scenarios**:

1. **Given** an admin clicks "Create Template Pack", **When** the dialog opens, **Then** they see a wizard directly (Step 1: Pack Identity)
2. **Given** the user adds templates to the pack, **When** they use the template selector, **Then** they can search, filter by type, and reorder

---

### Edge Cases

- What happens when there are no templates available for a category? → Show the "Blank" option only, with a message "More templates coming soon"
- What happens if a template references entities that don't exist? → Pre-fill what's possible, leave invalid references empty with a note
- How does the dialog behave on smaller screens? → Template grid becomes 1-2 columns, wizard steps stack vertically
- What if the user resizes the browser mid-dialog? → Dialog maintains responsive behavior with min/max constraints

---

## Requirements

### Functional Requirements

#### Template Gallery (Spaces & Virtual Contributors)

- **FR-001**: System MUST display a template gallery as the first screen when creating a Space or Virtual Contributor
- **FR-002**: Templates MUST be organized into named categories (sections with headers)
- **FR-003**: The first template option MUST always be "Blank [Entity]" and be pre-selected by default
- **FR-004**: Each template card MUST show: icon, name, and short description (1-2 lines)
- **FR-005**: System MUST support 10+ templates per entity type in a scrollable grid
- **FR-006**: System MUST include a search/filter bar to find templates by name or category
- **FR-007**: Selecting a template and clicking "Continue" MUST advance to the wizard steps
- **FR-008**: Templates MUST be curated per entity type (not sourced from user Template Packs)
- **FR-008a**: Templates MUST be fetched from a backend API at dialog open (admin-managed, dynamic)
- **FR-008b**: Dialog MUST show a loading skeleton while templates are being fetched
- **FR-008c**: If the API fails to return templates, dialog MUST fall back to showing only the "Blank" option with an error notice

#### Wizard Steps (All Entity Types)

- **FR-009**: Wizard steps for Spaces MUST match the V2 structure: Identity → Branding → Purpose → Access
- **FR-010**: Wizard steps for Virtual Contributors MUST match V2: Knowledge Source → Identity → Capabilities
- **FR-011**: Wizard steps for Innovation Hubs MUST match V2: Hub Identity → Branding → Curate Spaces
- **FR-012**: Wizard steps for Template Packs MUST match V2: Pack Identity → Add Templates → Publish Settings
- **FR-013**: When a template is selected, wizard fields MUST be pre-filled with template defaults
- **FR-013a**: Template defaults are limited to **content fields only**: name, tagline, description, and tags. Templates MUST NOT pre-fill access/visibility settings or branding assets (avatar, banner)
- **FR-014**: Pre-filled fields MUST be editable (user can override any template value)
- **FR-015**: Steps where ALL fields are pre-filled SHOULD display a compact summary view with an "Edit" option to expand
- **FR-016**: A step progress indicator MUST be visible showing current position and step labels with icons

#### Visual Style

- **FR-017**: Wizard steps MUST use the V3 visual style: clear section headers with icons, generous whitespace, labeled groups (inspired by Space Settings page)
- **FR-018**: Form fields MUST use shadcn/ui components (Input, Select, RadioGroup, etc.)
- **FR-019**: Dialog MUST be a large modal maintaining 1-column margin on either side of the viewport
- **FR-020**: Sections within wizard steps MUST be visually separated with clear hierarchy (section titles, description text, separator lines)

#### Dialog Behavior

- **FR-021**: Users MUST be able to navigate back to the template gallery from any wizard step
- **FR-022**: Users MUST be able to navigate between completed wizard steps freely
- **FR-023**: Dialog MUST show a "Back" button (except on first screen) and "Continue"/"Create" on the last step
- **FR-024**: The "Create" action MUST show a loading state and display a toast notification on success
- **FR-025**: Closing the dialog mid-wizard SHOULD warn about losing unsaved progress (if fields have been modified)

#### Error Handling

- **FR-026**: When the "Create" action fails due to a **validation error** (from backend), the dialog MUST stay open on the last step and display an inline error banner indicating what needs to be fixed
- **FR-027**: When the "Create" action fails due to a **network error**, the dialog MUST stay open and show a toast notification with a retry option
- **FR-028**: The "Create" button MUST remain enabled after an error so the user can retry

#### Entry Points

- **FR-029**: V3 creation dialogs MUST be triggered from the same locations as V2 (dashboard, space page, admin panels)
- **FR-030**: No new entry points are required beyond what V2 already provides

#### Transitions & Animation

- **FR-031**: Transitions between the template gallery and wizard steps MUST use subtle slide/fade animations (left/right slide for forward/back navigation)
- **FR-032**: Step-to-step transitions within the wizard MUST also use a subtle slide animation consistent with the gallery-to-wizard transition
- **FR-033**: Animations SHOULD respect `prefers-reduced-motion` media query and disable when the user has motion reduction enabled

### Non-Functional Requirements

- **NFR-001**: Template gallery MUST render within 200ms of dialog open
- **NFR-002**: Dialog MUST be keyboard accessible (Tab navigation, Enter to select, Escape to close)
- **NFR-003**: Dialog MUST work on viewports ≥768px wide (responsive grid)

---

## Key Entities

### Template (Gallery Item)

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique template identifier |
| `name` | string | Display name (e.g., "Community of Practice") |
| `description` | string | Short description (1-2 sentences) |
| `icon` | LucideIcon | Visual icon for the card |
| `category` | string | Category/section label (e.g., "Collaboration", "Learning") |
| `defaults` | `{ name?: string; tagline?: string; description?: string; tags?: string[] }` | Pre-fill values for content fields only (no access/visibility/branding) |
| `entityType` | enum | `space` \| `virtual-contributor` |

### Template Category

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Category identifier |
| `label` | string | Display label (e.g., "Community & Collaboration") |
| `order` | number | Sort order for display |

---

## Curated Template Categories

### Space Templates

| Category | Templates |
|----------|-----------|
| **Getting Started** | Blank Space |
| **Community & Collaboration** | Community of Practice, Working Group, Stakeholder Network, Peer Learning Circle |
| **Innovation & Research** | Innovation Challenge, Research Hub, Idea Incubator, Design Sprint |
| **Projects & Programs** | Project Space, Program Coordination, Agile Team, Product Development |
| **Learning & Education** | Course Space, Workshop Series, Knowledge Base, Training Program |
| **Events & Campaigns** | Event Space, Hackathon, Campaign Hub, Conference Track |

### Virtual Contributor Templates

| Category | Templates |
|----------|-----------|
| **Getting Started** | Blank Virtual Contributor |
| **Knowledge & Research** | Research Assistant, Knowledge Curator, Literature Reviewer, Data Analyst |
| **Community & Engagement** | Community Moderator, Onboarding Guide, Discussion Facilitator, Feedback Collector |
| **Creative & Strategy** | Brainstorm Partner, Strategy Advisor, Content Creator, Writing Coach |

---

## UI Component Structure

```
┌──────────────────────────────────────────────────────────────┐
│  Dialog (large modal, 1-col margins)                         │
│                                                              │
│  ┌─ STEP 0: Template Gallery ─────────────────────────────┐  │
│  │                                                         │  │
│  │  [Title: "Create a new Space"]                          │  │
│  │  [Subtitle: "Choose a template to get started"]         │  │
│  │                                                         │  │
│  │  [🔍 Search templates...]                               │  │
│  │                                                         │  │
│  │  ── Getting Started ──────────────────────────────      │  │
│  │  [● Blank Space]                                        │  │
│  │                                                         │  │
│  │  ── Community & Collaboration ────────────────────      │  │
│  │  [ Community of Practice ] [ Working Group ]            │  │
│  │  [ Stakeholder Network ] [ Peer Learning Circle ]       │  │
│  │                                                         │  │
│  │  ── Innovation & Research ────────────────────────      │  │
│  │  [ Innovation Challenge ] [ Research Hub ]              │  │
│  │  [ Idea Incubator ] [ Design Sprint ]                   │  │
│  │                                                         │  │
│  │  (scrollable...)                                        │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                              │
│  [                                          ] [ Continue → ] │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  Dialog (wizard step)                                        │
│                                                              │
│  ┌─ Progress: [●─Identity] [○─Branding] [○─Purpose] [○─Access]│
│  │                                                         │  │
│  │  [← Back to templates]                                  │  │
│  │                                                         │  │
│  │  ✦ Identity                                             │  │
│  │  Define your space's core identity.                     │  │
│  │                                                         │  │
│  │  ── Space Name ──────────────────────────────────       │  │
│  │  [Icon] [Input: "Community of Practice"  ]              │  │
│  │                                                         │  │
│  │  ── Tagline ─────────────────────────────────────       │  │
│  │  [Icon] [Input: "A space for practitioners to..." ]     │  │
│  │                                                         │  │
│  │  ── Description ─────────────────────────────────       │  │
│  │  [Icon] [Markdown Editor with pre-filled content]       │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                              │
│  [ ← Back                              ] [ Continue → ]      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Template Card Component

```
┌─────────────────────────────┐
│  [Icon]                     │
│                             │
│  Template Name              │
│  Short description that     │
│  explains the purpose in    │
│  1-2 lines max.             │
│                             │
└─────────────────────────────┘
```

- **Unselected**: `border-border bg-background hover:border-primary/50 hover:bg-accent/50`
- **Selected**: `border-primary bg-primary/5 ring-2 ring-primary/20`
- **Layout**: Grid of cards, 3-4 columns depending on dialog width

---

## Design Tokens & Visual Style

| Element | Style |
|---------|-------|
| Dialog | `max-w-4xl` or similar, centered, rounded-xl, shadow-lg |
| Section headers | Uppercase text-label, text-muted-foreground, with icon |
| Form labels | `text-label`, paired with helper text below |
| Template cards | Rounded-lg, border, padding-4, gap-3 grid |
| Step progress | Horizontal dots/labels with connecting line, active = primary |
| Category headers | Bold subsection-title, separator line below |
| Spacing | Generous — `space-y-6` between sections, `gap-4` in grids |

---

## Out of Scope

- Template creation/editing by end users (admin-only, separate feature)
- Template marketplace or sharing between organizations
- AI-generated template suggestions
- Template versioning
- Analytics on template usage

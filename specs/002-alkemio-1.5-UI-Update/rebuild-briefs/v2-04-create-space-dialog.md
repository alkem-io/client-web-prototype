# V2 Design Brief: Create Space Dialog

**Route**: Modal triggered from Account Settings → Hosted Spaces  
**Audience**: Authenticated users with space creation capacity  
**Primary Use**: Multi-step wizard to create a new collaborative space with optional access rules and initial community

---

## Implementation Constraints

> **CRITICAL**: When implementing this brief, the following rules MUST be observed:
>
> 1. Do NOT reference or look at v1 dialog implementations (`CreateSpaceDialog.tsx`, `CreateSpaceForm.tsx`)
> 2. Do NOT reference screenshots of the old/current platform
> 3. ONLY use the user stories defined in `v2-user-stories/create-space-stories.md`
> 4. ONLY use existing design components: shadcn/ui primitives + the CRD dialog shell pattern
> 5. If absolutely necessary, create a new element using the shadcn design system — but prefer existing components
> 6. All field arrangements below are derived from user story priority, NOT from any v1 layout

---

## Design Brief

You are designing a multi-step creation wizard for a Space — the primary collaborative environment on Alkemio. The wizard uses the CRD (Consistent Responsive Dialog) pattern and adds progressive enhancement through optional steps, while preserving the ability to create a space in under 30 seconds.

The dialog has 3 steps. Only Step 1 contains a mandatory field (Name). Steps 2 and 3 are entirely optional — the user can create a space at any point once the name is filled.

---

## Wizard Overview

| Step | Title | Purpose | Required Fields |
|------|-------|---------|-----------------|
| 1 | Identity | Define what this space is | Name* |
| 2 | Branding & Discovery | Make it look polished before members arrive | None |
| 3 | Access & Members | Set who can see/join and invite initial people | None |

---

## Step 1: Identity

**Purpose**: Establish the space's core identity. Only the name is mandatory — everything else helps but doesn't block creation.

**Key Elements**:

1. **Name** (required)
   - Single-line text input, prominently placed as the first field
   - Placeholder: "e.g. Climate Action Hub"
   - Red asterisk indicator for required
   - Helper text: "Give your space a clear, descriptive name"

2. **Template Selector** (optional)
   - Dropdown with options: "Start from scratch", "Challenge", "Project", "Community"
   - Selecting a template pre-fills other fields with suggested content
   - Helper text: "Choose a template to pre-fill content"
   - Placed AFTER name so the user's first action is naming, not choosing

3. **Tagline** (optional)
   - Single-line text input
   - Placeholder: "A short one-line summary"
   - Helper text: "Shown on space cards throughout the platform"

4. **Description** (optional)
   - Rich text editor (MarkdownEditor component)
   - Placeholder: "Describe what this space is about..."
   - Helper text: "Rich text — supports headings, links, and lists"

**Layout**: Vertical stack with consistent spacing between fields. Each field has a bold label, the input, and muted helper text below.

---

## Step 2: Branding & Discovery

**Purpose**: Visual polish and discoverability. All optional — these can be added later from Space Settings.

**Key Elements**:

1. **Tags** (full width, top of step)
   - Tag input with enter-to-add behavior
   - Tags displayed as removable badges above the input
   - Placeholder: "Type a tag and press Enter"
   - Helper text: "Help people discover your space through search"
   - Placed first because tags have highest impact on discoverability

2. **Visual Identity** (two-column grid on tablet+, stacked on mobile)
   - **Avatar upload**: Dashed border drop zone with upload button and circular preview
     - Helper text: "Square image shown as the space icon"
   - **Card Banner upload**: Dashed border drop zone with upload button and wide preview
     - Helper text: "Wide image shown on the space card"

---

## Step 3: Access & Members

**Purpose**: Set access rules and invite initial community members. Entirely optional — defaults to Public + Open membership.

**Key Elements**:

1. **Visibility** (radio group, two options)
   - **Public** (default): "Anyone can see this space"
   - **Private**: "Only members can see this space"
   - Helper text: "You can change this later in Settings"

2. **Membership Mode** (radio group, three options, visually separated from visibility)
   - **Open** (default): "Anyone can join"
   - **By application**: "Users request to join"
   - **Invite only**: "Members must be invited"
   - Helper text: "Controls how people join your space"

3. **Invite Members** (multi-input field, visually separated)
   - Text input for email addresses or usernames
   - Enter-to-add behavior (same as tags pattern)
   - Added invitees shown as removable badges above input
   - Placeholder: "email@example.com or username"
   - Helper text: "Add email addresses or usernames to invite people right away"

---

## Footer (Persistent Across All Steps)

The footer is the wizard's control center. It is always visible and pinned at the bottom of the dialog.

**Layout**: Two zones — left and right — spread across the full footer width.

**Left Zone**:
- **Progress dots**: One dot per step, filled/highlighted for current/completed, muted for future. All dots are **clickable** — user can jump to any step directly.
- **Skip link** (shown on Steps 2 and 3): Underlined muted text "Skip this step" — advances to next step

**Right Zone** (action buttons):
- **Cancel**: Ghost-styled button, closes dialog without saving
- **Create Space**: Secondary-styled button, **always visible** once Name is filled. Users can create at any moment regardless of which step they're on.
- **Next →**: Primary-styled button, advances to next step. Hidden on the final step (where "Create Space" becomes primary-styled instead).

---

## Visual Requirements

- CRD dialog shell: responsive widths (sm→2xl, md→3xl, lg→4xl, xl→5xl), max-height 90vh, scrollable body
- Header with section-title text and muted description, border-separated from body
- Body area is scrollable; footer is pinned at bottom with top border
- All labels use bold/emphasis styling
- All helper text uses small/caption muted styling
- Required fields marked with red asterisk
- Radio groups use descriptive labels with full-sentence explanations
- Image upload zones use dashed borders with centered content
- Badges for tags/invitees use secondary variant with × remove action
- Smooth transitions on progress dot state changes
- Mobile (<640px): full-screen dialog, single column throughout
- Tablet/Desktop: standard dialog, two-column grid for image uploads

---

## Interaction Rules

1. Dialog opens → Step 1 focused, "Create Space" button disabled
2. User types in Name → "Create Space" becomes enabled (persists regardless of step)
3. "Next →" advances step; progress dot fills
4. Clicking any progress dot jumps to that step (even future steps)
5. "Skip this step" is equivalent to "Next →"
6. "Create Space" at any step → submits all filled data, creates space, closes dialog
7. After creation → navigate to the new space page
8. "Cancel" → closes dialog, no data saved
9. Template selection pre-fills fields but does not lock them — user can always override

---

## Data Model Alignment

| Field | Source (existing settings page) | Default Value |
|-------|--------------------------------|---------------|
| Name | SpaceSettings → About tab | — (required) |
| Tagline | SpaceSettings → About tab | empty |
| Description | SpaceSettings → About tab | empty |
| Template | Space creation API | "blank" |
| Avatar | SpaceSettings → About tab | none |
| Card Banner | SpaceSettings → About tab | none |
| Tags | SpaceSettings → About tab | [] |
| Visibility | SpaceSettings → Settings tab | "public" |
| Membership Mode | SpaceSettings → Settings tab | "open" |
| Invited Members | SpaceSettings → Community tab | [] |

**No new fields are invented. Every field maps to an existing settings page.**

---

## User Stories Covered

| Story ID | Description | Step |
|----------|-------------|------|
| CS-01 | Set name | Step 1 (required) |
| CS-02 | Write tagline | Step 1 |
| CS-03 | Write description | Step 1 |
| CS-04 | Add tags | Step 2 |
| CS-05 | Upload avatar | Step 2 |
| CS-06 | Upload card banner | Step 2 |
| CS-07 | Select template | Step 1 |
| CS-10 | Set visibility | Step 3 |
| CS-11 | Set membership mode | Step 3 |
| CS-12 | Invite members | Step 3 |
| CS-17 | Progress indicator | Footer (dots) |
| CS-18 | Skip to creation | Footer ("Create Space" always visible) |
| CS-19 | Navigate back | Footer (clickable dots) |
| CS-20 | Required vs optional clarity | All (asterisks + helpers) |

---

## Components Required

All from existing shadcn/ui library + one existing custom component:

- Dialog (shell, header, footer, content)
- Button (ghost, secondary, primary variants)
- Input (text fields)
- Label (field labels)
- Select (template dropdown)
- RadioGroup + RadioGroupItem (visibility, membership)
- Badge (tags, invitees)
- Avatar (image preview)
- Separator (visual dividers between sections)
- MarkdownEditor (existing custom component)

**No new components need to be created.**

---

## Accessibility

- Required fields: visible asterisk + `aria-required`
- Progress dots: each has `aria-label` with step name and state
- Step navigation: focus moves to first field of new step
- Escape closes dialog (standard CRD behavior)
- Full keyboard navigation via Tab
- Radio groups navigable with arrow keys

---

## Personas

- **Space Host** (primary): Creating a new space for their community
- **Facilitator**: Setting up a workspace for a challenge or project
- **Portfolio Owner**: Creating spaces for organizational initiatives

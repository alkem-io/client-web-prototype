# V2 Design Brief: Create Innovation Hub Dialog

**Route**: Modal triggered from Account Settings → Custom Homepages  
**Audience**: Authenticated users with Innovation Hub creation capacity (max 1 per account)  
**Primary Use**: Multi-step wizard to create a branded landing page with optional space curation

---

## Implementation Constraints

> **CRITICAL**: When implementing this brief, the following rules MUST be observed:
>
> 1. Do NOT reference or look at v1 dialog implementation (`CreateInnovationHubDialog.tsx`)
> 2. Do NOT reference screenshots of the old/current platform
> 3. ONLY use the user stories defined in `v2-user-stories/create-innovation-hub-stories.md`
> 4. ONLY use existing design components: shadcn/ui primitives + the CRD dialog shell pattern
> 5. If absolutely necessary, create a new element using the shadcn design system — but prefer existing components
> 6. All field arrangements below are derived from user story priority, NOT from any v1 layout

---

## Design Brief

You are designing a multi-step creation wizard for an Innovation Hub — a custom-branded landing page that showcases a curated selection of the user's hosted spaces under a dedicated subdomain. The wizard uses the CRD (Consistent Responsive Dialog) pattern.

The dialog has 3 steps. Step 1 has two required fields (Subdomain + Name). Steps 2 and 3 are entirely optional — the hub can launch empty and be configured later.

The key v2 enhancement is Step 3: letting users select and order their spaces during creation rather than navigating to settings afterward.

**Capacity note**: Each account can have at most 1 Innovation Hub. The UI should be aware of this constraint.

---

## Wizard Overview

| Step | Title | Purpose | Required Fields |
|------|-------|---------|-----------------|
| 1 | Hub Identity | Set the URL and name | Subdomain*, Name* |
| 2 | Branding | Visual identity for the landing page | None |
| 3 | Curate Spaces | Choose which spaces to feature and their order | None |

---

## Step 1: Hub Identity

**Purpose**: Establish the hub's URL (subdomain) and display name. Both are required. The subdomain is the most critical field since it determines the permanent URL.

**Key Elements**:

1. **Subdomain** (required)
   - Text input with a fixed suffix indicator (".alkem.io") displayed adjacent to the input
   - The input and suffix should appear as a single connected field (input has no right border radius; suffix has no left border radius, muted background)
   - Auto-formatting on input: lowercase only, replaces special characters with hyphens, collapses double hyphens, strips leading hyphens
   - Placeholder: "my-hub"
   - Red asterisk indicator
   - **Live URL preview** below the field: "Your hub will be available at **{subdomain}.alkem.io**" — updates as user types
   - Helper text appears as the live preview itself (no separate helper needed)

2. **Name** (required)
   - Single-line text input
   - Placeholder: "e.g. Innovation Lab"
   - Red asterisk indicator
   - Helper text: "The display name shown to visitors"

3. **Tagline** (optional)
   - Single-line text input
   - Placeholder: "A short headline for your hub"
   - Helper text: "Shown below the hub name on the landing page"

4. **Description** (optional)
   - Rich text editor (MarkdownEditor component)
   - Placeholder: "Describe what this hub is about..."
   - Helper text: "Helps visitors understand the purpose of your hub"

**Layout**: Vertical stack. Subdomain field is visually prominent (first field, combined input+suffix pattern).

---

## Step 2: Branding (Optional)

**Purpose**: Set the visual identity for the hub landing page. All optional — the hub can launch with defaults.

**Key Elements**:

1. **Banner Image** (full width)
   - Dashed border drop zone, taller than typical upload areas (~140px min-height)
   - Upload button centered in drop zone
   - Preview: shows uploaded image at full width, object-cover
   - Helper text: "Displayed at the top of your hub landing page"
   - Placed first because the banner has the highest visual impact

2. **Logo and Tags** (two-column grid on tablet+, stacked on mobile)
   - **Logo/Avatar upload**: Dashed border drop zone with upload button and circular preview
     - Helper text: "Your hub's icon in navigation"
   - **Tags**: Tag input with enter-to-add, badges above input
     - Placeholder: "Type a tag and press Enter"
     - Helper text: "Help people discover your hub"

---

## Step 3: Curate Spaces (Optional)

**Purpose**: The key v2 capability — select which of the user's hosted spaces to feature on the hub, and set their display order. The hub can launch without any spaces and be configured later.

**Key Elements**:

1. **Summary header**
   - Bold label: "Featured Spaces"
   - Dynamic counter: "X spaces selected" or "Select spaces to showcase on your hub (optional)" when empty

2. **Selected spaces list** (visible when at least one space is selected)
   - Label above: "Display Order"
   - Vertical list of selected items, each containing:
     - Drag handle (grip dots icon) for reorder
     - Space name (bold)
     - Host organization name (muted, small)
     - Visibility badge ("public" / "private", outline styled)
     - Move up/down arrow buttons (small, for keyboard-friendly reorder)
     - × remove button
   - Items reorderable via drag or arrow buttons
   - The order here = display order on the hub landing page

3. **Available spaces list** (below separator, scrollable ~240px max-height)
   - Label above: "Available Spaces"
   - Vertical list of the user's hosted spaces NOT yet selected
   - Each item: checkbox (unchecked), space name (bold), host name (muted), visibility badge
   - Clicking an item adds it to the selected list above
   - Hover state: subtle border highlight
   - Empty state: "All your spaces are already selected" (when all are chosen)

**Interaction**: Clicking an available space adds it to the bottom of the selected list. Removing from selected returns it to available. Order is set via drag handles or ↑↓ buttons.

---

## Footer (Persistent Across All Steps)

Same pattern as all creation wizards. Pinned at dialog bottom.

**Left Zone**:
- **Progress dots**: 3 dots, clickable to jump to any step
- **Skip link** (shown on Steps 2 and 3): Text: "Skip this step"

**Right Zone**:
- **Cancel**: Ghost button, closes dialog
- **Create Hub**: Secondary-styled, enabled once Subdomain AND Name are filled. Always visible.
- **Next →**: Primary button, advances step. Hidden on Step 3 (where "Create Hub" becomes primary).

---

## Visual Requirements

- CRD dialog shell: responsive widths, max-height 90vh, scrollable body
- Header with section-title and muted description, border-separated
- Body scrollable; footer pinned with top border
- Subdomain field: combined input+suffix pattern (connected elements, suffix has muted background)
- Live URL preview: emphasized text (bold for the dynamic part)
- Banner upload zone: taller than standard image fields, full-width
- Space list items: bordered containers with grip handle, info, badge, actions
- Visibility badges: outline-styled, small text
- All labels bold/emphasis styled
- All helpers small/caption muted
- Mobile (<640px): full-screen dialog, single column, subdomain suffix may wrap below input
- Tablet/Desktop: standard dialog, Logo + Tags side-by-side on Step 2

---

## Interaction Rules

1. Dialog opens → Step 1 focused, "Create Hub" disabled
2. User types subdomain → live URL preview updates in real-time
3. User enters Name → "Create Hub" becomes enabled (persists across steps)
4. User can click "Create Hub" at any point → creates hub, navigates to settings
5. "Next →" → Step 2 (Branding)
6. "Next →" or "Skip" → Step 3 (Curate Spaces)
7. On Step 3: clicking available spaces adds them to selected list; order via drag/arrows
8. "Create Hub" → creates with all data
9. After creation → navigate to `/innovation-hub/${slug}/settings`
10. "Cancel" → closes dialog, no data saved
11. Subdomain auto-format happens on every keystroke (no surprising behavior on blur)

---

## Data Model Alignment

| Field | Source (existing page) | Default Value |
|-------|----------------------|---------------|
| Subdomain | InnovationHubSettingsPage → About tab | — (required) |
| Name | InnovationHubSettingsPage → About tab | — (required) |
| Tagline | InnovationHubSettingsPage → About tab | empty |
| Description | InnovationHubSettingsPage → About tab | empty |
| Banner Image | InnovationHubSettingsPage → About tab | none |
| Logo/Avatar | InnovationHubSettingsPage → About tab | none |
| Tags | InnovationHubSettingsPage → About tab | [] |
| Featured Spaces | InnovationHubSettingsPage → Spaces tab | [] |
| Space Order | InnovationHubSettingsPage → Spaces tab | insertion order |

**No new fields are invented. Every field maps to the existing InnovationHubSettings data model.**

---

## User Stories Covered

| Story ID | Description | Step |
|----------|-------------|------|
| IH-01 | Set subdomain | Step 1 (required) |
| IH-02 | Live URL preview | Step 1 (dynamic text) |
| IH-03 | Set display name | Step 1 (required) |
| IH-04 | Write tagline | Step 1 |
| IH-05 | Write description | Step 1 |
| IH-06 | Add tags | Step 2 |
| IH-07 | Upload banner | Step 2 |
| IH-11 | Select spaces to feature | Step 3 |
| IH-12 | Reorder spaces | Step 3 |
| IH-13 | See space visibility | Step 3 (badges) |
| IH-14 | See host account | Step 3 (muted text) |
| IH-15 | Upload logo | Step 2 |
| IH-16 | Progress indicator | Footer (dots) |
| IH-17 | Skip space selection | Footer ("Create Hub" + skip) |
| IH-18 | Navigate back | Footer (clickable dots) |
| IH-19 | Summary of selected | Step 3 (counter + list) |

---

## Components Required

All from existing shadcn/ui library + one existing custom component:

- Dialog (shell, header, footer, content)
- Button (ghost, secondary, primary, outline variants)
- Input (text fields)
- Label (field labels)
- Checkbox (space selection)
- Badge (tags, visibility badges)
- Avatar (logo preview)
- Separator (visual dividers)
- MarkdownEditor (existing custom component)

**No new components need to be created.**

---

## Accessibility

- Subdomain live preview: `aria-live="polite"` for screen reader announcements
- Space list items: interactive with keyboard (Tab + Enter/Space to select)
- Reorder buttons: `aria-label` ("Move up" / "Move down")
- Required fields: visible asterisk + `aria-required`
- Focus moves to first field of new step on navigation
- Escape closes dialog

---

## Personas

- **Account Holder** (primary): Creating a branded hub to showcase their hosted spaces
- **Organization Leader**: Launching a public-facing landing page for their portfolio
- **Innovation Manager**: Curating a collection of challenge spaces under one brand

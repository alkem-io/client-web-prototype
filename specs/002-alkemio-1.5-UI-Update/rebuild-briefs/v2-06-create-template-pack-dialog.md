# V2 Design Brief: Create Template Pack Dialog

**Route**: Modal triggered from Account Settings → Template Packs  
**Audience**: Authenticated users with template pack creation capacity  
**Primary Use**: Multi-step wizard to create a template pack with optional template curation and publish settings

---

## Implementation Constraints

> **CRITICAL**: When implementing this brief, the following rules MUST be observed:
>
> 1. Do NOT reference or look at v1 dialog implementation (`CreateTemplatePackDialog.tsx`)
> 2. Do NOT reference screenshots of the old/current platform
> 3. ONLY use the user stories defined in `v2-user-stories/create-template-pack-stories.md`
> 4. ONLY use existing design components: shadcn/ui primitives + the CRD dialog shell pattern
> 5. If absolutely necessary, create a new element using the shadcn design system — but prefer existing components
> 6. All field arrangements below are derived from user story priority, NOT from any v1 layout

---

## Design Brief

You are designing a multi-step creation wizard for a Template Pack — a curated bundle of reusable templates (space templates, post templates, whiteboard templates, etc.) that can be shared with the community. The wizard uses the CRD (Consistent Responsive Dialog) pattern.

The dialog has 3 steps. Only Step 1 contains a mandatory field (Name). Steps 2 and 3 are entirely optional — the user can create an empty pack and populate it later from the settings page.

The key v2 enhancement is Step 2: letting users browse and add existing templates during creation, rather than requiring navigation to settings afterward.

---

## Wizard Overview

| Step | Title | Purpose | Required Fields |
|------|-------|---------|-----------------|
| 1 | Pack Identity | Name and describe the pack | Name* |
| 2 | Add Templates | Browse and select templates to include | None |
| 3 | Publish Settings | Control visibility and authorship | None |

---

## Step 1: Pack Identity

**Purpose**: Establish what the pack is. Only name is mandatory.

**Key Elements**:

1. **Name** (required)
   - Single-line text input, first and most prominent field
   - Placeholder: "e.g. Innovation Workshop Kit"
   - Red asterisk indicator
   - Helper text: "Give your template pack a clear name"

2. **Description** (optional)
   - Rich text editor (MarkdownEditor component)
   - Placeholder: "Describe what templates are included and when to use them..."
   - Helper text: "Helps others understand the purpose of this pack"

3. **Tags** (optional)
   - Tag input with enter-to-add behavior
   - Tags displayed as removable badges above input
   - Placeholder: "Type a tag and press Enter"
   - Helper text: "Help others find your pack in the template library"

4. **Cover Image** (optional)
   - Dashed border drop zone with upload button and image preview
   - Helper text: "Displayed as the pack thumbnail in the template library"

**Layout**: Vertical stack. Tags and Cover Image can be side-by-side on tablet+ (two-column grid) to save vertical space.

---

## Step 2: Add Templates (Optional)

**Purpose**: The key v2 capability — browse existing templates and add them to the pack. The pack can be created empty; templates can always be added later from settings.

**Key Elements**:

1. **Summary header**
   - Bold label: "Templates"
   - Dynamic counter text: "X templates selected" or "Add templates to your pack (optional)" when empty

2. **Selected templates list** (visible when at least one template is selected)
   - Vertical list of selected items
   - Each item: drag handle (grip dots), template name (bold), template type (muted), type badge, × remove button
   - Items are reorderable via drag or arrow buttons
   - Label above list: "Display Order"

3. **Search and filter bar** (below selected list, separated visually)
   - Text input for search (placeholder: "Search templates...")
   - Type filter dropdown: "All types", "Space", "Post", "Whiteboard", "Callout"
   - Both filter the available templates list in real-time

4. **Available templates list** (scrollable area, max ~240px height)
   - Vertical list of browse-able template items
   - Each item: checkbox, template name (bold), short description (muted, truncated), type badge
   - Clicking an item toggles its selection (checkbox reflects state)
   - Selected items get highlighted border + background tint
   - Empty state: "No templates found matching your search"

**Interaction**: Selecting a template adds it to the "Selected" list above. Deselecting removes it. The selected list supports reordering.

---

## Step 3: Publish Settings (Optional)

**Purpose**: Control who can discover and use the pack. Defaults to "Listed" (publicly visible in the template library).

**Key Elements**:

1. **Visibility** (radio group, two options)
   - **Listed** (default): "Visible in the template library"
   - **Private**: "Only you can see this pack"
   - Helper text: "You can change this later in Settings"

2. **Provider Name** (optional, visually separated)
   - Single-line text input
   - Placeholder: "e.g. Your Organization Name"
   - Helper text: "Shown as the author of this template pack"

3. **References** (optional, visually separated)
   - Label: "References"
   - Helper text: "Add links to documentation or resources"
   - Enter-to-add URL input
   - Added references shown as removable badges

---

## Footer (Persistent Across All Steps)

Same pattern as all creation wizards. Pinned at dialog bottom.

**Left Zone**:
- **Progress dots**: 3 dots, clickable to jump to any step
- **Skip link** (shown on Steps 2 and 3): Text: "Skip this step"

**Right Zone**:
- **Cancel**: Ghost button, closes dialog
- **Create Pack**: Secondary-styled, enabled once Name is filled. Always visible.
- **Next →**: Primary button, advances step. Hidden on Step 3 (where "Create Pack" becomes primary).

---

## Visual Requirements

- CRD dialog shell: responsive widths, max-height 90vh, scrollable body
- Header with section-title and muted description, border-separated
- Body scrollable; footer pinned with top border
- Template browse list: bordered items with checkbox, comfortable padding, hover state
- Selected template list: bordered items with grip handle, type badge, remove button
- Search/filter bar: input and dropdown side-by-side on same row
- Type badges: outline-styled badges with small text (e.g., "Space", "Post")
- All labels bold/emphasis styled
- All helpers small/caption muted
- Mobile (<640px): full-screen dialog, single column, search/filter stack
- Tablet/Desktop: standard dialog, Tags + Cover Image side-by-side on Step 1

---

## Interaction Rules

1. Dialog opens → Step 1 focused, "Create Pack" disabled
2. User enters Name → "Create Pack" becomes enabled (persists across steps)
3. "Next →" advances to Step 2
4. User can click "Create Pack" at any point → creates pack (empty or with templates)
5. On Step 2: clicking templates toggles selection; selected items appear in reorderable list above
6. Search/filter updates available list in real-time
7. "Next →" or "Skip" → Step 3
8. After creation → navigate to `/templates/packs/${slug}/settings`
9. "Cancel" → closes dialog, no data saved

---

## Data Model Alignment

| Field | Source (existing page) | Default Value |
|-------|----------------------|---------------|
| Name | PackSettingsPage → About tab | — (required) |
| Description | PackSettingsPage → About tab | empty |
| Tags | PackSettingsPage → About tab | [] |
| Cover Image | PackSettingsPage → About tab | none |
| Templates | PackSettingsPage → Templates tab | [] |
| Visibility | PackSettingsPage → About tab | "listed" |
| Provider Name | PackSettingsPage → About tab | empty |
| References | PackSettingsPage → About tab | [] |

**No new fields are invented. Every field maps to the existing PackSettings data model.**

---

## User Stories Covered

| Story ID | Description | Step |
|----------|-------------|------|
| TP-01 | Set name | Step 1 (required) |
| TP-02 | Write description | Step 1 |
| TP-03 | Add tags | Step 1 |
| TP-04 | Upload cover image | Step 1 |
| TP-08 | Set provider name | Step 3 |
| TP-09 | Add references | Step 3 |
| TP-10 | Set visibility | Step 3 |
| TP-12 | Browse and add existing templates | Step 2 |
| TP-14 | Reorder templates | Step 2 |
| TP-15 | Filter/search templates | Step 2 |
| TP-16 | See template types | Step 2 (badges) |
| TP-17 | Progress indicator | Footer (dots) |
| TP-18 | Skip template selection | Footer ("Create Pack" + skip) |
| TP-19 | Navigate back | Footer (clickable dots) |
| TP-20 | Summary of selected | Step 2 (counter + list) |

---

## Components Required

All from existing shadcn/ui library + one existing custom component:

- Dialog (shell, header, footer, content)
- Button (ghost, secondary, primary, outline variants)
- Input (text, search fields)
- Label (field labels)
- Select (type filter dropdown)
- RadioGroup + RadioGroupItem (visibility)
- Checkbox (template selection)
- Badge (tags, type badges, references)
- Separator (visual dividers)
- MarkdownEditor (existing custom component)

**No new components need to be created.**

---

## Accessibility

- Template list items: interactive with keyboard (Tab + Enter/Space to toggle)
- Checkbox state changes announced by screen readers
- Search results count: `aria-live="polite"` for dynamic updates
- Reorder controls: `aria-label` on grip handles and move buttons
- Required fields: visible asterisk + `aria-required`
- Focus moves to first field of new step on navigation
- Escape closes dialog

---

## Personas

- **Template Author** (primary): Creating a curated bundle of templates for the community
- **Facilitator**: Bundling space/post templates for a specific methodology
- **Organization Admin**: Packaging organizational templates for distribution

# V2 Design Brief: Create Virtual Contributor Dialog

**Route**: Modal triggered from Account Settings → Virtual Contributors  
**Audience**: Authenticated users with VC creation capacity  
**Primary Use**: Multi-step wizard to create an AI-powered Virtual Contributor with knowledge source configuration and optional capabilities

---

## Implementation Constraints

> **CRITICAL**: When implementing this brief, the following rules MUST be observed:
>
> 1. Do NOT reference or look at v1 dialog implementation (`CreateVCDialog.tsx`)
> 2. Do NOT reference screenshots of the old/current platform
> 3. ONLY use the user stories defined in `v2-user-stories/create-vc-stories.md`
> 4. ONLY use existing design components: shadcn/ui primitives + the CRD dialog shell pattern
> 5. If absolutely necessary, create a new element using the shadcn design system — but prefer existing components
> 6. All field arrangements below are derived from user story priority, NOT from any v1 layout

---

## Design Brief

You are designing a multi-step creation wizard for a Virtual Contributor — an AI assistant powered by a knowledge source. The wizard uses the CRD (Consistent Responsive Dialog) pattern and leads with the most important decision (knowledge source) before identity.

The dialog has 3 steps. Steps 1 and 2 have required fields (source type + name). Step 3 is entirely optional. The user can create a VC as soon as both a source type is selected AND a name is entered.

---

## Wizard Overview

| Step | Title | Purpose | Required Fields |
|------|-------|---------|-----------------|
| 1 | Knowledge Source | Choose what powers the VC | Source type* |
| 2 | Identity | Give the VC a name and personality | Name* |
| 3 | Capabilities & Test | Configure what it can do + try it out | None |

---

## Step 1: Knowledge Source

**Purpose**: This is the most critical decision — it determines how the VC will learn and respond. It comes first because it defines the VC's fundamental nature.

**Key Elements**:

1. **Introductory prompt**
   - Bold label: "How will your VC learn?"
   - Helper text: "Choose the knowledge source that powers your Virtual Contributor"

2. **Source type selection** (three mutually exclusive cards in a vertical stack)
   - Each card has: radio indicator, bold title, muted description
   - Cards have a bordered container; the selected card gets a highlighted border and subtle background tint

   **Card A — Written Knowledge**:
   - Title: "Written Knowledge"
   - Description: "Write knowledge posts and upload documents. Best for curated, specific expertise."
   - When selected: Show a muted info line below: "You'll be able to add knowledge posts and documents after creation."

   **Card B — Space Knowledge**:
   - Title: "Space Knowledge"
   - Description: "Learn from an existing space's content. Best for contextual community assistance."
   - When selected: Show a space selector dropdown below the cards
     - Placeholder: "Choose a hosted space..."
     - Populates with the user's hosted spaces
     - Helper: "The VC will learn from this space's posts, discussions, and documents."

   **Card C — External AI Provider**:
   - Title: "External AI Provider"
   - Description: "Connect your own AI model via API. Best for custom or enterprise setups."
   - When selected: Show two fields below the cards
     - API Endpoint input (placeholder: "https://api.example.com/v1/chat")
     - API Key input (password type, placeholder: "sk-...")
     - Helper: "Your credentials are encrypted and stored securely."

3. **Progressive disclosure**: Sub-fields for the selected source type appear with a left border accent (indented context area) below the cards.

---

## Step 2: Identity

**Purpose**: Give the VC a name and optional personality/appearance. Name is required; everything else adds polish.

**Key Elements**:

1. **Name** (required)
   - Single-line text input, first and most prominent field
   - Placeholder: "e.g. Research Assistant"
   - Red asterisk indicator
   - Helper text: "Give your VC a memorable name"

2. **Tagline** (optional)
   - Single-line text input
   - Placeholder: "Helps teams find relevant research papers"
   - Helper text: "A short description shown on VC cards"

3. **Description** (optional)
   - Rich text editor (MarkdownEditor component)
   - Placeholder: "Describe what this VC can help with..."
   - Helper text: "Detailed explanation of expertise and purpose"

4. **Avatar and Tags** (two-column grid on tablet+, stacked on mobile)
   - **Avatar upload**: Dashed border drop zone with upload button and circular preview
     - Helper text: "The face of your Virtual Contributor"
   - **Tags**: Tag input with enter-to-add, badges above input
     - Placeholder: "Type a tag and press Enter"
     - Helper text: "Help people find your VC"

---

## Step 3: Capabilities & Test (Optional)

**Purpose**: Fine-tune what the VC can do and build confidence by testing it. Entirely skippable — defaults are sensible.

**Key Elements**:

1. **Capabilities** (checkbox list, all enabled by default)
   - "Answer questions from community members" (checked)
   - "Create posts and contributions" (checked)
   - "Summarize discussions and content" (checked)
   - Label: "Control what your Virtual Contributor can do"

2. **Test Your VC** (visually separated section)
   - Label: "Test Your VC"
   - Helper text: "Ask a sample question to see how your VC responds"
   - Single-line input + "Ask" button side by side
   - Response preview area below (muted background container) — appears after asking
   - Loading state: "Ask" button shows "Testing..." while processing

3. **References** (visually separated section)
   - Label: "References"
   - Helper text: "Add links to documentation or resources related to this VC"
   - Enter-to-add URL input
   - Added references shown as removable badges

---

## Footer (Persistent Across All Steps)

Same pattern as all creation wizards. Pinned at dialog bottom.

**Left Zone**:
- **Progress dots**: 3 dots, clickable to jump to any step
- **Skip link**: Only shown on Step 3 (the only fully optional step). Text: "Skip this step"

**Right Zone**:
- **Cancel**: Ghost button, closes dialog
- **Create VC**: Secondary-styled, enabled once Name is filled AND source type is selected. Always visible from Step 2 onward.
- **Next →**: Primary button, advances step. Hidden on Step 3 (where "Create VC" becomes primary).

**Note**: On Step 1, "Create VC" may be hidden or disabled since the user hasn't reached the Name field yet. It becomes visible and enabled once both conditions are met (source selected + name entered after visiting Step 2).

---

## Visual Requirements

- CRD dialog shell: responsive widths, max-height 90vh, scrollable body
- Header with section-title and muted description, border-separated
- Body scrollable; footer pinned with top border
- Source type cards: bordered containers with radio indicator, bold title, muted description. Selected state: primary border color + subtle tint
- Progressive disclosure sub-fields: left border accent (thin primary-colored bar) with padding
- All labels bold/emphasis styled
- All helpers small/caption muted
- Checkbox list with comfortable spacing between items
- Test response area: muted/subtle background, rounded container
- Mobile (<640px): full-screen dialog, single column, cards stack vertically
- Tablet/Desktop: standard dialog, Avatar+Tags side-by-side on Step 2

---

## Interaction Rules

1. Dialog opens → Step 1 focused, "Create VC" not yet available (Name not entered)
2. User selects source type → sub-fields appear for that source
3. "Next →" advances to Step 2
4. User enters Name → "Create VC" becomes enabled (persists across steps)
5. User can click "Create VC" on Step 2 → creates immediately
6. OR "Next →" → Step 3 (optional capabilities/test)
7. User configures capabilities, tests VC → clicks "Create VC"
8. After creation → dialog closes, VC appears in account list (toast confirmation)
9. "Cancel" → closes dialog, no data saved
10. For "Written Knowledge" source: actual posts/documents are added after creation via VC settings

---

## Data Model Alignment

| Field | Source (existing page) | Default Value |
|-------|----------------------|---------------|
| Source Type | VCProfilePage → bodyOfKnowledge.type | — (required) |
| Selected Space | VCProfilePage → bodyOfKnowledge.source | none |
| API Endpoint | VCProfilePage → aiEngine | empty |
| API Key | VCProfilePage → aiEngine | empty |
| Name | VCProfilePage → name | — (required) |
| Tagline | VCProfilePage → description (short) | empty |
| Description | VCProfilePage → description | empty |
| Avatar | VCProfilePage → avatarUrl | none |
| Tags | VCProfilePage → tags | [] |
| Capabilities | VCProfilePage → functionality.capabilities | all enabled |
| References | VCProfilePage → references | [] |

**No new fields are invented. Every field maps to the existing VC data model.**

---

## User Stories Covered

| Story ID | Description | Step |
|----------|-------------|------|
| VC-01 | Set name | Step 2 (required) |
| VC-02 | Write tagline | Step 2 |
| VC-03 | Write description | Step 2 |
| VC-04 | Upload avatar | Step 2 |
| VC-05 | Choose knowledge source | Step 1 (required) |
| VC-06 | Write knowledge posts | Step 1 (info — added after) |
| VC-07 | Select space as source | Step 1 (dropdown) |
| VC-08 | Connect external AI | Step 1 (API fields) |
| VC-11 | Add tags | Step 2 |
| VC-12 | Add references | Step 3 |
| VC-13 | Configure capabilities | Step 3 |
| VC-16 | Test/preview VC | Step 3 |
| VC-17 | Progress indicator | Footer (dots) |
| VC-18 | Skip to creation | Footer ("Create VC" always visible) |
| VC-19 | Navigate back | Footer (clickable dots) |
| VC-20 | Required vs optional clarity | All (asterisks + helpers) |

---

## Components Required

All from existing shadcn/ui library + one existing custom component:

- Dialog (shell, header, footer, content)
- Button (ghost, secondary, primary, outline variants)
- Input (text fields, password field)
- Label (field labels)
- Select (space dropdown)
- RadioGroup + RadioGroupItem (source type cards)
- Checkbox (capabilities)
- Badge (tags, references)
- Avatar (image preview)
- Separator (visual dividers)
- MarkdownEditor (existing custom component)

**No new components need to be created.**

---

## Accessibility

- Source type cards: RadioGroup semantics — arrow keys to navigate
- Required fields: visible asterisk + `aria-required`
- Test response area: `aria-live="polite"` for screen reader updates
- Progressive disclosure sections: not hidden from accessibility tree, just visually collapsed
- Focus moves to first field of new step on navigation
- Escape closes dialog

---

## Personas

- **Space Host** (primary): Creating a VC to assist their community members
- **Knowledge Curator**: Building a VC from curated written expertise
- **Enterprise Admin**: Connecting an external AI model for organizational use

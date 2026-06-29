# 007 — Subspace Application Forms

**Branch:** `feat/subspace-application-forms`

**Created:** June 29, 2026

**Status:** Draft

**Input:** Enable space admins to create custom application forms that members fill in when requesting subspace creation. On approval, the subspace is auto-created with form data pre-filled.

---

## Design Philosophy

Subspace creation should be a collaborative proposal workflow, not a bureaucratic gate. By allowing space admins to define what information they need upfront, we eliminate friction from the approval loop: the applicant provides context once, the admin reviews it once, and the subspace is ready to go.

**Key Principles**

1. **Progressive Disclosure** — Show one question at a time, with clear progress indication. Members should never feel overwhelmed by the form size.
2. **Smart Auto-Fill** — Pre-populate the form with data already known about the applicant (name, email, organization). Reduce manual re-entry.
3. **Atomic Approval** — Approving an application automatically creates the subspace with mapped form data. No manual setup step required.
4. **Admin Control** — Space admins configure question types, labels, constraints, and mappings. The form builder is self-serve, not code-based.
5. **Graceful Fallback** — If no application form is configured, subspace creation works as before (direct, no review).

**Approach by Entity Type**

| Entity | Application Required? | Flow |
|---|---|---|
| Subspace | Configurable per space | Member applies → Admin reviews → Auto-create on approval |
| Sub-subspace | Inherit from parent | Same as subspace, but inherits form from parent subspace settings |
| Space | No | Direct creation via `CreateSpaceDialogV3` (unchanged) |
| Virtual Contributor | No | Direct creation via `CreateVCDialog` (unchanged) |

---

## User Scenarios & Testing

### P1 — Member Applies for Subspace Creation (VNG Groei Program)

A municipality innovation team wants to create a dedicated subspace on the VNG Groei platform to coordinate their scaling proposal. They fill out the custom application form with details about their innovation, contact persons, and supporting municipalities. The form saves their draft automatically. Once submitted, they see a "pending review" status and can view their submission. When the space lead approves, the subspace is created and they receive a notification with a link to the new space.

**Why this priority:** This is the primary member-facing workflow and the most time-sensitive (applicants expect quick visibility into their submission status).

**Independent Test**

1. Navigate to a space with an application form configured.
2. Trigger the "Apply to Create Subspace" CTA.
3. Fill out the 7-step form, navigating forward/backward via progress bar and dot indicators.
4. Auto-fill card should show current user's name/email in read-only format.
5. Multi-select field should require minimum 2 selections (and exclude the initiating municipality).
6. Long-text fields should show a character counter updating as you type.
7. Submit the form and verify the status page shows "Under Review".
8. Reload the page and verify your draft is still there if you exited partway.

**Acceptance Scenarios**

- **Given** I'm a member on a space with an application form, **When** I navigate to subspaces and click "Apply to Create Subspace", **Then** the application dialog opens with step 1 of 7.
- **Given** I'm on step 1, **When** I fill in the title field and click next, **Then** the form saves my answer and animates to step 2.
- **Given** I'm on step 2 with the auto-fill card, **When** the page loads, **Then** my name and email are pre-populated and read-only.
- **Given** I'm on step 3 (municipalities), **When** I select only 1 municipality, **Then** the next button is disabled with a message "Select at least 2 municipalities".
- **Given** I'm on a text question, **When** I type 250+ words, **Then** a red warning appears and the submit is disabled until I cut text back to ≤250.
- **Given** I'm midway through the form and close the dialog, **When** I return and click "Apply to Create Subspace" again, **Then** I'm back at step 3 with my draft data intact.
- **Given** I've submitted the form, **When** I view the application detail, **Then** I see "Submitted" status, submitted timestamp, and a read-only summary of all answers.

---

### P2 — Admin Reviews and Approves Applications

A space lead logs into the space settings, navigates to Community → Applications, and sees a queue of pending applications. They click on one to view the full submission. The summary shows all applicant answers and a draft subspace name derived from the "title" answer. The admin clicks "Approve" and optionally types a message (e.g., "Great proposal! Subspace created. Here's what to do next…"). Upon confirmation, the subspace is automatically created with all applicable form answers mapped to subspace profile fields. An "Approved" badge appears on the application record.

**Why this priority:** Approval is the gateway action; without it, members remain blocked and the feature has no value.

**Independent Test**

1. Log in as a space admin.
2. Navigate to space settings → Community tab.
3. View the "Applications" section showing a list of submitted applications.
4. Click on one application to open a detail panel (slide-in or full dialog).
5. Verify the detail shows: applicant name/avatar, submitted date, all form answers in read-only format, and a live preview of the subspace name/description that will be created.
6. Click "Approve" and optionally type a message in the text field.
7. Click "Confirm" and verify: (a) the subspace is created in the space, (b) the application status changes to "Approved", (c) the applicant receives a notification.
8. Navigate to the new subspace and verify the title, description, and tags are pre-filled from the form data.

**Acceptance Scenarios**

- **Given** I'm an admin viewing applications, **When** the list loads, **Then** I see all submitted and under-review applications sorted by submission date (newest first).
- **Given** I click on an application, **When** the detail panel opens, **Then** I see the applicant avatar, name, submission timestamp, and all form answers.
- **Given** I click "Approve" with an optional message, **When** I click "Confirm", **Then** a success toast appears and the subspace is created.
- **Given** the form included a "title" field and a "Who" long-text field, **When** I approve, **Then** the new subspace's name is populated from title and its description includes content from "Who".
- **Given** I reject an application with a message, **When** I click "Confirm", **Then** the application status changes to "Rejected" and the applicant is notified.
- **Given** I have two applications submitted, **When** I approve the first one, **Then** the second one still exists in the queue with a different applicant's data.

---

### P3 — Admin Configures Application Form

A space lead clicks "Edit Application Form" in the community settings. A form builder dialog opens showing a list of pre-defined question types (short text, long text, user picker, multi-select list, auto-fill profile). The admin adds a "Title" (short-text, required), "Contact Person" (auto-fill-profile, read-only), and "Why?" (long-text, required, max 250 words). They drag questions to reorder. They can preview what the member will see. They save the configuration and members immediately see the new form when they click "Apply to Create Subspace".

**Why this priority:** Without admin control, the feature has no customization and doesn't adapt to different use cases.

**Independent Test**

1. Log in as a space admin.
2. Navigate to space settings → Community tab.
3. Click "Edit Application Form" button.
4. Verify the form builder dialog opens with an empty list and a "+ Add Question" button.
5. Click "+ Add Question" and select "Short Text" from a menu.
6. Fill in label, description, and mark as required.
7. Click "+ Add Question" again and select "Auto-Fill Profile".
8. Verify the auto-fill field appears with a list of available profile fields (name, email, organization).
9. Add a "Long Text" question, set max to 250 words.
10. Drag the "Long Text" question to reorder it above "Short Text".
11. Click "Preview" and verify the form appears as a member would see it.
12. Click "Save" and navigate away, then back. Verify the form configuration persists.
13. Create a test application and verify it uses the new form.

**Acceptance Scenarios**

- **Given** I click "Edit Application Form", **When** the builder opens, **Then** I see an empty form with a "+ Add Question" button.
- **Given** I click "+ Add Question", **When** a menu appears, **Then** I see options for each question type (short-text, long-text, user-picker, multi-select-list, auto-fill-profile).
- **Given** I add a short-text question, **When** I fill in label and description, **Then** I can set it as required and configure a max length.
- **Given** I add an auto-fill-profile question, **When** I open its config, **Then** I can select which user fields to auto-populate (name, email, org).
- **Given** I add a long-text question, **When** I set max 250 words, **Then** the preview and member-facing form both enforce that limit.
- **Given** I have three questions and drag the third to position 1, **When** I drop it, **Then** the list reorders and the new order is persisted on save.
- **Given** I've saved a form with questions, **When** I click "Edit Application Form" again, **Then** all my questions are restored.
- **Given** I click "Preview", **When** the preview dialog opens, **Then** I see the form as a member would, but with a watermark saying "PREVIEW".

---

## Edge Cases

**No application form configured**
When a space has application forms disabled or no form is configured, the subspace creation CTA remains "Create Subspace" (not "Apply"). Clicking it opens the standard `CreateSubspaceDialogV3` directly, with no application layer.

**Form saved with no required questions**
The form builder does not enforce that at least one question exists. If an admin saves an empty form or only optional questions, the form still appears to members, but the "Submit" button is enabled immediately (no mandatory fields to fill). This is allowed by design — it makes sense for optional feedback forms.

**Applicant leaves mid-flow**
The application draft is automatically saved to localStorage (or backend) after every field change. If the member closes the dialog, navigates away, or experiences a connection loss, the draft persists. The next time they click "Apply to Create Subspace", they're returned to the step they were on.

**Admin deletes a question type after applications exist**
If an admin edits the form and deletes a question that already has answers in submitted applications, the application detail still shows the old answer under a "deleted question" label. This prevents data loss and lets admins review historical submissions.

**Approved application maps to a field that no longer exists**
If an admin approves an application that maps to a subspace profile field (e.g., "description"), but later the profile field schema changes or is removed, the auto-create attempt logs a warning and skips that mapping. The subspace is still created; the unmapped field is simply left empty or defaults.

**Two admins simultaneously reviewing the same application**
Optimistic locking is not implemented in the first version. If two admins approve the same application at the same time, the second approval will fail with a "This application has already been reviewed" error message. The first admin's approval takes precedence.

**Form field type is required but answer is empty in submitted application**
This should not happen if the UI validation is working (required fields have a disabled submit). If a corrupted submission somehow reaches the backend, the auto-create will fail and log an error. Admin is notified with "Cannot create subspace: Required field 'Title' is empty."

---

## Requirements

### Functional Requirements

#### FR-001: Form Builder

- **FR-001a** Admin can open the form builder via "Edit Application Form" button in space/subspace community settings.
- **FR-001b** Builder displays a list of currently configured questions, or an empty state if none exist.
- **FR-001c** Admin can add a new question by clicking "+ Add Question" and selecting a type from a dropdown menu.
- **FR-001d** Admin can edit an existing question by clicking on it, opening an inline panel to modify label, description, required flag, constraints, and mappings.
- **FR-001e** Admin can delete a question by clicking an X icon; a confirmation dialog prevents accidental deletion.
- **FR-001f** Admin can reorder questions via drag-and-drop; order persists on save.
- **FR-001g** Admin can preview the form as a member would see it by clicking a "Preview" button, which opens a read-only form dialog.
- **FR-001h** Admin can save the form configuration. On save, all members immediately see the updated form when triggering a new application.
- **FR-001i** Form builder is scoped to a single space/subspace. If a space has sub-subspaces, sub-subspaces inherit the parent form unless they override.

#### FR-002: Question Types & Constraints

- **FR-002a** `short-text`: Single-line text input. Constraints: `required`, `maxLength` (numeric). Label and description are configurable.
- **FR-002b** `long-text`: Multi-line textarea. Constraints: `required`, `maxWords` (numeric). UI shows character/word counter.
- **FR-002c** `user-picker`: Dropdown or search field that lists community members. Constraints: `required`, optional `allowManualEntry` (bool). Returns user ID and name.
- **FR-002d** `multi-select-list`: Checkbox list or dropdown allowing multiple selections. Constraints: `required`, `minSelections`, `maxSelections`, `listSource` (predefined list ID or inline list), optional `excludeField` (exclude the value of another field's answer). Returns array of selected values.
- **FR-002e** `auto-fill-profile`: Read-only fields pre-populated with current user's profile data. Constraints: configurable set of profile fields (name, email, organization). No user input allowed. Returns user data as-is.

#### FR-003: Application Flow (Member-Facing)

- **FR-003a** Member can trigger a new application by clicking "Apply to Create Subspace" CTA when viewing a space with an active application form.
- **FR-003b** Application dialog opens as a multi-step wizard with 7 steps (configurable per form, but default is: details, contacts, municipalities, who, what-for, why+how, review).
- **FR-003c** Wizard displays a progress bar (segmented horizontal strip) at the top of the dialog, showing all steps and current position.
- **FR-003d** Wizard displays dot indicators at the bottom of the dialog for navigation; member can click any dot to jump to that step.
- **FR-003e** Each step shows: step title/description, one or more form fields relevant to that step, and next/back buttons.
- **FR-003f** Form fields validate on change (not just on submit). Required fields show a red error if empty when member tries to advance. Max-word fields show a warning if exceeded.
- **FR-003g** Auto-fill-profile fields are populated immediately on form load and display as read-only cards with a light blue background.
- **FR-003h** All form answers are auto-saved to browser localStorage (or backend draft endpoint) after every field change. Member can close and return; progress is preserved.
- **FR-003i** Final step (step 7) is a read-only review page showing all answers. Member can click "Edit" to jump back to any step, or "Submit" to finalize.
- **FR-003j** After submission, dialog closes and member is shown a status page ("Application submitted - Pending review") with applicant info and a link to view the submitted application detail.

#### FR-004: Application Review & Approval (Admin-Facing)

- **FR-004a** Admin can view all applications for a space/subspace via an "Applications" panel in the community settings.
- **FR-004b** Application list shows: applicant avatar/name, submission date, status (submitted, under-review, approved, rejected), and a "View" button.
- **FR-004c** Clicking "View" opens an application detail panel (slide-in or full dialog) showing all form answers in read-only format.
- **FR-004d** Detail panel shows a preview of the subspace name and description that will be created on approval (derived from form field mappings).
- **FR-004e** Admin can click "Approve" to trigger an approval workflow. A confirmation dialog appears with optional text field for an approval message.
- **FR-004f** Admin can click "Reject" to trigger a rejection workflow. A confirmation dialog appears with a required text field for feedback to the applicant.
- **FR-004g** Clicking "Confirm" on approval: (a) subspace is auto-created, (b) application status changes to "approved", (c) applicant receives a notification with a link to the new subspace, (d) success toast is shown to admin.
- **FR-004h** Clicking "Confirm" on rejection: (a) application status changes to "rejected", (b) applicant receives a notification with rejection feedback, (c) success toast is shown to admin.
- **FR-004i** If auto-creation fails (e.g., subspace name already exists), admin is shown an error and the application remains in "submitted" status. Admin can retry or manually create the subspace.

#### FR-005: Auto-Creation & Field Mapping

- **FR-005a** When an admin approves an application, the system creates a new subspace using the form answers as initial data.
- **FR-005b** Form field mappings are defined per form field. Example: "Title" field (short-text) maps to subspace.name; "Who?" field (long-text) maps to subspace.description.
- **FR-005c** If a form field has no explicit mapping, its answer is stored but not used to populate the subspace.
- **FR-005d** Subspace profile fields that are not mapped by the form (e.g., tags, visibility) default to space-level defaults or are left empty.
- **FR-005e** After auto-creation, the new subspace is fully editable by the admin and applicant. No fields are locked or read-only.

#### FR-006: Entry Points & CTAs

- **FR-006a** If a space has an active application form configured, the subspace list shows "Apply to Create Subspace" CTA instead of "Create Subspace".
- **FR-006b** If a space has no application form or applications are disabled, subspace list shows "Create Subspace" CTA (legacy flow).
- **FR-006c** Space/Subspace settings → Community tab shows "Edit Application Form" button in the Application Form section.
- **FR-006d** Space/Subspace settings → Community tab shows "Applications" section with a list of pending/approved/rejected applications (if any exist).

#### FR-007: Draft Management

- **FR-007a** Application drafts are stored locally (localStorage) with an auto-save interval of 3 seconds after field changes.
- **FR-007b** Draft includes: form answers, current step, timestamp of last save.
- **FR-007c** If a member has a draft and clicks "Apply to Create Subspace" again, they are prompted: "You have a draft in progress. Continue?" with options to resume or start over.
- **FR-007d** Drafts expire after 30 days of inactivity.
- **FR-007e** Submitting the form clears the draft.

#### FR-008: Notifications

- **FR-008a** When an application is submitted, the space admins (those with community/settings permissions) receive a notification: "New application from [Name]: [Subspace Title]".
- **FR-008b** When an application is approved, the applicant receives a notification: "[Space Name] approved your application. [Subspace Name] is ready. [Link to subspace]".
- **FR-008c** When an application is rejected, the applicant receives a notification: "[Space Name] reviewed your application. [Admin feedback message]".

### Non-Functional Requirements

#### NFR-001: Visual Design & Animation

- **NFR-001a** Application dialog follows the `CreateSpaceDialogV3` visual style: dialog sizing `sm:max-w-2xl md:max-w-3xl lg:max-w-4xl`, padding `px-6 py-5`, spacing gaps of 5-6.
- **NFR-001b** Progress bar strip is `h-1.5` segmented with `rounded-full`, current step `bg-primary`, completed `bg-primary/40`, future `bg-muted`.
- **NFR-001c** Step transitions animate with `slide-in-from-right-4 fade-in` (forward) or `slide-in-from-left-4 fade-in` (backward).
- **NFR-001d** Step title bar: `px-6 py-3 bg-muted/30 border-b`, displaying step icon (Lucide), label, description, and step count.
- **NFR-001e** Form field cards: `rounded-xl border bg-muted/30 p-4`, spacing gap-3 inside.
- **NFR-001f** Auto-fill-profile card: `bg-primary/5 border-primary/20` (distinct styling to indicate read-only state).
- **NFR-001g** Long-text fields show a caption-sized character/word counter in the bottom-right, turning red if limit exceeded.

#### NFR-002: Form Validation

- **NFR-002a** Required fields are validated on field blur and on submit attempt. Error message appears inline below the field.
- **NFR-002b** Max-word/max-length constraints show a warning when exceeded but do not prevent typing (user must manually delete to comply).
- **NFR-002c** Min/max selections on multi-select show error if constraint is violated on submit attempt.
- **NFR-002d** User-picker fields require a valid user ID or (if manual entry is allowed) non-empty text.
- **NFR-002e** Submit button is disabled if any required field is empty or any validation is failing.

#### NFR-003: Responsiveness

- **NFR-003a** Dialog resizes to fit screen size (max-height 90vh, overflow-y auto in body).
- **NFR-003b** Progress bar adapts to small screens: if there are >10 steps, a numeric indicator (Step N of M) replaces individual step labels.
- **NFR-003c** Dot navigator hides on screens smaller than `sm` breakpoint; step count is shown in title bar instead.

#### NFR-004: Performance

- **NFR-004a** Draft auto-save is debounced; network requests fire at most once every 3 seconds.
- **NFR-004b** Application list view paginates at 20 items per page.
- **NFR-004c** Form builder re-renders efficiently on drag-reorder; uses `React.memo` for field items.

#### NFR-005: Accessibility

- **NFR-005a** All form fields have associated `<label>` elements and unique `id` attributes.
- **NFR-005b** Error messages have `role="alert"` and are announced to screen readers.
- **NFR-005c** Progress bar steps are labeled with `aria-label` (e.g., "Step 1: Initiative Details, current step").
- **NFR-005d** Dialog has `role="dialog"` and focus is managed (trapped within dialog, restored on close).

#### NFR-006: Data Integrity

- **NFR-006a** All form submissions are validated on the backend. Client-side validation is not sufficient.
- **NFR-006b** Approved applications cannot be re-edited or re-submitted.
- **NFR-006c** Application creator and space admins are the only roles who can view/edit an application.

---

## Key Entities

### ApplicationFormConfig

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Unique identifier |
| `spaceId` | UUID | Reference to the space/subspace |
| `isActive` | Boolean | Whether new applications will use this form |
| `questions` | FormField[] | Ordered list of form questions |
| `createdAt` | ISO 8601 | Timestamp |
| `updatedAt` | ISO 8601 | Timestamp |
| `createdBy` | UUID | Admin who created the form |

### FormField

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Unique identifier for this field |
| `type` | FormFieldType | One of: short-text, long-text, user-picker, multi-select-list, auto-fill-profile |
| `label` | String | Display label for the question |
| `description` | String (optional) | Helper text below label |
| `required` | Boolean | Whether the field must be filled |
| `order` | Integer | Position in the question list (0-indexed) |
| `constraints` | Object | Type-specific validation rules |
| `mapping` | Object | How to map this answer to subspace profile fields |

### FormFieldConstraints (type-specific)

```
short-text:
  { maxLength: number }

long-text:
  { maxWords: number }

user-picker:
  { allowManualEntry: boolean }

multi-select-list:
  { 
    listSource: 'predefined' | 'inline',
    listId?: string,           // if predefined
    items?: Array<{id, label}>,  // if inline
    minSelections: number,
    maxSelections: number,
    excludeField?: string      // field id to exclude from selections
  }

auto-fill-profile:
  { 
    fields: Array<'name' | 'email' | 'organization'>
  }
```

### SubspaceApplication

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Unique identifier |
| `formConfigId` | UUID | Reference to the form version used |
| `applicantId` | UUID | User who submitted |
| `spaceId` | UUID | Space/subspace where applied |
| `answers` | Object | Field ID → answer value mapping |
| `status` | ApplicationStatus | Current state |
| `submittedAt` | ISO 8601 | When submitted (null if draft) |
| `reviewedAt` | ISO 8601 (optional) | When reviewed |
| `reviewedBy` | UUID (optional) | Admin who reviewed |
| `reviewMessage` | String (optional) | Approval or rejection message |
| `createdSubspaceId` | UUID (optional) | Reference to auto-created subspace |
| `draftSavedAt` | ISO 8601 | When draft was last saved |

### ApplicationStatus (Enum)

```
'draft'       — Partially filled, not submitted
'submitted'   — Submitted, awaiting admin review
'under-review' — Admin is actively reviewing (optional state)
'approved'    — Admin approved, subspace created
'rejected'    — Admin rejected with feedback
```

---

## Curated Field Mapping Examples

### VNG Groei Program Form

| Question | Field Type | Mapping |
|---|---|---|
| "Title of your initiative" | short-text (req, max 80) | subspace.name |
| "Initiating municipality" | short-text (req) | subspace.tags (as tag) |
| "First contact person" | auto-fill-profile (name, email, org) | subspace.leads[0] |
| "Second contact person" | user-picker (opt, manual entry) | subspace.leads[1] |
| "Supporting municipalities (min 2)" | multi-select-list (req, min 2, exclude initiating) | subspace.tags (append) |
| "WHO?" | long-text (req, max 250 words) | subspace.description |
| "WHAT FOR?" | long-text (req, max 250 words) | subspace.sections.whatFor |
| "WHY?" | long-text (req, max 250 words) | subspace.sections.why |
| "HOW?" | long-text (req, max 250 words) | subspace.sections.how |

---

## UI Component Structure

### Wireframe 1: Form Builder Dialog

```
┌─ DialogHeader ────────────────────────────────────────┐
│  Edit Application Form                             [X] │
└───────────────────────────────────────────────────────┘

┌─ DialogBody (2 columns) ──────────────────────────────┐
│                                                        │
│ Left: Question List                                  │
│ ┌─────────────────────────────────┐                  │
│ │ + Add Question                  │                  │
│ ├─────────────────────────────────┤                  │
│ │ ▣ Title (short-text) ✓          │  Right: Config  │
│ │   Drag icon                     │  ┌────────────┐  │
│ ├─────────────────────────────────┤  │ Label      │  │
│ │ ▢ Contact (auto-fill) ✓         │  │ [Input]    │  │
│ │   Drag icon                     │  │            │  │
│ ├─────────────────────────────────┤  │ Required?  │  │
│ │ ▢ Why? (long-text) ✓            │  │ [Toggle]   │  │
│ │   Drag icon                     │  │            │  │
│ └─────────────────────────────────┘  │ Delete [X] │  │
│                                       └────────────┘  │
└───────────────────────────────────────────────────────┘

┌─ DialogFooter ────────────────────────────────────────┐
│  [ Preview ]  [ Cancel ]  [ Save ]                    │
└───────────────────────────────────────────────────────┘
```

### Wireframe 2: Multi-Step Application Dialog

```
┌─ DialogHeader ────────────────────────────────────────┐
│  Create [Subspace Name]                            [X] │
│  ▓▓░░░░░░░░░░░░░░░░  Progress bar                     │
└───────────────────────────────────────────────────────┘

┌─ StepTitleBar ────────────────────────────────────────┐
│  🎯 Step 1: Initiative Details                        │
│                                  Step 1 of 7          │
└───────────────────────────────────────────────────────┘

┌─ DialogBody (scroll area) ────────────────────────────┐
│                                                        │
│  ┌────────────────────────────────────────────────┐   │
│  │ 🏛️ What's the title of your initiative?        │   │
│  │ [Text input]                                   │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
│  ┌────────────────────────────────────────────────┐   │
│  │ 🏘️ Initiating municipality                      │   │
│  │ [Text input]                                   │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
└───────────────────────────────────────────────────────┘

┌─ DialogFooter ────────────────────────────────────────┐
│  ◄ Back  ● ○ ○ ○ ○ ○ ○                Next ►         │
└───────────────────────────────────────────────────────┘
```

### Wireframe 3: Application Review Panel

```
┌─ PanelHeader ─────────────────────────────────────────┐
│  Applications (3)                                   [X] │
│  Sort: Newest  Filter: All                            │
└───────────────────────────────────────────────────────┘

┌─ ApplicationList ─────────────────────────────────────┐
│                                                        │
│  ┌────────────────────────────────────────────────┐   │
│  │ [Avatar] Alice Chen                            │   │
│  │ Applied June 28 • Submitted                    │   │
│  │ "Sustainable Transport Hub Initiative"         │   │
│  │                                    [View] → │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
│  ┌────────────────────────────────────────────────┐   │
│  │ [Avatar] Bob Johnson                           │   │
│  │ Applied June 27 • Approved                     │   │
│  │ "Digital Inclusion Program"                    │   │
│  │                                    [View] → │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
│  ┌────────────────────────────────────────────────┐   │
│  │ [Avatar] Carol Lee                             │   │
│  │ Applied June 25 • Rejected                     │   │
│  │ "Community Garden Expansion"                   │   │
│  │                                    [View] → │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
└───────────────────────────────────────────────────────┘

// Detail Panel (slide-in from right when [View] clicked)
┌─ DetailPanel ─────────────────────────────────────────┐
│  Application Detail                               [X] │
├───────────────────────────────────────────────────────┤
│  [Avatar] Alice Chen                                 │
│  Submitted: June 28, 2026                            │
│                                                       │
│  Preview Subspace:                                   │
│  📦 Sustainable Transport Hub Initiative             │
│     Description: "A collaborative initiative to..." │
│                                                       │
│  Answers:                                            │
│  Title: Sustainable Transport Hub Initiative         │
│  Initiating Municipality: Amsterdam                 │
│  First Contact: Alice Chen (alice@...) ✓            │
│  Second Contact: Bob Johnson                        │
│  Supporting Municipalities: Utrecht, Rotterdam      │
│  WHO?: "Our goal is to..."                          │
│  WHAT FOR?: "This contributes to VNG's..."         │
│  WHY?: "The urgency stems from..."                  │
│  HOW?: "We propose the following steps..."         │
│                                                       │
│  Message (optional):                                 │
│  [Text area]                                         │
│  "Great proposal! Subspace created."                │
│                                                       │
│  [ Reject ]  [ Approve ]                            │
└───────────────────────────────────────────────────────┘
```

---

## Design Tokens & Visual Style

| Element | Style |
|---|---|
| **Dialog** | Sizing: `sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh]`, layout: `p-0 gap-0 flex flex-col overflow-hidden` |
| **DialogHeader** | `px-6 pt-6 pb-4 border-b` |
| **DialogTitle** | `text-section-title` |
| **DialogDescription** | `text-body text-muted-foreground` |
| **DialogBody** | `px-6 py-5 flex flex-col gap-5 overflow-y-auto` |
| **DialogFooter** | `px-6 py-4 border-t bg-muted/20` |
| **Progress Bar Strip** | `flex gap-1 items-center h-1.5`, each segment `flex-1 rounded-full`, current `bg-primary`, completed `bg-primary/40`, future `bg-muted`, transition `duration-300` |
| **Step Title Bar** | `px-6 py-3 bg-muted/30 border-b flex items-center gap-3` |
| **Step Title Text** | `text-body-emphasis` |
| **Step Description** | `text-caption text-muted-foreground` |
| **Step Count** | `text-caption text-muted-foreground ml-auto` |
| **Step Icon** | `w-6 h-6 text-primary` |
| **Form Field Card** | `rounded-xl border bg-muted/30 p-4 flex flex-col gap-3` |
| **Field Label** | `text-body-emphasis` |
| **Field Description** | `text-caption text-muted-foreground` |
| **Text Input** | `h-10 bg-background border rounded-lg px-3`, focus `ring-primary` |
| **Textarea** | `min-h-32 bg-background border rounded-lg px-3 py-2`, focus `ring-primary` |
| **Auto-Fill Card** | `bg-primary/5 border-primary/20 rounded-xl p-4 flex items-center gap-3` |
| **Auto-Fill Label** | `text-body-emphasis` |
| **Auto-Fill Value** | `text-body text-muted-foreground` |
| **Character Counter** | `text-caption` at bottom-right, red if limit exceeded |
| **Error Message** | `text-caption text-red-500 mt-1` |
| **Dot Navigator** | `flex gap-2 items-center`, each dot `w-2 h-2 rounded-full cursor-pointer transition-all`, current `bg-primary scale-125`, completed `bg-primary/50`, future `bg-muted-foreground/25` |
| **Button: Primary** | `bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90` |
| **Button: Ghost** | `text-foreground hover:bg-accent px-4 py-2 rounded-lg` |
| **Badge: Required** | `text-caption bg-red-100 text-red-700 px-2 py-1 rounded` |
| **Badge: Optional** | `text-caption bg-muted text-muted-foreground px-2 py-1 rounded` |

---

## Out of Scope

- **Nested subspace application forms** — Sub-subspaces beyond one level of inheritance are not supported in this version.
- **Application form analytics/reporting** — No dashboards or metrics on application trends (future iteration).
- **Versioning of form configurations** — Admins cannot revert to a previous form version. Historical applications refer to the form config ID, but the form definition itself is not versioned.
- **External form embed** — Forms cannot be embedded outside the platform or shared as a standalone link.
- **Email-based application submission** — Applications are only submitted via the platform UI.
- **Multi-language forms** — Form labels and descriptions are not translated; they are in the admin's language.
- **Conditional questions** — Questions do not branch based on prior answers (e.g., "Show question B only if answer to A is X").
- **File uploads in forms** — Form fields cannot accept file attachments.

---

## Implementation Checklist

- [ ] Backend schema: `ApplicationFormConfig`, `FormField`, `SubspaceApplication` entities
- [ ] Backend endpoints: CRUD for form configs, submit application, approve/reject application, auto-create subspace
- [ ] Frontend: `SubspaceApplicationDialog.tsx` component
- [ ] Frontend: `SubspaceFormBuilderDialog.tsx` component
- [ ] Frontend: `SubspaceApplicationsPanel.tsx` component
- [ ] Frontend: Wire "Edit Application Form" in `SubspaceSettingsCommunity.tsx`
- [ ] Frontend: Wire "Apply to Create Subspace" CTA in `SpaceSubspacesList.tsx`
- [ ] Frontend: Add membership mode option in `SubspaceSettingsSettings.tsx`
- [ ] Notifications: Admin notification on new application, applicant notification on approval/rejection
- [ ] Tests: Happy path application submission and approval
- [ ] Tests: Validation (required fields, max-word limits, multi-select min/max)
- [ ] Tests: Draft auto-save and recovery
- [ ] Tests: Form builder question add/edit/delete/reorder
- [ ] Accessibility: ARIA labels, screen reader announcements
- [ ] Performance: Debounced auto-save, pagination on application list

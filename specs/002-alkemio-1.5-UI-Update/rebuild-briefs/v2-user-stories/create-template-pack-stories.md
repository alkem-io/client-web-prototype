# Create Template Pack Dialog — User Stories

## V1 Stories (Current)

| ID | Story | Status |
|----|-------|--------|
| TP-01 | As a user, I can set a name for my template pack | ✅ v1 |
| TP-02 | As a user, I can write a rich-text description | ✅ v1 |
| TP-03 | As a user, I can add tags for discoverability | ✅ v1 |
| TP-04 | As a user, I can upload a cover image | ✅ v1 |
| TP-05 | As a user, I am navigated to the settings page after save | ✅ v1 |
| TP-06 | As a user, I can cancel creation at any time | ✅ v1 |
| TP-07 | As a user, I see loading feedback while saving | ✅ v1 |

## V2 Stories (New — from PackSettingsPage & UX analysis)

### From PackSettingsPage About tab (data model fields)
| ID | Story | Priority | Notes |
|----|-------|----------|-------|
| TP-08 | As a user, I can set the provider name for the pack | Low | Exists in PackSettingsPage |
| TP-09 | As a user, I can add reference links (documentation, resources) | Low | Exists in PackSettingsPage |
| TP-10 | As a user, I can set visibility (listed in store / private) | Medium | Exists in PackSettingsPage |
| TP-11 | As a user, I can set search visibility (public/private) | Low | Exists in PackSettingsPage |

### From PackSettingsPage Templates tab (core v2 capability)
| ID | Story | Priority | Notes |
|----|-------|----------|-------|
| TP-12 | As a user, I can browse and add existing templates to my pack | High | Multi-select from template library |
| TP-13 | As a user, I can create a new template inline during pack creation | High | Quick inline creation |
| TP-14 | As a user, I can reorder templates within my pack | Medium | Drag or up/down arrows |
| TP-15 | As a user, I can filter/search available templates when browsing | Medium | Template library is large |
| TP-16 | As a user, I can see which template types I'm adding (Space, Post, etc.) | Medium | Type badges on cards |

### UX & Navigation
| ID | Story | Priority | Notes |
|----|-------|----------|-------|
| TP-17 | As a user, I see a progress indicator showing which step I'm on | High | Multi-step UX |
| TP-18 | As a user, I can skip the template selection and add them later | High | "Create now" always available |
| TP-19 | As a user, I can navigate back to previous steps | Medium | Wizard navigation |
| TP-20 | As a user, I see a summary of selected templates before saving | Medium | Confidence check |

## V2 Step Structure (Proposed)

```
Step 1: Pack Identity (required name, rest optional)
  - Name*
  - Description
  - Tags
  - Cover image

Step 2: Add Templates (optional, skippable)
  - Browse existing templates (search + filter by type)
  - Create new template inline (opens sub-form)
  - Selected templates list with reorder
  - Summary: "X templates added"

Step 3: Publish Settings (optional, skippable)
  - Visibility: listed in store / private
  - Provider name
  - References/links
```

## Overarching User Story

> **As a template author, I want to create a well-organized template pack with templates already included so that other users can discover and apply my pack immediately — without the pack sitting empty after creation.**

## UX Completeness Check

| Question | Answer |
|----------|--------|
| Can the user accomplish the core task (create a pack) in <30 seconds? | Yes — Step 1 name only, press Create |
| Is every optional step clearly skippable? | Yes — Steps 2 and 3 entirely optional |
| Does the user know what's in the pack before saving? | Yes — template summary on Step 2 |
| Are all fields backed by existing data model? | Yes — all from PackSettingsPage |
| Is there a clear next action after creation? | Navigate to pack settings page |
| Does this replace the settings page? | No — but reduces need to visit it immediately |

## Constraints
- Only Name is mandatory (same as v1)
- Steps 2 and 3 are entirely optional
- Template browsing should reuse same card pattern as TemplateLibraryPage
- "Add Templates" is the key v2 capability
- Must not feel more intimidating than v1
- All fields exist in the data model (no new fields)

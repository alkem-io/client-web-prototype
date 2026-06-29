# Create Space Dialog — User Stories

## V1 Stories (Current)

| ID | Story | Status |
|----|-------|--------|
| CS-01 | As a user, I can set a name for my space | ✅ v1 |
| CS-02 | As a user, I can write a tagline for my space | ✅ v1 |
| CS-03 | As a user, I can write a rich-text description | ✅ v1 |
| CS-04 | As a user, I can add tags to make my space discoverable | ✅ v1 |
| CS-05 | As a user, I can upload an avatar image | ✅ v1 |
| CS-06 | As a user, I can upload a card banner image | ✅ v1 |
| CS-07 | As a user, I can select a template to pre-fill content | ✅ v1 |
| CS-08 | As a user, I can cancel creation at any time | ✅ v1 |
| CS-09 | As a user, I see loading feedback while saving | ✅ v1 |

## V2 Stories (New — from settings pages & UX analysis)

### From SpaceSettingsSettings (visibility & membership)
| ID | Story | Priority | Notes |
|----|-------|----------|-------|
| CS-10 | As a user, I can set my space's visibility (public/private) | High | Optional step — exists in Settings tab |
| CS-11 | As a user, I can set the membership mode (open/application/invite-only) | Medium | Optional — exists in Settings tab |

### From SpaceSettingsCommunity (members)
| ID | Story | Priority | Notes |
|----|-------|----------|-------|
| CS-12 | As a user, I can invite initial members by email or username | High | Optional step — exists in Community tab |
| CS-13 | As a user, I can assign a role (admin/lead/member) to invited people | Low | Part of invite — exists in Community tab |

### From SpaceSettingsAbout (content & branding)
| ID | Story | Priority | Notes |
|----|-------|----------|-------|
| CS-14 | As a user, I can add references/links relevant to the space | Low | Exists in About tab |
| CS-15 | As a user, I can write a "Why" section (purpose of the space) | Low | Exists in About tab — separate from description |
| CS-16 | As a user, I can write a "Who" section (who is this for) | Low | Exists in About tab |

### UX & Navigation
| ID | Story | Priority | Notes |
|----|-------|----------|-------|
| CS-17 | As a user, I see a progress indicator showing which step I'm on | High | Multi-step UX |
| CS-18 | As a user, I can skip optional steps and jump to creation | High | "Create now" always available |
| CS-19 | As a user, I can navigate back to previous steps to edit | Medium | Wizard navigation |
| CS-20 | As a user, I see which fields are required vs optional clearly | Medium | Reduce intimidation |
| CS-21 | As a user, I see a live preview of what my space card will look like | Low | With avatar + banner |

## V2 Step Structure (Proposed)

```
Step 1: Identity (required name only, rest optional)
  - Template selector
  - Name*
  - Tagline
  - Description

Step 2: Branding & Discovery (optional, skippable)
  - Avatar
  - Card banner
  - Tags

Step 3: Access & Members (optional, skippable)
  - Visibility (public/private)
  - Membership mode (open/application/invite-only)
  - Invite initial members (by email/username)
```

## Overarching User Story

> **As a space host, I want to quickly create a well-configured space so that when members first arrive, the space already has identity, clear access rules, and an initial community — without requiring me to navigate multiple settings pages after creation.**

## UX Completeness Check

| Question | Answer |
|----------|--------|
| Can the user accomplish the core task (create a space) in <30 seconds? | Yes — Step 1 only, press Create |
| Is every optional step clearly skippable? | Yes — skip links + "Create now" always visible |
| Does the user know what they'll get before submitting? | Preview card possible, but not blocking |
| Are all fields backed by existing data model? | Yes — all sourced from SpaceSettings tabs |
| Is there a clear next action after creation? | Navigate to new space page |
| Does this replace any settings page? | No — settings still available for all fields |

## Constraints
- Only Name is mandatory (same as v1)
- Steps 2 and 3 are entirely optional — user can skip to create
- Progress indicator at bottom, clickable steps
- "Create now" button visible at every step
- Must not feel more intimidating than v1
- All fields already exist in the data model (no new fields invented)

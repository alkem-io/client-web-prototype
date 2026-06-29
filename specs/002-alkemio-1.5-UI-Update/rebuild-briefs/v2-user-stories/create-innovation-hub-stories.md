# Create Innovation Hub Dialog — User Stories

## V1 Stories (Current)

| ID | Story | Status |
|----|-------|--------|
| IH-01 | As a user, I can set a subdomain for my hub URL | ✅ v1 |
| IH-02 | As a user, I see a live URL preview as I type the subdomain | ✅ v1 |
| IH-03 | As a user, I can set a display name for my hub | ✅ v1 |
| IH-04 | As a user, I can write a tagline | ✅ v1 |
| IH-05 | As a user, I can write a rich-text description | ✅ v1 |
| IH-06 | As a user, I can add tags for discoverability | ✅ v1 |
| IH-07 | As a user, I can upload a banner image | ✅ v1 |
| IH-08 | As a user, I am navigated to settings page after save | ✅ v1 |
| IH-09 | As a user, I can cancel creation at any time | ✅ v1 |
| IH-10 | As a user, I see loading feedback while saving | ✅ v1 |

## V2 Stories (New — from InnovationHubSettingsPage & UX analysis)

### From InnovationHubSettingsPage Spaces tab (core v2 capability)
| ID | Story | Priority | Notes |
|----|-------|----------|-------|
| IH-11 | As a user, I can select which of my hosted spaces to feature on the hub | High | Multi-select — exists in Spaces tab |
| IH-12 | As a user, I can reorder the selected spaces | High | Drag or up/down — exists in Spaces tab |
| IH-13 | As a user, I can see space visibility status (active/inactive) when selecting | Medium | Shown in Spaces tab table |
| IH-14 | As a user, I can see the host account for each space when selecting | Low | Shown in Spaces tab table |

### From InnovationHubSettingsPage About tab (data model fields)
| ID | Story | Priority | Notes |
|----|-------|----------|-------|
| IH-15 | As a user, I can upload a logo for the hub (separate from banner) | Medium | Exists as avatar in About tab |

### UX & Navigation
| ID | Story | Priority | Notes |
|----|-------|----------|-------|
| IH-16 | As a user, I see a progress indicator showing which step I'm on | High | Multi-step UX |
| IH-17 | As a user, I can skip the space selection and add them later | High | "Create now" always available |
| IH-18 | As a user, I can navigate back to previous steps | Medium | Wizard navigation |
| IH-19 | As a user, I see a summary of selected spaces before saving | Medium | Confidence check |

## V2 Step Structure (Proposed)

```
Step 1: Hub Identity (required subdomain + name, rest optional)
  - Subdomain* (with live URL preview)
  - Name*
  - Tagline
  - Description

Step 2: Branding (optional, skippable)
  - Banner image
  - Logo/Avatar
  - Tags

Step 3: Curate Spaces (optional, skippable)
  - Multi-select from hosted spaces (with status + host info)
  - Reorder selected spaces (drag or arrows)
  - Summary: "X spaces selected"
```

## Overarching User Story

> **As an account holder, I want to create a branded Innovation Hub with my spaces already curated and ordered so that visitors immediately see a polished landing page — without me having to configure spaces separately after creation.**

## UX Completeness Check

| Question | Answer |
|----------|--------|
| Can the user accomplish the core task (create a hub) in <30 seconds? | Yes — Step 1 subdomain + name, press Create |
| Is every optional step clearly skippable? | Yes — Steps 2 and 3 entirely optional |
| Does the user know what they're publishing? | Yes — space summary on Step 3 |
| Are all fields backed by existing data model? | Yes — all from InnovationHubSettingsPage |
| Is there a clear next action after creation? | Navigate to hub settings page |
| Does this replace the settings page? | No — but reduces need to visit it immediately |

## Constraints
- Only Subdomain + Name are mandatory (same as v1)
- Steps 2 and 3 are entirely optional
- Space selection uses checkbox list with drag handles for reorder
- Must not feel more intimidating than v1
- Max 1 hub per account (capacity constraint)
- All fields exist in the data model (no new fields)
- Removed: CTA field (doesn't exist in InnovationHubSettingsPage data model)

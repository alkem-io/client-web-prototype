# Create Virtual Contributor Dialog — User Stories

## V1 Stories (Current)

| ID | Story | Status |
|----|-------|--------|
| VC-01 | As a user, I can set a name for my VC | ✅ v1 |
| VC-02 | As a user, I can write a tagline | ✅ v1 |
| VC-03 | As a user, I can write a rich-text description | ✅ v1 |
| VC-04 | As a user, I can upload an avatar | ✅ v1 |
| VC-05 | As a user, I can choose a knowledge source (written/space/external) | ✅ v1 |
| VC-06 | As a user, I can write knowledge posts inline | ✅ v1 |
| VC-07 | As a user, I can select a hosted space as knowledge source | ✅ v1 |
| VC-08 | As a user, I can connect an external AI provider with API key | ✅ v1 |
| VC-09 | As a user, I can cancel creation at any time | ✅ v1 |
| VC-10 | As a user, I see loading feedback while saving | ✅ v1 |

## V2 Stories (New — from VC profile page & UX analysis)

### From VCProfilePage (data model fields)
| ID | Story | Priority | Notes |
|----|-------|----------|-------|
| VC-11 | As a user, I can add tags to my VC for discoverability | Medium | Exists on VCProfilePage |
| VC-12 | As a user, I can add reference links (documentation, guides) | Low | Exists on VCProfilePage |
| VC-13 | As a user, I can configure VC capabilities (answer questions, create posts) | Medium | Exists on VCProfilePage under "functionality" |
| VC-14 | As a user, I can set data access permissions (about page, posts, subspaces) | Low | Exists on VCProfilePage |

### From CreateVCDialog v1 (enhancements)
| ID | Story | Priority | Notes |
|----|-------|----------|-------|
| VC-15 | As a user, I can upload documents (PDF/doc) as knowledge sources | Medium | "Add Document" button exists but non-functional in v1 |
| VC-16 | As a user, I can test/preview my VC with a sample question before saving | High | Confidence-building |

### UX & Navigation
| ID | Story | Priority | Notes |
|----|-------|----------|-------|
| VC-17 | As a user, I see a progress indicator showing which step I'm on | High | Multi-step UX |
| VC-18 | As a user, I can skip optional steps and jump to creation | High | "Create now" always available |
| VC-19 | As a user, I can navigate back to previous steps to edit | Medium | Wizard navigation |
| VC-20 | As a user, I see which fields are required vs optional | Medium | Reduce intimidation |

## V2 Step Structure (Proposed)

```
Step 1: Knowledge Source (required)
  - Choose source type (written/space/external)
  - Configure source (posts + documents, space selector, or API key)

Step 2: Identity (required name, rest optional)
  - Name*
  - Tagline
  - Description
  - Avatar
  - Tags

Step 3: Capabilities & Test (optional, skippable)
  - Capabilities toggles (answer questions, create posts)
  - Test with a sample question (live preview)
  - References/links
```

## Overarching User Story

> **As a space host, I want to create a Virtual Contributor that is configured with the right knowledge and capabilities so that it can immediately start being useful to my community members — without me having to hunt through separate settings pages after creation.**

## UX Completeness Check

| Question | Answer |
|----------|--------|
| Can the user accomplish the core task (create a VC) in <30 seconds? | Yes — Step 1 source + Step 2 name, press Create |
| Is every optional step clearly skippable? | Yes — Step 3 entirely optional |
| Does the user have confidence in what they're creating? | Yes — test/preview on Step 3 |
| Are all fields backed by existing data model? | Yes — all from VCProfilePage |
| Is there a clear next action after creation? | VC appears in account list |
| Does this replace any settings page? | No — settings still available |

## Constraints
- Name + knowledge source are mandatory (same as v1)
- Step 3 is entirely optional
- Source selection comes FIRST because it's the most important decision
- Preview/test step builds confidence without blocking creation
- Must not feel more intimidating than v1
- No invented fields — all exist in VC data model

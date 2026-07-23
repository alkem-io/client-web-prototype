# Design Report: Invite Virtual Contributor Flow

## Problem

The current production flow for inviting a Virtual Contributor (VC) into a space is **fragmented and lacks critical information visibility**:

- Admins navigate through multiple disconnected screens: Settings → Community section → library browser → thin preview → separate invitation screen
- The thin preview only shows basic tags and description—**no access to governance, capabilities, or data access details**
- By the time an admin gets to the invitation screen, they have no way to review what this VC can actually do or what data it can see
- This breaks trust in the decision to invite an AI agent into their space, especially regarding regulatory/compliance concerns

## Solution

Consolidate the entire invite experience into **one flowing, single-screen dialog** with three connected steps that keep all critical information in view:

### Step 1: Library (Search & Browse)
- Admin sees available VCs as cards with avatar, name, description, and key tags
- Can search by name or keywords
- Already-added VCs are hidden (no duplicate invites)
- Clicking a card moves directly to the preview—no extra buttons needed

### Step 2: Preview (Review Before Commit) ⭐ **The Key Improvement**
- **Full governance profile is now visible in the invite flow** for the first time
- Shows four critical cards:
  - What the VC can do (Functional Capabilities)
  - What data it can access (Data Access)
  - Which AI engine powers it (Open Model Transparency)
  - Where data is stored/processed (Physical Location)
- Admin can click "View full profile" if they need even more detail
- Only after reviewing all this can they proceed to invite

### Step 3: Invitation
- Simple welcome message field
- Send button with confirmation toast

## Why This Matters

| Before | After |
|--------|-------|
| No way to see VC details during invite | Governance details embedded in the flow |
| Admin has to decide based on minimal info | Admin reviews capabilities & compliance info before committing |
| Fragmented across multiple screens | Single cohesive experience—less cognitive load |
| Search progress lost if admin goes back | Context preserved—search and selections stick around |

## Scope

- Entry point remains in Space Settings → Community (no reorganization)
- Applied to both regular Spaces and Subspaces consistently
- Shows all four governance signals (capabilities, data access, transparency, location) by default; link to full profile available for additional details
- No changes to how already-added VCs appear in the settings list

## Result

Admins can now make **informed, confident decisions about inviting AI agents** without navigating away or losing context. Transparency and governance are front-and-center, building trust in the process.

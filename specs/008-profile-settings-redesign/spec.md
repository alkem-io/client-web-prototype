# 008 — Profile Settings Redesign

## Objective

Redesign user profile settings pages to match the Space Settings visual language:
- Folder-style tabs (rounded top, active tab lifts above border)
- SettingsSection card components with colored icons
- Collapsible sections to reduce information overload
- SaveBar for unsaved changes
- No redundant helper text
- Clean, visual, non-technical feel

## Scope

**Phase 1 (this spec):** User Profile Settings — all 7 tabs  
**Phase 2 (later):** Organization Settings (merge Authorisation into Community)  
**Phase 3 (later):** Virtual Contributor Settings

---

## Production Tabs (User Profile)

| Tab | Content | Editable |
|-----|---------|----------|
| Profile | Identity, Avatar/Banner, Bio (rich text), Location, Keywords/Skills, Social Links, References | Yes |
| Account | License info, hosted spaces, VCs, subscription | Read-only |
| Membership | Spaces I'm a member of, pending applications | Read-only |
| Organizations | Orgs I belong to, create new org | Read-only + actions |
| Notifications | Notification preferences (toggles per category) | Yes |
| Settings | Privacy, Language/Locale preferences | Yes |
| Security | Change password, Passkeys/WebAuthn | Yes (inline save per section) |

---

## Design System Mapping

### Shared Components (already built)
- `SettingsSection` — card with colored icon, collapsible, title only (no description)
- `SaveBar` — fixed bottom, primary tint bg, dot indicator, grid-aligned margins
- `UnsavedChangesGuard` — blocks navigation on unsaved changes

### Tab Navigation
- Use same **folder-style tabs** as Space Settings (`rounded-t-lg`, `border border-border border-b-0`, `bg-background` when active, full-width bottom border line)
- Icons per tab (same as production)

### Page Shell
- Same sticky header pattern: avatar + name + folder tabs
- Same 12-col grid with `lg:col-start-2 lg:col-span-10` content area
- `bg-background` page bg, `bg-card` header bg

---

## Tab Breakdown

### 1. Profile Tab

**Sections (SettingsSection cards):**

| Section | Icon | Color | Default State | Contents |
|---------|------|-------|---------------|----------|
| Identity | User | blue | Open | Display Name (full-width input), Tagline (full-width input) |
| Visuals | Camera | purple | Collapsed | Avatar upload zone (200×200), Banner upload zone (1920×400) — same creation-flow style as Space Settings |
| About | FileText | green | Collapsed | ReactQuill rich text editor (bio/description) |
| Location | MapPin | orange | Collapsed | City + Country inputs (2-col grid) |
| Skills & Keywords | Tag | amber | Collapsed | Tag input with chips (press Enter to add) |
| Social Links | Link | blue | Collapsed | LinkedIn, Twitter/X, GitHub, Website — icon + URL input per row |
| References | Bookmark | rose | Collapsed | Name + URL per row, "Add reference" button, Upload button per row |

**Behavior:**
- Identity section open by default, all others collapsed
- SaveBar tracks all form changes
- Avatar/Banner use same upload zone design as SpaceSettingsAbout

---

### 2. Account Tab

**Sections:**

| Section | Icon | Color | Contents |
|---------|------|-------|----------|
| License | CreditCard | blue | Current plan name, renewal date, badge |
| Hosted Spaces | Layers | purple | Grid of space cards the user hosts (read-only) |
| Virtual Contributors | Bot | green | List of VCs owned by user |
| Danger Zone | AlertTriangle | rose | Delete account button with confirmation dialog |

**Behavior:**
- Read-only display (no SaveBar needed)
- Card-based layout for hosted spaces (responsive grid)

---

### 3. Membership Tab

**Sections:**

| Section | Icon | Color | Contents |
|---------|------|-------|----------|
| My Spaces | Users | blue | List/cards of spaces with role badges (Member/Lead/Admin) |
| Pending Applications | Clock | amber | Table with space name, date applied, status — sortable columns |

**Behavior:**
- Read-only (actions: Leave space, Cancel application)
- Empty states with dashed border box

---

### 4. Organizations Tab

**Sections:**

| Section | Icon | Color | Contents |
|---------|------|-------|----------|
| My Organizations | Building2 | purple | Cards with org name, avatar, role, member count |
| Create Organization | Plus | green | CTA button → opens creation dialog |

**Behavior:**
- Read-only list + action buttons
- Org cards link to org settings

---

### 5. Notifications Tab

**Sections:**

| Section | Icon | Color | Contents |
|---------|------|-------|----------|
| Communication | Mail | blue | Toggle: Email notifications, In-app notifications |
| Updates | Megaphone | green | Toggles per category: Space updates, Community updates, Forum replies |
| Membership | Users | amber | Toggles: New member requests, Application status changes |
| Admin | Shield | purple | Toggles: Role changes, Platform announcements |

**Behavior:**
- SaveBar for toggle changes
- Each category has a master toggle + sub-toggles

---

### 6. Settings Tab

**Sections:**

| Section | Icon | Color | Contents |
|---------|------|-------|----------|
| Privacy | Eye | blue | Toggle: Profile visibility (public/private), Show activity publicly |
| Language | Globe | green | Dropdown: Preferred language, Timezone dropdown |

**Behavior:**
- SaveBar for changes
- Minimal — just toggles and dropdowns

---

### 7. Security Tab

**Sections:**

| Section | Icon | Color | Contents |
|---------|------|-------|----------|
| Change Password | Key | amber | Current password, New password, Confirm password — inline Save button |
| Passkeys & WebAuthn | Shield | purple | List registered keys, "Add passkey" button, delete action per key |

**Behavior:**
- Inline save per section (not global SaveBar) — security changes should be explicit
- Password fields with show/hide toggle
- Success toast on password change

---

## Implementation Plan

### File Structure
```
src/app/pages/
  UserSettingsPage.tsx          ← New unified shell (like SpaceSettingsPage)
  
src/app/components/user/
  UserSettingsProfile.tsx       ← Profile tab content
  UserSettingsAccount.tsx       ← Account tab content
  UserSettingsMembership.tsx    ← Membership tab content
  UserSettingsOrganizations.tsx ← Organizations tab content
  UserSettingsNotifications.tsx ← Notifications tab content
  UserSettingsGeneral.tsx       ← Settings tab content
  UserSettingsSecurity.tsx      ← Security tab content
```

### Approach
1. Create `UserSettingsPage.tsx` as a unified shell with folder-tabs + route param → renders correct tab component
2. Build each tab component using SettingsSection pattern
3. Replace existing routes to point to new unified page
4. Remove old separate page files once complete

### Order of Implementation
1. Shell page (tabs + routing)
2. Profile tab (most complex, has SaveBar + rich text + uploads)
3. Security tab (inline saves, password fields)
4. Notifications tab (toggles + SaveBar)
5. Settings tab (simple toggles + SaveBar)
6. Account tab (read-only cards)
7. Membership tab (read-only list)
8. Organizations tab (read-only cards)

---

## Color Assignment (semantic mapping)

Follows same heuristic as Space Settings:
- **Blue** — identity/core info, read-only display
- **Purple** — visual/media, elevated features
- **Green** — content/description, actions
- **Orange** — location/context-specific
- **Amber** — status/pending/temporal
- **Rose** — danger/sensitive/external links

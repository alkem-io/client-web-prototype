# Tasks: Universal Breadcrumb Navigation

**Input**: Design documents from `/specs/003-universal-breadcrumb/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Not included — prototype project with no test framework (explicitly opted out).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**Source root**: `Resources/1-1 ui test (data-accurate)/1-1 ui test/src/app/`

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Create new files and directory structure needed by the feature

- [x] T001 Create the `hooks/` directory at `src/app/hooks/`
- [x] T002 [P] Create empty `useBreadcrumbs.ts` hook file at `src/app/hooks/useBreadcrumbs.ts` with the `BreadcrumbSegment` interface and exported function stub returning an empty array
- [x] T003 [P] Create empty `AppBreadcrumb.tsx` component file at `src/app/components/layout/AppBreadcrumb.tsx` with the `AppBreadcrumbProps` interface and exported function stub rendering `null`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core breadcrumb infrastructure that MUST be complete before any user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Implement `BreadcrumbSegment` interface in `src/app/hooks/useBreadcrumbs.ts` with fields: `label` (string), `href` (string), `isCurrentPage` (boolean), `icon` (React.ReactNode | undefined) — per contracts/README.md
- [x] T005 Implement the route-matching core of `useBreadcrumbs()` in `src/app/hooks/useBreadcrumbs.ts`: use `useLocation()` and `useParams()` from react-router to read the current pathname, and build a static route config map that matches URL patterns to segment generators. Initially support only the Dashboard route (`/`) returning a single Home/logo segment with `isCurrentPage: true`
- [x] T006 Implement `AppBreadcrumb` component in `src/app/components/layout/AppBreadcrumb.tsx`: consume `useBreadcrumbs()`, render segments using shadcn `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, and `BreadcrumbSeparator` from `src/app/components/ui/breadcrumb.tsx`. The Home segment renders the platform logo icon (AlkemioSymbolSquare, 24×24) as a `BreadcrumbLink` to `/`. The last segment uses `BreadcrumbPage` with `aria-current="page"`. Wrap in `<nav aria-label="breadcrumb">`
- [x] T007 Integrate `AppBreadcrumb` into `Header.tsx` at `src/app/components/layout/Header.tsx`: import and render `<AppBreadcrumb />` in the left section of the header, after the platform logo. Remove the `isDashboard` conditional that hides the logo on the Dashboard page so the logo is always visible as the breadcrumb anchor
- [x] T008 Apply segment text truncation in `AppBreadcrumb.tsx`: add `max-w-[160px] truncate` (Tailwind) to segment label text spans, with a `title` attribute containing the full label for native hover tooltip (per FR-009 and research decision #8)

**Checkpoint**: Foundation ready — breadcrumb renders in the Header on all pages showing at least the Home/logo segment. User story route mappings can now be added.

---

## Phase 3: User Story 1 — Navigate Hierarchy from Any Page (Priority: P1) 🎯 MVP

**Goal**: Users on Space and Subspace pages see a breadcrumb trail showing the full path from Home, with clickable ancestor segments for quick navigation back up the hierarchy.

**Independent Test**: Navigate to any Subspace page → verify breadcrumb shows [Logo] > [Space avatar + Name] > [Subspace avatar + Name]. Click Logo → Dashboard. Click Space segment → Space Home page.

### Implementation for User Story 1

- [x] T009 [US1] Add Space route mappings to `useBreadcrumbs()` in `src/app/hooks/useBreadcrumbs.ts`: support `/space/:spaceSlug` returning [Logo] > [SpaceAvatar + SpaceName]. Look up space display name and avatar from existing mock data. Space/subspace segments must include `icon` field with a small Avatar element (20×20 using shadcn Avatar with AvatarImage/AvatarFallback)
- [x] T010 [US1] Add Space tab route mappings to `useBreadcrumbs()` in `src/app/hooks/useBreadcrumbs.ts`: routes `/space/:spaceSlug/community`, `/space/:spaceSlug/subspaces`, and `/space/:spaceSlug/knowledge-base` must resolve to the same breadcrumb as Space Home — [Logo] > [SpaceAvatar + SpaceName] — tabs do NOT add a segment (per spec clarification)
- [x] T011 [US1] Add Subspace route mapping to `useBreadcrumbs()` in `src/app/hooks/useBreadcrumbs.ts`: support `/space/:spaceSlug/subspaces/:subspaceSlug` returning [Logo] > [SpaceAvatar + SpaceName] > [SubspaceAvatar + SubspaceName]. Look up subspace display name and avatar from mock data
- [x] T012 [US1] Add Browse Spaces route mapping to `useBreadcrumbs()` in `src/app/hooks/useBreadcrumbs.ts`: support `/spaces` returning [Logo] > "Explore Spaces" (text only, no icon)
- [x] T013 [US1] Remove the in-banner breadcrumb overlay from `SpaceHeader.tsx` at `src/app/components/space/SpaceHeader.tsx`: delete the `<Breadcrumb>` component and its container div that renders "Home / [Space Name]" on top of the banner image. Keep the action buttons (Settings, Share, etc.)
- [x] T014 [US1] Remove the "← Back to [Space Name]" back-link from `SubspaceHeader.tsx` at `src/app/components/space/SubspaceHeader.tsx`: delete the `<Link>` with `ChevronLeft` icon at the top of the banner. Keep the utility icon buttons

**Checkpoint**: User Story 1 complete — breadcrumb works for the core navigation hierarchy (Dashboard, Spaces, Subspaces). No duplicate in-banner breadcrumbs.

---

## Phase 4: User Story 2 — Breadcrumb on Settings and Account Pages (Priority: P2)

**Goal**: Users navigating account settings and space settings see a breadcrumb showing the path to their current settings section, enabling quick jumps back to parent settings levels.

**Independent Test**: Navigate to Account Profile Settings → verify breadcrumb shows [Logo] > Account Settings > Profile. Click "Account Settings" → navigates to main account settings page.

### Implementation for User Story 2

- [x] T015 [P] [US2] Add Account Settings route mappings to `useBreadcrumbs()` in `src/app/hooks/useBreadcrumbs.ts`: support `/user/:userSlug/settings/account` → [Logo] > "Account Settings"; `/user/:userSlug/settings/profile` → [Logo] > "Account Settings" > "Profile"; `/user/:userSlug/settings/membership` → [Logo] > "Account Settings" > "Membership"; `/user/:userSlug/settings/organizations` → [Logo] > "Account Settings" > "Organizations"; `/user/:userSlug/settings/notifications` → [Logo] > "Account Settings" > "Notifications". All text-only segments (no icons)
- [x] T016 [P] [US2] Add Space Settings route mappings to `useBreadcrumbs()` in `src/app/hooks/useBreadcrumbs.ts`: support `/space/:spaceSlug/settings` → [Logo] > [SpaceAvatar + SpaceName] > "Settings"; `/space/:spaceSlug/settings/:tab` → [Logo] > [SpaceAvatar + SpaceName] > "Settings" > [TabName]. Tab names mapped from slug (e.g., "about" → "About", "community" → "Community", "templates" → "Templates")
- [x] T017 [P] [US2] Add User Profile route mapping to `useBreadcrumbs()` in `src/app/hooks/useBreadcrumbs.ts`: support `/user/:userSlug` → [Logo] > "Profile" (text only)

**Checkpoint**: User Story 2 complete — all settings and account pages show correct breadcrumb hierarchy.

---

## Phase 5: User Story 3 — Breadcrumb on Content Detail Pages (Priority: P3)

**Goal**: Users viewing specific content items (posts, templates, template packs) see a breadcrumb tracing the path back to the content's parent context.

**Independent Test**: Open a Template Pack page → verify breadcrumb shows [Logo] > Template Library > [Pack Name] with clickable ancestors.

### Implementation for User Story 3

- [x] T018 [P] [US3] Add Template Library route mappings to `useBreadcrumbs()` in `src/app/hooks/useBreadcrumbs.ts`: support `/templates` → [Logo] > "Template Library"; `/templates/packs/:packSlug` → [Logo] > "Template Library" > [PackName]; `/templates/:templateId` → [Logo] > "Template Library" > [TemplateName]; `/templates/packs/:packSlug/:templateId` → [Logo] > "Template Library" > [PackName] > [TemplateName]. Look up names from mock data
- [x] T018b [P] [US3] Add Post Detail route mapping to `useBreadcrumbs()` in `src/app/hooks/useBreadcrumbs.ts`: support `/space/:spaceSlug/posts/:postSlug` → [Logo] > [SpaceAvatar + SpaceName] > [PostTitle]. Look up post title from mock data. Note: "Knowledge Base" tab does NOT add a breadcrumb segment (per spec clarification)

**Checkpoint**: User Story 3 complete — all content detail pages show correct breadcrumb trails.

---

## Phase 5b: Remaining Routes

**Purpose**: Cover admin, search, and fallback routes not tied to a specific user story

- [x] T019 [P] Add Admin route mappings to `useBreadcrumbs()` in `src/app/hooks/useBreadcrumbs.ts`: support `/admin` → [Logo] > "Admin"; `/admin/:section` → [Logo] > "Admin" > [SectionName]
- [x] T020 [P] Add Search and Not Found route mappings to `useBreadcrumbs()` in `src/app/hooks/useBreadcrumbs.ts`: support `/search` → [Logo] > "Search"; wildcard/unmatched routes → [Logo] > "Page Not Found"

---

## Phase 6: User Story 4 — Responsive Breadcrumb on Small Screens (Priority: P4)

**Goal**: On viewports below 768px, the breadcrumb collapses intermediate segments behind an ellipsis dropdown while always showing the first (Home/logo) and last (current page) segments.

**Independent Test**: Resize browser to <768px on a deeply nested page (e.g., Space Settings tab) → verify intermediate segments collapse into a "..." dropdown. Click ellipsis → hidden segments appear as clickable links.

### Implementation for User Story 4

- [x] T021 [US4] Create a `useMediaQuery` hook or inline `window.matchMedia` check in `AppBreadcrumb.tsx` at `src/app/components/layout/AppBreadcrumb.tsx` to detect viewports < 768px. If `use-mobile.ts` already provides this at `src/app/components/ui/use-mobile.ts`, reuse it; otherwise add a small inline hook
- [x] T022 [US4] Implement responsive collapse logic in `AppBreadcrumb.tsx` at `src/app/components/layout/AppBreadcrumb.tsx`: when viewport < 768px AND breadcrumb has 3+ segments, render: first segment (logo) + `BreadcrumbSeparator` + `BreadcrumbEllipsis` inside a `DropdownMenu` (from `src/app/components/ui/dropdown-menu.tsx`) containing middle segments as `DropdownMenuItem` links + `BreadcrumbSeparator` + last segment (current page). When only 2 segments, show both without collapsing
- [x] T023 [US4] Adjust segment text truncation for mobile in `AppBreadcrumb.tsx`: reduce max-width from `max-w-[160px]` to `max-w-[100px]` on viewports < 768px (per research decision #8)

**Checkpoint**: User Story 4 complete — breadcrumb is fully responsive down to 320px viewports.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements affecting multiple user stories

- [x] T024 [P] Verify breadcrumb styling consistency in `AppBreadcrumb.tsx`: ensure separator uses `ChevronRight` via `BreadcrumbSeparator` default, text uses `text-muted-foreground` for non-active segments, and all colors use existing design system tokens (per FR-014)
- [x] T025 [P] Verify accessibility in `AppBreadcrumb.tsx`: confirm `<nav aria-label="breadcrumb">`, `<ol>` list structure via shadcn `BreadcrumbList`, and `aria-current="page"` on the active segment (per FR-010)
- [x] T026 Run quickstart.md validation: start dev server (`npm run dev`), navigate through all page hierarchies listed in data-model.md page hierarchy table, verify each breadcrumb trail matches the expected output. Check: Dashboard (logo only), Space Home, Subspace, Space tabs (no extra segment), Account Settings subsections, Template Library hierarchy, responsive collapse at <768px

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–6)**: All depend on Foundational phase completion
  - US1 (Phase 3): Can start immediately after Phase 2
  - US2 (Phase 4): Can start after Phase 2 — independent of US1
  - US3 (Phase 5): Can start after Phase 2 — independent of US1/US2
  - US4 (Phase 6): Depends on at least US1 being complete (needs 3+ segments to test collapse)
- **Polish (Phase 7)**: Depends on all user stories being complete

### Within Each User Story

- Route mappings in `useBreadcrumbs.ts` before removal of old breadcrumbs
- T013/T014 (remove old breadcrumbs) should follow T009–T012 (add new route mappings)

### Parallel Opportunities

- T002 and T003 (Setup stubs) can run in parallel
- T015, T016, T017 (US2 route mappings) can all run in parallel — different route patterns, same file but independent sections
- T018, T019, T020 (US3 route mappings) can all run in parallel
- T024 and T025 (Polish) can run in parallel
- US2 and US3 phases can run in parallel with each other (both only add route mappings)

---

## Parallel Example: User Story 1

```text
# Sequential (these depend on each other):
T009 → T010 → T011 → T012 → T013/T014

# T013 and T014 can run in parallel (different files):
T013: Remove in-banner breadcrumb from SpaceHeader.tsx
T014: Remove back-link from SubspaceHeader.tsx
```

## Parallel Example: User Stories 2 & 3

```text
# US2 and US3 are independent and can run in parallel:
Stream A: T015 + T016 + T017 (all [P] within US2)
Stream B: T018 + T019 + T020 (all [P] within US3)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational (T004–T008)
3. Complete Phase 3: User Story 1 (T009–T014)
4. **STOP and VALIDATE**: Breadcrumb works for Dashboard, Spaces, Subspaces. Old in-banner breadcrumbs removed.
5. Demo-ready MVP

### Incremental Delivery

1. Setup + Foundational → Breadcrumb shell in Header with Home segment
2. Add US1 → Core hierarchy navigation works → **MVP!**
3. Add US2 → Settings pages covered → Demo
4. Add US3 → Content detail pages covered → Demo
5. Add US4 → Responsive collapse → Full feature complete
6. Polish → Accessibility verified, styling finalized

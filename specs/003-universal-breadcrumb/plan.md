# Implementation Plan: Universal Breadcrumb Navigation

**Branch**: `003-universal-breadcrumb` | **Date**: 2026-03-31 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-universal-breadcrumb/spec.md`

## Summary

Add a universal breadcrumb navigation trail integrated into the top navigation bar (Header component) on every page of the Alkemio prototype. The breadcrumb extends from the platform logo, shows space/subspace avatars alongside names, and uses text-only labels for deeper levels. It replaces existing in-banner breadcrumbs on Space and Subspace pages and uses the existing shadcn `Breadcrumb` component primitives. Responsive collapse with ellipsis dropdown on narrow viewports.

## Technical Context

**Language/Version**: TypeScript / React 18.3.1  
**Primary Dependencies**: react-router 7.13, shadcn/Radix UI (breadcrumb.tsx), Tailwind CSS 4.1, Lucide icons  
**Storage**: N/A (client-side only, no persistence)  
**Testing**: Manual visual testing (no test framework in prototype)  
**Target Platform**: Web browser (SPA, Vite 6.3 dev server)  
**Project Type**: Web application (frontend-only prototype)  
**Performance Goals**: Breadcrumb renders within the same frame as page navigation (no layout shift)  
**Constraints**: Must work down to 320px viewport; no additional dependencies; must use existing design system tokens  
**Scale/Scope**: ~25 page components across 2 layout branches (MainLayout, SpaceLayout)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution contains template placeholders only — no project-specific gates have been defined. **PASS** — no violations possible.

## Project Structure

### Documentation (this feature)

```text
specs/003-universal-breadcrumb/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
Resources/1-1 ui test (data-accurate)/1-1 ui test/src/app/
├── components/
│   ├── layout/
│   │   ├── Header.tsx              # MODIFY — integrate breadcrumb trail after logo
│   │   └── AppBreadcrumb.tsx       # NEW — universal breadcrumb component
│   ├── space/
│   │   ├── SpaceHeader.tsx         # MODIFY — remove in-banner breadcrumb overlay
│   │   └── SubspaceHeader.tsx      # MODIFY — remove "← Back to" link
│   └── ui/
│       └── breadcrumb.tsx          # EXISTING — shadcn primitives (no changes)
├── hooks/
│   └── useBreadcrumbs.ts           # NEW — route-to-breadcrumb-segments hook
├── layouts/
│   ├── MainLayout.tsx              # EXISTING (no changes — Header already used)
│   └── SpaceLayout.tsx             # EXISTING (no changes — Header already used)
├── pages/                          # EXISTING — no changes needed (breadcrumb is in Header)
└── routes.tsx                      # EXISTING — no changes needed (hook uses URL pattern matching)
```

**Structure Decision**: Frontend-only web application. Both layouts (MainLayout, SpaceLayout) already render `<Header />` at the top. The breadcrumb will be added inside Header.tsx, making it automatically present on all pages that use either layout. A single `useBreadcrumbs` hook derives the trail from the current URL via pattern matching against a static config — no route handle metadata needed.

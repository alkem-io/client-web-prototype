# Quickstart: Universal Breadcrumb Navigation

**Feature**: 003-universal-breadcrumb

## What This Feature Does

Adds a breadcrumb navigation trail to the Header component on every page of the Alkemio prototype. The breadcrumb extends from the platform logo, showing the user's current location in the page hierarchy with clickable ancestor segments for quick navigation.

## Key Files

| File | Role |
|------|------|
| `src/app/components/layout/AppBreadcrumb.tsx` | NEW — Universal breadcrumb component |
| `src/app/hooks/useBreadcrumbs.ts` | NEW — Route-to-breadcrumb-segments hook |
| `src/app/components/layout/Header.tsx` | MODIFIED — Integrates AppBreadcrumb inline |
| `src/app/components/space/SpaceHeader.tsx` | MODIFIED — Remove in-banner breadcrumb |
| `src/app/components/space/SubspaceHeader.tsx` | MODIFIED — Remove "← Back to" link |

## How It Works

1. **`useBreadcrumbs()`** reads `useLocation().pathname` and `useParams()`, matches against a static route config, and returns an array of `BreadcrumbSegment` objects.
2. **`AppBreadcrumb`** renders the segments using shadcn `Breadcrumb` primitives. The first segment (logo) is always the platform logo icon. Space/subspace segments show avatar + text. Deeper levels show text only.
3. **`Header`** renders `<AppBreadcrumb />` in the left section, after the logo. The logo itself now also serves as the breadcrumb Home link.
4. On narrow viewports (<768px), intermediate segments collapse into an ellipsis dropdown using `BreadcrumbEllipsis` + `DropdownMenu`.

## Development

```bash
cd "Resources/1-1 ui test (data-accurate)/1-1 ui test"
npm run dev
```

Navigate to any page — the breadcrumb should appear in the header bar. Test by navigating the hierarchy:
- Dashboard → Space → Subspace → verify breadcrumb trail builds up
- Click ancestor segments → verify navigation works
- Resize browser to <768px → verify ellipsis collapse
- Check Space/Subspace pages → verify no duplicate in-banner breadcrumb

## Design Decisions

- **Breadcrumb is inside the Header**, not a separate bar — saves vertical space, matches old platform pattern
- **Logo always visible** — serves as Home breadcrumb anchor on all pages including Dashboard
- **Tab views don't add segments** — Community/Subspaces/Knowledge Base tabs are sub-views, breadcrumb stays at Space level
- **Avatar + text for spaces** — provides visual recognition without icon-only ambiguity
- **CSS truncation at max-w-[160px]** — prevents long space names from pushing the header layout

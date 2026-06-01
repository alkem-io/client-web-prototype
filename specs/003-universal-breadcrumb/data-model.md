# Data Model: Universal Breadcrumb Navigation

**Feature**: 003-universal-breadcrumb  
**Date**: 2026-03-31

## Entities

### BreadcrumbSegment

A single item in the breadcrumb trail.

| Field | Type | Description |
|-------|------|-------------|
| `label` | `string` | Display text for the segment (e.g., "Green Energy Space") |
| `href` | `string` | Navigation target URL (e.g., "/space/green-energy") |
| `isCurrentPage` | `boolean` | Whether this is the active/last segment (non-clickable) |
| `icon` | `ReactNode \| undefined` | Optional icon/avatar to display before the label. Used for logo (Home) and space/subspace avatars. `undefined` for text-only segments |

### BreadcrumbConfig (static route mapping)

Maps URL patterns to breadcrumb segment generators.

| Field | Type | Description |
|-------|------|-------------|
| `pattern` | `string` | URL path pattern (e.g., "/space/:spaceSlug") |
| `segments` | `(params, data) => BreadcrumbSegment[]` | Function that generates breadcrumb segments for a matched route, given URL params and mock data |

## Page Hierarchy Mapping

Each page maps to a specific breadcrumb trail. The `useBreadcrumbs()` hook resolves the current URL to one of these trails.

| Page | Route | Breadcrumb Trail |
|------|-------|-----------------|
| Dashboard | `/` | [Logo] |
| Browse Spaces | `/spaces` | [Logo] > Explore Spaces |
| Space Home | `/space/:spaceSlug` | [Logo] > [SpaceAvatar + SpaceName] |
| Space Community | `/space/:spaceSlug/community` | [Logo] > [SpaceAvatar + SpaceName] |
| Space Subspaces | `/space/:spaceSlug/subspaces` | [Logo] > [SpaceAvatar + SpaceName] |
| Space Knowledge Base | `/space/:spaceSlug/knowledge-base` | [Logo] > [SpaceAvatar + SpaceName] |
| Subspace | `/space/:spaceSlug/subspaces/:subspaceSlug` | [Logo] > [SpaceAvatar + SpaceName] > [SubspaceAvatar + SubspaceName] |
| Space Settings | `/space/:spaceSlug/settings` | [Logo] > [SpaceAvatar + SpaceName] > Settings |
| Space Settings Tab | `/space/:spaceSlug/settings/:tab` | [Logo] > [SpaceAvatar + SpaceName] > Settings > [TabName] |
| User Profile | `/user/:userSlug` | [Logo] > Profile |
| Account Settings | `/user/:userSlug/settings/account` | [Logo] > Account Settings |
| Profile Settings | `/user/:userSlug/settings/profile` | [Logo] > Account Settings > Profile |
| Membership | `/user/:userSlug/settings/membership` | [Logo] > Account Settings > Membership |
| Organizations | `/user/:userSlug/settings/organizations` | [Logo] > Account Settings > Organizations |
| Notifications | `/user/:userSlug/settings/notifications` | [Logo] > Account Settings > Notifications |
| Template Library | `/templates` | [Logo] > Template Library |
| Template Pack | `/templates/packs/:packSlug` | [Logo] > Template Library > [PackName] |
| Template Detail | `/templates/:templateId` | [Logo] > Template Library > [TemplateName] |
| Template in Pack | `/templates/packs/:packSlug/:templateId` | [Logo] > Template Library > [PackName] > [TemplateName] |
| Admin | `/admin` | [Logo] > Admin |
| Admin Section | `/admin/:section` | [Logo] > Admin > [SectionName] |
| Search | `/search` | [Logo] > Search |
| Post Detail | `/space/:spaceSlug/posts/:postSlug` | [Logo] > [SpaceAvatar + SpaceName] > [PostTitle] |
| Not Found | `*` | [Logo] > Page Not Found |

## State Transitions

Not applicable — breadcrumb segments are stateless pure derivations of the current URL. No persistent state, no transitions. The hook re-evaluates on every route change via `useLocation()`.

## Validation Rules

- **Label**: Must be non-empty string. Max display width enforced via CSS truncation (max-w-[160px]).
- **Href**: Must be a valid relative URL path. Not validated at runtime — derived from route config.
- **isCurrentPage**: Exactly one segment (the last) must have `isCurrentPage: true`.
- **Segment count**: Minimum 1 (logo only on Dashboard). Maximum depth in current sitemap: 4 (e.g., Logo > Template Library > Pack > Template).

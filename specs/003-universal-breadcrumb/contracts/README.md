# Contracts: Universal Breadcrumb Navigation

This feature is a frontend-only UI component change with no API endpoints, GraphQL schema, or backend contracts. All contracts are TypeScript component/hook interfaces.

## Component Contracts

### `AppBreadcrumb` Component

**File**: `src/app/components/layout/AppBreadcrumb.tsx`

```tsx
interface AppBreadcrumbProps {
  className?: string;
}

/**
 * Universal breadcrumb component rendered inside the Header.
 * Derives its segments from the current route via useBreadcrumbs().
 * Renders nothing beyond the logo when on the Dashboard.
 * On narrow viewports (<768px), collapses intermediate segments
 * into an ellipsis dropdown.
 */
export function AppBreadcrumb({ className }: AppBreadcrumbProps): JSX.Element;
```

### `useBreadcrumbs` Hook

**File**: `src/app/hooks/useBreadcrumbs.ts`

```tsx
interface BreadcrumbSegment {
  /** Display text for the segment */
  label: string;
  /** Navigation target URL */
  href: string;
  /** Whether this is the active/last segment (non-clickable) */
  isCurrentPage: boolean;
  /** Optional icon/avatar element to display before the label */
  icon?: React.ReactNode;
}

/**
 * Derives breadcrumb segments from the current URL.
 * Returns an array of BreadcrumbSegment objects ordered from root to current page.
 * The first segment is always the Home/logo segment.
 * The last segment always has isCurrentPage: true.
 */
export function useBreadcrumbs(): BreadcrumbSegment[];
```

### `Header` Component (modified interface)

**File**: `src/app/components/layout/Header.tsx`

No interface change — `Header` already accepts `{ className?, onMenuClick? }`. The breadcrumb is added internally, between the logo and the right-side icon row.

**Behavioral changes**:
- Logo is always visible (remove `isDashboard` conditional)
- `AppBreadcrumb` rendered inline after the logo, before the right icon row
- Logo serves as the Home breadcrumb segment (no separate Home link in breadcrumb)

### `SpaceHeader` Component (modified interface)

**File**: `src/app/components/space/SpaceHeader.tsx`

No interface change. The in-banner breadcrumb overlay is removed. Action buttons remain.

### `SubspaceHeader` Component (modified interface)

**File**: `src/app/components/space/SubspaceHeader.tsx`

No interface change. The "← Back to [Space Name]" link is removed. Utility icon buttons remain.

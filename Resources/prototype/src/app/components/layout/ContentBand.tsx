/**
 * The centred content band, for pages that sit outside `SpaceShell` and
 * `DashboardLayout`.
 *
 * Those two layouts put their content in a `grid grid-cols-12` and place it
 * with CRD's `contentColumnClass()` — one empty gutter column each side. Pages
 * rendered on their own (template library, pack profile, …) have no such
 * layout, so without this they run to whatever padding their own markup
 * happens to have, and land on a different left margin than the rest of the app.
 *
 * Production is genuinely inconsistent here — `CrdInnovationLibraryPage` uses
 * `max-w-7xl px-4`, `CrdInnovationPackProfilePage` uses `container px-4 md:px-8`
 * — which produced three different margins in the prototype (147 / 89 / 80 at
 * 1440px). This composes CRD's own helper and padding so every page lines up on
 * the same band instead.
 */
import type { ReactNode } from 'react';
import { contentColumnClass } from '@/crd/lib/contentColumn';
import { cn } from '@/crd/lib/utils';

export function ContentBand({
  children,
  fullWidth,
  className,
}: {
  children: ReactNode;
  /** Fill all 12 columns, matching the per-space "Wide layout" toggle. */
  fullWidth?: boolean;
  className?: string;
}) {
  return (
    <div className="w-full px-6 md:px-8 py-6">
      <div className="grid grid-cols-12 gap-6">
        <div className={cn('col-span-12 min-w-0', contentColumnClass(fullWidth), className)}>
          {children}
        </div>
      </div>
    </div>
  );
}

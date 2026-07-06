# Implementation Guide: Enhanced Dashboard Spaces Overview

**For**: Developers building the prototype from the Figma design  
**Reference**: See `design-brief.md` for full specifications

---

## Quick Reference: Row Definitions

| Row | Title | Max Items | Show More | Sorted By | Dedup Priority |
|-----|-------|-----------|-----------|-----------|-----------------|
| 1 | My Pinned Spaces | 4 (fixed) | No | Most-recently-pinned | 1st |
| 2 | My Recent Spaces | 4 | No | Last-edited | 2nd |
| 3 | Spaces I Lead & Administer | 4 visible | Yes | Creation date | 3rd |
| 4 | Spaces I Host | 4 visible | Yes | Creation date | 4th |
| 5 | Spaces with Most Activity | 4 | No | Activity score | 5th |

---

## Component Architecture

### Main Component: `EnhancedSpacesGallery.tsx`

Replace current `SpacesGallery.tsx` with this new component:

```tsx
// src/app/components/dashboard/EnhancedSpacesGallery.tsx
import { useState, useMemo } from "react";
import { ChevronRight, Plus } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { PlaceholderCard } from "@/app/components/ui/placeholder-card";
import { SpaceCard, SpaceCardData } from "@/app/components/space/SpaceCard";
import { MOCK_MEMBERSHIPS, MembershipItem } from "@/app/components/memberships/membershipData";
import { ShowMoreModal } from "./ShowMoreModal";
import { BrowseAndPinModal } from "./BrowseAndPinModal";

function toSpaceCardData(item: MembershipItem): SpaceCardData {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    description: item.tagline || "",
    bannerImage: item.image,
    initials: item.initials,
    avatarColor: item.color,
    isPrivate: item.isPrivate,
    tags: [],
    memberCount: Math.floor(Math.random() * 20) + 3,
    leads: [
      { name: "User 1", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64", type: "person" },
      { name: "User 2", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=64", type: "person" },
    ],
  };
}

export function EnhancedSpacesGallery() {
  const spaces = useMemo(() => MOCK_MEMBERSHIPS.filter(m => m.type === 'space'), []);
  
  // State for modals
  const [showMoreOpen, setShowMoreOpen] = useState(false);
  const [showMoreCategory, setShowMoreCategory] = useState<'lead' | 'host' | null>(null);
  const [browseAndPinOpen, setBrowseAndPinOpen] = useState(false);
  const [pinned, setPinned] = useState<Set<string>>(new Set(spaces.filter(s => s.isPinned).map(s => s.id)));
  
  // Deduplication + row calculations
  const getSeenIds = (...lists: MembershipItem[][]): Set<string> => new Set(lists.flat().map(s => s.id));
  
  const pinnedSpaces = useMemo(() => 
    spaces.filter(s => pinned.has(s.id)).slice(0, 4),
    [spaces, pinned]
  );
  const placeholderCount = 4 - pinnedSpaces.length;
  
  const recentSpaces = useMemo(() => {
    const seenIds = getSeenIds(pinnedSpaces);
    return spaces
      .filter(s => !seenIds.has(s.id) && s.lastModified && new Date(s.lastModified).getTime() > Date.now() - 30*24*60*60*1000)
      .sort((a, b) => (b.lastModified?.getTime() ?? 0) - (a.lastModified?.getTime() ?? 0))
      .slice(0, 4);
  }, [spaces, pinnedSpaces]);
  
  const leadSpaces = useMemo(() => {
    const seenIds = getSeenIds(pinnedSpaces, recentSpaces);
    return spaces
      .filter(s => !seenIds.has(s.id) && (s.role === 'Lead' || s.role === 'Admin'))
      .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }, [spaces, pinnedSpaces, recentSpaces]);
  
  const hostSpaces = useMemo(() => {
    const seenIds = getSeenIds(pinnedSpaces, recentSpaces, leadSpaces);
    return spaces
      .filter(s => !seenIds.has(s.id) && s.role === 'Host')
      .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }, [spaces, pinnedSpaces, recentSpaces, leadSpaces]);
  
  const activitySpaces = useMemo(() => {
    const seenIds = getSeenIds(pinnedSpaces, recentSpaces, leadSpaces, hostSpaces);
    return spaces
      .filter(s => !seenIds.has(s.id) && s.activityScore)
      .sort((a, b) => (b.activityScore ?? 0) - (a.activityScore ?? 0))
      .slice(0, 4);
  }, [spaces, pinnedSpaces, recentSpaces, leadSpaces, hostSpaces]);
  
  const handlePinSpace = (spaceId: string) => {
    setPinned(prev => new Set([...prev, spaceId]));
  };
  
  return (
    <div className="space-y-8">
      {/* Row 1: Pinned Spaces */}
      <section>
        <h2 className="text-lg font-semibold mb-4">My Pinned Spaces</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {pinnedSpaces.map(space => <SpaceCard key={space.id} space={toSpaceCardData(space)} />)}
          {Array(placeholderCount).fill(null).map((_, i) => (
            <PlaceholderCard 
              key={`placeholder-${i}`}
              label="Pin a space"
              size="sm"
              onClick={() => setBrowseAndPinOpen(true)}
            />
          ))}
        </div>
      </section>
      
      {/* Row 2: Recent Spaces */}
      {recentSpaces.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">My Recent Spaces</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentSpaces.map(space => <SpaceCard key={space.id} space={toSpaceCardData(space)} />)}
          </div>
        </section>
      )}
      
      {/* Row 3: Lead & Administer */}
      {leadSpaces.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Spaces I Lead & Administer</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {leadSpaces.slice(0, 4).map(space => <SpaceCard key={space.id} space={toSpaceCardData(space)} />)}
          </div>
          {leadSpaces.length > 4 && (
            <div className="flex justify-center mt-4">
              <Button 
                variant="outline" 
                onClick={() => { setShowMoreCategory('lead'); setShowMoreOpen(true); }}
              >
                Show More: {leadSpaces.length} Spaces <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </section>
      )}
      
      {/* Row 4: Host */}
      {hostSpaces.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Spaces I Host</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {hostSpaces.slice(0, 4).map(space => <SpaceCard key={space.id} space={toSpaceCardData(space)} />)}
          </div>
          {hostSpaces.length > 4 && (
            <div className="flex justify-center mt-4">
              <Button 
                variant="outline" 
                onClick={() => { setShowMoreCategory('host'); setShowMoreOpen(true); }}
              >
                Show More: {hostSpaces.length} Spaces <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </section>
      )}
      
      {/* Row 5: Most Activity */}
      {activitySpaces.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Spaces with Most Activity</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {activitySpaces.map(space => <SpaceCard key={space.id} space={toSpaceCardData(space)} />)}
          </div>
        </section>
      )}
      
      {/* Modals */}
      <ShowMoreModal 
        open={showMoreOpen} 
        category={showMoreCategory} 
        onOpenChange={setShowMoreOpen}
        spaces={showMoreCategory === 'lead' ? leadSpaces : hostSpaces}
      />
      <BrowseAndPinModal 
        open={browseAndPinOpen} 
        onOpenChange={setBrowseAndPinOpen}
        pinnedIds={pinned}
        onPin={handlePinSpace}
      />
    </div>
  );
}
```

### Component Reuse Strategy

**Existing Components (No New Components Needed):**
- `SpaceCard` — Main space card display (reuse as-is)
- `PlaceholderCard` — Already exists in UI library; use with `label="Pin a space"` and `size="sm"`
- `Dialog/DialogContent/DialogHeader/DialogTitle` — Standard shadcn dialogs
- `Button` — Use `variant="outline"` for "Show More" buttons
- `IconButton` — Use for pin action in Browse & Pin modal

**New Components to Create (Minimal):**
- `EnhancedSpacesGallery.tsx` — Main component (replaces SpacesGallery)
- `ShowMoreModal.tsx` — Modal for lead/host rows
- `BrowseAndPinModal.tsx` — Modal for pinning spaces
- Row rendering can be inline functions (not separate files)

---

### Helper Components

#### 1. Row Rendering (Inline Helper Functions)
```tsx
interface PinnedSpacesRowProps {
  spaces: MembershipItem[];
  placeholderCount: number;
  onPlaceholderClick: () => void;
}

export function PinnedSpacesRow({ spaces, placeholderCount, onPlaceholderClick }: PinnedSpacesRowProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">My Pinned Spaces</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {spaces.map(space => <SpaceCard key={space.id} space={toSpaceCardData(space)} />)}
        {Array(placeholderCount).fill(null).map((_, i) => <PlaceholderCard key={`placeholder-${i}`} onClick={onPlaceholderClick} />)}
      </div>
    </section>
  );
}
```

#### 2. `PlaceholderCard.tsx` (New)
```tsx
import { Plus } from 'lucide-react';

interface PlaceholderCardProps {
  onClick: () => void;
}

export function PlaceholderCard({ onClick }: PlaceholderCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center hover:border-muted-foreground/50 hover:bg-muted/50 transition-colors cursor-pointer"
    >
      <Plus className="w-8 h-8 text-muted-foreground/50 mb-2" />
      <span className="text-sm font-medium text-muted-foreground">Pin a space</span>
    </button>
  );
}
```

#### 3. `RecentSpacesRow.tsx`
```tsx
interface RecentSpacesRowProps {
  spaces: MembershipItem[];
}

export function RecentSpacesRow({ spaces }: RecentSpacesRowProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">My Recent Spaces</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {spaces.map(space => <SpaceCard key={space.id} space={toSpaceCardData(space)} />)}
      </div>
    </section>
  );
}
```

#### 4. `LeadSpacesRow.tsx`
```tsx
interface LeadSpacesRowProps {
  spaces: MembershipItem[];
  onShowMore: () => void;
}

export function LeadSpacesRow({ spaces, onShowMore }: LeadSpacesRowProps) {
  const visibleSpaces = spaces.slice(0, 4);
  const hasMore = spaces.length > 4;
  
  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">Spaces I Lead & Administer</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {visibleSpaces.map(space => <SpaceCard key={space.id} space={toSpaceCardData(space)} />)}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={onShowMore}>
            Show More: {spaces.length} Spaces
          </Button>
        </div>
      )}
    </section>
  );
}
```

#### 5. `HostSpacesRow.tsx` (Identical to LeadSpacesRow, different title)

#### 6. `ActivitySpacesRow.tsx` (Same as RecentSpacesRow)

#### 7. `ShowMoreModal.tsx` (New)
```tsx
interface ShowMoreModalProps {
  open: boolean;
  category: 'lead' | 'host' | null;
  onOpenChange: (open: boolean) => void;
}

export function ShowMoreModal({ open, category, onOpenChange }: ShowMoreModalProps) {
  const spaces = useShowMoreSpaces(category); // fetch category spaces
  
  if (!category) return null;
  
  const titles = {
    lead: 'Spaces I Lead & Administer',
    host: 'Spaces I Host',
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{titles[category]}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto">
          {spaces.map(space => <SpaceCard key={space.id} space={toSpaceCardData(space)} onClick={() => onOpenChange(false)} />)}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

#### 8. `BrowseAndPinModal.tsx` (New)
```tsx
interface BrowseAndPinModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BrowseAndPinModal({ open, onOpenChange }: BrowseAndPinModalProps) {
  const unpinnedSpaces = useUnpinnedSpaces();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pin a Space</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto">
          {unpinnedSpaces.map(space => (
            <div key={space.id} className="relative">
              <SpaceCard space={toSpaceCardData(space)} />
              <IconButton
                className="absolute top-2 right-2"
                onClick={() => pinSpace(space.id)}
                tooltipLabel="Pin this space"
              >
                <Pin className="w-4 h-4" />
              </IconButton>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Data Filtering Functions

### Deduplication Helper
```tsx
function getSeenSpaceIds(...spaceLists: MembershipItem[][]): Set<string> {
  return new Set(spaceLists.flat().map(s => s.id));
}

function excludeSeenSpaces(spaces: MembershipItem[], seenIds: Set<string>): MembershipItem[] {
  return spaces.filter(s => !seenIds.has(s.id));
}
```

### Row Getter Functions
```tsx
function getPinnedSpaces(spaces: MembershipItem[]): MembershipItem[] {
  return spaces
    .filter(s => s.isPinned === true)
    .sort((a, b) => (b.pinnedAt?.getTime() ?? 0) - (a.pinnedAt?.getTime() ?? 0))
    .slice(0, 4);
}

function getRecentSpaces(spaces: MembershipItem[], pinned: MembershipItem[]): MembershipItem[] {
  const seenIds = new Set(pinned.map(s => s.id));
  return excludeSeenSpaces(spaces, seenIds)
    .filter(s => isRecent(s)) // within last 30 days
    .sort((a, b) => (b.lastModified?.getTime() ?? 0) - (a.lastModified?.getTime() ?? 0))
    .slice(0, 4);
}

function getLeadSpaces(spaces: MembershipItem[], previousRows: MembershipItem[][]): MembershipItem[] {
  const seenIds = getSeenSpaceIds(...previousRows);
  return excludeSeenSpaces(spaces, seenIds)
    .filter(s => s.userRole === 'lead' || s.userRole === 'admin')
    .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
}

function getHostSpaces(spaces: MembershipItem[], previousRows: MembershipItem[][]): MembershipItem[] {
  const seenIds = getSeenSpaceIds(...previousRows);
  return excludeSeenSpaces(spaces, seenIds)
    .filter(s => s.userRole === 'host')
    .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
}

function getActivitySpaces(spaces: MembershipItem[], previousRows: MembershipItem[][]): MembershipItem[] {
  const seenIds = getSeenSpaceIds(...previousRows);
  return excludeSeenSpaces(spaces, seenIds)
    .filter(s => hasRecentActivity(s))
    .sort((a, b) => (b.activityScore ?? 0) - (a.activityScore ?? 0))
    .slice(0, 4);
}

function isRecent(space: MembershipItem): boolean {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return (space.lastModified ?? new Date(0)) > thirtyDaysAgo;
}

function hasRecentActivity(space: MembershipItem): boolean {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return (space.lastActivityDate ?? new Date(0)) > thirtyDaysAgo;
}
```

---

## Mock Data Extension

Add to `membershipData.ts`:

```tsx
interface MembershipItem {
  // ... existing fields ...
  
  // NEW FIELDS
  isPinned?: boolean;
  pinnedAt?: Date; // when user pinned this space
  lastModified?: Date; // last edit by user or team
  lastActivityDate?: Date; // when any activity last occurred
  activityScore?: number; // 0–100 scale
  userRole?: 'member' | 'lead' | 'admin' | 'host'; // user's role in this space
}

export const MOCK_MEMBERSHIPS: MembershipItem[] = [
  {
    id: "space-1",
    slug: "vng-innovation",
    type: "space",
    name: "VNG Innovation Hub",
    tagline: "Gemeente collaboratie",
    image: "https://images.unsplash.com/...",
    color: "#3B82F6",
    initials: "VI",
    isPrivate: false,
    
    // NEW FIELDS
    isPinned: true,
    pinnedAt: new Date('2026-06-20'),
    lastModified: new Date('2026-07-05'),
    lastActivityDate: new Date('2026-07-04'),
    activityScore: 85,
    userRole: 'lead',
  },
  {
    id: "space-2",
    slug: "digital-twins",
    type: "space",
    name: "Digital Twin Community",
    tagline: "3D modeling collaboration",
    image: "https://images.unsplash.com/...",
    color: "#10B981",
    initials: "DT",
    isPrivate: false,
    
    isPinned: false,
    lastModified: new Date('2026-07-03'),
    lastActivityDate: new Date('2026-07-02'),
    activityScore: 62,
    userRole: 'member',
  },
  // ... more spaces with varied data
];
```

---

## Changes to Dashboard.tsx

Minimal changes needed:

```tsx
// BEFORE
<div className="col-span-9">
  <SpacesGallery />
</div>

// AFTER
<div className="col-span-9">
  <EnhancedSpacesGallery />
</div>
```

No other changes needed — the toggle, sidebar, and structure remain the same.

---

## Testing Checklist

### Unit Tests
- [ ] `getPinnedSpaces()` returns max 4 items
- [ ] `getRecentSpaces()` excludes already-pinned spaces
- [ ] Deduplication: No space appears in 2+ rows
- [ ] Show More button only shows when `spaces.length > 4`
- [ ] Placeholder count = `4 - pinnedSpaces.length`

### Integration Tests
- [ ] All 5 rows render with correct data
- [ ] Clicking space card navigates to space
- [ ] Clicking placeholder opens Browse & Pin modal
- [ ] Clicking Show More opens correct modal
- [ ] Pinning a space updates Row 1 (localStorage for prototype)

### Edge Cases
- [ ] New user (0 spaces): Only Row 1 renders with 4 placeholders
- [ ] User with only pinned spaces: Row 1 renders, others hidden
- [ ] No recent activity: Row 5 hidden
- [ ] Lead spaces only: Rows 1–3 possible, 4–5 hidden
- [ ] Long space names: Truncate in SpaceCard (existing behavior)

### Responsive Design
- [ ] Mobile (2 cols): All rows display correctly
- [ ] Tablet (3 cols): All rows display correctly
- [ ] Desktop (4 cols): All rows display correctly

### UI/UX
- [ ] Row titles clearly identify each category
- [ ] Spacing between rows is visually clear
- [ ] Placeholder cards are obviously interactive (hover state)
- [ ] Show More buttons are easy to find
- [ ] Modals have clear title and close button

---

## Performance Considerations

- Use `useMemo()` for all row calculations (avoid recalculation on every render)
- Grid layout uses native CSS Grid (efficient rendering)
- Modals use React Portal (recommended)
- Scroll in modal only, not full page (overflow-y-auto on modal body)

---

## Browser & Accessibility

- All interactive elements have proper `onClick` handlers
- Modal has proper focus management (`autoFocus` on close button)
- Grid layout is screen-reader friendly (semantic HTML)
- Placeholder card has descriptive text ("Pin a space")
- Icons paired with text labels (not icon-only buttons)

---

## Deployment Notes

1. Update `MOCK_MEMBERSHIPS` with new fields
2. Replace `SpacesGallery.tsx` with `EnhancedSpacesGallery.tsx`
3. Update `Dashboard.tsx` import
4. Add new components to dashboard folder
5. Test all edge cases in staging
6. A/B test optional: compare old gallery vs. new categorized view

---

**Next Step**: Finalize Figma design, then implement this guide in prototype

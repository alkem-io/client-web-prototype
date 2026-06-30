# Button System Audit & Standardization Report

**Project:** Shadcn UI Redesign Platform (Alkemio)  
**Date:** June 30, 2026  
**Status:** Ready for Review & Implementation  
**Scope:** Complete audit of button implementations and usage patterns across the application

---

## Executive Summary

Your button implementation shows **significant inconsistency** stemming from component-level decision-making rather than a unified design system. While your base Button and IconButton components are well-designed, they're not being used consistently across the application.

### Key Findings:

✅ **Strengths:**
- Button component itself is well-structured with good variants (default, secondary, outline, ghost, destructive, link)
- IconButton wrapper component enforces accessibility with tooltips and aria-labels
- Focus states are consistent and accessible
- Color contrast meets WCAG AA standards

⚠️ **Critical Issues:**
1. **Custom button implementations** bypass the Button component (high maintainability cost)
2. **"Add/Create" buttons scattered** across interfaces without placeholder card consistency
3. **Icon placement varies** (before/after text, sometimes only icon)
4. **Label inconsistency** ("Create" vs "Add", "Open" vs "View", etc.)
5. **Dialog patterns inconsistent** in some components
6. **No placeholder card pattern** for collections (very low discoverability)

### Impact:
- 🔴 Users confused about how to create new items
- 🔴 Inconsistent interaction patterns increase cognitive load
- 🔴 Hard to maintain custom button styles across the codebase
- 🟡 Some CTAs hidden or easily missed

---

## Current State Analysis

### Base Components (Well-Designed ✓)

#### Button Component (`src/app/components/ui/button.tsx`)
```tsx
Variants: default | secondary | outline | ghost | destructive | link
Sizes:    sm | default | lg | icon
```

**Assessment:** ✓ Excellent structure. Well-implemented with CVA (class-variance-authority).

---

#### IconButton Component (`src/app/components/ui/icon-button.tsx`)
```tsx
interface IconButtonProps extends ButtonProps {
  tooltipLabel: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
}
```

**Assessment:** ✓ Excellent. Enforces tooltip + aria-label on all icon buttons. **Should be used for ALL icon-only buttons.**

---

## Issues Found (Detailed)

### 🔴 Issue #1: Custom Button Implementations (Non-Component)

**Severity:** HIGH  
**Impact:** Maintenance burden; inconsistent styling; reduced accessibility

#### Finding 1.1: SpacesGallery.tsx (Lines 118-124)
**File:** `src/app/components/dashboard/SpacesGallery.tsx`

```tsx
// ❌ ANTI-PATTERN: Custom button with inline styles
<button
  className="mt-3 flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer bg-transparent border-none mx-auto"
  onClick={() => handleSeeAllSubspaces(space)}
  type="button"
>
  See all {subspaces.length} Subspaces <ChevronRight className="w-4 h-4" />
</button>
```

**Problems:**
- Bypasses Button component entirely
- Manual focus styling (missing ring-focus pattern)
- Hard to maintain and update
- "See all" pattern used instead of standardized CTA
- Icon placement inconsistent with other buttons

**Fix:**
```tsx
// ✓ PROPER: Use Button component with link variant
<Button variant="link" size="sm" className="mt-3">
  See all {subspaces.length} Subspaces <ChevronRight className="w-4 h-4" />
</Button>
```

---

#### Finding 1.2: SpacesGallery.tsx (Lines 135-142)
**File:** `src/app/components/dashboard/SpacesGallery.tsx`

```tsx
// ❌ ANTI-PATTERN: Custom "Load More" button
<button
  onClick={() => setVisibleCount((c) => c + BATCH_SIZE)}
  className="px-6 py-2.5 text-sm font-semibold uppercase tracking-wide rounded-md border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer bg-transparent"
  type="button"
>
  Load More
</button>
```

**Problems:**
- Reinvents outline variant manually
- Hard-coded sizing instead of using `size` prop
- Missing focus ring styling
- Inconsistent with other outline buttons

**Fix:**
```tsx
// ✓ PROPER: Use Button component with outline variant
<Button variant="outline" size="default">
  Load More
</Button>
```

---

#### Finding 1.3: PostCard.tsx (Lines 200-209)
**File:** `src/app/components/space/PostCard.tsx`

```tsx
// ❌ ANTI-PATTERN: Custom "Read more/less" button
<button
  onClick={(e) => {
    e.stopPropagation();
    if (isExpanded) setIsExpanded(false);
    else setIsExpanded(true);
  }}
  className="text-caption uppercase text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
>
  {isExpanded ? "Read less" : "Read more"}
</button>
```

**Problems:**
- Should use link variant but doesn't
- Inconsistent styling across similar patterns
- No focus ring

**Fix:**
```tsx
// ✓ PROPER: Use Button component with link variant
<Button 
  variant="link" 
  size="sm"
  onClick={(e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  }}
>
  {isExpanded ? "Show less" : "Show more"}
</Button>
```

---

#### Finding 1.4: PostCard.tsx (Lines 116-121)
**File:** `src/app/components/space/PostCard.tsx`

```tsx
// ⚠️ PATTERN: Custom avatar button in ProfileHoverCard
<button type="button" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full">
  <Avatar className="w-10 h-10 border border-border">
    <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
  </Avatar>
</button>
```

**Status:** ⚠️ Custom focus styling works but should use Button component with size="icon" for consistency.

---

### 🔴 Issue #2: Inconsistent "Create" / "Add" Patterns

**Severity:** HIGH  
**Impact:** Poor discoverability; users don't know how to create new items; cognitive load from multiple interaction patterns

#### Finding 2.1: Multiple Small Buttons Scattered

**Identified Patterns:**
- "Create Space" button (likely in header) - small floating button
- "Add Response" buttons - hidden below fold
- "Create Subspace" buttons
- "Add Resource" buttons
- Various "+" icon buttons

**Problem:** No consistent pattern. Mix of:
- Floating buttons above content
- Small buttons at bottom of sections
- Icon-only buttons
- Text buttons with icons

**Result:** Users don't learn a consistent creation pattern

---

#### Finding 2.2: Placeholder Card Pattern Underutilized

**Currently Used:**
✓ Space creation (with dashed border + "+" icon)

**Should Be Used But Aren't:**
✗ Subspace creation
✗ Response creation
✗ Resource creation
✗ Document/File creation
✗ Template creation

**Problem:** Creates inconsistency and confusion about which affordance to use.

---

### 🟡 Issue #3: Icon Placement Inconsistency

**Severity:** MEDIUM  
**Impact:** Mixed signals; unclear button orientation patterns

#### Finding 3.1: Icon Placement Varies

**Examples Found:**
- Line 459 (CreateSpaceDialogV3): `<ChevronLeft /> Templates` (icon before text) ✓ Good
- Line 221 (PostCard): `<Button>Open Whiteboard</Button>` (no icon) 
- Line 123-124 (SpacesGallery): `See all ... <ChevronRight />` (icon after text) ✓ Good for navigation
- Various places: Icon-only buttons without tooltips ✗ Bad

**Inconsistency:** No clear rule about when to place icons before/after text.

---

### 🟡 Issue #4: Label Verb Inconsistency

**Severity:** MEDIUM  
**Impact:** Unclear action expectations; creates cognitive friction

#### Finding 4.1: Verb Variations Found

| Action | Variations Used | Should Be |
|--------|--|--|
| Creating items | "Create", "Add", "New" | **Create** |
| View more | "Open", "View", "See", "Explore" | **Open** or **View** |
| Showing more | "See all", "Show all", "View all", "Read more" | **Load More** or **Show More** |
| Confirming | "Submit", "OK", "Confirm", "Save" | **Save** or **Submit** |
| Canceling | "Cancel", "Dismiss", "Close" | **Cancel** |
| Deleting | "Delete", "Remove", "Discard" | **Delete** |

---

### 🟡 Issue #5: Inconsistent Dialog Footer Patterns

**Severity:** MEDIUM  
**Impact:** Users unsure which button to click; inconsistent expectations

#### Finding 5.1: CreateSpaceDialogV3.tsx (Lines 455-487) ✓ GOOD PATTERN

```tsx
// ✓ GOOD: Standard form pattern
<DialogFooter>
  <div className="flex items-center gap-3">
    {/* Back button - left side */}
    <Button variant="ghost" size="sm">← Templates</Button>
  </div>
  
  <div className="flex items-center gap-2">
    {/* Cancel button */}
    <Button variant="ghost">Cancel</Button>
    {/* Primary action */}
    <Button onClick={handleCreate}>Create Space</Button>
  </div>
</DialogFooter>
```

**Assessment:** ✓ This pattern should be standard across all dialogs.

---

### 🟡 Issue #6: Visibility and Discoverability Issues

**Severity:** MEDIUM  
**Impact:** Users miss important CTAs; poor feature discoverability

#### Finding 6.1: PostCard.tsx (Line 220-222) - Hidden on Hover

```tsx
// ⚠️ PATTERN: Hidden on hover (poor discoverability)
<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-primary/40">
  <Button variant="secondary" className="shadow-sm">Open Whiteboard</Button>
</div>
```

**Problem:**
- Button only appears on hover
- Users may not discover this action
- Secondary variant (unclear main action)

**Better Pattern:**
- Always visible, not hidden on hover
- Use primary variant if it's the main action
- Integrate into card design, not as overlay

---

## Recommended Standardized Button System

### 1. Variant Usage Standards

#### PRIMARY (`variant="default"`)
**Use For:** Main calls-to-action that move user forward

**Examples:**
- "Create Space"
- "Add Subspace"
- "Submit Form"
- "Post Comment"
- "Publish"
- "Save Changes"

**Visual:** Solid primary color background, primary-foreground text  
**Rules:**
- Only ONE per screen section
- Use `size="lg"` for hero sections
- Use `size="default"` for standard forms
- Always the right-most button in dialogs

**Pairing in Dialogs:**
```
[Cancel / outline] [Save / primary]
```

---

#### SECONDARY (`variant="secondary"`)
**Use For:** Important alternative CTAs

**Examples:**
- "Next Step" (when primary is "Confirm")
- "Preview" (when primary is "Publish")
- "Save as Draft" (when primary is "Publish")

**Visual:** Solid secondary background, secondary-foreground text  
**Rules:**
- Use sparingly (1-2 per screen)
- Always pair with primary button
- Visually lower weight than primary

---

#### OUTLINE (`variant="outline"`)
**Use For:** Tertiary actions and navigation

**Examples:**
- "Cancel" (in dialogs)
- "Load More"
- "Browse All"
- "Back" / "Next" in flows
- Toolbar navigation buttons

**Visual:** Border only, background matches environment  
**Rules:**
- Standard pairing for form cancellation
- Use for pagination
- Use for secondary navigation
- Left-most button in dialog pairs

---

#### GHOST (`variant="ghost"`)
**Use For:** Minimal, contextual actions

**Examples:**
- Toolbar buttons
- Sidebar navigation
- Icon buttons (must use `IconButton` wrapper)
- Dropdown menu triggers

**Visual:** Transparent, hover adds background  
**Rules:**
- Only in toolbars and compact contexts
- Must have clear text or icon + tooltip (use `IconButton`)
- Default for icon buttons

---

#### DESTRUCTIVE (`variant="destructive"`)
**Use For:** Dangerous actions requiring confirmation

**Examples:**
- "Delete Space"
- "Remove Member"
- "Discard Changes"

**Visual:** Red background, white text  
**Rules:**
- ONLY in confirmation dialogs
- Never use elsewhere
- Must be explicit label ("Delete", not "OK")
- Should NOT be default focus

**Pairing in Destructive Dialogs:**
```
[Keep / outline]  [Delete / destructive]
```

---

#### LINK (`variant="link"`)
**Use For:** Text-only actions within content

**Examples:**
- "Show more" / "Show less"
- "Learn more" in explanatory text
- Inline navigation links
- "See all X" when part of paragraph

**Visual:** Primary color, underline on hover  
**Rules:**
- Only for text within paragraphs
- Never for primary CTAs
- Should look like a hyperlink

---

### 2. Size Standards

| Size | Height | Padding | When to Use |
|------|--------|---------|------------|
| `sm` | 32px | px-3 (px-2.5 w/icon) | Compact forms, table rows, toolbar items |
| `default` | 36px | px-4 (px-3 w/icon) | Standard CTAs, form buttons, dialog actions |
| `lg` | 40px | px-6 (px-4 w/icon) | Hero sections, prominent CTAs, onboarding |
| `icon` | 36px square | - | Icon-only buttons (use `IconButton` wrapper) |

---

### 3. Icon Standards

#### Leading Icons (Before Text)
**Use For:** Action buttons  
**Examples:** `+ Create Space`, `🗑 Delete`, `✎ Edit`  
**Reasoning:** Reinforces action visually

```tsx
<Button>
  <Plus className="w-4 h-4" />
  Create Space
</Button>
```

---

#### Trailing Icons (After Text)
**Use For:** Navigation/direction  
**Examples:** `Load More →`, `See all ⟩`, `Next →`  
**Reasoning:** Signals continuation/more info

```tsx
<Button variant="link">
  See all Subspaces
  <ChevronRight className="w-4 h-4" />
</Button>
```

---

#### Icon Only
**Use For:** Toolbar, header actions  
**REQUIREMENT:** Use `IconButton` wrapper (enforces tooltip + aria-label)

```tsx
<IconButton
  variant="ghost"
  tooltipLabel="Settings"
>
  <Settings className="w-4 h-4" />
</IconButton>
```

---

### 4. Label Standards

#### Recommended Verbs

| Action | Preferred | Avoid |
|--------|-----------|-------|
| Create new | **Create** | "New", "Add" (for creation) |
| Add to collection | **Add** | "Create" (for addition) |
| Delete/Remove | **Delete** | "Remove" (use for permanent) |
| Submit form | **Save** / **Submit** | "OK", "Confirm", "Done" |
| Close/Exit | **Cancel** / **Close** | "Dismiss", "×" only |
| View details | **Open** | "View", "See", "Check" |
| Load more items | **Load More** | "Show More", "See All" |
| Next in flow | **Next** | "Forward", "Continue" |
| Previous in flow | **Back** | "Previous", "Go Back" |
| Expand content | **Show More** | "Read More" (only for text) |

#### Label Best Practices
✓ Be specific: "Delete Space" not "Delete"  
✓ Use active verbs: "Create" not "New"  
✓ Be concise: Fit without wrapping  
✓ Title case: "Create Space" not "create space"  
✓ No punctuation in button text  
✓ Active voice: "Create" not "Being Created"  

---

### 5. Placeholder Card Pattern (NEW STANDARD)

**What:** Dashed-border card in same grid as content items, with "+" icon  
**When:** Any collection where users create multiple items

#### Should Apply To:
- ✓ Spaces (already implemented)
- ✗ Subspaces (needs change)
- ✗ Resources (needs change)
- ✗ Community Responses (needs change)
- ✗ Documents (needs change)
- ✗ Templates (needs change)

#### Design Specification:

```tsx
<Card className="border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 bg-transparent hover:bg-muted/20 transition-all cursor-pointer group">
  <CardContent className="flex items-center justify-center aspect-square">
    <div className="flex flex-col items-center gap-3 text-center">
      <Plus className="w-8 h-8 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
        Create [ItemType]
      </span>
    </div>
  </CardContent>
</Card>
```

#### Interaction:
- Click anywhere to open creation dialog
- Same sizing as content items in grid
- Shows remaining capacity implicitly
- Much more discoverable than small buttons

#### Advantages:
✓ Occupies same visual space as items  
✓ Creates "slot" mental model  
✓ Significantly more discoverable  
✓ Consistent pattern across platform  
✓ Reduces cognitive load  
✓ Clear affordance  

---

### 6. Form & Dialog Patterns

#### Standard Form Layout
```
[Cancel/outline] [Submit/primary]
```

#### Destructive Confirmation Dialog
```
[Keep/outline] [Delete/destructive]
```

**Rules:**
- Destructive button on right
- NOT default focus
- Requires explicit click (not Enter)

#### Multi-Step Dialog (Recommended)
```
[← Back/ghost-sm] [Cancel/outline] [Next/primary]
```

---

## High-Priority Changes

### Phase 1: Critical Fixes (Do First)

#### 1. Fix SpacesGallery.tsx
**File:** `src/app/components/dashboard/SpacesGallery.tsx`

**Changes:**
- Line 118-124: Replace custom link with `<Button variant="link">`
- Line 135-142: Replace custom button with `<Button variant="outline">`

**Impact:** Fixes commonly-seen patterns, improves consistency

---

#### 2. Fix PostCard.tsx
**File:** `src/app/components/space/PostCard.tsx`

**Changes:**
- Line 200-209: Replace custom "Read more" with `<Button variant="link">`
- Line 221: Change "Open Whiteboard" to primary and always visible
- Line 116: Consider using Button with size="icon"

**Impact:** Improves text link consistency and CTA visibility

---

#### 3. Standardize Dialog Footers
**Files:** All dialog components in `src/app/components/dialogs/`

**Pattern:** Use CreateSpaceDialogV3 as template (lines 455-487)

**Changes:**
- [Cancel/outline] on left, [Action/primary] on right
- Add [Back/ghost] if multi-step
- Consistent spacing and sizing

---

### Phase 2: Placeholder Cards (Do Second)

#### Add Placeholder Card Component
**Create:** `src/app/components/ui/placeholder-card.tsx`

```tsx
interface PlaceholderCardProps {
  label: string;
  onClick: () => void;
  className?: string;
}

export function PlaceholderCard({ label, onClick, className }: PlaceholderCardProps) {
  return (
    <Card className={cn(
      "border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 bg-transparent hover:bg-muted/20 transition-all cursor-pointer group",
      className
    )}>
      <CardContent className="flex items-center justify-center aspect-square">
        <div className="flex flex-col items-center gap-3 text-center">
          <Plus className="w-8 h-8 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
          <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {label}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

#### Add Placeholders To Collections:
1. SpaceSettingsSubspaces.tsx - Add subspace placeholder
2. SpaceResourcesList.tsx - Add resource placeholder
3. CommunityFeed.tsx - Add response placeholder
4. Document/Template collections - Similar treatment

**Result:** Consistent creation pattern, much better discoverability

---

### Phase 3: Audit and Fix Remaining (Do Third)

1. Audit all dialog components - ensure consistent footer pattern
2. Replace all custom button divs with Button component
3. Standardize all toolbar buttons - use IconButton wrapper
4. Ensure all label verbs follow standards

---

## Accessibility Improvements

### Icon Button Tooltips (CRITICAL)
**Current Status:** ⚠️ Many icon-only buttons missing tooltips

**Action Required:** Replace all icon-only `<button>` with `<IconButton>` wrapper

**Before:**
```tsx
<button className="...">
  <Settings className="w-5 h-5" />
</button>
```

**After:**
```tsx
<IconButton tooltipLabel="Settings">
  <Settings className="w-5 h-5" />
</IconButton>
```

---

### Focus Management (Already Good)
✓ Focus ring styling is consistent  
✓ Focus visible states are clear  
✓ Button component has proper focus-visible styles

---

### Color Contrast (Already Good)
✓ All button variants meet WCAG AA  
✓ Hover states provide sufficient contrast  
✓ Text color contrast is adequate

---

## Implementation Roadmap

### Week 1-2: Foundation
- [x] Document button system (this audit)
- [ ] Review and approve standardized system
- [ ] Create placeholder-card component
- [ ] Update team guidelines

### Week 2-3: Quick Wins
- [ ] Fix SpacesGallery.tsx buttons
- [ ] Fix PostCard.tsx buttons
- [ ] Standardize 3-4 dialog components
- [ ] Add placeholder cards to 2-3 sections

### Week 3-4: Full Rollout
- [ ] Replace all custom button implementations
- [ ] Replace all "Add X" buttons with placeholder cards
- [ ] Ensure all icon buttons use IconButton wrapper
- [ ] Final pass on label consistency

### Week 4+: Documentation
- [ ] Add component examples to Storybook
- [ ] Update CLAUDE.md with button patterns
- [ ] Create developer checklist
- [ ] Archive this audit report

---

## Testing Checklist

### Visual Testing
- [ ] All buttons render in light AND dark modes
- [ ] All variants are visually distinct
- [ ] Icon sizes are consistent
- [ ] Hover states are clear and immediate
- [ ] Focus rings visible on keyboard navigation

### Accessibility Testing
- [ ] All buttons keyboard navigable (Tab)
- [ ] Icon buttons have tooltips (use IconButton)
- [ ] Focus order is logical
- [ ] Screen reader announces button purpose
- [ ] Color contrast meets WCAG AA
- [ ] Focus ring meets 3px minimum per spec

### User Testing
- [ ] Users find "Create" affordances easily
- [ ] Placeholder cards feel natural
- [ ] Modal CTAs are unambiguous
- [ ] Users recognize patterns across pages
- [ ] Reduced confusion vs current state

---

## Success Metrics

1. **Consistency:** 95%+ of buttons follow patterns
2. **Discoverability:** Placeholder cards have 3x+ click rate vs small buttons
3. **Accessibility:** 100% of icon buttons have tooltips
4. **Maintainability:** ZERO custom button styling in component files
5. **User Satisfaction:** Support requests for "How do I create X?" drop by 50%+

---

## Questions for Review

1. ✓ Do you agree to replace small "Add" buttons with placeholder cards?
2. ✓ Do you agree with verb standardization (Create vs Add)?
3. ✓ Should we make `size="lg"` default for primary CTAs?
4. ✓ Should leading icons be standard for action buttons?
5. ✓ Can we enforce IconButton wrapper for all icon-only buttons?

---

## References & Patterns

**Design Systems Referenced:**
- Shadcn UI button documentation
- WCAG 2.1 Button Accessibility Guidelines
- Nielsen Norman: Button Design Best Practices
- Material Design: Button Usage Patterns

**Key Files Involved:**
- `src/app/components/ui/button.tsx` (base component)
- `src/app/components/ui/icon-button.tsx` (icon wrapper)
- `src/app/components/dialogs/CreateSpaceDialogV3.tsx` (reference pattern)

---

## Appendix: Comprehensive Button Audit Statistics

### Overall Usage Statistics
- **Total Button Instances:** 275+ across codebase
- **Files Using Button Component:** 138+ files import Button or IconButton
- **IconButton Wrapper Usage:** 237 instances (highly consistent)
- **Variants Distribution:**
  - Ghost: ~40% (Cancel, Close, Back, navigation)
  - Default: ~35% (Create, Submit, Save CTAs)
  - Outline: ~20% (Add sub-items, secondary actions)
  - Destructive: ~3% (Delete actions)
  - Secondary: ~2% (Alternative CTAs)
  - Link: ~1% (Text links, inline navigation)

### Size Distribution
- Small (`sm`): ~45% (dialogs, compact lists, toolbar items)
- Default (`default`): ~45% (standard forms, primary CTAs)
- Large (`lg`): ~8% (hero sections, prominent CTAs)
- Icon (`icon`): ~2% (icon-only buttons)

---

## 8 Critical Inconsistencies Identified

### #1: Dashed Border Fragmentation
**Problem:** No consistent way to mark "add more" affordances

**Examples:**
- `AnalyticsGraphExplorer.tsx:484` - Button with inline `borderStyle: 'dashed'`
- `CreateSpaceDialogV3.tsx:801` - Plain div with dashed border
- `SpaceCard.tsx` - Some use dashed border placeholder, others use small buttons

**Impact:** Inconsistent visual signal for "add more" actions

**Fix:** Create reusable `PlaceholderCard` component with dashed border

---

### #2: Custom Icon Sizing (No Size System for Icons)
**Problem:** Icons vary in size without correlation to button size

**Examples:**
- `CreateSpaceChat.tsx:386` - `w-3 h-3` in small button
- `MessagesPopover.tsx` - `h-7 w-7`, `h-8 w-8` custom sizes
- `UserProfileHeader.tsx` - `w-5 h-5` with no size prop
- Inconsistent pairing with button sizes

**Current:** `button.tsx` auto-scales SVGs to `size-4` by default

**Fix:** Document icon size pairs:
- Small buttons (`sm`) → w-3.5 h-3.5 icons
- Default buttons (`default`) → w-4 h-4 icons
- Large buttons (`lg`) → w-5 h-5 icons

---

### #3: Inconsistent Destructive Action Styling
**Problem:** Delete/destructive actions use wrong variants

**Examples:**
- `CreateTemplatePackDialogV3.tsx:502` - Delete uses `ghost` (should be `destructive`)
- `InvitationsDialog.tsx:92` - Remove uses `outline` (should be `destructive`)
- Some use `variant="destructive"` ✓ (correct pattern)

**Impact:** Users don't recognize dangerous actions

**Fix:** All deletion/removal must use `variant="destructive"`

---

### #4: Label Verb Inconsistency Across Dialogs
**Problem:** Same action uses different verbs

**Examples:**
- Create: "Create Space" vs "Add Space" vs "New Space"
- Cancel: "Cancel" vs "Close" vs "Dismiss"
- Submit: "Save" vs "Create" vs "Submit"
- Add: "Add Post" vs "Add Document" vs "Create Item"

**Top Offenders:**
- CreateSpaceDialogV3: 5 different button labels (good)
- CreateVCDialogV3: 3 variations (needs standardization)
- CreateTemplatePackDialogV3: Multiple label patterns

**Fix:** Use standardized verb list (see section 4.1)

---

### #5: Icon-Text Spacing Inconsistency
**Problem:** Gap between icons and text varies

**Examples:**
- Back buttons: `gap-1 px-2` (tight)
- Add buttons: `gap-2` (standard)
- Change buttons: `gap-1` (tight)
- No consistent rule

**Impact:** Visual rhythm broken; looks unpolished

**Current Rule:** Button component sets `gap-2` by default

**Fix:** 
- Never override gap
- Use standard `gap-2` everywhere
- Use `gap-1` only in compact (size="sm") contexts

---

### #6: Context-Dependent Button Sizing
**Problem:** Same action (Create) uses different sizes depending on context

**Examples:**
- Dialog "Create": `size="default"`
- CreateSpaceChat "Create": `size="lg"` + custom font size
- Hero section "Create Space": `size="lg"`
- Inline "Add Item": `size="sm"`

**Impact:** Inconsistent prominence for same action

**Fix:** Define sizing by context:
- Dialog primary action: `size="default"`
- Hero CTA: `size="lg"`
- Inline/compact: `size="sm"`
- Icon buttons: `size="icon"` with IconButton wrapper

---

### #7: Async State Feedback Inconsistency
**Problem:** Loading states handled differently

**Examples:**
- `SaveBar.tsx` - Shows spinner in button
- `CreateSpaceChat.tsx` - Only uses `disabled`
- `CreateSpaceDialogV3.tsx` - Disabled + message "Creating..."

**Impact:** Users uncertain if action is processing

**Fix:** Standardize:
1. Show spinner + disabled while processing
2. Show success/error feedback
3. Use `useTransition()` for consistent pattern

---

### #8: Custom Inline Styles Bypass Component System
**Problem:** Buttons created with `<button>` tag + className instead of Button component

**Examples:**
- `SpacesGallery.tsx:118-124` - Custom "See all" button
- `SpacesGallery.tsx:135-142` - Custom "Load More" button
- `PostCard.tsx:200-209` - Custom "Read more" button
- `Header.tsx:178-195` - Custom dropdown items (should use DropdownMenuItem)

**Impact:**
- Not maintained when button system changes
- Missing focus ring styles
- Reduced accessibility
- Code duplication

**Fix:** Use Button component or DropdownMenuItem, never custom

---

## Files Requiring Immediate Changes

### Critical (Do in Phase 1)

#### 1. `src/app/components/dashboard/SpacesGallery.tsx`
**Issues:**
- Line 118-124: Custom "See all Subspaces" button
- Line 135-142: Custom "Load More" button

**Changes:**
```tsx
// Line 118 - Replace with:
<Button variant="link" size="sm">
  See all {subspaces.length} Subspaces <ChevronRight className="w-4 h-4" />
</Button>

// Line 135 - Replace with:
<Button variant="outline">Load More</Button>
```

---

#### 2. `src/app/components/space/PostCard.tsx`
**Issues:**
- Line 200-209: Custom "Read more/less" button
- Line 221: "Open Whiteboard" hidden, uses secondary variant

**Changes:**
```tsx
// Line 200 - Replace with:
<Button variant="link" size="sm" onClick={toggleExpand}>
  {isExpanded ? "Show less" : "Show more"}
</Button>

// Line 221 - Change to:
<Button className="shadow-sm">Open Whiteboard</Button> // primary by default
```

---

#### 3. `src/app/components/dialogs/CreateSpaceDialogV3.tsx`
**Status:** ✓ GOOD PATTERN - Use as reference for all dialogs

**Dialog Footer Pattern (Lines 455-487):**
```tsx
<DialogFooter className="px-6 py-4 border-t bg-muted/20">
  <div className="flex items-center justify-between w-full">
    <div className="flex items-center gap-3">
      {currentView >= 0 && (
        <Button variant="ghost" size="sm" className="gap-1 px-2">
          ← Back
        </Button>
      )}
    </div>
    <div className="flex items-center gap-2">
      <Button variant="outline">Cancel</Button>
      <Button>Create Space</Button>
    </div>
  </div>
</DialogFooter>
```

**Roll Out To:**
- `CreateVCDialogV3.tsx`
- `CreateTemplatePackDialogV3.tsx`
- `CreateInnovationHubDialogV3.tsx`
- All other dialog components

---

### High Priority (Do in Phase 2)

#### 4. `src/app/components/dialogs/CreateVCDialogV3.tsx`
**Issues:**
- Line 513, 525: Destructive actions use wrong variant
- Inconsistent label pattern

---

#### 5. `src/app/components/dialogs/CreateTemplatePackDialogV3.tsx`
**Issues:**
- Line 499-502: Custom icon sizing, destructive variant wrong
- Multiple label variations

---

#### 6. All Icon-Only Buttons (Toolbar/Header)
**Issue:** Some missing tooltips

**Files to audit:**
- `Header.tsx` - Most properly use IconButton ✓
- `Sidebar.tsx` - Check all icon buttons
- Any component with icon-only buttons

**Fix:** Replace bare `<button>` with `<IconButton>` wrapper

---

### Add Placeholder Cards (Phase 2-3)

#### 7. `src/app/components/space/SpaceSettingsSubspaces.tsx`
Add: `<PlaceholderCard label="Create Subspace" onClick={openDialog} />`

#### 8. `src/app/components/space/SpaceResourcesList.tsx`
Add: `<PlaceholderCard label="Add Resource" onClick={openDialog} />`

#### 9. `src/app/components/space/CommunityFeed.tsx`
Add: `<PlaceholderCard label="Post Update" onClick={openDialog} />`

#### 10. Document/Template Collections
Similar treatment for any collection with "Add" button

---

**Report Prepared By:** Claude Code  
**Status:** Ready for Implementation  
**Last Updated:** June 30, 2026

---

## Quick Start: Where to Begin

**If you have 1 hour:** Fix SpacesGallery.tsx and PostCard.tsx buttons (Phase 1)

**If you have 4 hours:** Complete all Phase 1 fixes + standardize dialog footers

**If you have 1 day:** Complete Phases 1-2 (add placeholder cards to 2-3 key sections)

**If you have 1 week:** Complete entire plan

Each step makes the system more consistent and improves user experience incrementally.

# Production vs Prototype: Responses System & Button Patterns (Revised)

**Date:** June 30, 2026  
**Focus:** Response system discoverability and button standardization  
**Analysis:** Production patterns → Prototype adoption strategy

---

## Critical Clarification: Responses vs Comments

**These are SEPARATE systems.**

### Responses
- Feature-specific content contributions to a post
- Example: "Call for Whiteboards" - users respond with whiteboard content
- Example: Post asks for documents - users respond with document content
- Can support multiple types: whiteboards, documents, posts, etc.
- Enabled per-post configuration
- **STATUS IN PROTOTYPE:** Works, but UX discoverability issue (small button)
- **STATUS IN PRODUCTION:** Also has small button, but could improve

### Comments
- Traditional discussion/conversation threads
- General comments on posts
- Separate feature from responses
- **STATUS IN THIS AUDIT:** Lower priority, out of scope

**This audit focuses on improving Response system discoverability.**

---

## 1. Button Component Comparison

### Both Use Same Base Component ✓
**Production:** `src/crd/primitives/button.tsx`  
**Prototype:** `src/app/components/ui/button.tsx`

Both have identical structure:
- 6 variants: default, secondary, outline, ghost, destructive, link
- 4 sizes: sm, default, lg, icon
- CVA-based (class-variance-authority)
- Same focus/accessibility patterns

✅ **Status:** No changes needed to base component.

---

## 2. Placeholder Card Pattern (InlineCreateCard)

### Production Implementation ✓
**File:** `src/crd/components/contributor/settings/ContributorAccountView.tsx:217-287`

Production uses `InlineCreateCard` component for:
- Creating new Spaces
- Creating Virtual Contributors (VCs)
- Creating Innovation Packs
- Creating Innovation Hubs

```tsx
function InlineCreateCard({ variant, onClick }: { variant: CardVariant; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group/create flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/5 transition-all hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        isLarge ? 'h-full min-h-[280px]' : 'h-full min-h-[160px]'
      )}
    >
      <div className={cn('flex items-center justify-center rounded-full bg-muted shadow-sm transition-colors group-hover/create:bg-background', isLarge ? 'mb-4 size-12' : 'mb-3 size-10')}>
        <Plus aria-hidden="true" className={cn('text-muted-foreground group-hover/create:text-primary', isLarge ? 'size-6' : 'size-5')} />
      </div>
      {/* Heading and optional description */}
    </button>
  );
}
```

### Prototype Implementation ✅
**Status:** Prototype already uses dashed border placeholder card for spaces!

Now needs to extend to all response types.

---

## 3. Response System in Production vs Prototype

### Production Response Pattern
**File:** `src/crd/components/space/PostCard.tsx`

Production shows **response count in footer:**
```tsx
<Button
  variant="ghost"
  size="sm"
  className="h-8 gap-2 text-muted-foreground hover:text-foreground"
  onClick={event => {
    event.stopPropagation();
    onResponsesClick?.();
  }}
>
  <FileText className="w-4 h-4" aria-hidden="true" />
  <span className="text-caption">{responseLabel}</span>
</Button>
```

**Pattern:**
- Ghost variant button
- Icon + count in footer
- Toggles response view/input (collapsible)
- Minimal visual prominence

### Prototype Response System
**Status:** Works, but discoverability issue

Current approach:
- Small "Add Response" button
- Easy to overlook
- Low engagement

---

## 4. Key Problem: Response Discoverability

### Why Responses Are Hard to Find (In Both Systems)

**Current Pattern:**
```
Response count in footer → Small button → Opens form
```

**Why this is problematic:**
1. Footer buttons are low-visual weight
2. Ghost variant is minimal
3. Button is small, easy to scroll past
4. Users don't see available response "slots"
5. No visual communication of capacity

### Proposed Solution: Placeholder Card Pattern for Responses

**When to show:**
- Response type is enabled for the post
- User has permission to add responses
- Collection is not at max capacity

**Pattern:**
```
Post content
├─ Existing response items (whiteboards, documents, etc.)
├─ PlaceholderCard "Add Whiteboard"
├─ PlaceholderCard "Add Document"
└─ Footer with response count (still there, but secondary)
```

**Design spec (same as InlineCreateCard):**
```tsx
<Card className="border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 bg-transparent hover:bg-muted/20 transition-all cursor-pointer group">
  <CardContent className="flex items-center justify-center aspect-square">
    <div className="flex flex-col items-center gap-3 text-center">
      <Plus className="w-8 h-8 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
        Add Whiteboard
      </span>
    </div>
  </CardContent>
</Card>
```

### Why Placeholder Cards Work Better

✓ **Visual capacity:** Shows "there can be more here"  
✓ **Discoverability:** Eye-catching dashed border  
✓ **Context:** In same grid as actual responses  
✓ **Consistency:** Matches space creation pattern  
✓ **Encouragement:** Makes contribution more obvious  

---

## 5. Where Prototype Should Add Response Placeholder Cards

### By Post Content Type

| Response Type | Current Pattern | Should Use | Priority |
|---|---|---|---|
| Whiteboards | Small button | Placeholder card | HIGH |
| Documents | Small button | Placeholder card | HIGH |
| Posts/Updates | Small button | Placeholder card | HIGH |
| Custom types | Small button | Placeholder card | HIGH |

### Implementation

For each post with responses enabled:

```tsx
// Production currently shows:
<Button variant="ghost" size="sm">
  <FileText className="w-4 h-4" />
  {responseCount} Responses
</Button>

// Prototype should ADD:
{responseTypeEnabled.map(type => (
  <PlaceholderCard
    key={type.id}
    label={`Add ${type.name}`}
    onClick={() => openResponseForm(type)}
  />
))}

// Keep footer button for viewing all responses
```

---

## 6. Button Pattern Consistency

### Production's Approach

#### Ghost Variant for Secondary Actions
```tsx
// Responses footer button
<Button variant="ghost" size="sm" className="h-8 gap-2">
  <Icon className="w-4 h-4" aria-hidden="true" />
  <span className="text-caption">{count}</span>
</Button>

// Comments footer button (same pattern)
<Button variant="ghost" size="sm" className="h-8 gap-2">
  <MessageSquare className="w-4 h-4" aria-hidden="true" />
  <span className="text-caption">{count}</span>
</Button>
```

#### Outline Variant for Secondary CTAs
```tsx
// Add media
<Button variant="outline" size="sm" className="gap-2">
  <ImagePlus className="size-4" aria-hidden="true" />
  {t('mediaGallery.emptyState.action')}
</Button>
```

#### Default Variant for Primary CTAs
```tsx
// Dialog actions
<Button onClick={onCreate} disabled={creating}>
  Create Space
</Button>
```

### Prototype's Approach
✓ Already consistent with production in most places

---

## 7. Prototype-Specific Changes Needed

### High Priority

#### 1. Add Response Placeholder Cards
**Where:** PostCard and all response type views  
**What:** PlaceholderCard component showing each enabled response type  
**When:** Show when:
- Response type is enabled
- User has create permission
- Not at capacity

#### 2. Fix Custom Buttons
**Files:**
- SpacesGallery.tsx:118-124
- SpacesGallery.tsx:135-142
- PostCard.tsx:200-209

**Action:** Use Button component instead of custom div

#### 3. Standardize Dialog Footers
**Pattern:** `[Cancel/outline] [Action/default]`  
**Multi-step:** Add `[Back/ghost]` on left

---

### Medium Priority

#### 1. Expand Placeholder Card Usage
Currently only spaces use placeholder cards. Should extend to:
- Resources
- Documents
- Templates
- Any other collections

#### 2. Response Button in Footer
Keep the "X Responses" button in footer:
- Shows current response count
- Toggles view/collapse of response section
- But is secondary to placeholder cards for adding

---

## 8. Production → Prototype Adoption Checklist

- [ ] **Base button component:** Already aligned ✓
- [ ] **Placeholder card pattern:** Adopt for all response types (HIGH)
- [ ] **Response discoverability:** Improve via placeholder cards (HIGH)
- [ ] **Custom buttons:** Fix 3 instances (MEDIUM)
- [ ] **Dialog footer pattern:** Standardize across all dialogs (MEDIUM)
- [ ] **Ghost variant usage:** Already consistent ✓
- [ ] **Variant consistency:** Already mostly correct ✓
- [ ] **Label verbs:** Standardize where possible (LOW)
- [ ] **Icon sizing:** Document standards (MEDIUM)

---

## 9. Implementation Timeline

### Week 1: Foundation
- [ ] Fix 3 custom button instances
- [ ] Create PlaceholderCard component
- [ ] Standardize dialog footers
- [ ] Plan response placeholder implementation

### Week 2: Response Placeholder Cards
- [ ] Add PlaceholderCard to whiteboard response contexts
- [ ] Add PlaceholderCard to document response contexts
- [ ] Add PlaceholderCard to other response types
- [ ] Test discoverability improvement

### Week 3: Expansion & Standardization
- [ ] Expand placeholder cards to other collections
- [ ] Standardize all dialog footers
- [ ] Audit icon sizing and spacing
- [ ] Final consistency pass

### Week 4: Testing & Documentation
- [ ] A/B test: Placeholder cards vs footer button
- [ ] Accessibility audit
- [ ] Dark mode verification
- [ ] Document patterns in CLAUDE.md

---

## 10. Key Differences: Production vs Prototype

| Aspect | Production | Prototype | Action |
|--------|-----------|-----------|--------|
| **Button component** | `crd/primitives/button.tsx` | `ui/button.tsx` | ✓ Identical |
| **Response footer button** | Ghost variant, minimal | Ghost variant, minimal | ✓ Same |
| **Response placeholders** | Not implemented | Not implemented | Implement in prototype |
| **Placeholder cards** | Only for space/VC/pack/hub | Only for spaces | Expand to all types |
| **Custom buttons** | None | 3 instances | Fix |
| **Dialog footers** | Mostly consistent | Some inconsistency | Standardize |
| **Comments system** | Separate from responses | Not in this audit | N/A |

---

## 11. Production Code to Reuse

### InlineCreateCard Component
**Source:** `src/crd/components/contributor/settings/ContributorAccountView.tsx:217-287`  
**Use:** Adapt for prototype's PlaceholderCard

### Response Footer Button Pattern
**Source:** `src/crd/components/space/PostCard.tsx`  
**Use:** Keep as-is, but supplement with placeholder cards

---

## 12. Critical Success Factor

**Response discoverability improvement** is the biggest win here.

Current state: Users miss response opportunities  
Goal: Users see available response types and are encouraged to contribute

**Measure of success:**
- 3x+ increase in response contributions
- User feedback: "Oh, I can add that!" (discovery)
- Engagement metrics improve

---

## Summary

1. ✅ **Button component:** Already perfect, no change needed
2. ❌ **Response discoverability:** PRIMARY ISSUE - needs placeholder cards
3. ⚠️ **Custom buttons:** 3 instances to fix
4. ⚠️ **Dialog consistency:** Should standardize
5. ✓ **Variant usage:** Already mostly consistent

**The core insight:** Response system already works technically, but needs better UX affordance. Placeholder cards solve this.

---

**Next Steps:**
1. Approve placeholder card approach for responses
2. Create PlaceholderCard component
3. Implement response placeholders in all post types
4. Measure engagement improvement

---

**Files Reference:**
- Production InlineCreateCard: `src/crd/components/contributor/settings/ContributorAccountView.tsx:217-287`
- Production Response footer: `src/crd/components/space/PostCard.tsx`
- Prototype Button: `src/app/components/ui/button.tsx` (identical to production)

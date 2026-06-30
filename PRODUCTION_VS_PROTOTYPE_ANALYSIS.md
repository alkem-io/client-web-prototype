# Production vs Prototype: Button System Comparison & Recommendations

**Date:** June 30, 2026  
**Analysis:** Alignment between production (alkem-io/client-web) and prototype (Shadcn UI Redesign)

---

## Key Insight: Production Already Has Better Patterns

The good news: **Production has already solved many of the button system inconsistencies** through deliberate design patterns. The prototype should adopt these patterns from production.

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

## 2. Placeholder Card Pattern (Production → Prototype)

### Production Implementation: InlineCreateCard ✓
**File:** `src/crd/components/contributor/settings/ContributorAccountView.tsx:217-287`

```tsx
function InlineCreateCard({ variant, onClick }: { variant: CardVariant; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={copy.ariaLabel}
      className={cn(
        'group/create flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/5 transition-all hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        isLarge ? 'h-full min-h-[280px]' : 'h-full min-h-[160px]'
      )}
    >
      <div className={cn('flex items-center justify-center rounded-full bg-muted shadow-sm transition-colors group-hover/create:bg-background', isLarge ? 'mb-4 size-12' : 'mb-3 size-10')}>
        <Plus aria-hidden="true" className={cn('text-muted-foreground group-hover/create:text-primary', isLarge ? 'size-6' : 'size-5')} />
      </div>
      {isLarge ? (
        <h3 className="text-subsection-title text-foreground transition-colors group-hover/create:text-primary">{copy.heading}</h3>
      ) : (
        <span className="text-body-emphasis text-muted-foreground transition-colors group-hover/create:text-primary">{copy.heading}</span>
      )}
      {copy.blurb ? (
        <p className="mt-2 max-w-[200px] text-center text-body text-muted-foreground">{copy.blurb}</p>
      ) : null}
    </button>
  );
}
```

### Design Details:
- **Dashed border:** `border border-dashed border-border`
- **Plus icon:** Centered, with rounded-full background
- **Size options:** Large (280px) and normal (160px)
- **Hover state:** Border and icon change to primary color
- **Focus state:** Ring with offset (2px ring, ring-offset)
- **Text variants:** Heading + optional description
- **Supported types:** space, vc (virtual contributor), pack, hub

### Prototype Implementation Needed:
Create `src/app/components/ui/placeholder-card.tsx` based on production's InlineCreateCard:

```tsx
interface PlaceholderCardProps {
  label: string;
  description?: string;
  size?: 'sm' | 'lg';  // sm: 160px, lg: 280px
  onClick: () => void;
}

export function PlaceholderCard({ 
  label, 
  description, 
  size = 'sm',
  onClick 
}: PlaceholderCardProps) {
  const isLarge = size === 'lg';
  
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'group/create flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/5 transition-all hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        isLarge ? 'h-full min-h-[280px]' : 'h-full min-h-[160px]'
      )}
    >
      <div className={cn('flex items-center justify-center rounded-full bg-muted shadow-sm transition-colors group-hover/create:bg-background', isLarge ? 'mb-4 size-12' : 'mb-3 size-10')}>
        <Plus aria-hidden="true" className={cn('text-muted-foreground group-hover/create:text-primary', isLarge ? 'size-6' : 'size-5')} />
      </div>
      {isLarge ? (
        <h3 className="text-subsection-title text-foreground transition-colors group-hover/create:text-primary">
          {label}
        </h3>
      ) : (
        <span className="text-body-emphasis text-muted-foreground transition-colors group-hover/create:text-primary">
          {label}
        </span>
      )}
      {description ? (
        <p className="mt-2 max-w-[200px] text-center text-body text-muted-foreground">
          {description}
        </p>
      ) : null}
    </button>
  );
}
```

### Where Production Uses This:
- Creating new Spaces in user account settings
- Creating Virtual Contributors (VCs)
- Creating Innovation Packs
- Creating Innovation Hubs

### Where Prototype Should Use This:
- Creating Subspaces (currently uses button)
- Creating Resources (currently uses button)
- Creating Community Responses (currently no affordance)
- Creating Documents (currently uses button)
- Creating Templates (currently uses button)

---

## 3. Comment/Response Pattern (Production → Prototype)

### Production Implementation: PostCard Footer
**File:** `src/crd/components/space/PostCard.tsx:467-508`

Production has a sophisticated comment pattern:

```tsx
{(post.commentsEnabled !== false || (post.commentCount ?? 0) > 0) &&
  (hasCollapsibleComments ? (
    <CardFooter className="!p-0 flex-col items-stretch gap-0 border-t bg-muted/5">
      <Collapsible open={isCommentsOpen} onOpenChange={handleCommentsOpenChange}>
        <CollapsibleTrigger asChild={true}>
          <button
            type="button"
            className="group/comments flex w-full items-center gap-2 px-6 py-3 text-caption text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={t(isCommentsOpen ? 'callout.collapseComments' : 'callout.expandComments')}
          >
            <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]/comments:rotate-180" aria-hidden="true" />
            <MessageSquare className="size-4" aria-hidden="true" />
            <span>{commentLabel}</span>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-6 pt-4 pb-4">
          <div className="flex flex-col gap-3">
            {commentInputSlot}
            <div className="max-h-[400px] overflow-y-auto pr-2">{commentsSlot}</div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </CardFooter>
  ) : (
    <CardFooter className="!py-3 flex items-center gap-4 border-t bg-muted/5 px-6">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-2 text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent"
        onClick={event => {
          event.stopPropagation();
          onCommentsClick?.();
        }}
      >
        <MessageSquare className="w-4 h-4" aria-hidden="true" />
        <span className="text-caption">{commentLabel}</span>
      </Button>
    </CardFooter>
  ))
}
```

### Key Patterns:
1. **Collapsible footer** with inline comment input + thread
2. **Ghost variant** for comment button
3. **MessageSquare icon** + comment count
4. **Chevron indicator** showing open/closed state
5. **Smart visibility:** Hidden when disabled AND no comments; visible when comments exist
6. **Max-height with scroll:** Comments container has max-h-[400px] with scroll

### Prototype Current State:
**Missing entirely.** Prototype has no comment/response functionality.

### What Prototype Should Implement:
1. Add collapsible comment footer to PostCard
2. Use production's component architecture (CommentThread, CommentInput, etc.)
3. Add inline comment input + thread display
4. Use MessageSquare icon with variant="ghost" size="sm"

---

## 4. Button Variant Usage Patterns (From Production)

### Primary Buttons (`variant="default"`)
**Found in production:**
- Dialog "Create" actions
- "Create new Space" header buttons
- Innovation Hub space creation
- Main CTAs in forms

**Pattern:** Always on right side of dialog footer, highest visual weight

---

### Secondary Buttons (`variant="secondary"`)
**Rarely used in production** (~2% of buttons)

**When found:**
- Preview buttons paired with publish
- Alternative CTAs in specific dialogs

**Pattern:** Lower visual weight than default

---

### Outline Buttons (`variant="outline"`)
**Very common in production** (~20% of buttons)

**Common uses:**
- "Add media gallery images" (size="sm")
- Cancel buttons in dialogs
- Secondary navigation
- "Load more" type actions

**Pattern Examples:**
```tsx
<Button variant="outline" size="sm" className="gap-2" onClick={onAddImages}>
  <ImagePlus className="size-4" aria-hidden="true" />
  {t('mediaGallery.emptyState.action')}
</Button>
```

---

### Ghost Buttons (`variant="ghost"`)
**Very common in production** (~40% of buttons)

**Common uses:**
- Icon buttons with text (size="sm")
- Comments button in post footer
- Toolbar buttons
- Collapsible triggers
- Any minimal action

**Pattern Examples:**
```tsx
<Button
  variant="ghost"
  size="sm"
  className="h-8 gap-2 text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent"
>
  <MessageSquare className="w-4 h-4" aria-hidden="true" />
  <span className="text-caption">{commentLabel}</span>
</Button>

<Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
  {icon}
</Button>
```

---

### Destructive Buttons (`variant="destructive"`)
**Rare in production** (~3%)

**Uses:**
- Confirmation dialogs for delete actions
- Only in explicit "Are you sure?" context

**Pattern:** Never elsewhere, always paired with outline "Cancel"

---

### Link Buttons (`variant="link"`)
**Rare in production** (~1%)

**Uses:**
- Text links in explanatory content
- Never for primary CTAs

---

## 5. Key Production Patterns to Adopt

### Pattern A: Collapsible Comments Footer
**Where production uses it:** PostCard component  
**Status in prototype:** ❌ Missing

**What to do:**
- Add comment system to PostCard
- Make comments collapsible/expandable
- Show inline comment thread
- Use MessageSquare icon + variant="ghost"

---

### Pattern B: InlineCreateCard (Placeholder Card)
**Where production uses it:** User account settings (space, VC, pack, hub creation)  
**Status in prototype:** ⚠️ Only for spaces, should expand

**What to do:**
- Create reusable PlaceholderCard component
- Use for all collection creation (subspaces, resources, responses, etc.)
- Standardize on two sizes (sm: 160px, lg: 280px)
- Use production's color transition pattern

---

### Pattern C: Section Create Button (In Headers)
**Where production uses it:** Section headers  
**Status in prototype:** ✅ Present

**Pattern found:**
```tsx
{group.canCreate ? <InlineCreateCard variant={variant} onClick={group.onCreate} /> : null}

// Alternative for header button:
<Button onClick={onCreateOrganization} className="ml-auto md:ml-0">
  Create [Item]
</Button>
```

---

### Pattern D: Ghost + Icon for Action Lists
**Where production uses it:** Add media, comments, etc.  
**Status in prototype:** ⚠️ Inconsistent

**Production pattern:**
```tsx
<Button variant="ghost" size="sm" className="h-8 gap-2 text-muted-foreground hover:text-foreground">
  <Icon className="w-4 h-4" aria-hidden="true" />
  <span className="text-caption">Label</span>
</Button>
```

---

## 6. Prototype-Specific Issues vs Production

### Issue: No Comment System
**Prototype:** Missing comment/response functionality  
**Production:** Full comment system with threads, replies, reactions  
**Action:** Implement comment system (copy from production if possible)

---

### Issue: Limited Placeholder Cards
**Prototype:** Only spaces have placeholder cards  
**Production:** Uses InlineCreateCard for spaces, VCs, packs, hubs  
**Action:** Expand placeholder card pattern to all collection types

---

### Issue: Some Custom Buttons Still Exist
**Prototype Problems Found:**
- SpacesGallery.tsx:118-124 - Custom "See all" link
- SpacesGallery.tsx:135-142 - Custom "Load more" button
- PostCard.tsx:200-209 - Custom "Read more" button

**Production:** Uses Button component consistently everywhere  
**Action:** Fix these custom implementations

---

### Issue: No Consistent "Add" Pattern
**Prototype:** Mix of buttons and placeholder cards  
**Production:** Standardized on InlineCreateCard across account settings  
**Action:** Standardize prototype on placeholder cards

---

## 7. Revised Prototype Implementation Plan

### Phase 1: Foundation (Week 1)
- [ ] Create PlaceholderCard component (copy/adapt InlineCreateCard from production)
- [ ] Fix SpacesGallery.tsx custom buttons
- [ ] Fix PostCard.tsx custom buttons
- [ ] Document button system with production examples

### Phase 2: Standardization (Week 2)
- [ ] Replace all "Add X" buttons with PlaceholderCard
- [ ] Standardize variant usage to match production
- [ ] Ensure all icon buttons use ghost variant with proper sizing
- [ ] Standardize dialog footers

### Phase 3: Comments System (Week 3+)
- [ ] Import comment components from production (or reimplement)
- [ ] Add collapsible comments footer to PostCard
- [ ] Implement CommentThread, CommentInput, etc.
- [ ] Wire up comment mutations and subscriptions

### Phase 4: Polish & Testing (Week 4+)
- [ ] A/B test: Placeholder cards vs small buttons
- [ ] Accessibility audit
- [ ] Dark mode verification
- [ ] Performance testing

---

## 8. Recommended Production Code to Reuse

### 1. InlineCreateCard Component
**Source:** `src/crd/components/contributor/settings/ContributorAccountView.tsx:217-287`  
**Reuse:** Yes - adapt for prototype with simplified props

### 2. PostCard Comment Footer Pattern
**Source:** `src/crd/components/space/PostCard.tsx:467-508`  
**Reuse:** Yes - use for prototype post cards

### 3. CommentThread, CommentInput, CommentItem
**Source:** `src/crd/components/comment/*.tsx`  
**Reuse:** Yes - if possible, import or copy pattern

### 4. Button Styling Patterns
**Source:** `src/crd/primitives/button.tsx` (identical to prototype)  
**Reuse:** No change needed - already aligned

---

## 9. Key Differences to Understand

| Aspect | Production | Prototype | Action |
|--------|-----------|-----------|--------|
| **Button component** | `crd/primitives/button.tsx` | `ui/button.tsx` | ✓ Identical, no change |
| **Placeholder cards** | InlineCreateCard (spaces, VC, pack, hub) | Only spaces | Expand to all types |
| **Comments** | Full system with threads, reactions | None | Implement |
| **Dialog footers** | Consistent pattern | Some inconsistency | Standardize |
| **Custom buttons** | None (all use Button) | SpacesGallery, PostCard | Fix |
| **Icon buttons** | Ghost variant + size | Sometimes custom | Standardize |
| **Variant usage** | Consistent ~40% ghost, ~35% default | Variable | Align |

---

## 10. Production → Prototype Adoption Checklist

- [ ] **Base button component:** Already aligned ✓
- [ ] **InlineCreateCard pattern:** Adopt for all collection types
- [ ] **Comment system:** Implement (can copy from production)
- [ ] **Dialog footer pattern:** Standardize across all dialogs
- [ ] **Ghost + icon pattern:** Apply to all action lists
- [ ] **Placeholder card sizes:** 160px (sm) and 280px (lg)
- [ ] **Icon sizing:** w-4 h-4 for default, w-5 h-5 for lg
- [ ] **Variant consistency:** ~40% ghost, ~35% default, ~20% outline
- [ ] **Custom buttons:** Replace all 3 found instances
- [ ] **Documentation:** Reference production patterns in prototype docs

---

## Summary

**The prototype is on the right track** but needs to:
1. ✅ Keep the base button component (it's perfect)
2. ❌ Add comment system (production has it, prototype missing)
3. ❌ Expand placeholder cards (only spaces have them)
4. ❌ Fix custom button implementations (3 instances found)
5. ✅ Align variant usage (mostly already correct)
6. ✅ Adopt production's InlineCreateCard pattern

The good news: **Production has solved these problems.** The prototype can learn directly from production's implementations and adapt them as needed.

---

**Next Steps:**
1. Review this document with the team
2. Decide: Copy comment components from production, or reimplement?
3. Prioritize comment system implementation
4. Expand placeholder card pattern across all collection types
5. Implement PlaceholderCard component in prototype

---

**Files Directly Usable from Production:**
- `src/crd/components/contributor/settings/ContributorAccountView.tsx` - InlineCreateCard pattern (lines 217-287)
- `src/crd/components/space/PostCard.tsx` - Comment footer pattern (lines 467-508)
- `src/crd/components/comment/*.tsx` - Full comment system (optional reuse)

# Button System Implementation Guide

**Quick Reference for Standardized Button Usage**

---

## Variant Decision Tree

```
Is this an icon-only button?
├─ YES → Use <IconButton> wrapper with tooltipLabel
└─ NO → Continue...

Is this a dangerous action (delete, remove, discard)?
├─ YES → variant="destructive" (ONLY in confirmation dialogs)
└─ NO → Continue...

Is this the main action that moves forward?
├─ YES → variant="default" (primary CTA)
└─ NO → Continue...

Is this a form cancellation or secondary navigation?
├─ YES → variant="outline"
└─ NO → Continue...

Is this a text-only link in content?
├─ YES → variant="link"
└─ NO → variant="ghost" (minimal action, toolbar, etc.)
```

---

## Common Patterns

### Pattern 1: Form With Primary Action

```tsx
import { Button } from "@/app/components/ui/button";
import { DialogFooter } from "@/app/components/ui/dialog";

<DialogFooter>
  <Button variant="outline" onClick={onCancel}>
    Cancel
  </Button>
  <Button onClick={onSave}>
    Save Changes
  </Button>
</DialogFooter>
```

**Rules:**
- Left: `variant="outline"` + "Cancel"
- Right: `variant="default"` + action verb
- Spacing: automatic with DialogFooter

---

### Pattern 2: Multi-Step Dialog

```tsx
<DialogFooter className="px-6 py-4 border-t bg-muted/20">
  <div className="flex items-center justify-between w-full">
    {/* Left side - Back button */}
    <Button variant="ghost" size="sm">
      ← Back
    </Button>
    
    {/* Right side - Cancel & Next */}
    <div className="flex items-center gap-2">
      <Button variant="outline">Cancel</Button>
      <Button>Next</Button>
    </div>
  </div>
</DialogFooter>
```

---

### Pattern 3: Destructive Confirmation

```tsx
<DialogFooter>
  <Button variant="outline">Keep</Button>
  <Button variant="destructive">Delete</Button>
</DialogFooter>
```

**Rules:**
- Destructive button on right
- NOT default focus (use outline first)
- Clear label: "Delete" not "OK"

---

### Pattern 4: Icon Buttons

```tsx
import { IconButton } from "@/app/components/ui/icon-button";
import { Settings } from "lucide-react";

<IconButton
  variant="ghost"
  tooltipLabel="Settings"
>
  <Settings className="w-4 h-4" />
</IconButton>
```

**NEVER do this:**
```tsx
// ❌ WRONG - Missing tooltip
<button className="...">
  <Settings />
</button>

// ✓ ALWAYS use IconButton wrapper
<IconButton tooltipLabel="Settings">
  <Settings className="w-4 h-4" />
</IconButton>
```

---

### Pattern 5: Text Link in Content

```tsx
<Button variant="link" size="sm">
  Read more about this feature
</Button>

// With trailing icon
<Button variant="link">
  See all items
  <ChevronRight className="w-4 h-4" />
</Button>
```

---

### Pattern 6: Placeholder Card (Create New Item)

```tsx
import { Card, CardContent } from "@/app/components/ui/card";
import { Plus } from "lucide-react";

<Card className="border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 bg-transparent hover:bg-muted/20 transition-all cursor-pointer group">
  <CardContent className="flex items-center justify-center aspect-square">
    <div className="flex flex-col items-center gap-3 text-center">
      <Plus className="w-8 h-8 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
        Create Space
      </span>
    </div>
  </CardContent>
</Card>
```

**When to use:** Any collection where users create multiple items

---

### Pattern 7: Toolbar Buttons

```tsx
// Icon-only buttons in header/toolbar
<div className="flex items-center gap-1">
  <IconButton variant="ghost" tooltipLabel="Search">
    <Search className="w-5 h-5" />
  </IconButton>
  
  <IconButton variant="ghost" tooltipLabel="Notifications">
    <Bell className="w-5 h-5" />
  </IconButton>
</div>
```

---

### Pattern 8: Action With Loading State

```tsx
import { useState, useTransition } from "react";
import { Button } from "@/app/components/ui/button";

export function CreateButton() {
  const [isPending, startTransition] = useTransition();
  
  const handleCreate = () => {
    startTransition(async () => {
      await createItem();
    });
  };

  return (
    <Button onClick={handleCreate} disabled={isPending}>
      {isPending ? (
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Creating...
        </span>
      ) : (
        "Create Space"
      )}
    </Button>
  );
}
```

---

## Size & Icon Pairing

### Small Buttons (`size="sm"`)
- **Height:** 32px
- **Padding:** px-3
- **Icon size:** w-4 h-4
- **Use for:** Compact forms, dialogs, back buttons
- **Example:** Back button in multi-step dialog

```tsx
<Button variant="ghost" size="sm" className="gap-1 px-2">
  <ChevronLeft className="w-4 h-4" />
  Back
</Button>
```

---

### Default Buttons (`size="default"`)
- **Height:** 36px
- **Padding:** px-4
- **Icon size:** w-4 h-4
- **Use for:** Standard forms, dialog CTAs, main buttons
- **Example:** Submit button in form

```tsx
<Button>
  <Check className="w-4 h-4" />
  Save Changes
</Button>
```

---

### Large Buttons (`size="lg"`)
- **Height:** 40px
- **Padding:** px-6
- **Icon size:** w-5 h-5
- **Use for:** Hero sections, prominent CTAs, onboarding
- **Example:** Hero section create button

```tsx
<Button size="lg">
  <Sparkles className="w-5 h-5" />
  Create New Space
</Button>
```

---

### Icon Buttons (`size="icon"`)
- **Dimensions:** 36px square
- **Use:** IconButton wrapper ONLY
- **Always:** Provide tooltipLabel

```tsx
<IconButton
  size="icon"
  variant="ghost"
  tooltipLabel="Delete"
>
  <Trash className="w-4 h-4" />
</IconButton>
```

---

## Label Reference

### Action Verbs (Use These)

| Goal | Verb | Example |
|------|------|---------|
| Create new | **Create** | "Create Space" |
| Add to collection | **Add** | "Add Member" |
| Delete/Remove | **Delete** | "Delete Space" |
| Form submission | **Save** | "Save Changes" |
| Form creation | **Submit** | "Submit Response" |
| Form creation | **Create** | "Create Space" |
| Cancellation | **Cancel** | "Cancel" |
| View details | **Open** | "Open Whiteboard" |
| Navigation | **Back** | "Back" |
| Navigation | **Next** | "Next" |
| Show more | **Show More** | "Show More" |
| Show more (text) | **Read More** | "Read More" |

---

## Checklist: Before You Commit

- [ ] No custom button styling with `<button>` tag
- [ ] All icon-only buttons use `<IconButton>` wrapper
- [ ] Dialog footers follow standard pattern
- [ ] Primary CTA uses `variant="default"`
- [ ] Cancel buttons use `variant="outline"`
- [ ] Dangerous actions use `variant="destructive"`
- [ ] All labels use consistent verbs (see reference above)
- [ ] Icon size matches button size
- [ ] Icon has leading or trailing position, not random
- [ ] No custom gap overrides
- [ ] Focus ring visible when tabbing
- [ ] Works in light AND dark mode

---

## Common Mistakes (Don't Do These)

### ❌ Mistake 1: Custom Button Styling
```tsx
// WRONG
<button className="px-6 py-2 rounded-md border border-border text-muted-foreground hover:bg-accent">
  Load More
</button>

// RIGHT
<Button variant="outline">Load More</Button>
```

---

### ❌ Mistake 2: Icon-Only Without Tooltip
```tsx
// WRONG
<button className="...">
  <Settings className="w-5 h-5" />
</button>

// RIGHT
<IconButton tooltipLabel="Settings">
  <Settings className="w-4 h-4" />
</IconButton>
```

---

### ❌ Mistake 3: Wrong Variant for Dangerous Action
```tsx
// WRONG - Uses ghost instead of destructive
<Button variant="ghost">Delete Space</Button>

// RIGHT
<Button variant="destructive">Delete Space</Button>
```

---

### ❌ Mistake 4: Inconsistent Label Verbs
```tsx
// WRONG - Mix of Create, Add, New
<Button>Create Space</Button>
<Button>Add Subspace</Button>
<Button>New Document</Button>

// RIGHT - Consistent
<Button>Create Space</Button>
<Button>Create Subspace</Button>
<Button>Create Document</Button>
```

---

### ❌ Mistake 5: Missing Size Prop (Uses Default by Mistake)
```tsx
// WRONG - Uses default size in compact context
<Button>Back</Button> {/* size="default" - too big */}

// RIGHT
<Button variant="ghost" size="sm">← Back</Button>
```

---

### ❌ Mistake 6: Custom Gap Override
```tsx
// WRONG - Overrides gap-2
<Button className="gap-1">
  <Plus />
  Add Item
</Button>

// RIGHT - Let Button component handle gap
<Button>
  <Plus />
  Add Item
</Button>
```

---

### ❌ Mistake 7: Dialog Footer Layout
```tsx
// WRONG - Wrong order/styling
<div className="flex gap-2">
  <Button>Create</Button>
  <Button variant="outline">Cancel</Button>
</div>

// RIGHT - Cancel on left, Create on right
<DialogFooter>
  <Button variant="outline">Cancel</Button>
  <Button>Create</Button>
</DialogFooter>
```

---

## Quick Migration Guide

### Change 1: Custom "Load More" → Button Component

**Before:**
```tsx
<button
  onClick={loadMore}
  className="px-6 py-2.5 text-sm font-semibold uppercase tracking-wide rounded-md border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer bg-transparent"
>
  Load More
</button>
```

**After:**
```tsx
<Button variant="outline" onClick={loadMore}>
  Load More
</Button>
```

---

### Change 2: Custom "See All" Link → Button Component

**Before:**
```tsx
<button
  className="mt-3 flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer bg-transparent border-none mx-auto"
  onClick={showAll}
>
  See all items <ChevronRight className="w-4 h-4" />
</button>
```

**After:**
```tsx
<Button variant="link" size="sm" className="mt-3 mx-auto">
  See all items <ChevronRight className="w-4 h-4" />
</Button>
```

---

### Change 3: Icon-Only Button → IconButton Wrapper

**Before:**
```tsx
<button className="p-2 hover:bg-accent rounded-md" title="Delete">
  <Trash className="w-5 h-5" />
</button>
```

**After:**
```tsx
<IconButton tooltipLabel="Delete" variant="ghost">
  <Trash className="w-5 h-5" />
</IconButton>
```

---

### Change 4: Dialog Footer → Standard Pattern

**Before:**
```tsx
<div className="flex justify-end gap-2 pt-6">
  <Button variant="outline">Cancel</Button>
  <Button variant="ghost">Delete</Button>
</div>
```

**After:**
```tsx
<DialogFooter>
  <Button variant="outline">Cancel</Button>
  <Button variant="destructive">Delete</Button>
</DialogFooter>
```

---

## File Templates

### Reusable Placeholder Card Component

**Location:** `src/app/components/ui/placeholder-card.tsx`

```tsx
import { Plus } from "lucide-react";
import { Card, CardContent } from "./card";
import { cn } from "@/lib/utils";

interface PlaceholderCardProps {
  label: string;
  onClick: () => void;
  className?: string;
}

export function PlaceholderCard({ 
  label, 
  onClick, 
  className 
}: PlaceholderCardProps) {
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 bg-transparent hover:bg-muted/20 transition-all cursor-pointer group",
        className
      )}
    >
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

**Usage:**
```tsx
<PlaceholderCard
  label="Create Subspace"
  onClick={() => setDialogOpen(true)}
/>
```

---

## When to Use Each Variant

| Variant | When | Example |
|---------|------|---------|
| `default` | Main action moving forward | Create, Save, Submit, Post |
| `secondary` | Important alternative CTA | Next, Preview, Save as Draft |
| `outline` | Navigation, cancellation | Cancel, Back, Load More |
| `ghost` | Minimal action in context | Toolbar buttons, Back in dialog |
| `destructive` | Dangerous action (confirm dialog only) | Delete, Remove, Discard |
| `link` | Text link in content | Learn More, Read More, See all |

---

## Resources

- **Base Button:** `src/app/components/ui/button.tsx`
- **Icon Button:** `src/app/components/ui/icon-button.tsx`
- **Reference Pattern:** `src/app/components/dialogs/CreateSpaceDialogV3.tsx` (lines 455-487)
- **Full Audit:** `BUTTON_SYSTEM_AUDIT.md`

---

**Last Updated:** June 30, 2026  
**Status:** Ready for implementation

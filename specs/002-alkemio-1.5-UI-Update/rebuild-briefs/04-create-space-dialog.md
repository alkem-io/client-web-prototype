# Rebuild Brief: Create Space Dialog

> Design brief for the Create Space dialog, triggered from Account Settings → Hosted Spaces.
> Uses the CRD (Consistent Responsive Dialog) pattern established for this prototype.

---

## Location

- File: `src/app/components/dialogs/CreateSpaceDialog.tsx`
- Form: `src/app/components/create-space/CreateSpaceForm.tsx`
- Triggered from: `UserAccountPage.tsx` → "Create New Space" button / dashed card

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| CRD responsive dialog shell | Consistent with all prototype dialogs |
| Single-flow (no steps/wizard) | Simpler UX, all fields visible at once |
| Template selector at top | Sets context — pre-fills content when template chosen |
| Tags with enter-to-add | Interactive, same pattern as production |
| Avatar + Card Banner side-by-side | Efficient use of space, visual grouping |
| Cancel + Create Space in footer | Standard action pair, loading spinner on submit |
| Helper text on each field | CRD style guidance |

---

## Dialog Shell (CRD Pattern)

```tsx
<DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden [&>*]:min-w-0">
  <DialogHeader className="px-6 pt-6 pb-4 pr-12 border-b">
    <DialogTitle>Create new Space</DialogTitle>
    <DialogDescription>Set up a new collaborative space on the platform.</DialogDescription>
  </DialogHeader>

  {/* Body — scrollable */}
  <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4 flex flex-col gap-4">
    ...fields...
  </div>

  <DialogFooter className="px-6 py-4 border-t">
    <Button variant="ghost">Cancel</Button>
    <Button disabled={isSubmitting}>
      {isSubmitting ? "Creating..." : "Create Space"}
    </Button>
  </DialogFooter>
</DialogContent>
```

---

## Form Fields (top to bottom)

### 1. Template Selector
- Button-style trigger (not native select)
- Icon: `LayoutTemplate`
- Helper: "Optional — pick a space template to pre-fill content."

### 2. Name *
- `<Input>` with placeholder "e.g. Climate Action Network"
- Helper: "The name of your space, visible to members."
- Required field

### 3. Tagline
- `<Input>` with placeholder "A short tagline..."
- Helper: "A short subtitle describing the space."

### 4. Description
- `<MarkdownEditor>` with min-height 120px
- Helper: "Explain what this space is about. Markdown supported."

### 5. Tags
- `<Input>` with enter-to-add behavior
- Existing tags shown as `<Badge variant="secondary">` with X remove button
- Helper: "Tags help members find this space."

### 6. Visuals (grid cols-2)
- **Avatar**: 1:1 aspect ratio, click-to-upload placeholder with `ImageIcon`
  - Helper: "Recommended: 410 × 410 px"
- **Card Banner**: 410:256 aspect ratio (~1.6:1), click-to-upload placeholder with `ImageIcon`
  - Helper: "Recommended: 410 × 256 px"
- Both: `border border-input rounded-md`, `bg-muted/5`, hover → `bg-accent/30`
- Hover overlay on uploaded image: semi-transparent black with "Change" button (`Button variant="secondary" size="sm"`)

---

## Component Mapping

| Element | Component |
|---------|-----------|
| Dialog shell | `Dialog`, `DialogContent`, `DialogHeader`, `DialogFooter` |
| Name / Tagline | `Input` |
| Description | `MarkdownEditor` |
| Template | Custom button trigger |
| Tags | `Input` + `Badge` |
| Visuals | Custom upload areas with hover overlay |
| Footer | `Button variant="ghost"` + `Button` |

---

## Behavior

- **Submit**: Shows inline spinner (`border-2 border-white/30 border-t-white rounded-full animate-spin`) + "Creating..." text, then closes dialog after 1500ms
- **Cancel / X / Escape**: Closes without saving
- **After creation**: Closes dialog (returns to Account page)
- **Validation**: Name is required; all other fields optional
- **Loading state**: Create button disabled during submission

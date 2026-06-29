# Rebuild Brief: Create Template Pack Dialog

> Design brief for the Create Template Pack dialog, triggered from Account Settings → Template Packs.
> Minimal creation flow — after save, navigates to the detail page for full editing.

---

## Location

- File: `src/app/components/dialogs/CreateTemplatePackDialog.tsx`
- Triggered from: `UserAccountPage.tsx` → Template Packs section button / dashed card

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| CRD responsive dialog shell | Consistent with Create Space & Create VC |
| Minimal fields (Name, Description, Tags, Cover) | Enough for meaningful creation; details on next page |
| "Save & Continue" button text | Signals navigation to detail page after save |
| No template selector | Not applicable — this IS a template pack |
| Single-flow, no steps | Simple enough for one screen |
| Helper text on each field | CRD style guidance |
| Cover image at 16:9 aspect | Matches card banner proportions in template library |

---

## Dialog Shell (CRD Pattern)

```tsx
<DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden [&>*]:min-w-0">
  <DialogHeader className="px-6 pt-6 pb-4 pr-12 border-b">
    <DialogTitle>Create Template Pack</DialogTitle>
    <DialogDescription>
      Create a new pack, then add templates and details on the next page.
    </DialogDescription>
  </DialogHeader>

  {/* Body — scrollable */}
  <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4 flex flex-col gap-4">
    ...fields...
  </div>

  <DialogFooter className="px-6 py-4 border-t">
    <Button variant="ghost">Cancel</Button>
    <Button>Save & Continue</Button>
  </DialogFooter>
</DialogContent>
```

---

## Form Fields (top to bottom)

### 1. Name *
- `<Input>` with placeholder "e.g. Innovation Workshop Pack"
- Helper: "The name of your template pack."
- Required field

### 2. Description
- `<MarkdownEditor>` with min-height 120px
- Placeholder: "Describe what this pack contains..."
- Helper: "Describe what templates are in this pack and when to use them."

### 3. Tags
- `<Input>` with enter-to-add behavior
- Existing tags shown as `<Badge variant="secondary">` with X remove button
- Placeholder: "Add a tag and press Enter"
- Helper: "Help others discover this pack."

### 4. Cover Image
- Click-to-upload area
- 16:9 aspect ratio (`aspect-video`)
- `border border-input rounded-md`
- Centered `Upload` icon + "Upload cover image" text when empty
- Shows image preview when uploaded
- Helper: "Recommended: 820 × 460 px"

---

## Layout Diagram

```
┌─────────────────────────────────────────────────────────┐
│  DialogHeader                                           │
│  Title: "Create Template Pack"                          │
│  Description: "Create a new pack, then add templates    │
│  and details on the next page."                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Name *           [________________________]            │
│  helper: The name of your template pack.                │
│                                                         │
│  Description      [Markdown Editor         ]            │
│  helper: Describe what templates are in this pack...    │
│                                                         │
│  Tags             [Add a tag and press Enter]           │
│  + badge pills                                          │
│  helper: Help others discover this pack.                │
│                                                         │
│  Cover image                                            │
│  ┌────────────────────────────────────────┐             │
│  │  Upload cover image (16:9 aspect)      │             │
│  └────────────────────────────────────────┘             │
│  helper: Recommended: 820 × 460 px                      │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  DialogFooter                                           │
│           [Cancel]  [Save & Continue]                   │
└─────────────────────────────────────────────────────────┘
```

---

## Component Mapping

| Element | Component |
|---------|-----------|
| Dialog shell | `Dialog`, `DialogContent`, `DialogHeader`, `DialogFooter` |
| Name | `Input` |
| Description | `MarkdownEditor` |
| Tags | `Input` + `Badge` + enter-to-add |
| Cover image | Custom upload area (border-input, aspect-video) |
| Footer | `Button variant="ghost"` + `Button` |

---

## Behavior

- **Validation**: Name is required; all other fields optional
- **Submit**: Shows loading state → navigates to Template Pack detail page
- **Cancel / X / Escape**: Closes without saving
- **After save**: Navigates to `/template-packs/:id` (detail/edit page) where user can add individual templates, reorder, set visibility, etc.

---

## Production Comparison

The old production dialog had only:
- Name (required)
- Description (markdown editor)
- Helper text: "Save the new Template Pack to edit the rest of the details"
- SAVE button (centered, with floppy disk icon)

**New version adds**: Tags, Cover image, better helper text, and uses the CRD dialog pattern with proper header/footer separation.

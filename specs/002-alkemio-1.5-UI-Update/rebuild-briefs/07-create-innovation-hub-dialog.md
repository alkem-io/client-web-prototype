# Rebuild Brief: Create Innovation Hub Dialog (Custom Homepage)

> Design brief for the Create Innovation Hub dialog, triggered from Account Settings → Custom Homepages.
> Uses the CRD (Consistent Responsive Dialog) pattern established for this prototype.
> After save, navigates to the Innovation Hub settings page.

---

## Location

- File: `src/app/components/dialogs/CreateInnovationHubDialog.tsx`
- Triggered from: `UserAccountPage.tsx` → Custom Homepages section "New Page" button / "Create Homepage" button in empty state

---

## Production Screenshot Analysis

The current production dialog shows:
- Title: "Create Innovation Hub" with X close
- Fields: Subdomain* → Name* → Tagline → Description (rich text)
- Helper text: "Save the new Innovation Hub to edit the rest of the details"
- SAVE button (centered, floppy disk icon)

**Note**: The platform calls these "Innovation Hubs" in dialogs but "Custom Homepages" in the Account page. An Innovation Hub is essentially a branded landing page with a custom subdomain that curates spaces.

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| CRD responsive dialog shell | Consistent with Create Space, Create VC, Create Template Pack |
| Subdomain field with inline preview | Unique to this dialog — shows the resulting URL live |
| Name + Tagline + Description | Core identity fields, same pattern as other creation dialogs |
| Tags field added | Consistency with other creation dialogs, helps discoverability |
| Banner image added | Innovation Hubs are very visual — banner is prominent on the landing page |
| "Save & Continue" button text | Signals navigation to settings page after save |
| Single-flow, no steps | Simple enough for one screen |
| Helper text on each field | CRD style guidance |

---

## Dialog Shell (CRD Pattern)

```tsx
<DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden [&>*]:min-w-0">
  <DialogHeader className="px-6 pt-6 pb-4 pr-12 border-b">
    <DialogTitle>Create Innovation Hub</DialogTitle>
    <DialogDescription>
      Set up a branded landing page with a custom subdomain. Add spaces and configure details on the next page.
    </DialogDescription>
  </DialogHeader>

  {/* Body — scrollable */}
  <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4 flex flex-col gap-4">
    ...fields...
  </div>

  <DialogFooter className="px-6 py-4 border-t">
    <Button variant="ghost">Cancel</Button>
    <Button disabled={!isFormValid || isSubmitting}>
      {isSubmitting ? "Saving..." : "Save & Continue"}
    </Button>
  </DialogFooter>
</DialogContent>
```

---

## Form Fields (top to bottom)

### 1. Subdomain *
- `<Input>` with placeholder "e.g. my-hub"
- **Inline URL preview** below input showing: `{value}.alkem.io` (reactive, updates as user types)
- Helper: "This will be the URL of your Innovation Hub."
- Required field
- Validation: lowercase, no spaces, alphanumeric + hyphens only
- Styling for preview: `text-sm text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded`

### 2. Name *
- `<Input>` with placeholder "e.g. VNG Innovation Hub"
- Helper: "The display name of your Innovation Hub."
- Required field

### 3. Tagline
- `<Input>` with placeholder "A short tagline..."
- Helper: "Shown below the name on your landing page."

### 4. Description
- `<MarkdownEditor>` with min-height 120px
- Placeholder: "Describe what this hub is about..."
- Helper: "Explain the purpose of this Innovation Hub. Markdown supported."

### 5. Tags
- `<Input>` with enter-to-add behavior
- Existing tags shown as `<Badge variant="secondary">` with X remove button
- Placeholder: "Add a tag and press Enter"
- Helper: "Help others discover this hub."

### 6. Banner Image
- Click-to-upload area
- 16:9 aspect ratio (`aspect-video`)
- `border border-input rounded-md`
- Centered `ImageIcon` + "Upload banner image" text when empty
- Shows image preview when uploaded, hover overlay with "Change" button
- Helper: "Recommended: 1920 × 480 px. This appears at the top of your hub page."

---

## Layout Diagram

```
┌─────────────────────────────────────────────────────────┐
│  DialogHeader                                           │
│  Title: "Create Innovation Hub"                         │
│  Description: "Set up a branded landing page with a     │
│  custom subdomain..."                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Subdomain *      [________________________]            │
│  preview: my-hub.alkem.io                               │
│  helper: This will be the URL of your Innovation Hub.   │
│                                                         │
│  Name *           [________________________]            │
│  helper: The display name of your Innovation Hub.       │
│                                                         │
│  Tagline          [________________________]            │
│  helper: Shown below the name on your landing page.     │
│                                                         │
│  Description      [Markdown Editor         ]            │
│  helper: Explain the purpose of this Innovation Hub...  │
│                                                         │
│  Tags             [Add a tag and press Enter]           │
│  + badge pills                                          │
│  helper: Help others discover this hub.                 │
│                                                         │
│  Banner image                                           │
│  ┌────────────────────────────────────────┐             │
│  │  Upload banner image (16:9 aspect)     │             │
│  └────────────────────────────────────────┘             │
│  helper: Recommended: 1920 × 480 px                     │
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
| Subdomain | `Input` + reactive URL preview |
| Name / Tagline | `Input` |
| Description | `MarkdownEditor` |
| Tags | `Input` + `Badge` + enter-to-add |
| Banner image | Custom upload area (border-input, aspect-video, hover overlay) |
| Footer | `Button variant="ghost"` + `Button` |

---

## Behavior

- **Validation**: Subdomain AND Name are required → Save button disabled until both filled
- **Subdomain formatting**: Auto-lowercase, strip spaces, allow only `[a-z0-9-]`
- **URL preview**: Updates reactively as subdomain changes, shows `{subdomain}.alkem.io`
- **Submit**: Inline spinner + "Saving..." text, then navigates to `/innovation-hub/{subdomain}/settings`
- **Cancel / X / Escape**: Closes without saving, resets all state after 200ms
- **After save**: Navigates to the Innovation Hub settings page where user can add spaces, configure layout, etc.
- **Capacity**: Account page shows "0/1 Used" — only 1 custom homepage allowed per account

---

## Production Comparison

The old production dialog had:
- Subdomain* (required)
- Name* (required)
- Tagline (optional)
- Description (rich text editor with full toolbar)
- Helper text: "Save the new Innovation Hub to edit the rest of the details"
- SAVE button (centered, floppy disk icon)

**New version adds**: Tags, Banner image, reactive subdomain URL preview, CRD dialog pattern with proper header/footer, "Save & Continue" button text to signal navigation.

---

## Related Pages

- **Innovation Hub landing page**: `/innovation-hub/:slug` — the public-facing page this dialog creates
- **Innovation Hub settings**: `/innovation-hub/:slug/settings` — where user lands after creation (add spaces, configure layout, edit identity)
- **Account page**: `UserAccountPage.tsx` → Custom Homepages section (trigger point)

# Rebuild Brief: Create Virtual Contributor Dialog

> Design brief for the Create VC dialog, triggered from Account Settings → Virtual Contributors.
> Uses single-flow progressive disclosure — NOT the old multi-step wizard.

---

## Location

- File: `src/app/components/dialogs/CreateVCDialog.tsx`
- Triggered from: `UserAccountPage.tsx` → "Add Contributor" button / dashed "Create New Contributor" card

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Single-flow (no steps) | Modern UX, everything on one scrollable page |
| Progressive disclosure | Source-specific config only appears after selection |
| Knowledge source cards (3 options) | Clear visual selection, scannable |
| Identity section first | Name is required; user establishes identity before configuring AI |
| Separator between sections | Visual breathing room |
| Animation on progressive sections | `animate-in fade-in slide-in-from-top-2` — smooth reveal |

---

## Dialog Shell (CRD Pattern)

```tsx
<DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden [&>*]:min-w-0">
  <DialogHeader className="px-6 pt-6 pb-4 pr-12 border-b">
    <DialogTitle>Create a Virtual Contributor</DialogTitle>
    <DialogDescription>
      Set up an AI-powered contributor. Choose a knowledge source, then customize its identity.
    </DialogDescription>
  </DialogHeader>

  {/* Body — scrollable, gap-6 for section spacing */}
  <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4 flex flex-col gap-6">
    ...sections...
  </div>

  <DialogFooter className="px-6 py-4 border-t">
    <Button variant="ghost">Cancel</Button>
    <Button disabled={!isFormValid || isSubmitting}>
      {isSubmitting ? "Creating..." : "Create"}
    </Button>
  </DialogFooter>
</DialogContent>
```

---

## Form Sections

### Section 1: Identity

| Field | Component | Notes |
|-------|-----------|-------|
| Name * | `Input` | "e.g. Research Assistant" |
| Tagline | `Input` | Optional subtitle |
| Description | `MarkdownEditor` min-height 80px | What does this VC do? |
| Avatar | 24×24 (w-24 h-24) upload area | Recommended 410 × 410 px |

### Separator

`<Separator />` between Identity and AI Source.

### Section 2: Knowledge Source Selection *

- Label: "Knowledge source"
- Helper: "What do you want to make available through your Virtual Contributor?"
- 3-column grid of option cards (`grid-cols-1 sm:grid-cols-3 gap-3`)

**Option cards:**

| Option | Icon | Title | Description | Badge |
|--------|------|-------|-------------|-------|
| knowledge | `FileText` | Written knowledge | Provide text-based knowledge in posts or documents | AI Powered by Alkemio |
| space | `Users` | Content of a Space | Use the content from a Space or Subspace you host | AI Powered by Alkemio |
| external | `Cloud` | External AI | Connect an external AI provider via API key | External |

**Card styling:**
- Default: `border-input hover:border-primary/40 hover:bg-accent/30`
- Selected: `border-primary bg-primary/5 ring-1 ring-primary/20`

### Section 3: Source-Specific Config (Progressive Disclosure)

Only one of these appears, based on selection. Each animated in with `animate-in fade-in slide-in-from-top-2 duration-200`.

#### 3a: Written Knowledge
- Label + helper explaining post-based content
- Repeatable post cards (bordered `border border-input rounded-lg`, with title input + markdown content editor)
- Each post has X button to remove (if >1 post)
- Two action buttons at bottom:
  - "Add Post" (`Button variant="outline" size="sm"`, with `Plus` icon)
  - "Add Document" (`Button variant="outline" size="sm"`, with `FilePlus` icon)

#### 3b: Content of a Space
- `<Select>` dropdown with `SelectGroup` headers per space
- Each space shows as a `SelectLabel` (uppercase, small) + `SelectItem`
- Subspaces nested under each space as indented `SelectItem` (with `pl-6`)
- All spaces and subspaces always visible in the dropdown (not conditional)
- Helper: "Choose from Spaces and Subspaces that you host."

#### 3c: External AI
- Provider selector: `OpenAI` / `OpenAI Assistant` (Select component)
- API Key input (`type="password"`, placeholder `sk-...`)
- Helper: "Your key is encrypted and stored securely."
- No model name input — kept minimal

---

## Component Mapping

| Element | Component |
|---------|-----------|
| Dialog shell | `Dialog`, `DialogContent`, `DialogHeader`, `DialogFooter` |
| Text inputs | `Input` |
| Markdown | `MarkdownEditor` |
| Source cards | Custom `<button>` with cn() conditional styling |
| Space picker | `Select`, `SelectContent`, `SelectItem` |
| Post cards | Custom bordered container |
| Separator | `Separator` |
| Footer | `Button variant="ghost"` + `Button` |

---

## Behavior

- **Validation**: Name AND knowledge source required → Create button disabled until both filled
- **Submit**: Inline spinner (`border-2 border-white/30 border-t-white rounded-full animate-spin`) + "Creating..." text, disabled during submission, closes after 1500ms
- **Cancel / X / Escape**: Closes, resets all state after 200ms delay
- **State reset**: All fields cleared on close (name, tagline, description, avatar, source selection, posts, space, apiKey)
- **After creation**: Returns to Account page (VC appears in list)
- **Footer button**: `disabled={!isFormValid || isSubmitting}` — guards both incomplete form and in-flight submission

---

## Superseded Files (can be deleted)

The old multi-step approach lives in `src/app/components/dialogs/vc-steps/`:
- `VCStep1.tsx`
- `VCStep2Knowledge.tsx`
- `VCStep2Space.tsx`
- `VCStep2External.tsx`

These are unused and should be removed.

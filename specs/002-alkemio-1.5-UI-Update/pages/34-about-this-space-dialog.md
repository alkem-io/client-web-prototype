# Page 34: About This Space Dialog

> **Route**: Overlay on `/space/[space-slug]` (any tab)  
> **Access**: All space members (read); Admins/Facilitators (edit via pencil icons)  
> **Ref**: [master-brief.md](../master-brief.md) for component mapping  
> **Trigger**: "ABOUT THIS SPACE" button in Space Home left sidebar

---

## Current Layout

The About This Space dialog is a vertically scrollable modal presenting the space's identity, purpose, community context, guidelines, references, and host information. It appears as a centered overlay on the space page.

```
┌──────────────────────────────────────────────────────────┐
│                      Dark Overlay                        │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  "The Sandbox"                               [X]   │ │
│  │  Tagline text (italic, muted)                       │ │
│  ├─────────────────────────────────────────────────────┤ │
│  │  ┌──────────────────────┐  ┌──────────────────────┐ │ │
│  │  │  Space Card Preview  │  │  Leads               │ │ │
│  │  │  (banner + desc +    │  │  [Avatar] Name       │ │ │
│  │  │   lead avatar +      │  │           Location   │ │ │
│  │  │   location + members)│  │                      │ │ │
│  │  └──────────────────────┘  └──────────────────────┘ │ │
│  │                                                     │ │
│  │  ⊕ Why                                       [✎]   │ │
│  │  "this is the description of why"                   │ │
│  │                                                     │ │
│  │  ⊕ Who                                       [✎]   │ │
│  │  "this is who can join us"                          │ │
│  │                                                     │ │
│  │  United in Knowledge: Key Guidelines ...      [✎]   │ │
│  │  ┌─────────────────────────────────────────┐        │ │
│  │  │ Community Guidelines for The Sandbox    │        │ │
│  │  │ Introduction                            │        │ │
│  │  │ Welcome to The Sandbox!                 │        │ │
│  │  │ Key Guidelines                          │        │ │
│  │  │ Respect and Empathy                     │        │ │
│  │  │                        [Read more]      │        │ │
│  │  └─────────────────────────────────────────┘        │ │
│  │                                                     │ │
│  │  References                                  [✎]   │ │
│  │  [🌐] New reference                                 │ │
│  │       asdflasdf                                     │ │
│  │                                                     │ │
│  │  Hosted by                                          │ │
│  │  [Avatar] Jeroen Nijkamp                            │ │
│  │           's-gravenhage                             │ │
│  │  ✉ The hosts are responsible for the content...     │ │
│  │    please reach out.                                │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### Key structural elements:
- **Dialog header**: Space name as title, tagline/description as subtitle (italic, muted text), close X button top-right
- **Two-column top section** (~60/40 split):
  - **Left — Space Card Preview**: Compact card with banner image, space description text (with "Read more" truncation), lead avatar + name + location pin, member count icon
  - **Right — Leads**: Section listing space lead(s) with avatar, name, and location
- **Why section**: Globe/target icon + "Why" heading + edit pencil (admin only) + description text
- **Who section**: Globe/people icon + "Who" heading + edit pencil (admin only) + description text
- **Guidelines section**: Custom title heading + edit pencil (admin only) + card/container with rendered markdown content (title, headings, body text) + "Read more" link. "Read more" opens a separate dialog with full guidelines text
- **References section**: "References" heading + edit pencil (admin only) + list of reference items, each with globe icon + title + URL/description
- **Hosted by section**: Host avatar + name + location + email envelope icon with helper text ("The hosts are responsible for the content of the Space. Any questions or comments, please reach out."). Email icon opens an in-app dialog to compose a message to the host's email
- **Scrolling**: Header (title + tagline) stays fixed at top; body content scrolls vertically

---

## Element Inventory

### Dialog Structure
| Element | Current Component | New Component (shadcn) | Notes |
|---------|------------------|----------------------|-------|
| Modal container | `DialogWithGrid` | `Dialog` (shadcn) | Centered, max-w-2xl |
| Dark overlay | MUI Backdrop | `DialogOverlay` | Semi-transparent |
| Dialog header | Custom | `DialogHeader` + `DialogTitle` + `DialogDescription` | Title = space name, description = tagline |
| Close button | `IconButton` X | `DialogClose` or `Button` variant="ghost" | Top-right X |
| Scrollable body | Custom scroll container | `ScrollArea` (shadcn) or `overflow-y-auto` | Fixed header, scrollable content |

### Space Card Preview (Left Column)
| Element | Current Component | New Component (shadcn) | Notes |
|---------|------------------|----------------------|-------|
| Card container | `Paper` / custom | `Card` (shadcn) | Compact preview card |
| Banner image | `<img>` | `<img>` with `object-cover rounded-t` | Space banner thumbnail |
| Card edit icon | `IconButton` (pencil + user) | `Button` variant="ghost" size="icon" | Two small icons top-right of card |
| Description text | `Typography` | `CardContent` + Tailwind `text-sm` | Truncated with "Read more" |
| Lead avatar | `Avatar` (MUI) | `Avatar` (shadcn) | Small, inline with name |
| Lead name | `Typography` | `span` + Tailwind | Name + location |
| Location pin | MUI icon | Lucide `MapPin` | Small, muted |
| Member count | Icon + count | Lucide `Users` + count text | "16 members" |

### Leads Section (Right Column)
| Element | Current Component | New Component (shadcn) | Notes |
|---------|------------------|----------------------|-------|
| Section heading | `Typography` | `h3` + Tailwind `font-semibold` | "Leads" |
| Lead item | Custom list item | `Avatar` + name + location | Each lead listed vertically |
| Lead avatar | `Avatar` (MUI) | `Avatar` (shadcn) | Medium size |
| Lead name | `Typography` | `span` + Tailwind `font-medium` | Full name |
| Lead location | `Typography` | `span` + Tailwind `text-muted-foreground text-sm` | City/region |

### Why Section
| Element | Current Component | New Component (shadcn) | Notes |
|---------|------------------|----------------------|-------|
| Section container | Custom | `div` with border-bottom or `Separator` | Stacked section |
| Icon | MUI icon (globe/target) | Lucide `Target` or `Globe` | Left of heading |
| Heading | `Typography` h6 | `h3` + Tailwind `font-semibold` | "Why" |
| Edit button | `IconButton` pencil | `Button` variant="ghost" size="icon" + Lucide `Pencil` | Admin/Facilitator only |
| Body text | `Typography` body | `p` + Tailwind `text-muted-foreground` | Rich text / markdown rendered |

### Who Section
| Element | Current Component | New Component (shadcn) | Notes |
|---------|------------------|----------------------|-------|
| Section container | Custom | `div` with border-bottom or `Separator` | Same pattern as Why |
| Icon | MUI icon (people/globe) | Lucide `Users` or `Globe` | Left of heading |
| Heading | `Typography` h6 | `h3` + Tailwind `font-semibold` | "Who" |
| Edit button | `IconButton` pencil | `Button` variant="ghost" size="icon" + Lucide `Pencil` | Admin/Facilitator only |
| Body text | `Typography` body | `p` + Tailwind `text-muted-foreground` | Rich text / markdown rendered |

### Guidelines Section
| Element | Current Component | New Component (shadcn) | Notes |
|---------|------------------|----------------------|-------|
| Section container | Custom | `div` + `Card` inner container | Distinct visual block |
| Custom title | `Typography` h6 | `h3` + Tailwind `font-semibold` | User-defined title (e.g. "United in Knowledge: Key Guidelines for Success") |
| Edit button | `IconButton` pencil | `Button` variant="ghost" size="icon" + Lucide `Pencil` | Admin/Facilitator only |
| Guidelines card | `Paper` / custom | `Card` (shadcn) + `CardContent` | Rendered markdown with headings + body |
| Bold text | `<strong>` | `<strong>` | Bold headings in markdown |
| "Read more" link | `Button` text / link | `Button` variant="link" | Opens separate dialog with full guidelines |
| Full guidelines dialog | Nested `Dialog` | `Dialog` (shadcn) nested | Opened on top of About dialog |

### References Section
| Element | Current Component | New Component (shadcn) | Notes |
|---------|------------------|----------------------|-------|
| Section heading | `Typography` h6 | `h3` + Tailwind `font-semibold` | "References" |
| Edit button | `IconButton` pencil | `Button` variant="ghost" size="icon" + Lucide `Pencil` | Admin/Facilitator only |
| Reference item | Custom list item | `div` flex row | Icon + title + description |
| Reference icon | MUI globe icon | Lucide `Globe` | Left of title, in circle bg |
| Reference title | `Typography` | `span` + Tailwind `font-medium` | Link title |
| Reference description | `Typography` | `span` + Tailwind `text-muted-foreground text-sm` | URL or description text |

### Hosted By Section
| Element | Current Component | New Component (shadcn) | Notes |
|---------|------------------|----------------------|-------|
| Section heading | `Typography` h6 | `h3` + Tailwind `font-semibold` | "Hosted by" |
| Host avatar | `Avatar` (MUI) | `Avatar` (shadcn) | Medium size |
| Host name | `Typography` | `span` + Tailwind `font-medium` | Full name |
| Host location | `Typography` | `span` + Tailwind `text-muted-foreground text-sm` | City/region |
| Email icon | MUI `Mail` icon | Lucide `Mail` | Opens compose dialog |
| Helper text | `Typography` body2 | `p` + Tailwind `text-sm text-muted-foreground` | "The hosts are responsible..." |
| Contact dialog | Nested `Dialog` | `Dialog` (shadcn) nested | Email compose dialog on top |

---

## Interaction Details

### Edit Pencil Icons (Admin/Facilitator Only)
- Pencil icons appear next to Why, Who, Guidelines, and References sections
- Clicking opens an inline edit mode or navigates to the corresponding Space Settings section
- Non-admin users do not see pencil icons

### "Read more" on Guidelines
- Truncates guidelines content to ~5-6 lines in the card
- Clicking "Read more" opens a **new dialog on top** of the About dialog showing full guidelines markdown
- Back/close on guidelines dialog returns to the About dialog

### "Reach out" / Contact Host
- Clicking the mail icon next to "Hosted by" opens a **compose dialog on top** of the About dialog
- Dialog allows sending a message to the host's email address
- This is an in-app dialog (not external mailto)

### Space Card Preview
- The card in the top-left mirrors the space's public card (same component used on Explore Spaces page)
- Small edit icons (pencil, user) in top-right of card — admin only

### Scrolling
- Dialog header (space name + tagline) remains fixed/sticky at top
- All section content below scrolls vertically
- Dialog has a max-height (e.g. `max-h-[85vh]`) to prevent full-screen takeover

---

## Prototype Status

❌ **NOT BUILT** — No dedicated About This Space dialog component exists in the prototype yet.

**Related components:**
- `SpaceSidebar.tsx` — Contains the "About this Space" trigger button
- `SpaceSettingsAbout.tsx` — Settings page for editing the same data (What/Why/Who/Tags/References)
- `SubspaceSidebar.tsx` — Has similar "About this Subspace" trigger

**New component needed:** `AboutThisSpaceDialog.tsx`

---

## shadcn Components Required

| Component | Usage |
|-----------|-------|
| `Dialog` / `DialogContent` / `DialogHeader` / `DialogTitle` / `DialogDescription` / `DialogClose` | Main modal + nested dialogs (guidelines, contact) |
| `ScrollArea` | Scrollable dialog body |
| `Card` / `CardContent` | Space card preview, guidelines card |
| `Avatar` / `AvatarImage` / `AvatarFallback` | Lead avatars, host avatar |
| `Button` | Edit pencil icons (ghost), "Read more" (link), close (ghost) |
| `Separator` | Between sections |
| `Badge` | Member count (optional) |
| `Tooltip` | On edit icons, mail icon |

---

## Visual Design Notes

- **Section pattern**: Each content section (Why, Who, Guidelines, References, Hosted by) follows the same layout: icon + heading + optional edit pencil on the right, body content below. Separated by subtle dividers or spacing.
- **Color**: Dialog background white/card. Section headings use foreground color. Body text uses `text-muted-foreground`. Icons in section headings are muted.
- **Typography**: Space name — `text-xl font-semibold`. Tagline — `text-sm text-muted-foreground italic`. Section headings — `text-base font-semibold`. Body text — `text-sm`.
- **Spacing**: Consistent `space-y-6` between sections. Internal section spacing `space-y-2`.
- **Width**: `max-w-2xl` (matches dialog sizing conventions used across other briefs).
- **Edit icons**: Small (16px), ghost variant, only rendered when user has admin/facilitator role.

---

## Data Model Notes

This dialog displays read-only views of data that is edited in Space Settings → About:
- **Space name + tagline**: From space profile
- **Space card preview**: Banner image, description, lead info, member count — same data as Space Card component
- **Why / Who**: Rich text fields from space context
- **Guidelines**: Title + markdown body from space context
- **References**: Array of `{title, url}` from space profile
- **Hosted by**: Space host user(s) — avatar, name, location, email

---

## Acceptance Criteria

- [ ] Dialog opens when "ABOUT THIS SPACE" sidebar button is clicked
- [ ] Dialog displays space name as title, tagline as subtitle
- [ ] Space card preview shows banner, description, lead avatar, member count
- [ ] Leads section shows all space leads with avatar + name + location
- [ ] Why and Who sections render rich text content with appropriate icons
- [ ] Guidelines section shows truncated content with "Read more" opening a nested dialog
- [ ] References section lists all references with globe icon + title + description
- [ ] Hosted by section shows host info with contact envelope icon
- [ ] Contact envelope opens an in-app compose dialog (nested on top)
- [ ] Edit pencil icons only visible to Admin/Facilitator users
- [ ] Dialog body scrolls; header stays fixed
- [ ] Close button (X) dismisses the dialog
- [ ] Responsive: dialog fills more width on mobile, sections stack vertically

# Visual Reference: Enhanced Dashboard Spaces Overview

**For**: Designers creating Figma mockups and developers validating layout

---

## 1. Full Page Layout (Desktop)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Header (unchanged)                                                  │
├────────────┬─────────────────────────────────────────────────────────┤
│            │                                                         │
│  Sidebar   │  ENHANCED DASHBOARD NORMAL VIEW                        │
│  (toggle   │                                                         │
│   off)     │  ┌────────────────────────────────────────────────┐    │
│            │  │ MY PINNED SPACES                              │    │
│            │  │ [Card 1] [Card 2] [Card 3] [PlaceHolder]     │    │
│            │  └────────────────────────────────────────────────┘    │
│            │                                                         │
│            │  ┌────────────────────────────────────────────────┐    │
│            │  │ MY RECENT SPACES                              │    │
│            │  │ [Card 1] [Card 2] [Card 3] [Card 4]          │    │
│            │  └────────────────────────────────────────────────┘    │
│            │                                                         │
│            │  ┌────────────────────────────────────────────────┐    │
│            │  │ SPACES I LEAD & ADMINISTER                    │    │
│            │  │ [Card 1] [Card 2] [Card 3] [Card 4]          │    │
│            │  │              [Show More]                      │    │
│            │  └────────────────────────────────────────────────┘    │
│            │                                                         │
│            │  ┌────────────────────────────────────────────────┐    │
│            │  │ SPACES I HOST                                 │    │
│            │  │ [Card 1] [Card 2]                            │    │
│            │  └────────────────────────────────────────────────┘    │
│            │  (Note: no Show More if ≤4)                           │
│            │                                                         │
│            │  ┌────────────────────────────────────────────────┐    │
│            │  │ SPACES WITH MOST ACTIVITY                     │    │
│            │  │ [Card 1] [Card 2] [Card 3] [Card 4]          │    │
│            │  └────────────────────────────────────────────────┘    │
│            │                                                         │
├────────────┴─────────────────────────────────────────────────────────┤
│ Footer (unchanged)                                                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Row Details & Spacing

### Row Container (General)
```
Row Title (text-lg font-semibold)
[gap-y: 1rem = 16px]
┌─────────────────────────────────────────────┐
│ Grid: grid-cols-4 gap-4                     │
│ [Card 1] [Card 2] [Card 3] [Card 4]        │
└─────────────────────────────────────────────┘
[gap-y: 8rem = 128px] ← Between rows
```

### Row 1: Pinned Spaces (Always Shows)
```
MY PINNED SPACES
┌─────────────────────────────────────────────┐
│ [Card]    [Card]    [Card]    [Placeholder] │
│                                              │
│ (Always 4 slots: real + placeholder)        │
│ Placeholder shows: [Pin Icon] "Pin a space" │
└─────────────────────────────────────────────┘

Example 2/4 Pinned:
[Real Card] [Real Card] [+] [+]

Example 0/4 Pinned:
[+] [+] [+] [+]
```

### Row 2: Recent Spaces (Conditional - max 4)
```
MY RECENT SPACES
┌─────────────────────────────────────────────┐
│ [Card 1] [Card 2] [Card 3]                 │
│                                              │
│ (No Show More; hidden if 0 items)           │
└─────────────────────────────────────────────┘

Alternative layouts:
[Card 1] [Card 2]          (2 items)
[Card 1]                    (1 item)
(Hidden)                    (0 items)
```

### Row 3 & 4: Lead/Admin & Host (Conditional + Show More)
```
SPACES I LEAD & ADMINISTER
┌─────────────────────────────────────────────┐
│ [Card 1] [Card 2] [Card 3] [Card 4]        │
│                 [Show More: 12 Spaces]     │
│                                              │
│ (First 4 shown; if >4, show button)         │
└─────────────────────────────────────────────┘

If ≤4 items:
[Card 1] [Card 2]          (no Show More button)

If 0 items:
(Hidden)
```

### Row 5: Most Activity (max 4, no Show More)
```
SPACES WITH MOST ACTIVITY
┌─────────────────────────────────────────────┐
│ [Card 1] [Card 2] [Card 3] [Card 4]        │
│                                              │
│ (No Show More; hidden if 0 items)           │
└─────────────────────────────────────────────┘
```

---

## 3. Space Card Anatomy

### Standard Space Card
```
┌───────────────────────────────────────────┐
│  [Banner Image]                           │
│  ┌─────────────────────────────────────┐  │
│  │   (aspect 1536x256 / 6:1)           │  │  height: ~160px
│  │                                     │  │
│  └─────────────────────────────────────┘  │
├───────────────────────────────────────────┤
│  Space Name                           │    │  (centered, semibold)
│  tagline or description               │    │  (centered, muted, 1-2 lines)
│  👤 2  🏷 tags  🔒                    │    │  (if private, badges)
├───────────────────────────────────────────┤
│  [Optional: subspace preview row]     │    │
│  [Sub 1] [Sub 2] [Sub 3] [Sub 4]     │    │
└───────────────────────────────────────────┘

Card dimensions:
- Width: Responsive (4 cols desktop: ~22% width)
- Gap: 1rem (16px) between cards
- Mobile: 2 cols (50% width - gap/2)
- Tablet: 3 cols (33% width - gap/3)
- Desktop: 4 cols (25% width - gap/4)
```

### Placeholder Card (NEW)
```
┌───────────────────────────────────────────┐
│                                           │
│        [Plus Icon]                        │  height: 160px (match card)
│        "Pin a space"                      │  (centered, muted text)
│                                           │
│  border: 2px dashed border-muted/30      │
│  hover: border-muted/50, bg-muted/50     │
│  cursor: pointer                         │
└───────────────────────────────────────────┘

- Same height/width as regular SpaceCard
- Dashed border (not solid)
- Plus icon + text centered
- Light/muted styling (not prominent)
- Hover state: slightly darker border, background tint
```

---

## 4. Responsive Breakpoints

### Desktop (≥1024px / lg)
```
4 Columns
[Card] [Card] [Card] [Card]
[Card] [Card] [Card] [Card]
```

### Tablet (≥640px / sm, <1024px)
```
3 Columns
[Card] [Card] [Card]
[Card] [Card]
```

### Mobile (<640px)
```
2 Columns
[Card] [Card]
[Card] [Card]
[Card]
```

### Very Small Mobile (<400px)
```
1 Column (optional; fallback)
[Card]
[Card]
```

---

## 5. Show More Modal Layout

### Modal Structure
```
┌─────────────────────────────────────────────────────────┐
│  × (close button)      Spaces I Lead & Administer       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Card] [Card] [Card] [Card]                           │
│  [Card] [Card] [Card] [Card]                           │
│  [Card] [Card]                                         │
│                                                         │
│  (scrollable, max-h-[60vh] overflow-y-auto)           │
└─────────────────────────────────────────────────────────┘

Modal:
- max-w-2xl (42rem / 672px)
- Centered on screen
- Backdrop: bg-black/50
- Title: Bold, 20px
- Body: Scrollable grid
- Responsive grid (2/3/4 cols same as main)
```

### Show More Button
```
                    [Show More: 12 Spaces]
                    
Button Style:
- variant: outline
- size: default or sm
- Label: "Show More: [N] Spaces"
- Margin: mt-4 (1rem above)
- Centered horizontally
```

---

## 6. Browse & Pin Modal Layout

### Modal Structure
```
┌─────────────────────────────────────────────────────────┐
│  × (close button)      Pin a Space                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Card    [Card    [Card    [Card                      │
│   📌]      📌]      📌]      📌]                        │
│                                                         │
│  [Card    [Card    [Card    [Card                      │
│   📌]      📌]      📌]      📌]                        │
│                                                         │
│  (scrollable, max-h-[60vh] overflow-y-auto)           │
└─────────────────────────────────────────────────────────┘

Pin Icon:
- Position: absolute top-2 right-2 on card
- Icon: Pin or Heart from lucide-react
- On hover: Show tooltip "Pin this space"
- Click: Pin space, update Row 1 (localStorage)
```

---

## 7. Placeholder Card Click Flow

### Flow Diagram
```
User sees Row 1 with placeholders
              ↓
User clicks placeholder card
              ↓
Browse & Pin modal opens
              ↓
User sees unpinned spaces
              ↓
User clicks Pin icon on card
              ↓
Space pinned (localStorage update)
              ↓
Modal closes (or stays open)
              ↓
Row 1 updates: placeholder → real card
```

---

## 8. Row Visibility Rules (Decision Tree)

```
START: User lands on dashboard (Normal view, not Activity)
      ↓
   ┌──────────────────────────────────────────────┐
   │ Calculate row data with deduplication logic   │
   └──────────────────────────────────────────────┘
      ↓
   ┌──────────────────────────────────────────────┐
   │ Row 1: Pinned Spaces                         │
   │ ├─ ALWAYS render (even if all placeholders)  │
   │ └─ Show: 4 slots (real + placeholder mix)    │
   └──────────────────────────────────────────────┘
      ↓
   ┌──────────────────────────────────────────────┐
   │ Row 2: Recent Spaces                         │
   │ ├─ IF count > 0: render                      │
   │ └─ ELSE: skip                                │
   └──────────────────────────────────────────────┘
      ↓
   ┌──────────────────────────────────────────────┐
   │ Row 3: Lead & Administer                     │
   │ ├─ IF count > 0: render                      │
   │ │  ├─ Show: first 4 items                    │
   │ │  └─ IF count > 4: add Show More button     │
   │ └─ ELSE: skip                                │
   └──────────────────────────────────────────────┘
      ↓
   ┌──────────────────────────────────────────────┐
   │ Row 4: Host Spaces                           │
   │ ├─ IF count > 0: render                      │
   │ │  ├─ Show: first 4 items                    │
   │ │  └─ IF count > 4: add Show More button     │
   │ └─ ELSE: skip                                │
   └──────────────────────────────────────────────┘
      ↓
   ┌──────────────────────────────────────────────┐
   │ Row 5: Most Activity                         │
   │ ├─ IF count > 0: render                      │
   │ │  └─ Show: first 4 items (no Show More)     │
   │ └─ ELSE: skip                                │
   └──────────────────────────────────────────────┘
      ↓
   END: Dashboard rendered
```

---

## 9. Spacing & Sizing Reference

### Vertical Spacing (Tailwind)
```
Between rows:           space-y-8 (32px)
Within row title/grid:  mb-4 (16px)
Grid gap:              gap-4 (16px)
Show More margin top:   mt-4 (16px)
```

### Horizontal Sizing
```
Max content width:      Max-w varies per Tailwind, typically container mx-auto
Grid columns:
  - Mobile:   grid-cols-2
  - Tablet:   sm:grid-cols-3
  - Desktop:  lg:grid-cols-4
Grid gap:      gap-4 (16px)
```

### Typography
```
Row Title:
  - Font size:  18px / text-lg
  - Font weight: Semibold / font-semibold
  - Color:      Foreground / var(--foreground)
  - Margin:     0 0 16px 0 (mb-4)

SpaceCard text: (unchanged from existing)
```

---

## 10. Color & Styling

### Row Title
```
Color: var(--card-foreground) or var(--foreground)
Weight: semibold
Size: 18px / text-lg
```

### Grid Backgrounds
```
No special background per row
Rows separated by space (space-y-8)
Optional: light alternating row backgrounds (if design calls for it)
```

### Placeholder Card
```
Border: 2px dashed border-muted-foreground/30
Border hover: border-muted-foreground/50
Background: transparent
Background hover: bg-muted/50
Text color: text-muted-foreground
Icon color: text-muted-foreground/50
```

### Show More Button
```
Variant: outline
Size: default (or sm if compact preferred)
Color: Inherits from button outline style
```

---

## 11. Error & Empty States

### All Rows Empty (New User)
```
┌─────────────────────────────────────────┐
│ MY PINNED SPACES                        │
│ [+] [+] [+] [+]                        │  (4 placeholders)
├─────────────────────────────────────────┤
                                            (Rows 2-5 hidden)
└─────────────────────────────────────────┘

Optional CTA banner:
┌─────────────────────────────────────────┐
│ 🌱 Get started by exploring spaces      │
│            [Browse Spaces →]             │
└─────────────────────────────────────────┘
```

### Mixed Empty Rows
```
┌─────────────────────────────────────────┐
│ MY PINNED SPACES                        │
│ [Card] [+] [+] [+]                     │  (1 real, 3 placeholders)
├─────────────────────────────────────────┤
│ MY RECENT SPACES                        │
│ [Card] [Card]                          │
├─────────────────────────────────────────┤
(Row 3 hidden - 0 lead spaces)
(Row 4 hidden - 0 host spaces)
│ SPACES WITH MOST ACTIVITY               │
│ [Card] [Card] [Card]                   │
└─────────────────────────────────────────┘
```

---

## 12. Print Reference (Measurements)

Using Figma-friendly measurements (if needed):

```
Card Height: 160px (aspect 1:1 square)
Card Width: Responsive, see grid above

Row Spacing: 32px (large)
Grid Gap: 16px (medium)
Title Margin: 16px (medium)

Modal Width: 672px (max-w-2xl)
Modal Padding: 24px (p-6)

Placeholder Icon: 32px (w-8 h-8)
Pin Icon Overlay: 16px (w-4 h-4)
```

---

## 13. Interaction States

### Hover States
```
Space Card:
  - Scale: subtle (1.02)
  - Shadow: elevated (existing SpaceCard behavior)
  - Cursor: pointer

Placeholder Card:
  - Border: darker dashed (border-muted/50)
  - Background: muted tint (bg-muted/50)
  - Cursor: pointer

Show More Button:
  - Outlined, standard button hover (Tailwind default)
  - Cursor: pointer
```

### Active States
```
Modal: Backdrop overlay (bg-black/50)
Card Click: Navigate (no visual change needed)
```

---

## 14. Accessibility Notes

- [ ] All interactive elements have `role` attributes
- [ ] Placeholders have descriptive text ("Pin a space")
- [ ] Icons paired with text (no icon-only buttons without labels)
- [ ] Modal has focus management (auto-focus close button)
- [ ] Color contrast meets WCAG AA minimum
- [ ] Keyboard navigation: Tab through cards, Enter to select
- [ ] Screen readers: Announce row titles, space count, placeholder purpose

---

**Ready for Figma**: Use this reference to create responsive mockups covering all 3 breakpoints (mobile, tablet, desktop) and all edge cases.

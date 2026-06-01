# Page 39: Innovation Hub (Custom Landing Page)

> **Route**: `/innovation-hub/[hub-slug]`  
> **Access**: Public (visible to all; settings restricted to hub owner/admin)  
> **Ref**: [master-brief.md](../master-brief.md) for component mapping

---

## Purpose

A custom, branded landing page for a curated collection of spaces. The hub owner manually selects which spaces appear. Functions as a white-label homepage for organizations (e.g., VNG Innovation Hub) to showcase their spaces to visitors.

---

## Current Layout

```
┌──────────────────────────────────────────────────────────────┐
│  Global Header (search, messaging, notifications, apps, user)│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │           HERO BANNER (full-width)                    │    │
│  │   Custom background image (e.g. city skyline)         │    │
│  │                                                       │    │
│  │        ┌──────────┐                                   │    │
│  │        │ Hub Logo │  (centered, large)                │    │
│  │        └──────────┘                                   │    │
│  │                                                       │    │
│  │         Hub Name (centered, h1)                       │    │
│  │         Tagline (centered, subtitle)                  │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Description Block (rich text)                    ⚙   │    │
│  │  Bold keywords, italic text, normal copy.             │    │
│  │  Multiple paragraphs supported.                       │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  "[Hub Name] Spaces"  (section title)                 │    │
│  │                                                       │    │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐        │    │
│  │  │ Space Card │ │ Space Card │ │ Space Card │        │    │
│  │  │ Banner img │ │ Banner img │ │ Banner img │        │    │
│  │  │ [tags]     │ │ [tags] +N  │ │ [badge]    │        │    │
│  │  │ Name       │ │ Name       │ │ Name       │        │    │
│  │  │ Description│ │ Description│ │ Description│        │    │
│  │  │ Led by: 👤 │ │ Led by: 👤 │ │ Led by: 👤 │        │    │
│  │  └────────────┘ └────────────┘ └────────────┘        │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  🌿  "Interested in collaborating in other Spaces?    │    │
│  │       Click here to see them all on the universal     │    │
│  │       Alkemio homepage."                              │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  Footer (Terms, Privacy, Security, Logo, Support, About,     │
│          Language)                                            │
└──────────────────────────────────────────────────────────────┘
```

---

## Element Inventory

### Hero Banner
| Element | Current Component | New Component (shadcn) | Notes |
|---------|------------------|----------------------|-------|
| Banner container | Custom full-width div | Tailwind `relative w-full` | Full-bleed, ~200px height |
| Background image | `<img>` / CSS background | `<img>` with `object-cover` | Custom uploaded image, dark overlay for contrast |
| Hub logo | MUI `Avatar` (large) | `Avatar` (shadcn) size-xl | Centered, ~120px, bordered |
| Hub name | `Typography` h4 | Tailwind `text-2xl font-bold text-white` | Centered below logo |
| Tagline | `Typography` subtitle | Tailwind `text-base text-white/80 italic` | Centered below name |

### Description Block
| Element | Current Component | New Component (shadcn) | Notes |
|---------|------------------|----------------------|-------|
| Container | `Paper` / `Card` | `Card` (shadcn) | Centered, max-width content area |
| Rich text | Custom markdown/HTML | Prose class or `dangerouslySetInnerHTML` | Supports bold, italic, links |
| Settings gear | `IconButton` | `Button` variant ghost + Lucide `Settings` icon | Top-right corner, admin-only |

### Spaces Section
| Element | Current Component | New Component (shadcn) | Notes |
|---------|------------------|----------------------|-------|
| Section title | `Typography` h5 | Tailwind `text-xl font-semibold` | "[Hub Name] Spaces" |
| Grid | Custom grid | Tailwind `grid grid-cols-3 gap-6` | 3-col desktop, 2-col tablet, 1-col mobile |
| Space card | `ContributeCard` | `Card` (shadcn) | **Same Space Card used on Dashboard & Explore** |
| Tags/badges | `Chip` (MUI) | `Badge` (shadcn) | Shown on card banner area, max 2-3 visible + "+N" overflow |
| "Inactive" badge | `Chip` with status | `Badge` variant destructive/outline | Overlay on top-right of banner |
| "Led by" row | Custom avatar row | `AvatarGroup` custom + Tailwind | Row of small avatars + "+N" count |

### CTA Banner
| Element | Current Component | New Component (shadcn) | Notes |
|---------|------------------|----------------------|-------|
| Container | Custom div | Tailwind card with green/emerald accent bg | Full-width inside content area |
| Icon | Custom leaf/sprout | Lucide `Sprout` or `Leaf` | Left-aligned decorative |
| Text | `Typography` | Tailwind `text-base font-medium` | Link text to universal homepage |
| Link | `<a>` / Router Link | `Link` component | Navigates to `/spaces` or `/` |

### Footer
| Element | Current Component | New Component (shadcn) | Notes |
|---------|------------------|----------------------|-------|
| Container | Custom footer | Tailwind flex centered | Standard platform footer |
| Links | `Link` | Tailwind anchor styled | Terms, Privacy, Security, Support, About |
| Logo | Image | Alkemio logo SVG | Centered between link groups |
| Language selector | Custom dropdown | `Select` (shadcn) or `DropdownMenu` | Globe icon + "Language" |

---

## Key Interactions

| Action | Result |
|--------|--------|
| Click space card | Navigate to `/space/[space-slug]` |
| Click settings gear (admin) | Open hub settings panel/page |
| Click CTA link | Navigate to universal Alkemio homepage (`/spaces`) |
| Hover space card | Subtle elevation/shadow increase |
| Click tag/badge on card | No action (decorative/informational) |

---

## Design Notes

- The hero banner is the primary branding area — the hub owner uploads a custom image and logo
- The description supports rich text: bold, italic, links — allowing the hub owner to describe their mission
- Space cards use the **same component** as dashboard/explore but display additional metadata: tags, "Led by" avatars, and status badges
- The CTA banner is always visible and links visitors to the broader Alkemio platform
- The page is public-facing (no auth required to view), making it suitable as an entry point for organizations
- Settings gear is only visible to hub admins
- Responsive: 3-col → 2-col → 1-col grid for space cards

---

## Visual Requirements

- Full-bleed hero banner with dark overlay (40-60% opacity) for text contrast
- Card-based content sections with consistent spacing
- The description block should feel like a "welcome message" card
- Green/emerald accent for the CTA banner to make it inviting
- Clean, minimal footer consistent with platform-wide footer

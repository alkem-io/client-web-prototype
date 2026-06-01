# Page 36: Virtual Contributor Profile

> **Route**: `/vc/:vcSlug`  
> **Access**: All platform users (public view); owner/admin sees settings button + private knowledge base  
> **Ref**: [master-brief.md](../master-brief.md) for component mapping  
> **Current source**: N/A (new page)

---

## Design Context

This page presents the public profile of a **Virtual Contributor (VC)** — an AI-powered bot that can participate in spaces, answer questions, and generate content within Alkemio. The page communicates the VC's identity, capabilities, AI transparency information, and governance context.

### Key Differences from User Profile
- **No banner** — same as updated user profile (avatar + name inline on white background)
- **No activity feed/tabs** — replaced by structured info cards (Functionality, AI Engine, Monitoring)
- **Left sidebar** — Description, Host, References, Body of Knowledge (instead of Bio + Organizations)
- **Right main area** — Functionality cards + AI Engine transparency grid + Monitoring section
- **"Virtual Contributor" badge** next to name (instead of online indicator)
- **Skill tags** displayed below name (manually added by owner)
- **Settings gear** visible only to VC owner/admin

---

## Layout

```
┌──────────────────────────────────────────────────────────┐
│  Top Navigation Bar                                      │
│  [Logo] > VC Profile (breadcrumb)                        │
├──────────────────────────────────────────────────────────┤
│  ┌─────┐                                                │
│  │     │  Name  [🤖 Virtual Contributor] badge  [⚙]     │
│  │ AVT │  Tags: [UX] [UI] [Design Research] [HCI]       │
│  │     │                                                │
│  └─────┘                                                │
├─────────────────────┬────────────────────────────────────┤
│  Description        │  Functionality                     │
│  "A secret UX..."   │  ┌──────┐ ┌──────┐ ┌──────┐      │
│                     │  │Func. │ │Data  │ │Role  │       │
│  Host               │  │Capab.│ │Access│ │Req.  │       │
│  [Avatar] Name      │  └──────┘ └──────┘ └──────┘      │
│                     │                                    │
│  References         │  AI Engine: [Engine Name]          │
│  (links list)       │  ┌──────┐ ┌──────┐ ┌──────┐      │
│                     │  │Model │ │Data  │ │Know. │       │
│  Body of Knowledge  │  │Trans.│ │Usage │ │Restr.│       │
│  [Type] [Source]    │  └──────┘ └──────┘ └──────┘      │
│                     │  ┌──────┐ ┌──────┐ ┌──────┐      │
│                     │  │Web   │ │Phys. │ │Tech  │       │
│                     │  │Access│ │Loc.  │ │Refs  │       │
│                     │  └──────┘ └──────┘ └──────┘      │
│                     │                                    │
│                     │  Monitoring by Alkemio             │
│                     │  [Legal/governance text]           │
└─────────────────────┴────────────────────────────────────┘
│  Footer                                                  │
└──────────────────────────────────────────────────────────┘
```

---

## Element Inventory

### Profile Header (No Banner)
| Element | New Component (shadcn) | Notes |
|---------|----------------------|-------|
| Avatar | `Avatar` (large, circular, ~132px) | Custom uploaded image; fallback to Bot icon |
| Name | Heading (text-4xl font-bold) | VC name |
| VC Badge | `Badge` variant="secondary" | "Virtual Contributor" with Bot icon |
| Settings button | `Button` variant="outline" size="icon" | Gear icon; navigates to `/vc/:slug/settings`; owner only |
| Skill tags | `Badge` variant="secondary" | Array of tags; manually added by owner |

### Left Sidebar (Sticky)
| Element | New Component (shadcn) | Notes |
|---------|----------------------|-------|
| Description section | Section heading + prose text | Short VC description |
| Host section | Section heading + Avatar + name | Person/org who owns this VC; clickable → profile |
| References section | Section heading + link list | External links added by owner |
| Body of Knowledge section | Section heading + source card | Shows knowledge type + source |
| Knowledge type indicator | Icon + text | One of: Posts/Content, Space/Subspace, External API |
| Knowledge source link | `Avatar` + name (clickable) | Links to space/subspace if applicable |

### Functionality Section (3-column card grid)
| Element | New Component (shadcn) | Notes |
|---------|----------------------|-------|
| Section header | Heading (text-xl font-semibold) | "Functionality" |
| Functional Capabilities card | `Card` with icon header | Lists what the VC can do (check/dash list) |
| Data Access card | `Card` with icon header | Lists what data the VC accesses from the space |
| Role Requirements card | `Card` with icon header | Describes role permissions needed |

### AI Engine Section (3×2 card grid)
| Element | New Component (shadcn) | Notes |
|---------|----------------------|-------|
| Section header | Heading + engine name | "AI Engine: [Engine Name]" |
| Open Model Transparency card | `Card` with icon | Yes/No indicator |
| Data Usage Disclosure card | `Card` with icon | Yes/No indicator |
| Knowledge Restriction card | `Card` with icon | Yes/No indicator |
| Web Access card | `Card` with icon | Yes/No indicator |
| Physical Location card | `Card` with icon | Location text (e.g. "Sweden, EU") |
| Technical References card | `Card` with icon | CTA button → documentation link |

### AI Transparency Card Pattern
Each card follows:
```
┌────────────────────────────┐
│      [Icon]                │
│   Card Title               │
│                            │
│   Question/description     │
│                            │
│   [✓/✗/◷] Answer value    │
└────────────────────────────┘
```
- Icon: centered, 40px, muted color
- Title: font-semibold, centered
- Description: text-sm, text-muted-foreground, centered
- Answer: icon + value, centered; uses Check (yes), X (no), Clock (no-web), MapPin (location)

### Monitoring Section
| Element | New Component (shadcn) | Notes |
|---------|----------------------|-------|
| Section header | Heading | "Monitoring by Alkemio" |
| Body text | Prose text (text-sm, text-muted-foreground) | Governance/legal notice about Alkemio monitoring |
| Separator | `Separator` or border-top | Visual separation from AI cards |

---

## Data Model

```typescript
interface VirtualContributor {
  id: string;
  slug: string;
  name: string;
  avatarUrl?: string;
  description: string;
  tags: string[];
  host: {
    id: string;
    name: string;
    avatarUrl?: string;
    type: "user" | "organization";
  };
  references: Array<{
    name: string;
    url: string;
  }>;
  bodyOfKnowledge: {
    type: "posts" | "space" | "external";
    sourceName: string;
    sourceUrl?: string;
    sourceAvatarUrl?: string;
    provider?: string; // For external: e.g. "Lux-Lab"
  };
  functionality: {
    capabilities: Array<{ label: string; enabled: boolean }>;
    dataAccess: Array<{ label: string; enabled: boolean }>;
    roleRequirements: string; // Rich text describing required role
  };
  aiEngine: {
    name: string; // e.g. "Alkemio AI"
    openModel: boolean;
    dataUsedForTraining: boolean;
    knowledgeRestriction: boolean;
    webAccess: boolean;
    physicalLocation: string;
    technicalReferencesUrl?: string;
  };
}
```

---

## Responsive Behavior

- **Desktop (≥1024px)**: 12-col grid — left sidebar col-span-3 (sticky), main col-span-8
- **Tablet (768–1023px)**: Left sidebar unsticks, stacks above main content
- **Mobile (<768px)**: Single column, full-width sections stacked vertically
- Functionality cards: 3-col → 2-col → 1-col
- AI Engine cards: 3-col → 2-col → 1-col

---

## Owner vs. Visitor View

| Feature | Owner/Admin | Visitor |
|---------|-------------|---------|
| Settings button (gear) | ✅ Visible → `/vc/:slug/settings` | ❌ Hidden |
| Body of Knowledge (private) | ✅ Always visible | ❌ Hidden if private |
| All other content | ✅ Visible | ✅ Visible |

---

## Interaction Patterns

- **Host avatar/name** → navigates to host's profile page
- **Body of Knowledge source** → navigates to linked space/subspace (if type is space/subspace)
- **Settings gear** → navigates to `/vc/:slug/settings` (owner only)
- **Technical References CTA** → opens external documentation link (new tab)
- **Skill tags** → no navigation (display-only)

---

## Reusable Components

From existing prototype:
- `Avatar` (shadcn) — VC avatar, host avatar, knowledge source avatar
- `Badge` (shadcn) — VC type badge, skill tags
- `Card` (shadcn) — Functionality cards, AI Engine cards
- `Button` (shadcn) — Settings button, CTA button
- `Separator` or border utility — Section dividers

New components to create:
- `VCProfileHeader` — no-banner header (closely mirrors updated `UserProfileHeader`)
- `TransparencyCard` — reusable card for AI engine attributes (icon + title + desc + value)
- `FunctionalityCard` — card with icon header + checklist items

---

## Component Specifications

### VCProfileHeader
Follows the new no-banner profile header pattern (matching updated UserProfileHeader):
- White/background color, no banner image
- Large circular avatar (132px) on the left
- Name (text-4xl font-bold) to the right of avatar
- "Virtual Contributor" badge below/beside name
- Skill tags row below name
- Settings gear button right-aligned (owner only)
- No message button (VCs don't receive messages directly)

### TransparencyCard
```
- Border card (rounded-xl)
- Centered layout
- Top: Icon (40px, in muted circular background)
- Middle: Title (font-semibold) + description (text-sm, text-muted-foreground)
- Bottom: Answer indicator (icon + text value)
- Answer variants:
  - ✓ Yes (CheckCircle, text-green)
  - ✗ No (XCircle, text-muted-foreground) 
  - Text value (e.g. "Sweden, EU")
  - CTA Button (e.g. "SEE DOCUMENTATION")
```

### FunctionalityCard
```
- Border card (rounded-xl)
- Top: Centered icon (40px in muted background)
- Title: Centered (font-semibold)
- Content: Left-aligned list
  - ✓ enabled items (Check icon + text)
  - — disabled items (Minus/dash + text, text-muted-foreground)
```

---

## Figma Make Instructions

```
You are creating the Alkemio Virtual Contributor Profile page using shadcn/ui components.

LAYOUT:
- NO banner image — clean white background header
- Large circular avatar (132px) + Name + "Virtual Contributor" badge + skill tags (row of Badges)
- Settings gear button (right-aligned, owner only)
- 12-column grid below header:
  - Left (col 2-4, sticky): Description, Host info, References, Body of Knowledge
  - Right (col 5-11): Functionality cards (3-col grid), AI Engine cards (3-col grid), Monitoring section

COMPONENTS:
- Avatar: shadcn Avatar (large, with uploaded image)
- Badge: shadcn Badge (VC type badge + skill tags)
- Cards: shadcn Card (all info cards in main area)
- Button: shadcn Button (settings gear, documentation CTA)
- Icons: Lucide (Bot, Settings, Check, X, Clock, MapPin, Globe, Shield, Brain, FileText, Upload, Lock)

CARD PATTERNS (AI Engine):
- Each card: centered icon in muted circle → title → description → answer value with indicator icon
- 3-column responsive grid (3 → 2 → 1 on breakpoints)

CARD PATTERNS (Functionality):
- Each card: centered icon → title → checklist (✓ enabled / — disabled items)
- 3-column responsive grid

SIDEBAR:
- Description: section heading + body text
- Host: section heading + avatar + name (clickable)
- References: section heading + link list
- Body of Knowledge: section heading + type icon + source name + link

MONITORING SECTION:
- Full-width within main column
- Section heading + governance text paragraph
- Subtle top border/separator
```

# Rebuild Brief: Innovation Hub Page

> After copying the client-web prototype over, execute this brief to build the Innovation Hub page.
> This is a NEW page that didn't exist before — build from scratch.

---

## Route

Add to `routes.tsx`:
```tsx
{ path: "/innovation-hub/:slug", Component: InnovationHubPage },
```

Create: `src/app/pages/InnovationHubPage.tsx`

---

## Page Structure

A public-facing branded landing page for a curated set of spaces. Uses the standard layout (Header + Footer).

### Sections (top to bottom):

1. **Hero Banner** — Full-bleed background image with centered logo + name + tagline
2. **Description Block** — Rich text card with settings gear (admin only)
3. **Spaces Grid** — Section title + 3-column grid of SpaceCards
4. **CTA Banner** — Green accent bar linking to universal homepage
5. **Footer** — Standard platform footer

---

## Sample Data (VNG Innovation Hub)

```tsx
const hubData = {
  slug: "vng-innovation-hub",
  name: "VNG Innovation Hub",
  tagline: "innovatie met en door de gemeentes",
  logo: "https://via.placeholder.com/120", // or VNG logo
  bannerImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920", // city skyline
  description: `De <strong>open innovatiehub</strong> voor <strong>samenwerking tussen en voor de gemeentes</strong> in Nederland.\nHier vind je communities die werken aan nieuwe vormen van publieke dienstverlening die aansluiten bij de leefwereld van mensen.\nEen plek waar de <strong>overheid, markt, wetenschap</strong> en <strong>samenleving</strong> samen kunnen werken aan <em>maatschappelijke missies</em>.`,
  spaces: [
    {
      id: "1",
      slug: "digitale-leefomgeving",
      name: "Digitale Leefomgeving",
      description: "De Digital Twin Community NL!",
      bannerImage: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600",
      tags: ["digital twin", "3d", "+5"],
      leads: [{ name: "User", avatar: "https://i.pravatar.cc/40?img=1", type: "person" }, { name: "VNG", avatar: "", type: "org" }],
      memberCount: 42,
      isPrivate: false,
    },
    {
      id: "2",
      slug: "totaal-driedimensionaal",
      name: "Totaal Driedimensionaal (T3...)",
      description: "Praktische oplossingen voor het in 3D inwinnen, registreren en gebruiken van...",
      bannerImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
      tags: ["geo-basisregistrat...", "BAG", "+7"],
      leads: [{ name: "User", avatar: "https://i.pravatar.cc/40?img=5", type: "person" }, { name: "VNG", avatar: "", type: "org" }],
      memberCount: 28,
      isPrivate: false,
    },
    {
      id: "3",
      slug: "dutch-societal-innovation-hub",
      name: "Dutch Societal Innovation ...",
      description: "De maatschappij vraagt erom dat het anders gaat en wij zetten samen de eers...",
      bannerImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600",
      tags: ["innovation"],
      leads: [{ name: "User1", avatar: "https://i.pravatar.cc/40?img=10", type: "person" }, { name: "User2", avatar: "https://i.pravatar.cc/40?img=12", type: "person" }],
      memberCount: 15,
      isPrivate: false,
      badge: "Inactive", // shown as overlay badge on banner
    },
  ],
};
```

---

## Section Details

### 1. Hero Banner

```
Full-width, height ~200px, position relative
├── <img> background: object-cover, full size
├── Dark overlay: absolute inset-0, bg black/50
├── Content (absolute, centered, z-10):
│   ├── Logo: 120×120, rounded-xl, border-4 border-white/20, object-cover
│   ├── Hub Name: text-2xl font-bold text-white, mt-4
│   └── Tagline: text-base text-white/80 italic
```

The banner goes UNDER the header (use `marginTop: -64px` like space banners, or just make the header transparent on this route too).

### 2. Description Block

```
Card, max-w-4xl mx-auto, mt-8, p-6, relative
├── Settings gear: absolute top-4 right-4, ghost button, only if admin
└── Rich text: rendered as HTML (dangerouslySetInnerHTML)
    - Supports <strong>, <em>, normal text
    - Multiple paragraphs
    - font-size: var(--text-sm), line-height: 1.7, color: var(--foreground)
```

### 3. Spaces Grid

```
max-w-6xl mx-auto, mt-8, px-6
├── Section title: "[Hub Name] Spaces", text-xl font-semibold, mb-6
└── Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
    └── SpaceCard components (reuse existing SpaceCard.tsx)
```

Use the existing `SpaceCard` component. If a space has a `badge` field (e.g. "Inactive"), show it as an overlay on the card banner (top-left or top-right, using a destructive/outline badge style).

### 4. CTA Banner

```
max-w-4xl mx-auto, mt-12, mb-8
├── Container: rounded-xl, px-8 py-6, flex items-center gap-4
│   Background: emerald-50/green-50 or similar soft green
│   Border: 1px solid emerald-100
├── Icon: Sprout or Leaf from lucide-react, w-10 h-10, text-emerald-500
└── Text: "Interested in collaborating in other Spaces? Click here to see them all on the universal Alkemio homepage."
    - "Click here" portion is a link to "/"
    - font-size: var(--text-base), font-weight: 500
```

### 5. Footer

Use the existing `<Footer />` component.

---

## Key Behaviors

- Page is public (no auth required)
- Clicking a space card navigates to `/space/[slug]`
- Settings gear only visible to admins (can use a simple `isAdmin` prop/state, defaulting to true for prototype)
- CTA link navigates to `/` (or `/spaces`)

---

## Imports Needed

```tsx
import { Link } from "react-router";
import { Settings, Sprout } from "lucide-react";
import { SpaceCard, SpaceCardData } from "@/app/components/space/SpaceCard";
import { Footer } from "@/app/components/layout/Footer";
```

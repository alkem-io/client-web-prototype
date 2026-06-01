# Rebuild Brief: Space/Subspace Banner Variants (5 variants)

> After copying the client-web prototype over, execute this brief to recreate the SpaceHeader and SubspaceHeader banner variant system.

---

## Overview

Two header components with 5 visual variants each, controlled by a `?v=N` query param. The Header component goes transparent when a banner is present and solidifies after scrolling 120px.

---

## Files to Create/Update

```
src/app/components/space/SpaceHeader.tsx
src/app/components/space/SubspaceHeader.tsx
```

Also ensure the Header.tsx has the transparent-on-banner logic (may already exist in client-web version).

---

## SpaceHeader.tsx

### Props
```tsx
interface SpaceHeaderProps {
  spaceSlug: string;
  spaceName?: string;
  variant?: 1 | 2 | 3 | 4 | 5;
}
```

### Banner Image
```tsx
const BANNER_IMAGE = "https://images.unsplash.com/photo-1690191863988-f685cddde463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjBjaGFsbGVuZ2UlMjBjcmVhdGl2ZSUyMHdvcmtzaG9wJTIwdGVhbSUyMGNvbGxhYm9yYXRpb24lMjBpbm5vdmF0aW9uJTIwc3ByaW50JTIwZGVzaWduJTIwc3ByaW50fGVufDF8fHx8MTc2OTA5NDMxMHww&ixlib=rb-4.1.0&q=80&w=1920";
```

### Scaling Behavior
- V2–V5 use a `maxWidth: 1536` centered container so content scales gracefully on zoom
- V1 uses full-width with a 12-column grid (content in cols 2–11)

```tsx
const scaledContainer = { maxWidth: 1536, margin: "0 auto", width: "100%" };
const usesScaling = variant !== 1;
```

### Variant Behavior (Banner Area)

All banners have `marginTop: "-64px"` to go UNDER the transparent header.

| Variant | Banner |
|---------|--------|
| **1** (default) | Full-width, `height: 256px`, `object-cover`, no padding |
| **2** | Inside `px-4` + `scaledContainer`, `aspect-ratio: 6/1`, with **gradient wing overlays** on left/right (15% width, `rgba(44, 24, 16, 0.85)` → transparent) |
| **3** | Inside `px-4` + `scaledContainer`, `height: 77px` (thin strip), no overlays |
| **4** | **No banner** — just a `64px` height spacer (compensates for the negative margin) |
| **5** | Same banner as **Variant 1** (full-width, 256px) — they differ only in padding below |

### Info Bar (Below Banner)

All variants show a title + tagline section below the banner.

**Padding:**
- V1 & V5: `paddingTop: 32, paddingBottom: 32` (more generous)
- V2, V3, V4: `paddingTop: 16, paddingBottom: 16` (compact)
- V1 also gets `paddingLeft: 32, paddingRight: 32` (no scaledContainer)

**Content (V2–V5, uses scaledContainer):**
```tsx
<div className="flex flex-col gap-1">
  <div className="flex items-center justify-between gap-4">
    <h1 className="text-foreground truncate font-bold tracking-tight"
        style={{ fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.2 }}>
      Steward-Ownership Field Builder Community
    </h1>
  </div>
  <div className="flex items-center gap-4">
    <p className="text-muted-foreground truncate text-sm" style={{ lineHeight: 1.4 }}>
      The place for all field builders on steward-ownership to learn, connect, discuss and collaborate.
    </p>
  </div>
</div>
```

**Content (V1, uses 12-col grid):**
```tsx
<div className="grid grid-cols-12 gap-6">
  <div className="col-span-12 lg:col-start-2 lg:col-span-10 flex flex-col gap-1">
    {/* Same h1 + p as above */}
  </div>
</div>
```

---

## SubspaceHeader.tsx

### Props
```tsx
interface SubspaceHeaderProps {
  spaceSlug: string;
  subspaceSlug: string;
  title: string;
  description: string;
  parentSpaceName: string;
  imageUrl: string;
  initials: string;
  avatarColor: string;
  parentInitials: string;
  parentAvatarColor: string;
  parentBannerImage?: string;
  avatarImage?: string;
  memberCount?: number;
  onCommunityClick?: () => void;
  variant?: 1 | 2 | 3 | 4 | 5;
}
```

### Differences from SpaceHeader:
1. **No gradient wing overlays** on V2 (just the image in scaledContainer)
2. **Banner uses `px-4`** wrapper on V2/V3 (whereas SpaceHeader also has `px-4` wrapping a div)
3. **Info bar includes an avatar** (square with rounded corners) to the left of the title

### Subspace Avatar in Info Bar

Both V1 (grid) and V2+ (scaled) layouts show:

```tsx
<div className="shrink-0 overflow-hidden flex items-center justify-center self-stretch"
  style={{
    width: 56,
    aspectRatio: "1",
    borderRadius: "var(--radius-md, 6px)",
    border: "2px solid var(--border)",
    background: avatarImage ? undefined : avatarColor
  }}>
  {avatarImage ? (
    <img src={avatarImage} alt={title} className="w-full h-full object-cover" />
  ) : (
    <span style={{ color: "var(--primary-foreground)", fontSize: "18px", fontWeight: 600 }}>
      {initials}
    </span>
  )}
</div>
```

Layout: `flex items-center gap-4` with avatar + text column (title + description).

---

## Header.tsx: Transparent Banner Integration

The global header needs this logic to go transparent over banners:

```tsx
const location = useLocation();
const [searchParams] = useSearchParams();
const hasBanner = location.pathname.startsWith("/space");
const [scrolledPastBanner, setScrolledPastBanner] = useState(false);

useEffect(() => {
  if (!hasBanner) return;
  const onScroll = () => setScrolledPastBanner(window.scrollY > 120);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  return () => window.removeEventListener("scroll", onScroll);
}, [hasBanner]);

const headerTransparent = hasBanner && !scrolledPastBanner;
```

When `headerTransparent` is true, apply frosted glass pill style to interactive elements:
```tsx
const frostedPill = headerTransparent
  ? {
      background: "rgba(255,255,255,0.75)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderRadius: "8px",
      padding: "4px 12px",
    }
  : {};
```

---

## SpaceShell Integration

The `SpaceShell.tsx` reads the variant from URL params:
```tsx
const [searchParams] = useSearchParams();
const variant = (parseInt(searchParams.get("v") || "1") || 1) as 1|2|3|4|5;
```

Then passes it to:
```tsx
<SpaceHeader spaceSlug={slug} variant={variant} />
```

---

## CSS: Banner Action Buttons

Add to `theme.css`:

```css
/* ── Banner action buttons (overlaid on user-uploaded images) ── */
.banner-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-lg, 6px);
  color: white;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: background-color 150ms ease;
}
.banner-action-btn:hover {
  background-color: rgba(0, 0, 0, 0.4);
}
.banner-action-btn:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}
.banner-action-btn svg {
  width: 16px;
  height: 16px;
}
```

---

## Static Assets

Ensure `public/banners/steward-ownership.png` exists (used as fallback parent banner in SubspacePage).

---

## Testing

Navigate to:
- `/space/test?v=1` through `?v=5` for SpaceHeader variants
- `/space/test/subspaces/sub?v=1` through `?v=5` for SubspaceHeader variants

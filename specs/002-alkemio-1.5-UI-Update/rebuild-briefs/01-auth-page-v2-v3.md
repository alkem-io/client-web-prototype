# Rebuild Brief: Auth Pages (V2 + V3)

> After copying the client-web prototype over, execute this brief to recreate the sign-in pages.

---

## Overview

Two auth page variants exist:
- **AuthPageV2** (`/sign-in-v2`) — Animated canvas network background with floating people (avatar photos) and space circles
- **AuthPageV3** (`/sign-in-v3`) — Same auth card UI but with a soft CSS gradient background (no canvas)

Both pages share identical sub-components and support 5 views: `sign-in` → `sign-up` → `sign-up-password` → `verify` → `recovery`.

---

## File Structure

```
src/app/pages/AuthPageV2.tsx   (~1236 lines)
src/app/pages/AuthPageV3.tsx   (~622 lines)
src/app/pages/AuthPage.tsx     (empty placeholder)
```

Routes to add in `routes.tsx`:
```tsx
{ path: "/sign-in", Component: AuthPage },
{ path: "/sign-up", Component: AuthPage },
{ path: "/password-recovery", Component: AuthPage },
{ path: "/sign-in-v2", Component: AuthPageV2 },
{ path: "/sign-in-v3", Component: AuthPageV3 },
```

---

## Shared Sub-Components (inline in each file)

### 1. SVG Icon Components

- **PasskeyIcon**: Key/lock SVG (`viewBox="0 0 24 24"`, path: circle + shield shape)
- **MicrosoftIcon**: 4-color squares grid (`viewBox="0 0 21 21"`, rects at x=1/11, y=1/11, 9×9, colors: #F25022, #7FBA00, #00A4EF, #FFB900)
- **LinkedInIcon**: Standard LinkedIn SVG (`viewBox="0 0 24 24"`, fill="#0077B5")
- **GitHubIcon**: Standard GitHub octocat SVG (`viewBox="0 0 24 24"`, fill="currentColor")
- **OryIcon**: Circle with letter "C" inside (`viewBox="0 0 24 24"`, circle r=10 stroke, text "C" centered)

### 2. FloatingInput

Material UI-style floating label input:
- Container: `border: 1px solid var(--border)`, `border-radius: 4px`, transitions to `2px solid var(--primary)` on focus
- Input: `height: 56px`, `padding: 20px 14px 8px`, `font-size: var(--text-base)`
- Label: absolute positioned, floats up on focus/filled:
  - Unfloated: `top: 50%`, `translateY(-50%)`, `font-size: var(--text-base)`, `color: var(--muted-foreground)`
  - Floated: `top: 6px`, no transform, `font-size: 12px`, `color: var(--primary)`, `background: white`, `padding: 0 4px`
- Optional `endIcon` prop (positioned `right-3 top-1/2 -translate-y-1/2`)
- Shows `" *"` after label if `required`

### 3. SocialButtons

Row of circular social login buttons:
- Flex centered, gap-3
- Each button: `48×48px`, `rounded-full`, border `var(--border)`, bg `var(--card)`, hover `bg-accent`
- `showPasskey` prop controls whether Passkey button appears (shown on sign-in, hidden on sign-up)
- Provider order: Passkey (if shown), Microsoft, LinkedIn, GitHub, Ory

### 4. OrDivider

- Flex row with `gap-3`, `my-5`
- Left/right: `flex-1 h-px`, bg `var(--border)`
- Center text: "or continue with", `font-size: var(--text-sm)`, `color: var(--muted-foreground)`, `font-family: 'Inter', sans-serif`

### 5. AuthCard

Card wrapper for all views:
- Container: `bg: var(--card)`, `border-radius: 8px`, `box-shadow: 0 8px 32px rgba(0,0,0,0.12)`, `padding: 32px 36px`
- Header row (flex justify-between):
  - Left: Alkemio logo (`w-36 h-5`) + tagline "Safe Spaces for Collaboration" (`font-size: 11px, color: var(--muted-foreground)`)
  - Right: "No account? **Sign up**" (on sign-in) OR "Have an account? **Sign in**" (on sign-up)
- Title: `font-size: var(--text-3xl)`, `font-weight: 700`, `margin-bottom: 24px`, `line-height: 1.2`

---

## AuthPageV2: Network Background

### Canvas Animation (`NetworkBackground` component)

Full-screen `<canvas>` with RAF animation loop. Key elements:

**Node types:**
- **People** (38 nodes): Small circles (`r: 6-10px`), use `i.pravatar.cc/80?img=N` for profile photos, clipped to circle. Dark slate colors as fallback.
- **Spaces** (17 nodes): Larger circles (`r: 18-32px`), translucent colored fills (teal, blue, green, purple, amber)

**Movement:** Slow drift (`vx/vy: ±0.33`), bounce at edges

**Connections (organic curves with quadraticCurveTo + time-based wobble):**
- Person→Space: When within `connectionDist (180px)` × 0.7, opacity ~0.14 × strength
- Space→Space: Between separate merged clusters, opacity ~0.13
- Person→Person: ONLY when both share a nearby space (Alkemio principle: people connect through spaces), opacity ~0.08

**Merged Spaces:** When space nodes overlap, they combine into a single larger circle (area-based radius calculation), showing faint inner circles for member spaces.

**Emergent Spaces (key feature):**
- When 3+ people cluster (within 60px) WITHOUT a nearby space, a new "emergent space" spawns
- Lifecycle: `forming` (dashed ring, grows opacity over 120 frames) → `popping` (elastic scale animation over 400ms with flash ring) → `formed` (graduates to real node)
- Uses `emergentRef` to track persistent emergent spaces across frames

**Draw order:**
1. Connection curves
2. Emergent space circles (dashed/popping)
3. Merged space circles (opaque base #eef4f9 + colored fill + ring)
4. People circles on top (profile photos clipped, subtle border ring)

**Space rendering:**
- Opaque base: `#eef4f9`
- Outer glow: radial gradient from color at 0.3 opacity → transparent
- Inner core: `r × 0.6`, color at 0.2 opacity
- Ring: color at 0.15 opacity, `lineWidth: 1.5`

### Page Layout

```
min-h-screen flex flex-col relative
├── Background layer (z-0)
│   ├── Gradient base: linear-gradient(135deg, rgba(241,245,249,1) 0%, rgba(224,237,244,1) 40%, rgba(237,242,248,1) 70%, rgba(241,245,249,1) 100%)
│   ├── NetworkBackground canvas
│   └── Vignette: radial-gradient(ellipse at 70% 50%, transparent 30%, rgba(241,245,249,0.6) 100%)
├── Content (z-10, flex-1, items-center, justify-end)
│   └── Auth card (max-w-[420px], right-aligned via justify-end)
│       Login animation: opacity 0 + translateY(-40px) + scale(0.97) on submit
├── Help widget (fixed bottom-6 right-6, 48×48 rounded-full, primary bg, HelpCircle icon)
└── Footer (z-10, bg-transparent, border-t-0)
```

**Content positioning:** `px-6 md:px-12 lg:px-24 xl:px-32 py-12`, card is right-aligned (`justify-end`)

---

## AuthPageV3: Gradient Background

Same auth card and all sub-components. Only the background differs:

Replace the canvas with a multi-stop CSS gradient background:
- Soft radial/linear gradients creating a "cloudy" ambient feel
- No canvas element, no animation
- Same layout structure (card right-aligned with same padding)

---

## View States

### Sign In (`view === "sign-in"`)
- FloatingInput: E-Mail (email, required)
- FloatingInput: Password (password, required, eye toggle icon)
- "Forgot password?" link → sets view to "recovery"
- Primary button: "SIGN IN" (uppercase, tracking-wider, h-48px, full-width)
- OrDivider
- SocialButtons (with Passkey)

### Sign Up (`view === "sign-up"`)
- Terms text with links to Terms of Use and Privacy Policy
- Checkbox: "I accept the Terms of Use and Privacy Policy."
- FloatingInput: E-Mail
- FloatingInput: First Name
- FloatingInput: Last Name
- Primary button: "NEXT" (disabled/muted when terms not accepted, cursor: not-allowed)
- OrDivider
- SocialButtons (without Passkey)

### Sign Up Password (`view === "sign-up-password"`)
- Info banner: blue-ish bg (`rgba(29,56,74,0.06)`, border `rgba(29,56,74,0.12)`), Info icon + "Pick a password for your account"
- FloatingInput: Password (with eye toggle)
- Primary button: "NEXT"
- Outline button: "BACK" (border-color: var(--primary), color: var(--primary))
- OrDivider
- Primary button with Fingerprint icon: "SIGN UP WITH PASSKEY"
- OrDivider
- SocialButtons (without Passkey)

### Verify (`view === "verify"`)
- Text: "The last step is to verify your email address. Please check your inbox for an email with instructions."
- Text: "If you have not received an email, **click here to send it again.**"

### Recovery (`view === "recovery"`)
- Text: "Please enter your email address below to receive a recovery link that will allow you to reset your password."
- FloatingInput: E-Mail
- Primary button: "CONTINUE"

---

## Button Styles (all primary buttons)

```css
background: var(--primary);
color: var(--primary-foreground);
height: 48px;
font-size: var(--text-sm);
letter-spacing: 0.5px;
text-transform: uppercase;
font-weight: 600;
width: 100%;
```

---

## Dependencies / Imports

```tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { Eye, EyeOff, Info, Fingerprint, HelpCircle } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Footer } from "@/app/components/layout/Footer";
import AlkemioLogo from "@/imports/AlkemioLogo";
```

---

## Login Animation

On sign-in submit:
1. `setIsLoggingIn(true)`
2. Container transitions: `opacity: 0`, `transform: translateY(-40px) scale(0.97)`, `transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)`
3. After 1200ms: `navigate("/")`

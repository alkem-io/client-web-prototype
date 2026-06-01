# Page 38: Authentication — Sign In / Sign Up / Registration

**Routes**: `/sign-in`, `/sign-up`, `/sign-up/password`, `/sign-up/verify`, `/password-recovery`  
**Audience**: Unauthenticated visitors  
**Primary Use**: Account creation, authentication, and password recovery

---

## Design Brief

You are designing the pre-authentication flow for Alkemio — a collaborative innovation platform. These pages are the first impression for new and returning users. They must feel welcoming, trustworthy, and efficient while maintaining brand consistency.

---

## Shared Layout (All Auth Pages)

**Page Structure**:
1. **Full-viewport background** — Illustrated collaboration scene (light blue, isometric style) depicting people working together in connected "spaces" with network links. The Alkemio brand logo + tagline "Safe Spaces for Collaboration" appears top-left in a subtle frosted card overlay.
2. **Auth card** — White card, right-of-center positioned (roughly 60% from left on desktop), vertically centered within the visible area. Max-width ~420px (sign-in) to ~360px (sign-up). Rounded corners, soft shadow. No visible border on the card itself.
3. **Footer** — Full-width platform footer pinned to bottom: © 2026 Alkemio B.V. | Terms | Privacy | Security | [Alkemio symbol] | Support | About | Language selector.
4. **Help widget** — Floating circular "?" button, bottom-right corner (accessible on all auth pages).

**Card Header Pattern** (consistent across all states):
- "Welcome to Alkemio!" — small text, left-aligned
- Toggle link top-right: "No account? **Sign up**" (on sign-in) or "Have an account? **Sign in**" (on sign-up)
- Page title (large, bold): "Sign in" / "Sign up" / "Password recovery"

---

## Screen 1: Sign In

**Route**: `/sign-in`

**Form Elements**:
1. **E-Mail field** — Floating label input ("E-Mail *"), required
2. **Password field** — Floating label input ("Password *"), required, with visibility toggle (eye icon) right-aligned inside field
3. **Forgot password link** — Left-aligned below password field, text link: "Forgot password?"
4. **SIGN IN button** — Full-width, primary (dark navy background, white all-caps text), large size
5. **Separator** — "or continue with" centered text with horizontal rule
6. **Social login buttons** — 5 icons in a horizontal row, equally spaced, outlined circular buttons:
   - Passkey/fingerprint icon
   - Microsoft (4-color square)
   - LinkedIn (blue "in" logo)
   - GitHub (octocat mark)
   - Ory/Clerk (C logo)

**Interactions**:
- Email validation on blur (valid email format)
- Password visibility toggle
- Forgot password → navigates to `/password-recovery`
- Sign up link → navigates to `/sign-up`
- Social button → initiates OAuth/OIDC flow with respective provider

---

## Screen 2: Sign Up — Step 1 (Account Info)

**Route**: `/sign-up`

**Form Elements**:
1. **Terms notice** — Body text: "Alkemio is designed to benefit society. Please read and accept the **Terms of Use** and **Privacy Policy** before you continue." (linked terms)
2. **Checkbox** — "I accept the **Terms of Use** and **Privacy Policy**." (linked, must be checked to proceed)
3. **E-Mail field** — Floating label ("E-Mail *"), required
4. **First Name field** — Floating label ("First Name *"), required
5. **Last Name field** — Floating label ("Last Name *"), required
6. **NEXT button** — Full-width, primary style. Disabled (grayed) until checkbox is checked and all fields valid.
7. **Separator** — "or continue with"
8. **Social login buttons** — 4 icons (Microsoft, LinkedIn, GitHub, Ory/Clerk) — no Passkey option on this step

**Interactions**:
- Checkbox must be accepted before NEXT activates
- Field-level validation on blur
- "Sign in" link top-right → navigates to `/sign-in`
- Scroll indicator (chevron-up) at bottom-right when content overflows viewport

---

## Screen 3: Sign Up — Step 2 (Password)

**Route**: `/sign-up/password`

**Form Elements**:
1. **Info callout** — Blue/teal info bar with ℹ icon: "Pick a password for your account"
2. **Password field** — Floating label ("Password *"), visibility toggle
3. **NEXT button** — Full-width, primary
4. **BACK button** — Full-width, secondary/outline style (same dark color but visually distinct)
5. **First separator** — "or continue with"
6. **SIGN UP WITH PASSKEY button** — Full-width, primary variant with fingerprint icon + uppercase text
7. **Second separator** — "or continue with"
8. **Social login buttons** — 4 icons (Microsoft, LinkedIn, GitHub, Ory/Clerk)

**Interactions**:
- Password must meet minimum requirements (length, complexity) — show inline validation
- NEXT → submits registration, proceeds to email verification
- BACK → returns to step 1 (preserves entered data)
- SIGN UP WITH PASSKEY → triggers WebAuthn/passkey registration flow

---

## Screen 4: Email Verification

**Route**: `/sign-up/verify`

**Card Content**:
1. **Title**: "Sign up" (same header pattern)
2. **Message**: "The last step is to verify your email address. Please check your inbox for an email with instructions."
3. **Resend link**: "If you have not received an email, **click here to send it again.**" (underlined link)
4. No form fields, no social logins, no footer actions within the card

**Interactions**:
- "click here to send it again" → triggers resend verification email API call
- "Sign in" link in header → navigates to `/sign-in`
- User arrives here after successful registration
- After email verification, user is redirected to `/onboarding`

---

## Screen 5: Password Recovery

**Route**: `/password-recovery`

**Form Elements**:
1. **Instruction text**: "Please enter your email address below to receive a recovery link that will allow you to reset your password."
2. **E-Mail field** — Floating label ("E-Mail *"), required
3. **CONTINUE button** — Full-width, primary

**Interactions**:
- Email validation on blur
- CONTINUE → sends recovery email, shows confirmation message
- "Sign up" link top-right → navigates to `/sign-up`
- No social login options shown

---

## Visual Requirements

**Typography**:
- Page title: 30px (text-3xl), font-weight 700, color: foreground
- "Welcome to Alkemio!": 14px (text-sm), color: muted-foreground
- Toggle link (Sign up/Sign in): 14px, font-weight 600 for the bold action
- Field labels: 14px, floating/outlined style (MUI-style outlined inputs)
- Button text: 14px, uppercase, font-weight 600, letter-spacing 0.5px
- Body text: 14–16px, color: foreground or muted-foreground

**Colors**:
- Primary button: `--primary` (dark navy rgba(29,56,74)) background, white text
- Disabled button: light gray background, darker gray text
- Card: white background, no visible border, subtle elevation shadow
- Background illustration: light blue (#E0F4FD approximate), with isometric figures
- Links: `--primary` color, underline on hover
- Info callout: light blue/teal background with darker teal text + ℹ icon

**Spacing**:
- Card padding: 32px–40px horizontal, 24px–32px vertical
- Field gap: 16px–20px between stacked fields
- Section gap: 24px between form section and social buttons
- Social icon buttons: ~48px diameter, 12px gap between them

**Input Style**:
- Outlined/floating label style (label rises into top-border on focus/filled)
- Border-radius: 4px
- Height: ~56px (larger than standard shadcn inputs — MUI-style)
- Border color: mid-gray, focus: primary color

**Responsive**:
- Desktop (>1024px): Card right-positioned, full illustration visible
- Tablet (768–1024px): Card centered, illustration cropped/partial
- Mobile (<768px): Card full-width with minimal padding, illustration as subtle top banner or hidden, footer stacks vertically

---

## Reusable Components

| Component | Source | Usage |
|-----------|--------|-------|
| `Button` | `ui/button.tsx` | SIGN IN, NEXT, BACK, CONTINUE, Social buttons |
| `Input` | `ui/input.tsx` | Email, Password, Name fields (with MUI-style floating labels) |
| `Label` | `ui/label.tsx` | Field labels |
| `Checkbox` | `ui/checkbox.tsx` | Terms acceptance |
| `Card` | `ui/card.tsx` | Auth form container |
| `Separator` | `ui/separator.tsx` | "or continue with" dividers |
| `Footer` | `layout/Footer.tsx` | Page footer |
| `AlkemioLogo` | `imports/AlkemioLogo` | Top-left brand mark |

---

## Personas

- **All unauthenticated visitors** — first-time and returning users
- Flows into **Onboarding** (`/onboarding`) after successful verification
- Relates to **Contributor**, **Facilitator**, and **Portfolio Owner** personas (pre-auth)

---

## Notes

- Auth is powered by Ory/Kratos — these pages are Alkemio-themed auth UI (not third-party default screens)
- The illustrated background should be a static SVG/image asset for performance (not dynamically rendered)
- Social login providers use OAuth2/OIDC; passkey uses WebAuthn
- The "ALKEMIO Preview" badge in the logo area indicates this is a preview/staging environment
- Form submissions should show loading states on buttons (spinner replaces text)
- Error states: red border on invalid fields, error message below field in destructive color

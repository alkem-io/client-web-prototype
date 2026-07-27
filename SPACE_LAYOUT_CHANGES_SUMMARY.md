# Space & Subspace Layout Changes — Developer Summary

*Production → Prototype comparison. Production ref: OneGov Hackathon Community (July 2026).*

---

## 1. Banner

| What | Now | Target | Why |
|------|-----|--------|-----|
| Height | Fixed ~256px | **Admin-configurable**: 80px (min) – 256px (max), default 160px | Space admins choose what works for their space — short for visual identity, tall for hero-style branding with text |
| Width | Edge-to-edge (full viewport) | **Inside the content grid with margins** (same as production), rounded corners | Consistent with the rest of the page layout; rounded corners feel more modern |
| Cropping | Admin uploads image, platform crops | Admin uploads → **interactive crop box** over the full image. Drag the selection to choose which part to show, drag edges to adjust height. Live preview strip below. Existing spaces can open settings and adjust crop/height anytime without re-uploading. | Gives admins control over exactly which part of the image shows and at what height |
| Image tint | Slight dark tint/gradient | No tint — raw image | Lighter feel, image speaks for itself |
| Subspace banner | Inherits parent space image + height | Same | No change |

---

## 2. Title / Info Bar

**Mostly unchanged.** Same position (below banner, above tabs), same title + tagline layout.

Only changes:
- Action icons restyled: smaller, tinted background, grouped tighter
- New **Info (ℹ) icon** added — opens About This Space dialog

---

## 3. Space Tab Bar

| What | Now | Target | Why |
|------|-----|--------|-----|
| Style | Underline on active tab | **Folder tabs** — active tab has border + white bg, overlaps bottom line | Stronger visual anchor |
| Position | Static (scrolls away) | **Sticky** below header with frosted glass bg | Always accessible — no scroll-to-top to switch tabs |
| CTA buttons | "+ ADD POST" etc. on right side of tab bar | Moved to **sidebar** as configurable feature (see §4a `post` toggle). Tab bar right side now only has context-dependent CTAs like "+ INVITE MEMBER" / "+ CREATE SUBSPACE" | Post action lives closer to the content; sidebar keeps it visible even when scrolled |

---

## 4. Side Panel (Left Sidebar)

| What | Now | Target | Why |
|------|-----|--------|-----|
| Content | Same on all tabs | **Configurable per tab** — admins toggle features on/off per tab in Settings > Layout | Sidebar shows what's relevant to each tab's purpose |
| Positioning | Scrolls with page | **Sticky** (`top-[8.5rem]`), own scroll with **hidden scrollbar** (`scrollbar-hide overflow-y-auto`) | Always reachable; scrollbar hidden keeps it clean — content scrolls but no visible track |
| Width | ~200px fixed | 2/12 grid columns | Scales with viewport |
| Description | Teal card with space description (always shown) | **Tab description** (plain text, changes per tab) — also a toggleable feature in Settings > Layout. Admins can hide it per tab if not needed. | Gives context for what the tab is about, but doesn't force it on every tab |
| Leads | Separate "SPACE LEADS" section | Merged into Intention & Leads block | Less fragmentation |
| Events | "EVENTS" section | **Upcoming Events** — collapsible, date badges, + add button | Same location, cleaner visual |
| Subspaces | Static list on every tab | Toggleable feature — admins choose which tabs show it | Not needed on every tab |
| Collapse | None (spaces), limited collapse (subspaces only) | **3 modes**: Full / Rail / Hidden — see §4b | Users choose their preferred layout |
| Breakpoints | Sidebar hidden below desktop | **Desktop**: full sidebar (default). **Tablet** (≤1024px): auto-collapses to **railed view** so functionality isn't lost at smaller widths. **Mobile**: hidden (see below) | Ensures search, post, and settings access aren't sacrificed at tablet widths — the rail keeps everything one click away |
| Mobile | Hidden | 5 mobile strategy options (sheet, bottom sheet, collapsible, bottom nav, filter icon) | Sidebar features stay accessible on mobile |

### 4a. Sidebar Settings (Settings > Layout)

Admins toggle these features on/off **per tab** (any combination, any tab). Listed in display order:

| Feature | What it shows |
|---------|--------------|
| `intent` | Intention & Leads card |
| `post` | "New Post" button |
| `addUser` | "Add User" button |
| `createSubspace` | "Create Subspace" button |
| `search` | Search input |
| `tags` | Filter tag pills |
| `subspaceLinks` | Quick links to subspaces |
| `index` | Content index |

Sidebar mode (full/rail/hidden) and default collapsed state are also set here.

### 4c. Search & Tags (Sidebar Filtering)

Search and tags work together as a unified filtering system in the sidebar:

- **Search** — text input that filters posts, documents, and content in the current tab by title, author, and body text. Results update live as you type.
- **Tags** — pill buttons below the search input. Tags are tab-specific (e.g. Home tab shows "Updates", "Events", "Ideas"; Knowledge tab shows "Reports", "Research", "Policy"). Clicking a tag activates it (filled primary color); multiple tags can be active at once.
- **Combined filtering** — search and tags stack: if you search for "solar" and activate the "Research" tag, only content matching both is shown.
- **Filter feedback** — when any filter is active, a summary bar appears: "3 items match tagged 'Research' and search for 'solar'" with a clear button.
- **Railed mode** — when sidebar is collapsed, the Search rail icon shows a **count badge** with the number of active filters, and opens a popover with the full search + tags panel.

### 4b. Railed View (New)

| What | Now | Target | Why |
|------|-----|--------|-----|
| Availability | Subspaces only | **Spaces + subspaces** | Consistent behavior everywhere |
| Trigger | "COLLAPSE" button | User toggle (`PanelLeftClose`) or admin default in Settings | More discoverable, persists preference |
| Collapsed state | ~5 static icons, always the same regardless of context | Slim icon rail (36px), icons are **context-aware** — reflect features enabled for the current tab on that space/subspace (via Settings > Layout) | Rail shows exactly what's relevant; if a tab has only search + post enabled, the rail only shows those two icons |
| Interaction | Icons navigate away or do nothing | Each icon opens a **floating popover** next to the rail | Stay in context — no page navigation needed |
| Expand | Must click "COLLAPSE" again to re-expand | `PanelLeftOpen` button at top of rail | Clear affordance |
| Filter state | Not visible when collapsed | Search icon shows **count badge** when filters active | Users know filters are applied even in rail mode |
| Sticky | No | Yes — same `top-[8.5rem]` as full sidebar | Always reachable |

**Rail icons (when feature is enabled):**

| Icon | Opens |
|------|-------|
| `PanelLeftOpen` | Expand to full sidebar |
| `Search` | Search input + tag filters |
| `Plus` | Post / Add User / Create Subspace |
| `Layers` | Subspace quick links |

---

## 5. Subspace-Specific Changes

| What | Now | Target | Why |
|------|-----|--------|-----|
| Sidebar top card | Teal card with subspace description + "Show more" | **Stacked card** — two layered cards (see below) | Immediately communicates "you're one level deeper" |
| Callout tabs | Plain text pill tabs | Same pills + **post-count badges** | Badges give at-a-glance content density per phase |
| Innovation flow edit | No inline edit access | **Layout icon** next to tabs → navigates to Settings > Layout | Quick access to flow editor |
| Sidebar | Leads + about + collapse + quick actions + subspace list | Quick actions open **dialogs** instead of navigating away. Full railed view support (see §4b) | Stays in context |
| Content width | Full main column | `max-w-3xl` constrained | Better readability |

### Stacked Card (Subspace Sidebar)

The top of the subspace sidebar uses a **stacked card** pattern to reinforce hierarchy — how deep the user is in the space structure.

**Depth 1 (subspace) — 2 cards:**
- **Back card** (parent space) — miniature space card using the **same design as the Explore Spaces page cards**: 16:9 banner image, space avatar + name + description. Offset behind and above the front card, `rounded-xl` (12px), border.
- **Front card** (subspace) — dark primary-colored card (`--primary` bg) with the subspace challenge statement/intention (4-line truncation via ReadMoreText), plus the subspace lead (avatar, name, location) below a white divider.

**Depth 2 (sub-subspace) — 3 cards:**
- **Deepest card** (space) — same space card design, furthest back
- **Middle card** (subspace) — space card for the parent subspace, offset 14px down and 10px right from the deepest card
- **Front card** (sub-subspace) — same dark primary info card, offset again

Each level adds `paddingTop: 14px` and `paddingLeft: 10px` to make room for the extra card peeking out.

**Interaction:**
- Hovering the **nearest back card** lifts it upward (`translateY(-3px)`) with a spring animation, brightens the banner, and reveals an `ArrowUpLeft` icon — signaling "click to go up one level"
- Clicking any back card navigates to that level (parent space or parent subspace)
- The front card is static — it's the current context, not a navigation target
- The lead avatar supports a **profile hover card** on hover

---

## 6. Action Icons

| What | Now | Target | Why |
|------|-----|--------|-----|
| Location | Info bar (right of title, above tabs) | Same position **+ appear inline in the sticky tab bar** when user scrolls past them | Action icons live with the title by default, but since spaces can be configured with a single tab (hiding the tab bar entirely), the icons need a fallback anchor. By migrating into the sticky tab bar on scroll, they're always reachable regardless of scroll position or tab count. |
| Scroll behavior | Not sticky — scroll past and they're gone | **IntersectionObserver** detects when icons leave viewport; they reappear on the right side of the sticky tab bar | Always accessible — no scroll-to-top needed |
| Style | MUI IconButtons | Smaller, tinted bg, grouped | Subtler, less toolbar-like |
| New | — | **Info icon** → opens About dialog | Quick access without scrolling to sidebar |

---

## 7. About This Space Dialog

| What | Now | Target | Why |
|------|-----|--------|-----|
| Trigger | Sidebar button only | Sidebar button **+ Info icon** in action bar | Accessible from anywhere |
| Display | Navigates to page/section | **Modal dialog** (stays in context) | No scroll position lost |
| Content | Basic info | Structured: description → Why → Who → Guidelines → References → Hosted by | Answers the questions new members actually ask |
| Admin | Limited | **Edit pencil per section** → links to settings tab | See it, fix it |

---

## 8. Background Color (Platform-wide)

| What | Now | Target | Why |
|------|-----|--------|-----|
| Page background | Pure white (`#FFFFFF`) | **Off-white** (`rgba(252, 253, 254, 1)` / `#FCFDFE`) | Pure white is harsh on screens — a barely-perceptible warm shift reduces eye strain and lets white cards/modals stand out with subtle depth |
| Cards/modals | White | Same — white (`#FFFFFF`) | Cards pop slightly against the off-white background without needing heavy shadows |
| Input fields | White | Same — white (`#FFFFFF`) | Inputs remain clearly distinct from the page background |

This is a global change — applies to every page on the platform, not just space pages.

---

## 9. Implementation Sequence

Work in this order — each step builds on the previous.

| # | What | Depends on | Notes |
|---|------|-----------|-------|
| 1 | **Space tab bar + action icons** | — | New sticky folder-tab bar above sidebar + feed. Includes action icons scroll-into-tab-bar behavior. |
| 2 | **Banner update** | — | Admin-configurable height (80–256px), crop box in settings, inside grid with margins, rounded corners. |
| 3 | **Space side panel (base)** | 1 | Build sidebar matching current production functionality — sticky, hidden scrollbar, intention & leads block, events, subspace links. No custom per-tab control yet. |
| 4 | **Railed sidebar view** | 3 | Icon rail + floating popovers. Tablet breakpoint auto-collapse. Works on spaces + subspaces. |
| 5 | **Search & filter mechanic** | 3 | Sidebar search input + tag pills + combined filtering + filter feedback bar. Railed mode count badge. |
| 6 | **Subspace side panel + stacking cards** | 3, 4 | Challenge statement card, stacked parent space cards (depth 1 + 2), quick actions as dialogs. |
| 7 | **Settings: Layout tab** | — | *Separate ticket.* Per-tab sidebar feature toggles, sidebar mode config, innovation flow builder. |
| 8 | **Side panel custom control per tab** | 3, 7 | Wire up Settings > Layout toggles to sidebar — features show/hide per tab based on admin config. |

**Can be done independently (no sequence dependency):**
- Off-white background color (platform-wide CSS variable change)
- About This Space dialog (modal overlay, structured content, admin edit links)

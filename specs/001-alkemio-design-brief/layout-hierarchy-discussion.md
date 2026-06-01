# Layout Hierarchy & Wireframe Skeleton — Discussion Document

> **Purpose**: Pre-meeting discussion topics for lead designer alignment  
> **Focus**: Broad layout decisions, information hierarchy, parent/child/sibling relationships across the entire platform  
> **Date**: June 2026

---

## Part 1: The Hierarchy Problem

Alkemio has a nested content model:

```
Platform
 └─ Space
     └─ Subspace
         └─ Post / Callout
             └─ Response / Comment
```

Every level of this hierarchy needs to answer the same questions:
- **What frames this level?** (header, banner, identity)
- **How does the user orient?** (where am I, what's here, what can I do)
- **How does the user navigate within this level?** (tabs, filters, search)
- **Where does the content live?** (feed, grid, list)

The current prototype answers these questions **differently at each level** without a consistent structural grammar. That's the root of the design tension.

---

## Part 2: The Wireframe Skeleton — Decisions Needed

### 2.1 Platform-level frame

```
┌─────────────────────────────────────────────────────────┐
│  HEADER (fixed)                                         │
│  [Logo] [Global Search] [Notifications] [Profile]       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  PAGE CONTENT (scrolls)                                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  FOOTER                                                 │
└─────────────────────────────────────────────────────────┘
```

**Open questions:**
- Is the header the *only* persistent platform-level element?
- Does the platform level own a global left sidebar (current production has one), or does each page own its own sidebar?
- If no global sidebar: how does the user navigate *between* spaces without going back to Dashboard?

---

### 2.2 The "Page" template — one or two?

The prototype currently uses **two** fundamentally different page templates:

| Template | Used by | Sidebar? | Tabs? |
|----------|---------|----------|-------|
| **MainLayout** | Dashboard, Profile, Settings, Browse | App sidebar (nav) | No |
| **SpaceLayout** | Space tabs, Subspace | Context sidebar (per-page) | Yes |

**Decision:** Is this split intentional and correct, or should there be ONE page template with configurable zones?

---

### 2.3 The three-column question

Most "content" pages in the prototype use a 12-column grid with:

```
┌──────────────────────────────────────────────────┐
│ [2 cols: Left Panel] [8 cols: Content] [2 cols: margin] │
└──────────────────────────────────────────────────┘
```

**Parent-child relationship unclear:**
- Is the left panel a **sibling** of the content? (They sit next to each other, independent)
- Is the left panel a **parent/context** for the content? (It frames what the content means)
- Is the content a **child** of the tab above it? (Tab determines what shows)

If the left panel is context for the *entire* space (static), it's a sibling of the tabs+content block.  
If the left panel is context for the *active tab* (dynamic), it's a child of the tab — same as the content.

**This is the core structural ambiguity the designer flagged.**

---

### 2.4 The banner/identity zone

Every Space and Subspace currently has:

```
┌─────────────────────────────────────────────────────────┐
│  BANNER IMAGE (full-width, 256px)                       │
├─────────────────────────────────────────────────────────┤
│  TITLE + TAGLINE                                        │
├─────────────────────────────────────────────────────────┤
│  [Left Panel]  │  [Tab Bar]                             │
│                │  [Content]                              │
└─────────────────────────────────────────────────────────┘
```

**Questions:**
- Does the banner belong to the **Space** (identity), or to the **page** (decoration)?
- Should it collapse/shrink on scroll, or disappear entirely?
- Is the title+tagline part of the banner, or part of the content zone?
- At what hierarchy level does the user stop seeing a banner? (Space yes, Subspace yes, Post detail no?)

---

## Part 3: Information Hierarchy — What Parents What?

### 3.1 Proposed hierarchy of layout ownership

```
PLATFORM (owns: header, footer, global nav)
 │
 ├─ DASHBOARD PAGE (owns: its own layout — sidebar + activity feeds)
 │
 ├─ SPACE (owns: banner, identity, title)
 │    │
 │    ├─ TAB BAR (owns: navigation between views)
 │    │    │
 │    │    ├─ HOME TAB (owns: left panel content + right feed)
 │    │    ├─ COMMUNITY TAB (owns: left panel content + member grid)
 │    │    ├─ SUBSPACES TAB (owns: left panel content + subspace cards)
 │    │    └─ KNOWLEDGE BASE TAB (owns: left panel content + resources)
 │    │
 │    └─ SUBSPACE (owns: its own header, own tab system)
 │         │
 │         ├─ CALLOUT TABS (owns: filtering of feed below)
 │         └─ LEFT PANEL (owns: challenge info, lead, sub-subspaces)
 │
 ├─ USER PROFILE (owns: its own layout)
 └─ SETTINGS (owns: sidebar nav + settings content)
```

**Key tension:** If each Tab owns its left panel content, then the Tab is the parent of both the left panel and the right content. That means the Tab Bar must sit ABOVE both — spanning full width. This is what the designer is arguing.

### 3.2 Alternative: Left panel as Space-level sibling

```
SPACE (owns: banner, identity, title)
 │
 ├─ LEFT PANEL (sibling — static, belongs to Space, not Tab)
 │    Contains: description, lead, quick actions
 │    Same across all tabs
 │
 └─ TAB ZONE (sibling — dynamic, changes per tab)
      ├─ Tab Bar
      └─ Tab Content (feed, members, cards, etc.)
```

**Trade-off:** The left panel becomes static (same on every tab). Simpler hierarchy, but:
- Where does search go? (It needs to be tab-scoped per designer's rule)
- Where do tags go? (They're tab-specific content)
- The left panel loses utility for returning users who've already read the description

### 3.3 The designer's proposed model (from feedback)

```
SPACE (owns: banner, identity)
 │
 └─ TAB BAR (full-width, above everything)
      │
      └─ TAB VIEW (owns both panels)
           │
           ├─ LEFT PANEL (orient, act, find — scoped to this tab)
           │    ├─ Description (brief, admin-controlled)
           │    ├─ Quick Actions (+ Add Post, Invite, etc.)
           │    ├─ Search (scoped to this tab's content)
           │    ├─ Tags (one line + expand)
           │    └─ Index (footer link, optional)
           │
           └─ RIGHT PANEL (pure content)
                └─ Feed / Grid / List (nothing else)
```

**This is the cleanest hierarchy.** Tab is parent of both panels. Right panel stays pure. Left panel is the "control strip" for that tab's content.

---

## Part 4: Broader Layout Decisions

### 4.1 Consistent structural grammar across levels

| Level | Identity Zone | Orientation Zone | Navigation | Content |
|-------|--------------|------------------|------------|---------|
| **Dashboard** | Welcome header | Left sidebar (nav) | — | Activity feeds |
| **Space** | Banner + title | Left panel (per-tab) | Tab bar (full-width) | Feed/grid |
| **Subspace** | Compact header | Left panel (static?) | Callout tabs | Filtered feed |
| **Post detail** | — | — | — | Post + responses |

**Discussion:** Should these follow the same structural pattern, or is it acceptable that each level has its own layout logic? What's the minimum consistency a user needs to build a mental model?

### 4.2 The Subspace problem

Subspaces currently use CalloutTabs (innovation flow phases) that *look* like Space navigation tabs but *behave* as content filters. 

**Questions:**
- Should subspace callouts use a visually distinct component? (Pill filters vs. underline tabs?)
- Does the subspace left panel follow the same "orient/act/find" model as Space?
- Is the left panel at Subspace level *static* (since there's only one "tab" — the callout filter doesn't change the panel)?
- Where does search live at Subspace level? (Designer says: above posts, since no dynamic left panel)

### 4.3 Depth indicators — how does the user know where they are?

The current prototype relies on:
- URL (invisible to most users)
- Breadcrumbs (exist in some places)
- Banner image (changes per space)
- Title text (changes)

**But there's no consistent "you are HERE" pattern:**
- At Space level, the tab bar tells you which tab is active
- At Subspace level, the callout tabs tell you which phase is active
- There's no persistent indicator saying "you're inside Space X > Subspace Y"

**Discussion:** Do we need a persistent breadcrumb below the header? Or does the banner/title serve this purpose?

### 4.4 Vertical rhythm and viewport budget

Given a 1080px tall viewport:

| Element | Height | Cumulative |
|---------|--------|-----------|
| Header (fixed) | 64px | 64px |
| Banner | 256px (current) | 320px |
| Title + tagline | ~60px | 380px |
| Tab bar (sticky) | ~50px | 430px |
| **First content visible** | — | **430px down** (40% of viewport consumed) |

After scrolling past the banner, the user sees:
- Header (64px, fixed)
- Tab bar (50px, sticky)
- Content

**Discussion:**
- Is 256px banner justified? The designer's wireframe shows maybe 60-80px.
- Should the banner collapse on scroll (parallax/shrink) or just scroll away?
- What's the target: "first meaningful content within 200px of the top on scroll"?

### 4.5 Width allocation

Current prototype uses a 12-col grid:
- Left panel: 2 cols (~16.7% of container)
- Content: 8 cols (~66.7%)
- Right margin: 2 cols (empty)

**At 1440px wide:** Left panel ≈ 230px. Content ≈ 770px. Wasted margin ≈ 230px.  
**At 1920px wide:** Left panel ≈ 310px. Content ≈ 1030px (very wide feed). Margin ≈ 310px.

**Discussion:**
- Is 2 cols enough for the left panel? (Description + search + tags + actions needs more?)
- Should content have a max-width so cards don't stretch too wide?
- Is the right margin truly empty, or could it be reclaimed?
- Does the designer's model (full-width tabs above both panels) change the column math?

### 4.6 The "nothing else on the right" principle

Designer's rule: Right panel = **pure content**. No actions, no chrome, no UI furniture.

**Currently violating this in prototype:**
- "Add Post" button lives in the tab bar (above the right content) — is this acceptable?
- Action icons (Activity, Video, Share, Settings) also live in the tab bar row
- Post cards themselves have hover actions (menu, share)

**Discussion:** "Pure content" means what exactly?
- No top-level actions above the feed? (They move to left panel?)
- No floating action buttons?
- Post-level actions (on hover) are OK because they're part of the content?

---

## Part 5: Open Structural Questions — Priority Order

| # | Question | Impact | Blocking? |
|---|----------|--------|-----------|
| 1 | Full-width tabs (tab owns both panels) vs. tab sits beside static panel | Affects every Space page layout | **Yes** |
| 2 | One page template or two? (MainLayout vs SpaceLayout) | Affects consistency/dev effort | No |
| 3 | Banner height budget (256px vs compact) | Affects first-content viewport line | **Yes** |
| 4 | Left panel width (2 cols enough for search+tags+actions?) | Affects grid math | **Yes** |
| 5 | Subspace: same model as Space, or different layout? | Affects structural consistency | High |
| 6 | Breadcrumb / depth indicator | Affects wayfinding UX | Medium |
| 7 | Where do actions live? (Tab bar vs left panel vs floating) | Affects "pure content" principle | Medium |
| 8 | Right margin: empty vs usable | Affects width efficiency | Low |
| 9 | Responsive collapse strategy | Can defer | Low |
| 10 | Post detail: how does it relate to the shell? (Dialog vs page) | Affects navigation model | Low |

---

## Part 6: Proposed Skeleton to Validate

Based on the designer's feedback, here's the structural skeleton to discuss:

### Space Page (post-scroll)

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (64px, fixed)                                       │
├─────────────────────────────────────────────────────────────┤
│  TAB BAR (sticky, full-width)                               │
│  [Home] [Community] [Subspaces] [KB]           [+ Add Post] │
├──────────────┬──────────────────────────────────────────────┤
│  LEFT PANEL  │  CONTENT (pure)                              │
│  (sticky)    │                                              │
│              │  ┌──────────────────────────────────────┐    │
│  Description │  │ Post Card                            │    │
│              │  └──────────────────────────────────────┘    │
│  + Action    │                                              │
│  + Action    │  ┌──────────────────────────────────────┐    │
│              │  │ Post Card                            │    │
│  🔍 Search   │  └──────────────────────────────────────┘    │
│              │                                              │
│  tag tag tag │  ┌──────────────────────────────────────┐    │
│  [more tags] │  │ Post Card                            │    │
│              │  └──────────────────────────────────────┘    │
│              │                                              │
│  ─────────── │                                              │
│  ≡ Index     │                                              │
├──────────────┴──────────────────────────────────────────────┤
│  FOOTER                                                     │
└─────────────────────────────────────────────────────────────┘
```

### Subspace Page (post-scroll, per designer's rule)

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (64px, fixed)                                       │
├─────────────────────────────────────────────────────────────┤
│  CALLOUT TABS (sticky, full-width)                          │
│  [Phase 1] >> [Phase 2] >> [Phase 3]           [+ Add Post] │
├──────────────┬──────────────────────────────────────────────┤
│  LEFT PANEL  │  CONTENT                                     │
│  (static)    │                                              │
│              │  🔍 Search (here, not in panel)              │
│  Challenge   │  tag tag tag [more]                          │
│  statement   │                                              │
│              │  ┌──────────────────────────────────────┐    │
│  Lead        │  │ Post Card                            │    │
│              │  └──────────────────────────────────────┘    │
│  + Action    │                                              │
│              │  ┌──────────────────────────────────────┐    │
│  Sub-subs    │  │ Post Card                            │    │
│              │  └──────────────────────────────────────┘    │
├──────────────┴──────────────────────────────────────────────┤
│  FOOTER                                                     │
└─────────────────────────────────────────────────────────────┘
```

**Key difference:** At Subspace level the left panel is *static* (doesn't change with callout selection), so search and tags move to the top of the right content area.

---

## Summary: What to lock in before moving forward

1. **Tab placement** → full-width, tab is parent of both panels ✓ (designer's call)
2. **Left panel role per level** → Space: dynamic per tab. Subspace: static.
3. **Search placement rule** → Left panel if dynamic, above content if static panel.
4. **Banner budget** → Agree on max height (suggest ≤100px after scroll or 0 on scroll)
5. **Column allocation** → Is 2/8/2 right, or should left panel be wider (3/7/2)?
6. **Subspace visual differentiation** → How do callout tabs look different from nav tabs?
7. **Actions rule** → Where does "+ Add Post" live? (Tab bar row seems OK per wireframe)

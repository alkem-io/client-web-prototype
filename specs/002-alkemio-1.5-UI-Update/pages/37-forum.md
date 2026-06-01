# Page 37: Forum

> **Route**: `/forum` (listing) + `/forum/discussion/:id` (detail)  
> **Access**: All authenticated users  
> **Ref**: [master-brief.md](../master-brief.md) for component mapping  
> **Current source**: `src/domain/forum/` (platform-level discussions)

---

## Current Layout

The Forum is a **standalone platform-level page** (not inside a Space). It serves as the Alkemio community hub where users can ask questions, read release notes, discuss platform functionalities, and connect with others.

### Forum Listing (`/forum`)

```
┌──────────────────────────────────────────────────────────────────┐
│  Platform Header (Search, Messages, Notifications, Avatar)       │
├──────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Banner: "Welcome to the Alkemio Forum"                     │ │
│  │  Subtitle: Connect, ask questions, stay updated             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────┐  ┌────────────────────────────────────────────┐  │
│  │ Categories │  │  Discussions (38)     [+ INITIATE DISCUSSION]│ │
│  │            │  │  ┌──────────────────────────┐ [Newest ▾]   │  │
│  │ ∞ SHOW ALL│  │  │  Search                  │              │  │
│  │ 🚀 Releases│ │  └──────────────────────────┘              │  │
│  │ ⚙ Platform│  │                                            │  │
│  │ 👥 Community│ │  ┌──────────────────────────────────────┐  │  │
│  │ 🏗 Challenges│ │  │ 🎉 Polls, Group Chats and more!      │  │  │
│  │ ? Need Help│  │  │    Simone R. on Tue, 24/06/2025      │  │  │
│  │ … Other   │  │  │    0 comments                         │  │  │
│  │            │  │  ├──────────────────────────────────────┤  │  │
│  │            │  │  │ 🎨 Introducing Chat, Whiteboards...   │  │  │
│  │            │  │  │    Simone R. on Fri, 13/03/2026       │  │  │
│  │            │  │  │    1 comment                          │  │  │
│  │            │  │  ├──────────────────────────────────────┤  │  │
│  │            │  │  │ ... more discussions                  │  │  │
│  │            │  │  └──────────────────────────────────────┘  │  │
│  └────────────┘  └────────────────────────────────────────────┘  │
│                                                                  │
│  Footer                                                          │
└──────────────────────────────────────────────────────────────────┘
```

### Forum Discussion Detail (`/forum/discussion/:id`)

```
┌──────────────────────────────────────────────────────────────────┐
│  Platform Header                                                 │
├──────────────────────────────────────────────────────────────────┤
│  Banner: "Welcome to the Alkemio Forum"                          │
│                                                                  │
│  ← SEE ALL DISCUSSIONS                                           │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  🎉 Polls, Group Chats and more!              [Share]    │    │
│  │                                                          │    │
│  │  [Avatar] Simone Rietmeijer            [img] [✏] [🗑]   │    │
│  │  "We've got some nice updates..."                        │    │
│  │                                                          │    │
│  │  🗳 Polls: Collect Opinions in Your Space                │    │
│  │    • How to Use: ...                                     │    │
│  │    • Customize Your Poll: ...                            │    │
│  │                                                          │    │
│  │  💬 Group Chats (Beta)                                   │    │
│  │    • How to Start: ...                                   │    │
│  │                                                          │    │
│  │  📝 Post Truncation                                      │    │
│  │    • ...                                                 │    │
│  │                                                          │    │
│  │  📅 Calendar Integration                                 │    │
│  │    • ...                                                 │    │
│  │                                                          │    │
│  │  📂 Subspace Ordering                                    │    │
│  │    • ...                                                 │    │
│  │                                                          │    │
│  │  What's Next? ...                                        │    │
│  │                                                          │    │
│  ├──────────────────────────────────────────────────────────┤    │
│  │  Threaded Replies                                        │    │
│  │  ┌────────────────────────────────────────────────────┐  │    │
│  │  │ [Avatar] User Name — timestamp                     │  │    │
│  │  │ Reply content...                                   │  │    │
│  │  │    ┌──────────────────────────────────────────┐    │  │    │
│  │  │    │ [Avatar] Nested reply...                 │    │  │    │
│  │  │    └──────────────────────────────────────────┘    │  │    │
│  │  └────────────────────────────────────────────────────┘  │    │
│  │                                                          │    │
│  │  [😊] [📎] Add further information on the discussion [→] │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Footer                                                          │
└──────────────────────────────────────────────────────────────────┘
```

### Key structural elements:
- **Forum Banner**: Decorative header with illustrations, welcome message, subtitle
- **Sidebar Navigation**: Fixed list of discussion categories with icons
- **Discussion List**: Searchable list with title, author, date, comment count, category icon
- **Discussion Detail**: Full post content with rich text, threaded replies, reply composer
- **Initiate Discussion**: Modal dialog with Title + Category selector + Rich text editor
- **Sort Control**: Newest / Oldest dropdown

---

## Categories (Fixed)

| Icon | Label | Description |
|------|-------|-------------|
| ∞ | Show All | All discussions across categories |
| 🚀 | Releases | Platform release notes and changelogs |
| ⚙️ | Platform Functionalities | Feature discussions and how-tos |
| 👥 | Community Building | Tips for growing communities |
| 🏗️ | Working Challenge Centric | Challenge-focused collaboration |
| ❓ | Need Help? | Support questions |
| … | Other | Uncategorized discussions |

---

## Element Inventory

### Forum Banner
| Element | Current Component | New Component (shadcn) | Notes |
|---------|------------------|----------------------|-------|
| Banner container | Custom div + background image | Tailwind + background image | Full-width, illustrated |
| Welcome heading | `Typography` h4 | `h2` with Tailwind | "Welcome to the Alkemio Forum" |
| Subtitle | `Typography` body | `p` with Tailwind | Description text |
| Illustrations | Background images | Keep as background/decorative | Character illustrations |

### Category Sidebar
| Element | Current Component | New Component (shadcn) | Notes |
|---------|------------------|----------------------|-------|
| Sidebar container | Custom nav | `Card` or Tailwind `aside` | Left-aligned, fixed width |
| Category item | Custom list item / button | `Button` variant="ghost" | Icon + label, active state |
| Active indicator | Background highlight | `bg-primary text-primary-foreground` | Selected category |
| Category icon | MUI icon / emoji | Lucide icon or emoji | Per-category indicator |

### Discussion List
| Element | Current Component | New Component (shadcn) | Notes |
|---------|------------------|----------------------|-------|
| List header | "Discussions (N)" | `h3` with count badge | Discussion count |
| Search input | `TextField` | `Input` (shadcn) with search icon | Filter discussions |
| Sort dropdown | `Select` | `Select` (shadcn) | Newest, Oldest |
| Discussion item | Custom list row | Card-like row or list item | Clickable, hover state |
| Category emoji | Emoji prefix | Inline emoji or Lucide icon | Visual category indicator |
| Discussion title | `Typography` link | `a` / `Link` with hover underline | Bold, clickable |
| Author + date | `Typography` caption | `text-sm text-muted-foreground` | "Author on Date" |
| Comment count | `Typography` caption | `text-sm text-muted-foreground` | "N comments" |
| Initiate button | `Button` primary | `Button` (shadcn) variant="default" | Top-right CTA |

### Discussion Detail
| Element | Current Component | New Component (shadcn) | Notes |
|---------|------------------|----------------------|-------|
| Back link | Custom link | `Button` variant="link" + Arrow icon | "← SEE ALL DISCUSSIONS" |
| Post container | Custom card | `Card` (shadcn) | White, padded |
| Post title | `Typography` h5 | `h2` with Tailwind | Discussion title |
| Share button | `IconButton` | `Button` variant="ghost" size="icon" | Share icon |
| Author row | Avatar + name + actions | `Avatar` + text + action buttons | Edit/Delete for author |
| Post body | Rich text / Markdown | Rendered markdown with Tailwind prose | Formatted content |
| Reply section | Custom list | Nested `Card` components | Threaded replies |
| Reply item | Custom reply component | Avatar + content + timestamp | Indented for nesting |
| Nested reply | Indented reply | Left-border + padding | Visual thread indicator |
| Reply composer | `TextField` + buttons | `Input` or `Textarea` + emoji/attach buttons | Sticky bottom or inline |
| Send button | `IconButton` | `Button` variant="default" size="icon" | Arrow/send icon |

### Initiate Discussion Dialog
| Element | Current Component | New Component (shadcn) | Notes |
|---------|------------------|----------------------|-------|
| Modal container | Custom dialog | `Dialog` (shadcn) | Large centered modal |
| Modal header | "Alkemio Forum - Initiate Discussion" | `DialogHeader` + `DialogTitle` | Title + close X |
| Title input | `TextField` | `Input` (shadcn) | Placeholder: "Title" |
| Category select | `Select` | `Select` (shadcn) | Required, label "Category" |
| Rich text editor | `MarkdownEditor` / TipTap | Keep rich text editor | Toolbar: undo, redo, B, I, H1-H4, lists, blockquote, code, hr, table, link, image, video, emoji |
| Create button | `Button` primary | `Button` (shadcn) variant="default" | "CREATE DISCUSSION" |
| Close button | `IconButton` X | `DialogClose` | Top-right |

---

## Visual Requirements

### Layout
- **Sidebar width**: ~220px fixed
- **Content area**: Flexible, max-width container
- **Banner**: Full-width with decorative illustrations (light blue background, floating character illustrations)
- **Discussion list items**: Bordered bottom, no card separation per item
- **Responsive**: Sidebar collapses to top filter bar on mobile

### Colors & Styling
- **Banner background**: Light blue gradient with illustration overlay
- **Active category**: Primary color background with white text
- **Category sidebar**: White/card background with rounded corners
- **Discussion items**: Minimal borders, subtle hover state
- **Thread nesting**: Left border (2px primary/muted) with indent per level

### Typography
- **Banner heading**: `text-xl font-semibold text-white`
- **Discussion titles**: `text-sm font-semibold text-foreground hover:underline`
- **Author/meta**: `text-xs text-muted-foreground`
- **Post body**: `prose` class for rich text rendering

---

## Personas

| Persona | Primary Actions | Notes |
|---------|----------------|-------|
| **Contributor** | Browse discussions, reply, initiate discussions | Default experience |
| **Facilitator** | Same as contributor + manage categories (future) | Currently fixed categories |
| **Portfolio Owner** | Same as contributor + can pin/moderate discussions | Admin controls |

---

## Prototype Plan

### Components to Build
1. **`ForumPage.tsx`** — Main page shell: Banner + Sidebar + Discussion List
2. **`ForumDiscussionDetail.tsx`** — Detail view: Post content + Threaded replies + Composer
3. **`ForumBanner.tsx`** — Decorative welcome banner (reusable across both views)
4. **`ForumCategoryNav.tsx`** — Sidebar category navigation
5. **`ForumDiscussionList.tsx`** — Filterable/searchable discussion list
6. **`ForumDiscussionItem.tsx`** — Single discussion row in list
7. **`ForumReplyThread.tsx`** — Threaded/nested reply component
8. **`InitiateDiscussionDialog.tsx`** — Create discussion modal

### Reusable Components from Existing Prototype
- `Avatar` — Author profiles
- `Badge` — Category tags, comment counts
- `Button` — CTA, navigation, actions
- `Card` — Post container, sidebar container
- `Dialog` — Initiate Discussion modal
- `Input` — Search, title input
- `Select` — Sort, category selector
- `Separator` — Between list items
- `Tooltip` — Action button hints
- `DropdownMenu` — Post actions (edit, delete, pin)
- Markdown editor — Rich text for both creation and display

### shadcn Components Required
`Card`, `Avatar`, `Badge`, `Button`, `Input`, `Select`, `Dialog`, `DialogHeader`, `DialogTitle`, `DialogClose`, `Separator`, `DropdownMenu`, `Tooltip`, `ScrollArea`

---

## Pull-Back Notes

- [ ] **Banner style** — Must match the current illustrated banner with floating character illustrations on light blue background. Not a plain colored header.
- [ ] **Discussion list style** — Simple list rows with bottom borders, NOT individual cards per discussion. Matches current platform exactly.
- [ ] **Category sidebar** — White card with icon + text items, active state uses primary background color.
- [ ] **Threaded replies** — Current shows simple replies. Redesign adds nested threading per user choice.
- [ ] **Rich text editor toolbar** — Must match current toolbar buttons: undo, redo, B, I, H1-H4, UL, OL, blockquote, code, hr, table, link, image, video, emoji.

---

## Allowed Improvements

- **Cleaner category icons** — Lucide icons instead of emojis for consistency with rest of platform
- **Better search** — shadcn Input with search icon prefix, clear button
- **Improved thread UI** — Visual threading with indent + left border (more readable than flat)
- **Responsive sidebar** — Collapse to horizontal pills on mobile/tablet
- **Keyboard navigation** — Arrow keys to navigate discussion list
- **Empty states** — Friendly empty state when no discussions match filter/search

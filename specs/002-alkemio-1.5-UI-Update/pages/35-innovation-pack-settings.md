# Innovation Pack Settings — Design Brief

> **Route**: `/templates/packs/:packSlug/settings` (prototype) / `/innovation-packs/:id/settings` (platform)  
> **Access**: Pack owner/admin  
> **Group**: 📦 Innovation Packs  
> **Team**: 🎨 Design  
> **Status**: Draft  
> **Last updated**: 2026-05-05

---

## Overview

Settings page for managing an Innovation Pack (template pack). Allows the pack owner to edit the pack's profile metadata and manage the templates within it. Uses the same horizontal tab bar pattern as Space Settings and User Profile Settings.

---

## Page Structure

### Header (sticky, matches Space Settings)

- Pack avatar (editable)
- Pack name (text, not editable here — shown for context)
- Provider name (subtitle)
- Horizontal tab bar: **About** | **Templates**

### Route structure

```
/templates/packs/:packSlug/settings          → redirects to /about
/templates/packs/:packSlug/settings/about    → About tab
/templates/packs/:packSlug/settings/templates → Templates tab
```

---

## Tab 1: About

Editable profile form for the pack itself. All fields match the current platform exactly — no additions.

### Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Avatar | Image upload | No | Round thumbnail for the pack |
| Name | Text input | Yes | Display name |
| Provider | Text (read-only or dropdown) | Yes | Organization that owns the pack |
| Listed in Store | Checkbox/toggle | No | Whether the pack appears in the public library |
| Search Visibility | Select (Public / Private) | No | Controls who can find this pack |
| Description | Rich text editor | No | What the pack is for, how to use it |
| Tags | Tag input (multi-value) | No | Categorization keywords |
| References | Repeatable row (Title + URL + delete) | No | External links (docs, guides, etc.) |

### Actions

- **Save** button (bottom-right, primary)
- Unsaved changes indicator (optional, matches other settings pages)

### Layout

Single card container within the 10-column centered grid, matching Space Settings About tab exactly.

---

## Tab 2: Templates

Grid/list of all templates in this pack, grouped by type, with ability to create new or navigate to individual template settings.

### Template types (sections)

Templates are grouped into collapsible sections by type:

- **Space Templates** — full space configurations
- **Subspace Templates** — subspace configurations  
- **Collaboration Tool Templates** — posts with attached whiteboards, collections, etc.
- **Whiteboard Templates** — standalone whiteboard canvases
- **Post Templates** — text/content post templates
- **Community Guidelines Templates** — guidelines documents

### Per section

- Section header with template count + **Create New** button (right-aligned)
- Card grid (responsive, same card style as existing Template Pack Detail page)
- Each card shows: thumbnail preview, template name, tags
- Card actions: click → navigates to individual template settings page

### Empty state

If a section has no templates: "No templates yet" + Create New button.

---

## Individual Template Settings Page

> **Route**: `/templates/packs/:packSlug/settings/templates/:templateId`  
> Navigated to from the Templates tab card grid.

### Header (sticky)

- Back arrow → returns to Pack Settings / Templates tab
- Template name (context)
- Template type badge (e.g., "Collaboration Tool", "Whiteboard")
- Horizontal tab bar: **About** | **Content**

### Route structure

```
/templates/packs/:packSlug/settings/templates/:templateId          → redirects to /about
/templates/packs/:packSlug/settings/templates/:templateId/about    → About tab
/templates/packs/:packSlug/settings/templates/:templateId/content  → Content tab
```

---

### Template Tab 1: About

Template metadata — the "what is this template" fields.

| Field | Type | Notes |
|-------|------|-------|
| Template title | Text input | Internal name for the template |
| Template description | Rich text (short) | Explains what the template is for |
| Template tags | Tag input | Categorization |

Actions: **Save**, **Delete** (destructive, bottom-left)

---

### Template Tab 2: Content

The actual template content that gets applied when someone uses it. Fields vary by template type:

#### For Collaboration Tool templates:

| Field | Type | Notes |
|-------|------|-------|
| Title | Text input | Post title when applied |
| Tags | Tag input | Default tags |
| Description | Rich text editor | Post body content |
| Additional Content | Selector: None / Whiteboard / Memo / Call To Action / Media Gallery / Poll | What gets attached |
| Content preview | Preview area + EDIT button | Opens editor for the additional content (e.g., whiteboard editor) |
| References | Repeatable (+ Add Reference) | Links/attachments |
| Response Options | Expandable section | Comments toggle, Collection type (None / Links & Files / Posts / Memos / Whiteboards) |

#### For Whiteboard templates:

| Field | Type | Notes |
|-------|------|-------|
| Content preview | Large preview + EDIT button | Opens whiteboard editor |

#### For Space / Subspace templates:

| Field | Type | Notes |
|-------|------|-------|
| Banner image | Image upload | Default banner |
| Description | Rich text | Default space description |
| Default tabs / structure | Configuration | What tabs/channels the space starts with |

#### For Post templates:

| Field | Type | Notes |
|-------|------|-------|
| Title | Text input | Default post title |
| Description | Rich text | Default post body |
| Tags | Tag input | Default tags |
| Additional Content | Selector | Same as Collaboration Tool |

#### For Community Guidelines templates:

| Field | Type | Notes |
|-------|------|-------|
| Guidelines content | Rich text | The guidelines document |
| Categories | Repeatable sections | Guideline categories with previews |

Actions: **Update** (primary), **Delete** (destructive)

---

## Design Principles

1. **Match existing patterns** — Same sticky header, tab bar, card containers, grid, and spacing as Space Settings
2. **No new UI patterns** — Reuse existing form components (rich text editor, tag input, image upload, toggles)
3. **No new features** — Only what the current platform supports, reskinned to match the redesign
4. **Template type awareness** — Content tab adapts its form fields based on the template's type

---

## Navigation Flow

```
Template Library (browse)
  └─ Template Pack Detail (view/apply) ← already built (#17)
       └─ [Settings button] → Pack Settings / About tab
                                Pack Settings / Templates tab
                                  └─ [Click template card] → Template Settings / About
                                                              Template Settings / Content
```

---

## Reference Components (reuse from prototype)

- `SpaceSettingsPage.tsx` — sticky header + horizontal tab bar pattern
- `SpaceSettingsAbout.tsx` — form card layout with rich text + tags
- `SpaceSettingsTemplates.tsx` — template grid with sections + Create New buttons
- `TemplatePackDetail.tsx` — template card grid (read-only version)
- `TemplateDetail.tsx` — template preview rendering by type

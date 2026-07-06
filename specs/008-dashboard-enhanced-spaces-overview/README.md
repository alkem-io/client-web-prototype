# Enhanced Dashboard Spaces Overview — Complete Specification

**Project**: Shadcn UI Redesign  
**Feature**: Multi-row dashboard with categorized spaces  
**Status**: Design Brief Complete → Ready for Figma Design Phase  
**Created**: 2026-07-06  
**Owner**: [To be assigned]

---

## What Is This?

This is a **complete design brief** for enhancing the current dashboard "Normal" view (from spec 007-dashboard-spaces-view) with a multi-row layout that organizes spaces by relationship type and activity level.

**Current State**: Single gallery of all spaces  
**Future State**: 5 categorized rows (Pinned → Recent → Leading → Hosting → Active)

---

## How to Use These Documents

### For Designers (Figma)
1. **Start here**: Read `design-brief.md` sections 1–7 (problem, principles, layout)
2. **Reference**: Use `visual-reference.md` for exact spacing, sizing, and component anatomy
3. **Create mockups** covering 3 breakpoints:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1440px)
4. **Edge cases**: Include designs for empty states, placeholder cards, modals
5. **Annotation**: Add notes on deduplication logic and row visibility rules
6. **Handoff**: Export to code components when ready

### For Developers (Prototype)
1. **Understand structure**: Read `design-brief.md` section 5 (row specifications)
2. **Implementation reference**: Follow `implementation-guide.md` for component architecture
3. **Data model**: Extend mock data per section 9 (`implementation-guide.md`)
4. **Test coverage**: Use checklist in `implementation-guide.md` section "Testing Checklist"
5. **Build**: Create components in prototype from Figma design
6. **Verify**: Test all edge cases and responsive breakpoints

### For Product Managers
- **Problem**: `design-brief.md` section 2 explains the user need
- **Success criteria**: `design-brief.md` section 15 (acceptance criteria)
- **Scope**: Everything listed is included; features in section 14 are future

### For QA / Test Engineers
- **Test Plan**: `implementation-guide.md` → "Testing Checklist"
- **Edge Cases**: `design-brief.md` section 8
- **User Scenarios**: Test the 5 row types in various user states (new user, lead, host, etc.)

---

## Document Breakdown

### 1. design-brief.md (Main Specification)
**Length**: ~600 lines  
**Contains**:
- Problem statement and design principles
- Row structure with detailed specs (Sections 4–6)
- Deduplication logic (Section 7)
- Component structure and styling (Section 7)
- Empty states and edge cases (Section 8)
- Mock data requirements (Section 9)
- Key behaviors and interactions (Section 10)
- Responsive breakpoints (Section 11)
- Visual refinements (Section 12)
- Implementation checklist (Section 13)

**Key Takeaway**: The "what" and "why" of the feature

---

### 2. implementation-guide.md (Developer Reference)
**Length**: ~400 lines  
**Contains**:
- Quick reference table of all 5 rows
- Component architecture (EnhancedSpacesGallery + 8 sub-components)
- Code examples for each component (TSX)
- Data filtering functions (with deduplication logic)
- Mock data extension (new fields)
- Changes to Dashboard.tsx (minimal)
- Testing checklist
- Performance & accessibility notes

**Key Takeaway**: The "how" to build it in code

---

### 3. visual-reference.md (Designer & Developer Reference)
**Length**: ~400 lines  
**Contains**:
- Full page layout diagram (ASCII art)
- Row details with spacing
- Space card anatomy (standard & placeholder)
- Responsive breakpoint grids
- Modal layouts (Show More, Browse & Pin)
- Placeholder card click flow (diagram)
- Row visibility decision tree
- Spacing & sizing reference (Tailwind)
- Color & styling specs
- Error & empty states
- Print/measurement reference
- Interaction states
- Accessibility notes

**Key Takeaway**: The "where" and "what it looks like"

---

## The Workflow: Brief → Design → Prototype → Development

### Phase 1: Design (This Week)
```
Figma Designer reads:
  ├─ design-brief.md (Sections 1–7)
  ├─ visual-reference.md (Sections 1–5, 9–14)
  └─ prototype dashboard for context

Figma Designer creates:
  ├─ Desktop mockup (4-column layout, all 5 rows)
  ├─ Tablet mockup (3-column layout)
  ├─ Mobile mockup (2-column layout)
  ├─ Empty state mockups
  ├─ Modal mockups (Show More, Browse & Pin)
  └─ Component annotations (row titles, spacing, etc.)

Deliverable: Figma file with 8–12 artboards covering all states
```

### Phase 2: Prototype (Next Week)
```
Prototype Developer reads:
  ├─ Figma design file
  ├─ implementation-guide.md (Sections 2–6)
  └─ design-brief.md (Sections 5–10)

Prototype Developer builds:
  ├─ EnhancedSpacesGallery component
  ├─ 5 row components (Pinned, Recent, Lead, Host, Activity)
  ├─ Placeholder card component
  ├─ 2 modal components (Show More, Browse & Pin)
  ├─ Mock data with new fields
  ├─ Deduplication logic
  └─ Responsive grid layouts

Deliverable: Working prototype matching Figma design across all breakpoints
```

### Phase 3: Development (Later)
```
Development Team reads:
  ├─ prototype (to see final design)
  ├─ implementation-guide.md (Sections 1–7)
  └─ design-brief.md (Sections 5, 8–10)

Development Team builds:
  ├─ Replicate prototype components in production codebase
  ├─ Connect to real data (GraphQL queries or REST endpoints)
  ├─ Implement pinning logic (backend persistence)
  ├─ Add real activity scoring
  └─ Deploy to production

Testing:
  ├─ Unit tests (filtering & deduplication logic)
  ├─ Integration tests (API calls, pinning, modals)
  └─ E2E tests (full user flows)

Deliverable: Production feature live on dashboard
```

---

## Key Design Decisions

### 1. Smart Deduplication
**Why**: A user's pinned spaces might also be their most-recent spaces. We show them once, in the highest-priority row. This prevents duplicate cards and keeps the view clean.

**Decision**: Priority order is Pinned → Recent → Lead → Host → Activity. Highest-priority row "wins."

### 2. Placeholder Cards for Pinned Row
**Why**: Row 1 (Pinned) always shows, even if the user has 0 pinned spaces. This provides an obvious entry point to pin spaces without needing a separate "no data" state.

**Decision**: Use consistent placeholder card design from Profile > Account tab, with "Pin a space" text.

### 3. Show More vs. Max 4
**Why**: Rows 3 & 4 (Lead, Host) might have many spaces. We show first 4 to keep the initial dashboard scannable, then offer "Show More" in a modal for the full list.

**Decision**: Max 4 visible per row. Rows 1, 2, 5 have hard limits (no Show More). Rows 3, 4 show first 4, button if >4.

### 4. Modal for Show More
**Why**: Rather than paginating inline, a centered modal provides a focused browsing experience without losing the overall dashboard context.

**Decision**: Show More button opens centered modal (same style as activity dialogs), full grid, scrollable.

### 5. Categorization Criteria
**Why**: Users need different ways to find spaces:
- Pinned: Quick access to favorites
- Recent: Spaces they're actively working in
- Lead/Host: Spaces they own/manage
- Activity: Discover high-engagement areas

**Decision**: Five separate categories with different sort orders (pinned date, last edited, creation date, activity score).

---

## Success Metrics

### Design Phase
- ✅ Figma file has all 5 rows + edge cases
- ✅ Responsive across 3 breakpoints
- ✅ Annotations document spacing, deduplication, visibility rules

### Prototype Phase
- ✅ All 5 rows render correctly
- ✅ Deduplication logic verified (no duplicates)
- ✅ Modals open/close smoothly
- ✅ Responsive design works on mobile/tablet/desktop
- ✅ Edge cases handled (0 spaces, all rows empty, etc.)

### Development Phase
- ✅ Feature live on production dashboard
- ✅ Real data integration (pinning, activity, roles)
- ✅ User can pin/unpin spaces
- ✅ All 5 rows filter correctly from real data
- ✅ Performance acceptable (no N+1 queries)

---

## Open Questions

The following may need clarification during design/development:

1. **Activity Scoring**: How is "activity" calculated? (posts + comments + edits? weighted? time decay?) → Dev team decides; design doesn't need to know
2. **Time Windows**: "Recent" = last 30 days? "Activity" = last 30 days? → Configurable; design assumes reasonable defaults
3. **Pinning Persistence**: Prototype stores in localStorage. Production should persist to backend. → Development phase concern
4. **New User Experience**: Should we show a CTA banner ("Browse spaces" link) if all rows are empty? → Design decision
5. **Reordering Pinned Spaces**: Should users be able to drag-to-reorder within Row 1? → Future enhancement (not in this brief)
6. **Private Space Indicators**: Do locked/private spaces show in these rows? Are they filtered? → Likely yes, but confirm with product

---

## Not Included (Future Enhancements)

The following are explicitly out of scope:

- **Drag-to-reorder**: Reordering pinned spaces by drag
- **Filters**: Per-row filters (e.g., "Show only active in last 7 days")
- **Search**: Global search across all spaces
- **Favorites vs. Pinned**: Distinction between these two concepts
- **Activity Metrics Display**: Showing post/comment counts per space
- **Notifications**: Highlighting spaces with new activity
- **Bulk Actions**: Multi-select and bulk pinning

These can be added in future iterations if needed.

---

## File Structure

```
specs/008-dashboard-enhanced-spaces-overview/
├── README.md                    (this file)
├── design-brief.md              (main specification)
├── implementation-guide.md       (code reference)
└── visual-reference.md          (layout & spacing reference)
```

---

## Communication Checklist

- [ ] Share this brief with Design team (Figma owner)
- [ ] Share this brief with Prototype developer
- [ ] Schedule design review kickoff meeting
- [ ] Define "Activity" metric in dev team meeting
- [ ] Clarify any open questions (see above)
- [ ] Review Figma mockups against design-brief.md
- [ ] Review prototype implementation against implementation-guide.md
- [ ] Sign off before development phase begins

---

## Timeline Estimate

- **Design Phase**: 3–5 days (mockups + annotations)
- **Prototype Phase**: 5–7 days (component build + testing)
- **Development Phase**: 2–3 weeks (real data, API integration, backend logic)
- **QA/Testing**: 1 week (edge cases, browsers, accessibility)
- **Total**: ~5–6 weeks from brief → production

---

## References & Context

- **Original Spec**: `specs/007-dashboard-spaces-view/spec.md` — The original "Normal" view
- **Prototype Codebase**: `Resources/prototype/src/app/components/dashboard/`
- **Current SpacesGallery**: `Resources/prototype/src/app/components/dashboard/SpacesGallery.tsx`
- **Mock Data**: `Resources/prototype/src/app/components/memberships/membershipData.ts`
- **Design System**: `specs/002-alkemio-1.5-UI-Update/master-brief.md` — shadcn component mapping

---

## Approval & Sign-Off

| Role | Name | Status | Date |
|------|------|--------|------|
| Product Manager | [TBD] | ⬜ Pending | — |
| Design Lead | [TBD] | ⬜ Pending | — |
| Dev Lead (Prototype) | [TBD] | ⬜ Pending | — |
| Dev Lead (Production) | [TBD] | ⬜ Pending | — |

---

**Questions?** Refer to the appropriate document above, or file a new issue in the project tracker.

**Ready to start?** → Hand off `design-brief.md` & `visual-reference.md` to Figma designer to begin mockups.

# Missing Pages — Gap Analysis

> Comparison of the live Alkemio platform routes against our redesign specs and prototype.  
> Last updated: 2026-05-04

---

## High Priority — Core User Flows

| # | Page | Route | Group | Why it matters | Team |
|---|------|-------|-------|----------------|------|
| 1 | **Login / Sign In** | `/identity/signin` | 🔑 Auth | Entry point for every user | 🎨 Design |
| 2 | **Registration / Sign Up** | `/identity/register` | 🔑 Auth | Account creation flow | 🎨 Design |
| 3 | **Contributors Directory** | `/contributors` | — | Top-level nav: browse Users, VCs, and Organizations | 🛠️ Dev |
| 4 | **Virtual Contributor Profile** | `/vc/:vcId` | 🤖 VC Pages | Public profile for AI assistants | 🎨 Design |
| 5 | **Virtual Contributor Knowledge Base** | `/vc/:vcId/knowledge-base` | 🤖 VC Pages | VC's training documents | 🎨 Design |
| 6 | **Organization Profile** | `/organization/:orgId` | — | Public org profile — members, spaces | 🛠️ Dev |
| 7 | **Forum / Discussions** | `/forum` | 💬 Forum | Platform-wide discussion board with categories | 🎨 Design |
| 8 | **Forum Discussion Detail** | `/forum/discussion/:id` | 💬 Forum | Individual threaded discussion | 🎨 Design |

---

## Medium Priority — Settings & Specialized

| # | Page | Route | Group | Why it matters | Team |
|---|------|-------|-------|----------------|------|
| 9 | **User Security Settings** | `/user/me/settings/security` | 👤 User Profile | Password, 2FA | 🛠️ Dev |
| 10 | **User General Settings** | `/user/me/settings/settings` | 👤 User Profile | Language, preferences | 🛠️ Dev |
| 11 | **Organization Settings** | `/organization/:orgId/settings/*` | — | Org admin management | 🛠️ Dev |
| 12 | **VC Settings** | `/vc/:vcId/settings/*` | 🤖 VC Pages | VC owner configuration | 🛠️ Dev |
| 13 | **Innovation Hub Landing** | `/hub/:hubId` | 🏠 Innovation Hubs | Custom homepage for organizations | 🎨 Design |
| 14 | **Innovation Hub Settings** | `/hub/:hubId/settings` | 🏠 Innovation Hubs | Custom homepage config | 🎨 Design |
| 15 | **Access Restricted Page** | `/restricted` | — | Shown when lacking permissions | 🛠️ Dev |
| 16 | **Space Custom Tab** | Dynamic section index ≥ 3 | — | Admin-configurable extra tabs | 🛠️ Dev |

---

## Lower Priority

| # | Page | Route | Group | Why it matters | Team |
|---|------|-------|-------|----------------|------|
| 17 | **Innovation Pack Profile** | `/innovation-packs/:id` | 📦 Innovation Packs | Browse a pack's templates | 🎨 Design |
| 18 | **Innovation Pack Settings** | `/innovation-packs/:id/settings` | 📦 Innovation Packs | Pack owner management | 🎨 Design |
| 19 | **Platform Admin** (all pages) | `/admin/*` | — | Very low prio | 🎨 Design |

---

## Groups Summary

| Group | Pages | Notes |
|-------|-------|-------|
| 🔑 Auth | 1, 2 | Can be built together |
| 🤖 VC Pages | 4, 5, 12 | Shared layout/nav |
| 💬 Forum | 7, 8 | Shared layout |
| 👤 User Profile | 9, 10 | Extend existing settings |
| 🏠 Innovation Hubs | 13, 14 | Shared layout |
| 📦 Innovation Packs | 17, 18 | Shared layout |
| Standalone | 3, 6, 11, 15, 16 | Independent |

---

## Team Breakdown

| Team | Pages | Count |
|------|-------|-------|
| 🎨 Design (from scratch) | 1, 2, 4, 5, 7, 8, 13, 14, 17, 18, 19 | 11 |
| 🛠️ Dev (self-design) | 3, 6, 9, 10, 11, 12, 15, 16 | 8 |

### Summary: Mobile Navigation & Back Flow Redesign

#### Why We’re Doing This
When using the app on mobile (especially as an installed app/PWA), there is no browser back button. Because desktop breadcrumbs are hidden on mobile screens, users had no quick way to navigate back up once they drilled into a space, sub-space, or settings view.

---

#### The Solution

**Header Layout:**
`[⌂ Home] › [...]` -------------------- `[👤 Profile] [💬 Chat (2)]`

##### 1. Left Side: Compact Breadcrumb (`[Home] › [...]`)
* **Root Level (Home/Dashboard)**: Displays only the **Home icon** (`[⌂]`).
* **Drilled-in Views (Spaces, Subspaces, Settings)**: Displays **`[Home] › [...]`**.
  * **`[Home]`**: Always provides a **1-tap return** to the main dashboard.
  * **`[...]`**: Tapping opens a **hierarchy dropdown menu** with visual indentation showing the exact path:
    * ⌂ Home
    * ↳ ⊞ Spaces
      * ↳ 🟢 Green Energy (Space)
        * ↳ 🟢 Urban Mobility (Subspace)
          * ↳ 🔴 Pilot Study **[Current]**

##### 2. Right Side: Clean 2-Target Action Group
Rather than crowding 5+ small icons across a narrow phone screen, the header is streamlined to two circular touch targets:
* **Profile Circle (`[👤]`)**: Houses secondary utilities like **Search, Notifications, My Spaces, and Settings**.
* **Chat Circle (`[💬]`)** *(outermost right)*: Displays an unread badge indicator. Tapping it opens a **slide-in chat drawer from the right edge** (LinkedIn mobile style) so users can check messages without losing their current page context.

---

#### Interactive Prototype
You can test the flow directly on the live prototype:  
https://back-nav-share.vercel.app/interactive.html


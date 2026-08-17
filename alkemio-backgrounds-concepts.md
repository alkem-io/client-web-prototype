# Alkemio Video Call Backgrounds — Concept Options

## Research Findings

### What Alkemio does (one sentence)

Alkemio is a European platform that gives organisations a shared digital workspace — a "Space" — to collaborate on complex public challenges that none of them can solve alone.

### Strategic positioning and language

From the strategy vault (Vision, Message House, Strategic Narrative):

- **Primary line:** "Collaboration in the spaces between organisations."
- **North Star (2029):** "Alkemio is Europe's trusted platform for collaboration between organisations on complex public challenges."
- **Four pillars (unique proposition):** (1) Collaboration in the spaces between organisations, (2) Building ecosystem capability, (3) Designed for trust and resilience — steward-ownership and digital sovereignty, (4) Partnering with the pioneers.
- **The "different game":** "Market-responsive, aligned with public interests by structural design." The combination of all four pillars is what makes it hard to copy — replicating it requires structural choices, not just features.
- **Strategic narrative themes:** Collective capability for societal challenges; European values-aligned digital platforms; trust as economic foundation; the "third mode" of government (involve, not just compel or incentivise).

### Stated values and principles

- **European.** Hosted in Europe, not dependent on US big tech. Digital sovereignty by design.
- **Steward-owned.** Voting rights not for sale; prevents extraction of value; purpose-driven governance.
- **Open-source.** Transparent, learnable, forkable.
- **Public interest tech.** Aligned with public interests by structural design, not just intent.
- **Not extractive.** No data selling, no ads, no exploitative algorithms. Subscription-based.
- **Inclusive collaboration over polarisation.**

### Colour palette (with hex values)

Source: `strategy.alkemio.org/05-Communications/brand-guidelines` and the identity document at `05-Communications/7-Collateral-Engine/brand/identity`.

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| **Ink** | `--a-ink` | `#1D384A` | Default text. Dark canvas. The workhorse. |
| **Cyan** | `--a-cyan` | `#09BCD4` | The logo mark. Accents on dark grounds only. |
| **Cyan deep** | `--a-cyan-deep` | `#0787A5` | Same hue, darkened. Accents on light/tint grounds. |
| **Slate** | `--a-slate` | `#2D546A` | Secondary marks, dividers on dark grounds. Rare. |
| **Tint canvas** | (data-canvas="tint") | `#F1F5F9` | Series, secondary cards. |
| **CRD neutrals** | `--a-n50` … `--a-n800` | `#F1F5F9` … `#1E293B` | Product UI depictions only. |

**Marketing neutrals** (`--a-m-*`): The brand guidelines reference tokens named SLATE, WASH, LINE, and PAPER from the "LinkedIn Visual Kit" — used for body text, subtle fills, hairlines, and canvases in large-format collateral. **I could not retrieve the explicit hex values** from the published vault pages (the source JSON file `alkemio.tokens.json` is not served as a readable page). Please supply these if you want me to use them, or I will interpolate from the documented ramp (`#F1F5F9` lightest → `#1D384A` darkest).

**Confirmed from GitHub (`client-web/src/index.css`):** Primary = `#1D384A` (matches Ink).

### Key brand constraint (flagged)

The identity document states: *"Never gradients. Never cyan-to-blue washes."* — however this rule governs the **Communications collateral engine** (social cards, slides, one-pagers). Video call backgrounds are a distinct surface. The brief explicitly requests gradient specifications, and the logo zone is specified as "flat fill or very smooth gradient." I am proceeding as briefed but flagging this so Fintan and Robin can rule on whether the collateral "no gradients" policy extends to internal video backgrounds.

---

## Concept 1 — "The Space Between"

### Rationale

The primary positioning line made visual: two large, soft landmasses of colour anchored at opposite edges of the frame, with the person sitting in the luminous open ground between them. The metaphor is the gap between organisations — the space where Alkemio exists. The shapes are deliberately not identical (different organisations) but harmonious (collaborative), and the gap between them holds all the light.

### Figma AI Prompt

```
Create a 1920 × 1080 px frame.

BACKGROUND FILL
Linear gradient, 135° (top-left to bottom-right).
Light variant: #FFFFFF at 0%, #F1F5F9 at 100%.
Dark variant: #1D384A at 0%, #162D3B at 100%.

LAYER GROUP: "Left Landmass"
A large rounded organic shape (superellipse, squircle-like, not a perfect circle) positioned with its centre at x: 280, y: 540. Width 720px, height 880px. Corner radius: 180px. Rotation: -8°.
Fill: solid.
  Light variant: #1D384A at 6% opacity.
  Dark variant: #2D546A at 18% opacity.
No stroke. Gaussian blur: 40px. Blend mode: Normal.

LAYER GROUP: "Right Landmass"
A large rounded organic shape positioned with its centre at x: 1640, y: 540. Width 680px, height 820px. Corner radius: 200px. Rotation: 5°.
Fill: solid.
  Light variant: #1D384A at 5% opacity.
  Dark variant: #2D546A at 14% opacity.
No stroke. Gaussian blur: 48px. Blend mode: Normal.

LAYER GROUP: "Glow"
An ellipse centred at x: 960, y: 540. Width 600px, height 900px.
Fill: radial gradient from centre.
  Light variant: #09BCD4 at 3% opacity (centre) → transparent at 100% (edge).
  Dark variant: #09BCD4 at 6% opacity (centre) → transparent at 100% (edge).
Gaussian blur: 80px. Blend mode: Screen.

LAYER GROUP: "Grain" (optional texture)
Full-frame rectangle 1920 × 1080. Fill: #808080 at 2% opacity. Blend mode: Overlay. Add noise filter at 4% if available, otherwise omit this layer.

COMPOSITION NOTES
Visual weight sits at the left and right edges. The vertical centre band (x: 580 to x: 1340, full height) is open and nearly featureless — only the very faint cyan glow lives there, well below perceptual threshold in video compression. The bottom-left quadrant (below y: 800, left of x: 480) is the quietest area.
```

### Logo zone

**Rectangle: x: 64, y: 900, width: 320, height: 120.**
Bottom-left corner. The artwork is deliberately emptiest here (no landmass edge, no glow), and the gradient is flattest in this zone. The landmass shapes pull the eye to the upper edges, so the logo sits in quiet ground and provides the only crisp element.

### Notes for review

Ask Fintan: Does the 3% cyan glow register as "a gradient" under the collateral no-gradients rule, or is this sufficiently distinct (ambient fill on a non-collateral surface)? Ask Robin: Does the organic-shape metaphor read as "two parties and a space between" or just as decoration?

---

## Concept 2 — "Common Ground"

### Rationale

Collaboration needs shared territory. This concept uses a single, wide, horizontal band of colour low in the frame — like a horizon or a shared plane — with the person standing "on" it. The ground is shared; the sky above is open. It evokes landscape without depicting one, and its simplicity means it compresses beautifully and stays legible at any tile size.

### Figma AI Prompt

```
Create a 1920 × 1080 px frame.

BACKGROUND FILL
Solid fill.
  Light variant: #FFFFFF.
  Dark variant: #1D384A.

LAYER GROUP: "Ground Plane"
A rectangle spanning the full width: x: 0, y: 740, width: 1920, height: 340.
Fill: linear gradient, 0° (left to right).
  Light variant: #1D384A at 4% opacity (left edge) → #0787A5 at 3% opacity (x: 960) → #1D384A at 4% opacity (right edge).
  Dark variant: #2D546A at 20% opacity (left edge) → #0787A5 at 12% opacity (x: 960) → #2D546A at 20% opacity (right edge).
No stroke. Gaussian blur: 24px (applied to top edge only via mask or feather — if Figma AI cannot feather one edge, apply 24px blur to the entire shape).

LAYER GROUP: "Horizon Line"
A horizontal line from (0, 738) to (1920, 738). Stroke: 1px.
  Light variant: #1D384A at 5% opacity.
  Dark variant: #F1F5F9 at 6% opacity.
Gaussian blur: 2px.

LAYER GROUP: "Sky Wash"
An ellipse centred at x: 960, y: 200. Width: 1400px, height: 500px.
Fill: radial gradient from centre.
  Light variant: #F1F5F9 at 60% opacity (centre) → transparent (edge).
  Dark variant: #2D546A at 8% opacity (centre) → transparent (edge).
Gaussian blur: 100px. Blend mode: Normal.

LAYER GROUP: "Grain"
Full-frame rectangle 1920 × 1080. Fill: #808080 at 1.5% opacity. Blend mode: Overlay.

COMPOSITION NOTES
The frame is dominated by open, quiet space in the upper two-thirds. The lower third carries the only colour weight — the "ground" — which sits below the person's shoulders in most webcam framings. The absolute bottom-left corner (below the ground band) is the quietest zone. The centre band (x: 580–1340) is uninterrupted.
```

### Logo zone

**Rectangle: x: 64, y: 920, width: 280, height: 100.**
Bottom-left, within the ground band. At this position the gradient is at its most uniform (the leftmost stop is a near-flat solid at low opacity), creating effective plainness for logo legibility.

### Notes for review

Ask Robin: Does the horizontal band read as "shared ground / common territory" or does it just look like a Teams default with a tinted bar? Ask Fintan: Is this too minimal for brand presence when the logo is small?

---

## Concept 3 — "Confluence"

### Rationale

Three soft, overlapping fields of transparency — representing the multi-stakeholder reality of Alkemio's users (public sector, civil society, private sector). Where the fields overlap, the colour deepens slightly, visualising the idea that collective capability accumulates at intersections. The person sits at the convergence point. This is not a Venn diagram — the shapes are large, amorphous, and heavily blurred, so they read as atmosphere rather than graphic.

### Figma AI Prompt

```
Create a 1920 × 1080 px frame.

BACKGROUND FILL
Solid fill.
  Light variant: #FFFFFF.
  Dark variant: #1D384A.

LAYER GROUP: "Field A — upper left"
An ellipse. Centre: x: 320, y: 180. Width: 1100px, height: 700px. Rotation: -12°.
Fill: solid.
  Light variant: #1D384A at 4% opacity.
  Dark variant: #2D546A at 10% opacity.
No stroke. Gaussian blur: 90px. Blend mode: Multiply.

LAYER GROUP: "Field B — upper right"
An ellipse. Centre: x: 1600, y: 240. Width: 1000px, height: 650px. Rotation: 8°.
Fill: solid.
  Light variant: #0787A5 at 3% opacity.
  Dark variant: #09BCD4 at 6% opacity.
No stroke. Gaussian blur: 90px. Blend mode: Multiply.

LAYER GROUP: "Field C — lower centre"
An ellipse. Centre: x: 960, y: 920. Width: 1300px, height: 600px. Rotation: 0°.
Fill: solid.
  Light variant: #2D546A at 3% opacity.
  Dark variant: #2D546A at 8% opacity.
No stroke. Gaussian blur: 100px. Blend mode: Multiply.

LAYER GROUP: "Convergence accent"
An ellipse. Centre: x: 880, y: 480. Width: 300px, height: 300px.
Fill: radial gradient.
  Light variant: #09BCD4 at 2% opacity (centre) → transparent (edge).
  Dark variant: #09BCD4 at 4% opacity (centre) → transparent (edge).
Gaussian blur: 60px. Blend mode: Screen.

LAYER GROUP: "Grain"
Full-frame rectangle 1920 × 1080. Fill: #808080 at 2% opacity. Blend mode: Overlay.

COMPOSITION NOTES
The three fields converge near the frame's centre — but since their Gaussian blur is extreme (90–100px), the overlap zone is a gentle deepening of tone, not a visible intersection. The bottom-left corner (below y: 800, left of x: 400) sits under only Field C's feathered edge, making it the lowest-contrast area. The centre is occupied but only at 2–4% opacity — well below the threshold that interferes with segmentation.
```

### Logo zone

**Rectangle: x: 64, y: 900, width: 300, height: 120.**
Bottom-left. Field C's edge feathers to near-zero here, and fields A and B don't reach this corner. The background is effectively flat.

### Notes for review

Ask Robin: With the blur at 90px, do three fields still communicate "multiple parties" or is it too abstract — indistinguishable from a random colour cloud? Ask Fintan: At 3–4% opacity on light, will the convergence accent survive video compression, or should it be raised to 5–6%?

---

## Concept 4 — "Open Infrastructure"

### Rationale

Alkemio is infrastructure — not a consumer product, not a flashy startup. This concept borrows from the visual language of European civic architecture: large quiet planes, a subtle grid rhythm, generous proportions. A very faint 8pt-based grid of thin lines sits at the extreme edges of the frame (like structural drawings glimpsed at a distance), while the centre and the logo zone remain completely clear. The "openness" is literal: most of the frame is empty, and the structure is transparent.

### Figma AI Prompt

```
Create a 1920 × 1080 px frame.

BACKGROUND FILL
Solid fill.
  Light variant: #F1F5F9.
  Dark variant: #1D384A.

LAYER GROUP: "Grid — Left Edge"
Twelve vertical lines, evenly spaced at 32px intervals, from x: 32 to x: 384.
Each line: height 1080px, stroke 0.5px.
  Light variant: #1D384A at 3% opacity.
  Dark variant: #F1F5F9 at 4% opacity.
Clip to left edge zone: lines fade to 0% opacity via a gradient mask from x: 0 (full opacity) to x: 480 (0% opacity). Alternatively, apply a left-to-right linear gradient on a group opacity mask.

LAYER GROUP: "Grid — Right Edge"
Twelve vertical lines, evenly spaced at 32px intervals, from x: 1536 to x: 1888.
Same stroke and opacity as left edge. Mirror the gradient mask: full opacity at x: 1920, fading to 0% at x: 1440.

LAYER GROUP: "Grid — Top Edge"
Eight horizontal lines, evenly spaced at 32px intervals, from y: 32 to y: 256.
Each line: width 1920px, stroke 0.5px. Same colour/opacity as vertical lines.
Gradient mask: full opacity at y: 0, fading to 0% at y: 360.

LAYER GROUP: "Anchor line"
A single horizontal line at y: 820, from x: 64 to x: 400. Stroke 1.5px.
  Light variant: #0787A5 at 20% opacity.
  Dark variant: #09BCD4 at 25% opacity.
This is the only accent element — a structural "datum line" on which the logo will sit.

LAYER GROUP: "Corner mark"
A small cross-hair at (64, 64): two lines, each 16px, intersecting at centre. Stroke 0.75px.
  Light variant: #1D384A at 8% opacity.
  Dark variant: #F1F5F9 at 10% opacity.
A subtle registration mark — nods to technical drawing without being precious.

COMPOSITION NOTES
The centre of the frame (x: 480 to x: 1440, y: 360 to y: 820) is completely empty — no lines, no marks. All structural detail lives at the periphery and fades before reaching the person zone. The grid lines are so fine (0.5px at 3–4% opacity) they will largely disappear in video compression, leaving only a sense of structure rather than visible detail. The bottom-left corner has a single quiet accent line and nothing else.
```

### Logo zone

**Rectangle: x: 64, y: 832, width: 340, height: 120.**
Bottom-left, directly above the anchor line (which acts as a visual shelf). The grid does not extend into this area — it's open plane.

### Notes for review

Ask Fintan: Does a 0.5px line at 3% opacity survive Teams compression at all, or will this concept look identical to a flat fill in practice — and if so, is that acceptable? Ask Robin: Does the "technical drawing" language feel appropriately institutional/European or cold?

---

## Concept 5 — "Steward's Mark"

### Rationale

Steward-ownership is Alkemio's most distinctive structural claim — the thing that makes the positioning impossible to copy without making the same governance choice. This concept references the visual language of European seals and watermarks: a single, very large, heavily faded geometric form sits behind the person like a watermark on a document. It evokes authority, continuity, and institutional trustworthiness without depicting a literal seal. The shape is derived from the Alkemio logo geometry (the angular mark) but abstracted and scaled to architectural size.

### Figma AI Prompt

```
Create a 1920 × 1080 px frame.

BACKGROUND FILL
Linear gradient, 180° (top to bottom).
  Light variant: #FFFFFF at 0% → #F1F5F9 at 100%.
  Dark variant: #1D384A at 0% → #162D3B at 100%.

LAYER GROUP: "Watermark Form"
A regular hexagon (6 sides, flat top), centred at x: 1050, y: 520.
Size: 800px point-to-point (i.e., 800px tall). Rotation: 0°.
Fill: none.
Stroke: 2px.
  Light variant: #1D384A at 4% opacity.
  Dark variant: #F1F5F9 at 5% opacity.
Gaussian blur: 6px.

Inside the hexagon, a smaller concentric hexagon:
Size: 520px point-to-point. Same centre. Rotation: 30° (rotated relative to outer).
Stroke: 1.5px.
  Light variant: #1D384A at 3% opacity.
  Dark variant: #F1F5F9 at 3.5% opacity.
Gaussian blur: 4px.

Inside that, a third concentric hexagon:
Size: 280px point-to-point. Same centre. Rotation: 0°.
Stroke: 1px.
  Light variant: #0787A5 at 4% opacity.
  Dark variant: #09BCD4 at 5% opacity.
Gaussian blur: 3px.

LAYER GROUP: "Warm corner"
An ellipse at x: 200, y: 880. Width: 600px, height: 400px.
Fill: radial gradient.
  Light variant: #1D384A at 2% opacity (centre) → transparent (edge).
  Dark variant: #2D546A at 6% opacity (centre) → transparent (edge).
Gaussian blur: 80px. Blend mode: Normal.

LAYER GROUP: "Grain"
Full-frame rectangle 1920 × 1080. Fill: #808080 at 1.5% opacity. Blend mode: Overlay.

COMPOSITION NOTES
The watermark hexagons are centred slightly right of frame centre (x: 1050) so they sit behind-and-to-the-right of the person's head, rather than symmetrically behind it. Their extreme low-opacity and blur means they function like a watermark: visible if you look, invisible if you don't. The bottom-left quadrant (x: 0–480, y: 800–1080) is the quietest area — only the "warm corner" ellipse feathers into it at negligible opacity.
```

### Logo zone

**Rectangle: x: 64, y: 900, width: 300, height: 120.**
Bottom-left. The "warm corner" ellipse provides a barely-perceptible tonal anchor behind the logo without any edges or shapes. The watermark hexagons are far to the right and don't enter this zone.

**Optional tagline zone: x: 64, y: 840, width: 400, height: 48.**
If used, the line "European. Steward-owned. Open-source." would sit here — it reinforces what the watermark symbolises. This is the one concept where a tagline adds meaning rather than decoration.

### Notes for review

Ask Robin: Does a hexagon (not part of the current logo geometry) feel on-brand or arbitrary? Should it be the angular arrow form from the Alkemio mark instead? Ask Fintan: At 4% stroke opacity with 6px blur, will this read as "intentional restraint" or "is my screen broken"?

---

## Summary of logo zone positions

| Concept | Logo zone (x, y, w, h) | Corner |
|---------|------------------------|--------|
| 1 — The Space Between | 64, 900, 320, 120 | Bottom-left |
| 2 — Common Ground | 64, 920, 280, 100 | Bottom-left |
| 3 — Confluence | 64, 900, 300, 120 | Bottom-left |
| 4 — Open Infrastructure | 64, 832, 340, 120 | Bottom-left |
| 5 — Steward's Mark | 64, 900, 300, 120 | Bottom-left |

All concepts use bottom-left because: (1) it avoids the Teams name badge which sits further right in the bottom-left area, (2) it follows the brand guideline that logo position defaults to "bottom-left of the frame, on the same left edge as the type", (3) it is the natural reading end-point for a left-to-right audience, and (4) it keeps the logo away from the right-side video controls in most clients.

---

## Colour token reference for Figma

When building, name your colour styles:

| Style name | Light value | Dark value |
|------------|-------------|------------|
| `bg/canvas` | `#FFFFFF` | `#1D384A` |
| `bg/tint` | `#F1F5F9` | `#162D3B` |
| `accent/cyan` | `#09BCD4` | `#09BCD4` |
| `accent/cyan-deep` | `#0787A5` | `#0787A5` |
| `ink` | `#1D384A` | `#F1F5F9` |
| `slate` | `#2D546A` | `#2D546A` |

Swap `ink` and `bg/canvas` to switch between light and dark variants — the accent colours stay fixed.

---

## Open questions for the author

1. **Marketing neutral hex values.** The vault references `--a-m-slate`, `--a-m-wash`, `--a-m-line`, `--a-m-paper` but the token JSON isn't web-accessible. If these differ from the CRD ramp interpolation above, please supply them and I'll revise.
2. **"Never gradients" scope.** The identity document states this for the Collateral Engine. Does it extend to internal-use video backgrounds? I've kept gradients subtle (background fills only, never cyan-to-blue washes), but if the rule is absolute, concepts 1 and 5 need revision to solid fills.
3. **Hexagon geometry (Concept 5).** Is the hexagonal form acceptable as an abstract "seal" shape, or must it derive from the angular Alkemio mark? If the latter, please share the mark geometry and I'll re-specify.

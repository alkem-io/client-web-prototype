# Post Truncation — Design Change for Developers

## What Changed

We replaced the old gradient/fade overlay on collapsed posts with a clean hard truncation. The old approach used a white gradient that faded out the bottom of the post content — this looked particularly bad when it overlaid images or embedded media, creating awkward visual artifacts. The new approach simply clips the text at a fixed height and shows a "Read more" link below it.

## The New Behavior

When a space has collapse enabled, posts that exceed roughly 3 lines of body text get truncated. The text just cuts off cleanly — no gradient, no fade, no overlay of any kind. Below the clipped text there's a simple "Read more" link. Clicking it expands the post inline (no navigation). Once expanded, a "Show less" link appears so users can collapse it again.

The collapse threshold is based on actual content overflow, not a character count. The component measures whether the rendered content exceeds its container height. If it doesn't overflow, no truncation indicator is shown at all — the post just displays normally.

## How Images Are Handled

This was the main pain point with the old design. The new rules:

- **Image appears after the text**: When collapsed, the image is completely hidden. Only the clamped text and "Read more" link are visible. The image appears when the user expands.
- **Image appears before the text** (hero position): The image is shown but capped at 160px height with a clean crop (`object-fit: cover`, no overlay). The text below it may still be clamped if it overflows.
- **Image-only posts** (no meaningful text body): These never collapse at all. There's nothing to truncate, and hiding the image would remove the entire point of the post.

The key principle: images never get a gradient, mask, or any overlay. They're either fully visible (possibly cropped to a max height) or fully hidden behind the "Read more" action.

## The "Read More" Link

It's styled as a subtle text link in the primary color, sitting on its own line below the clamped content. Small font, medium weight, standard hover treatment. It matches the "Show more" pattern already used in the activity feed and other parts of the UI — not a new visual element.

## Default Setting Change

New spaces now default to collapse **off** (posts fully expanded). Existing spaces that already have collapse enabled keep their current setting — no migration needed.

## Edge Cases to Be Aware Of

- Posts with exactly 3 lines of text should NOT collapse — the threshold is "exceeds", not "meets or exceeds"
- The expand/collapse animation should respect `prefers-reduced-motion`
- Only the post description/snippet text gets truncated — other content types (documents, whiteboards, collections) always display fully
- The space admin toggle for enabling/disabling collapse per space still works the same way — this ticket only changes the visual treatment, not the settings logic

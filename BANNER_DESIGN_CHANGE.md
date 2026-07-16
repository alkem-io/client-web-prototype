# Page Banner — Design Change for Developers

## What Changed

We made the page banner much smaller and full-width. The old banner was tall and took up a lot of vertical space at the top of the page — it pushed the actual content down and felt heavy. The new banner is a thin, compact strip (80px tall) that stretches edge-to-edge across the full viewport width. It still shows the space's image using `object-fit: cover`, so you get a cropped slice of the photo rather than a large hero block. The visual identity is preserved, but it's no longer competing with the content for attention.

## Where It Applies

This smaller banner treatment applies consistently everywhere a photo banner appears:

- **Spaces** — the top-level space page
- **Subspaces** — same treatment, inheriting the parent space's banner image
- **Sub-subspaces** — same again, following the same pattern down the hierarchy
- **Innovation Hub** — the hub landing page (this one uses an aspect ratio of 6:1 within the content grid rather than a fixed pixel height, but the visual effect is the same — a thin panoramic strip)

All of these should look and feel the same. The banner is a subtle visual identity element, not a hero section.

## The New Banner Look

The banner sits directly behind the top navigation bar. It uses a negative top margin (`margin-top: -64px`) so it slides up underneath the transparent header, and the image peeks out below it. The result is a seamless transition from the nav bar into the content area — the header appears to float over the top edge of the banner.

For spaces and subspaces, the banner is a fixed 80px tall, full viewport width. The image fills this strip with `object-fit: cover` so it crops naturally regardless of the source image's aspect ratio.

For the innovation hub, the banner lives inside the content grid (10 of 12 columns) and uses an `aspect-ratio: 6/1` instead of a fixed pixel height. This keeps it proportional on wider screens while achieving the same thin-strip look.

## What This Replaces

The old banner was significantly taller — it acted more like a hero image section. The change to a compact strip means:

- Less vertical space consumed before the user reaches actual content
- The banner becomes a subtle branding element rather than a focal point
- Scroll-to-content distance is reduced on all banner pages
- The overall page feels lighter and more content-forward

## Things to Keep in Mind

- The banner image is always cropped via `object-fit: cover` — it should look good at any aspect ratio, so authors don't need to worry about exact image dimensions
- The transparent header overlay means the top ~64px of the banner image is partially hidden behind the nav bar — keep that in mind when choosing or positioning banner images
- Subspaces inherit their parent space's banner image by default
- The settings pages for spaces and innovation hubs still allow uploading/changing the banner image — that flow doesn't change, only the display size changes

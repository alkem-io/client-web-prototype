# 010 — Profile Completion Nudges (Concept)

*Discussion draft — not an implementation spec. For stakeholder review.*

## Overview

Richer user profiles make the platform more valuable — most visibly in features like the community/map block, where an empty profile is a dead end for anyone trying to connect. This doc captures two complementary ideas for closing that gap: nudging existing users to complete profiles that are already thin, and redesigning account creation so new profiles start fuller.

## Phase 1 — Nudging existing users

Rather than one big prompt, we're proposing three lightweight "tiers" of nudge, each suited to a different moment and each intentionally low-pressure — the goal is to invite, not nag.

**Tier 1 — A quiet progress indicator, always there.**
A small "3 of 5 sections complete" indicator lives in profile settings (and a subtle private version on the user's own profile page). It never interrupts anyone — it's just visible when they're already there, so finishing feels like an easy next step rather than an assigned task.

**Tier 2 — Contextual prompts, shown at the moment they matter.**
Instead of asking for information up front, we ask for it exactly when its absence is visible — e.g. a quiet "Add your bio so others know what you do" prompt shown only to the user themself, in the exact feature where a bio would otherwise be missing. People are most willing to fill in a gap right when they can see why it matters.

**Tier 3 — Occasional notifications, sparingly used.**
For users who aren't in settings or the relevant feature often, a rare, single-topic notification (e.g. after joining a new space: "Add a photo so members recognize you") can nudge them back. This is the most interruptive tier, so it's capped — infrequent, one ask at a time, and it backs off automatically if ignored.

Together these give people multiple *gentle*, well-timed invitations rather than one heavy-handed request, and keep the emphasis on why completing a profile benefits them (being findable, being recognizable), not on completion as a chore.

## Phase 2 — Redesigning account creation

Phase 1 treats the symptom; this treats the cause. Right now, account creation asks for the bare minimum and nothing else — so most profiles start empty and stay that way unless a Phase 1 nudge later catches them.

The idea is to turn account creation into a short, visual flow — one required step (just the basics needed to create an account), followed by optional steps for a photo and a bit more about the person. It would use the same friendly, step-by-step visual pattern already used for creating a Space — and since account creation is generally the first thing a person does on the platform, this also works the other way round: creating a Space later feels more familiar, because the person has already seen this style of flow once before.

Making these steps optional (rather than required) matters — forcing completion at signup tends to just increase drop-off, while making it easy and quick to say yes to tends to get more people filling things in voluntarily. When presenting the optional steps, we frame them as showing value ("A complete profile helps you get discovered and connect with the right people") rather than blocking access — all core functionality remains available regardless of profile completeness, but users see immediately why finishing matters. Anything someone skips here simply becomes the starting point for the Phase 1 nudges later, so the two phases work together rather than as separate systems.

## Sequencing

Phase 1 addresses the existing user base directly and is the priority. Phase 2 is prevention for future signups and can follow once Phase 1's approach is validated.

## Design Guardrails

As much as what we're *doing*, it's important to name what we're *not* doing:

- **No guilt or shame framing.** Progress indicators never use red or destructive styling for "incomplete" — that's scolding, not inviting. Neutral or warm colors only; red is reserved for actual errors or destructive actions.

- **No forced completion.** Core functionality is never gated behind profile completeness — nudges are invitations, not paywalls. This preserves autonomy and ensures we're enhancing the platform, not blocking it.

- **No metric gaming.** The meter is presence-based (sections filled), never length-based (character counts). This prevents the LinkedIn problem of keyword-stuffed nonsense people add just to move a percentage bar.

- **No notification center spam.** Since we reuse the `system` notification type already used for genuine invites and mentions, a barrage of profile nudges would degrade the credibility of *everything* in that popover. This is why Tier 3 is capped hardest — one ask per notification, infrequent, and it stops entirely if ignored.

- **No infantilizing "fun."** This is a professional/community platform. Playfulness and warmth don't require cartoonish mascots or confetti — the tone should match products like Notion and Linear: sophisticated but approachable, never feeling gamified-for-kids.

- **Honesty is the policy.** All communication about why profile data matters should be transparent and genuine. We show real value (discoverability, connection) without implying features are blocked; we never use dark patterns or misdirection to collect data. Users deserve to understand exactly why we're asking and what benefit they get.

## Research Grounding

### Phase 1 — Nudging existing users

This approach draws on established UX and behavioral psychology research:

- **Tier 1 (persistent meter)** reflects the Zeigarnik Effect (Zeigarnik, 1927) — unfinished tasks create mild cognitive tension that motivates completion — and the Goal-Gradient Effect (Kivetz, Urminsky, & Zheng, 2006), which shows that visible progress accelerates completion as people near the finish line.

- **Tier 2 (contextual nudges)** applies BJ Fogg's Behavior Model (Fogg, 2019), which posits that behavior requires Motivation + Ability + Prompt. By prompting exactly when motivation is naturally high (the user is mid-task and the gap is visible), we reduce the ability barrier and increase conversion without added marketing pressure.

- **Tier 3 (notifications)** is informed by Self-Determination Theory (Deci & Ryan, 1985), specifically the principle that sustainable engagement comes from autonomy rather than pressure. By capping frequency and respecting dismissal, we preserve user agency and prevent the degradation of the notification center as a trusted channel.

- The emphasis throughout on **why** (being findable, being recognizable) rather than **what** reflects research on intrinsic vs. extrinsic motivation (Kohn, 1993; Pink, 2009) — people engage more readily with systems when they understand the payoff to themselves, not when completion is framed as an obligation.

Products like LinkedIn (profile strength meter), Duolingo (streaks and progressive disclosure), Notion (template galleries), and Airbnb (progressive profiling at signup) have validated these patterns at scale.

### Phase 2 — Account Creation Redesign

Research shows clear tension we're deliberately resolving:

- **Minimal signup reduces abandonment**: Each additional required field decreases conversion by ~4.1% (Formstack 2025, Forrester 2024). Forms with 7+ fields hit 67.8% abandonment. Best practice: 3–5 critical fields only.

- **The trade-off with optional steps**: Research shows that spreading optional decisions across multiple steps triggers choice overload (68% of users abandon tasks due to decision fatigue). Multi-step forms work best when they feel like committed progress, not optional "should I skip this?" decisions. However, making fields optional has proven massive upside: HubSpot testing found that optional fields increase completion by up to 275%. We're deliberately choosing to accept the decision-fatigue risk in exchange for this conversion lift, keeping core signup lean (email, password only) and letting Phase 1 nudges pick up the enrichment for those who skip.

- **Asking for data post-signup requires framing**: When users are asked for additional data after signup without clear context, it raises trust concerns ("Why do they suddenly need this?"). For example: asking for location without explaining it enables the community map discovery, or asking for bio without tying it to space member introductions, feels like data fishing. The solution is to frame each optional step with immediate, specific value: "Add your city so you appear on the community map and local collaborators can find you."

**Our approach**: Minimal mandatory signup (just essentials), followed by a single optional profile-enrichment step with explicit framing tied to platform features that benefit from that data. This avoids decision fatigue while making the "why" transparent.

**Note on trade-offs**: We acknowledge that research on multi-step forms with mandatory progress shows better conversion than optional steps, but we're accepting this trade-off to reduce initial signup friction. Phase 1's nudges compensate by re-engaging users who skip the optional enrichment step.

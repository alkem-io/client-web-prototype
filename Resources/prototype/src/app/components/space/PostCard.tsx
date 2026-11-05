/**
 * Post card — production's `@/crd/components/space/PostCard`.
 *
 * In client-web a "post" is a **callout**; the prototype's name and props are
 * kept so its ~10 call sites compile unchanged, but everything rendered here is
 * CRD's. The prototype's own copy had been derived from this component and had
 * drifted, which is exactly the drift this branch exists to remove.
 *
 * Three prototype extras are preserved by composing into CRD's slots rather
 * than by forking the card:
 *
 *   · emoji reactions  → `reactionsSlot`, via the `ReactionBar` adapter. This is
 *     the slot the dev described; in the client a `<CalloutReactionsConnector>`
 *     goes here.
 *   · a form added to the post → production's form box, through the framing
 *     slot (`children`), drawn by `PostFormBox`.
 *   · the extra fixture fields (`framingForm`, `reactions`,
 *     `reactionOptions`, `embeddedImages`) ride on an extended `PostCardData`.
 *
 *   · title-first header → CRD's `showPublishDetails: false` moves the title
 *     into the header, and `TitleFirstHeaderStandIn` adds the author's picture
 *     beside it and a subtle "author · time" line under it
 *     (`@/ahead/TitleFirstPostHeader`). Posts that already hide their
 *     publish details are left alone.
 *
 *   · post truncation → CRD's snippet is withheld and `TruncatedPostDescription`
 *     (src/ahead) renders in its place, through `contributionsPreview` — the
 *     only slot inside the card body. Tags and references move with it so the
 *     order stays title → description → tags → contributions. Skipped for
 *     framing types, whose preview CRD draws between the tags and that slot;
 *     the description would land below the preview. Upstream ask: a
 *     `descriptionSlot`. See the component's header.
 *
 *   · selectable tags → inside a tab, the post's tags are production's
 *     `CollapsibleTagList` in its toggle mode, wired to the sidebar search:
 *     a selected tag turns dark and comes first, so it never hides behind "+N".
 *     CRD's card takes no tag props, so its tags are withheld and these render
 *     in `contributionsPreview`, which puts them below a framing preview.
 *     Upstream ask: a `tagsSlot`, or selection props on `PostCard`.
 *
 * PHASE 1 REMOVALS — recorded in PHASE-2.md:
 *   · the activity dot beside the title (§1 — CRD renders the title, no slot)
 *     — back since 2026-10-06 through `@/app/components/shared/ActivityDotSlots`; hovering the
 *     card for a moment marks the post as seen, as before
 *   · `onDeleteMediaGalleryImage` (§4 — CRD's `MediaGalleryFeedGrid` has no
 *     per-thumbnail delete). The prop is still accepted so the five callers
 *     compile; it is simply not forwarded.
 */
import { type ReactNode, useEffect, useRef } from 'react';
import { type ActivityDotSlot, ActivityDotSlots, afterNameSlot } from '@/app/components/shared/ActivityDotSlots';
import { useActivityIndicators } from '@/app/contexts/ActivityIndicatorsContext';
import { postItem } from '@/app/data/activity-data';
import { useOptionalSpaceFilters } from '@/app/components/space/FilterContext';
import { ReferencesAndTagsStrip } from '@/crd/components/callout/ReferencesAndTagsStrip';
import { CollapsibleTagList } from '@/crd/components/common/CollapsibleTagList';
import {
  PostCard as CrdPostCard,
  type PostCardData as CrdPostCardData,
} from '@/crd/components/space/PostCard';
import type { MediaGalleryFeedThumbnail } from '@/crd/components/mediaGallery/MediaGalleryFeedGrid';
import { ReactionBar } from '@/app/components/space/ReactionBar';
import { TruncatedPostDescription } from '@/ahead/TruncatedPostDescription';
import type { PostReaction } from '@/app/components/space/post-reactions-data';
import { PostFormBox, type PostFormData } from '@/app/components/callout/PostFormBox';
import { TitleFirstHeaderStandIn } from '@/app/components/shared/TitleFirstHeaderStandIn';

export type { MediaGalleryFeedThumbnail };
export { POST_TYPE_DESCRIPTORS, type PostType } from '@/crd/components/space/PostCard';

/**
 * CRD's callout data plus the fields the prototype explores ahead of it.
 * Nothing here overrides a CRD field — these are additions only.
 */
export type PostCardData = CrdPostCardData & {
  /** The form added to the post (`type: 'form'`), in production's shape. */
  framingForm?: PostFormData;
  /** Emoji reactions. Omit and `ReactionBar` seeds a deterministic demo set from the id. */
  reactions?: PostReaction[];
  /** The emoji this space offers; omit for the platform default set. */
  reactionOptions?: readonly string[];
  /** User-embedded images in the post body. */
  embeddedImages?: Array<{ url: string; alt?: string; position?: 'before' | 'after' }>;
};

/** @deprecated Use PostCardData instead */
export type PostProps = PostCardData;

type PostCardProps = {
  post: PostCardData;
  href?: string;
  onClick?: () => void;
  onOpenFraming?: () => void;
  onAddMediaGalleryImages?: () => void;
  /** Accepted for call-site compatibility; not forwarded — see PHASE-2.md §4. */
  onDeleteMediaGalleryImage?: (thumbnail: MediaGalleryFeedThumbnail) => void;
  onCommentsClick?: () => void;
  settingsSlot?: ReactNode;
  onExpandClick?: () => void;
  expandIcon?: 'expand' | 'fullscreen';
  onOpenFramingDocument?: () => void;
  onOpenMemoSignedCopies?: () => void;
  contributionsPreview?: ReactNode;
  children?: ReactNode;
  commentsSlot?: ReactNode;
  commentInputSlot?: ReactNode | null;
  onCommentsExpandedChange?: (expanded: boolean) => void;
  /** Hides the reaction row entirely (e.g. a card in a read-only preview). */
  reactionsEnabled?: boolean;
  canReact?: boolean;
  onReactionsChange?: (reactions: PostReaction[]) => void;
  className?: string;
};

/** Types whose framing preview CRD draws inside the body — see the header note. */
const FRAMING_PREVIEW_TYPES = new Set(['whiteboard', 'memo', 'mediaGallery', 'document', 'callToAction', 'form']);

export function PostCard({
  post,
  contributionsPreview,
  settingsSlot,
  children,
  reactionsEnabled = true,
  canReact = true,
  onReactionsChange,
  // Accepted, deliberately unused — see the header note.
  onDeleteMediaGalleryImage: _onDeleteMediaGalleryImage,
  ...rest
}: PostCardProps) {
  const { hasItemActivity, markItemSeen } = useActivityIndicators();
  const activityId = postItem(post.id);
  const hasActivity = hasItemActivity(activityId);
  const activitySlots: ActivityDotSlot[] = hasActivity
    ? // The post title only — a form box inside the card has a heading of the same style.
      [afterNameSlot('title', 'New', root => [...root.querySelectorAll('h3.text-subsection-title')].slice(0, 1))]
    : [];

  // Hovering is deliberate attention; scrolling past is not. The short delay
  // stops a cursor sweeping across the feed from clearing everything it crosses.
  const hoverTimer = useRef<number | null>(null);
  const cancelHover = () => {
    if (hoverTimer.current !== null) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  };
  const startHover = () => {
    if (!hasActivity || hoverTimer.current !== null) return;
    hoverTimer.current = window.setTimeout(() => {
      hoverTimer.current = null;
      markItemSeen(activityId);
    }, 400);
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: clear the timer on unmount only
  useEffect(() => cancelHover, []);

  const ownsDescription =
    !FRAMING_PREVIEW_TYPES.has(post.type) && (!!post.snippet || !!post.embeddedImages?.length);

  const titleFirst = post.showPublishDetails !== false && !!post.author;

  const filters = useOptionalSpaceFilters();
  const tags = post.tags ?? [];
  const selectedTags = filters ? tags.filter(tag => filters.isActive('Tags', tag)) : [];
  const tagList =
    filters && tags.length > 0 ? (
      <CollapsibleTagList
        tags={[...selectedTags, ...tags.filter(tag => !selectedTags.includes(tag))]}
        selectedTags={selectedTags}
        onTagClick={tag => filters.toggle('Tags', tag)}
      />
    ) : null;

  const crdPost: PostCardData = {
    ...post,
    ...(ownsDescription ? { snippet: undefined, tags: undefined, references: undefined } : {}),
    ...(filters ? { tags: undefined } : {}),
    ...(titleFirst ? { showPublishDetails: false } : {}),
  };

  return (
    <ActivityDotSlots
      slots={activitySlots}
      onPointerEnter={startHover}
      onPointerLeave={cancelHover}
      // A block, so the feed's gap between cards (a margin) still applies.
      wrapperClassName="block"
    >
      <TitleFirstHeaderStandIn
        enabled={titleFirst}
        author={post.author}
        timestamp={post.timestamp}
        isDraft={post.isDraft}
      >
        <CrdPostCard
          {...rest}
          post={crdPost}
          children={
            post.framingForm ? (
              <>
                <PostFormBox form={post.framingForm} />
                {children}
              </>
            ) : (
              children
            )
          }
          contributionsPreview={
            ownsDescription ? (
              <>
                <TruncatedPostDescription
                  content={post.snippet}
                  embeddedImages={post.embeddedImages}
                  collapsible={!post.descriptionExpanded}
                />
                <ReferencesAndTagsStrip references={post.references} tags={filters ? undefined : post.tags} className="mt-2" />
                {tagList && <div className="mt-2">{tagList}</div>}
                {contributionsPreview}
              </>
            ) : tagList ? (
              <>
                {tagList}
                {contributionsPreview}
              </>
            ) : (
              contributionsPreview
            )
          }
          settingsSlot={settingsSlot}
          reactionsSlot={
            reactionsEnabled ? (
              <ReactionBar
                id={post.id}
                options={post.reactionOptions}
                canReact={canReact}
                onChange={onReactionsChange}
              />
            ) : undefined
          }
        />
      </TitleFirstHeaderStandIn>
    </ActivityDotSlots>
  );
}

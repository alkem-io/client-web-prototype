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
 *   · form settings gear → folded into `settingsSlot` beside any menu the
 *     caller passes, since CRD has no `onOpenFormSettings`.
 *   · the extra fixture fields (`contributionForm`, `reactions`,
 *     `reactionOptions`, `embeddedImages`) ride on an extended `PostCardData`.
 *
 * PHASE 1 REMOVALS — recorded in PHASE-2.md:
 *   · the activity dot beside the title (§1 — CRD renders the title, no slot)
 *   · `onDeleteMediaGalleryImage` (§4 — CRD's `MediaGalleryFeedGrid` has no
 *     per-thumbnail delete). The prop is still accepted so the five callers
 *     compile; it is simply not forwarded.
 */
import { Settings } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  PostCard as CrdPostCard,
  type PostCardData as CrdPostCardData,
} from '@/crd/components/space/PostCard';
import type { MediaGalleryFeedThumbnail } from '@/crd/components/mediaGallery/MediaGalleryFeedGrid';
import { Button } from '@/crd/primitives/button';
import { ReactionBar } from '@/app/components/space/ReactionBar';
import type { PostReaction } from '@/app/components/space/post-reactions-data';
import type { CalloutFormData } from '@/app/components/callout/calloutFormTypes';

export type { MediaGalleryFeedThumbnail };
export { POST_TYPE_DESCRIPTORS, type PostType } from '@/crd/components/space/PostCard';

/**
 * CRD's callout data plus the fields the prototype explores ahead of it.
 * Nothing here overrides a CRD field — these are additions only.
 */
export type PostCardData = CrdPostCardData & {
  /**
   * Contribution-level form (`contributionType: 'form'` only) — the ordered
   * question list defining a response's shape, plus the responses collected so
   * far. Prototype-only: production has no form callout type.
   */
  contributionForm?: CalloutFormData;
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
  /** Opens the form settings dialog. Its presence is the permission check. */
  onOpenFormSettings?: () => void;
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

export function PostCard({
  post,
  settingsSlot,
  onOpenFormSettings,
  reactionsEnabled = true,
  canReact = true,
  onReactionsChange,
  // Accepted, deliberately unused — see the header note.
  onDeleteMediaGalleryImage: _onDeleteMediaGalleryImage,
  ...rest
}: PostCardProps) {
  // CRD renders one settings area; the form gear joins whatever menu the caller
  // passes rather than replacing it.
  const settings =
    onOpenFormSettings || settingsSlot ? (
      <div className="flex items-center gap-1">
        {onOpenFormSettings && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenFormSettings}
            aria-label="Form settings"
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings className="size-4" aria-hidden="true" />
          </Button>
        )}
        {settingsSlot}
      </div>
    ) : undefined;

  return (
    <CrdPostCard
      {...rest}
      post={post}
      settingsSlot={settings}
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
  );
}

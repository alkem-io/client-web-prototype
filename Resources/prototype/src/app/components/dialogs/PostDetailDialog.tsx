/**
 * Post detail — production's `@/crd/components/callout/CalloutDetailDialog`.
 *
 * In client-web a "post" is a **callout** and a "response" is a
 * **contribution**, so this file is the prototype's post fixtures rendered
 * through production's callout dialog. The name and props are kept so the three
 * call sites (`SpaceFeed`, `SpaceKnowledgeFeed`, `CommunityFeed`) compile
 * unchanged.
 *
 * CRD's dialog is a slotted shell: it owns the chrome (header, share, title,
 * author cluster, markdown description, references/tags strip, contributions
 * heading, discussion heading) and takes every body region as a `ReactNode`.
 * So each framing the prototype had becomes slot content rather than markup
 * this file lays out:
 *
 *   whiteboard   → whiteboardFramingSlot      memo        → memoFramingSlot
 *   mediaGallery → mediaGalleryFramingSlot    document    → collaboraFramingSlot
 *   callToAction → callToActionFramingSlot    reactions   → reactionsSlot
 *
 * The form framing goes in `contributionsSlot`, not a framing slot: its
 * questions are the schema for what contributors submit and the responses are
 * the contributions, which is what that slot is for. Production has no form
 * callout type at all — see PHASE-2.md §9.
 *
 * REMOVED, with its data: the old `contentPreview` blocks (whiteboard grid,
 * collection items, inline document previews) and `stats`. Those fields no
 * longer exist on `PostCardData` — it was aligned to CRD's shape earlier — so
 * this file had been referencing fields that were already gone.
 */
import { Images, ImagePlus, Presentation, StickyNote } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { CalloutCollaboraPreview } from '@/crd/components/callout/CalloutCollaboraPreview';
import { CalloutDetailDialog } from '@/crd/components/callout/CalloutDetailDialog';
import { CalloutLinkAction } from '@/crd/components/callout/CalloutLinkAction';
import { Avatar, AvatarFallback, AvatarImage } from '@/crd/primitives/avatar';
import { Button } from '@/crd/primitives/button';
import { IconButton } from '@/crd/primitives/icon-button';
import { Textarea } from '@/crd/primitives/textarea';
import { Send, Smile } from 'lucide-react';
import { toCalloutDetail } from '@/app/mappers/calloutDetail';
import { ReactionBar } from '@/app/components/space/ReactionBar';
import type { MediaGalleryFeedThumbnail, PostCardData } from '@/app/components/space/PostCard';
import { MediaGalleryDetailView } from '@/app/components/mediaGallery/MediaGalleryDetailView';
import { MemoDialog } from '@/app/components/memo/MemoDialog';
import { SignedCopiesTrigger } from '@/app/components/memo/SignedCopiesTrigger';
import { useSignedCopies } from '@/app/components/memo/memoSigningStore';
import { uniqueSigners } from '@/app/components/memo/signingData';
import { CalloutFormFraming } from '@/app/components/callout/CalloutFormFraming';

interface PostDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: PostCardData | null;
  onAddMediaGalleryImages?: () => void;
  onDeleteMediaGalleryImage?: (thumbnail: MediaGalleryFeedThumbnail) => void;
  /** Viewer context for the form framing — drives response visibility. */
  formViewer?: { userId: string; isAdmin: boolean };
  /** Contribution cards rendered under the callout body. */
  contributionsPreview?: React.ReactNode;
}

/** Shared shape for the whiteboard / memo "open this surface" affordances. */
function FramingOpenButton({
  onClick,
  label,
  heightClass,
  children,
}: {
  onClick: () => void;
  label: string;
  heightClass: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative block w-full cursor-pointer overflow-hidden rounded-lg border border-border bg-muted/30 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${heightClass}`}
    >
      {children}
      <div className="absolute inset-0 flex items-center justify-center bg-primary/10 transition-colors group-hover:bg-primary/20">
        <span className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 text-control text-secondary-foreground shadow-sm">
          {label}
        </span>
      </div>
    </button>
  );
}

export function PostDetailDialog({
  open,
  onOpenChange,
  post,
  onAddMediaGalleryImages,
  onDeleteMediaGalleryImage,
  formViewer,
  contributionsPreview,
}: PostDetailDialogProps) {
  const [commentText, setCommentText] = useState('');
  const [memoOpen, setMemoOpen] = useState(false);
  // Hook order has to stay stable, so this runs before the `!post` bail-out.
  const signedCopies = useSignedCopies(post?.id);

  if (!post) return null;

  const hasForm = Boolean(post.contributionForm);
  const contributions =
    hasForm || contributionsPreview ? (
      <div className="space-y-6">
        {post.contributionForm && (
          <CalloutFormFraming form={post.contributionForm} viewer={formViewer} />
        )}
        {contributionsPreview}
      </div>
    ) : undefined;

  return (
    <>
      <CalloutDetailDialog
        open={open}
        onOpenChange={onOpenChange}
        callout={toCalloutDetail(post)}
        onShareClick={() => toast.success('Link copied to clipboard')}
        commentsEnabled={post.commentsEnabled}
        // Reactions are production's module — `ReactionBar` adapts the mock
        // store onto CRD's `CalloutReactionsBar`. This is the slot the dev
        // pointed at: the client passes a `<CalloutReactionsConnector>` here.
        reactionsSlot={<ReactionBar id={post.id} options={post.reactionOptions} />}
        whiteboardFramingSlot={
          post.type === 'whiteboard' ? (
            <FramingOpenButton onClick={() => {}} label="Open Whiteboard" heightClass="aspect-video">
              {post.framingImageUrl ? (
                <img src={post.framingImageUrl} alt="Whiteboard" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Presentation className="h-12 w-12 text-muted-foreground/50" aria-hidden="true" />
                </div>
              )}
            </FramingOpenButton>
          ) : undefined
        }
        memoFramingSlot={
          post.type === 'memo' ? (
            <div className="space-y-2">
              <FramingOpenButton onClick={() => setMemoOpen(true)} label="Open Memo" heightClass="h-40">
                {post.framingMemoMarkdown ? (
                  <div className="line-clamp-5 h-full overflow-hidden p-4 text-body whitespace-pre-wrap text-foreground">
                    {post.framingMemoMarkdown}
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <StickyNote className="h-12 w-12 text-muted-foreground/50" aria-hidden="true" />
                  </div>
                )}
              </FramingOpenButton>
              {/* PHASE 1 MOVE: the signed-copies trigger used to sit on the author
                  line. CRD builds that cluster itself from `callout.author`, so it
                  lives with the memo instead. See PHASE-2.md §9. */}
              {signedCopies.length > 0 && (
                <SignedCopiesTrigger
                  count={signedCopies.length}
                  signers={uniqueSigners(signedCopies)}
                  onClick={() => setMemoOpen(true)}
                />
              )}
            </div>
          ) : undefined
        }
        mediaGalleryFramingSlot={
          post.type === 'mediaGallery' ? (
            <div className="space-y-4">
              {post.framingMediaGallery && post.framingMediaGallery.thumbnails.length > 0 ? (
                <MediaGalleryDetailView
                  thumbnails={post.framingMediaGallery.thumbnails}
                  onDeleteThumbnail={onDeleteMediaGalleryImage}
                />
              ) : (
                <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/30">
                  <Images className="h-12 w-12 text-muted-foreground/50" aria-hidden="true" />
                </div>
              )}
              {onAddMediaGalleryImages && (
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" className="gap-2" onClick={onAddMediaGalleryImages}>
                    <ImagePlus className="size-4" aria-hidden="true" />
                    Add Images
                  </Button>
                </div>
              )}
            </div>
          ) : undefined
        }
        collaboraFramingSlot={
          post.type === 'document' && post.framingDocumentType ? (
            <CalloutCollaboraPreview documentType={post.framingDocumentType} onOpen={() => {}} />
          ) : undefined
        }
        callToActionFramingSlot={
          post.type === 'callToAction' && post.framingCallToAction ? (
            <CalloutLinkAction
              url={post.framingCallToAction.uri}
              displayName={post.framingCallToAction.displayName}
              isExternal={post.framingCallToAction.isExternal}
              isValid={post.framingCallToAction.isValid}
            />
          ) : undefined
        }
        hasContributions={Boolean(contributions)}
        contributionsSlot={contributions}
        commentsSlot={
          <div className="space-y-6">
            <div className="flex gap-4">
              <Avatar className="mt-1 h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=128" />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-card-title">Sarah Jenkins</span>
                  <span className="text-caption text-muted-foreground">2 days ago</span>
                </div>
                <p className="text-body text-foreground/90">
                  Great initiative! I think we should also consider the implications on local traffic
                  patterns.
                </p>
                <div className="flex items-center gap-4 text-control text-muted-foreground">
                  <button type="button" className="transition-colors hover:text-primary">
                    Reply
                  </button>
                  <button type="button" className="transition-colors hover:text-primary">
                    Like (2)
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
        commentInputSlot={
          <div className="flex gap-3">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary">ME</AvatarFallback>
            </Avatar>
            <div className="relative flex-1">
              <Textarea
                placeholder="Type your comment here..."
                className="max-h-[120px] min-h-[44px] resize-none py-3 pr-20"
                value={commentText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentText(e.target.value)}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                <IconButton variant="ghost" tooltipLabel="Emoji" className="text-muted-foreground hover:text-primary">
                  <Smile className="h-4 w-4" />
                </IconButton>
                <IconButton tooltipLabel="Send" className="rounded-md" disabled={!commentText.trim()}>
                  <Send className="h-3 w-3" />
                </IconButton>
              </div>
            </div>
          </div>
        }
      />

      {post.type === 'memo' && memoOpen && (
        <MemoDialog
          open={true}
          onOpenChange={setMemoOpen}
          memoId={post.id}
          title={post.title}
          markdown={post.framingMemoMarkdown ?? ''}
          // `PostCardData.author` is optional (CRD's shape); MemoDialog's byline
          // requires one. No prototype fixture omits it, so this only guards the type.
          author={post.author ?? { name: 'Unknown author' }}
          timestamp={post.timestamp}
        />
      )}
    </>
  );
}

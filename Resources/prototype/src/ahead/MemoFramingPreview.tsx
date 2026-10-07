/**
 * MemoFramingPreview — a memo attached to a post, previewed at whiteboard size.
 *
 * WHAT PRODUCTION WOULD GAIN
 * In the feed, a whiteboard attached to a post previews as a 16:9 box, but a
 * memo gets a fixed 128px strip (and a document an even shorter 112px one).
 * At that height a memo shows its title and maybe one line — not enough to
 * tell what it says before opening it. This gives the memo the whiteboard's
 * 16:9 box, so every "added to a post" preview is the same size and the memo
 * is actually readable in the feed.
 *
 * Documents get the same treatment without a new component: the prototype's
 * `PostCard` renders CRD's own `CalloutCollaboraPreview` at its `default` size
 * (already 16:9) instead of `compact`.
 *
 * WHY IT IS HERE AND NOT IN THE CARD
 * CRD's `PostCard` draws the memo preview inline with a hard-coded `h-32`, so
 * the prototype's `PostCard` wrapper hides it and renders this in the same
 * spot through `contributionsPreview`. The upstream ask is small: in
 * `PostCard`, `h-32` → `aspect-video` on the memo framing button, and
 * `size="compact"` → `size="default"` on the document framing preview.
 */
import { FileSignature, StickyNote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/crd/primitives/button';
import { CroppedMarkdown } from '@/crd/primitives/croppedMarkdown';

type MemoFramingPreviewProps = {
  markdown?: string;
  onOpen?: () => void;
  signedCopiesCount?: number;
  onOpenSignedCopies?: () => void;
};

export function MemoFramingPreview({
  markdown,
  onOpen,
  signedCopiesCount = 0,
  onOpenSignedCopies,
}: MemoFramingPreviewProps) {
  const { t } = useTranslation('crd-space');

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={event => {
          event.stopPropagation();
          onOpen?.();
        }}
        className="relative block w-full cursor-pointer overflow-hidden rounded-lg border border-border bg-muted/30 aspect-video text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {markdown ? (
          <div className="h-full p-4">
            <CroppedMarkdown content={markdown} maxHeight="100%" />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <StickyNote className="h-12 w-12 text-muted-foreground/50" aria-hidden="true" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-primary/10 transition-colors group-hover:bg-primary/20">
          <span className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 text-control text-secondary-foreground shadow-sm">
            {t('callout.openMemo')}
          </span>
        </div>
      </button>
      {signedCopiesCount > 0 && onOpenSignedCopies && (
        <div className="relative z-10 flex justify-end">
          <Button className="z-10 text-muted-foreground" type="button" variant="ghost" size="sm" onClick={onOpenSignedCopies}>
            <FileSignature aria-hidden="true" />
            {t('memo.signing.signedCopiesCount', { count: signedCopiesCount })}
          </Button>
        </div>
      )}
    </div>
  );
}

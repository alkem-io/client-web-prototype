/**
 * BandedResponseCards — memo, whiteboard and document response cards with a
 * solid title band instead of the blue gradient (product#2207).
 *
 * WHAT PRODUCTION WOULD GAIN
 * `ContributionMemoCard`, `ContributionWhiteboardCard` and
 * `ContributionDocumentCard` write their title and author in white on a
 * `bg-gradient-to-t from-primary/80` fade over the preview. It is one of the
 * last gradients on the platform, it tints the bottom of every whiteboard and
 * memo blue, and it reads unlike the Post response card next to it. This
 * replaces the fade with the design in
 * `src/mockups/artifacts/contribution-cards-no-gradient.html`:
 *
 *   · A solid band along the bottom in `bg-card` with a `border-t`: the title
 *     in `text-foreground`, the author in `text-muted-foreground`.
 *   · The memo's signed-copies button sits in the band as a plain ghost button
 *     instead of white-on-blue.
 *   · The hover wash (`bg-primary/40` + "Open …" button) is unchanged, but
 *     sits under the band, so the title stays readable while hovering.
 *   · Title and author use the Post response card's styles (`text-card-title`,
 *     `text-caption`), not the 10px letter-spaced `text-badge` the fade used.
 *   · All three cards are a fixed 200px tall. Production's whiteboard card
 *     takes its height from the image, so on wide screens it outgrows the
 *     collapsed grid's 220px window and the bottom of the card, now the title
 *     band, is cut off.
 *   · Props and behaviour are otherwise identical to production's.
 *
 * WHY IT IS HERE
 * The footer is not a slot on any of the three cards, so there is no way to
 * change it from outside. The upstream ask is simply to change the footer in
 * all three CRD cards. Graduates when production's cards lose the gradient —
 * a name check cannot see that, so `npm run sync:crd` will not flag it; check
 * `grep bg-gradient-to-t src/crd/components/contribution` after each sync.
 */
import { FileSignature, Presentation, StickyNote } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type CollaboraDocumentPreviewType, colorByType, iconByType } from '@/crd/lib/collaboraDocumentPreview';
import { cn } from '@/crd/lib/utils';
import { Button } from '@/crd/primitives/button';
import { CroppedMarkdown } from '@/crd/primitives/croppedMarkdown';

/** The solid title band — the one thing this file changes. */
function ResponseCardBand({ title, author, children }: { title: string; author?: string; children?: ReactNode }) {
  return (
    <div
      data-slot="response-card-band"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-2 border-t border-border bg-card px-3 py-2.5"
    >
      <div className="min-w-0">
        <p className="truncate text-card-title text-foreground">{title}</p>
        {author && <p className="truncate text-caption text-muted-foreground">{author}</p>}
      </div>
      {children}
    </div>
  );
}

/** Production's hover wash, unchanged. */
function OpenOverlay({ label, group }: { label: string; group: 'memo' | 'wb' | 'doc' }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 bg-primary/40',
        group === 'memo' && 'group-hover/memo:opacity-100',
        group === 'wb' && 'group-hover/wb:opacity-100',
        group === 'doc' && 'group-hover/doc:opacity-100'
      )}
    >
      <span className="inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground shadow-lg h-8 px-3 text-caption font-semibold">
        {label}
      </span>
    </div>
  );
}

type BandedMemoCardProps = {
  title: string;
  markdownContent?: string;
  author?: string;
  onClick?: () => void;
  signedCopiesCount?: number;
  onOpenSignedCopies?: () => void;
  className?: string;
};

export function BandedMemoCard({
  title,
  markdownContent,
  author,
  onClick,
  signedCopiesCount = 0,
  onOpenSignedCopies,
  className,
}: BandedMemoCardProps) {
  const { t } = useTranslation('crd-space');

  return (
    <div
      className={cn(
        'group/memo relative w-full rounded-lg overflow-hidden border border-border bg-card h-[200px] hover:ring-2 hover:ring-primary/50 transition-all',
        className
      )}
    >
      <button
        type="button"
        aria-label={t('callout.openAria', { title })}
        className="absolute inset-0 z-0 w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        onClick={onClick}
      />
      <div className="pointer-events-none w-full h-full p-4">
        {markdownContent ? (
          <CroppedMarkdown content={markdownContent} maxHeight="180px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <StickyNote className="w-8 h-8 text-muted-foreground/40" aria-hidden="true" />
          </div>
        )}
      </div>

      <OpenOverlay label={t('callout.openMemo')} group="memo" />

      <ResponseCardBand title={title} author={author}>
        {signedCopiesCount > 0 && onOpenSignedCopies && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="pointer-events-auto shrink-0 text-muted-foreground hover:text-foreground"
            onClick={onOpenSignedCopies}
          >
            <FileSignature aria-hidden="true" />
            {t('memo.signing.signedCopiesCount', { count: signedCopiesCount })}
          </Button>
        )}
      </ResponseCardBand>
    </div>
  );
}

type BandedWhiteboardCardProps = {
  title: string;
  previewUrl?: string;
  author?: string;
  onClick?: () => void;
  className?: string;
};

export function BandedWhiteboardCard({ title, previewUrl, author, onClick, className }: BandedWhiteboardCardProps) {
  const { t } = useTranslation('crd-space');

  return (
    <button
      type="button"
      className={cn(
        'group/wb relative w-full rounded-lg overflow-hidden border border-border bg-muted/30 h-[200px] cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-left',
        className
      )}
      onClick={onClick}
    >
      {previewUrl ? (
        <img
          src={previewUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/wb:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Presentation className="w-8 h-8 text-muted-foreground/40" aria-hidden="true" />
        </div>
      )}

      <OpenOverlay label={t('callout.openWhiteboard')} group="wb" />
      <ResponseCardBand title={title} author={author} />
    </button>
  );
}

type BandedDocumentCardProps = {
  title: string;
  documentType: CollaboraDocumentPreviewType;
  previewUrl?: string;
  author?: string;
  onClick?: () => void;
  className?: string;
};

export function BandedDocumentCard({
  title,
  documentType,
  previewUrl,
  author,
  onClick,
  className,
}: BandedDocumentCardProps) {
  const { t } = useTranslation('crd-space');
  const Icon = iconByType[documentType];
  const [loadedUrl, setLoadedUrl] = useState<string | undefined>(undefined);
  const [erroredUrl, setErroredUrl] = useState<string | undefined>(undefined);
  const showImage = Boolean(previewUrl) && previewUrl !== erroredUrl;
  const imageLoaded = showImage && previewUrl === loadedUrl;

  return (
    <button
      type="button"
      className={cn(
        'group/doc relative w-full rounded-lg overflow-hidden border border-border bg-muted/30 h-[200px] cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-left',
        className
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon className={cn('w-8 h-8', colorByType[documentType])} aria-hidden="true" />
        {showImage && (
          <img
            src={previewUrl}
            alt=""
            loading="lazy"
            className={cn('absolute inset-0 w-full h-full object-cover object-top', !imageLoaded && 'invisible')}
            onLoad={() => setLoadedUrl(previewUrl)}
            onError={() => setErroredUrl(previewUrl)}
          />
        )}
      </div>

      <OpenOverlay label={t('callout.openDocument')} group="doc" />
      <ResponseCardBand title={title} author={author} />
    </button>
  );
}

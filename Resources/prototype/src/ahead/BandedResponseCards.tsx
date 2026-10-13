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
 *   · A label strip along the bottom in the platform background
 *     (`bg-background`) with a `border-t`, since that colour is barely
 *     darker than the white card and the line is what separates it: the author's
 *     profile picture (initials when there is none), then the title in
 *     `text-foreground` and the author in `text-muted-foreground`. The strip
 *     and the picture make the label read as separate from the preview, so
 *     it never competes with a memo's own headings (option G in the mockup).
 *   · The memo preview is compact and dark (headings at card-title size,
 *     text at caption size, no blank row above the first heading) and is cut
 *     cleanly by the strip: no fade mask (CRD's `CroppedMarkdown` fades the
 *     bottom; this uses `MarkdownContent`).
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
 *   · Post responses have no preview, so the same label sits at the top
 *     instead (`BandedPostCard`): picture, title in `text-card-title`, then
 *     "author · date" in `text-caption text-muted-foreground`. Production's
 *     `ContributionPostCard` puts the title alone on top and a 20px avatar
 *     inline with the name below it.
 *   · Props and behaviour are otherwise identical to production's.
 *
 * WHY IT IS HERE
 * The footer is not a slot on any of the three cards, so there is no way to
 * change it from outside. The upstream ask is simply to change the footer in
 * all three CRD cards. Graduates when production's cards lose the gradient —
 * a name check cannot see that, so `npm run sync:crd` will not flag it; check
 * `grep bg-gradient-to-t src/crd/components/contribution` after each sync.
 */
import { FileSignature, MessageSquare, Presentation, StickyNote } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type CollaboraDocumentPreviewType, colorByType, iconByType } from '@/crd/lib/collaboraDocumentPreview';
import { cn } from '@/crd/lib/utils';
import { Button } from '@/crd/primitives/button';
import { CollapsibleTagList } from '@/crd/components/common/CollapsibleTagList';
import { MarkdownContent } from '@/crd/components/common/MarkdownContent';
import { Avatar, AvatarFallback, AvatarImage } from '@/crd/primitives/avatar';

/** Compact, dark memo text for the preview. `!` because CRD's own classes set these too. */
const MEMO_PREVIEW_CLASSES = cn(
  '[&>*:first-child]:mt-0!',
  '[&_h1]:text-card-title! [&_h2]:text-card-title! [&_h3]:text-card-title! [&_h4]:text-card-title!',
  '[&_h1]:mt-3! [&_h2]:mt-3! [&_h3]:mt-3! [&_h1]:mb-1! [&_h2]:mb-1! [&_h3]:mb-1!',
  '[&_p]:text-caption! [&_li]:text-caption! [&_p]:text-foreground! [&_li]:text-foreground!',
  '[&_p]:mb-2! [&_ul]:mb-2! [&_ol]:mb-2!'
);

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

/** The author's picture, initials when there is none. */
function AuthorAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  return (
    <Avatar className="size-8">
      {avatarUrl && <AvatarImage src={avatarUrl} alt="" />}
      <AvatarFallback className="bg-muted text-badge text-muted-foreground">{initialsOf(name)}</AvatarFallback>
    </Avatar>
  );
}

/** The solid title band — the one thing this file changes. */
function ResponseCardBand({
  title,
  author,
  authorAvatarUrl,
  children,
}: {
  title: string;
  author?: string;
  authorAvatarUrl?: string;
  children?: ReactNode;
}) {
  return (
    <div
      data-slot="response-card-band"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center gap-2.5 border-t border-border bg-background px-3 py-2.5"
    >
      {author && <AuthorAvatar name={author} avatarUrl={authorAvatarUrl} />}
      <div className="min-w-0 flex-1">
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
  /** The author's profile picture; initials show when it is missing. */
  authorAvatarUrl?: string;
  onClick?: () => void;
  signedCopiesCount?: number;
  onOpenSignedCopies?: () => void;
  className?: string;
};

export function BandedMemoCard({
  title,
  markdownContent,
  author,
  authorAvatarUrl,
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
      <div className="pointer-events-none w-full h-full overflow-hidden p-4">
        {markdownContent ? (
          // The memo at a compact size, in normal dark text: headings at card
          // title size, body text at caption size, and no top margin on the
          // first element (production's h2 margin left a blank row).
          <MarkdownContent content={markdownContent} className={MEMO_PREVIEW_CLASSES} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <StickyNote className="w-8 h-8 text-muted-foreground/40" aria-hidden="true" />
          </div>
        )}
      </div>

      <OpenOverlay label={t('callout.openMemo')} group="memo" />

      <ResponseCardBand title={title} author={author} authorAvatarUrl={authorAvatarUrl}>
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
  authorAvatarUrl?: string;
  onClick?: () => void;
  className?: string;
};

export function BandedWhiteboardCard({
  title,
  previewUrl,
  author,
  authorAvatarUrl,
  onClick,
  className,
}: BandedWhiteboardCardProps) {
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
      <ResponseCardBand title={title} author={author} authorAvatarUrl={authorAvatarUrl} />
    </button>
  );
}

type BandedDocumentCardProps = {
  title: string;
  documentType: CollaboraDocumentPreviewType;
  previewUrl?: string;
  author?: string;
  authorAvatarUrl?: string;
  onClick?: () => void;
  className?: string;
};

export function BandedDocumentCard({
  title,
  documentType,
  previewUrl,
  author,
  authorAvatarUrl,
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
      <ResponseCardBand title={title} author={author} authorAvatarUrl={authorAvatarUrl} />
    </button>
  );
}

type BandedPostCardProps = {
  title: string;
  author?: { name: string; avatarUrl?: string };
  createdDate?: string;
  description?: string;
  tags?: string[];
  commentCount?: number;
  onClick?: () => void;
  className?: string;
};

/** A post response: the same label as the cards above, at the top, since there is no preview. */
export function BandedPostCard({
  title,
  author,
  createdDate,
  description,
  tags,
  commentCount,
  onClick,
  className,
}: BandedPostCardProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: as production's ContributionPostCard, a <button> would nest the tag list's "+N" button and markdown links
    <div
      role="button"
      tabIndex={0}
      className={cn(
        'w-full text-left p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'flex flex-col',
        className
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {author && <AuthorAvatar name={author.name} avatarUrl={author.avatarUrl} />}
        <div className="min-w-0 flex-1">
          <p className="truncate text-card-title text-foreground">{title}</p>
          {author && (
            <p className="truncate text-caption text-muted-foreground">
              {author.name}
              {createdDate && <> · {createdDate}</>}
            </p>
          )}
        </div>
      </div>
      {description && (
        <div className="mt-3 max-h-[3.4rem] overflow-hidden">
          <MarkdownContent content={description} className="text-body text-muted-foreground line-clamp-2" />
        </div>
      )}
      <div className="flex items-center gap-1.5 mt-auto pt-2 min-w-0">
        {tags && tags.length > 0 && <CollapsibleTagList tags={tags} maxRows={1} className="flex-1 min-w-0" />}
        {commentCount !== undefined && commentCount > 0 && (
          <span className="flex items-center gap-1 text-caption text-muted-foreground ml-auto shrink-0">
            <MessageSquare className="w-3 h-3" aria-hidden="true" />
            {commentCount}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * A link or file response — `@/ahead/BandedResponseCards`' `BandedLinkCard`,
 * with edit / delete buttons that appear on hover.
 *
 * The prototype's emoji reactions on links are not shown: the card has the
 * same fixed size as memo and whiteboard cards, which have none either.
 * `reactionId` and `reactionsEnabled` are still accepted so callers compile.
 *
 * Website links get the site's own icon from a public icon service, worked out
 * from `url`. That is a prototype shortcut: production would need to store or
 * fetch the icon itself.
 */
import { Pencil, Trash2 } from 'lucide-react';
import { BandedLinkCard } from '@/ahead/BandedResponseCards';
import type { CollaboraDocumentPreviewType } from '@/crd/lib/collaboraDocumentPreview';

type ContributionLinkCardProps = {
  title: string;
  /** Accepted for call-site compatibility; the card shows the address instead. */
  description?: string;
  url?: string;
  isFile?: boolean;
  /** For files: "PDF · 2.4 MB". Links show their address instead. */
  fileInfo?: string;
  fileType?: CollaboraDocumentPreviewType;
  author?: string;
  authorAvatarUrl?: string;
  /** Identity for the reaction store; falls back to the title. */
  reactionId?: string;
  reactionsEnabled?: boolean;
  onClick?: () => void;
  className?: string;
};

const hostOf = (url?: string) => {
  if (!url) return undefined;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return undefined;
  }
};

export function ContributionLinkCard({
  title,
  url,
  isFile,
  fileInfo,
  fileType,
  author,
  authorAvatarUrl,
  onClick,
  className,
}: ContributionLinkCardProps) {
  const host = isFile ? undefined : hostOf(url);

  return (
    <div className="group/linkcard relative">
      <BandedLinkCard
        title={title}
        source={isFile ? fileInfo : host}
        isFile={isFile}
        fileType={fileType}
        iconUrl={host ? `https://www.google.com/s2/favicons?domain=${host}&sz=64` : undefined}
        author={author}
        authorAvatarUrl={authorAvatarUrl}
        href={url}
        onClick={onClick}
        className={className}
      />
      <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-md bg-card opacity-0 shadow-sm transition-opacity group-hover/linkcard:opacity-100 focus-within:opacity-100">
        <button
          type="button"
          aria-label="Edit link"
          className="size-7 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <Pencil className="size-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Delete link"
          className="size-7 flex items-center justify-center rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

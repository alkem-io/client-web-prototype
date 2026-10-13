/**
 * TitleFirstPostHeader — a post's header with the title first and the author
 * underneath, beside the author's picture.
 *
 * WHAT PRODUCTION WOULD GAIN
 * Production's `PostCard` leads with the publisher: avatar, the author's name
 * in `text-card-title`, "• 2 days ago", and only then the post title on its
 * own line below. In a feed of posts by the same few people, the bold name is
 * the first thing read on every card, and the title, the thing that tells you
 * what the post is about, comes second. This flips it, matching the label on
 * response cards (`BandedResponseCards`):
 *
 *   · The avatar stays on the left, now beside the title.
 *   · The title is on top, in the same `text-subsection-title` as today.
 *   · The author and time sit below it in `text-caption text-muted-foreground`
 *     ("Michael Chang · 1 day ago"), with the role and draft badges after.
 *   · Posts with `showPublishDetails: false` keep their chrome-free header.
 *
 * WHY IT IS SPLIT LIKE THIS
 * `PostCard` draws its header itself, with no slot. The upstream ask is a
 * header layout option on `PostCard` (or this as its default). Until then the
 * prototype turns on `showPublishDetails: false`, which already moves CRD's
 * title into the header, and a stand-in places these two pieces around it
 * (`app/components/shared/TitleFirstHeaderStandIn`, not part of the ask).
 */
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/crd/primitives/avatar';
import { Badge } from '@/crd/primitives/badge';

type PostAuthor = { name: string; avatarUrl?: string; profileUrl?: string; role?: string };

/** The author's picture, left of the title. */
export function PostHeaderAvatar({ author }: { author: PostAuthor }) {
  const avatar = (
    <Avatar className="w-10 h-10 border border-border">
      {author.avatarUrl && <AvatarImage src={author.avatarUrl} alt={author.name} />}
      <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
  if (!author.profileUrl) return avatar;
  return (
    <a
      href={author.profileUrl}
      onClick={(e) => e.stopPropagation()}
      aria-label={author.name}
      className="block rounded-full -m-0.5 p-0.5 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {avatar}
    </a>
  );
}

/** The subtle line under the title: author · time, then any badges. */
export function PostHeaderByline({
  author,
  timestamp,
  isDraft,
}: {
  author: PostAuthor;
  timestamp?: string;
  isDraft?: boolean;
}) {
  const { t } = useTranslation('crd-space');
  return (
    <div className="flex min-w-0 items-center gap-2 text-caption text-muted-foreground">
      <span className="truncate">
        {author.profileUrl ? (
          <a
            href={author.profileUrl}
            onClick={(e) => e.stopPropagation()}
            className="rounded-sm hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {author.name}
          </a>
        ) : (
          author.name
        )}
        {timestamp && <> · {timestamp}</>}
      </span>
      {author.role && (
        <Badge variant="secondary" className="text-badge h-5 px-1.5 font-normal shrink-0">
          {author.role}
        </Badge>
      )}
      {isDraft && (
        <Badge className="text-badge h-5 px-1.5 font-semibold bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-100 shrink-0">
          {t('callout.draft')}
        </Badge>
      )}
    </div>
  );
}

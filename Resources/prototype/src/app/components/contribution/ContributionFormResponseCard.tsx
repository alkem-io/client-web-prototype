/**
 * ContributionFormResponseCard — a form response rendered as a contribution.
 *
 * Epic #2005 frames each answer set as "a post-like contribution to the
 * callout", so this matches ContributionPostCard's shape and h-[180px] exactly
 * and drops into the same ContributionGrid.
 */
import { ClipboardList } from 'lucide-react';
import { cn } from '@/crd/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/crd/primitives/avatar';
import { Badge } from '@/crd/primitives/badge';
import { ReactionBar } from '@/app/components/space/PostReactions';

type ContributionFormResponseCardProps = {
  author: { name: string; avatarUrl?: string };
  /** Preformatted for display — the card does no date maths. */
  submittedDate?: string;
  /** First non-empty answer, used as the card's snippet. */
  snippet?: string;
  answerCount: number;
  /** Marks the viewer's own response — the one they always see regardless of visibility. */
  isOwn?: boolean;
  /** Identity for the reaction store; falls back to the author and date. */
  reactionId?: string;
  reactionsEnabled?: boolean;
  onClick?: () => void;
  className?: string;
};

export function ContributionFormResponseCard({
  author,
  submittedDate,
  snippet,
  answerCount,
  isOwn,
  reactionId,
  reactionsEnabled = true,
  onClick,
  className
}: ContributionFormResponseCardProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: matches ContributionPostCard, which avoids <button> to keep nested interactive elements valid
    <div
      role="button"
      tabIndex={0}
      className={cn(
        'w-full text-left p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'flex flex-col min-h-[180px]',
        isOwn && 'border-primary/40',
        className
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center gap-2 min-w-0">
        <Avatar className="w-5 h-5 shrink-0">
          {author.avatarUrl && <AvatarImage src={author.avatarUrl} alt={author.name} />}
          <AvatarFallback className="text-badge">{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="text-card-title text-foreground truncate">{author.name}</span>
        {isOwn && (
          <Badge variant="secondary" className="text-badge shrink-0 ml-auto">
            Your response
          </Badge>
        )}
      </div>

      {submittedDate && (
        <span className="text-caption text-muted-foreground mt-1.5">{submittedDate}</span>
      )}

      {snippet && (
        <div className="mt-2 max-h-[3.4rem] overflow-hidden">
          <p className="text-body text-muted-foreground line-clamp-2">{snippet}</p>
        </div>
      )}

      <div className="flex items-center gap-1.5 mt-auto pt-[10px] min-w-0">
        <span className="flex items-center gap-1 text-caption text-muted-foreground">
          <ClipboardList className="w-3 h-3" aria-hidden="true" />
          {answerCount} {answerCount === 1 ? 'answer' : 'answers'}
        </span>
      </div>
      {reactionsEnabled && (
        <div className="mt-2.5 pt-2.5 border-t border-border/60">
          <ReactionBar id={reactionId ?? `form-response:${author.name}:${submittedDate ?? ''}`} />
        </div>
      )}
    </div>
  );
}

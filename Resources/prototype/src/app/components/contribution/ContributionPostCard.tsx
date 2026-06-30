import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

type ContributionPostCardProps = {
  title: string;
  author?: { name: string; avatarUrl?: string };
  createdDate?: string;
  description?: string;
  tags?: string[];
  commentCount?: number;
  onClick?: () => void;
  className?: string;
};

export function ContributionPostCard({
  title,
  author,
  createdDate,
  description,
  tags,
  commentCount,
  onClick,
  className,
}: ContributionPostCardProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        'w-full text-left p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors cursor-pointer flex flex-col',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <p className="text-body-emphasis text-foreground truncate">{title}</p>
      {author && (
        <div className="flex items-center gap-2 mt-1.5">
          {author.avatarUrl && (
            <img
              src={author.avatarUrl}
              alt={author.name}
              className="w-5 h-5 rounded-full"
            />
          )}
          <span className="text-caption text-muted-foreground">{author.name}</span>
          {createdDate && <span className="text-caption text-muted-foreground">• {createdDate}</span>}
        </div>
      )}
      {description && (
        <div className="mt-2 max-h-[3.4rem] overflow-hidden">
          <p className="text-body text-muted-foreground line-clamp-2">{description}</p>
        </div>
      )}
      <div className="flex items-center gap-1.5 mt-auto pt-2 min-w-0">
        {tags && tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {tags.map((tag) => (
              <span key={tag} className="text-badge px-1.5 py-0.5 bg-muted text-muted-foreground rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}
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

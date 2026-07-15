import { ExternalLink, FileText, Link2, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ContributionLinkCardProps = {
  title: string;
  description?: string;
  url?: string;
  isFile?: boolean;
  author?: string;
  onClick?: () => void;
  className?: string;
};

export function ContributionLinkCard({
  title,
  description,
  url,
  isFile,
  author,
  onClick,
  className,
}: ContributionLinkCardProps) {
  const Icon = isFile ? FileText : ExternalLink;

  return (
    <div
      className={cn(
        'group/link flex items-center gap-3 w-full p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors',
        className
      )}
    >
      <div className="size-9 rounded-md bg-muted/60 flex items-center justify-center shrink-0">
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body-emphasis text-foreground truncate">{title}</p>
        {description && (
          <p className="text-caption text-muted-foreground truncate mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity">
        <button className="size-8 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <Pencil className="size-4" aria-hidden="true" />
        </button>
        <button className="size-8 flex items-center justify-center rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

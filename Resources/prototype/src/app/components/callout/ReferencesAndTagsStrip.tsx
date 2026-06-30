import { ExternalLink, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ReferencesAndTagsStripReference = {
  id: string;
  name: string;
  uri: string;
  description?: string;
  isFile?: boolean;
};

type ReferencesAndTagsStripProps = {
  references?: ReferencesAndTagsStripReference[];
  tags?: string[];
  className?: string;
};

export function ReferencesAndTagsStrip({ references, tags, className }: ReferencesAndTagsStripProps) {
  const hasReferences = (references?.length ?? 0) > 0;
  const hasTags = (tags?.length ?? 0) > 0;
  if (!hasReferences && !hasTags) return null;

  return (
    <div className={cn('space-y-2 mt-3', className)}>
      {hasReferences && (
        <ul role="list" className="space-y-1.5">
          {references?.map(ref => (
            <li key={ref.id}>
              <a
                href={ref.uri}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center gap-1.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  ref.isFile
                    ? 'text-body-emphasis px-2 py-1 bg-muted/60 border border-border/50 text-foreground hover:bg-muted hover:border-border transition-colors'
                    : 'text-body-emphasis text-primary hover:underline'
                )}
                title={ref.description || ref.name}
              >
                {ref.isFile ? (
                  <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                ) : (
                  <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
                )}
                <span>{ref.name}</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      {hasTags && (
        <div className="flex gap-2 flex-wrap">
          {tags?.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/40 border border-border text-caption font-medium text-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

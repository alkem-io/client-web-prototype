import { useState } from 'react';
import { Button } from '@/app/components/ui/button';

type ExpandableMarkdownProps = {
  content: string;
  maxLines?: number;
  defaultExpanded?: boolean;
  surface?: 'card' | 'background';
  expandLabel?: string;
  collapseLabel?: string;
  className?: string;
};

export function ExpandableMarkdown({
  content,
  maxLines = 3,
  defaultExpanded = false,
  expandLabel = 'Read more',
  collapseLabel = 'Read less',
}: ExpandableMarkdownProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Simple line count estimate
  const lines = content.split('\n').length;
  const shouldClamp = lines > maxLines;

  const clampedHeight = `calc(${maxLines} * 1.625 * 0.875rem)`;

  if (!shouldClamp) {
    return <p className="text-body text-foreground whitespace-pre-wrap mb-3">{content}</p>;
  }

  return (
    <div className="space-y-2 mb-3">
      <div
        style={{
          maxHeight: isExpanded ? 'none' : clampedHeight,
          overflow: 'hidden',
          transition: 'max-height 0.2s ease-in-out',
        }}
      >
        <p className="text-body text-foreground whitespace-pre-wrap">{content}</p>
      </div>
      {!isExpanded && (
        <div className="absolute inset-x-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none" />
      )}
      <Button
        variant="link"
        size="sm"
        className="h-auto p-0 text-primary"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? collapseLabel : `… ${expandLabel}`}
      </Button>
    </div>
  );
}
